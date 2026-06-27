import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },


  socialProviders:{
    google:{
         clientId: process.env.GOOGLE_CLIENTID,
         clientSecret: process.env.GOOGLE_SECRET,
    },
  },

   database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false, // 🎯 যুক্ত করা হলো — ইউজার নিজে এটা পরিবর্তন করতে পারবে না
      },
      isPremium: {
        type: "boolean",
        defaultValue: false,
        input: false, // 🎯 যুক্ত করা হলো — শুধু server-side কোড (Stripe confirm route) এটা সেট করতে পারবে
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false, // 🎯 যুক্ত করা হলো
      },
    },
  },

  session: {
    strategy: "jwt", 
    expiresIn: 60 * 60 * 24 * 30, // 🟢 সেশনের মেয়াদ ৩০ দিন (১ মাস) করা হলো
    updateAge: 60 * 60 * 24,    // প্রতিদিন ব্যাকএন্ড সেশনের অ্যাক্টিভিটি চেক/আপডেট করবে
    
    cookieCache: {
      enabled: true, 
      maxAge: 60 * 5, 
    }
  },
  
  plugins: [
    jwt()
  ]
});