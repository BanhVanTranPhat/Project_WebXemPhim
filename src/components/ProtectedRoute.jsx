import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, requiresPremium = false }) => {
  const { user, isPremium } = useContext(UserContext);

  // Nếu không có người dùng, chuyển hướng đến trang đăng nhập
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Nếu yêu cầu premium và người dùng không phải là premium, chuyển hướng đến trang thanh toán
  if (requiresPremium && !isPremium) {
    return <Navigate to="/payment" />;
  }

  return children; // Trả về nội dung con nếu có quyền truy cập
};

// Định nghĩa kiểu cho các prop
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiresPremium: PropTypes.bool,
};

export default ProtectedRoute;
