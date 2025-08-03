import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { fetchProtectedData } from "../config/api";

const PremiumContent = () => {
  const { user, isLoggedIn, isPremium } = useContext(UserContext);
  const navigate = useNavigate();
  const [content, setContent] = useState(null);

  useEffect(() => {
    const handlePremiumAccess = async () => {
      console.log("PremiumContent - User:", user);
      console.log("PremiumContent - isLoggedIn:", isLoggedIn);
      console.log("PremiumContent - isPremium:", isPremium);

      if (!isLoggedIn) {
        console.log("User not logged in, redirecting to login");
        navigate("/login"); // Chuyển đến trang đăng nhập nếu chưa đăng nhập
        return; // Dừng thực thi để tránh việc gọi API khi chưa đăng nhập
      }

      // Kiểm tra premium theo logic nhất quán với ProtectedRoute
      const isUserPremium =
        isPremium || user?.role === "vip" || user?.role === "admin";
      console.log("PremiumContent - isUserPremium:", isUserPremium);

      if (!isUserPremium) {
        console.log("User not premium, redirecting to payment");
        navigate("/payment"); // Chuyển đến trang thanh toán nếu chưa có premium
        return; // Dừng thực thi để tránh việc gọi API khi không có quyền truy cập
      }

      // Lấy nội dung premium
      try {
        console.log("Fetching premium content...");
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        const response = await fetch(
          "http://localhost:5001/api/users/premium-content",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Premium content received:", data);
          setContent(data);
        } else {
          console.error("Failed to fetch premium content:", response.status);
        }
      } catch (error) {
        console.error("Không thể truy cập nội dung premium:", error);
      }
    };

    handlePremiumAccess();
  }, [isLoggedIn, isPremium, user, navigate]);

  return (
    <div>
      <div style={{ padding: "20px", background: "#f0f0f0", margin: "10px" }}>
        <h3>Debug Info:</h3>
        <p>User: {JSON.stringify(user, null, 2)}</p>
        <p>isLoggedIn: {isLoggedIn.toString()}</p>
        <p>isPremium: {isPremium.toString()}</p>
        <p>User Role: {user?.role}</p>
        <p>User isPremium: {user?.isPremium?.toString()}</p>
        <p>LocalStorage User: {localStorage.getItem("user")}</p>
        <p>LocalStorage Token: {localStorage.getItem("token")}</p>
        <button
          onClick={() => {
            console.log("Current localStorage:", {
              user: localStorage.getItem("user"),
              token: localStorage.getItem("token"),
            });
            window.location.reload();
          }}
          style={{
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Reload Page
        </button>
        <button
          onClick={async () => {
            const token = localStorage.getItem("token");
            console.log("Testing API call with token:", token);
            try {
              const response = await fetch(
                "http://localhost:5001/api/users/premium-content",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log("API Response status:", response.status);
              if (response.ok) {
                const data = await response.json();
                console.log("API Response data:", data);
                setContent(data);
              } else {
                console.error("API call failed:", response.status);
              }
            } catch (error) {
              console.error("API call error:", error);
            }
          }}
          style={{
            padding: "10px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Test API Call
        </button>
      </div>

      {content ? (
        <div>{content}</div> // Hiển thị nội dung premium
      ) : (
        <p>Đang tải nội dung premium...</p> // Hiển thị thông báo đang tải
      )}
    </div>
  );
};

export default PremiumContent;
