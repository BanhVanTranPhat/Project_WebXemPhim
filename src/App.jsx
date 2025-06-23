// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeaderSection from "./components/HeaderSection";
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import LoginComponent from "./components/LoginComponent";
import FooterSection from "./components/FooterSection";
import AllMoviesPage from "./pages/AllMoviesPage";
import PremiumContent from "./components/PremiumContent";
import { UserContext } from "./Context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";
import WatchMovies from "./components/WatchMovies";
import VideoPlayer from "./components/VideoPlayer";
import VideoList from "./components/VideoListComp";
import VideoPlayerDetail from "./components/VideoPlayerDetail";
import AdminHomePage from "./pages/AdminHomePage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      // Implement session check logic here
      // For example, make an API call to verify the user's session
      // If valid, setUser with the user data
    };

    checkUserSession();
  }, []);

  const logout = () => {
    // Implement logout logic here
    // For example, clear user session and update state
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <HeaderSection />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/category/" element={<AllMoviesPage />} />
              <Route
                path="/check/category/watchmovies/:_id"
                element={<VideoPlayerDetail />}
              />
              <Route path="/watch" element={<VideoPlayer />} />
              <Route path="/watch/:_id" element={<WatchMovies />} />
              <Route path="/payment" element={<PaymentPage />} />
              {/* <Route path="/category/watch" element={<WatchMovies />} /> */}
              <Route
                path="/premium"
                element={
                  <ProtectedRoute>
                    <PremiumContent />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<AdminHomePage />} />
            </Routes>
          </main>
          <FooterSection />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
