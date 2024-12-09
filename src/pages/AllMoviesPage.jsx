import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { API_KEY, BASE_URL } from "../config/api";
import debounce from 'lodash/debounce';
import { Search, Filter, Star, Calendar, Film } from 'lucide-react';

// Separate MovieCard component
const MovieCard = React.memo(({ movie, categories, onClick }) => {
  const movieCategories = movie.genre_ids
    .map(id => categories.find(cat => cat.id === id)?.name)
    .filter(Boolean);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      onClick={(e) => {
        e.preventDefault();
        onClick(movie.id);
      }}
    >
      <div className="relative aspect-[2/3]">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
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

      <div className="p-4 bg-white">
        <h3 className="font-semibold text-lg mb-2 truncate">{movie.title}</h3>
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
            <span className="truncate">{movieCategories.join(", ") || "N/A"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

// Separate Sidebar component
const Sidebar = ({ categories, selectedCategories, onCategoryChange, searchQuery, onSearchChange }) => (
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p className="text-gray-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Loading component
const LoadingIndicator = () => (
  <div className="inline-flex items-center gap-2">
    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    <span>Loading more movies...</span>
  </div>
);

// Main component
const AllMoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const loadMoreRef = useRef(null);
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchParams(query ? { search: query } : {});
    }, 500),
    [setSearchParams]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
      );
      setCategories(response.data.genres);
    } catch (err) {
      setError("Failed to load categories. Please try again later.");
    }
  }, []);

  const fetchMovies = useCallback(async (pageNum) => {
    if (isLoading) return;

    setIsLoading(true);
    setLoading(true);
    
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNum}`
      );

      const newMovies = response.data.results;
      setMovies(prev => {
        const uniqueMovies = new Map([...prev, ...newMovies].map(movie => [movie.id, movie]));
        return Array.from(uniqueMovies.values());
      });

      setHasMore(response.data.page < response.data.total_pages);
      setError(null);
    } catch (err) {
      setError("Failed to load movies. Please try again later.");
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [isLoading]);

  const handleMovieClick = useCallback((movieId) => {
    if (!loading && !isLoading) {
      navigate(`/movie/${movieId}`);
    }
  }, [navigate, loading, isLoading]); 

  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  const handleRetry = useCallback(() => {
    setError(null);
    setPage(1);
    fetchMovies(1);
  }, [fetchMovies]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchMovies(page);
  }, [page, fetchMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const filteredMovies = movies.filter(movie => {
    const matchesCategory = selectedCategories.length === 0 ||
      movie.genre_ids.some(id => selectedCategories.includes(id));
    const matchesSearch = !searchQuery ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
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
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                categories={categories}
                onClick={handleMovieClick}
              />
            ))}
          </div>

          <div ref={loadMoreRef} className="mt-8 text-center">
            {isLoading ? (
              <LoadingIndicator />
            ) : hasMore ? (
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Load More Movies
              </button>
            ) : (
              <p className="text-gray-600">No more movies to load</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMoviesPage;