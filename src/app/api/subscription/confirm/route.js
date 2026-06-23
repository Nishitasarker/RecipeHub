import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MongoClient } from "mongodb"; // 🎯 সরাসরি মঙ্গোডিবি ড্রাইভার ইম্পোর্ট করা হলো

// স্ট্রাইপ সিক্রেট কি চেক করা
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Invalid/Missing environment variable: "STRIPE_SECRET_KEY"');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// সরাসরি এই ফাইলের ভেতরেই মঙ্গোডিবি ক্লায়েন্ট সেটআপ (কোনো এক্সটার্নাল ফাইলের দরকার নেই)
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

    // ১. স্ট্রাইপ থেকে পেমেন্ট সেশন রিড করা
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const userEmail = session.customer_details?.email;
      const amount = session.amount_total / 100;

      if (!userEmail) {
        return NextResponse.json({ error: "User email not found" }, { status: 400 });
      }

      // ২. মঙ্গোডিবি ডাটাবেজ কানেক্ট করা (সরাসরি এই ফাইলের প্রমিস থেকে)
      const dbClient = await clientPromise;
      const db = dbClient.db(process.env.AUTH_DB_NAME); // 🎯 আপনার ডাটাবেজের নাম

      // ৩. 'payments' কালেকশনে ডাটা স্টোর করা
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
        { upsert: true } // ডুপ্লিকেট এন্ট্রি প্রতিরোধ করতে ওয়ান-টাইম ইনসার্ট
      );

      // 🎯 ৪. Better Auth এর 'users' কালেকশনে ইউজারের isPremium ফিল্ড true করা
      await db.collection("user").updateOne(
        { email: userEmail },
        { $set: { isPremium: true } }
      );

      return NextResponse.json({ success: true, message: "Upgraded successfully!" });
    }

    return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
  } catch (err) {
    console.error("Confirm API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}