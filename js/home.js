import { supabase } from "./supabase.js";

const money = value => new Intl.NumberFormat("vi-VN").format(Number(value) || 0);
const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[character]));

function setText(id, value) { const element = document.getElementById(id); if (element) element.textContent = value; }
function emptyState(text) { return `<div class="text-center py-6 text-slate-400 text-xs">${text}</div>`; }

async function loadHomeData() {
  const [attendanceResult, transactionResult, invoiceResult] = await Promise.all([
    supabase.from("attendance").select("*, employees(name)").order("work_date", { ascending: false }),
    supabase.from("transactions").select("*").order("transaction_date", { ascending: false }),
    supabase.from("invoices").select("*").order("created_at", { ascending: false })
  ]);
  if (attendanceResult.error) throw attendanceResult.error;
  if (transactionResult.error) throw transactionResult.error;
  if (invoiceResult.error) throw invoiceResult.error;

  const attendance = attendanceResult.data || [];
  const transactions = transactionResult.data || [];
  const invoices = invoiceResult.data || [];
  const totalWork = attendance.reduce((sum, row) => sum + (Number(row.work_count) || 0), 0);
  const totalIncome = transactions.filter(row => row.type === "income").reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const totalExpense = transactions.filter(row => row.type === "expense").reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  setText("home-total-work", `${totalWork.toFixed(1)} công`);
  setText("home-total-income", `+${money(totalIncome)} đ`);
  setText("home-total-expense", `-${money(totalExpense)} đ`);
  setText("home-balance", `${money(totalIncome - totalExpense)} đ`);
  renderRecentAttendance(attendance);
  renderRecentInvoices(invoices);
}

function renderRecentAttendance(rows) {
  const element = document.getElementById("home-recent-attendance");
  if (!element) return;
  if (!rows.length) { element.innerHTML = emptyState("Chưa có dữ liệu chấm công"); return; }
  const grouped = new Map();
  rows.forEach(row => {
    const date = String(row.work_date).slice(0, 10);
    if (!grouped.has(date)) grouped.set(date, { date, total: 0, workers: [] });
    const item = grouped.get(date);
    item.total += Number(row.work_count) || 0;
    item.workers.push(row.employees?.name || "Nhân sự");
  });
  element.innerHTML = [...grouped.values()].slice(0, 2).map(item => `<div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-3"><div class="flex items-center justify-between"><div><span class="font-bold text-slate-800 text-[14px]">${escapeHtml(item.date)}</span><div class="text-xs text-slate-500 mt-1">${escapeHtml(item.workers.join(" & "))}</div></div><span class="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">${item.total.toFixed(1)} công</span></div></div>`).join("");
}

function renderRecentInvoices(invoices) {
  const element = document.getElementById("home-recent-invoices");
  if (!element) return;
  if (!invoices.length) { element.innerHTML = emptyState("Chưa có hóa đơn"); return; }
  element.innerHTML = invoices.slice(0, 2).map(invoice => `<a href="invoices.html" class="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-3 flex items-center justify-between block"><div><div class="font-bold text-blue-600 text-xs">${escapeHtml(invoice.code || invoice.id)}</div><div class="font-semibold text-slate-800 text-sm">${escapeHtml(invoice.client || invoice.customer_name || "Hóa đơn")}</div></div><div class="font-bold text-slate-900 text-sm">${money(invoice.total_amount ?? invoice.totalAmount)} đ</div></a>`).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  try { await loadHomeData(); }
  catch (error) { console.error("Không thể tải dashboard từ Supabase:", error); document.getElementById("home-recent-attendance").innerHTML = emptyState("Không thể tải dữ liệu"); document.getElementById("home-recent-invoices").innerHTML = emptyState("Không thể tải dữ liệu"); }
});
