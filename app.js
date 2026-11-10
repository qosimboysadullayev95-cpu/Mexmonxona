/**
 * ===================================================================
 * AURUM GRAND PALACE & RESORT - INTERACTIVE JAVASCRIPT ENGINE
 * Full booking calculator, room filtering, currency converter,
 * voucher generation, modals, and dynamic luxury experiences.
 * ===================================================================
 */

// Global State
const state = {
  currency: 'USD', // 'USD', 'EUR', 'UZS'
  rates: {
    USD: 1,
    EUR: 0.92,
    UZS: 12800
  },
  currencySymbols: {
    USD: '$',
    EUR: '€',
    UZS: "so'm"
  },
  favorites: JSON.parse(localStorage.getItem('aurum_favorites') || '[]'),
  selectedRoomId: 1,
  bookingForm: {
    roomId: 1,
    checkIn: '',
    checkOut: '',
    guests: 2,
    nights: 2,
    extras: []
  }
};

// Comprehensive Room Database
const ROOMS_DATA = [
  {
    id: 1,
    title: "Imperial Presidential Suite",
    category: "presidential",
    priceUSD: 450,
    size: 140,
    guests: 3,
    bed: "Royal King Size",
    badge: "VIP Tanlov",
    image: "assets/images/presidential.jpg",
    rating: 5.0,
    reviews: 48,
    desc: "Shahar panoramasi bilan uyg'unlashgan eng hashamatli xona. Shaxsiy kamin, marmar vanna, shaxsiy butler xizmati va eng yuqori darajadagi qulaylik.",
    features: [
      "Panoramik shahar manzarasi",
      "24/7 Shaxsiy Butler xizmati",
      "Jacuzzi & Marmar vanna",
      "Shaxsiy majlislar xonasi",
      "Hermès parfyumeriya to'plami"
    ]
  },
  {
    id: 2,
    title: "Deluxe Ocean Riviera Suite",
    category: "deluxe",
    priceUSD: 280,
    size: 85,
    guests: 2,
    bed: "Super King Size",
    badge: "Eng Mashhur",
    image: "assets/images/deluxe.jpg",
    rating: 4.9,
    reviews: 86,
    desc: "Keng shaxsiy balkon va dengiz/bog' manzarasi. Elegant mebellar, yumshoq yoritgichlar va sokin dam olish uchun yaratilgan jannatmonand go'sha.",
    features: [
      "Keng shaxsiy terassa",
      "Gurme qahva mashinasi",
      "Bulutli ortopedik to'shak",
      "Aqlli xona boshqaruv tizimi (Smart Room)",
      "Premium mini-bar"
    ]
  },
  {
    id: 3,
    title: "Royal Penthouse & Sky Terrace",
    category: "penthouse",
    priceUSD: 650,
    size: 210,
    guests: 4,
    bed: "2 ta King Size",
    badge: "Eksklyuziv",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    rating: 5.0,
    reviews: 32,
    desc: "Eng yuqori qavatda joylashgan, ochiq osmon ostidagi shaxsiy basseyn va barbekyu zonasiga ega eng elita turargoh.",
    features: [
      "Tomdagi shaxsiy hovuz & Jacuzzi",
      "Alohida oshxona va zal",
      "Maxsus VIP lift",
      "Shaxsiy sommelier tanlovi",
      "Vertolyot maydonchasi kirishi"
    ]
  },
  {
    id: 4,
    title: "Executive Business Suite",
    category: "executive",
    priceUSD: 220,
    size: 65,
    guests: 2,
    bed: "Executive King Size",
    badge: "Biznes Qulaylik",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviews: 64,
    desc: "Ishbilarmonlar va yuqori darajadagi delegatlar uchun mukammal akustika va qulay ish maydoniga ega zamonaviy biznes suitasi.",
    features: [
      "Ergonomik ish stoli & Herman Miller kreslosi",
      "Tezkor 1 Gbps optik Wi-Fi",
      "Biznes-zal (Executive Lounge) kirish",
      "Kiyimlarni bepul dazmollash",
      "Xavfsiz seyf (noutbuk uchun mos)"
    ]
  },
  {
    id: 5,
    title: "Imperial Garden Villa",
    category: "presidential",
    priceUSD: 520,
    size: 160,
    guests: 5,
    bed: "2 King + 1 Queen",
    badge: "Oila & Dam Olish",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviews: 41,
    desc: "Shaxsiy yam-yashil yapon bog'i ichida alohida joylashgan sokin va shinam villa. Butun oila uchun keng va osoyishta.",
    features: [
      "Shaxsiy sharshara va yapon bog'i",
      "Tashqi terassa va ovqatlanish maydoni",
      "Bolalar uchun qulay xonalar",
      "Shaxsiy oshpaz chaqirish imkoniyati",
      "SPA markaziga alohida yopiq yo'lak"
    ]
  },
  {
    id: 6,
    title: "Grand Deluxe Panorama Room",
    category: "deluxe",
    priceUSD: 240,
    size: 70,
    guests: 2,
    bed: "King Size Bed",
    badge: "Romantik",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviews: 57,
    desc: "Romantik dam olish va unutilmas shom quyoshi manzaralari uchun mo'ljallangan yorug' va shinam lyuks xona.",
    features: [
      "Kechki panoramik ko'rinish",
      "Marmar dush va erkin vanna",
      "Ovoz izolyatsiyalangan oynalar",
      "Xushbo'y efir moylari diffuzeri",
      "Kechki nonushta xonaga yetkazish"
    ]
  }
];

