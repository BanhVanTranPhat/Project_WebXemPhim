import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_KEY, BASE_URL } from "../config/api";
import { Helmet } from "react-helmet";
import { Heart } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import toast from "react-hot-toast";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false); // State to manage video player visibility
  const [cast, setCast] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const isInPlaylist = user?.watchlist?.includes(String(id));

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }
        const data = await response.json();
        setMovie(data);

        // Fetch trailer details
        const trailerResponse = await fetch(
          `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
        );
        const trailerData = await trailerResponse.json();
        const trailer = trailerData.results.find(
          (video) => video.type === "Trailer"
        );
        if (trailer) {
          setMovie((prevMovie) => ({ ...prevMovie, trailer_key: trailer.key })); // Store the trailer key
        }

        // Fetch cast
        const castResponse = await fetch(
          `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        );
        if (castResponse.ok) {
          const castData = await castResponse.json();
          setCast(castData.cast || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleWatchTrailer = () => {
    setIsVideoOpen(true); // Show the video player
  };

  const closeVideoPlayer = () => {
    setIsVideoOpen(false); // Hide the video player
  };

  const handleTogglePlaylist = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thêm vào playlist!");
      return;
    }
    const token = localStorage.getItem("token");
    const url = isInPlaylist
      ? "http://localhost:5001/api/users/remove-from-watchlist"
      : "http://localhost:5001/api/users/add-to-watchlist";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movieId: String(id) }),
    });
    if (res.ok) {
      const data = await res.json();
      const newUser = { ...user, watchlist: data.watchlist };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success(
        isInPlaylist ? "Đã xóa khỏi playlist!" : "Đã thêm vào playlist!"
      );
    } else {
      toast.error("Lỗi khi cập nhật playlist!");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return null;

  return (
    <>
      <Helmet>
        <title>{movie.title} | LPMovie</title>
        <meta name="description" content={movie.overview || "Chi tiết phim."} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-full md:w-1/3 max-w-xs mx-auto">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-xl shadow-lg mb-4"
            />
            <button
              onClick={handleTogglePlaylist}
              className={`absolute top-2 right-2 z-20 p-2 rounded-full bg-white/80 hover:bg-pink-100 transition-colors ${
                isInPlaylist ? "text-pink-600" : "text-gray-400"
              }`}
              title={isInPlaylist ? "Bỏ khỏi playlist" : "Thêm vào playlist"}
            >
              <Heart fill={isInPlaylist ? "#ec4899" : "none"} />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {movie.title}
            </h1>
            <p className="text-gray-600 mb-2">
              {movie.release_date} | {movie.runtime} min
            </p>
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mr-2">
                {movie.vote_average.toFixed(1)} ★
              </span>
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold mr-2"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="mb-4 text-lg text-gray-800">{movie.overview}</p>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Diễn viên:</h2>
              <ul className="list-disc pl-5">
                {cast.slice(0, 8).map((actor) => (
                  <li
                    key={actor.cast_id || actor.credit_id}
                    className="text-gray-600"
                  >
                    {actor.name}{" "}
                    {actor.character ? (
                      <span className="text-xs text-gray-400">
                        ({actor.character})
                      </span>
                    ) : null}
                  </li>
                ))}
                {cast.length === 0 && (
                  <li className="text-gray-400">Không có dữ liệu diễn viên</li>
                )}
              </ul>
            </div>
            <button
              onClick={() => setTrailerOpen(true)}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold text-white text-lg shadow transition-transform duration-300 hover:scale-105"
            >
              Xem trailer
            </button>
          </div>
        </div>
        {/* Video Player Modal */}
        {trailerOpen && movie.trailer_key && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="relative w-full max-w-2xl">
              <button
                onClick={() => setTrailerOpen(false)}
                className="absolute top-0 right-0 p-2 text-white text-2xl"
              >
                ×
              </button>
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MovieDetailPage;
