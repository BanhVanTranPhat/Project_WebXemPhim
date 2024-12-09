import Video from "../models/videos.js";  // Đảm bảo đường dẫn chính xác

const getVid = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    console.error("❌Lỗi khi lấy videos:", err);
    res.status(500).json({ 
      message: "❌Lỗi khi lấy dữ liệu", 
      error: err.message 
    });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params._id);
    
    if (!video) {
      return res.status(404).json({ 
        message: "Không tìm thấy video" 
      });
    }

    res.status(200).json(video);
  } catch (err) {
    console.error("❌Lỗi khi lấy video theo ID:", err);
    res.status(500).json({ 
      message: "❌Lỗi khi lấy dữ liệu", 
      error: err.message 
    });
  }
};

export default {getVid, getVideoById};