// Extra Services Configuration
const EXTRA_SERVICES = [
  { id: "breakfast", name: "Fransuzcha Gurme Nonushta (kuniga)", priceUSD: 25, perNight: true },
  { id: "transfer", name: "Aeroportdan VIP Transfer (Mercedes S-Class)", priceUSD: 60, perNight: false },
  { id: "spa", name: "Imperial Termal SPA & Sauna Abonementi", priceUSD: 45, perNight: false },
  { id: "champagne", name: "Moët & Chandon Shampan va Yangi Mevlar savati", priceUSD: 40, perNight: false },
  { id: "butler", name: "Shaxsiy 24/7 Butler & Konsyerj xizmati", priceUSD: 80, perNight: true }
];

// Helper: Format Price by Selected Currency
function formatCurrency(amountUSD) {
  const converted = amountUSD * state.rates[state.currency];
  if (state.currency === 'UZS') {
    return `${Math.round(converted).toLocaleString('uz-UZ')} ${state.currencySymbols.UZS}`;
  } else if (state.currency === 'EUR') {
    return `${state.currencySymbols.EUR}${Math.round(converted)}`;
  } else {
    return `${state.currencySymbols.USD}${Math.round(converted)}`;
  }
}

// DOM Elements Initialization
document.addEventListener('DOMContentLoaded', () => {
  initDateDefaults();
  initNavbarScroll();
  initMobileMenu();
  renderRooms('all');
  initFilterTabs();
  initBookingModalEvents();
  initHeroBookingBar();
  initCurrencySwitcher();
  initLightbox();
  initContactForm();
  initFloatingActions();
});

// 1. Initialize Dates (Today & +2 days)
function initDateDefaults() {
  const today = new Date();
  const nextTwoDays = new Date();
  nextTwoDays.setDate(today.getDate() + 2);

  const formatDate = (d) => d.toISOString().split('T')[0];
  const todayStr = formatDate(today);
  const checkoutStr = formatDate(nextTwoDays);

  state.bookingForm.checkIn = todayStr;
  state.bookingForm.checkOut = checkoutStr;
  state.bookingForm.nights = 2;

  // Set inputs if available
  const heroCheckin = document.getElementById('hero-checkin');
  const heroCheckout = document.getElementById('hero-checkout');
  const modalCheckin = document.getElementById('modal-checkin');
  const modalCheckout = document.getElementById('modal-checkout');

  if (heroCheckin) {
    heroCheckin.value = todayStr;
    heroCheckin.min = todayStr;
  }
  if (heroCheckout) {
    heroCheckout.value = checkoutStr;
    heroCheckout.min = todayStr;
  }
  if (modalCheckin) {
    modalCheckin.value = todayStr;
    modalCheckin.min = todayStr;
  }
  if (modalCheckout) {
    modalCheckout.value = checkoutStr;
    modalCheckout.min = todayStr;
  }
}

// 2. Navbar Scroll Dynamic Styling
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// 3. Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      });
    });
  }
}

// 4. Currency Switcher Listener
function initCurrencySwitcher() {
  const currencySelects = document.querySelectorAll('.currency-select');
  currencySelects.forEach(select => {
    select.value = state.currency;
    select.addEventListener('change', (e) => {
      state.currency = e.target.value;
      currencySelects.forEach(s => s.value = state.currency);
      renderRooms(document.querySelector('.filter-tab.active')?.dataset.category || 'all');
      updateBookingCalculation();
      showToast(`Valyuta o'zgartirildi: ${state.currency}`);
    });
  });
}

