/**
 * ==========================================
 * RE-U - ANIMATIONS & SCROLL OBSERVERS
 * Clean scroll entrance triggers, element floats.
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  addCardHoverParallax();
});

/**
 * Scroll reveal triggers using Intersection Observer
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (!revealElements.length) return;

  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% of element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add active class to trigger CSS transition
        entry.target.classList.add('active');
        
        // Unobserve once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/**
 * Slight 3D Tilt/Hover Parallax Effect for premium cards (Notion/Figma style)
 */
function addCardHoverParallax() {
  const cards = document.querySelectorAll('.glass-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside the card
      const y = e.clientY - rect.top;  // y coordinate inside the card

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt degrees (max 5deg)
      const rotateX = ((centerY - y) / centerY) * 4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      // Smooth reset when mouse exits
      card.style.transform = 'translateY(0) perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}
