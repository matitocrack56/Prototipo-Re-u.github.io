/**
 * ==========================================
 * RE-U - REPOSITORIO ACADÉMICO LOGIC
 * Dynamic filtering, document rendering, uploading.
 * ==========================================
 */

// Banco de datos simulado
let documentos = [
  {
    id: 1,
    title: 'Examen Parcial - Cálculo Multivariable',
    course: 'Cálculo II',
    career: 'Ingeniería Civil',
    cycle: '3',
    author: 'Esteban Ruiz',
    type: 'examen', // examen, apunte, practica
    downloads: 142
  },
  {
    id: 2,
    title: 'Apuntes de Mecánica de Suelos Completo',
    course: 'Mecánica de Suelos',
    career: 'Ingeniería Civil',
    cycle: '5',
    author: 'Lucía Alva',
    type: 'apunte',
    downloads: 98
  },
  {
    id: 3,
    title: 'Práctica Dirigida 3 - Estructuras de Datos',
    course: 'Algoritmos y Estructuras',
    career: 'Ingeniería de Sistemas',
    cycle: '4',
    author: 'Julio Peralta',
    type: 'practica',
    downloads: 215
  },
  {
    id: 4,
    title: 'Examen Final de Física General III',
    course: 'Física III',
    career: 'Ingeniería de Sistemas',
    cycle: '3',
    author: 'Marcos Soto',
    type: 'examen',
    downloads: 184
  },
  {
    id: 5,
    title: 'Apuntes de Programación Orientada a Objetos',
    course: 'POO',
    career: 'Ingeniería de Sistemas',
    cycle: '2',
    author: 'Daniela Vega',
    type: 'apunte',
    downloads: 312
  },
  {
    id: 6,
    title: 'Práctica de Laboratorio 1 - Química Orgánica',
    course: 'Química Orgánica',
    career: 'Ingeniería Industrial',
    cycle: '2',
    author: 'Renzo Díaz',
    type: 'practica',
    downloads: 64
  },
  {
    id: 7,
    title: 'Examen de Admisión - Prácticas de Simulación',
    course: 'Introducción a la Universidad',
    career: 'Todas',
    cycle: '1',
    author: 'Re-U Admin',
    type: 'examen',
    downloads: 504
  },
  {
    id: 8,
    title: 'Resumen del Libro de Termodinámica de Cengel',
    course: 'Termodinámica I',
    career: 'Ingeniería Industrial',
    cycle: '4',
    author: 'Sofía Cáceres',
    type: 'apunte',
    downloads: 121
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('documents-grid')) {
    renderDocuments(documentos);
    initRepositoryFilters();
    initUploadModal();
  }
});

/**
 * Render Documents in the DOM
 */
