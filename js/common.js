/**
 * Common Logic, Data Models & Shared Utilities
 */

const DEFAULT_ATTENDANCE = [
  {
    id: "att-1",
    date: "10/09/2026",
    dateLabel: "Hôm nay",
    subDate: "Thứ Năm • Đã xác nhận đầy đủ",
    totalCong: 2.0,
    statusText: "2.0 công",
    workers: [
      { id: "w1", code: "G", name: "Giới", sang: true, chieu: true, cong: 1.0, color: "blue" },
      { id: "w2", code: "K", name: "Khiêm", sang: true, chieu: true, cong: 1.0, color: "green" }
    ],
    thu: 1000000,
    chi: 100000,
    location: "Nhà máy A - Lắp ráp dây chuyền sản xuất tự động",
    category: "work"
  },
  {
    id: "att-2",
    date: "09/09/2026",
    dateLabel: "Hôm qua",
    subDate: "Thứ Tư • Ca kỹ thuật",
    totalCong: 1.5,
    statusText: "1.5 công",
    workers: [
      { id: "w1", code: "G", name: "Giới ", sang: true, chieu: true, cong: 1.0, color: "blue" },
      { id: "w2", code: "K", name: "Khiêm", sang: true, chieu: false, cong: 0.5, color: "indigo" }
    ],
    thu: 750000,
    chi: 50000,
    location: "Giao hàng & sửa chữa máy B",
    category: "repair"
  },
  {
    id: "att-3",
    date: "08/09/2026",
    dateLabel: "08/09/2026",
    subDate: "Thứ Ba • Bảo trì định kỳ",
    totalCong: 1.0,
    statusText: "1.0 công",
    workers: [
      { id: "w4", code: "N4", name: "Người 4", sang: true, chieu: true, cong: 1.0, color: "orange" }
    ],
    thu: 500000,
    chi: 0,
    location: "Bảo trì định kỳ máy dập khu B",
    category: "maintenance"
  }
];

const DEFAULT_FINANCE = [
  {
    id: "fn-1",
    type: "thu",
    amount: 1000000,
    formattedAmount: "+1.000.000 đ",
    date: "10/09/2026 • 15:40",
    title: "Tạm ứng công trình Nhà máy A",
    member: "A",
    memberColor: "blue",
    method: "Chuyển khoản Vietcombank",
    methodIcon: "fa-credit-card",
    status: "Đã khớp",
    statusBg: "bg-slate-100 text-slate-700"
  },
  {
    id: "fn-2",
    type: "chi",
    amount: 100000,
    formattedAmount: "-100.000 đ",
    date: "10/09/2026 • 11:15",
    title: "Mua vật tư ốc vít, mũi khoan",
    member: "B",
    memberColor: "green",
    method: "Hóa đơn lẻ tiệm điện nước",
    methodIcon: "fa-file-invoice",
    status: "Có ảnh bill",
    statusBg: "bg-blue-50 text-blue-700"
  },
  {
    id: "fn-3",
    type: "thu",
    amount: 750000,
    formattedAmount: "+750.000 đ",
    date: "09/09/2026 • 17:02",
    title: "Khách thanh toán sửa máy B",
    member: "C",
    memberColor: "purple",
    method: "Tiền mặt tại xưởng",
    methodIcon: "fa-money-bill-wave",
    status: "Thủ quỹ nhận",
    statusBg: "bg-blue-50 text-blue-700"
  },
  {
    id: "fn-4",
    type: "chi",
    amount: 250000,
    formattedAmount: "-250.000 đ",
    date: "08/09/2026 • 08:30",
    title: "Đổ xăng xe tải nhóm",
    member: "B",
    memberColor: "green",
    method: "Người 2 chi tiền túi",
    methodIcon: "fa-user",
    status: "Cần hoàn trả",
    statusBg: "bg-rose-50 text-rose-600 font-medium"
  },
  {
    id: "fn-5",
    type: "thu",
    amount: 15000000,
    formattedAmount: "+15.000.000 đ",
    date: "05/09/2026 • 10:20",
    title: "Quyết toán đợt 1 HD-004",
    member: "D",
    memberColor: "indigo",
    method: "Chuyển khoản BIDV doanh nghiệp",
    methodIcon: "fa-building-columns",
    status: "Hợp đồng lớn",
    statusBg: "bg-blue-50 text-blue-700 font-medium"
  }
];

