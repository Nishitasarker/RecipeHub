import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, { client }),
  user: {
    additionalFields: {
      role: {
        type: "string",        // টাইপ অবশ্যই বলে দিতে হবে
        defaultValue: "user"   // রিকোয়ারমেন্ট অনুযায়ী ছোট হাতের "user"
      }, 
      isPremium: {             // plan-এর জায়গায় রিকোয়ারমেন্ট অনুযায়ী isPremium
        type: "boolean",
        defaultValue: false    // ডিফল্টভাবে সে প্রিমিয়াম নয় (false)
      },
      isBlocked: {             // অ্যাডমিন প্যানেলের জন্য এটিও অ্যাড করে রাখা ভালো
        type: "boolean",
        defaultValue: false
      }
    }
  }
});