/**
 * Finance Screen Logic (pages/finance.html)
 */

let currentFinanceFilter = "all";

function renderFinancePage() {
  const container = document.getElementById("finance-transactions-list");
  if (!container) return;

  const list = getFinanceList();
  let filtered = list;

  if (currentFinanceFilter === "thu") {
    filtered = filtered.filter(f => f.type === "thu");
  } else if (currentFinanceFilter === "chi") {
    filtered = filtered.filter(f => f.type === "chi");
  }

  // Update badge counts
  const totalCount = list.length;
  const thuCount = list.filter(f => f.type === "thu").length;
  const chiCount = list.filter(f => f.type === "chi").length;

  const elAll = document.getElementById("count-all");
  const elThu = document.getElementById("count-thu");
  const elChi = document.getElementById("count-chi");

  if (elAll) elAll.textContent = `(${totalCount})`;
  if (elThu) elThu.textContent = `(${thuCount})`;
  if (elChi) elChi.textContent = `(${chiCount})`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-slate-400">
        <i class="fas fa-receipt text-3xl mb-2 text-slate-300"></i>
        <p class="text-xs">Không có khoản giao dịch nào</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isThu = item.type === "thu";
    return `
      <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-3 card-touchable">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${isThu ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
              <i class="fas ${isThu ? 'fa-arrow-down' : 'fa-arrow-up'} text-[9px]"></i>
              ${isThu ? 'THU' : 'CHI'}
            </span>
            <span class="text-[11px] text-slate-400">${item.date}</span>
          </div>

          <span class="font-bold text-[14px] ${isThu ? 'text-emerald-600' : 'text-rose-600'}">
            ${isThu ? '+' : '-'}${new Intl.NumberFormat('vi-VN').format(item.amount)} đ
          </span>
        </div>

        <div class="flex items-center justify-between mb-2.5">
          <h4 class="font-bold text-slate-800 text-[14px] leading-snug">${item.title}</h4>
          <span class="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 ml-2">
            ${item.member}
          </span>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
          <div class="flex items-center gap-1.5 truncate max-w-[200px]">
            <i class="fas ${item.methodIcon || 'fa-credit-card'} text-slate-400 text-xs"></i>
            <span class="truncate">${item.method}</span>
          </div>
          <span class="text-[11px] px-2 py-0.5 rounded-full ${item.statusBg || 'bg-slate-100 text-slate-600'}">
            ${item.status}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