// 5. Render Rooms Catalog
function renderRooms(category = 'all') {
  const container = document.getElementById('rooms-grid');
  if (!container) return;

  const filtered = category === 'all' 
    ? ROOMS_DATA 
    : ROOMS_DATA.filter(r => r.category === category);

  container.innerHTML = filtered.map(room => {
    const isFav = state.favorites.includes(room.id);
    return `
      <article class="room-card" data-room-id="${room.id}">
        <div class="room-image-wrap">
          <img src="${room.image}" alt="${room.title}" class="room-image" loading="lazy" />
          <span class="room-badge">${room.badge}</span>
          <button class="room-favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${room.id}, this)" title="Sevimlilarga saqlash">
            ${isFav ? '♥' : '♡'}
          </button>
        </div>
        <div class="room-content">
          <h3 class="room-title">${room.title}</h3>
          <p class="room-desc">${room.desc}</p>
          
          <div class="room-specs">
            <div class="spec-item">
              <span class="spec-icon">📐</span>
              <span class="spec-text">${room.size} m²</span>
            </div>
            <div class="spec-item">
              <span class="spec-icon">👥</span>
              <span class="spec-text">${room.guests} Mehmon</span>
            </div>
            <div class="spec-item">
              <span class="spec-icon">👑</span>
              <span class="spec-text">${room.bed}</span>
            </div>
          </div>

          <div class="room-bottom">
            <div class="room-price-box">
              <span class="room-price-label">Bir tun uchun</span>
              <span class="room-price">${formatCurrency(room.priceUSD)} <span class="room-price-period">/ tun</span></span>
            </div>
            <div class="room-actions">
              <button class="btn btn-outline btn-sm" onclick="openRoomDetailsModal(${room.id})">Batafsil</button>
              <button class="btn btn-gold btn-sm" onclick="openBookingModalForRoom(${room.id})">Bron qilish</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Favorite Toggle
window.toggleFavorite = function(roomId, btn) {
  const idx = state.favorites.indexOf(roomId);
  if (idx > -1) {
    state.favorites.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '♡';
    showToast("Xona sevimlilardan olib tashlandi");
  } else {
    state.favorites.push(roomId);
    btn.classList.add('active');
    btn.innerHTML = '♥';
    showToast("Xona sevimlilarga qo'shildi!");
  }
  localStorage.setItem('aurum_favorites', JSON.stringify(state.favorites));
};

// 6. Filter Tabs Click
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderRooms(tab.dataset.category);
    });
  });
}

// 7. Hero Quick Booking Bar Handling
function initHeroBookingBar() {
  const heroForm = document.getElementById('hero-booking-form');
  if (!heroForm) return;

  heroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkin = document.getElementById('hero-checkin').value;
    const checkout = document.getElementById('hero-checkout').value;
    const guests = document.getElementById('hero-guests').value;
    const roomCategory = document.getElementById('hero-room-type').value;

    state.bookingForm.checkIn = checkin;
    state.bookingForm.checkOut = checkout;
    state.bookingForm.guests = guests;

    // Filter rooms or match first room in category
    let targetRoom = ROOMS_DATA[0];
    if (roomCategory !== 'all') {
      const match = ROOMS_DATA.find(r => r.category === roomCategory);
      if (match) targetRoom = match;
    }

    // Scroll to rooms catalog or directly open booking modal
    openBookingModalForRoom(targetRoom.id);
  });
}

// 8. Open Booking Modal
window.openBookingModalForRoom = function(roomId) {
  state.selectedRoomId = roomId;
  state.bookingForm.roomId = roomId;

  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  // Sync Room Select inside modal
  const roomSelect = document.getElementById('modal-room-select');
  if (roomSelect) {
    roomSelect.innerHTML = ROOMS_DATA.map(r => `
      <option value="${r.id}" ${r.id === roomId ? 'selected' : ''}>
        ${r.title} - (${formatCurrency(r.priceUSD)} / tun)
      </option>
    `).join('');
  }

  // Sync dates
  const modalCheckin = document.getElementById('modal-checkin');
  const modalCheckout = document.getElementById('modal-checkout');
  const heroCheckin = document.getElementById('hero-checkin');
  const heroCheckout = document.getElementById('hero-checkout');

  if (modalCheckin && heroCheckin && heroCheckin.value) {
    modalCheckin.value = heroCheckin.value;
  }
  if (modalCheckout && heroCheckout && heroCheckout.value) {
    modalCheckout.value = heroCheckout.value;
  }

  // Render extra services
  renderExtraServicesCheckboxes();

  // Calculate prices
  updateBookingCalculation();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Render Extra Services in Booking Modal
function renderExtraServicesCheckboxes() {
  const container = document.getElementById('extra-services-container');
  if (!container) return;

  container.innerHTML = EXTRA_SERVICES.map(service => `
    <label class="service-checkbox-card" id="service-card-${service.id}">
      <div class="service-info">
        <input type="checkbox" class="service-checkbox" value="${service.id}" onchange="toggleExtraService('${service.id}', this)" />
        <span class="service-name">${service.name}</span>
      </div>
      <span class="service-price">+${formatCurrency(service.priceUSD)}</span>
    </label>
  `).join('');
}

window.toggleExtraService = function(serviceId, checkbox) {
  const card = document.getElementById(`service-card-${serviceId}`);
  if (checkbox.checked) {
    if (!state.bookingForm.extras.includes(serviceId)) {
      state.bookingForm.extras.push(serviceId);
    }
    card.classList.add('selected');
  } else {
    state.bookingForm.extras = state.bookingForm.extras.filter(id => id !== serviceId);
    card.classList.remove('selected');
  }
  updateBookingCalculation();
};

// 9. Booking Calculator Engine
function updateBookingCalculation() {
  const room = ROOMS_DATA.find(r => r.id === Number(state.bookingForm.roomId)) || ROOMS_DATA[0];

  const checkinInput = document.getElementById('modal-checkin');
  const checkoutInput = document.getElementById('modal-checkout');

  let nights = 1;
  if (checkinInput && checkoutInput && checkinInput.value && checkoutInput.value) {
    const d1 = new Date(checkinInput.value);
    const d2 = new Date(checkoutInput.value);
    const diffTime = d2 - d1;
    nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
  state.bookingForm.nights = nights;

  // Base Room Rate
  const roomBaseUSD = room.priceUSD * nights;

  // Extras calculation
  let extrasUSD = 0;
  state.bookingForm.extras.forEach(extraId => {
    const service = EXTRA_SERVICES.find(s => s.id === extraId);
    if (service) {
      extrasUSD += service.perNight ? (service.priceUSD * nights) : service.priceUSD;
    }
  });

  // 10% Luxury Service Tax
  const subtotalUSD = roomBaseUSD + extrasUSD;
  const taxUSD = subtotalUSD * 0.10;
  const grandTotalUSD = subtotalUSD + taxUSD;

  // Update Summary DOM
  const summaryImg = document.getElementById('summary-room-img');
  const summaryTitle = document.getElementById('summary-room-title');
  const summaryNightsLabel = document.getElementById('summary-nights-label');
  const summaryRoomPrice = document.getElementById('summary-room-price');
  const summaryExtrasPrice = document.getElementById('summary-extras-price');
  const summaryTaxPrice = document.getElementById('summary-tax-price');
  const summaryTotalPrice = document.getElementById('summary-total-price');

  if (summaryImg) summaryImg.src = room.image;
  if (summaryTitle) summaryTitle.textContent = room.title;
  if (summaryNightsLabel) summaryNightsLabel.textContent = `${room.title} (${nights} tun)`;
  if (summaryRoomPrice) summaryRoomPrice.textContent = formatCurrency(roomBaseUSD);
  if (summaryExtrasPrice) summaryExtrasPrice.textContent = formatCurrency(extrasUSD);
  if (summaryTaxPrice) summaryTaxPrice.textContent = formatCurrency(taxUSD);
  if (summaryTotalPrice) summaryTotalPrice.textContent = formatCurrency(grandTotalUSD);

  state.bookingForm.calculatedTotalUSD = grandTotalUSD;
}

// 10. Booking Modal Events & Form Submission
function initBookingModalEvents() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('close-booking-modal');
  const roomSelect = document.getElementById('modal-room-select');
  const checkinInput = document.getElementById('modal-checkin');
  const checkoutInput = document.getElementById('modal-checkout');
  const bookingForm = document.getElementById('main-booking-form');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (roomSelect) {
    roomSelect.addEventListener('change', (e) => {
      state.bookingForm.roomId = Number(e.target.value);
      updateBookingCalculation();
    });
  }

  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', () => {
      checkoutInput.min = checkinInput.value;
      if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
        const nextDay = new Date(checkinInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutInput.value = nextDay.toISOString().split('T')[0];
      }
      updateBookingCalculation();
    });

    checkoutInput.addEventListener('change', () => {
      updateBookingCalculation();
    });
  }

  // Submit Booking Form
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const guestName = document.getElementById('guest-name').value.trim();
      const guestPhone = document.getElementById('guest-phone').value.trim();
      const guestEmail = document.getElementById('guest-email').value.trim();
      const guestNotes = document.getElementById('guest-notes').value.trim();

      if (!guestName || !guestPhone || !guestEmail) {
        showToast("Iltimos, barcha majburiy maydonlarni to'ldiring!", "error");
        return;
      }

      // Close Booking Modal
      modal.classList.remove('active');

      // Generate Voucher Details
      const room = ROOMS_DATA.find(r => r.id === Number(state.bookingForm.roomId)) || ROOMS_DATA[0];
      const bookingCode = `AUR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      showVoucherModal({
        code: bookingCode,
        name: guestName,
        phone: guestPhone,
        email: guestEmail,
        roomName: room.title,
        checkIn: checkinInput.value,
        checkOut: checkoutInput.value,
        nights: state.bookingForm.nights,
        guests: document.getElementById('modal-guests').value,
        totalFormatted: formatCurrency(state.bookingForm.calculatedTotalUSD),
        notes: guestNotes || "Maxsus talablar yo'q"
      });

      // Celebration Toast
      showToast(`Tabriklaymiz! Sizning bron raqamingiz: ${bookingCode}`);
    });
  }
}

