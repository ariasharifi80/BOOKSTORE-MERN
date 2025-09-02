import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/mongodb.js";

const app = express(); // Initialize Express Application
const port = process.env.PORT || 4000; //Server Port

await connectDB(); // Establish Connection to the database

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

//Root Endpoint to check API Status
app.get("/", (req, res) => {
  res.send("API successfully connected");
});

// Start The server
app.listen(port, () =>
  console.log(`server is running at http://localhost:${port} `)
);
