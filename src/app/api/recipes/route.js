import { NextResponse } from "next/server";
import { MongoClient } from "mongodb"; // 🎯 সরাসরি মঙ্গোডিবি ড্রাইভার ইম্পোর্ট করা হলো

// সরাসরি এই ফাইলের ভেতরেই মঙ্গোডিবি ক্লায়েন্ট সেটআপ (যেমনটা স্ট্রাইপ ফাইলে করেছেন)
if (!process.env.MONGO_DB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_DB_URI"');
}

const uri = process.env.MONGO_DB_URI;
let client = new MongoClient(uri);
let clientPromise = client.connect();

export async function POST(request) {
  try {
    // ১. মঙ্গোডিবি ডাটাবেজ কানেক্ট করা (সরাসরি এই ফাইলের প্রমিস থেকে)
    const dbClient = await clientPromise;
    const db = dbClient.db(process.env.AUTH_DB_NAME || "last_project_db"); // আপনার ডাটাবেজের নাম

    // ২. ফ্রন্টএন্ড থেকে পাঠানো পেলোড (Payload) রিসিভ করা
    const body = await request.json();
    
    // ৩. রিকোয়ারমেন্ট অনুযায়ী অবজেক্ট স্ট্রাকচার তৈরি (আপনার চাওয়া স্কিমা অনুযায়ী)
    const newRecipe = {
      ...body,
      likesCount: 0,
      isFeatured: false,
      status: "pending", // এডমিন অ্যাপ্রুভালের জন্য
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // ৪. আপনার চাওয়া 'recipes' কালেকশনে ডাটা ইনসার্ট করা
    const result = await db.collection("recipes").insertOne(newRecipe);

    // ৫. সাকসেস রেসপন্স পাঠানো
    return NextResponse.json({ 
      success: true, 
      message: "Recipe stored successfully!", 
      insertedId: result.insertedId 
    }, { status: 201 });

  } catch (error) {
    console.error("Database Insert Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Failed to store recipe." 
    }, { status: 500 });
  }
}