// Dicono di noi: the article reader. Pages fan out like magazines on a table;
// the front page is full size, the others peek out behind it.
(function () {
  var dlg = document.getElementById('reader');
  if (!dlg) return;
  var table = dlg.querySelector('[data-r-pages]');
  var count = dlg.querySelector('[data-r-count]');
  var prev = dlg.querySelector('[data-r-prev]');
  var next = dlg.querySelector('[data-r-next]');
  var pages = [], current = 0, opener = null;

  function layout() {
    pages.forEach(function (img, i) {
      var d = i - current;
      var t;
      if (d === 0) t = 'translate(-50%, -50%) rotate(0deg) scale(1)';
      else t = 'translate(calc(-50% + ' + (d * 9) + '%), calc(-50% + ' + (Math.abs(d) * 1.5) + '%)) rotate(' + (d * 5) + 'deg) scale(' + (1 - Math.min(Math.abs(d), 3) * 0.07) + ')';
      img.style.transform = t;
      img.style.zIndex = 100 - Math.abs(d);
      img.style.opacity = Math.abs(d) > 3 ? 0 : (d === 0 ? 1 : 0.85);
      img.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
    });
    count.textContent = (current + 1) + ' / ' + pages.length;
    prev.disabled = current === 0;
    next.disabled = current === pages.length - 1;
  }

  function go(i) { current = Math.max(0, Math.min(pages.length - 1, i)); layout(); }

  document.querySelectorAll('.press__more').forEach(function (btn) {
    btn.addEventListener('click', function () {
      opener = btn;
      var eb = btn.closest('.press__text').querySelector('.eyebrow');
      dlg.querySelector('[data-r-title]').textContent = eb ? eb.textContent : btn.dataset.title;
      dlg.querySelector('[data-r-it]').textContent = btn.dataset.introIt;
      dlg.querySelector('[data-r-en]').textContent = btn.dataset.introEn;
      table.innerHTML = '';
      pages = btn.dataset.pages.split(',').map(function (src, i, all) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = (eb ? eb.textContent : btn.dataset.title) + (document.documentElement.lang === 'en' ? ', page ' : ', pagina ') + (i + 1) + (document.documentElement.lang === 'en' ? ' of ' : ' di ') + all.length;
        img.addEventListener('click', function () { go(i); });
        table.appendChild(img);
        return img;
      });
      current = 0;
      layout();
      dlg.showModal();
      document.documentElement.style.overflow = 'hidden';
    });
  });

  function close() { dlg.close(); }
  dlg.querySelector('.reader__close').addEventListener('click', close);
  dlg.addEventListener('close', function () {
    document.documentElement.style.overflow = '';
    if (opener) opener.focus();
  });
  prev.addEventListener('click', function () { go(current - 1); });
  next.addEventListener('click', function () { go(current + 1); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') go(current - 1);
    if (e.key === 'ArrowRight') go(current + 1);
  });

  // Swipe on phones
  var x0 = null;
  table.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  table.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
