import dbConnect from "../../backend/utils";
import Video from "../../backend/models/videos";

export default async function handler(req, res) {
  await dbConnect(); // Kết nối đến database

  if (req.method === "GET") {
    try {
      const videos = await Video.find({});
      res.status(200).json(videos);
    } catch (error) {
      console.error("Lỗi khi lấy video:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  } else {
    res.status(405).json({ error: "Phương thức không được phép" });
  }
}
