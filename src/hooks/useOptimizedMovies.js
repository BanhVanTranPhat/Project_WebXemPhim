import { useState, useEffect, useCallback, useRef } from "react";
import { searchMovies, discoverMovies } from "../config/api";

export const useOptimizedMovies = (initialFilters = {}) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const abortControllerRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchQuery(query);
          setPage(1);
          setMovies([]);
        }, 300);
      };
    })(),
    []
  );

  // Fetch movies with abort controller
  const fetchMovies = useCallback(
    async (currentPage = 1, reset = false) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        let data;

        if (searchQuery.trim()) {
          data = await searchMovies(searchQuery, currentPage);
        } else {
          data = await discoverMovies(filters, currentPage);
        }

        if (abortControllerRef.current.signal.aborted) {
          return;
        }

        if (reset) {
          setMovies(data.results || []);
        } else {
          setMovies((prev) => [...prev, ...(data.results || [])]);
        }

        setHasMore(currentPage < (data.total_pages || 0));
        setPage(currentPage);
      } catch (err) {
        if (!abortControllerRef.current.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!abortControllerRef.current.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [searchQuery, filters]
  );

  // Separate effect for search query changes
  useEffect(() => {
    if (searchQuery !== "") {
      fetchMovies(1, true);
    }
  }, [searchQuery]);

  // Separate effect for filter changes
  useEffect(() => {
    if (searchQuery === "") {
      fetchMovies(1, true);
    }
  }, [filters]);

  // Load more movies
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchMovies(page + 1, false);
    }
  }, [isLoading, hasMore, page, fetchMovies]);

  // Reset and fetch with new filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setMovies([]);
    setHasMore(true);
  }, []);

  // Update search query
  const updateSearch = useCallback(
    (query) => {
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  // Initial load
  useEffect(() => {
    fetchMovies(1, true);
  }, []); // Only run once on mount

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    movies,
    isLoading,
    error,
    hasMore,
    loadMore,
    updateFilters,
    updateSearch,
    searchQuery,
    filters,
  };
};
