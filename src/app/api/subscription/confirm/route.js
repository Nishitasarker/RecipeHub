import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MongoClient } from "mongodb"; 

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Invalid/Missing environment variable: "STRIPE_SECRET_KEY"');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!process.env.MONGO_DB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_DB_URI"');
}
const uri = process.env.MONGO_DB_URI;
let client = new MongoClient(uri);
let clientPromise = client.connect();

export async function POST(request) {
  try {
    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const userEmail = session.customer_details?.email;
      const amount = session.amount_total / 100;

      if (!userEmail) {
        return NextResponse.json({ error: "User email not found" }, { status: 400 });
      }

      const dbClient = await clientPromise;
      const db = dbClient.db(process.env.AUTH_DB_NAME);

      const purchaseType = session.metadata?.purchaseType;
      const recipeId = session.metadata?.recipeId;

      // ====================================================
      // কন্ডিশন ক: সিঙ্গেল রেসিপি ক্রয়ের জন্য ($4.99)
      // ====================================================
      if (purchaseType === "single_recipe") {
        
        // 'purchased_recipes' কালেকশনে ডেটা পুশ হচ্ছে যা ডিটেইলস পেজে রিড হবে
        await db.collection("purchased_recipes").updateOne(
          { transactionId: session_id },
          {
            $setOnInsert: {
              userEmail: userEmail,
              recipeId: recipeId,
              amount: amount,
              transactionId: session_id,
              paymentStatus: "paid",
              paidAt: new Date()
            }
          },
          { upsert: true }
        );

        return NextResponse.json({ 
          success: true, 
          message: "Recipe purchased successfully! Instructions unlocked.", 
          type: "recipe",
          recipeId: recipeId 
        });
      }

      // ====================================================
      // কন্ডিশন খ: প্রিমিয়াম মেম্বারশিপ আপগ্রেড ($19.99) 
      // ====================================================
      else {
        await db.collection("payments").updateOne(
          { transactionId: session_id },
          {
            $setOnInsert: {
              userEmail: userEmail,
              amount: amount,
              transactionId: session_id,
              paymentStatus: "paid",
              paidAt: new Date()
            }
          },
          { upsert: true }
        );

        // এটি ডক অনুযায়ী ইউজারকে আনলিমিটেড অ্যাড রেসিপি লিমিট দিবে, কিন্তু সিঙ্গেল রেসিপি লক খুলবে না
        await db.collection("user").updateOne(
          { email: userEmail },
          { $set: { isPremium: true } }
        );

        return NextResponse.json({ 
          success: true, 
          message: "Premium membership activated successfully!", 
          type: "membership" 
        });
      }
    }

    return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
  } catch (err) {
    console.error("Confirm API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}