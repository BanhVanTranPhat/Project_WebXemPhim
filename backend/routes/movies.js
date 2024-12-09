// movies.js
import express from "express";
import mongoose from "mongoose";

// Định nghĩa schema cho Movie
const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    rating: { type: Number, default: 0 },
    // Thêm các trường khác như hình ảnh, diễn viên, v.v.
  },
  { timestamps: true }
);

// Tạo model cho Movie
const Movie = mongoose.model("Movie", movieSchema);

const router = express.Router();

// Route để lấy danh sách phim
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find(); // Lấy danh sách phim từ cơ sở dữ liệu
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching movies", error });
  }
});

// Route để thêm phim mới
router.post("/", async (req, res) => {
  const { title, description, genre, releaseDate } = req.body; // Cập nhật để lấy genre và releaseDate

  const newMovie = new Movie({ title, description, genre, releaseDate }); // Cập nhật để sử dụng genre và releaseDate

  try {
    const savedMovie = await newMovie.save(); // Lưu phim mới vào cơ sở dữ liệu
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: "Error adding movie", error });
  }
});

// Xuất router dưới dạng mặc định
export default router;
