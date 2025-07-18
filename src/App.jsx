// src/App.jsx
import { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeaderSection from "./components/HeaderSection";
import FooterSection from "./components/FooterSection";
import { UserContext } from "./Context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
// Lazy load các page lớn
const HomePage = lazy(() => import("./pages/HomePage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const LoginComponent = lazy(() => import("./components/LoginComponent"));
const AllMoviesPage = lazy(() => import("./pages/AllMoviesPage"));
const PremiumContent = lazy(() => import("./components/PremiumContent"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const WatchMovies = lazy(() => import("./components/WatchMovies"));
const VideoPlayer = lazy(() => import("./components/VideoPlayer"));
const VideoPlayerDetail = lazy(() => import("./components/VideoPlayerDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const checkUserSession = async () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };
    checkUserSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <HeaderSection />
          <main className="flex-grow">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/category/" element={<AllMoviesPage />} />
                <Route path="/category/:genre" element={<AllMoviesPage />} />
                <Route
                  path="/check/category/watchmovies/:_id"
                  element={<VideoPlayerDetail />}
                />
                <Route
                  path="/watch"
                  element={
                    <ProtectedRoute requiresPremium={true}>
                      <VideoPlayer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/watch/:_id"
                  element={
                    <ProtectedRoute requiresPremium={true}>
                      <WatchMovies />
                    </ProtectedRoute>
                  }
                />
                <Route path="/payment" element={<PaymentPage />} />
                {/* <Route path="/category/watch" element={<WatchMovies />} /> */}
                <Route
                  path="/premium"
                  element={user ? <PremiumContent /> : <LoginComponent />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <FooterSection />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
