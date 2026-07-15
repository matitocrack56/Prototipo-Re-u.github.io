/**
 * ==========================================
 * RE-U - USER PROFILE LOGIC
 * Tab navigation, publishing, parameters handling.
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.profile-container')) {
    initTabs();
    checkURLParameters();
    initProfileActions();
  }
});

/**
 * Tab Toggling Engine
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.profile-tab-btn');
  const tabContents = document.querySelectorAll('.profile-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Reset active states
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Activate selected
      btn.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });
}

/**
 * Handle URL Search Parameters (Deep Linking)
 */
function checkURLParameters() {
  const params = new URLSearchParams(window.location.search);
  const action = params.get('action');

  if (action === 'new-sale') {
    // Switch to My Publications Tab
    triggerTabActivation('publications');
    window.showToast(
      'Publicar Artículo',
      'Por favor completa el formulario debajo para listar tu producto.',
      'info'
    );
    // Smooth scroll to form
    const formElement = document.getElementById('market-publish-form');
    if (formElement) {
      setTimeout(() => {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  } else if (action === 'new-tutor') {
    // Switch to Tutor Tab
    triggerTabActivation('tutor');
    window.showToast(
      'Asociarse como Tutor',
      'Únete al equipo completando tus especialidades e ingresando tu tarifa por hora.',
      'info'
    );
    // Smooth scroll to form
    const formElement = document.getElementById('tutor-register-form');
    if (formElement) {
      setTimeout(() => {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }
}

function triggerTabActivation(tabId) {
  const tabBtn = document.querySelector(`.profile-tab-btn[data-tab="${tabId}"]`);
  const tabContent = document.getElementById(`tab-${tabId}`);
  
  if (tabBtn && tabContent) {
    document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.profile-tab-content').forEach(c => c.classList.remove('active'));
    
    tabBtn.classList.add('active');
    tabContent.classList.add('active');
  }
}

/**
 * Profile Forms and Item Deletions Actions
 */
function initProfileActions() {
  const marketForm = document.getElementById('market-publish-form');
  const tutorForm = document.getElementById('tutor-register-form');
  const editProfileForm = document.getElementById('edit-profile-form');

  // Publish Item Form
  if (marketForm) {
    marketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('p-name').value.trim();
      const price = document.getElementById('p-price').value.trim();
      const category = document.getElementById('p-category').value;
      const location = document.getElementById('p-location').value;

      if (!name || !price) {
        window.showToast('Error', 'Completa los campos obligatorios.', 'error');
        return;
      }

      // Add dummy row to active products table
      const productsTable = document.querySelector('#tab-publications .items-table tbody');
      if (productsTable) {
        const newRow = document.createElement('tr');
        newRow.id = `my-pub-${Date.now()}`;
        newRow.innerHTML = `
          <td>
            <span class="table-title-cell">${name}</span>
            <span class="table-sub-cell">${category.toUpperCase()}</span>
          </td>
          <td><span class="status-badge status-active">Activo</span></td>
          <td>S/. ${price}</td>
          <td>
            <div class="table-actions">
              <button class="btn-table-action" onclick="deleteMyItem('${newRow.id}')" title="Eliminar publicación">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        `;
        productsTable.appendChild(newRow);
      }

      window.showToast(
        'Publicación exitosa',
        `"${name}" ha sido listado en el marketplace de Re-U.`,
        'success'
      );
      marketForm.reset();
    });
  }

  // Become a Tutor Form
  if (tutorForm) {
    tutorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const rate = document.getElementById('t-rate').value.trim();
      const courses = document.getElementById('t-courses').value.trim();

      if (!rate || !courses) {
        window.showToast('Error', 'Completa tus cursos dominantes y tu tarifa.', 'error');
        return;
      }

      // Transform profile into "Registered Tutor"
      const statusArea = document.getElementById('tutor-status-area');
      if (statusArea) {
        statusArea.innerHTML = `
          <div style="text-align:center; padding: 2.5rem; background-color: var(--azul-transparente); border-radius: var(--radius-md); border:1px solid var(--azul-claro-transparente);">
            <i class="fa-solid fa-circle-check" style="font-size:3rem; color: var(--azul); margin-bottom:1rem;"></i>
            <h4 style="font-family: var(--font-display); font-size:1.25rem; font-weight:700; color:var(--negro); margin-bottom:0.5rem;">¡Eres Tutor Activo en Re-U!</h4>
            <p style="font-size:0.88rem; color:var(--gris-oscuro); margin-bottom:1.5rem;">Tu perfil ya está listado en el buscador público de tutorías.</p>
            <div style="display:inline-flex; gap:1.5rem; background:white; padding: 1rem 2rem; border-radius: var(--radius-md); border:1px solid var(--gris-claro);">
              <div style="text-align:left;">
                <span style="font-size:0.75rem; color:var(--gris-medio); text-transform:uppercase; font-weight:600;">Tarifa</span>
                <strong style="display:block; font-size:1.1rem;">S/. ${rate}/hora</strong>
              </div>
              <div style="text-align:left; border-left: 1px solid var(--gris-claro); padding-left:1.5rem;">
                <span style="font-size:0.75rem; color:var(--gris-medio); text-transform:uppercase; font-weight:600;">Especialidades</span>
                <strong style="display:block; font-size:0.85rem; max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${courses}</strong>
              </div>
            </div>
          </div>
        `;
      }

      // Increment statistics
      const counterEl = document.getElementById('tutor-hours-counter');
      if (counterEl) {
        counterEl.textContent = '0 h';
      }

      window.showToast(
        '¡Registro completo!',
        'Ya estás registrado como tutor. Te llegarán alertas cuando te agenden.',
        'success'
      );
    });
  }

  // Edit profile details
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('user-edit-name').value.trim();
      const newCareer = document.getElementById('user-edit-career').value;

      if (!newName) return;

      // Update Header/Sidebar names
      const displayNames = document.querySelectorAll('.user-name, .profile-user-info h2');
      displayNames.forEach(el => {
        el.textContent = newName;
      });

      const displayCareers = document.querySelectorAll('.user-role, .user-career-tag');
      displayCareers.forEach(el => {
        el.textContent = newCareer;
      });

      window.showToast(
        'Perfil actualizado',
        'Tus cambios de datos se guardaron con éxito en esta sesión.',
        'success'
      );
    });
  }
}

/**
 * Handle Item Deletions
 */
function deleteMyItem(itemId) {
  const row = document.getElementById(itemId);
  if (!row) return;

  const itemName = row.querySelector('.table-title-cell')?.textContent || 'El elemento';

  if (confirm(`¿Estás seguro de que deseas eliminar "${itemName}"?`)) {
    row.style.opacity = '0';
    row.style.transform = 'scale(0.9)';
    row.style.transition = 'all 0.4s ease-out';
    
    setTimeout(() => {
      row.remove();
      window.showToast(
        'Elemento eliminado',
        `"${itemName}" fue retirado con éxito.`,
        'success'
      );
    }, 400);
  }
}

window.deleteMyItem = deleteMyItem;
