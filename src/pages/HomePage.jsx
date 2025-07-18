import React from "react";
import HeroSection from "../components/HeroSection";
import MovieListSection from "../components/MovieListSection";
import PopularMovieSection from "../components/PopularMovieSection";
import { Helmet } from "react-helmet";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Trang chủ | LPMovie</title>
        <meta
          name="description"
          content="Xem phim online chất lượng cao, phim mới cập nhật liên tục."
        />
      </Helmet>
      <HeroSection />
      <MovieListSection />
      <PopularMovieSection />
    </>
  );
};

export default HomePage;
