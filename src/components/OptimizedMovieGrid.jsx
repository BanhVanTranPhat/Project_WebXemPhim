import React, { useRef, useEffect, useCallback } from "react";
import OptimizedMovieCard from "./OptimizedMovieCard";
import LoadingIndicator from "./LoadingIndicator";

const OptimizedMovieGrid = ({
  movies,
  categories,
  isLoading,
  hasMore,
  onLoadMore,
  onMovieClick,
}) => {
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // Intersection Observer for infinite loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  // Memoized movie card renderer
  const renderMovieCard = useCallback(
    (movie) => (
      <OptimizedMovieCard
        key={movie.id}
        movie={movie}
        categories={categories}
        onClick={onMovieClick}
      />
    ),
    [categories, onMovieClick]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map(renderMovieCard)}
      </div>

      {/* Loading indicator for infinite scroll */}
      <div ref={loadingRef} className="flex justify-center py-8">
        {isLoading && <LoadingIndicator />}
        {!isLoading && !hasMore && movies.length > 0 && (
          <p className="text-gray-500 text-center">Đã hiển thị tất cả phim</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(OptimizedMovieGrid);
