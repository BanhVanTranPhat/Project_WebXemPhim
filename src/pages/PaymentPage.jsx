import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const isVip =
    user?.isPremium || user?.role === "vip" || user?.role === "admin";

  const handlePayment = async () => {
    if (user) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5001/api/users/update-premium",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const newUser = {
            ...user,
            isPremium: data.isPremium,
            role: data.role,
          };
          setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));
          setSuccess(true);
          toast.success("Thanh toán thành công! Bạn đã trở thành VIP.");
          setTimeout(() => navigate("/watch"), 1200);
        } else {
          toast.error("Lỗi cập nhật premium trên server!");
        }
      } catch (e) {
        toast.error("Lỗi kết nối server!");
      }
    }
  };

  if (isVip) {
    navigate("/watch");
    return null;
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          Thanh toán thành công!
        </h1>
        <p className="mb-4">Bạn đã trở thành thành viên Premium (VIP).</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
        <strong className="font-bold">Premium chỉ 99.000đ/tháng!</strong>
        <span className="block">
          Trở thành thành viên VIP để xem phim chất lượng cao, không giới hạn.
        </span>
      </div>
      <button
        onClick={handlePayment}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg text-lg shadow"
      >
        Thanh Toán
      </button>
    </div>
  );
};

export default PaymentPage;
