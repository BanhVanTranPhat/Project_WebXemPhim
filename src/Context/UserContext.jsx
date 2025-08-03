// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // Kiểm tra token có tồn tại và hợp lệ không
    if (!token) {
      localStorage.removeItem("user");
      return null;
    }

    // Kiểm tra token hết hạn (JWT có thời hạn 1 giờ)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp < currentTime) {
        console.log("Token expired, clearing user data");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return null;
      }
    } catch {
      console.log("Invalid token format, clearing user data");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }

    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    console.log("UserContext - Initial user from localStorage:", parsedUser);
    return parsedUser;
  });

  // Thêm trạng thái premium và đăng nhập
  const isLoggedIn = !!user;
  const isPremium = user?.isPremium || false;

  console.log("UserContext - Current user:", user);
  console.log("UserContext - isLoggedIn:", isLoggedIn);
  console.log("UserContext - isPremium:", isPremium);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      console.log("UserContext - Saved user to localStorage:", user);
    } else {
      localStorage.removeItem("user");
      console.log("UserContext - Removed user from localStorage");
    }
  }, [user]);

  const logout = () => {
    setUser(null);
  };

  // Hàm cập nhật trạng thái premium sau khi thanh toán thành công
  const handlePaymentSuccess = () => {
    if (user) {
      const updatedUser = { ...user, isPremium: true };
      setUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        isLoggedIn,
        isPremium,
        handlePaymentSuccess,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
