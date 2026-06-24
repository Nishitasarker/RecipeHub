import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
   plugins: [jwtClient()]
});

// 🎯 আলাদা createAuthClient() কল না করে, একই authClient instance থেকে destructure
export const { signIn, signUp, signOut, useSession } = authClient;