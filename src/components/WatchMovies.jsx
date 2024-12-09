import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const WatchMovies = () => {
  const [subtitleLang, setSubtitleLang] = useState("vi");
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);
  const { _id } = useParams();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        console.log("Fetching video with ID:", _id);
        const res = await axios.get(`http://localhost:5001/api/videos/${_id}`);
        // setVideo(res.data);
        console.log(res.data);

        if (Array.isArray(res.data)) {
          const video = res.data.find((v) => v._id === _id);
          setVideo(video);
        } else {
          setVideo(res.data);
        }
      } catch (e) {
        console.error("Lỗi tải video:", e);
      }
    };
    fetchVideo();
  }, [_id]);

  const handleLanguageChange = (event) => {
    setSubtitleLang(event.target.value);
  };

  const toggleSubtitles = () => {
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      const newState = !subtitlesEnabled;
      setSubtitlesEnabled(newState);

      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = newState ? "showing" : "disabled";
      }
    }
  };

  if (!video) return <p>Đang tải...</p>;

  const selectLanguageSubtitle =
    video.subtitles.find((sub) => sub.language === subtitleLang)?.subtitleUrl ||
    null;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="text-xl font-bold mb-4">Xem Phim</div>

      <div className="flex space-x-4 mb-4">
        <select
          onChange={handleLanguageChange}
          value={subtitleLang}
          className="border rounded p-2"
        >
          <option value="vi">Tiếng Việt</option>
          <option value="en">Tiếng Anh</option>
        </select>

        <button
          onClick={toggleSubtitles}
          className={`px-4 py-2 rounded ${
            subtitlesEnabled
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {subtitlesEnabled ? "Tắt phụ đề" : "Bật phụ đề"}
        </button>
      </div>

      <div className="relative">
        <video ref={videoRef} controls width="100%" height="auto">
          {/* <source src='../public/video/Inside_Out.mp4'type="video/mp4" /> */}
          <source src={video.videoUrl} type="video/mp4" />
          {video.subtitles.map(
            (subtitle, index) =>
              subtitle.language === subtitleLang && (
                <track
                  key={index}
                  kind="subtitles"
                  src={`http://localhost:5173/${subtitle.subtitleUrl}`} // Chuyển thành URL đầy đủ
                  srcLang={subtitle.language}
                  label={subtitle.language === "vi" ? "Tiếng Việt" : "English"}
                  default={subtitle.language === "vi"} // Mặc định tiếng Việt
                />
              )
          )}
          Trình duyệt của bạn không hỗ trợ video hoặc phụ đề.
        </video>
      </div>

      <div className="mt-4 text-gray-600">
        <p>
          Trạng thái phụ đề:{" "}
          {subtitleLang === "vi" ? "Tiếng Việt" : "Tiếng Anh"}{" "}
          {subtitlesEnabled ? " (Đang bật)" : " (Đã tắt)"}
        </p>
      </div>
    </div>
  );
};

export default WatchMovies;
