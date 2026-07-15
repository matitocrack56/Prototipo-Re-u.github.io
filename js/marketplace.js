/**
 * ==========================================
 * RE-U - MARKETPLACE LOGIC
 * Dynamic listing, categories, detail modals.
 * ==========================================
 */

const productos = [
  {
    id: 1,
    name: 'Mochila Impermeable con Puerto USB',
    category: 'mochilas',
    price: 'S/. 85.00',
    seller: 'Kendra Torres',
    location: 'Facultad de Ingeniería',
    description: 'Mochila semi-nueva de alta resistencia. Cuenta con puerto USB exterior, compartimento acolchado para laptop de hasta 15.6 pulgadas y bolsillos antirrobo.',
    icon: 'fa-bag-shopping'
  },
  {
    id: 2,
    name: 'Calculadora Científica Casio fx-991LA Plus',
    category: 'calculadoras',
    price: 'S/. 120.00',
    seller: 'Mario Valencia',
    location: 'Biblioteca Central',
    description: 'Perfecto estado, caja original y manuales incluidos. Ideal para ingeniería civil, química y sistemas con más de 400 funciones científicas.',
    icon: 'fa-calculator'
  },
  {
    id: 3,
    name: 'Libro de Cálculo de Una Variable - James Stewart',
    category: 'libros',
    price: 'S/. 75.00',
    seller: 'Sofía Cáceres',
    location: 'Comedor Universitario',
    description: 'Libro James Stewart 8va edición en español. Sin anotaciones, hojas en perfecto estado, forrado con vinifán. Indispensable para los primeros ciclos.',
    icon: 'fa-book'
  },
  {
    id: 4,
    name: 'iPad Air 4 (64GB) + Apple Pencil 2',
    category: 'tablets',
    price: 'S/. 1,850.00',
    seller: 'Renzo Díaz',
    location: 'Pabellón B - Sistemas',
    description: 'Muy cuidado, siempre usado con mica de vidrio templado y funda protectora. Batería al 89%. Incluye su caja original y cargador carga rápida.',
    icon: 'fa-tablet-screen-button'
  },
  {
    id: 5,
    name: 'Laptop Lenovo ThinkPad L14 (Core i5, 16GB RAM)',
    category: 'laptops',
    price: 'S/. 1,600.00',
    seller: 'Alejandro Paz',
    location: 'Facultad de Ciencias',
    description: 'Excelente laptop para programar y hacer trabajos. Disco de 512GB SSD PCIe NVMe, batería rinde hasta 6 horas. Teclado en español retroiluminado.',
    icon: 'fa-laptop'
  },
  {
    id: 6,
    name: 'Bata de Laboratorio de Algodón Blanca - Talla M',
    category: 'uniformes',
    price: 'S/. 30.00',
    seller: 'Valeria Sifuentes',
    location: 'Pabellón G - Química',
    description: 'Bata unisex 100% algodón grueso de alta calidad para laboratorios de química o biología. Excelente estado, solo se usó 3 veces.',
    icon: 'fa-shirt'
  },
  {
    id: 7,
    name: 'Libro de Física Universitaria Vol 1 - Sears Zemansky',
    category: 'libros',
    price: 'S/. 90.00',
    seller: 'Diego Medina',
    location: 'Facultad de Física',
    description: 'Física Universitaria 12va Edición. Cubre mecánica, ondas y termodinámica. Esencial para Física I y Física II.',
    icon: 'fa-book-open'
  },
  {
    id: 8,
    name: 'Tableta Gráfica Wacom Intuos Small',
    category: 'tablets',
    price: 'S/. 190.00',
    seller: 'Camila Benítez',
    location: 'Facultad de Arquitectura',
    description: 'Tableta digitalizadora ideal para apuntes digitales en OneNote o diseño gráfico. Conexión USB, incluye lápiz óptico libre de baterías y puntas de repuesto.',
    icon: 'fa-pen-fancy'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('products-grid')) {
    renderProducts(productos);
    initMarketplaceFilters();
    initProductModal();
  }
});

/**
 * Render products cards
 */
