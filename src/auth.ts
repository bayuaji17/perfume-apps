import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import * as z from "zod";

const signInScheme = z.object({
  email: z.string().email({ message: "please enter a valid email address" }),
  password: z.string(),
});
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validateFields = signInScheme.safeParse(credentials);
        if (!validateFields.success) {
          return null;
        }
        if (!credentials) return null;
        const { email, password } = validateFields.data;
        const adminEmail = process.env.ADMIN_EMAIL;
        const passwordEmail = process.env.ADMIN_PASSWORD;
        if (email === adminEmail && password === passwordEmail) {
          return { id: "admin", email: adminEmail };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin",
  },
});
