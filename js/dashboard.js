/**
 * ==========================================
 * RE-U - DASHBOARD LOGIC
 * Dynamic stats counter, active activities.
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Only execute if we are on the dashboard
  if (document.querySelector('.stats-grid')) {
    animateCounters();
    initActivityTicker();
  }
});

/**
 * Animated Count-up for Dashboard Metrics
 */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const targetText = counter.textContent.trim();
    // Parse the number from strings like "1200+"
    const targetVal = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
    const suffix = targetText.replace(/[0-9]/g, ''); // Extract "+" or others
    
    let currentVal = 0;
    const duration = 1500; // 1.5 seconds animation
    const steps = 60;
    const stepVal = Math.ceil(targetVal / steps);
    const intervalTime = duration / steps;
    
    counter.textContent = "0" + suffix;
    
    const interval = setInterval(() => {
      currentVal += stepVal;
      if (currentVal >= targetVal) {
        counter.textContent = targetVal + suffix;
        clearInterval(interval);
      } else {
        counter.textContent = currentVal + suffix;
      }
    }, intervalTime);
  });
}

/**
 * Live Activity Ticker (simulating new activities)
 */
function initActivityTicker() {
  const activityList = document.querySelector('.activity-list');
  if (!activityList) return;

  const userNames = ['Carlos Mendoza', 'Sofía Rojas', 'Alejandro Paz', 'Valentina Díaz', 'Mateo Torres', 'Camila Benítez'];
  const courses = ['Física III', 'Cálculo Multivariable', 'Estructura de Datos', 'Termodinámica', 'Álgebra Lineal', 'Química Orgánica'];
  const products = ['Mochila impermeable', 'Calculadora Casio fx-991', 'Libro de Stewart 8va Ed.', 'iPad Air 4ta Gen', 'Compás técnico profesional'];

  const activities = [
    {
      type: 'act-download',
      icon: 'fa-download',
      text: (user, course) => `<strong>${user}</strong> descargó <em>Apuntes de ${course}</em>`,
      badge: 'Descarga'
    },
    {
      type: 'act-upload',
      icon: 'fa-cloud-arrow-up',
      text: (user, course) => `<strong>${user}</strong> subió <em>Examen Final - ${course}</em>`,
      badge: 'Aporte'
    },
    {
      type: 'act-sale',
      icon: 'fa-tags',
      text: (user, course, prod) => `<strong>${user}</strong> publicó en venta <em>${prod}</em>`,
      badge: 'Venta'
    }
  ];

  // Tick every 12 seconds to append/rotate activities
  setInterval(() => {
    const randomAct = activities[Math.floor(Math.random() * activities.length)];
    const randomUser = userNames[Math.floor(Math.random() * userNames.length)];
    const randomCourse = courses[Math.floor(Math.random() * courses.length)];
    const randomProd = products[Math.floor(Math.random() * products.length)];

    const item = document.createElement('div');
    item.className = `activity-item ${randomAct.type} reveal-on-scroll active`;
    item.style.opacity = '0';
    item.style.transform = 'translateX(-10px)';
    item.style.transition = 'all 0.5s ease-out';

    const formattedText = randomAct.text(randomUser, randomCourse, randomProd);

    item.innerHTML = `
      <div class="activity-icon">
        <i class="fa-solid ${randomAct.icon}"></i>
      </div>
      <div class="activity-content">
        <span class="activity-text">${formattedText}</span>
        <span class="activity-time">Hace unos instantes</span>
      </div>
      <span class="activity-badge">${randomAct.badge}</span>
    `;

    // Append to top, remove bottom if list exceeds 6 items
    activityList.insertBefore(item, activityList.firstChild);
    
    // Smooth transition in
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, 50);

    const currentItems = activityList.querySelectorAll('.activity-item');
    if (currentItems.length > 5) {
      const lastItem = currentItems[currentItems.length - 1];
      lastItem.style.opacity = '0';
      lastItem.style.transform = 'translateY(10px)';
      setTimeout(() => {
        lastItem.remove();
      }, 500);
    }
  }, 12000);
}
