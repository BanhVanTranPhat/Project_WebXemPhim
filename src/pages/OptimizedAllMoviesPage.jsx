import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { API_KEY, BASE_URL } from "../config/api";
import useSWR from "swr";
import { useOptimizedMovies } from "../hooks/useOptimizedMovies";
import OptimizedMovieGrid from "../components/OptimizedMovieGrid";
import OptimizedFilterSidebar from "../components/OptimizedFilterSidebar";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const OptimizedAllMoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { genre } = useParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  // SWR configuration for better caching
  const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  };

  // Fetch categories with SWR
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: categoriesData = {}, error: catError } = useSWR(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    fetcher,
    swrConfig
  );
  const categories = categoriesData.genres || [];

  // Initialize filters based on URL params
  const initialFilters = {
    sortBy: "popularity.desc",
    ...(searchParams.get("year") && { year: searchParams.get("year") }),
    ...(searchParams.get("rating") && {
      rating: parseFloat(searchParams.get("rating")),
    }),
    ...(searchParams.get("sortBy") && { sortBy: searchParams.get("sortBy") }),
  };

  // Use optimized movies hook
  const {
    movies,
    isLoading,
    error,
    hasMore,
    loadMore,
    updateFilters,
    updateSearch,
    searchQuery,
    filters,
  } = useOptimizedMovies(initialFilters);

  // Handle movie click with navigation
  const handleMovieClick = useCallback(
    (movieId) => {
      if (!isLoading) {
        navigate(`/movie/${movieId}`);
      }
    },
    [navigate, isLoading]
  );

  // Handle category changes
  const handleCategoryChange = useCallback(
    (categoryId) => {
      setSelectedCategories((prev) => {
        const newCategories = prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId];

        // Update URL params
        if (newCategories.length > 0) {
          setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set("genres", newCategories.join(","));
            return params;
          });
        } else {
          setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.delete("genres");
            return params;
          });
        }

        return newCategories;
      });
    },
    [setSearchParams]
  );

  // Handle search changes
  const handleSearchChange = useCallback(
    (query) => {
      updateSearch(query);
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (query) {
          params.set("search", query);
        } else {
          params.delete("search");
        }
        return params;
      });
    },
    [updateSearch, setSearchParams]
  );

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters) => {
      updateFilters(newFilters);
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value) {
            params.set(key, value.toString());
          } else {
            params.delete(key);
          }
        });
        return params;
      });
    },
    [updateFilters, setSearchParams]
  );

  // Initialize categories from URL params
  useEffect(() => {
    const urlGenres = searchParams.get("genres");
    if (urlGenres) {
      setSelectedCategories(urlGenres.split(",").map(Number));
    }
  }, [searchParams]);

  // Handle genre from URL params
  useEffect(() => {
    if (genre && categories.length > 0) {
      const found = categories.find(
        (cat) => cat.name.toLowerCase() === genre.toLowerCase()
      );
      if (found) {
        setSelectedCategories([found.id]);
        setSearchParams((prev) => {
          const params = new URLSearchParams(prev);
          params.set("genres", found.id.toString());
          return params;
        });
      }
    }
  }, [genre, categories, setSearchParams]);

  // Apply category filters to API calls
  useEffect(() => {
    const newFilters =
      selectedCategories.length > 0
        ? {
            ...filters,
            with_genres: selectedCategories.join(","),
          }
        : (() => {
            const { with_genres, ...restFilters } = filters;
            return restFilters;
          })();

    updateFilters(newFilters);
  }, [selectedCategories, updateFilters]); // Remove filters from dependencies

  // Handle retry
  const handleRetry = useCallback(() => {
    // The hook will handle retry automatically
    window.location.reload();
  }, []);

  if (catError) {
    return (
      <ErrorMessage
        message="Không thể tải danh sách thể loại. Vui lòng thử lại."
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <OptimizedFilterSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFiltersChange={handleFiltersChange}
          filters={filters}
        />

        <div className="md:w-3/4">
          {/* Results header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {searchQuery
                ? `Kết quả tìm kiếm: "${searchQuery}"`
                : "Tất cả phim"}
            </h1>
            {movies.length > 0 && (
              <p className="text-gray-600">
                Hiển thị {movies.length} phim
                {hasMore && " (và còn nữa...)"}
              </p>
            )}
          </div>

          {/* Loading state for initial load */}
          {isLoading && movies.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorMessage
              message="Không thể tải danh sách phim. Vui lòng thử lại."
              onRetry={handleRetry}
            />
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold mb-2">
                Không tìm thấy phim
              </h3>
              <p className="text-gray-600">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          ) : (
            <OptimizedMovieGrid
              movies={movies}
              categories={categories}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onMovieClick={handleMovieClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizedAllMoviesPage;
