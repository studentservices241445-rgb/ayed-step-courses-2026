// Mobile menu toggle logic
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  // Close the mobile menu whenever a link inside it is clicked
  [...mobileMenu.querySelectorAll('a')].forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

// Countdown timer to the end of discount period (29 Jan 2026)
const deadline = new Date(2026, 0, 29, 23, 59, 59).getTime();
const cdDays = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMins = document.getElementById('cdMins');
const cdSecs = document.getElementById('cdSecs');

function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCountdown() {
  const now = Date.now();
  let diff = Math.max(0, deadline - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);
  const secs = Math.floor(diff / 1000);
  if (cdDays) cdDays.textContent = days;
  if (cdHours) cdHours.textContent = pad(hours);
  if (cdMins) cdMins.textContent = pad(mins);
  if (cdSecs) cdSecs.textContent = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Toast notification helpers
function toastMsg(text) {
  const container = document.getElementById('toast');
  if (!container) return;
  const card = document.createElement('div');
  card.className = 'toast-card';
  card.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="pulse-dot mt-1"></div>
      <div class="min-w-0">
        <div class="font-extrabold text-sm">تم النسخ ✅</div>
        <div class="text-xs text-white/70 mt-1">${text}</div>
      </div>
      <button class="ms-auto text-white/60 hover:text-white" aria-label="close">✕</button>
    </div>
  `;
  container.appendChild(card);
  requestAnimationFrame(() => card.classList.add('show'));
  const close = card.querySelector('button');
  const remove = () => {
    card.classList.remove('show');
    setTimeout(() => card.remove(), 250);
  };
  close.addEventListener('click', remove);
  setTimeout(remove, 3800);
}

// Copy buttons logic
document.querySelectorAll('.copyBtn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const val = btn.getAttribute('data-copy') || '';
    try {
      await navigator.clipboard.writeText(val);
      toastMsg('تم النسخ بنجاح');
    } catch (e) {
      // fallback for browsers that block clipboard API
      const ta = document.createElement('textarea');
      ta.value = val;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      toastMsg('تم النسخ بنجاح');
    }
  });
});

// Form logic constants
const OFFICIAL_USERNAME = 'Ayed_Academy_2026';
const COURSE_NAME = 'دورة STEP المكثفة 2026 (أكاديمية عايد الرسمية)';
const COURSE_PRICE = '299';
const ACCESS_DAYS = '90';

// Handle previous attempt and optional score fields
const prevAttempt = document.getElementById('prevAttempt');
const prevScoreWrap = document.getElementById('prevScoreWrap');
if (prevAttempt && prevScoreWrap) {
  prevAttempt.addEventListener('change', () => {
    if (prevAttempt.value === 'yes') prevScoreWrap.classList.remove('hidden');
    else prevScoreWrap.classList.add('hidden');
  });
}

// Enrolment form submission
const form = document.getElementById('enrollForm');
const resultBox = document.getElementById('resultBox');
const readyMsg = document.getElementById('readyMsg');
const copyMsgBtn = document.getElementById('copyMsgBtn');
const openTgBtn = document.getElementById('openTgBtn');

function encodeTgText(text) {
  return encodeURIComponent(text);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const contactMethod = document.getElementById('contactMethod').value;
    const contactValue = document.getElementById('contactValue').value.trim();
    const examDate = document.getElementById('examDate').value.trim();
    const targetScore = document.getElementById('targetScore').value.trim();
    const prev = document.getElementById('prevAttempt').value;
    const prevScore = document.getElementById('prevScore').value.trim();
    const reason = document.getElementById('reason').value.trim();
    const notes = document.getElementById('notes').value.trim();
    const receipt = document.getElementById('receipt').files?.[0];
    if (!receipt) {
      toastMsg('لازم ترفق الإيصال أولاً (صورة/‏PDF) ❗');
      document.getElementById('receipt').focus();
      return;
    }
    const methodLabel = contactMethod === 'telegram' ? 'تيليجرام' : (contactMethod === 'whatsapp' ? 'واتساب' : 'إيميل');
    const lines = [];
    lines.push('السلام عليكم ورحمة الله وبركاته');
    lines.push('يعطيكم العافية 🌿');
    lines.push(`أبغى تأكيد اشتراكي في: ${COURSE_NAME}`);
    lines.push('—');
    lines.push(`الاسم: ${fullName}`);
    if (contactValue) lines.push(`وسيلة التواصل: ${methodLabel} — ${contactValue}`);
    else lines.push(`وسيلة التواصل: ${methodLabel} — (ما كتب)`);
    lines.push(`موعد الاختبار: ${examDate}`);
    if (targetScore) lines.push(`الدرجة المستهدفة: ${targetScore}`);
    lines.push(`هل اختبرت سابقاً؟ ${prev === 'yes' ? 'نعم' : 'لا'}`);
    if (prev === 'yes' && prevScore) lines.push(`الدرجة السابقة: ${prevScore}`);
    lines.push(`سبب التسجيل: ${reason}`);
    if (notes) lines.push(`ملاحظات: ${notes}`);
    lines.push('—');
    lines.push('تم رفع الإيصال عبر الموقع ✅');
    lines.push('وبإذن الله أرفقه لكم هنا بالخاص مرة ثانية للتفعيل (صورة/‏PDF).');
    lines.push('—');
    lines.push(`رسوم الاشتراك: ${COURSE_PRICE} ريال`);
    lines.push(`مدة الوصول: ${ACCESS_DAYS} يوم`);
    lines.push('شكراً لكم 🙏');
    const msg = lines.join('\n');
    readyMsg.value = msg;
    resultBox.classList.remove('hidden');
    const tgUrl = `https://t.me/${OFFICIAL_USERNAME}?text=${encodeTgText(msg)}`;
    openTgBtn.href = tgUrl;
    resultBox.scrollIntoView({behavior:'smooth', block:'start'});
    toastMsg('تم تجهيز الرسالة… الآن افتح تيليجرام وارسلها ✅');
  });
}

