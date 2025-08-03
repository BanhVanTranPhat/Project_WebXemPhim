const API_KEY = "93cc5a5cea9affd653dde6ecf3f0114b";
const BASE_URL = "https://api.themoviedb.org/3";
const BACKEND_URL = "http://localhost:5001";

export { API_KEY, BASE_URL, BACKEND_URL };

// Cache utility
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// Optimized API fetcher with caching
export const fetchWithCache = async (url, options = {}) => {
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  const cached = getCachedData(cacheKey);

  if (cached) {
    // Track cache hit
    if (window.performanceMetrics) {
      window.performanceMetrics.trackCacheHit();
    }
    return cached;
  }

  // Track cache miss
  if (window.performanceMetrics) {
    window.performanceMetrics.trackCacheMiss();
  }

  const startTime = performance.now();

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setCachedData(cacheKey, data);

    // Track successful API call
    const duration = performance.now() - startTime;
    if (window.performanceMetrics) {
      window.performanceMetrics.trackApiCall(url, duration, true);
    }

    return data;
  } catch (error) {
    // Track failed API call
    const duration = performance.now() - startTime;
    if (window.performanceMetrics) {
      window.performanceMetrics.trackApiCall(url, duration, false);
    }

    console.error("API fetch error:", error);
    throw error;
  }
};

// Search API with debouncing
export const searchMovies = async (query, page = 1) => {
  if (!query.trim()) {
    return { results: [], total_pages: 0 };
  }

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
    query
  )}&page=${page}&include_adult=false`;
  return fetchWithCache(url);
};

// Discover API for filtering
export const discoverMovies = async (filters = {}, page = 1) => {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    page: page.toString(),
    include_adult: "false",
    ...filters,
  });

  const url = `${BASE_URL}/discover/movie?${params}`;
  return fetchWithCache(url);
};

// Hàm để lấy dữ liệu bảo vệ với token
export const fetchProtectedData = async (endpoint) => {
  // Nếu endpoint đã có full URL, sử dụng trực tiếp
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BACKEND_URL}${endpoint}`;

  try {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    });

    if (response.ok) {
      return await response.json(); // Trả về dữ liệu JSON nếu thành công
    } else {
      const errorData = await response.json(); // Lấy dữ liệu lỗi
      throw new Error(errorData.message || "Unauthorized access"); // Ném lỗi với thông điệp rõ ràng
    }
  } catch (error) {
    console.error("Lỗi khi truy cập nội dung bảo vệ:", error);
    throw error; // Ném lỗi ra ngoài để xử lý ở nơi khác
  }
};
