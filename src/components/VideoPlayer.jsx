import React, { useState, useEffect } from "react";
import { API_KEY, BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VideoPlayer = () => {
  const [posterVideo, setposterVideo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()


  
  useEffect(() => {
    const fetchVidPoster = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/videos");
        console.log("res data", res.data);

        // const videoData = Array.isArray(res.data) ? res.data : res.data.data || []
        const videoData = res.data;

        const videoPosterFromTMDB = await Promise.all(
          videoData.map(async (vid) => {
            if (vid.videoIdByTMDB) {
              try {
                const tmdbRes = await axios.get(
                  `https://api.themoviedb.org/3/movie/${vid.videoIdByTMDB}?api_key=${API_KEY}`
                );
                console.log(tmdbRes.data);

                return {
                  ...vid,
                  poster: tmdbRes.data.poster_path
                    ? `https://image.tmdb.org/t/p/w500${tmdbRes.data.poster_path}`
                    : null,
                };
              } catch (e) {
                console.log("loi poster tmdb");
                return { ...vid, poster: null };
              }
            } else {
              return { ...vid, poster: null };
            }
          })
        );

        setposterVideo(videoPosterFromTMDB);
        setIsLoading(false);
      } catch (e) {
        console.log("loi!!!", e.message);
        setIsLoading(false);
      }
    };

    fetchVidPoster();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Watch Video</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posterVideo.map((video, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {video.poster ? (
              <img
                src={video.poster}
                alt={video.title}
                className="w-full h-auto object-cover"
                onClick={()=> navigate(`/watch/${video._id}`)}
              />
            ) : (
              <div className="h-48 flex items-center justify-center bg-gray-200">
                <span>No Poster Available</span>
              </div>
            )}
            <h2 className="text-lg font-semibold p-2">{video.title}</h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoPlayer;
