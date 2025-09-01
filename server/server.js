import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express(); // Initialize Express Application
const port = process.env.PORT || 4000; //Server Port

//Root Endpoint to check API Status
app.get("/", (req, res) => {
  res.send("API successfully connected");
});

// Start The server
app.listen(port, () =>
  console.log(`server is running at http://localhost:${port} `)
);
