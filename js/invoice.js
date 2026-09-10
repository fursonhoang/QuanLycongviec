/**
 * Invoice Management, Creation & A4 Print Preview Logic
 */

// Format numbers
function formatMoney(n) {
  return new Intl.NumberFormat('vi-VN').format(n);
}

// Render Invoices Listing Screen (pages/invoices.html)
function renderInvoicesPage() {
  const container = document.getElementById("invoices-list-container");
  if (!container) return;

  const invoices = getInvoiceList();
  let filter = window.currentInvoiceFilter || "all";
  let search = (window.currentInvoiceSearch || "").toLowerCase().trim();

  let filtered = invoices.filter(inv => {
    if (filter === "paid" && !inv.isPaid) return false;
    if (filter === "debt" && inv.isPaid) return false;
    if (search) {
      return inv.client.toLowerCase().includes(search) || 
             inv.code.toLowerCase().includes(search) ||
             (inv.desc && inv.desc.toLowerCase().includes(search));
    }
    return true;
  });

  // Calculate Metrics
  const totalMoney = invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const totalPaid = invoices.reduce((sum, i) => sum + (i.isPaid ? i.totalAmount : (i.advanceAmount || 0)), 0);
  const totalRemaining = invoices.reduce((sum, i) => sum + (i.remainingAmount || 0), 0);

  const elTotal = document.getElementById("stat-total-money");
  const elPaid = document.getElementById("stat-total-paid");
  const elRemaining = document.getElementById("stat-total-remaining");

  if (elTotal) elTotal.textContent = (totalMoney / 1000000).toFixed(1) + "M";
  if (elPaid) elPaid.textContent = (totalPaid / 1000000).toFixed(1) + "M";
  if (elRemaining) elRemaining.textContent = (totalRemaining / 1000000).toFixed(1) + "M";

  const elSubTotal = document.getElementById("stat-sub-total");
  const elSubPaid = document.getElementById("stat-sub-paid");
  const elSubRemaining = document.getElementById("stat-sub-remaining");

  if (elSubTotal) elSubTotal.textContent = formatMoney(totalMoney) + " đ";
  if (elSubPaid) elSubPaid.textContent = formatMoney(totalPaid) + " đ";
  if (elSubRemaining) elSubRemaining.textContent = formatMoney(totalRemaining) + " đ";

  // Render cards
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <i class="fas fa-file-invoice text-4xl mb-3 text-slate-300"></i>
        <p class="text-xs">Không tìm thấy hóa đơn phù hợp</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(inv => {
    // Detail Card for HD-006 with debt
    if (inv.id === "hd-006" || !inv.isPaid) {
      return `
        <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-3.5 relative overflow-hidden border-l-4 border-l-rose-500">
          <!-- Card Header -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="font-black text-slate-900 text-sm">${inv.code}</span>
              <span class="bg-rose-50 text-rose-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> ${inv.statusLabel}
              </span>
            </div>
            <button class="text-slate-400 hover:text-slate-600 p-1">
              <i class="fas fa-ellipsis-vertical"></i>
            </button>
          </div>

          <!-- Client & Date -->
          <h3 class="font-extrabold text-slate-900 text-base mb-0.5">${inv.client}</h3>
          <p class="text-[11px] text-slate-400 mb-2.5">Lập ngày: ${inv.date}</p>

          <!-- Description Box -->
          <div class="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 mb-3 border border-slate-100">
            <div class="font-medium mb-1.5 leading-snug">${inv.desc}</div>
            <div class="text-[11px] text-slate-500 flex items-center gap-1.5">
              <i class="far fa-calendar text-blue-500 text-xs"></i>
              <span>${inv.timeframe || 'Tháng 7 & Tháng 8/2026'}</span>
            </div>
          </div>

          <!-- Price & Advance Details -->
          <div class="flex items-center justify-between text-xs mb-2.5">
            <div>
              <span class="text-slate-400 text-[11px] block">Tổng giá trị:</span>
              <span class="font-bold text-slate-800 text-sm">${formatMoney(inv.totalAmount)} đ</span>
            </div>
            <div class="text-right">
              <span class="text-slate-400 text-[11px] block">Đã tạm ứng:</span>
              <span class="font-bold text-rose-600 text-sm">-${formatMoney(inv.advanceAmount)} đ</span>
            </div>
          </div>

          <!-- Remaining Highlight Capsule -->
          <div class="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 flex items-center justify-between mb-3 text-xs">
            <div class="flex items-center gap-2 text-blue-900 font-bold text-[11px]">
              <i class="far fa-credit-card text-blue-600"></i>
              <span>CÒN PHẢI THANH TOÁN:</span>
            </div>
            <span class="font-black text-blue-600 text-sm">${formatMoney(inv.remainingAmount)} đ</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <a href="invoice-detail.html?id=${inv.id}" class="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-center flex items-center justify-center gap-1.5 transition">
              <i class="fas fa-eye text-xs"></i> Xem chi tiết
            </a>
            <a href="invoice-create.html?id=${inv.id}" class="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 transition">
              <i class="fas fa-pen text-xs"></i> Sửa
            </a>
            <a href="invoice-detail.html?id=${inv.id}&export=pdf" class="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 transition">
              <i class="far fa-file-pdf text-xs text-rose-500"></i> PDF
            </a>
          </div>
        </div>
      `;
    }

    // Paid cards (HD-005, HD-004)
    if (inv.id === "hd-005" || inv.id === "hd-004") {
      return `
        <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-3.5 card-touchable">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="font-black text-slate-900 text-sm">${inv.code}</span>
              <span class="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đã thanh toán
              </span>
            </div>
            <button class="text-slate-400 hover:text-slate-600 p-1">
              <i class="fas fa-ellipsis-vertical"></i>
            </button>
          </div>

          <h3 class="font-extrabold text-slate-900 text-base mb-0.5">${inv.client}</h3>
          <p class="text-[11px] text-slate-400 mb-2">Lập ngày: ${inv.date}</p>
          <p class="text-xs text-slate-600 mb-3 leading-snug">${inv.desc}</p>

          <div class="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-2.5 text-center text-xs mb-3 border border-slate-100">
            <div>
              <span class="text-[10px] text-slate-400 block">Tổng tiền</span>
              <span class="font-bold text-slate-800 text-[11px]">${formatMoney(inv.totalAmount)} đ</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Đã thanh toán</span>
              <span class="font-bold text-emerald-600 text-[11px]">${formatMoney(inv.totalAmount)} đ</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Còn lại</span>
              <span class="font-bold text-slate-600 text-[11px]">0 đ</span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 text-xs">
            <a href="invoice-detail.html?id=${inv.id}" class="py-1.5 px-3 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center gap-1.5">
              <i class="fas fa-eye text-xs"></i> Xem chi tiết
            </a>
            <a href="invoice-detail.html?id=${inv.id}&export=pdf" class="py-1.5 px-3 rounded-lg bg-slate-100 text-slate-600 font-bold flex items-center gap-1">
              <i class="far fa-file-pdf text-rose-500"></i> Xuất PDF
            </a>
          </div>
        </div>
      `;
    }

    // Compact item (HD-003)
    return `
      <div class="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm mb-3 flex items-center justify-between card-touchable">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <i class="far fa-file-lines text-lg"></i>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-slate-900 text-xs">${inv.code}</span>
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div class="font-bold text-slate-800 text-xs">${inv.client}</div>
            <div class="text-[10px] text-slate-400">Lập ngày: ${inv.date}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-black text-slate-900 text-sm">${formatMoney(inv.totalAmount)} đ</div>
          <div class="text-[10px] text-emerald-600 font-bold">Đã thu đủ</div>
        </div>
      </div>
    `;
  }).join('');
}

