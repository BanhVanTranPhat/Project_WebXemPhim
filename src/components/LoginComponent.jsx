// src/components/LoginComponent.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import toast from "react-hot-toast";

function LoginComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, setUser, logout } = useContext(UserContext);
  const navigate = useNavigate();

  // Hàm kiểm tra định dạng email
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  // Hàm kiểm tra độ mạnh mật khẩu (ít nhất 6 ký tự, có số, chữ cái)
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  // Hàm kiểm tra username không chứa ký tự đặc biệt
  const validateUsername = (username) => /^[a-zA-Z0-9_]+$/.test(username);

  // Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateUsername(username)) {
      setErrorMessage("Tên người dùng chỉ được chứa chữ, số và dấu gạch dưới.");
      toast.error("Tên người dùng không hợp lệ!");
      return;
    }
    if (!validatePassword(password)) {
      setErrorMessage("Mật khẩu phải ít nhất 6 ký tự, bao gồm cả chữ và số.");
      toast.error("Mật khẩu không hợp lệ!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const userData = await response.json();
        // Nếu localStorage đã có user VIP thì giữ nguyên trạng thái VIP
        const localUser = localStorage.getItem("user");
        let finalUser = userData.user;
        if (localUser) {
          const parsed = JSON.parse(localUser);
          if (parsed.isPremium || parsed.role === "vip") {
            finalUser = { ...finalUser, isPremium: true, role: "vip" };
          }
        }
        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
        if (userData.token) {
          localStorage.setItem("token", userData.token);
        }
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        toast.error(errorData.message || "Đăng nhập thất bại!");
      }
    } catch {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      toast.error("Lỗi kết nối server!");
    }
  };

  // Hàm xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateUsername(username)) {
      setErrorMessage("Tên người dùng chỉ được chứa chữ, số và dấu gạch dưới.");
      toast.error("Tên người dùng không hợp lệ!");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Email không hợp lệ.");
      toast.error("Email không hợp lệ!");
      return;
    }
    if (!validatePassword(password)) {
      setErrorMessage("Mật khẩu phải ít nhất 6 ký tự, bao gồm cả chữ và số.");
      toast.error("Mật khẩu không hợp lệ!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Đăng ký thành công!");
        navigate("/");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        toast.error(errorData.message || "Đăng ký thất bại!");
      }
    } catch {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      toast.error("Lỗi kết nối server!");
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      console.error("logout function is not defined in UserContext");
    }
  };

  // Nếu người dùng đã đăng nhập, hiển thị thông tin chào mừng và nút đăng xuất
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-4xl font-bold mb-4 text-center text-white">
          Chào, {user.username}!
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
        >
          Đăng Xuất
        </button>
      </div>
    );
  }

  // Giao diện đăng nhập/đăng ký
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md bg-gray-700 rounded-lg shadow-md gap-7 flex flex-col items-center justify-center h-screen my-[10%]">
        <h2 className="text-4xl font-bold mb-4 text-center text-white">
          {isRegister ? "Đăng Ký" : "Đăng Nhập"}
        </h2>
        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="flex flex-col gap-4 justify-center"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tên Người Dùng"
            required
            className="w-72 rounded-lg border-2 border-gray-400 p-1"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật Khẩu"
            required
            className="w-72 rounded-lg border-2 border-gray-400 p-1"
          />
          {isRegister && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-72 rounded-lg border-2 border-gray-400 p-1"
            />
          )}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-200 text-white font-bold py-2 px-4 rounded-lg w-72"
          >
            {isRegister ? "Đăng Ký" : "Đăng Nhập"}
          </button>
        </form>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-white"
        >
          {isRegister
            ? "Đã có tài khoản? Đăng Nhập"
            : "Chưa có tài khoản? Đăng Ký"}
        </button>
      </div>
    </div>
  );
}

export default LoginComponent;
