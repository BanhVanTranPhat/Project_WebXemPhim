// src/App.jsx
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeaderSection from "./components/HeaderSection";
import FooterSection from "./components/FooterSection";
import { UserProvider } from "./Context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NetworkStatus from "./components/NetworkStatus";
import PerformanceMonitor from "./components/PerformanceMonitor";
// Lazy load các page lớn
const OptimizedHomePage = lazy(() => import("./pages/OptimizedHomePage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const PersonDetailPage = lazy(() => import("./pages/PersonDetailPage"));
const LoginComponent = lazy(() => import("./components/LoginComponent"));
const SimpleAllMoviesPage = lazy(() => import("./pages/SimpleAllMoviesPage"));
const PremiumContent = lazy(() => import("./components/PremiumContent"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const WatchMovies = lazy(() => import("./components/WatchMovies"));
const VideoPlayer = lazy(() => import("./components/VideoPlayer"));
const VideoPlayerDetail = lazy(() => import("./components/VideoPlayerDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <HeaderSection />
          <main className="flex-grow">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<OptimizedHomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} />
                <Route
                  path="/person/:personId"
                  element={<PersonDetailPage />}
                />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/category/" element={<SimpleAllMoviesPage />} />
                <Route
                  path="/category/:genre"
                  element={<SimpleAllMoviesPage />}
                />
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
                <Route path="/premium" element={<PremiumContent />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <FooterSection />
        </div>
        <NetworkStatus />
        <PerformanceMonitor />
      </Router>
    </UserProvider>
  );
}

export default App;
