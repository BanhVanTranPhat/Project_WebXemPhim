import React from 'react';
import HeroSection from '../components/HeroSection';
import MovieListSection from '../components/MovieListSection';
import PopularMovieSection from '../components/PopularMovieSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <MovieListSection />
      <PopularMovieSection />
    </div>
  );
};

export default HomePage;
