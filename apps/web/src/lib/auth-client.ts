import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // biome-ignore lint/style/useNamingConvention: <explanation>
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});
