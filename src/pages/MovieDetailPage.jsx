import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_KEY, BASE_URL } from "../config/api";
import { Helmet } from "react-helmet";
import {
  Heart,
  Star,
  Calendar,
  Clock,
  Play,
  Users,
  Award,
  ArrowLeft,
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import toast from "react-hot-toast";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
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
          setMovie((prevMovie) => ({ ...prevMovie, trailer_key: trailer.key }));
        }

        // Fetch cast and crew
        const creditsResponse = await fetch(
          `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        );
        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json();
          setCast(creditsData.cast || []);
          setCrew(creditsData.crew || []);
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
    setIsVideoOpen(true);
  };

  const closeVideoPlayer = () => {
    setIsVideoOpen(false);
  };

  const handleTogglePlaylist = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thêm vào playlist!");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("User:", user);
    console.log("Token:", token);
    console.log("Movie ID:", id);

    if (!token) {
      toast.error("Token không hợp lệ, vui lòng đăng nhập lại!");
      return;
    }

    const url = isInPlaylist
      ? "http://localhost:5001/api/users/remove-from-watchlist"
      : "http://localhost:5001/api/users/add-to-watchlist";

    try {
      console.log("Sending request to:", url);
      console.log("Request headers:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });
      console.log("Request body:", { movieId: String(id) });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId: String(id) }),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      if (res.ok) {
        const data = await res.json();
        console.log("Response data:", data);
        const newUser = { ...user, watchlist: data.watchlist };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success(
          isInPlaylist ? "Đã xóa khỏi playlist!" : "Đã thêm vào playlist!"
        );
      } else {
        // Xử lý lỗi 403 (Forbidden) - Token hết hạn hoặc không hợp lệ
        if (res.status === 403) {
          console.error("Token expired or invalid");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          return;
        }

        // Xử lý các lỗi khác
        try {
          const errorData = await res.json();
          console.error("Error response:", errorData);
          toast.error(errorData.message || "Lỗi khi cập nhật playlist!");
        } catch (parseError) {
          console.error("Cannot parse error response:", parseError);
          toast.error("Lỗi khi cập nhật playlist!");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      toast.error("Lỗi kết nối server!");
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  if (!movie) return null;

  const director = crew.find((person) => person.job === "Director");
  const writers = crew.filter((person) => person.job === "Writer");

  return (
    <>
      <Helmet>
        <title>{movie.title} | LPMovie</title>
        <meta name="description" content={movie.overview || "Chi tiết phim."} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            to=".."
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại
          </Link>

          {/* Hero Section */}
          <div className="relative mb-8">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-full">
                    <Star size={16} />
                    <span className="font-bold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  {movie.release_date && (
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                      <Calendar size={16} />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  )}
                  {movie.runtime && (
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                      <Clock size={16} />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Poster and Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <div className="relative mb-6">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full rounded-xl shadow-lg"
                  />
                  <button
                    onClick={handleTogglePlaylist}
                    className={`absolute top-4 right-4 z-20 p-3 rounded-full bg-white/90 hover:bg-pink-100 transition-colors ${
                      isInPlaylist ? "text-pink-600" : "text-gray-400"
                    }`}
                    title={
                      isInPlaylist ? "Bỏ khỏi playlist" : "Thêm vào playlist"
                    }
                  >
                    <Heart fill={isInPlaylist ? "#ec4899" : "none"} size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={20} />
                    Xem trailer
                  </button>

                  {movie.homepage && (
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Trang web chính thức
                    </a>
                  )}
                </div>

                {/* Movie Stats */}
                <div className="mt-6 space-y-3">
                  {movie.budget > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ngân sách:</span>
                      <span className="font-semibold">
                        {formatCurrency(movie.budget)}
                      </span>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Doanh thu:</span>
                      <span className="font-semibold">
                        {formatCurrency(movie.revenue)}
                      </span>
                    </div>
                  )}
                  {movie.vote_count > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Lượt đánh giá:</span>
                      <span className="font-semibold">
                        {movie.vote_count.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Tóm tắt
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {movie.overview}
                </p>
              </div>

              {/* Cast */}
              {cast.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Diễn viên
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cast.slice(0, 9).map((actor) => (
                      <Link
                        key={actor.id}
                        to={`/person/${actor.id}`}
                        className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w92${actor.profile_path}`
                              : "https://via.placeholder.com/92x138?text=?"
                          }
                          alt={actor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                            {actor.name}
                          </p>
                          {actor.character && (
                            <p className="text-sm text-gray-500 truncate">
                              {actor.character}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Crew */}
              {(director || writers.length > 0) && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="text-green-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Đội ngũ sản xuất
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {director && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium w-20">
                          Đạo diễn:
                        </span>
                        <Link
                          to={`/person/${director.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          {director.name}
                        </Link>
                      </div>
                    )}
                    {writers.length > 0 && (
                      <div className="flex items-start gap-3">
                        <span className="text-gray-600 font-medium w-20">
                          Biên kịch:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {writers.slice(0, 3).map((writer) => (
                            <Link
                              key={writer.id}
                              to={`/person/${writer.id}`}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              {writer.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Player Modal */}
        {trailerOpen && movie.trailer_key && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 p-4">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setTrailerOpen(false)}
                className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
              >
                ×
              </button>
              <div className="relative aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MovieDetailPage;
