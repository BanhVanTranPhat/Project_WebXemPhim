import { useState, useEffect } from "react";
import axios from "axios";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/videos");

        // Log the entire response to see its structure
        console.log("🌈 Full API Response:", response);
        console.log("🔍 Response Data:", response.data);

        // Adjust this based on your actual API response structure
        const videoData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        console.log("📺 Processed Video Data:", videoData);

        setVideos(videoData);
        setLoading(false);
      } catch (error) {
        console.error("❌ Detailed Fetch Error:", error);
        // Detailed error logging
        if (error.response) {
          console.error("Server Response Error:", error.response.data);
          console.error("Status Code:", error.response.status);
          setError(`Server Error: ${error.response.status}`);
        } else if (error.request) {
          console.error("No Response Received", error.request);
          setError("No response from server. Check network connection.");
        } else {
          console.error("Request Setup Error:", error.message);
          setError(`Request Error: ${error.message}`);
        }

        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Defensive rendering
  if (loading) return <div>Loading videos...</div>;
  if (error) return <div>Error: {error}</div>;

  // Additional check before mapping
  if (!videos || !Array.isArray(videos)) {
    return <div>No video data available</div>;
  }

  return (
    <div>
      <h1>Danh sách Videos</h1>
      {videos.length === 0 ? (
        <p>No videos found</p>
      ) : (
        videos.map((video) => (
          <div key={video._id || Math.random().toString()}>
            <h2>{video.title || "Untitled Video"}</h2>
            <p>{video.description || "No description"}</p>
            {video.videoUrl && (
              <video
                width="50%"
                height="auto"
                controls
                src={video.videoUrl}
                alt={video.title}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default VideoList;
