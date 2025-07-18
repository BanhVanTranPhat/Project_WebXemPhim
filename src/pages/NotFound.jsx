import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
    <p className="text-xl mb-6">Trang không tồn tại hoặc đã bị xóa.</p>
    <Link
      to="/"
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Về trang chủ
    </Link>
  </div>
);

export default NotFound;
