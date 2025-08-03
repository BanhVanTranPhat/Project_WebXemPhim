import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Star, Calendar, Film, Heart } from "lucide-react";
import { UserContext } from "../Context/UserContext";
import toast from "react-hot-toast";

const OptimizedMovieCard = React.memo(({ movie, categories, onClick }) => {
  const { user, setUser } = useContext(UserContext);
  const [isInView, setIsInView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);
  const isInPlaylist = user?.watchlist?.includes(String(movie.id));

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTogglePlaylist = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      toast.error("Bạn cần đăng nhập để thêm vào playlist!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token không hợp lệ, vui lòng đăng nhập lại!");
      return;
    }

    const url = isInPlaylist
      ? "http://localhost:5001/api/users/remove-from-watchlist"
      : "http://localhost:5001/api/users/add-to-watchlist";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId: String(movie.id) }),
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
        if (res.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          return;
        }

        try {
          const errorData = await res.json();
          toast.error(errorData.message || "Lỗi khi cập nhật playlist!");
        } catch (parseError) {
          toast.error("Lỗi khi cập nhật playlist!");
        }
      }
    } catch (error) {
      toast.error("Lỗi kết nối server!");
    }
  };

  const movieCategories =
    movie.genre_ids
      ?.map((id) => categories.find((cat) => cat.id === id)?.name)
      .filter(Boolean) || [];

  return (
    <div
      ref={cardRef}
      className="group relative border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:border-blue-500 transition-all duration-300 scale-100 hover:scale-105 bg-white"
    >
      <button
        onClick={handleTogglePlaylist}
        className={`absolute top-2 right-2 z-20 p-2 rounded-full bg-white/80 hover:bg-pink-100 transition-colors ${
          isInPlaylist ? "text-pink-600" : "text-gray-400"
        }`}
        title={isInPlaylist ? "Bỏ khỏi playlist" : "Thêm vào playlist"}
      >
        <Heart fill={isInPlaylist ? "#ec4899" : "none"} />
      </button>

      <div className="relative aspect-[2/3]">
        {isInView ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
              movie.adult ? "blur-sm" : ""
            } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x450?text=No+Image";
              setImageLoaded(true);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        )}

        {movie.adult && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold">18+</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-blue-600 transition-colors">
          {movie.title}
        </h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{movie.release_date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} />
            <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Film size={14} />
            <span className="truncate">
              {movieCategories.join(", ") || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <Link
        to={`/movie/${movie.id}`}
        className="absolute inset-0 z-10"
        onClick={(e) => {
          e.preventDefault();
          onClick(movie.id);
        }}
      />
    </div>
  );
});

OptimizedMovieCard.displayName = "OptimizedMovieCard";

export default OptimizedMovieCard;
