import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const featuredMovies = [
  {
    id: "693134", // Dune: Part Two
    title: "Dune: Part Two",
    year: 2024,
    genres: "Action, Adventure, Sci-Fi",
    duration: "2 hours 46 minutes",
    image:
      "https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
  },
  {
    id: "667538", // Transformers: Rise of the Beasts
    title: "Transformers: Rise of the Beasts",
    year: 2023,
    genres: "Action, Adventure, Sci-Fi",
    duration: "2 hours 7 minutes",
    image:
      "https://image.tmdb.org/t/p/original/gPbM0MK8CP8A174rmUwGsADNYKD.jpg",
  },
  {
    id: "787699", // Wonka
    title: "Wonka",
    year: 2023,
    genres: "Comedy, Family, Fantasy",
    duration: "1 hour 56 minutes",
    image:
      "https://image.tmdb.org/t/p/original/qhb1qOilapbapxWQn9jtRCMwXJF.jpg",
  },
];

const API_KEY = "93cc5a5cea9affd653dde6ecf3f0114b";
const BASE_URL = "https://api.themoviedb.org/3";

const HeroSection = () => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowTrailer = async (movieId) => {
    // Gọi TMDB API lấy trailer
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    );
    const data = await res.json();
    const trailer = data.results.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );
    if (trailer) {
      setTrailerKey(trailer.key);
      setShowModal(true);
    } else {
      setTrailerKey(null);
      setShowModal(false);
      alert("Không tìm thấy trailer!");
    }
  };

  return (
    <div className="w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-xl shadow-lg mx-auto mt-4">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full"
      >
        {featuredMovies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-full">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover object-center absolute inset-0 z-0"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              {/* Caption */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 md:px-20 text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in">
                  {movie.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 drop-shadow-lg animate-fade-in">
                  {movie.year} | {movie.genres} | {movie.duration}
                </p>
                <button
                  onClick={() => handleShowTrailer(movie.id)}
                  className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg font-semibold w-fit text-center text-xl shadow-lg transition-transform duration-300 hover:scale-105 animate-bounce"
                >
                  Watch trailer
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Modal trailer */}
      {showModal && trailerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-0 right-0 p-2 text-white text-2xl"
            >
              ×
            </button>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube trailer"
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

export default HeroSection;
