import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { fetchProtectedData } from "../config/api";

const PremiumContent = () => {
  const { isLoggedIn, isPremium } = useContext(UserContext);
  const navigate = useNavigate();
  const [content, setContent] = useState(null);

  useEffect(() => {
    const handlePremiumAccess = async () => {
      if (!isLoggedIn) {
        navigate("/login"); // Chuyển đến trang đăng nhập nếu chưa đăng nhập
        return; // Dừng thực thi để tránh việc gọi API khi chưa đăng nhập
      }

      if (!isPremium) {
        navigate("/payment"); // Chuyển đến trang thanh toán nếu chưa có premium
        return; // Dừng thực thi để tránh việc gọi API khi không có quyền truy cập
      }

      // Lấy nội dung premium
      try {
        const data = await fetchProtectedData("http://localhost:5001/api/users/premium-content");
        setContent(data);
      } catch (error) {
        console.error("Không thể truy cập nội dung premium:", error);
      }
    };

    handlePremiumAccess();
  }, [isLoggedIn, isPremium, navigate]);

  return (
    <div>
      {content ? (
        <div>{content}</div> // Hiển thị nội dung premium
      ) : (
        <p>Đang tải nội dung premium...</p> // Hiển thị thông báo đang tải
      )}
    </div>
  );
};

export default PremiumContent;
