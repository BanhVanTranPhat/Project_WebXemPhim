import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// eslint-disable-next-line react/prop-types
const MovieSlider = ({ movies, theme = 'default' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const moviesPerPage = 5;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
        // eslint-disable-next-line react/prop-types
      prevIndex + moviesPerPage >= movies.length ? 0 : prevIndex + moviesPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
        // eslint-disable-next-line react/prop-types
      prevIndex - moviesPerPage < 0 ? movies.length - moviesPerPage : prevIndex - moviesPerPage
    );
  };

  return (
    <div className={`relative ${theme === 'popular' ? 'bg-gray-200' : ''}`}>
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
      >
        <FaChevronLeft />
      </button>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / moviesPerPage)}%)` }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="w-1/5 flex-shrink-0 px-2 min-w-40">
              <Link to={`/movie/${movie.id}`} className="block">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <h3 className="mt-2 text-sm md:text-lg font-semibold">{movie.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default MovieSlider;