function renderProducts(productsList) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (productsList.length === 0) {
    grid.innerHTML = `
      <div class="empty-state-wrapper glass-card">
        <i class="fa-solid fa-basket-shopping"></i>
        <h3>No se encontraron productos</h3>
        <p>Prueba seleccionando otra categoría o modificando la búsqueda.</p>
      </div>
    `;
    return;
  }

  productsList.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card glass-card reveal-on-scroll active';
    card.id = `prod-card-${prod.id}`;

    // Category naming
    const catFormatted = prod.category.charAt(0).toUpperCase() + prod.category.slice(1);

    card.innerHTML = `
      <div class="product-image-area">
        <div class="product-image-bg"></div>
        <span class="product-price-badge">${prod.price}</span>
        <i class="fa-solid ${prod.icon}"></i>
      </div>
      <div class="product-info">
        <span class="product-category-tag">${catFormatted}</span>
        <h3 class="product-name" title="${prod.name}">${prod.name}</h3>
        <div class="product-details">
          <div class="prod-detail-item">
            <i class="fa-solid fa-user"></i>
            <span>Vendedor: ${prod.seller}</span>
          </div>
          <div class="prod-detail-item">
            <i class="fa-solid fa-location-dot"></i>
            <span title="${prod.location}">${prod.location}</span>
          </div>
        </div>
        <button class="btn btn-primary btn-view-more" onclick="openProductDetail(${prod.id})">
          <i class="fa-solid fa-circle-info"></i> Ver más
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

/**
 * Filter Marketplace
 */
function initMarketplaceFilters() {
  const searchInput = document.getElementById('search-product');
  const categoryPills = document.querySelectorAll('.category-pill');
  let selectedCategory = 'all';

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = productos.filter(prod => {
      const matchesSearch = prod.name.toLowerCase().includes(query) || prod.description.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
  }

  // Search input change
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Category selection pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      selectedCategory = pill.getAttribute('data-category');
      applyFilters();
    });
  });
}

/**
 * Product Details Modal logic
 */
let activeProductId = null;

function openProductDetail(prodId) {
  const prod = productos.find(p => p.id === prodId);
  if (!prod) return;

  activeProductId = prodId;
  const modalOverlay = document.getElementById('product-detail-modal');
  if (!modalOverlay) return;

  // Render modal content
  const contentArea = modalOverlay.querySelector('.modal-product-layout');
  if (contentArea) {
    const catFormatted = prod.category.charAt(0).toUpperCase() + prod.category.slice(1);
    
    contentArea.innerHTML = `
      <div class="modal-product-img">
        <i class="fa-solid ${prod.icon}"></i>
      </div>
      <div class="modal-product-meta">
        <div class="modal-product-header">
          <div class="modal-product-title">
            <span>${catFormatted}</span>
            <h4>${prod.name}</h4>
          </div>
          <div class="modal-product-price">${prod.price}</div>
        </div>
        <p class="modal-product-desc">${prod.description}</p>
        
        <div class="modal-seller-card">
          <div class="modal-seller-avatar">
            ${prod.seller.charAt(0)}
          </div>
          <div class="modal-seller-info">
            <span class="modal-seller-name">Vendedor: ${prod.seller}</span>
            <span class="modal-seller-location">
              <i class="fa-solid fa-location-dot" style="color: var(--verde);"></i> Encuentro: ${prod.location}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  modalOverlay.classList.add('active');
}

function initProductModal() {
  const modalOverlay = document.getElementById('product-detail-modal');
  const closeBtn = modalOverlay?.querySelector('.modal-close-btn');
  const contactBtn = document.getElementById('btn-contact-seller');
  const messageModal = document.getElementById('contact-seller-message-modal');
  
  if (!modalOverlay) return;

  const closeModal = () => modalOverlay.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Open direct messaging modal
  if (contactBtn && messageModal) {
    contactBtn.addEventListener('click', () => {
      closeModal();
      
      const prod = productos.find(p => p.id === activeProductId);
      if (!prod) return;

      // Set tutor/seller details on message form
      const tutorProfile = messageModal.querySelector('.modal-tutor-profile');
      if (tutorProfile) {
        tutorProfile.innerHTML = `
          <div class="modal-tutor-avatar">${prod.seller.charAt(0)}</div>
          <div class="modal-tutor-info">
            <span class="modal-tutor-name">${prod.seller}</span>
            <span class="modal-tutor-meta">Venta de: ${prod.name}</span>
          </div>
        `;
      }

      messageModal.classList.add('active');
    });
  }

  // Setup actual sending message simulation
  if (messageModal) {
    const msgClose = messageModal.querySelector('.modal-close-btn');
    const msgCancel = messageModal.querySelector('.btn-secondary');
    const msgForm = document.getElementById('contact-seller-form');

    const closeMsgModal = () => messageModal.classList.remove('active');

    if (msgClose) msgClose.addEventListener('click', closeMsgModal);
    if (msgCancel) msgCancel.addEventListener('click', closeMsgModal);

    messageModal.addEventListener('click', (e) => {
      if (e.target === messageModal) closeMsgModal();
    });

    if (msgForm) {
      msgForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('seller-msg-text').value.trim();
        const phone = document.getElementById('seller-msg-phone').value.trim();

        if (!text || !phone) {
          window.showToast('Error', 'Completa el mensaje y tu teléfono.', 'error');
          return;
        }

        closeMsgModal();
        window.showToast(
          'Mensaje enviado',
          'El vendedor se pondrá en contacto contigo en breve por WhatsApp.',
          'success'
        );
        msgForm.reset();
      });
    }
  }
}

// Bind open function to window scope
window.openProductDetail = openProductDetail;
