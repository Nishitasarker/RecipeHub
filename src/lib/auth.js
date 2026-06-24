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

  // 🎯 ভুল/অকার্যকর "model" ব্লক রিমুভ করা হলো — actual collection নাম default singular "user" ই থাকছে (ছবিতে কনফার্ম করা)
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

  session :{
    cookieCache: {
      enabled:false,
      strategy:"jwt",
      maxAge: 60 * 5,
    }
  },
  plugins: [
    jwt()
  ]
});