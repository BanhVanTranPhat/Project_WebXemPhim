# 🎬 LPMovie - Web Xem Phim Online

## 📖 Mô tả

LPMovie là một ứng dụng web xem phim online được xây dựng với React, Vite và Node.js. Ứng dụng cung cấp trải nghiệm xem phim mượt mà với các tính năng tìm kiếm, lọc và quản lý playlist.

**🌐 Live Demo:** [phatphim.netlify.app](https://phatphim.netlify.app/)  
**📂 GitHub Repository:** [https://github.com/BanhVanTranPhat/Project_WebXemPhim](https://github.com/BanhVanTranPhat/Project_WebXemPhim)

## ✨ Tính năng chính

### 🎯 Core Features

- **Tìm kiếm phim thông minh** - Tìm kiếm với debouncing và server-side filtering
- **Lọc phim nâng cao** - Theo thể loại, năm, rating, sắp xếp
- **Infinite scrolling** - Load thêm phim tự động khi scroll
- **Lazy loading** - Tối ưu hóa performance với image lazy loading
- **Offline support** - Service Worker cho trải nghiệm offline
- **Responsive design** - Hoạt động tốt trên mọi thiết bị
- **Video player** - Xem phim trực tiếp với subtitle support
- **User authentication** - Đăng ký, đăng nhập, quản lý profile
- **Admin panel** - Quản lý nội dung cho admin

### 🔧 Technical Features

- **Performance optimization** - Caching, code splitting, bundle optimization
- **Real-time monitoring** - Performance metrics và error tracking
- **Security** - Helmet, rate limiting, input validation
- **Developer experience** - Hot reload, debugging tools, performance monitor
- **PWA support** - Progressive Web App capabilities
- **Database integration** - MongoDB với Mongoose
- **API integration** - TMDB API cho dữ liệu phim

## 🚀 Cài đặt và chạy

### Prerequisites

- Node.js (v16+)
- npm hoặc yarn
- MongoDB (cho backend)

### Installation

1. **Clone repository**

```bash
git clone https://github.com/BanhVanTranPhat/Project_WebXemPhim.git
cd Project_WebXemPhim
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Cài đặt backend dependencies**

```bash
cd backend
npm install
cd ..
```

4. **Cấu hình environment variables**

Tạo file `.env` trong thư mục gốc:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/Movies_Database

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Environment
NODE_ENV=development

# API Keys (optional)
TMDB_API_KEY=your_tmdb_api_key_here
```

5. **Khởi động MongoDB**

```bash
# Nếu dùng MongoDB local
mongod

# Hoặc sử dụng MongoDB Atlas
# Cập nhật MONGODB_URI trong .env
```

6. **Chạy development server**

```bash
npm run dev
```

7. **Truy cập ứng dụng**

```
Frontend: http://localhost:5173
Backend API: http://localhost:5001
```

## 📁 Cấu trúc project

```
Project_WebXemPhim/
├── src/
│   ├── components/          # React components
│   │   ├── OptimizedMovieCard.jsx
│   │   ├── OptimizedMovieGrid.jsx
│   │   ├── OptimizedFilterSidebar.jsx
│   │   ├── PerformanceMonitor.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── LoginComponent.jsx
│   │   └── NetworkStatus.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── AllMoviesPage.jsx
│   │   ├── MovieDetailPage.jsx
│   │   ├── AdminHomePage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── PaymentPage.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useOptimizedMovies.js
│   │   ├── useServiceWorker.js
│   │   └── usePerformanceMetrics.js
│   ├── config/             # Configuration files
│   │   └── api.jsx
│   ├── Context/            # React Context
│   │   └── UserContext.jsx
│   └── utils/              # Utility functions
│       └── performanceInit.js
├── backend/                # Backend server
│   ├── server.js
│   ├── controllers/
│   │   ├── videoController.js
│   │   └── ...
│   ├── models/
│   │   ├── movies.js
│   │   ├── users.js
│   │   └── videos.js
│   └── routes/
│       ├── movies.js
│       ├── users.js
│       └── videoRoutes.js
├── public/                 # Static assets
│   ├── sw.js              # Service Worker
│   ├── offline.html       # Offline page
│   ├── video/             # Video files
│   └── subtitles/         # Subtitle files
└── docs/                  # Documentation
    ├── PERFORMANCE_IMPROVEMENTS.md
    ├── COMPREHENSIVE_IMPROVEMENTS.md
    └── BUGFIXES.md
```

## 🔧 Scripts

```bash
# Development
npm run dev          # Chạy cả frontend và backend
npm run server       # Chỉ chạy backend
npm run client       # Chỉ chạy frontend

# Build
npm run build        # Build production version
npm run preview      # Preview production build

# Linting
npm run lint         # ESLint check
npm run lint:fix     # Fix linting errors
```

## 📊 Performance Metrics

### Trước khi tối ưu:

- **Bundle Size**: ~2MB
- **API Calls**: 10-15 per search
- **Load Time**: 3-5 seconds
- **Cache Hit Rate**: 0%

### Sau khi tối ưu:

- **Bundle Size**: ~800KB (60% reduction)
- **API Calls**: 2-3 per search (80% reduction)
- **Load Time**: 1-2 seconds (60% improvement)
- **Cache Hit Rate**: 70-80%

## 🛠️ Development Tools

### Performance Monitor

- **Hotkey**: `Ctrl+Shift+P` để toggle
- **Metrics**: FPS, Memory, Load times, API calls

### Service Worker

- **Offline caching** cho static assets
- **API response caching**
- **Background sync**

### Debug Tools

```javascript
// Trong browser console
window.debugMetrics(); // Xem performance metrics
window.performanceMetrics; // Truy cập metrics object
```

## 🐛 Troubleshooting

### Website trắng

1. Kiểm tra console errors
2. Restart development server: `npm run dev`
3. Clear browser cache
4. Kiểm tra network tab trong DevTools

### Invalid Hook Call Error

```bash
# Xóa cache và cài lại
rm -rf node_modules package-lock.json dist .vite
npm install
npm run dev
```

### MongoDB Connection Error

```bash
# Kiểm tra MongoDB service
mongod --version
# Khởi động MongoDB
mongod
```

### Build Errors

```bash
# Cài đặt terser nếu cần
npm install terser --save-dev

# Fix linting errors
npm run lint --fix
```

## 📈 Monitoring

### Performance Monitoring

- **Lighthouse**: Audit performance score
- **Chrome DevTools**: Network và Performance tabs
- **React DevTools**: Component profiling

### Error Tracking

- **Console logs**: Development debugging
- **Performance metrics**: Real-time monitoring
- **Service Worker**: Offline behavior

## 🎯 Best Practices

### Code Organization

- Sử dụng path aliases (`@components`, `@pages`)
- Tách logic vào custom hooks
- Memoize components với `React.memo`

### Performance

- Lazy load components và images
- Debounce search inputs
- Cache API responses
- Optimize bundle size

### Security

- Validate user inputs
- Sanitize data
- Use HTTPS in production
- Implement rate limiting

## 📚 Documentation

- [Performance Improvements](./PERFORMANCE_IMPROVEMENTS.md)
- [Comprehensive Improvements](./COMPREHENSIVE_IMPROVEMENTS.md)
- [Bug Fixes](./BUGFIXES.md)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🙏 Acknowledgments

- **TMDB API** - Dữ liệu phim
- **React** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **MongoDB** - Database
- **Express.js** - Backend framework

---

**LPMovie** - Nơi giải trí không giới hạn! 🎬✨

*Developed with ❤️ by [BanhVanTranPhat](https://github.com/BanhVanTranPhat)*
