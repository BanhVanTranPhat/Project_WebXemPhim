# Bug Fixes và Troubleshooting

## 🐛 Các lỗi đã sửa

### 1. Infinite Loop trong OptimizedAllMoviesPage

**Vấn đề**:

```
Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
```

**Nguyên nhân**:

- `useEffect` trong `OptimizedAllMoviesPage` có dependency `[selectedCategories, filters, updateFilters]`
- `updateFilters` thay đổi `filters`
- `filters` lại là dependency của `useEffect`
- Tạo ra infinite loop

**Giải pháp**:

1. Tách riêng logic trong `useOptimizedMovies` hook
2. Tạo `SimpleAllMoviesPage` với logic đơn giản hơn
3. Loại bỏ circular dependencies

### 2. Lỗi trong Backend Models

**Vấn đề**:

```javascript
export default mongoose.model("Movie", userSchema); // ❌ Sai
```

**Giải pháp**:

```javascript
export default mongoose.model("Movie", movieSchema); // ✅ Đúng
```

### 3. Performance Issues

**Vấn đề**:

- API calls quá nhiều
- Không có caching
- Debounce chưa tối ưu

**Giải pháp**:

- Thêm caching system
- Optimize debounce timing
- Implement service worker

## 🔧 Các cải thiện đã thực hiện

### 1. SimpleAllMoviesPage

**Tính năng**:

- Logic đơn giản, dễ debug
- Không có infinite loop
- Vẫn giữ được tất cả tính năng chính
- Performance tốt hơn

**Cách hoạt động**:

```javascript
// Fetch movies function
const fetchMovies = useCallback(
  async (currentPage = 1, reset = false) => {
    // Logic đơn giản, không có circular dependencies
  },
  [searchQuery, selectedCategories]
);

// Separate effects để tránh infinite loop
useEffect(() => {
  setPage(1);
  setMovies([]);
  setHasMore(true);
  fetchMovies(1, true);
}, [searchQuery, selectedCategories]);
```

### 2. Optimized Hook Structure

**Trước**:

```javascript
// ❌ Infinite loop
useEffect(() => {
  fetchMovies(1, true);
}, [searchQuery, filters, fetchMovies]); // fetchMovies depends on filters
```

**Sau**:

```javascript
// ✅ Tách riêng logic
useEffect(() => {
  if (searchQuery !== "") {
    fetchMovies(1, true);
  }
}, [searchQuery]);

useEffect(() => {
  if (searchQuery === "") {
    fetchMovies(1, true);
  }
}, [filters]);
```

## 🚀 Cách test

### 1. Test Search Functionality

```bash
# Chạy development server
npm run dev

# Truy cập http://localhost:5173/category/
# Thử tìm kiếm phim
# Kiểm tra console không có lỗi infinite loop
```

### 2. Test Category Filtering

```bash
# Chọn các thể loại phim
# Kiểm tra URL params được cập nhật
# Kiểm tra movies được filter đúng
```

### 3. Test Performance

```bash
# Mở Chrome DevTools
# Tab Network - kiểm tra API calls
# Tab Performance - kiểm tra không có infinite re-renders
```

## 📊 Performance Metrics

### Trước khi sửa:

- **Infinite Loop**: ✅ Có
- **API Calls**: ❌ Quá nhiều
- **Memory Usage**: ❌ Tăng liên tục
- **User Experience**: ❌ Lag, freeze

### Sau khi sửa:

- **Infinite Loop**: ❌ Không còn
- **API Calls**: ✅ Tối ưu
- **Memory Usage**: ✅ Ổn định
- **User Experience**: ✅ Mượt mà

## 🔍 Debugging Tips

### 1. Kiểm tra Infinite Loop

```javascript
// Thêm vào component để debug
useEffect(() => {
  console.log("Component re-rendered");
}, []); // Empty dependency array
```

### 2. Kiểm tra API Calls

```javascript
// Thêm vào fetch function
console.log("API call:", url);
console.log("Response:", data);
```

### 3. Kiểm tra State Changes

```javascript
// Thêm vào state setters
setMovies((prev) => {
  console.log("Movies updated:", prev.length, "->", data.results.length);
  return [...prev, ...(data.results || [])];
});
```

## 🎯 Best Practices

### 1. useEffect Dependencies

```javascript
// ❌ Tránh
useEffect(() => {
  // logic
}, [object, function]); // object và function thay đổi mỗi render

// ✅ Nên làm
useEffect(() => {
  // logic
}, [primitiveValue]); // Chỉ primitive values
```

### 2. useCallback Optimization

```javascript
// ❌ Tránh
const handleClick = () => {
  // logic
};

// ✅ Nên làm
const handleClick = useCallback(() => {
  // logic
}, [dependencies]);
```

### 3. State Management

```javascript
// ❌ Tránh
setState(newState); // Có thể gây re-render không cần thiết

// ✅ Nên làm
setState((prev) => {
  if (prev === newState) return prev;
  return newState;
});
```

## 🚨 Common Issues và Solutions

### 1. Maximum update depth exceeded

**Nguyên nhân**: Circular dependencies trong useEffect
**Giải pháp**: Tách logic, sử dụng useCallback, memo

### 2. Memory leaks

**Nguyên nhân**: Không cleanup useEffect
**Giải pháp**: Return cleanup function

### 3. Performance issues

**Nguyên nhân**: Re-renders không cần thiết
**Giải pháp**: React.memo, useMemo, useCallback

## 📝 Kết luận

Các lỗi đã được sửa thành công:

1. ✅ Infinite loop trong OptimizedAllMoviesPage
2. ✅ Backend model errors
3. ✅ Performance issues
4. ✅ Memory leaks

Project hiện tại hoạt động ổn định và có performance tốt.
