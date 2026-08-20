/* =============================
   NOMAD BAR — Main JS
   ============================= */

// ===== LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 2200);
});

// ===== AOS INIT =====
AOS.init({ duration: 700, once: true, offset: 60 });

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

// ===== GALLERY FILTER + LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let lbImages = [];
let lbIndex = 0;

document.querySelectorAll('.gtab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.gtab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    galleryItems.forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('hide', !show);
    });
    buildLightboxImages();
  });
});

function buildLightboxImages() {
  lbImages = Array.from(document.querySelectorAll('.gallery-item:not(.hide) img'))
    .map(img => img.src);
}
buildLightboxImages();

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    buildLightboxImages();
    const src = item.querySelector('img').src;
    lbIndex = lbImages.indexOf(src);
    lbImg.src = lbImages[lbIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

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
function closeLb() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }

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
  const offset = currentPage * (100 / perPage) * perPage;
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
  locale: "es",
  minDate: "today",
  dateFormat: "Y-m-d",
  onDayCreate(dObj, dStr, fp, dayElem) {
    const dateStr = dayElem.dateObj.toISOString().split('T')[0];
    if (bookedDates.includes(dateStr)) {
      dayElem.classList.add('booked');
      dayElem.title = 'Fecha ocupada';
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
        <h3>Fecha ocupada</h3>
        <p>Lo sentimos, el <strong>${dateStr}</strong> ya tenemos un evento agendado. ¡Selecciona otra fecha!</p>
      `;
    } else {
      box.className = 'date-info-box available';
      box.innerHTML = `
        <div class="dib-icon"><i class="fas fa-calendar-check"></i></div>
        <h3>¡Fecha disponible! 🎉</h3>
        <p>El <strong>${dateStr}</strong> está libre. ¡Contáctanos para reservar tu lugar antes de que alguien más lo haga!</p>
      `;
    }
  }
});

flatpickr("#fecha", {
  locale: "es",
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
    msg.textContent = 'Por favor completa los campos obligatorios (*)';
    return;
  }
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btn.disabled = true;
  setTimeout(() => {
    msg.className = 'form-msg success';
    msg.innerHTML = '✅ ¡Solicitud enviada! Te contactaremos en menos de 24 horas.';
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
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
  precios: {
    text: '💰 <strong>Nuestros paquetes:</strong><br><br>• <strong>Básico</strong> — desde $299/evento (2 bartenders, 4 cócteles, 80 personas)<br>• <strong>Premium</strong> — desde $549/evento (3 bartenders, 8 cócteles, 150 personas) ⭐<br>• <strong>Élite</strong> — desde $899/evento (5 bartenders, menú ilimitado)<br><br>Escríbenos para una cotización personalizada.',
    followUp: ['servicios', 'contacto', 'disponibilidad']
  },
  servicios: {
    text: '🍸 <strong>Nuestros servicios incluyen:</strong><br><br>• Bodas & Compromisos<br>• Eventos Corporativos<br>• Festivales & Fiestas<br>• Eventos Privados (quince años, cumpleaños, etc.)<br><br>Todo incluido: bar, hielo, vasos, utensilios y limpieza.',
    followUp: ['precios', 'bartenders', 'contacto']
  },
  disponibilidad: {
    text: '📅 Para consultar disponibilidad, puedes usar el <a href="#disponibilidad" style="color:var(--gold)">calendario en nuestra web</a> o escribirnos directamente.<br><br>También disponible para reservar por <strong>WhatsApp</strong> al <a href="https://wa.me/15555550100" target="_blank" style="color:#25d366">+1 (555) 555-0100</a>.',
    followUp: ['precios', 'contacto']
  },
  cobertura: {
    text: '📍 Cubrimos <strong>Ciudad de México y área metropolitana</strong>. Para eventos fuera de la CDMX, contáctanos para revisar la disponibilidad y calcular el costo de traslado.',
    followUp: ['servicios', 'contacto']
  },
  contacto: {
    text: '📞 <strong>Contáctanos:</strong><br><br>• 📱 WhatsApp: <a href="https://wa.me/15555550100" target="_blank" style="color:#25d366">+1 (555) 555-0100</a><br>• 📧 Email: <a href="mailto:hola@nomadbar.mx" style="color:var(--gold)">hola@nomadbar.mx</a><br>• 📞 Tel: +1 (555) 555-0100<br><br>¡Respondemos en menos de 2 horas! 🚀',
    followUp: ['precios', 'disponibilidad']
  },
  bartenders: {
    text: '👨‍🍳 Nuestros bartenders son <strong>certificados internacionalmente</strong> con años de experiencia en eventos de lujo.<br><br>Usamos <strong>licores top-shelf</strong>, frutas frescas y siropes artesanales para garantizar la mejor experiencia.',
    followUp: ['servicios', 'precios']
  }
};

const defaultResponses = [
  '¿Puedo ayudarte con algo más? Puedo contarte sobre nuestros precios, servicios, disponibilidad o cómo contactarnos. 🍹',
  'No encontré una respuesta específica para eso, pero nuestro equipo puede ayudarte. ¿Prefieres contactarnos por WhatsApp? 📱',
  'Para preguntas detalladas, te recomiendo contactarnos directamente. Respondemos muy rápido. 😊'
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
        const labels = { precios:'💰 Precios', servicios:'🍸 Servicios', disponibilidad:'📅 Disponibilidad', cobertura:'📍 Cobertura', contacto:'📞 Contacto', bartenders:'👨‍🍳 Bartenders' };
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
  const labels = { precios:'💰 Precios', servicios:'🍸 Servicios', disponibilidad:'📅 Disponibilidad', cobertura:'📍 Cobertura', contacto:'📞 Contacto', bartenders:'👨‍🍳 Bartenders' };
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
  if (lower.match(/precio|costo|paquete|cuanto|cobran|\$/)) matched = 'precios';
  else if (lower.match(/servicio|tipo|evento|boda|corporate|festival|fiesta|quince|cumplea/)) matched = 'servicios';
  else if (lower.match(/disponib|fecha|calendar|reserva|libre|libre/)) matched = 'disponibilidad';
  else if (lower.match(/zona|ubicaci|cobertura|donde|cdmx|ciudad/)) matched = 'cobertura';
  else if (lower.match(/contact|telefon|email|whatsapp|llamar|escribir/)) matched = 'contacto';
  else if (lower.match(/bartender|barman|mesero|personal|profesional/)) matched = 'bartenders';
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
