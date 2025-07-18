// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Thêm trạng thái premium và đăng nhập
  const isLoggedIn = !!user;
  const isPremium = user?.isPremium || false;

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
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
