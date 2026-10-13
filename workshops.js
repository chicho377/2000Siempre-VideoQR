(() => {
  const workshops = window.WORKSHOPS || [];
  const list = document.querySelector('#workshop-list');
  const dialog = document.querySelector('#workshop-dialog');
  const track = document.querySelector('#workshop-track');
  const viewport = document.querySelector('.workshop-viewport');
  const photoIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg>';
  let current = 0;
  let count = 0;
  let touchStart = null;
  document.querySelector('.workshops-badge').textContent = `${workshops.length} encuentros`;
  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function goTo(index) {
    if (!count) return;
    current = (index + count) % count;
    track.style.transform = `translateX(-${current * 100}%)`;
    [...track.children].forEach((slide, i) => { slide.inert = i !== current; slide.setAttribute('aria-hidden', String(i !== current)); });
    document.querySelector('#workshop-status').textContent = `${current + 1} / ${count}`;
  }
  function openWorkshop(workshop) {
    document.querySelector('#workshop-dialog-title').textContent = workshop.title;
    document.querySelector('#workshop-dialog-location').textContent = workshop.location;
    const photos = workshop.photos.length ? workshop.photos : Array.from({ length: 3 }, () => ({ placeholder: true }));
    count = photos.length;
    track.replaceChildren();
    track.style.transition = 'none';
    photos.forEach((photo, i) => {
      const slide = element('div', 'workshop-slide');
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', `Imagen ${i + 1} de ${count}`);
      if (photo.placeholder) {
        const placeholder = element('div', `workshop-placeholder placeholder-${i % 3}`);
        const icon = element('span', 'workshop-placeholder-icon'); icon.innerHTML = photoIcon;
        placeholder.append(icon, element('strong', '', 'Próximamente, las fotografías'), element('span', '', `Espacio ${i + 1} · ${workshop.title}`));
        slide.append(placeholder);
      } else {
        const image = element('img', 'workshop-photo'); image.src = photo.src; image.alt = photo.alt || `${workshop.title}, fotografía ${i + 1}`; image.loading = i === 0 ? 'eager' : 'lazy';
        slide.append(image);
      }
      track.append(slide);
    });
    document.querySelector('#workshop-prev').disabled = count <= 1;
    document.querySelector('#workshop-next').disabled = count <= 1;
    goTo(0);
    document.querySelector('video').pause();
    dialog.showModal(); document.body.classList.add('modal-open');
    // Establecer la primera diapositiva sin animar desde la galería anterior.
    void track.offsetWidth; track.style.transition = '';
  }
  workshops.forEach((workshop, i) => {
    const button = element('button', 'workshop-card'); button.type = 'button'; button.setAttribute('aria-haspopup', 'dialog');
    const number = element('span', 'workshop-number', String(i + 1).padStart(2, '0')); number.setAttribute('aria-hidden', 'true');
    const copy = element('span', 'workshop-copy'); copy.append(element('span', 'workshop-type', workshop.type), element('strong', '', workshop.title), element('span', 'workshop-location', workshop.location));
    const action = element('span', 'workshop-action'); const icon = element('span', ''); icon.innerHTML = photoIcon; action.append(icon, element('span', '', 'Ver galería'));
    button.append(number, copy, action); button.addEventListener('click', () => openWorkshop(workshop)); list.append(button);
  });
  document.querySelector('#workshop-prev').addEventListener('click', () => goTo(current - 1));
  document.querySelector('#workshop-next').addEventListener('click', () => goTo(current + 1));
  document.querySelector('#workshop-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goTo(current + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  viewport.addEventListener('touchstart', event => { touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }; }, { passive: true });
  viewport.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x; const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) goTo(current + (dx < 0 ? 1 : -1)); touchStart = null;
  }, { passive: true });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  window.addEventListener('hashchange', () => { if (dialog.open) dialog.close(); });
})();
