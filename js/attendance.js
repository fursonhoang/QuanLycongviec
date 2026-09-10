/**
 * Attendance Screen & Add Attendance Modal Logic
 */

let currentAttendanceFilter = "all";
let currentAttendanceSearch = "";

function renderAttendancePage() {
  const container = document.getElementById("attendance-cards-list");
  if (!container) return;

  const list = getAttendanceList();
  let filtered = list;

  if (currentAttendanceSearch.trim()) {
    const kw = currentAttendanceSearch.toLowerCase().trim();
    filtered = filtered.filter(item => 
      item.date.includes(kw) || 
      item.location.toLowerCase().includes(kw) ||
      item.workers.some(w => w.name.toLowerCase().includes(kw))
    );
  }

  if (currentAttendanceFilter !== "all") {
    filtered = filtered.filter(item => 
      item.workers.some(w => w.name.includes(currentAttendanceFilter) || w.code === currentAttendanceFilter)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <i class="fas fa-calendar-xmark text-4xl mb-3 text-slate-300"></i>
        <p class="text-sm">Không tìm thấy bản ghi chấm công nào</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-4">
      <div class="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-800 text-[15px]">${item.date}</span>
            ${item.dateLabel === 'Hôm nay' ? `
              <span class="bg-blue-100 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">Hôm nay</span>
            ` : ''}
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5">${item.subDate}</p>
        </div>
        <div class="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 flex items-center gap-1.5">
          <i class="fas fa-check-circle text-blue-600"></i>
          <span>${item.totalCong.toFixed(1)} công</span>
        </div>
      </div>

      <div class="bg-slate-50/70 rounded-xl p-3 mb-3 space-y-2.5">
        ${item.workers.map(w => `
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                ${w.code}
              </span>
              <span class="font-semibold text-slate-800 text-[13px]">${w.name}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 ${w.sang ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}">
                <i class="fas ${w.sang ? 'fa-check' : 'fa-minus'} text-[9px]"></i> Sáng
              </span>
              <span class="px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 ${w.chieu ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}">
                <i class="fas ${w.chieu ? 'fa-check' : 'fa-minus'} text-[9px]"></i> Chiều
              </span>
              <span class="font-semibold text-slate-700 text-[12px] min-w-[50px] text-right">
                ${w.cong.toFixed(1)} công
              </span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="grid grid-cols-2 gap-2 mb-3">
        <div class="bg-emerald-50/60 rounded-xl p-2.5 border border-emerald-100 flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-arrow-down text-xs"></i>
          </div>
          <div>
            <div class="text-[10px] text-emerald-700 font-medium">Tiền Thu</div>
            <div class="text-xs font-bold text-emerald-700">+${new Intl.NumberFormat('vi-VN').format(item.thu)} đ</div>
          </div>
        </div>

        <div class="bg-rose-50/60 rounded-xl p-2.5 border border-rose-100 flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-arrow-up text-xs"></i>
          </div>
          <div>
            <div class="text-[10px] text-rose-700 font-medium">Tiền Chi</div>
            <div class="text-xs font-bold text-rose-700">${item.chi > 0 ? '-' + new Intl.NumberFormat('vi-VN').format(item.chi) : '0'} đ</div>
          </div>
        </div>
      </div>

      <div class="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 flex items-start gap-2 mb-3">
        <i class="fas fa-location-dot text-blue-500 text-xs mt-0.5"></i>
        <span class="leading-relaxed">${item.location}</span>
      </div>

      <div class="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
        <button onclick="showToast('Xem chi tiết ca ngày ${item.date}', 'info')" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition">
          <i class="fas fa-eye text-slate-500"></i> Chi tiết
        </button>
        <a href="attendance-create.html" class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold flex items-center gap-1.5 transition">
          <i class="fas fa-pen text-blue-500"></i> Sửa
        </a>
      </div>
    </div>
  `).join('');
}

