import React, { useState, useEffect } from 'react';
import { API_KEY, BASE_URL } from '../config/api';
import MovieSlider from './MovieSlider';

const MovieListSection = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl md:text-center font-bold mb-6">Latest Movies</h2>
        <MovieSlider movies={movies} />
      </div>
    </section>
  );
};

export default MovieListSection;
