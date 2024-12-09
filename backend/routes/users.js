import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isPremium: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
});

const User = mongoose.model("User", userSchema);

// Hàm tạo token JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, isPremium: user.isPremium }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Route để đăng ký người dùng
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Kiểm tra xem tên người dùng đã tồn tại
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Tên người dùng đã tồn tại" });
    }

    // Kiểm tra xem email đã tồn tại
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Tạo người dùng mà không mã hóa mật khẩu
    const newUser = new User({ username, password, email });
    const savedUser = await newUser.save();

    // Chỉ trả về các trường mong muốn
    const { password: _, _id, __v, ...userResponse } = savedUser.toObject(); // Loại bỏ password, _id, và __v

    console.log("User registered successfully:", userResponse);
    res
      .status(201)
      .json({ message: "User registered successfully", user: userResponse });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({ message: "Error registering user", error });
  }
});

// Route để đăng nhập người dùng
router.post("/login", async (req, res) => {
  const { username, password } = req.body; 

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    // So sánh mật khẩu trực tiếp
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Tạo token JWT
    const token = generateToken(user);
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Middleware để xác thực JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route để đăng xuất người dùng
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

// Route cập nhật trạng thái premium
router.post("/update-premium", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID người dùng từ token
    const user = await User.findById(userId);

    if (user) {
      user.isPremium = true; // Cập nhật trạng thái premium
      await user.save();
      res.json({ message: "Cập nhật thành công", isPremium: user.isPremium });
    } else {
      res.status(404).json({ message: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật trạng thái premium", error });
  }
});

// Route lấy nội dung premium
router.get("/premium-content", authenticateToken, async (req, res) => {
  const premiumContent = "Nội dung premium của bạn ở đây";
  res.json(premiumContent);
});

export default router;