const DEFAULT_INVOICES = [
  {
    id: "hd-006",
    code: "#HD-006",
    client: "Công ty Cơ Khí HINH",
    address: "Khu công nghiệp Tân Bình, TP.HCM",
    phone: "0968 123 456",
    date: "10/09/2026",
    desc: "Bảng kế hoạch chi tiết gia công & lắp đặt thiết bị xưởng",
    timeframe: "Tháng 7 & Tháng 8/2026",
    totalAmount: 28688000,
    advanceAmount: 10000000,
    remainingAmount: 18688000,
    status: "debt", // 'debt', 'paid'
    statusLabel: "Còn nợ 18.688.000 đ",
    statusClass: "bg-rose-100 text-rose-700 border border-rose-200",
    isPaid: false,
    itemsJuly: [
      { id: "a1", date: "15/07/2026", name: "Cuốn lại motor cốt chính", unit: "cái", qty: 1, price: 750000, total: 750000, note: "Motor máy cắt số 2 phân xưởng A" },
      { id: "a2", date: "22/07/2026", name: "Thay bạc đạn và gia công trục máy", unit: "bộ", qty: 2, price: 3625000, total: 7250000, note: "Linh kiện Nhật Bản" }
    ],
    itemsAugust: [
      { id: "a3", date: "05/08/2026", name: "Bảo dưỡng định kỳ dây chuyền cán", unit: "gói", qty: 1, price: 15000000, total: 15000000, note: "" },
      { id: "a4", date: "18/08/2026", name: "Sửa máy xếp khay & cân chỉnh sensor", unit: "cái", qty: 2, price: 2844000, total: 5688000, note: "" }
    ]
  },
  {
    id: "hd-005",
    code: "#HD-005",
    client: "Anh Nam Q.7",
    address: "Quận 7, TP.HCM",
    phone: "0908 777 888",
    date: "08/09/2026",
    desc: "Sửa chữa và bảo dưỡng hệ thống bơm nước làm mát",
    timeframe: "Tháng 8/2026",
    totalAmount: 4500000,
    advanceAmount: 0,
    remainingAmount: 0,
    status: "paid",
    statusLabel: "Đã thanh toán",
    statusClass: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    isPaid: true
  },
  {
    id: "hd-004",
    code: "#HD-004",
    client: "Xưởng Gỗ Minh Phát",
    address: "Bình Dương",
    phone: "0918 333 444",
    date: "02/09/2026",
    desc: "Cuốn lại 3 motor công suất lớn & thay bộ dây curoa tải công nghiệp",
    timeframe: "Tháng 8/2026",
    totalAmount: 15000000,
    advanceAmount: 5000000,
    remainingAmount: 0,
    status: "paid",
    statusLabel: "Đã thanh toán",
    statusClass: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    isPaid: true
  },
  {
    id: "hd-003",
    code: "#HD-003",
    client: "Nhà máy May Sài G",
    address: "Bình Tân, TP.HCM",
    phone: "0938 111 222",
    date: "28/08/2026",
    desc: "Bảo dưỡng hệ thống điện may công nghiệp",
    timeframe: "Tháng 8/2026",
    totalAmount: 17612000,
    advanceAmount: 0,
    remainingAmount: 0,
    status: "paid",
    statusLabel: "Đã thu đủ",
    statusClass: "bg-emerald-100 text-emerald-800",
    isPaid: true
  }
];

// LocalStorage helpers
function getAttendanceList() {
  return JSON.parse(localStorage.getItem("app_attendance")) || DEFAULT_ATTENDANCE;
}
function setAttendanceList(data) {
  localStorage.setItem("app_attendance", JSON.stringify(data));
}

function getFinanceList() {
  return JSON.parse(localStorage.getItem("app_finance")) || DEFAULT_FINANCE;
}
function setFinanceList(data) {
  localStorage.setItem("app_finance", JSON.stringify(data));
}

function getInvoiceList() {
  return JSON.parse(localStorage.getItem("app_invoices")) || DEFAULT_INVOICES;
}
function setInvoiceList(data) {
  localStorage.setItem("app_invoices", JSON.stringify(data));
}

// Formatting helpers
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

function showToast(message, type = "success") {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.className = "fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 text-xs font-semibold pointer-events-none";
    toast.innerHTML = `<i id="toast-icon" class="fas fa-circle-check text-emerald-400 text-base"></i><span id="toast-text">${message}</span>`;
    document.body.appendChild(toast);
  } else {
    document.getElementById("toast-text").textContent = message;
    const icon = document.getElementById("toast-icon");
    if (type === "success") icon.className = "fas fa-circle-check text-emerald-400 text-base";
    else if (type === "error") icon.className = "fas fa-triangle-exclamation text-rose-400 text-base";
    else icon.className = "fas fa-circle-info text-blue-400 text-base";
  }

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

// Auto highlight bottom nav based on active page
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.toLowerCase();
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");

  navItems.forEach(item => {
    const page = item.getAttribute("data-page");
    if (page && currentPath.includes(page)) {
      item.classList.add("active");
      item.classList.remove("text-slate-400");
      item.classList.add("text-blue-600");
    } else {
      item.classList.remove("active");
      item.classList.remove("text-blue-600");
      item.classList.add("text-slate-400");
    }
  });
});