// 11. Luxury Booking Voucher Modal Display
function showVoucherModal(data) {
  const voucherModal = document.getElementById('voucher-modal');
  if (!voucherModal) return;

  document.getElementById('ticket-booking-code').textContent = data.code;
  document.getElementById('ticket-guest-name').textContent = data.name;
  document.getElementById('ticket-phone').textContent = data.phone;
  document.getElementById('ticket-room').textContent = data.roomName;
  document.getElementById('ticket-dates').textContent = `${data.checkIn} — ${data.checkOut} (${data.nights} tun)`;
  document.getElementById('ticket-guests').textContent = `${data.guests} kishi`;
  document.getElementById('ticket-total').textContent = data.totalFormatted;

  voucherModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Close Voucher
  const closeVoucherBtn = document.getElementById('close-voucher-modal');
  if (closeVoucherBtn) {
    closeVoucherBtn.onclick = () => {
      voucherModal.classList.remove('active');
      document.body.style.overflow = '';
    };
  }

  const printBtn = document.getElementById('print-voucher-btn');
  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
    };
  }
}

// 12. Room Details Modal
window.openRoomDetailsModal = function(roomId) {
  const room = ROOMS_DATA.find(r => r.id === roomId);
  if (!room) return;

  const modal = document.getElementById('room-detail-modal');
  if (!modal) return;

  document.getElementById('detail-modal-img').src = room.image;
  document.getElementById('detail-modal-title').textContent = room.title;
  document.getElementById('detail-modal-badge').textContent = room.badge;
  document.getElementById('detail-modal-price').innerHTML = `${formatCurrency(room.priceUSD)} <span class="room-price-period">/ tun</span>`;
  document.getElementById('detail-modal-desc').textContent = room.desc;
  document.getElementById('detail-modal-size').textContent = `${room.size} m²`;
  document.getElementById('detail-modal-bed').textContent = room.bed;
  document.getElementById('detail-modal-guests').textContent = `${room.guests} Mehmon`;

  // Features List
  const featuresList = document.getElementById('detail-modal-features');
  if (featuresList) {
    featuresList.innerHTML = room.features.map(f => `
      <li style="display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:0.92rem;color:var(--text-main);">
        <span style="color:var(--gold-primary);">✦</span> ${f}
      </li>
    `).join('');
  }

  // Book now button in detail modal
  const bookBtn = document.getElementById('detail-modal-book-btn');
  if (bookBtn) {
    bookBtn.onclick = () => {
      modal.classList.remove('active');
      openBookingModalForRoom(room.id);
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('close-room-detail-modal');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };
  }
};

// 13. Interactive Lightbox for Gallery
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('close-lightbox');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn && lightbox) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

// 14. Contact VIP Concierge Form
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    form.reset();
    showToast(`Rahmat, ${name}! VIP konsyerjimiz 15 daqiqa ichida siz bilan bog'lanadi.`);
  });

  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.reset();
      showToast("Eksklyuziv takliflar obunasiga muvaffaqiyatli a'zo bo'ldingiz!");
    });
  }
}

// 15. Floating Action Buttons (Scroll to top)
function initFloatingActions() {
  const topBtn = document.getElementById('scroll-top-btn');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.style.opacity = '1';
      topBtn.style.pointerEvents = 'auto';
    } else {
      topBtn.style.opacity = '0';
      topBtn.style.pointerEvents = 'none';
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 16. Luxury Toast Notification System
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-success-icon">${type === 'error' ? '⚠️' : '✦'}</span>
    <span style="font-size:0.92rem;font-weight:500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
