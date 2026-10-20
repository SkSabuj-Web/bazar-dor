
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import clientPromise from "@/lib/mongodb";

const client = await clientPromise;
const db = client.db("bazar_dor");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  baseURL:
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000",

  trustedOrigins: [
    "http://localhost:3000",
    "https://bazar-dor-lroe.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
});
