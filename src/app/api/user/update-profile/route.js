import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// আপনার .env ফাইল অনুযায়ী সঠিক ভেরিয়েবল নেম
const uri = process.env.MONGO_DB_URI;
const dbName = process.env.AUTH_DB_NAME;

export async function PUT(request) {
  let client;
  try {
    const { userId, name, image } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!uri) {
      return NextResponse.json({ error: "MONGO_DB_URI is missing in .env" }, { status: 500 });
    }

    // মঙ্গোডিবি কানেক্ট করা
    client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    // ডাইনামিক আপডেট অবজেক্ট
    const updateData = {};
    if (name && name.trim() !== "") updateData.name = name;
    if (image && image.trim() !== "") updateData.image = image;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No changes to update" }, { status: 400 });
    }

    // Better Auth ডিফল্টভাবে কালেকশনের নাম "user" রাখে।
    // আইডি স্ট্রিং হিসেবে সেভ হয়, তাই ObjectId() এর প্রয়োজন নেই।
    const result = await db.collection("user").updateOne(
      { _id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("MongoDB Update Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}