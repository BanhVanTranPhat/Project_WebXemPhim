import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const movieId = "1022789"; // Inside Out 2 ID

  return (
    <div className="relative h-screen">
      <img
        src="/inside_out_2_poster.jpg"
        alt="Inside Out 2 Poster"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center text-white bg-black bg-opacity-50 px-10">
        <h1 className="text-4xl font-bold mb-4">Inside Out 2</h1>
        <p className="text-xl mb-8">
          2024 | Comedy, Family, Animation | 1 hour 36 minutes
        </p>
        <Link
          to={`/movie/${movieId}`}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold w-fit text-center"
        >
          Explore Now
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
