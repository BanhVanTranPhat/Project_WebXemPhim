import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';

const PaymentPage = () => {
  const { handlePaymentSuccess } = useContext(UserContext);

  const handlePayment = async () => {
    // Thực hiện logic thanh toán ở đây
    const paymentSuccessful = true; // Thay thế bằng logic thanh toán thực tế

    if (paymentSuccessful) {
      handlePaymentSuccess(); // Gọi hàm để cập nhật trạng thái premium
    } else {
      console.error("Payment failed");
    }
  };

  return (
    <div>
      <h1>Trang Thanh Toán</h1>
      <button onClick={handlePayment}>Thanh Toán</button>
    </div>
  );
};

export default PaymentPage;
