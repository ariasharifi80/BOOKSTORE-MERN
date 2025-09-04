import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import productRouter from "./routes/productRoute.js";
import CartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express(); // Initialize Express Application
const port = process.env.PORT || 4000; //Server Port

await connectDB(); // Establish Connection to the database
await connectCloudinary(); // Setup Cloudinary for image Storage

//Allow multiple origins
const allowedOrigins = ["http://localhost:5173"];

//Middleware setup
app.use(express.json()); // Enables JSON request body parsing
app.use(cookieParser()); //Cookie-parser middleware to parse HTTP request cookies
app.use(
  cors({
    origin: allowedOrigins, // Whitelist of allowed domains
    credentials: true, // Require for cookies/authorization Headers
  })
);
//Define API routes
app.use("/api/user", userRouter); // Routes for user-related operations
app.use("/api/admin", adminRouter); // Routes for admin-related operations
app.use("/api/product", productRouter); // Routes for product-related operations
app.use("/api/cart", CartRouter); // Routes for cart-related operations
app.use("/api/address", addressRouter); // Routes for address-related operations
app.use("/api/order", orderRouter); // Routes for order-related operations

//Root Endpoint to check API Status
app.get("/", (req, res) => {
  res.send("API successfully connected");
});

// Start The server
app.listen(port, () =>
  console.log(`server is running at http://localhost:${port} `)
);
