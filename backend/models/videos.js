import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Tiêu đề của video
  description: { type: String }, // Mô tả video
  videoUrl: { type: String, required: true }, // Đường dẫn tới tệp video
  subtitles: [
    {
      language: { type: String, required: true }, // Ngôn ngữ phụ đề
      subtitleUrl: { type: String, required: true }, // Đường dẫn tệp phụ đề
    },
  ],
  thumbnailUrl: { type: String }, // Đường dẫn hình ảnh đại diện
  videoIdByTMDB: { type: Number }, // ID của video trên TMDB (nếu có)
});

export default mongoose.model('Video', videoSchema);
