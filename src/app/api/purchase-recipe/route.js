import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Invalid/Missing environment variable: "STRIPE_SECRET_KEY"');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, recipeId, recipeName, price, email, purchaseType } = body;

    // ==========================================
    // 🎯 লজিক ১: পেমেন্ট ভেরিফিকেশন (যদি session_id পাঠানো হয়)
    // ==========================================
    if (session_id) {
      // স্ট্রাইপ থেকে সেশন রিট্রিভ করা
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === "paid") {
        const userEmail = session.customer_email || session.customer_details?.email;
        const targetRecipeId = session.metadata?.recipeId;
        const targetPurchaseType = session.metadata?.purchaseType;

        // 🔥 অত্যন্ত গুরুত্বপূর্ণ: এক্সপ্রেস ব্যাকএন্ডে (Port 5000) ডাটাবেজে সেভ করার জন্য হিট করা
        const backendResponse = await fetch(`http://localhost:5000/api/save-purchase`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            recipeId: targetRecipeId,
            purchaseType: targetPurchaseType,
            sessionId: session_id,
          }),
        });

        const backendData = await backendResponse.json();

        if (!backendResponse.ok) {
          return NextResponse.json(
            { error: backendData.message || "Failed to save purchase to Express backend." },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true });
      }

      return NextResponse.json({ success: false, error: "Payment not completed yet." }, { status: 400 });
    }

    // ==========================================
    // 🎯 লজিক ২: স্ট্রাইপ সেশন ক্রিয়েশন (চেকআউট ইনিশিয়েট করা)
    // ==========================================
    if (!email) {
      return NextResponse.json({ error: "User email is required." }, { status: 400 });
    }

    const isSingleRecipe = purchaseType === "single_recipe";

    if (isSingleRecipe && !recipeId) {
      return NextResponse.json({ error: "Recipe ID is required for single recipe purchase." }, { status: 400 });
    }

    const successUrl = isSingleRecipe
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/browseRecipes/${recipeId}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/profile?payment_success=true&session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = isSingleRecipe
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/browseRecipes/${recipeId}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/profile`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: recipeName || "Premium Membership Upgrade",
              description: isSingleRecipe
                ? `Full access to the premium recipe: ${recipeName}`
                : "Unlimited recipe posts and premium features badge.",
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        recipeId: isSingleRecipe ? recipeId : "",
        purchaseType: purchaseType || "membership",
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("Recipe Stripe Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong inside Next.js API" },
      { status: 500 }
    );
  }
}