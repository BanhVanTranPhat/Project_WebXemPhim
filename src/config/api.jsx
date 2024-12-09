const API_KEY = '93cc5a5cea9affd653dde6ecf3f0114b';
const BASE_URL = 'https://api.themoviedb.org/3';

export { API_KEY, BASE_URL };

// Hàm để lấy dữ liệu bảo vệ với token
export const fetchProtectedData = async (endpoint) => {
    const url = `${BASE_URL}${endpoint}`; // Kết hợp BASE_URL với endpoint

    try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}` // Thêm token vào headers
            }
        });

        if (response.ok) {
            return await response.json(); // Trả về dữ liệu JSON nếu thành công
        } else {
            const errorData = await response.json(); // Lấy dữ liệu lỗi
            throw new Error(errorData.message || "Unauthorized access"); // Ném lỗi với thông điệp rõ ràng
        }
    } catch (error) {
        console.error("Lỗi khi truy cập nội dung bảo vệ:", error);
        throw error; // Ném lỗi ra ngoài để xử lý ở nơi khác
    }
};

