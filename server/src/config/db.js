import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    try {
  await mongoose.connection
    .collection("users")
    .dropIndex("googleId_1");

  console.log("Old googleId index deleted");
} catch (err) {
  console.log("Index already removed");
}

    console.log("MongoDB connected to:", conn.connection.host);
    console.log("Database:", conn.connection.name);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
 
export default connectDB;