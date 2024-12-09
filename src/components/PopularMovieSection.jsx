import React, { useState, useEffect } from 'react';
import { API_KEY, BASE_URL } from '../config/api';
import MovieSlider from './MovieSlider';

const PopularMovieSection = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch popular movies');
        }
        const data = await response.json();
        setPopularMovies(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Popular Movies</h2>
        <MovieSlider movies={popularMovies} />
      </div>
    </section>
  );
};

export default PopularMovieSection;
