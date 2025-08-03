import React from "react";
import HeroSection from "../components/HeroSection";
import OptimizedMovieListSection from "../components/OptimizedMovieListSection";
import OptimizedPopularMovieSection from "../components/OptimizedPopularMovieSection";
import { Helmet } from "react-helmet";

const OptimizedHomePage = () => {
  return (
    <>
      <Helmet>
        <title>Trang chủ | LPMovie</title>
        <meta
          name="description"
          content="Xem phim online chất lượng cao, phim mới cập nhật liên tục."
        />
        <meta name="keywords" content="phim online, xem phim, phim mới, phim hay" />
        <meta property="og:title" content="LPMovie - Xem phim online" />
        <meta property="og:description" content="Xem phim online chất lượng cao, phim mới cập nhật liên tục." />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="preconnect" href="https://image.tmdb.org" />
      </Helmet>
      <HeroSection />
      <OptimizedMovieListSection />
      <OptimizedPopularMovieSection />
    </>
  );
};

export default OptimizedHomePage; 