import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_KEY, BASE_URL } from '../config/api';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false); // State to manage video player visibility

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovie(data);

        // Fetch trailer details
        const trailerResponse = await fetch(
          `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
        );
        const trailerData = await trailerResponse.json();
        const trailer = trailerData.results.find(video => video.type === 'Trailer');
        if (trailer) {
          setMovie(prevMovie => ({ ...prevMovie, trailer_key: trailer.key })); // Store the trailer key
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleWatchTrailer = () => {
    setIsVideoOpen(true); // Show the video player
  };

  const closeVideoPlayer = () => {
    setIsVideoOpen(false); // Hide the video player
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title} 
          className="w-full md:w-1/3 rounded-lg shadow-lg mb-4 md:mb-0" 
        />
        <div className="md:ml-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-600 mb-4">{movie.release_date} | {movie.runtime} min</p>
          <p className="mb-4 text-xl">{movie.overview}</p>
          <p className="font-semibold">Rating: {movie.vote_average.toFixed(1)}/10</p>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Categories:</h2>
            <ul className="list-disc pl-5">
              {movie.genres.map(genre => (
                <li key={genre.id} className="text-gray-600">{genre.name}</li>
              ))}
            </ul>
          </div>
          <button 
            onClick={handleWatchTrailer} 
            className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Watch Trailer
          </button>
        </div>
      </div>

      {/* Video Player Modal */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeVideoPlayer} // Close video on overlay click
        >
          <div className="relative w-full max-w-2xl" onClick={e => e.stopPropagation()}> {/* Prevent click from closing when clicking inside the video */}
            <button onClick={closeVideoPlayer} className="absolute top-0 right-0 p-2 text-white">X</button>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
