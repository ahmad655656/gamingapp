// lib/mongodb.js
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI; // ضع رابط MongoDB هنا

if (!MONGO_URI) {
  throw new Error("يرجى تعريف MONGO_URI في .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
