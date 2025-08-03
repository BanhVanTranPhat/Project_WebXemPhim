import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const OptimizedMovieSlider = React.memo(({ movies, theme = 'default' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const sliderRef = useRef(null);
  const moviesPerPage = 5;

  // Preload next batch of images
  const preloadImages = useCallback((startIndex) => {
    const endIndex = Math.min(startIndex + moviesPerPage, movies.length);
    for (let i = startIndex; i < endIndex; i++) {
      if (movies[i]?.poster_path) {
        const img = new Image();
        img.src = `https://image.tmdb.org/t/p/w500${movies[i].poster_path}`;
      }
    }
  }, [movies]);

  // Preload next batch when current index changes
  useEffect(() => {
    const nextBatchStart = currentIndex + moviesPerPage;
    if (nextBatchStart < movies.length) {
      preloadImages(nextBatchStart);
    }
  }, [currentIndex, movies.length, preloadImages]);

  const nextSlide = useCallback(() => {
    setIsLoading(true);
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + moviesPerPage >= movies.length ? 0 : prevIndex + moviesPerPage;
      return newIndex;
    });
    setTimeout(() => setIsLoading(false), 300);
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setIsLoading(true);
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - moviesPerPage < 0 ? movies.length - moviesPerPage : prevIndex - moviesPerPage;
      return newIndex;
    });
    setTimeout(() => setIsLoading(false), 300);
  }, [movies.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide]);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [nextSlide]);

  if (!movies || movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Không có phim để hiển thị</p>
      </div>
    );
  }

  return (
    <div className={`relative ${theme === 'popular' ? 'bg-gray-200' : ''}`}>
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        disabled={isLoading}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-70 transition-all disabled:opacity-50"
        aria-label="Previous slide"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={nextSlide}
        disabled={isLoading}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-70 transition-all disabled:opacity-50"
        aria-label="Next slide"
      >
        <FaChevronRight />
      </button>

      {/* Slider container */}
      <div className="overflow-hidden" ref={sliderRef}>
        <div
          className={`flex transition-transform duration-300 ease-in-out ${
            isLoading ? 'opacity-50' : 'opacity-100'
          }`}
          style={{ transform: `translateX(-${currentIndex * (100 / moviesPerPage)}%)` }}
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="w-1/5 flex-shrink-0 px-2 min-w-40">
              <Link to={`/movie/${movie.id}`} className="block group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading={index < currentIndex + moviesPerPage ? "eager" : "lazy"}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
                <h3 className="mt-2 text-sm md:text-lg font-semibold truncate group-hover:text-blue-600 transition-colors">
                  {movie.title}
                </h3>
                {movie.vote_average && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="text-yellow-500">★</span>
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(movies.length / moviesPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsLoading(true);
              setCurrentIndex(index * moviesPerPage);
              setTimeout(() => setIsLoading(false), 300);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === Math.floor(currentIndex / moviesPerPage)
                ? 'bg-blue-500'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

OptimizedMovieSlider.displayName = 'OptimizedMovieSlider';

export default OptimizedMovieSlider; 