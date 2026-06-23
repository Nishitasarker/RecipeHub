import { NextResponse } from "next/server";
import Stripe from "stripe";

// এনভায়রনমেন্ট ভেরিয়েবল থেকে স্ট্রাইপ সিক্রেট কি চেক করা
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Invalid/Missing environment variable: "STRIPE_SECRET_KEY"');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // ১. ফ্রন্টএন্ড রিকোয়েস্ট বডি থেকে ডেটা নেওয়া
    const body = await request.json();
    const { email } = body;

    // ২. ইমেইল ভ্যালিডেশন চেক (ইমেইল না থাকলে ৪০০ এরর দিবে)
    if (!email) {
      return NextResponse.json(
        { error: "User email is required to initiate payment." }, 
        { status: 400 }
      );
    }

    // ৩. স্ট্রাইপ চেকআউট সেশন তৈরি করা (Lifetime Access - $19.99)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email, // ইউজারের ইমেইলটি স্ট্রাইপ পেমেন্ট পেজে অটো-ফিল হয়ে থাকবে
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "RecipeHub Premium Membership",
              description: "Unlock unlimited recipe uploads, exclusive VIP badge, and priority feed placement for lifetime!",
            },
            unit_amount: 1999, // ১৯.৯৯ ডলার (স্ট্রাইপ সেন্ট হিসেবে হিসাব করে, তাই ১৯.৯৯ * ১০০ = ১৯৯৯)
          },
          quantity: 1,
        },
      ],
      mode: "payment", // ওয়ান-টাইম পেমেন্টের জন্য 'payment' মোড
      
      // 🎯 পাথ পরিবর্তন করে আপনার 'app/success/page.jsx' অনুযায়ী '/success' করা হলো
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      
      // পেমেন্ট ক্যানসেল করলে বা ব্যাক করলে আবার প্রোফাইল পেজে ফিরিয়ে নিয়ে যাবে
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/user/profile`,
    });

    // ৪. তৈরি হওয়া স্ট্রাইপ সেশন ইউআরএলটি ফ্রন্টএন্ডে রেসপন্স হিসেবে পাঠানো
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("Stripe Session Creation Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong while creating checkout session." }, 
      { status: 500 }
    );
  }
}