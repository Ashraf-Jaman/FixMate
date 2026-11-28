import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client = globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

// Initialize MongoDB connection
client.connect().catch((error) => {
  console.error("MongoDB connection error:", error);
});

const db = client.db("fix-mate");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, {
    transaction: false,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },

      phone: {
        type: "string",
        required: false,
        input: true,
      },

      specialty: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});

export type Auth = typeof auth;