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
        input: false, 
      },
      isPremium: {
        type: "boolean",
        defaultValue: false,
        input: false, 
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false, 
      },
    },
  },

  session: {
    strategy: "jwt", 
    expiresIn: 60 * 60 * 24 * 30, 
    updateAge: 60 * 60 * 24,    
    
    cookieCache: {
      enabled: true, 
      maxAge: 60 * 5, 
    }
  },
  
  plugins: [
    jwt()
  ]
});