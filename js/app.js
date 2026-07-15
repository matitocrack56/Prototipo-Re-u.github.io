/**
 * ==========================================
 * RE-U - GLOBAL APP JS
 * Core shared functionality for the platform.
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderSearch();
  initNotifications();
  setupRippleEffects();
});

/**
 * Navigation and Mobile Menu Drawer Setup
 */
function initNavigation() {
  const sidebar = document.querySelector('.sidebar');
  const mobileToggle = document.querySelector('.mobile-menu-btn');
  
  if (!sidebar) return;

  // Create overlay element dynamically if not present
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  // Toggle Sidebar on mobile
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });
  }

  // Close sidebar on overlay click
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

  // Smooth scroll helper for anchor links (if any)
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Top Header Search Bar Animations & Handlers
 */
function initHeaderSearch() {
  const searchInput = document.querySelector('.header-search input');
  if (!searchInput) return;

  // Listen to Enter key on search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        showToast('Búsqueda global', `Buscando "${query}" en toda la plataforma...`, 'info');
      }
    }
  });
}

/**
 * Notification Badge and Dropdown Setup
 */
function initNotifications() {
  const notifBtn = document.querySelector('.icon-badge-btn');
  if (!notifBtn) return;

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const badge = notifBtn.querySelector('.badge');
    if (badge) {
      // Clear badge on click (read notification)
      badge.remove();
      showToast('Notificaciones', 'Has leído todas tus notificaciones.', 'success');
    } else {
      showToast('Notificaciones', 'No tienes nuevas notificaciones en este momento.', 'info');
    }
  });
}

/**
 * Simple Elegant Toast Engine
 */
function showToast(title, description, type = 'success') {
  // Create toast container if not existing
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  // Determine icon
  let iconClass = 'fa-circle-check';
  if (type === 'info') iconClass = 'fa-circle-info';
  if (type === 'error') iconClass = 'fa-circle-exclamation';
  if (type === 'warning') iconClass = 'fa-triangle-exclamation';

  // Determine color theme
  if (type === 'error') {
    toast.style.borderLeftColor = '#ef4444';
  } else if (type === 'info') {
    toast.style.borderLeftColor = 'var(--azul-claro)';
  } else if (type === 'warning') {
    toast.style.borderLeftColor = '#f59e0b';
  } else {
    toast.style.borderLeftColor = 'var(--verde)';
  }

  // Build structure
  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <div class="toast-content">
      <span class="toast-title">${title}</span>
      <span class="toast-desc">${description}</span>
    </div>
  `;

  // Trigger animation
  toast.classList.add('active');

  // Clear timeout if clicked or active
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}

/**
 * Ripple Click Effect for buttons
 */
function setupRippleEffects() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn');
    if (!target) return;

    // Create ripple circle
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    // Position ripple relative to button
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    target.appendChild(ripple);
    
    // Remove ripple after animation runs
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });
}

// Make showToast accessible globally
window.showToast = showToast;
