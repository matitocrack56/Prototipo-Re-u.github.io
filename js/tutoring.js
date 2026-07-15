/**
 * ==========================================
 * RE-U - TUTORÍAS ACADÉMICAS LOGIC
 * Dynamic listing, rating, booking.
 * ==========================================
 */

const tutores = [
  {
    id: 1,
    name: 'Ing. Carlos Mendoza',
    career: 'Ingeniería Civil',
    courses: ['Mecánica de Suelos', 'Estructuras I', 'Concreto Armado'],
    rating: 4.9,
    price: 35.00,
    avatarLetter: 'CM'
  },
  {
    id: 2,
    name: 'Sofía Rojas',
    career: 'Ingeniería de Sistemas',
    courses: ['Cálculo Multivariable', 'Álgebra Lineal', 'Física II'],
    rating: 4.8,
    price: 25.00,
    avatarLetter: 'SR'
  },
  {
    id: 3,
    name: 'Dr. Alejandro Paz',
    career: 'Ingeniería de Sistemas',
    courses: ['Algoritmos y Estructuras', 'Estructuras de Datos', 'Base de Datos II'],
    rating: 5.0,
    price: 45.00,
    avatarLetter: 'AP'
  },
  {
    id: 4,
    name: 'Valentina Díaz',
    career: 'Ingeniería Industrial',
    courses: ['Termodinámica I', 'Física General III', 'Estadística I'],
    rating: 4.7,
    price: 22.00,
    avatarLetter: 'VD'
  },
  {
    id: 5,
    name: 'Mateo Torres',
    career: 'Ingeniería Civil',
    courses: ['Cálculo I', 'Física I', 'Geometría Descriptiva'],
    rating: 4.6,
    price: 20.00,
    avatarLetter: 'MT'
  },
  {
    id: 6,
    name: 'Lic. Camila Benítez',
    career: 'Ingeniería Industrial',
    courses: ['Investigación de Operaciones', 'Costos y Presupuestos', 'Logística'],
    rating: 4.9,
    price: 30.00,
    avatarLetter: 'CB'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tutors-grid')) {
    renderTutors(tutores);
    initTutorsFilters();
    initBookingModal();
  }
});

/**
 * Render Tutors list
 */