// Copy prepared message
if (copyMsgBtn) {
  copyMsgBtn.addEventListener('click', async () => {
    const val = readyMsg.value;
    try {
      await navigator.clipboard.writeText(val);
      toastMsg('تم نسخ الرسالة ✅');
    } catch (e) {
      readyMsg.select();
      document.execCommand('copy');
      toastMsg('تم نسخ الرسالة ✅');
    }
  });
}

// Demo activity notifications (optional; purely decorative)
const demoEvents = [
  {name:'نوف', text:'قدمت طلب تسجيل — مسار 14 يوم', ago:'قبل دقيقة'},
  {name:'سلمان', text:'أكمل خطة أسبوع — تقدّم ممتاز', ago:'قبل 4 دقائق'},
  {name:'رهف', text:'أرسلت الإيصال — بانتظار التفعيل', ago:'قبل 6 دقائق'},
  {name:'محمد', text:'سأل عن خطة 15 يوم — اختبار قريب', ago:'قبل 9 دقائق'},
  {name:'ريم', text:'نصيحة: لا تجمع مصادر.. امشِ مع الخطة', ago:'قبل 12 دقيقة'},
];

function showDemoToast() {
  const container = document.getElementById('toast');
  const item = demoEvents[Math.floor(Math.random() * demoEvents.length)];
  const card = document.createElement('div');
  card.className = 'toast-card';
  card.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="pulse-dot mt-1"></div>
      <div class="min-w-0">
        <div class="text-sm font-extrabold">نشاط حديث (عرض تمثيلي)</div>
        <div class="text-xs text-white/70 mt-1"><span class="font-bold text-white/85">${item.name}</span> — ${item.text}</div>
        <div class="text-[11px] text-white/50 mt-1">${item.ago}</div>
      </div>
      <button class="ms-auto text-white/60 hover:text-white" aria-label="close">✕</button>
    </div>
  `;
  container.appendChild(card);
  requestAnimationFrame(() => card.classList.add('show'));
  const close = card.querySelector('button');
  const remove = () => {
    card.classList.remove('show');
    setTimeout(() => card.remove(), 250);
  };
  close.addEventListener('click', remove);
  setTimeout(remove, 5200);
}

// Show a demo notification every ~30 seconds
setTimeout(showDemoToast, 6000);
setInterval(showDemoToast, 30000);

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch((err) => console.error('SW registration failed', err));
  });
}