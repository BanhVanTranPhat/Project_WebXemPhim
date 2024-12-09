import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const VideoPlayerDetail = () => {
  const { _id } = useParams();
  const [Video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!_id) {
        console.error("Video ID is undefined");
        setError("Video ID is undefined");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5001/api/videos/${_id}`);
        setVideo(res.data);
      } catch (e) {
        console.log("Error fetching video:", e.message);
        setError("Error fetching video");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{Video.title}</h1>
      <p className="text-sm text-gray-600">{Video.description}</p>
      {Video.videoUrl && <video controls width="100%" src={Video.videoUrl} />}
    </div>
  );
};

export default VideoPlayerDetail;
