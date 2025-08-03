import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_KEY, BASE_URL } from "../config/api";
import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, MapPin, Star, Film, Award } from "lucide-react";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const PersonDetailPage = () => {
  const { personId } = useParams();
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        // Fetch person details
        const personResponse = await fetch(
          `${BASE_URL}/person/${personId}?api_key=${API_KEY}&language=en-US`
        );
        if (!personResponse.ok) {
          throw new Error("Failed to fetch person details");
        }
        const personData = await personResponse.json();
        setPerson(personData);

        // Fetch person's movies
        const moviesResponse = await fetch(
          `${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}&language=en-US`
        );
        if (moviesResponse.ok) {
          const moviesData = await moviesResponse.json();
          // Sort by popularity and take top 10
          const sortedMovies = moviesData.cast
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 10);
          setMovies(sortedMovies);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonDetails();
  }, [personId]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;
  if (!person) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const calculateAge = (birthDate, deathDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    return age;
  };

  return (
    <>
      <Helmet>
        <title>{person.name} | LPMovie</title>
        <meta
          name="description"
          content={person.biography || `Thông tin về ${person.name}`}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            to=".."
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại
          </Link>

          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-2">
                  {person.name}
                </h1>
                {person.known_for_department && (
                  <p className="text-xl opacity-90">
                    {person.known_for_department}
                  </p>
                )}
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Image */}
                <div className="lg:w-1/3">
                  <div className="relative">
                    <img
                      src={
                        person.profile_path
                          ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                          : "https://via.placeholder.com/400x600?text=No+Image"
                      }
                      alt={person.name}
                      className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
                    />
                    {person.popularity && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Star size={16} />
                        {person.popularity.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Person Info */}
                <div className="lg:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-gray-500" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Ngày sinh</p>
                        <p className="font-semibold">
                          {formatDate(person.birthday)}
                        </p>
                        {person.birthday && (
                          <p className="text-sm text-gray-400">
                            ({calculateAge(person.birthday)} tuổi)
                          </p>
                        )}
                      </div>
                    </div>

                    {person.deathday && (
                      <div className="flex items-center gap-3">
                        <Calendar className="text-red-500" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Ngày mất</p>
                          <p className="font-semibold text-red-600">
                            {formatDate(person.deathday)}
                          </p>
                        </div>
                      </div>
                    )}

                    {person.place_of_birth && (
                      <div className="flex items-center gap-3">
                        <MapPin className="text-gray-500" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Nơi sinh</p>
                          <p className="font-semibold">
                            {person.place_of_birth}
                          </p>
                        </div>
                      </div>
                    )}

                    {person.known_for_department && (
                      <div className="flex items-center gap-3">
                        <Award className="text-gray-500" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Nghề nghiệp</p>
                          <p className="font-semibold">
                            {person.known_for_department}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Biography */}
                  {person.biography && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        Tiểu sử
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {person.biography}
                      </p>
                    </div>
                  )}

                  {/* External Links */}
                  {person.homepage && (
                    <div className="mb-6">
                      <a
                        href={person.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Trang web chính thức
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Movies Section */}
          {movies.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Film className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">
                  Phim nổi bật
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative aspect-[2/3]">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-t-xl"
                      />
                      {movie.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star size={12} />
                          {movie.vote_average.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {movie.character && `Vai diễn: ${movie.character}`}
                      </p>
                      {movie.release_date && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(movie.release_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PersonDetailPage;
