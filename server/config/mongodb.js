import mongoose, { mongo, Mongoose } from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/AriaBook`);
    console.log("✔️ Database Connected");
  } catch (error) {
    console.log("❌️ Database connection failed: ", error.message);
  }
};

export default connectDB;
