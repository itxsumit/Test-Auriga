const API_URL = '/api';
let cachedData = null;

async function fetchPoolData() {
  try {
    const res = await fetch(`${API_URL}/pool`);
    const data = await res.json();
    cachedData = data;
    renderDashboard(data);
  } catch (err) {
    console.error("Backend unreachable", err);
  }
}

function renderDashboard(data) {
  document.getElementById('pool-title').innerText = data.title;
  document.getElementById('stat-target').innerText = `₹${data.targetAmount.toLocaleString()}`;
  document.getElementById('stat-collected').innerText = `₹${data.totalCollected.toLocaleString()}`;
  document.getElementById('stat-shortfall').innerText = `₹${data.shortfall.toLocaleString()}`;
  document.getElementById('stat-share').innerText = `₹${data.fairShare.toLocaleString()}`;
  document.getElementById('inbox-count').innerText = data.sentEmails ? data.sentEmails.length : 0;

  const pct = data.targetAmount > 0 ? Math.min(100, Math.round((data.totalCollected / data.targetAmount) * 100)) : 0;
  document.getElementById('stat-percentage').innerText = `${pct}%`;
  document.getElementById('progress-bar').style.width = `${pct}%`;

  const memberSelect = document.getElementById('payMemberSelect');
  memberSelect.innerHTML = data.breakdown.map(b => `<option value="${b.member}">${b.member}</option>`).join('');

  // 1. PROFESSIONAL NEUTRAL TABLE WITH MUTED ACCENTS
  const tableBody = document.getElementById('breakdownTable');
  tableBody.innerHTML = data.breakdown.map((item) => {
    let statusBadge = '';
    let netColor = '';

    if (item.balance > 0) {
      statusBadge = `<span class="bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1.5"><i class="fa-solid fa-arrow-down text-[10px]"></i> Gets ₹${item.balance.toLocaleString()}</span>`;
      netColor = 'text-emerald-700 font-semibold';
    } else if (item.balance < 0) {
      statusBadge = `<span class="bg-rose-50 text-rose-700 border border-rose-200/80 font-medium px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1.5"><i class="fa-solid fa-arrow-up text-[10px]"></i> Owes ₹${Math.abs(item.balance).toLocaleString()}</span>`;
      netColor = 'text-rose-700 font-semibold';
    } else {
      statusBadge = `<span class="bg-slate-50 text-slate-600 border border-slate-200 font-medium px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1.5"><i class="fa-solid fa-check text-[10px]"></i> Settled</span>`;
      netColor = 'text-slate-500 font-medium';
    }

    return `
      <tr class="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-0">
        <td class="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
          <span class="h-6 w-6 rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-[11px] font-bold">${item.member.charAt(0)}</span>
          ${item.member}
        </td>
        <td class="py-3 px-4 text-slate-900 font-semibold font-mono-code text-xs">₹${item.paid.toLocaleString()}</td>
        <td class="py-3 px-4 text-slate-500 font-normal font-mono-code text-xs">₹${item.fairShare.toLocaleString()}</td>
        <td class="py-3 px-4 font-mono-code text-xs ${netColor}">
          ${item.balance >= 0 ? '+' : ''}₹${item.balance.toLocaleString()}
        </td>
        <td class="py-3 px-4">${statusBadge}</td>
        <td class="py-3 px-4 text-right">
          <button onclick="showReceiptForMember('${item.member}')" class="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition text-[11px] font-medium border border-slate-200 shadow-sm inline-flex items-center gap-1.5">
            <i class="fa-solid fa-receipt text-slate-400"></i> Voucher
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // 2. SETTLEMENT WHO PAYS WHOM (MINIMALIST FINTECH)
  const settlementDiv = document.getElementById('settlementList');
  if (data.settlements.length === 0) {
    settlementDiv.innerHTML = `<p class="text-xs text-slate-400 italic bg-white p-3 rounded-lg border border-slate-200">All member obligations settled.</p>`;
  } else {
    settlementDiv.innerHTML = data.settlements.map(s => `
      <div class="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs shadow-sm hover:border-slate-300 transition">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">${s.from}</span>
          <span class="text-slate-400 font-normal">pays</span>
          <span class="font-bold text-slate-900 font-mono-code">₹${s.amount.toLocaleString()}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <i class="fa-solid fa-arrow-right text-slate-400 text-xs"></i>
          <span class="font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">${s.to}</span>
        </div>
      </div>
    `).join('');
  }

  // 3. CLEAN AUDIT CARDS (REPLACED HARSH RED BORDER WITH SLATE ENTERPRISE CARDS)
  const feed = document.getElementById('activityFeed');
  feed.innerHTML = data.history.map(act => `
    <div class="bg-white border border-slate-200 p-3.5 rounded-xl flex flex-col justify-between shadow-sm hover:border-slate-300 transition">
      <div class="flex justify-between items-center">
        <span class="font-bold text-slate-800 text-xs flex items-center gap-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> ${act.member}
        </span>
        <span class="text-slate-800 font-semibold font-mono-code text-xs bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">+₹${act.amount.toLocaleString()}</span>
      </div>
      <p class="text-[11px] text-slate-500 mt-2 font-normal truncate italic">"${act.note}"</p>
      <div class="flex justify-between items-center text-[10px] text-slate-400 mt-2.5 font-mono-code pt-2 border-t border-slate-100">
        <span>${act.timestamp}</span>
        <span class="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">${act.id || 'GP-SYS'}</span>
      </div>
    </div>
  `).join('');

  // 4. DISPATCH OUTBOX MODAL
  const inbox = document.getElementById('emailLogContainer');
  if (data.sentEmails && data.sentEmails.length > 0) {
    inbox.innerHTML = data.sentEmails.map(mail => `
      <div class="bg-white border border-slate-200 p-3 rounded-xl space-y-1 text-xs shadow-sm">
        <div class="flex justify-between items-center text-[11px]">
          <span class="text-slate-700 font-semibold font-mono-code bg-slate-100 px-2 py-0.5 rounded border border-slate-200">To: ${mail.to}</span>
          <span class="text-slate-400 font-mono-code">${mail.timestamp}</span>
        </div>
        <p class="font-semibold text-slate-800 text-xs">${mail.subject}</p>
        <p class="text-slate-500 whitespace-pre-line text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono-code">${mail.body}</p>
      </div>
    `).join('');
  } else {
    inbox.innerHTML = `<p class="text-xs text-slate-400">No emails dispatched yet.</p>`;
  }
}

async function handlePayment(e) {
  e.preventDefault();
  const member = document.getElementById('payMemberSelect').value;
  const email = document.getElementById('payEmail').value;
  const phone = document.getElementById('payPhone').value;
  const amount = document.getElementById('payAmount').value;
  const note = document.getElementById('payNote').value;

  const res = await fetch(`${API_URL}/contributions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ member, email, phone, amount, note })
  });
  const createdContribution = await res.json();

  document.getElementById('payAmount').value = '';
  document.getElementById('payNote').value = '';
  document.getElementById('payEmail').value = '';
  document.getElementById('payPhone').value = '';
  
  await fetchPoolData();
  renderReceiptModal(createdContribution);
}

