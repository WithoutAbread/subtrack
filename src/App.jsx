// src/App.jsx
import { useState, useEffect } from 'react'
import './index.css'

// ... (Giữ nguyên phần data mẫu và các hàm tính toán ngày tháng cũ) ...
// ... Ví dụ hàm calculateDaysRemaining, formatCurrency ...

function App() {
  // ... (Giữ nguyên useState subscriptions và form) ...

  // --- LOGIC THÔNG MINH MỚI (SMART SORTING) ---

  // 1. Tính toán trước ngày còn lại cho tất cả item
  const enhancedSubscriptions = subscriptions.map(sub => {
    const days = calculateDaysRemaining(sub.nextPaymentDate);
    // Định nghĩa thế nào là "Khẩn cấp": Là dùng thử VÀ còn dưới 3 ngày
    const isUrgent = sub.isTrial && days <= 3 && days >= 0;
    return { ...sub, daysRemaining: days, isUrgent };
  });

  // 2. Sắp xếp danh sách theo thứ tự ưu tiên:
  // Ưu tiên 1: Khẩn cấp (Urgent) lên đầu.
  // Ưu tiên 2: Các cái còn lại xếp theo thời gian gần nhất.
  const smartSortedList = [...enhancedSubscriptions].sort((a, b) => {
    // Nếu a khẩn cấp hơn b, a lên trước (-1)
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    // Nếu cùng mức độ khẩn cấp, ai đến hạn trước thì lên trước
    return a.daysRemaining - b.daysRemaining;
  });


  return (
    <div className="container mx-auto p-4 max-w-md">
      {/* Header Tổng tiền - Giữ nguyên cho đẹp */}
      <header className="mb-8 mt-4">
        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Tổng chi tiêu tháng</p>
        <h1 className="text-5xl font-black text-gray-900 mt-2 flex items-baseline tracking-tight">
          {formatCurrency(totalMonthly)}
          <span className="text-2xl text-gray-500 font-medium ml-1">đ</span>
        </h1>
        {/* Bỏ cái nút "Trung bình ngày" nếu thấy rối, hoặc giữ lại tùy bạn */}
      </header>

      {/* --- DANH SÁCH THÔNG MINH DUY NHẤT --- */}
      <div className="space-y-4">
        {smartSortedList.map((sub) => (
          <div
            key={sub.id}
            // Kích hoạt class 'urgent' nếu nó khẩn cấp
            className={`sub-card ${sub.isUrgent ? 'urgent' : ''}`}
          >
            <div className="card-left">
              {/* Icon (Màu sắc tự động dựa trên tên - Giả lập) */}
              <div className="service-icon" style={{backgroundColor: sub.name.includes('Netflix') ? '#E50914' : sub.name.includes('Apple') ? '#000000' : sub.name.includes('Chat') ? '#10A37F' : '#FF0000'}}>
                 {sub.name.charAt(0)}
              </div>

              <div className="service-info">
                <h3>
                  {sub.name}
                  {/* Badge Dùng thử giờ nằm gọn gàng ở đây */}
                  {sub.isTrial && <span className="trial-badge">Dùng thử</span>}
                </h3>
                {/* Dòng thông báo thông minh */}
                <p className="sub-text">
                  {sub.daysRemaining === 0 ? "Hôm nay!" :
                   sub.daysRemaining === 1 ? "Ngày mai" :
                   sub.daysRemaining > 0 ? `Còn ${sub.daysRemaining} ngày nữa` : "Đã quá hạn"}
                   {/* Nếu khẩn cấp thì thêm dòng nhắc nhở */}
                   {sub.isUrgent && " - Hủy ngay kẻo quên!"}
                </p>
              </div>
            </div>

            <div className="card-right">
              <p className="price">{formatCurrency(sub.price)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Nút thêm mới (Floating Action Button) - Giữ nguyên */}
      <button className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full text-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
        +
      </button>

      {/* (Phần Form thêm mới giữ nguyên, không ảnh hưởng) */}

    </div>
  )
}

export default App
