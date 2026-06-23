import { createAuthClient } from "better-auth/react";

// 🎯 একটাই instance — আগে দুইবার createAuthClient() কল হচ্ছিল, এখন একবার
export const authClient = createAuthClient({
  // 🎯 NEXT_PUBLIC_ prefix ছাড়া env variable browser-এ undefined হয়ে যায়
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// 🎯 আলাদা createAuthClient() কল না করে, একই authClient instance থেকে destructure
export const { signIn, signUp, signOut, useSession } = authClient;