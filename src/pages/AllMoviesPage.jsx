import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  Link,
  useSearchParams,
  useNavigate,
  useParams,
} from "react-router-dom";
import { API_KEY, BASE_URL } from "../config/api";
import debounce from "lodash/debounce";
import { Search, Filter, Star, Calendar, Film, Heart } from "lucide-react";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import useSWR from "swr";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import toast from "react-hot-toast";

// Separate MovieCard component
const MovieCard = React.memo(({ movie, categories, onClick }) => {
  const { user, setUser } = useContext(UserContext);
  const isInPlaylist = user?.watchlist?.includes(String(movie.id));

  const handleTogglePlaylist = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      toast.error("Bạn cần đăng nhập để thêm vào playlist!");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("AllMoviesPage - User:", user);
    console.log("AllMoviesPage - Token:", token);
    console.log("AllMoviesPage - Movie ID:", movie.id);

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

      console.log("AllMoviesPage - Response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("AllMoviesPage - Response data:", data);
        const newUser = { ...user, watchlist: data.watchlist };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success(
          isInPlaylist ? "Đã xóa khỏi playlist!" : "Đã thêm vào playlist!"
        );
      } else {
        // Xử lý lỗi 403 (Forbidden) - Token hết hạn hoặc không hợp lệ
        if (res.status === 403) {
          console.error("AllMoviesPage - Token expired or invalid");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          return;
        }

        // Xử lý các lỗi khác
        try {
          const errorData = await res.json();
          console.error("AllMoviesPage - Error response:", errorData);
          toast.error(errorData.message || "Lỗi khi cập nhật playlist!");
        } catch (parseError) {
          console.error(
            "AllMoviesPage - Cannot parse error response:",
            parseError
          );
          toast.error("Lỗi khi cập nhật playlist!");
        }
      }
    } catch (error) {
      console.error("AllMoviesPage - Fetch error:", error);
      toast.error("Lỗi kết nối server!");
    }
  };

  const movieCategories = movie.genre_ids
    .map((id) => categories.find((cat) => cat.id === id)?.name)
    .filter(Boolean);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:border-blue-500 transition-all duration-300 scale-100 hover:scale-105 bg-white"
      onClick={(e) => {
        e.preventDefault();
        onClick(movie.id);
      }}
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
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
            movie.adult ? "blur-sm" : ""
          }`}
          loading="lazy"
        />
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
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Film size={14} />
            <span className="truncate">
              {movieCategories.join(", ") || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

// Skeleton MovieCard
const SkeletonCard = () => (
  <div className="animate-pulse border border-gray-200 rounded-xl overflow-hidden shadow-md bg-white">
    <div className="aspect-[2/3] bg-gray-200" />
    <div className="p-4">
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-1" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

// Separate Sidebar component
const Sidebar = ({
  categories,
  selectedCategories,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) => (
  <div className="md:w-1/4">
    <div className="sticky top-4 space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h2 className="text-lg font-semibold">Categories</h2>
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => onCategoryChange(category.id)}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Main component
const AllMoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { genre } = useParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const loadMoreRef = useRef(null);
  const navigate = useNavigate();

  const fetcher = (url) => axios.get(url).then((res) => res.data);

  // SWR fetch categories
  const { data: categoriesData = {}, error: catError } = useSWR(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    fetcher
  );
  const categories = categoriesData.genres || [];

  // SWR fetch movies
  const {
    data: movieData,
    error: movieError,
    isValidating,
  } = useSWR(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  const movies = movieData?.results || [];

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchParams(query ? { search: query } : {});
    }, 500),
    [setSearchParams]
  );

  const handleMovieClick = useCallback(
    (movieId) => {
      if (!isValidating) {
        navigate(`/movie/${movieId}`);
      }
    },
    [navigate, isValidating]
  );

  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      setSearchQuery(e.target.value);
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const handleRetry = useCallback(() => {
    setError(null);
    setPage(1);
    // Re-fetch movies when retrying
    // This part needs to be updated to use SWR's revalidation or refetch
    // For now, we'll just set page to 1 and let SWR handle the revalidation
    // A more robust solution would involve a global revalidation mechanism
  }, []);

  useEffect(() => {
    // No need to call fetchCategories directly here, SWR handles it
  }, [categories]);

  // Khi categories hoặc genre thay đổi, tự động setSelectedCategories nếu có genre
  useEffect(() => {
    if (genre && categories.length > 0) {
      const found = categories.find(
        (cat) => cat.name.toLowerCase() === genre.toLowerCase()
      );
      if (found) {
        setSelectedCategories([found.id]);
      } else {
        setSelectedCategories([]);
      }
    }
    // Nếu không có genre, không filter theo thể loại
    if (!genre) {
      setSelectedCategories([]);
    }
  }, [genre, categories]);

  useEffect(() => {
    // No need to call fetchMovies directly here, SWR handles it
  }, [movies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isValidating) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isValidating]);

  const filteredMovies = movies.filter((movie) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      movie.genre_ids.some((id) => selectedCategories.includes(id));
    const matchesSearch =
      !searchQuery ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (catError || movieError) {
    return (
      <ErrorMessage
        message="Failed to load data. Please try again later."
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <div className="md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isValidating && movies.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    categories={categories}
                    onClick={handleMovieClick}
                  />
                ))}
          </div>

          <div ref={loadMoreRef} className="mt-8 text-center">
            {isValidating ? (
              <LoadingIndicator />
            ) : (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg mt-4"
              >
                Load More Movies
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMoviesPage;
