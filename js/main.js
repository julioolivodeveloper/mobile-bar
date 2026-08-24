/* =============================
   LEMON & LIME BAR MOBILE — Main JS
   ============================= */

// ===== AOS INIT =====
AOS.init({ duration: 700, once: true, offset: 60 });

// ===== HERO SLIDESHOW =====
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
})();

// ===== PARTICLES =====
(function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${6 + Math.random() * 8}s;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(p);
  }
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.round(current);
  }, 16);
}
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCounter);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) observer.observe(statsEl);

// ===== GALLERY CAROUSEL =====
(function() {
  const gcTrack = document.getElementById('gcTrack');
  const dotsEl = document.getElementById('gcDots');
  if (!gcTrack) return;

  const slides = Array.from(gcTrack.querySelectorAll('.gc-slide'));
  const total = slides.length;
  let current = 0;
  let autoTimer;

  function getPerView() {
    return window.innerWidth < 560 ? 1 : window.innerWidth < 900 ? 2 : 3;
  }

  function getSlideWidth() {
    return slides[0].offsetWidth + 16; // 16 = gap (1rem)
  }

  function goTo(index) {
    const perView = getPerView();
    const max = total - perView;
    current = Math.max(0, Math.min(index, max));
    gcTrack.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    document.querySelectorAll('.gc-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Build dots
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'gc-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsEl.appendChild(d);
  }

  document.querySelector('.gc-prev').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.querySelector('.gc-next').addEventListener('click', () => {
    const perView = getPerView();
    goTo(current + 1 > total - perView ? 0 : current + 1);
    resetAuto();
  });

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      const perView = getPerView();
      goTo(current + 1 > total - perView ? 0 : current + 1);
    }, 4500);
  }

  // Touch/swipe support
  let touchStartX = 0;
  gcTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  gcTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
  });

  window.addEventListener('resize', () => goTo(current));
  resetAuto();

  // Lightbox on slide click
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  let lbIndex = 0;
  const lbImages = slides.map(s => s.querySelector('img').src);

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      lbIndex = i;
      lbImg.src = lbImages[lbIndex];
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  document.querySelector('.lb-close').addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.querySelector('.lb-prev').addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; lbImg.src = lbImages[lbIndex]; });
  document.querySelector('.lb-next').addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbImages.length; lbImg.src = lbImages[lbIndex]; });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; lbImg.src = lbImages[lbIndex]; }
    if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; lbImg.src = lbImages[lbIndex]; }
  });
})();

// ===== REVIEWS SLIDER =====
const track = document.getElementById('reviewsTrack');
const cards = track.querySelectorAll('.review-card');
const dotsContainer = document.getElementById('reviewsDots');
let perPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;
let totalPages = Math.ceil(cards.length / perPage);
let currentPage = 0;

function buildDots() {
  dotsContainer.innerHTML = '';
  perPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;
  totalPages = Math.ceil(cards.length / perPage);
  for (let i = 0; i < totalPages; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goToPage(i));
    dotsContainer.appendChild(d);
  }
}
function goToPage(p) {
  currentPage = Math.max(0, Math.min(p, totalPages - 1));
  cards.forEach((c, i) => {
    c.style.display = Math.floor(i / perPage) === currentPage ? '' : 'none';
  });
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentPage));
}
buildDots();
goToPage(0);
document.getElementById('revPrev').addEventListener('click', () => goToPage(currentPage - 1));
document.getElementById('revNext').addEventListener('click', () => goToPage(currentPage + 1));
window.addEventListener('resize', () => { buildDots(); goToPage(0); });

// ===== FLATPICKR CALENDAR =====
const bookedDates = [
  "2025-09-06", "2025-09-07",
  "2025-09-13", "2025-09-14", "2025-09-20", "2025-09-21",
  "2025-10-04", "2025-10-11", "2025-10-18", "2025-10-25",
  "2025-11-01", "2025-11-08", "2025-11-15",
  "2025-12-06", "2025-12-13", "2025-12-20", "2025-12-31"
];

