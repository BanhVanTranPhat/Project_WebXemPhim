import React, { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { Menu, X, ChevronDown, Search, User } from "lucide-react";

const HeaderSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  // Unified click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  // Xử lý click nút Premium
  const handlePremiumClick = () => {
    if (!user) {
      navigate("/login");
    } else if (user.isPremium || user.role === "vip" || user.role === "admin") {
      navigate("/watch");
    } else {
      navigate("/payment");
    }
  };

  // Categories data
  const categories = [
    { name: "All Movies", path: "/category" },
    { name: "Drama", path: "/category/drama" },
    { name: "Comedy", path: "/category/comedy" },
    { name: "Horror", path: "/category/horror" },
  ];

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold flex items-center space-x-2"
          >
            <span>LPMovie</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
            {/* Categories Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
              >
                <span>Menu</span>
                <ChevronDown size={16} />
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 transition-all duration-300 origin-top-right opacity-100 scale-100 animate-fade-in">
                  {categories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex-1 max-w-md"
            >
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Premium Button */}
            <button
              onClick={handlePremiumClick}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Premium
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
                >
                  <User size={20} />
                  <span>{user.username}</span>
                  {user.isPremium || user.role === "vip" ? (
                    <span className="ml-1 bg-yellow-400 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      VIP
                    </span>
                  ) : null}
                  {user.role === "admin" && (
                    <span className="ml-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      Admin
                    </span>
                  )}
                  <ChevronDown size={16} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 transition-all duration-300 origin-top-right opacity-100 scale-100 animate-fade-in">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Thông tin cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Đăng xuất
                    </button>
                    <span className="ml-2">
                      {user.isPremium || user.role === "vip" ? (
                        <span className="bg-yellow-400 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                          VIP
                        </span>
                      ) : null}
                      {user.role === "admin" && (
                        <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold ml-1">
                          Admin
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-gray-700 rounded-lg p-4 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-600 text-white rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={18} />
              </button>
            </form>

            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className="block px-4 py-2 text-white hover:bg-gray-600 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <button
              onClick={() => {
                handlePremiumClick();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-center bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Premium
            </button>

            {user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-white hover:bg-gray-600 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Thông tin cá nhân
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Đăng xuất
                </button>
                <span className="ml-2">
                  {user.isPremium || user.role === "vip" ? (
                    <span className="bg-yellow-400 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      VIP
                    </span>
                  ) : null}
                  {user.role === "admin" && (
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold ml-1">
                      Admin
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default HeaderSection;