function renderDocuments(docsList) {
  const grid = document.getElementById('documents-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (docsList.length === 0) {
    grid.innerHTML = `
      <div class="empty-state-wrapper glass-card">
        <i class="fa-solid fa-folder-open"></i>
        <h3>No se encontraron documentos</h3>
        <p>Prueba ajustando los filtros o realizando otra búsqueda.</p>
      </div>
    `;
    return;
  }

  docsList.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'document-card glass-card reveal-on-scroll active';
    card.id = `doc-card-${doc.id}`;

    // Get initials of author for avatar
    const authorInitials = doc.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    
    // Choose icon and class based on document type
    let typeIcon = 'fa-file-lines';
    let typeClass = 'doc-type-apunte';
    let typeName = 'Apuntes';
    if (doc.type === 'examen') {
      typeIcon = 'fa-file-signature';
      typeClass = 'doc-type-examen';
      typeName = 'Examen';
    } else if (doc.type === 'practica') {
      typeIcon = 'fa-file-code';
      typeClass = 'doc-type-practica';
      typeName = 'Práctica';
    }

    card.innerHTML = `
      <div class="doc-type-indicator ${typeClass}" title="${typeName}">
        <i class="fa-solid ${typeIcon}"></i>
      </div>
      <span class="doc-subject">${doc.course}</span>
      <h3 class="doc-title" title="${doc.title}">${doc.title}</h3>
      <div class="doc-meta">
        <div class="meta-item">
          <span class="meta-label">Carrera</span>
          <span class="meta-value" title="${doc.career}">${doc.career}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Ciclo</span>
          <span class="meta-value">Ciclo ${doc.cycle}</span>
        </div>
      </div>
      <div class="doc-footer">
        <div class="doc-author">
          <div class="author-avatar">${authorInitials}</div>
          <span class="author-name">${doc.author}</span>
        </div>
        <button class="btn-download-doc" onclick="downloadDocument(${doc.id})" title="Descargar archivo">
          <i class="fa-solid fa-download"></i>
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

/**
 * Filter System
 */
function initRepositoryFilters() {
  const searchInput = document.getElementById('search-doc');
  const filterCareer = document.getElementById('filter-carrera');
  const filterCycle = document.getElementById('filter-ciclo');
  const filterType = document.getElementById('filter-tipo');
  const btnReset = document.getElementById('btn-reset-filters');

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const career = filterCareer ? filterCareer.value : 'Todos';
    const cycle = filterCycle ? filterCycle.value : 'Todos';
    const type = filterType ? filterType.value : 'Todos';

    const filtered = documentos.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(query) || doc.course.toLowerCase().includes(query);
      const matchesCareer = career === 'Todos' || doc.career === career || doc.career === 'Todas';
      const matchesCycle = cycle === 'Todos' || doc.cycle === cycle;
      const matchesType = type === 'Todos' || doc.type === type;

      return matchesSearch && matchesCareer && matchesCycle && matchesType;
    });

    renderDocuments(filtered);
  }

  // Bind events
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (filterCareer) filterCareer.addEventListener('change', applyFilters);
  if (filterCycle) filterCycle.addEventListener('change', applyFilters);
  if (filterType) filterType.addEventListener('change', applyFilters);

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (filterCareer) filterCareer.value = 'Todos';
      if (filterCycle) filterCycle.value = 'Todos';
      if (filterType) filterType.value = 'Todos';
      renderDocuments(documentos);
      window.showToast('Filtros reiniciados', 'Se están mostrando todos los documentos.', 'info');
    });
  }
}

/**
 * Custom Download Trigger
 */
function downloadDocument(docId) {
  const doc = documentos.find(d => d.id === docId);
  if (!doc) return;

  // Simulate download starting
  window.showToast(
    'Descarga iniciada',
    `Preparando descarga de "${doc.title}"...`,
    'info'
  );

  setTimeout(() => {
    // Increment download counter
    doc.downloads += 1;
    window.showToast(
      'Archivo descargado',
      `"${doc.title}" se guardó con éxito en tu dispositivo.`,
      'success'
    );
  }, 1500);
}

/**
 * Upload Document Form and Modal Interactions
 */
function initUploadModal() {
  const uploadBtn = document.getElementById('btn-upload-trigger');
  const modalOverlay = document.getElementById('upload-modal');
  const closeBtn = modalOverlay?.querySelector('.modal-close-btn');
  const cancelBtn = modalOverlay?.querySelector('.btn-secondary');
  const uploadForm = document.getElementById('upload-form');
  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('file-input');

  if (!modalOverlay) return;

  // Open modal
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      modalOverlay.classList.add('active');
    });
  }

  // Close modal helper
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    if (uploadForm) uploadForm.reset();
    if (dropArea) {
      dropArea.innerHTML = `
        <i class="fa-solid fa-cloud-arrow-up"></i>
        <p>Arrastra y suelta tu archivo aquí o <span>selecciónalo</span></p>
      `;
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Drag and drop mechanics
  if (dropArea && fileInput) {
    dropArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      if (fileInput.files.length > 0) {
        showSelectedFile(fileInput.files[0].name);
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
      }, false);
    });

    dropArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        fileInput.files = files;
        showSelectedFile(files[0].name);
      }
    }, false);
  }

  function showSelectedFile(fileName) {
    dropArea.innerHTML = `
      <i class="fa-solid fa-file-circle-check" style="color: var(--verde);"></i>
      <p style="font-weight:600; color:var(--negro);">${fileName}</p>
      <span style="font-size:0.8rem; color:var(--gris-medio);">¡Listo para subir! Clic para cambiar</span>
    `;
  }

  // Handle upload submit
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('up-title').value.trim();
      const course = document.getElementById('up-course').value.trim();
      const career = document.getElementById('up-career').value;
      const cycle = document.getElementById('up-cycle').value;
      const type = document.getElementById('up-type').value;

      if (!title || !course) {
        window.showToast('Error', 'Por favor completa todos los campos requeridos.', 'error');
        return;
      }

      // Add to array
      const newDoc = {
        id: documentos.length + 1,
        title: title,
        course: course,
        career: career,
        cycle: cycle,
        author: 'Tú (Estudiante)',
        type: type,
        downloads: 0
      };

      documentos.unshift(newDoc); // Add to beginning
      closeModal();
      
      // Re-render
      renderDocuments(documentos);
      
      // Success toast
      window.showToast(
        'Aporte exitoso',
        `"${title}" ha sido publicado en el repositorio. ¡Gracias por cooperar!`,
        'success'
      );
    });
  }
}

// Bind download to window scope
window.downloadDocument = downloadDocument;
