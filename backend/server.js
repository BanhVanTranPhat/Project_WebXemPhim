import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import movieRoutes from "./routes/movies.js";
import vidRoutes from "./routes/videoRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Expanded MongoDB connection with more detailed logging
mongoose
  .connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log(`📍 Connected to database: ${mongoose.connection.db.databaseName}`);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// More robust CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:5001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes with error handling
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/videos", vidRoutes);
app.use("/api/videos/:_id", express.static("public/video"));
app.use("/public", express.static("public", {
  setHeaders: (res, path) => {
    if (path.endsWith(".vtt")) {
      res.set("Content-Type", "text/vtt");
    }
  }
}));

// Comprehensive server startup logging
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Accessible at: http://localhost:${PORT}`);
});