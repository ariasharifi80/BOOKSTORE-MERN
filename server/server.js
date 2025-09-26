// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
await connectCloudinary();

import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import postRouter from "./routes/postRoute.js";
async function startServer() {
  // 1. Connect to MongoDB
  try {
    console.log("Connecting to MongoDB…");
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }

  // 2. Connect to Cloudinary
  try {
    console.log("Initializing Cloudinary…");
    await connectCloudinary();
    console.log("✅ Cloudinary connected");
  } catch (err) {
    console.error("❌ Cloudinary initialization error:", err);
    process.exit(1);
  }

  // 3. Create Express app
  const app = express();
  const port = process.env.PORT || 4000;

  // 4. Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: ["http://localhost:5173"], // adjust as needed
      credentials: true,
    })
  );

  // 5. API Routes
  app.use("/api/user", userRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/product", productRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/address", addressRouter);
  app.use("/api/order", orderRouter);

  app.use("/api/posts", postRouter);

  // 6. Health-check endpoint
  app.get("/", (req, res) => {
    res.send("API successfully connected");
  });

  // 7. Start server
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}

// Kick off the server
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
