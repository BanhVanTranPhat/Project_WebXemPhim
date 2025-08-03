import React, { useState, useCallback, useMemo } from "react";
import { Search, Filter, X, Star, Calendar } from "lucide-react";

const OptimizedFilterSidebar = ({
  categories,
  selectedCategories,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onFiltersChange,
  filters = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounced search input
  const handleSearchInput = useCallback(
    (e) => {
      const value = e.target.value;
      setLocalSearchQuery(value);
      onSearchChange(value);
    },
    [onSearchChange]
  );

  // Memoized category list
  const categoryList = useMemo(
    () =>
      categories.map((category) => (
        <label
          key={category.id}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <input
            type="checkbox"
            checked={selectedCategories.includes(category.id)}
            onChange={() => onCategoryChange(category.id)}
            className="rounded text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm">{category.name}</span>
        </label>
      )),
    [categories, selectedCategories, onCategoryChange]
  );

  // Year range filter
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  }, [currentYear]);

  // Rating filter
  const ratingOptions = useMemo(
    () => [
      { value: 0, label: "Tất cả" },
      { value: 7, label: "7+ điểm" },
      { value: 8, label: "8+ điểm" },
      { value: 9, label: "9+ điểm" },
    ],
    []
  );

  return (
    <div className="md:w-1/4">
      <div className="sticky top-4 space-y-6">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            value={localSearchQuery}
            onChange={handleSearchInput}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          {localSearchQuery && (
            <button
              onClick={() => {
                setLocalSearchQuery("");
                onSearchChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden w-full flex items-center justify-between p-3 bg-white rounded-lg shadow border"
        >
          <div className="flex items-center gap-2">
            <Filter size={20} />
            <span className="font-medium">Bộ lọc</span>
          </div>
          <span className="text-sm text-gray-500">
            {isExpanded ? "Ẩn" : "Hiện"}
          </span>
        </button>

        {/* Filter Panel */}
        <div
          className={`bg-white rounded-lg shadow p-6 ${
            isExpanded ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h2 className="text-lg font-semibold">Bộ lọc</h2>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-700">Thể loại</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categoryList}
            </div>
          </div>

          {/* Year Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-700 flex items-center gap-2">
              <Calendar size={16} />
              Năm phát hành
            </h3>
            <select
              value={filters.year || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, year: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả năm</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-700 flex items-center gap-2">
              <Star size={16} />
              Đánh giá tối thiểu
            </h3>
            <select
              value={filters.rating || 0}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  rating: parseFloat(e.target.value),
                })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {ratingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-700">Sắp xếp</h3>
            <select
              value={filters.sortBy || "popularity.desc"}
              onChange={(e) =>
                onFiltersChange({ ...filters, sortBy: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popularity.desc">Phổ biến nhất</option>
              <option value="vote_average.desc">Đánh giá cao nhất</option>
              <option value="release_date.desc">Mới nhất</option>
              <option value="release_date.asc">Cũ nhất</option>
              <option value="title.asc">Tên A-Z</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(selectedCategories.length > 0 ||
            Object.keys(filters).length > 0 ||
            localSearchQuery) && (
            <button
              onClick={() => {
                setLocalSearchQuery("");
                onSearchChange("");
                onFiltersChange({});
                // Clear categories
                selectedCategories.forEach((catId) => onCategoryChange(catId));
              }}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(OptimizedFilterSidebar);
