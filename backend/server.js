import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";

import authRouter from "./routes/auth/auth.route.js";
import adminProductsRouter from "./routes/admin/products.route.js";
import adminOrderRouter from "./routes/admin/order.route.js";

import shopProductsRouter from "./routes/shop/product.route.js";
import shopCartRouter from "./routes/shop/cart.route.js";
import shopAddressRouter from "./routes/shop/address.route.js";
import shopOrderRouter from "./routes/shop/order.route.js";
import shopSearchRouter from "./routes/shop/search.route.js";
import shopReviewRouter from "./routes/shop/review.route.js";

import commonFeatureRouter from "./routes/common/feature.route.js";

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware Setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Use environment variable for production
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // Allow cookies to be sent cross-origin
  })
);

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

// Serve Static Files in Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

// Start Server
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
