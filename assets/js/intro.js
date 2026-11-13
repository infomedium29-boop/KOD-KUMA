// Uvodna animacija: omogući preskakanje i obvezno makni overlay nakon prikaza.
(function () {
  const root = document.documentElement;
  if (!root.classList.contains('kk-intro-active')) return;
  const overlay = document.querySelector('.kk-intro-overlay');
  if (!overlay) { root.classList.remove('kk-intro-active'); return; }
  let timer;
  const finish = () => {
    window.clearTimeout(timer);
    root.classList.remove('kk-intro-active');
    overlay.remove();
  };
  overlay.querySelector('.kk-intro-skip')?.addEventListener('click', finish);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.classList.contains('kk-intro-active')) finish();
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) finish();
  });
  timer = window.setTimeout(finish, 3160);
}());