// Calculate Create Invoice Form (pages/invoice-create.html)
function recalculateCreateInvoice() {
  let julyTotal = 0;
  let augustTotal = 0;

  // July items
  const julyItems = document.querySelectorAll(".item-july");
  julyItems.forEach(row => {
    const qty = parseFloat(row.querySelector(".input-qty")?.value || 1);
    const price = parseFloat(row.querySelector(".input-price")?.value || 0);
    const lineTotal = qty * price;
    const lineDisplay = row.querySelector(".display-line-total");
    if (lineDisplay) lineDisplay.textContent = formatMoney(lineTotal) + " đ";
    julyTotal += lineTotal;
  });

  // August items
  const augItems = document.querySelectorAll(".item-august");
  augItems.forEach(row => {
    const qty = parseFloat(row.querySelector(".input-qty")?.value || 1);
    const price = parseFloat(row.querySelector(".input-price")?.value || 0);
    const lineTotal = qty * price;
    const lineDisplay = row.querySelector(".display-line-total");
    if (lineDisplay) lineDisplay.textContent = formatMoney(lineTotal) + " đ";
    augustTotal += lineTotal;
  });

  const totalServices = julyTotal + augustTotal;

  // Advance deduction
  const switchAdvance = document.getElementById("switch-advance");
  const isAdvanceOn = switchAdvance ? switchAdvance.checked : true;
  const advanceInput = document.getElementById("input-advance-amount");
  const advanceAmount = isAdvanceOn ? (parseFloat(advanceInput?.value) || 0) : 0;

  const remaining = Math.max(0, totalServices - advanceAmount);

  // Update displays
  const elJuly = document.getElementById("display-july-total");
  const elAug = document.getElementById("display-august-total");
  const elServices = document.getElementById("display-total-services");
  const elDeduct = document.getElementById("display-deduct-advance");
  const elRemaining = document.getElementById("display-final-remaining");

  if (elJuly) elJuly.textContent = formatMoney(julyTotal) + " đ";
  if (elAug) elAug.textContent = formatMoney(augustTotal) + " đ";
  if (elServices) elServices.textContent = formatMoney(totalServices) + " đ";
  if (elDeduct) elDeduct.textContent = "-" + formatMoney(advanceAmount) + " đ";
  if (elRemaining) elRemaining.textContent = formatMoney(remaining);
}

