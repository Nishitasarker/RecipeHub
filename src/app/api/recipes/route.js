import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { auth } from "@/lib/auth"; // 🎯 আপনার better-auth এর মেইন সার্ভার কনফিগ ফাইল
import { headers } from "next/headers";

if (!process.env.MONGO_DB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_DB_URI"');
}

const uri = process.env.MONGO_DB_URI;
let client = new MongoClient(uri);
let clientPromise = client.connect();

export async function POST(request) {
  try {
    // 🎯 ১. Better Auth দিয়ে পাঠানো টোকেন/সেশন ভেরিফাই করা
    const session = await auth.api.getSession({
      headers: await headers() // এটি হেডার থেকে অটোমেটিক Bearer টোকেন রিড করবে
    });

    // সেশন না থাকলে রিকোয়েস্ট রিজেক্ট করে দেওয়া
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized! Please log in first." 
      }, { status: 401 });
    }

    // ২. মঙ্গোডিবি ডাটাবেজ কানেক্ট করা
    const dbClient = await clientPromise;
    const db = dbClient.db(process.env.AUTH_DB_NAME || "last_project_db");

    // ৩. ফ্রন্টএন্ড থেকে পাঠানো পেলোড (Payload) রিসিভ করা
    const body = await request.json();
    
    // ৪. অবজেক্ট স্ট্রাকচার তৈরি এবং ব্যাকএন্ড সিকিউরিটির জন্য সেশন থেকে ইউজার আইডি নেওয়া
    const newRecipe = {
      ...body,
      authorId: session.user.id, // সিকিউরিটির জন্য সেশনের আইডি ব্যবহার করা ভালো
      likesCount: 0,
      isFeatured: false,
      status: "pending", 
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // ৫. 'recipes' কালেকশনে ডাটা ইনসার্ট করা
    const result = await db.collection("recipes").insertOne(newRecipe);

    // ৬. সাকসেস রেসপন্স পাঠানো
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