function renderReceiptModal(contrib) {
  if (!cachedData) return;
  const item = cachedData.breakdown.find(b => b.member === contrib.member);
  document.getElementById('rcpt-pool').innerText = cachedData.title;
  document.getElementById('rcpt-member').innerText = contrib.member;
  document.getElementById('rcpt-contact').innerText = `${contrib.email || 'N/A'} | ${contrib.phone || 'N/A'}`;
  document.getElementById('rcpt-paid').innerText = `₹${contrib.amount.toLocaleString()}`;
  document.getElementById('rcpt-share').innerText = `₹${item ? item.fairShare.toLocaleString() : '0'}`;
  
  const balEl = document.getElementById('rcpt-balance');
  if (item && item.balance > 0) {
    balEl.innerText = `+₹${item.balance.toLocaleString()} (Surplus)`;
    balEl.className = 'font-semibold text-emerald-700 font-mono-code';
  } else if (item && item.balance < 0) {
    balEl.innerText = `-₹${Math.abs(item.balance).toLocaleString()} (Owes)`;
    balEl.className = 'font-semibold text-rose-700 font-mono-code';
  } else {
    balEl.innerText = `₹0 (Settled)`;
    balEl.className = 'font-semibold text-slate-600 font-mono-code';
  }

  document.getElementById('rcpt-ref').innerText = contrib.id;
  document.getElementById('receiptModal').classList.remove('hidden');
}

function showReceiptForMember(memberName) {
  if (!cachedData) return;
  const contrib = cachedData.history.find(h => h.member === memberName) || {
    id: "GP-REC",
    member: memberName,
    email: memberName.toLowerCase() + "@company.com",
    phone: "9876543210",
    amount: (cachedData.breakdown.find(b => b.member === memberName) || {}).paid || 0
  };
  renderReceiptModal(contrib);
}

function closeReceiptModal() {
  document.getElementById('receiptModal').classList.add('hidden');
}

function toggleInboxModal() {
  const modal = document.getElementById('inboxModal');
  modal.classList.toggle('hidden');
}

async function handleAddMember(e) {
  e.preventDefault();
  const name = document.getElementById('newMemberName').value;
  await fetch(`${API_URL}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  document.getElementById('newMemberName').value = '';
  fetchPoolData();
}

async function handleUpdatePool(e) {
  e.preventDefault();
  const targetAmount = document.getElementById('cfgTarget').value;
  const title = document.getElementById('cfgTitle').value;
  await fetch(`${API_URL}/pool`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetAmount, title })
  });
  fetchPoolData();
}

document.addEventListener('DOMContentLoaded', fetchPoolData);