flatpickr("#datepicker", {
  inline: true,
  minDate: "today",
  dateFormat: "Y-m-d",
  onDayCreate(dObj, dStr, fp, dayElem) {
    const dateStr = dayElem.dateObj.toISOString().split('T')[0];
    if (bookedDates.includes(dateStr)) {
      dayElem.classList.add('booked');
      dayElem.title = 'Date booked';
    } else if (dayElem.dateObj >= new Date()) {
      dayElem.classList.add('available');
    }
  },
  onChange(selectedDates, dateStr) {
    const box = document.getElementById('dateInfo');
    if (!dateStr) return;
    if (bookedDates.includes(dateStr)) {
      box.className = 'date-info-box busy';
      box.innerHTML = `
        <div class="dib-icon"><i class="fas fa-calendar-times"></i></div>
        <h3>Date unavailable</h3>
        <p>Sorry, <strong>${dateStr}</strong> is already booked. Please select another date!</p>
      `;
    } else {
      box.className = 'date-info-box available';
      box.innerHTML = `
        <div class="dib-icon"><i class="fas fa-calendar-check"></i></div>
        <h3>Date available! 🎉</h3>
        <p><strong>${dateStr}</strong> is open. Contact us now to secure your spot before someone else does!</p>
      `;
    }
  }
});

flatpickr("#fecha", {
  minDate: "today",
  dateFormat: "Y-m-d",
  disableMobile: false
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  const btn = this.querySelector('button[type="submit"]');
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  if (!nombre || !telefono) {
    msg.className = 'form-msg error';
    msg.textContent = 'Please fill in all required fields (*)';
    return;
  }
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    msg.className = 'form-msg success';
    msg.innerHTML = '✅ Request sent! We\'ll get back to you within 24 hours.';
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Request';
    btn.disabled = false;
    this.reset();
  }, 1800);
});

// ===== CHATBOT =====
const chatbotBubble = document.getElementById('chatbotBubble');
const chatbotContainer = document.getElementById('chatbot');
const chatbotClose = document.getElementById('chatbotClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const bubbleIcon = document.getElementById('bubbleIcon');
const notify = document.querySelector('.chatbot-notify');
let chatOpen = false;

const responses = {
  pricing: {
    text: '💰 <strong>Our packages:</strong><br><br>• <strong>Basic</strong> — from $299/event (4 cocktails, up to 80 guests, 3–4 hrs)<br>• <strong>Premium</strong> — from $549/event (full 8-cocktail menu, 150 guests) ⭐<br>• <strong>Elite</strong> — from $899/event (Carlos & Ara both, unlimited menu)<br><br>Contact us for a custom quote!',
    followUp: ['menu', 'contact', 'availability']
  },
  menu: {
    text: '🍸 <strong>Our menu includes:</strong><br><br>🍃 Mojitos · 🧛 Vampiros · 🍺 Micheladas<br>🍋 Classic Margarita · 🌸 Palomas<br>🍷 Calimochos · 🔥 Mezcales<br>⭐ Kids Lemonade<br><br>All made fresh with quality ingredients!',
    followUp: ['pricing', 'bartenders', 'contact']
  },
  services: {
    text: '🍸 <strong>We serve all types of events:</strong><br><br>• Weddings & Engagements<br>• Quinceañeras & Birthdays<br>• Festivals & Parties<br>• Private Events & Graduations<br><br>Everything included: bar setup, ice, cups, tools and cleanup.',
    followUp: ['menu', 'pricing', 'contact']
  },
  availability: {
    text: '📅 Check availability using the <a href="#availability" style="color:var(--gold)">calendar on our website</a> or contact us directly.<br><br>Book via <strong>WhatsApp</strong>: <a href="https://wa.me/15742025420" target="_blank" style="color:#25d366">(574) 202-5420</a> — we respond fast! 🚀',
    followUp: ['pricing', 'contact']
  },
  coverage: {
    text: '📍 We are based in <strong>Goshen, Indiana</strong> and serve the surrounding area including Elkhart, Mishawaka, South Bend and nearby cities.<br><br>For events further away, contact us and we\'ll let you know!',
    followUp: ['services', 'contact']
  },
  contact: {
    text: '📞 <strong>Reach Carlos & Ara:</strong><br><br>• 📱 WhatsApp / Carlos: <a href="https://wa.me/15742025420" target="_blank" style="color:#25d366">(574) 202-5420</a><br>• 📱 Ara: <a href="tel:+15742381464" style="color:var(--gold)">(574) 238-1464</a><br>• 📍 Goshen, Indiana<br><br>We respond in under 2 hours! 🚀',
    followUp: ['pricing', 'availability']
  },
  bartenders: {
    text: '👨‍🍳 <strong>Carlos & Ara</strong> are the heart of Lemon & Lime Bar Mobile!<br><br>They bring passion, professionalism and great energy to every event. Fresh ingredients, quality spirits and a smile guaranteed. 🍋',
    followUp: ['menu', 'pricing', 'contact']
  }
};

const defaultResponses = [
  'Can I help with something else? I can tell you about our menu, pricing, availability or how to reach Carlos & Ara. 🍹',
  'I didn\'t catch that! Try asking about our cocktail menu, packages or location. You can also WhatsApp us at (574) 202-5420 📱',
  'For detailed questions, reach out directly — Carlos & Ara respond super fast! 😊'
];

function toggleChat() {
  chatOpen = !chatOpen;
  chatbotContainer.classList.toggle('open', chatOpen);
  bubbleIcon.className = chatOpen ? 'fas fa-times' : 'fas fa-comment-dots';
  if (chatOpen) {
    notify.classList.add('hidden');
    chatInput.focus();
  }
}

chatbotBubble.addEventListener('click', toggleChat);
chatbotClose.addEventListener('click', toggleChat);

function addMessage(text, isUser = false) {
  const msg = document.createElement('div');
  msg.className = `msg ${isUser ? 'user-msg' : 'bot-msg'}`;
  msg.innerHTML = `<div class="msg-bubble">${text}</div>`;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'msg bot-msg typing-indicator';
  typing.id = 'typingIndicator';
  typing.innerHTML = '<div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

function botReply(key) {
  showTyping();
  setTimeout(() => {
    removeTyping();
    const data = responses[key];
    if (data) {
      addMessage(data.text);
      if (data.followUp) {
        const qBtns = document.createElement('div');
        qBtns.className = 'chatbot-quick-btns';
        const labels = { pricing:'💰 Pricing', menu:'🍸 Our Menu', services:'🎉 Services', availability:'📅 Availability', coverage:'📍 Location', contact:'📞 Contact', bartenders:'👨‍🍳 About Us' };
        data.followUp.forEach(k => {
          const b = document.createElement('button');
          b.className = 'quick-btn';
          b.dataset.q = k;
          b.textContent = labels[k];
          b.addEventListener('click', () => handleQuickBtn(k));
          qBtns.appendChild(b);
        });
        chatMessages.appendChild(qBtns);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    } else {
      addMessage(defaultResponses[Math.floor(Math.random() * defaultResponses.length)]);
    }
  }, 900 + Math.random() * 400);
}

function handleQuickBtn(key) {
  const labels = { pricing:'💰 Pricing', menu:'🍸 Our Menu', services:'🎉 Services', availability:'📅 Availability', coverage:'📍 Location', contact:'📞 Contact', bartenders:'👨‍🍳 About Us' };
  addMessage(labels[key], true);
  botReply(key);
}

document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => handleQuickBtn(btn.dataset.q));
});

function handleUserMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, true);
  chatInput.value = '';
  const lower = text.toLowerCase();
  let matched = null;
  if (lower.match(/price|cost|package|how much|charge|\$/)) matched = 'pricing';
  else if (lower.match(/menu|mojito|vampiro|michelada|margarita|paloma|calimocho|mezcal|lemonade|cocktail|bebida|drink/)) matched = 'menu';
  else if (lower.match(/service|type|event|wedding|corporate|festival|party|birthday|quincea/)) matched = 'services';
  else if (lower.match(/availab|date|calendar|book|reserve|free|open/)) matched = 'availability';
  else if (lower.match(/area|location|cover|where|city|goshen|indiana|elkhart|south bend/)) matched = 'coverage';
  else if (lower.match(/contact|phone|call|whatsapp|message|reach|carlos|ara/)) matched = 'contact';
  else if (lower.match(/bartender|barman|staff|team|professional|certif|who/)) matched = 'bartenders';
  botReply(matched);
}

chatSend.addEventListener('click', handleUserMessage);
chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleUserMessage(); });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 100;
  sections.forEach(sec => {
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id));
    }
  });
}, { passive: true });

// ===== BOOKING MODAL =====
(function() {
  const modal     = document.getElementById('bookingModal');
  const backdrop  = document.getElementById('bmBackdrop');
  const closeBtn  = document.getElementById('bmClose');
  const btnNext   = document.getElementById('bmNext');
  const btnBack   = document.getElementById('bmBack');
  const btnSend   = document.getElementById('bmSend');
  const progBar   = document.getElementById('bmProgressBar');
  const curEl     = document.getElementById('bmCurrent');
  const totalEl   = document.getElementById('bmTotal');

  const TOTAL_STEPS = 6;
  let currentStep = 1;
  let goingBack   = false;

  const data = { eventType:'', location:'', city:'', guests:50, date:'', contactMethod:'', name:'', contactInfo:'' };

  // Open/close
  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    goTo(1, false);
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('openBooking').addEventListener('click', openModal);
  document.getElementById('openBookingNav').addEventListener('click', e => { e.preventDefault(); openModal(); });
  document.querySelectorAll('.open-booking-btn').forEach(btn => btn.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Navigate to step
  function goTo(step, back) {
    const steps = document.querySelectorAll('.bm-step');
    const prev  = document.querySelector('.bm-step.active');

    if (prev) {
      prev.classList.remove('active');
      prev.classList.add('slide-out');
      setTimeout(() => prev.classList.remove('slide-out'), 260);
    }

    currentStep = step;
    const next = document.querySelector(`.bm-step[data-step="${step}"]`);
    if (!next) return;
    next.classList.remove('slide-in-back');
    void next.offsetWidth;
    next.classList.add('active');
    if (back) next.classList.add('slide-in-back');

    // Progress
    const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
    progBar.style.width = pct + '%';
    curEl.textContent  = step;
    totalEl.textContent = TOTAL_STEPS;

    // Buttons
    btnBack.disabled = step === 1;
    btnBack.style.opacity = step === 1 ? '0.3' : '1';
    btnBack.style.pointerEvents = step === 1 ? 'none' : 'auto';

    if (step === TOTAL_STEPS) {
      btnNext.style.display = 'none';
      btnSend.style.display = 'inline-flex';
      buildSummary();
    } else {
      btnNext.style.display = 'inline-flex';
      btnSend.style.display = 'none';
    }

    // Init calendar on step 4
    if (step === 4 && !window._bmCalReady) initBmCalendar();

    // Scroll panel to top
    document.getElementById('bmStepsWrap').scrollTop = 0;
  }

  // Validate current step before moving forward
  function validate() {
    if (currentStep === 1) {
      if (!data.eventType) { shake(document.querySelector('[data-step="1"] .bm-options-grid')); return false; }
    }
    if (currentStep === 2) {
      const loc = document.getElementById('bm-location').value.trim();
      const city = document.getElementById('bm-city').value.trim();
      if (!loc) { shake(document.getElementById('bm-location').parentElement); return false; }
      if (!city) { shake(document.getElementById('bm-city').parentElement); return false; }
      data.location = loc; data.city = city;
    }
    if (currentStep === 3) {
      data.guests = parseInt(document.getElementById('guestsNum').textContent);
    }
    if (currentStep === 4) {
      if (!data.date) { shake(document.getElementById('bmDateStatus')); return false; }
    }
    if (currentStep === 5) {
      if (!data.contactMethod) { shake(document.querySelector('[data-step="5"] .bm-options-grid')); return false; }
      const name = document.getElementById('bm-name').value.trim();
      const info = document.getElementById('bm-contactinfo').value.trim();
      if (!name) { shake(document.getElementById('bm-name').parentElement); return false; }
      if (!info) { shake(document.getElementById('bm-contactinfo').parentElement); return false; }
      data.name = name; data.contactInfo = info;
    }
    return true;
  }

  btnNext.addEventListener('click', () => {
    if (!validate()) return;
    if (currentStep < TOTAL_STEPS) goTo(currentStep + 1, false);
  });
  btnBack.addEventListener('click', () => {
    if (currentStep > 1) goTo(currentStep - 1, true);
  });

  // Shake helper
  function shake(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 450);
  }

  // ---- STEP 1: Event type options ----
  document.querySelectorAll('[data-field="eventType"] .bm-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-field="eventType"] .bm-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      data.eventType = btn.dataset.value;
      setTimeout(() => { if (validate()) goTo(2, false); }, 200);
    });
  });

  // ---- STEP 3: Guests ----
  const guestsNum   = document.getElementById('guestsNum');
  const guestsRange = document.getElementById('guestsRange');
  const pkgText     = document.getElementById('pkgText');

  function updateGuests(val) {
    val = Math.max(10, Math.min(500, val));
    guestsNum.textContent = val;
    guestsRange.value = val;
    data.guests = val;
    let pkg = val <= 80 ? 'Basic' : val <= 150 ? 'Premium' : 'Elite';
    pkgText.innerHTML = `We recommend the <strong>${pkg}</strong> package for this group size.`;
  }

  document.getElementById('guestsMinus').addEventListener('click', () => updateGuests(data.guests - 5));
  document.getElementById('guestsPlus').addEventListener('click', () => updateGuests(data.guests + 5));
  guestsRange.addEventListener('input', () => updateGuests(parseInt(guestsRange.value)));

  // ---- STEP 4: Calendar ----
  const bookedDates = [
    "2025-09-06","2025-09-07","2025-09-13","2025-09-14","2025-09-20","2025-09-21",
    "2025-10-04","2025-10-11","2025-10-18","2025-10-25",
    "2025-11-01","2025-11-08","2025-11-15",
    "2025-12-06","2025-12-13","2025-12-20","2025-12-31"
  ];

  function initBmCalendar() {
    window._bmCalReady = true;
    flatpickr('#bmDatepicker', {
      inline: true,
      minDate: 'today',
      dateFormat: 'Y-m-d',
      onDayCreate(dObj, dStr, fp, dayElem) {
        const ds = dayElem.dateObj.toISOString().split('T')[0];
        if (bookedDates.includes(ds)) {
          dayElem.classList.add('booked');
          dayElem.title = 'Already booked';
        } else if (dayElem.dateObj >= new Date()) {
          dayElem.classList.add('available');
        }
      },
      onChange(sel, dateStr) {
        const status = document.getElementById('bmDateStatus');
        if (!dateStr) return;
        if (bookedDates.includes(dateStr)) {
          data.date = '';
          status.className = 'bm-date-status err';
          status.innerHTML = '<i class="fas fa-times-circle"></i> This date is already booked — pick another!';
        } else {
          data.date = dateStr;
          status.className = 'bm-date-status ok';
          status.innerHTML = `<i class="fas fa-check-circle"></i> <strong>${dateStr}</strong> is available!`;
        }
      }
    });
  }

  // ---- STEP 5: Contact method ----
  document.querySelectorAll('[data-field="contactMethod"] .bm-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-field="contactMethod"] .bm-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      data.contactMethod = btn.dataset.value;

      const infoWrap  = document.getElementById('bmContactInfoWrap');
      const infoLabel = document.getElementById('bmContactInfoLabel');
      const infoInput = document.getElementById('bm-contactinfo');
      const infoIcon  = document.getElementById('bmContactInfoIcon');

      infoWrap.style.display  = 'flex';
      infoLabel.style.display = 'block';

      const cfg = {
        WhatsApp: { placeholder: 'Your WhatsApp number', icon: 'fab fa-whatsapp', type: 'tel' },
        Phone:    { placeholder: 'Your phone number',    icon: 'fas fa-phone',    type: 'tel' },
        Email:    { placeholder: 'Your email address',   icon: 'fas fa-envelope', type: 'email' },
      };
      const c = cfg[data.contactMethod];
      infoInput.placeholder = c.placeholder;
      infoInput.type = c.type;
      infoIcon.className = c.icon;
      infoLabel.textContent = c.placeholder;
    });
  });

  // ---- STEP 6: Summary ----
  function buildSummary() {
    document.getElementById('sum-event').textContent    = data.eventType   || '—';
    document.getElementById('sum-location').textContent = data.location && data.city ? `${data.location}, ${data.city}` : data.location || '—';
    document.getElementById('sum-guests').textContent   = data.guests + ' guests';
    document.getElementById('sum-date').textContent     = data.date        || '—';
    document.getElementById('sum-contact').textContent  = data.contactMethod ? `${data.contactMethod} — ${data.contactInfo}` : '—';
    document.getElementById('sum-name').textContent     = data.name        || '—';
  }

  // ---- SEND ----
  btnSend.addEventListener('click', () => {
    const result = document.getElementById('bmFormResult');
    btnSend.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btnSend.disabled = true;

    setTimeout(() => {
      result.className = 'bm-form-result success';
      result.innerHTML = `✅ <strong>Booking request sent!</strong> We'll contact you via ${data.contactMethod} within 2 hours. Thanks, ${data.name}! 🍹`;
      btnSend.style.display = 'none';
      btnBack.style.display = 'none';
    }, 1800);
  });

})();

