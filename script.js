(() => {
  const motionToggle = document.querySelector('#motion-toggle');
  document.documentElement.dataset.motion = 'running';
  motionToggle.addEventListener('click', () => {
    const running = document.documentElement.dataset.motion !== 'paused';
    document.documentElement.dataset.motion = running ? 'paused' : 'running';
    motionToggle.setAttribute('aria-pressed', String(!running));
    motionToggle.textContent = running ? 'Activar animaciones' : 'Pausar animaciones';
  });
  const views = [...document.querySelectorAll('.view')];
  const video = document.querySelector('video');
  const titles = { inicio: 'Conectamos contigo', comunidad: 'Comunidad Preparada', 'mini-teleton': 'Mini Teletón' };
  function route(focus = true) {
    const id = location.hash.slice(1);
    const active = views.find(view => view.id === id) || views[0];
    views.forEach(view => { view.hidden = view !== active; });
    if (active.id !== 'comunidad') video.pause();
    const miniTeleton = active.id === 'mini-teleton';
    const headerLogo = document.querySelector('.brand-official');
    headerLogo.src = miniTeleton ? 'assets/logo-mini-teleton.png' : 'assets/logo-blanco.png';
    headerLogo.alt = miniTeleton ? 'Mini Teletón · 2000Siempre' : '2000Siempre · Constructora y otros';
    headerLogo.classList.toggle('brand-mini', miniTeleton);
    document.title = `2000Siempre · ${titles[active.id]}`;
    if (focus) { window.scrollTo(0, 0); active.querySelector('h1').focus({ preventScroll: true }); }
  }
  window.addEventListener('hashchange', () => route());
  route(false);
  document.querySelector('#year').textContent = new Date().getFullYear();

  const photos = Array.isArray(window.MINI_TELETON_PHOTOS) ? window.MINI_TELETON_PHOTOS : [];
  const items = photos.length ? photos : Array.from({ length: 8 }, (_, index) => ({ placeholder: true, alt: `Fotografía ${index + 1}` }));
  document.querySelector('#pending-notice').hidden = photos.length > 0;
  const track = document.querySelector('#gallery-track');
  const dots = document.querySelector('#gallery-dots');
  const modal = document.querySelector('#lightbox');
  const pageCount = items.length;
  let currentPage = 0;
  for (let page = 0; page < pageCount; page++) {
    const grid = document.createElement('div');
    grid.className = 'gallery-page';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', `Página ${page + 1} de ${pageCount}`);
    items.slice(page, page + 1).forEach((item, index) => {
      if (item.placeholder) {
        const placeholder = document.createElement('div');
        placeholder.className = `photo-placeholder variant-${(page + index) % 4}`;
        const symbol = document.createElement('span'); symbol.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg>'; symbol.setAttribute('aria-hidden', 'true');
        const label = document.createElement('span'); label.textContent = `${item.alt} · Próximamente`;
        placeholder.append(symbol, label); grid.append(placeholder);
      } else {
        const button = document.createElement('button'); button.className = 'photo'; button.setAttribute('aria-label', `Ampliar: ${item.alt || 'Fotografía de Mini Teletón'}`);
        const image = document.createElement('img'); image.src = item.src; image.alt = item.alt || 'Mini Teletón'; image.loading = 'lazy';
        const zoom = document.createElement('span'); zoom.className = 'zoom'; zoom.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5M10.5 7.5v6m-3-3h6"/></svg>'; zoom.setAttribute('aria-hidden', 'true');
        button.append(image, zoom);
        button.addEventListener('click', () => { const large = document.querySelector('#lightbox-image'); large.src = item.src; large.alt = image.alt; document.querySelector('#lightbox-caption').textContent = image.alt; modal.showModal(); document.body.classList.add('modal-open'); });
        grid.append(button);
      }
    });
    track.append(grid);
    const dot = document.createElement('button'); dot.setAttribute('aria-label', `Ir a la página ${page + 1}`); dot.addEventListener('click', () => goTo(page)); dots.append(dot);
  }
  function goTo(page) {
    currentPage = (page + pageCount) % pageCount;
    track.style.transform = `translateX(-${currentPage * 100}%)`;
    [...track.children].forEach((grid, index) => { grid.inert = index !== currentPage; grid.setAttribute('aria-hidden', String(index !== currentPage)); });
    [...dots.children].forEach((dot, index) => { dot.setAttribute('aria-current', index === currentPage ? 'true' : 'false'); });
    document.querySelector('#page-status').textContent = `${currentPage + 1} / ${pageCount}`;
  }
  document.querySelector('#previous').addEventListener('click', () => goTo(currentPage - 1));
  document.querySelector('#next').addEventListener('click', () => goTo(currentPage + 1));
  if (pageCount === 1) document.querySelector('.gallery-controls').hidden = true;
  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(currentPage + (event.key === 'ArrowRight' ? 1 : -1)); } });
  let touchStart;
  carousel.addEventListener('touchstart', event => { touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }; }, { passive: true });
  carousel.addEventListener('touchend', event => { if (!touchStart) return; const dx = event.changedTouches[0].clientX - touchStart.x; const dy = event.changedTouches[0].clientY - touchStart.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) goTo(currentPage + (dx < 0 ? 1 : -1)); touchStart = null; }, { passive: true });
  document.querySelector('#close-lightbox').addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => { if (event.target === modal) { const rect = modal.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close(); } });
  modal.addEventListener('close', () => document.body.classList.remove('modal-open'));
  goTo(0);
})();