function renderTutors(tutorsList) {
  const grid = document.getElementById('tutors-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (tutorsList.length === 0) {
    grid.innerHTML = `
      <div class="empty-state-wrapper glass-card">
        <i class="fa-solid fa-graduation-cap"></i>
        <h3>No se encontraron tutores</h3>
        <p>Prueba ampliando los filtros de precio o buscando otro curso.</p>
      </div>
    `;
    return;
  }

  tutorsList.forEach(tutor => {
    const card = document.createElement('div');
    card.className = 'tutor-card glass-card reveal-on-scroll active';
    card.id = `tutor-card-${tutor.id}`;

    // Render ratings stars
    let starsHtml = '';
    const fullStars = Math.floor(tutor.rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
      } else {
        starsHtml += '<i class="fa-regular fa-star"></i>';
      }
    }

    // Render courses tags
    let tagsHtml = '';
    tutor.courses.forEach(course => {
      tagsHtml += `<span class="course-tag">${course}</span>`;
    });

    card.innerHTML = `
      <div class="tutor-header">
        <div class="tutor-avatar-wrapper">
          <div class="tutor-avatar">${tutor.avatarLetter}</div>
          <span class="tutor-status" title="Disponible ahora"></span>
        </div>
        <div class="tutor-header-info">
          <h3 class="tutor-name">${tutor.name}</h3>
          <span class="tutor-career">${tutor.career}</span>
          <div class="tutor-rating">
            ${starsHtml}
            <span>${tutor.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div class="tutor-body">
        <span class="tutor-section-label">Especialidades</span>
        <div class="tutor-courses-tags">
          ${tagsHtml}
        </div>
      </div>
      <div class="tutor-footer">
        <div class="tutor-price">
          <span class="tutor-price-value">S/. ${tutor.price.toFixed(2)}</span>
          <span class="tutor-price-unit">por hora</span>
        </div>
        <button class="btn btn-primary btn-contact" onclick="openBookingModal(${tutor.id})">
          <i class="fa-solid fa-comments"></i> Contactar
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

/**
 * Filter logic
 */
function initTutorsFilters() {
  const searchInput = document.getElementById('search-tutor-course');
  const filterCareer = document.getElementById('filter-tutor-carrera');
  const filterPrice = document.getElementById('filter-tutor-precio');
  const btnReset = document.getElementById('btn-reset-tutor-filters');

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const career = filterCareer ? filterCareer.value : 'Todos';
    const priceRange = filterPrice ? filterPrice.value : 'Todos';

    const filtered = tutores.filter(tutor => {
      // Matches course search
      const matchesCourse = query === '' || tutor.courses.some(c => c.toLowerCase().includes(query)) || tutor.name.toLowerCase().includes(query);
      const matchesCareer = career === 'Todos' || tutor.career === career;
      
      let matchesPrice = true;
      if (priceRange === 'bajo') {
        matchesPrice = tutor.price <= 25;
      } else if (priceRange === 'medio') {
        matchesPrice = tutor.price > 25 && tutor.price <= 35;
      } else if (priceRange === 'alto') {
        matchesPrice = tutor.price > 35;
      }

      return matchesCourse && matchesCareer && matchesPrice;
    });

    renderTutors(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (filterCareer) filterCareer.addEventListener('change', applyFilters);
  if (filterPrice) filterPrice.addEventListener('change', applyFilters);

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (filterCareer) filterCareer.value = 'Todos';
      if (filterPrice) filterPrice.value = 'Todos';
      renderTutors(tutores);
      window.showToast('Filtros reiniciados', 'Se están mostrando todos los tutores.', 'info');
    });
  }
}

/**
 * Contact/Booking Modal Setup
 */
let activeTutorId = null;

function openBookingModal(tutorId) {
  const tutor = tutores.find(t => t.id === tutorId);
  if (!tutor) return;

  activeTutorId = tutorId;
  const modalOverlay = document.getElementById('booking-modal');
  if (!modalOverlay) return;

  // Set tutor profile header
  const profileHeader = modalOverlay.querySelector('.modal-tutor-profile');
  if (profileHeader) {
    profileHeader.innerHTML = `
      <div class="modal-tutor-avatar">${tutor.avatarLetter}</div>
      <div class="modal-tutor-info">
        <span class="modal-tutor-name">${tutor.name}</span>
        <span class="modal-tutor-meta">${tutor.career} • S/. ${tutor.price.toFixed(2)}/h</span>
      </div>
    `;
  }

  // Populate dynamic course options inside modal select
  const courseSelect = document.getElementById('book-course');
  if (courseSelect) {
    courseSelect.innerHTML = '';
    tutor.courses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      courseSelect.appendChild(opt);
    });
  }

  modalOverlay.classList.add('active');
}

function initBookingModal() {
  const modalOverlay = document.getElementById('booking-modal');
  const closeBtn = modalOverlay?.querySelector('.modal-close-btn');
  const cancelBtn = modalOverlay?.querySelector('.btn-secondary');
  const bookingForm = document.getElementById('booking-form');

  if (!modalOverlay) return;

  const closeModal = () => modalOverlay.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const course = document.getElementById('book-course').value;
      const date = document.getElementById('book-date').value;
      const time = document.getElementById('book-time').value;
      const notes = document.getElementById('book-notes').value.trim();

      if (!date || !time) {
        window.showToast('Error', 'Por favor selecciona fecha y hora para la asesoría.', 'error');
        return;
      }

      const tutor = tutores.find(t => t.id === activeTutorId);
      closeModal();
      
      window.showToast(
        'Solicitud enviada',
        `Tu solicitud de asesoría en ${course} con ${tutor ? tutor.name : 'el tutor'} fue registrada. Te contactarán por WhatsApp.`,
        'success'
      );
      
      bookingForm.reset();
    });
  }
}

window.openBookingModal = openBookingModal;
