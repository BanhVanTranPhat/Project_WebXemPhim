import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/users.js";
import movieRoutes from "./routes/movies.js";
import vidRoutes from "./routes/videoRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.themoviedb.org"],
      },
    },
  })
);

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// Expanded MongoDB connection with more detailed logging
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log(
      `📍 Connected to database: ${mongoose.connection.db.databaseName}`
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// More robust CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5000",
      "http://localhost:5001",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:5175",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cache headers middleware
app.use((req, res, next) => {
  // Cache static assets for 1 hour
  if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.setHeader("Cache-Control", "public, max-age=3600");
  }
  // Cache API responses for 5 minutes
  else if (req.path.startsWith("/api/")) {
    res.setHeader("Cache-Control", "private, max-age=300");
  }
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Routes with error handling
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/videos", vidRoutes);

// Static file serving with proper headers
app.use("/api/videos/:_id", express.static("public/video"));
app.use(
  "/public",
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".vtt")) {
        res.set("Content-Type", "text/vtt");
      }
      // Cache static files
      res.set("Cache-Control", "public, max-age=3600");
    },
  })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
    });
  }

  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(409).json({
      error: "Duplicate Error",
      message: "Resource already exists",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});

// Comprehensive server startup logging
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Accessible at: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
