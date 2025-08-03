import React, { useState, useEffect, useCallback } from 'react';
import { API_KEY, BASE_URL, fetchWithCache } from '../config/api';
import OptimizedMovieSlider from './OptimizedMovieSlider';
import LoadingIndicator from './LoadingIndicator';

const OptimizedPopularMovieSection = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchPopularMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchWithCache(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
      );
      
      setPopularMovies(data.results || []);
    } catch (err) {
      console.error('Error fetching popular movies:', err);
      setError(err.message || 'Không thể tải danh sách phim phổ biến');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Retry mechanism
  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchPopularMovies();
    }
  }, [retryCount, fetchPopularMovies]);

  useEffect(() => {
    fetchPopularMovies();
  }, [fetchPopularMovies]);

  // Auto-retry on error
  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        handleRetry();
      }, 2000 * (retryCount + 1)); // Exponential backoff
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, handleRetry]);

  if (isLoading) {
    return (
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Phim phổ biến
          </h2>
          <div className="flex justify-center">
            <LoadingIndicator />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Phim phổ biến
          </h2>
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-4">⚠️</div>
            <p className="text-gray-600 mb-4">{error}</p>
            {retryCount < 3 && (
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Thử lại ({3 - retryCount} lần còn lại)
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!popularMovies || popularMovies.length === 0) {
    return (
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Phim phổ biến
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-500">Không có phim phổ biến để hiển thị</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Phim phổ biến
        </h2>
        <OptimizedMovieSlider movies={popularMovies} theme="popular" />
      </div>
    </section>
  );
};

export default React.memo(OptimizedPopularMovieSection); 