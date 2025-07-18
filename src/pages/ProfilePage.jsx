import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_KEY, BASE_URL } from "../config/api";
import { useEffect } from "react";

const randomAvatar = (username) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    username || "user"
  )}`;

const ProfilePage = () => {
  const { user, logout } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [playlistMovies, setPlaylistMovies] = useState([]);

  useEffect(() => {
    // Lấy thông tin phim trong playlist từ TMDB
    const fetchPlaylist = async () => {
      if (user?.watchlist?.length > 0) {
        const movies = await Promise.all(
          user.watchlist.map(async (id) => {
            const res = await fetch(
              `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
            );
            if (res.ok) return await res.json();
            return null;
          })
        );
        setPlaylistMovies(movies.filter(Boolean));
      } else {
        setPlaylistMovies([]);
      }
    };
    fetchPlaylist();
  }, [user?.watchlist]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Bạn chưa đăng nhập!</h1>
        <Link to="/login" className="text-blue-500 underline">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const handleChangePassword = (e) => {
    e.preventDefault();
    setShowModal(false);
    setOldPass("");
    setNewPass("");
    toast.success("Đổi mật khẩu thành công! (demo)");
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10">
      <div className="flex flex-col items-center mb-8">
        <img
          src={randomAvatar(user.username)}
          alt="avatar"
          className="w-32 h-32 rounded-full border-4 border-blue-400 shadow mb-4"
        />
        <h2 className="text-3xl font-bold mb-2">{user.username}</h2>
        <div className="flex items-center gap-2 mb-2">
          {user.isPremium || user.role === "vip" ? (
            <span className="bg-yellow-400 text-white px-3 py-1 rounded-full font-semibold text-sm">
              VIP
            </span>
          ) : null}
          {user.role === "admin" && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
              Admin
            </span>
          )}
        </div>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500 text-sm">
          Role: {user.role ? user.role : user.isPremium ? "vip" : "Không rõ"}
        </p>
        <button
          onClick={logout}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow"
        >
          Đăng xuất
        </button>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Thông tin tài khoản</h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Email: {user.email}</li>
          <li>
            Trạng thái:{" "}
            {user.role === "admin"
              ? "Admin"
              : user.isPremium || user.role === "vip"
              ? "VIP/Premium"
              : "Thường"}
          </li>
          <li>
            Ngày đăng ký:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Không rõ"}
          </li>
        </ul>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Playlist (Yêu thích)</h3>
        {playlistMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {playlistMovies.map((movie) => (
              <a
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition p-2 text-center"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <div className="font-semibold text-sm truncate">
                  {movie.title}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Chưa có phim nào trong playlist.</p>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Ratings</h3>
        {user.ratings && user.ratings.length > 0 ? (
          <ul className="list-disc pl-6">
            {user.ratings.map((r, idx) => (
              <li key={idx}>
                Phim: {r.movie} - Đánh giá: {r.rating}/10
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chưa có đánh giá nào.</p>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Bảo mật</h3>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
          onClick={() => setShowModal(true)}
        >
          Đổi mật khẩu
        </button>
      </div>
      {/* Modal đổi mật khẩu */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            onSubmit={handleChangePassword}
            className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4 w-full max-w-sm"
          >
            <h2 className="text-xl font-bold mb-2">Đổi mật khẩu (demo)</h2>
            <input
              type="password"
              placeholder="Mật khẩu cũ"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="border rounded px-3 py-2"
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex-1"
              >
                Xác nhận
              </button>
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-semibold flex-1"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
