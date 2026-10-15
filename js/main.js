// Enoteca Vanni, small site behaviors. No dependencies.
(function () {
  var doc = document.documentElement;
  var header = document.querySelector('.site-header');

  // Language (Italian / English). Italian lives in the HTML, English in js/i18n.js.
  var LANG_KEY = 'vanni-lang';
  var lang = 'it';
  try {
    var q = /[?&]lang=(it|en)/.exec(location.search);
    lang = q ? q[1] : (localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'it');
  } catch (e) {}
  var langListeners = [];
  function tx(it, en) { return lang === 'en' ? en : it; }
  var ATTRS = ['alt', 'aria-label', 'title', 'placeholder', 'content'];
  function applyLang() {
    var dict = window.I18N_EN || {};
    doc.lang = lang;
    doc.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-t]').forEach(function (el) {
      var en = dict[el.dataset.t];
      if (en === undefined) return;
      if (el.dataset.it === undefined) el.dataset.it = el.innerHTML;
      el.innerHTML = lang === 'en' ? en : el.dataset.it;
    });
    ATTRS.forEach(function (a) {
      document.querySelectorAll('[data-ta-' + a + ']').forEach(function (el) {
        var en = dict[el.getAttribute('data-ta-' + a)];
        if (en === undefined) return;
        if (!el.hasAttribute('data-ti-' + a)) el.setAttribute('data-ti-' + a, el.getAttribute(a));
        el.setAttribute(a, lang === 'en' ? en : el.getAttribute('data-ti-' + a));
      });
    });
    document.querySelectorAll('[data-lang-set]').forEach(function (b) {
      var on = b.dataset.langSet === lang;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    var yr = document.querySelector('[data-year]');
    if (yr) yr.textContent = new Date().getFullYear();
    langListeners.forEach(function (fn) { fn(); });
  }
  document.querySelectorAll('[data-lang-set]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      lang = b.dataset.langSet;
      try { localStorage.setItem(LANG_KEY, lang); } catch (err) {}
      applyLang();
    });
  });
  window.VanniLang = { get: function () { return lang; }, tx: tx, onChange: function (fn) { langListeners.push(fn); } };

  // Header turns solid after scrolling past the hero
  function onScroll() {
    if (!header || header.classList.contains('site-header--solid')) return;
    header.classList.toggle('is-solid', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = doc.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        doc.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Hero slideshow: slow, static crossfade
  var slides = document.querySelectorAll('.hero__slides img');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slides.length > 1 && !reduce) {
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove('is-active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-active');
    }, 6500);
  }

  // Collections list: swap the arched preview on hover or focus
  var preview = document.querySelector('[data-preview]');
  if (preview) {
    document.querySelectorAll('[data-img]').forEach(function (a) {
      var show = function () {
        if (preview.getAttribute('src') === a.dataset.img) return;
        preview.style.opacity = 0;
        setTimeout(function () {
          preview.src = a.dataset.img;
          preview.alt = a.dataset.alt || '';
          preview.style.opacity = 1;
        }, 180);
      };
      a.addEventListener('mouseenter', show);
      a.addEventListener('focus', show);
    });
  }

  // Wine catalogue: category tabs and pages, so the list always fits one screen
  var grid = document.querySelector('[data-wine-grid]');
  if (grid && window.VANNI_CATEGORIES) {
    var cats = window.VANNI_CATEGORIES;
    var tabs = document.querySelectorAll('[data-cat]');
    var panel = document.getElementById('wine-panel');
    var section = document.getElementById('catalogo');
    var pager = panel.querySelector('[data-pager]');
    var pagePrev = pager.querySelector('[data-page-prev]');
    var pageNext = pager.querySelector('[data-page-next]');
    var pageCount = pager.querySelector('[data-page-count]');
    var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var euro = function (n) { return '\u20ac ' + String(n).replace('.', tx(',', '.')); };
    var pageSize = function () { var w = window.innerWidth; return w > 1000 ? 4 : (w > 600 ? 6 : 3); };
    var currentCat = cats[0].id, currentPage = 0;
    var render = function () {
      var cat = cats.filter(function (c) { return c.id === currentCat; })[0] || cats[0];
      var size = pageSize();
      var pages = Math.max(1, Math.ceil(cat.wines.length / size));
      currentPage = Math.max(0, Math.min(pages - 1, currentPage));
      var catName = tx(cat.name, cat.nameEn || cat.name);
      panel.querySelector('[data-panel-intro]').textContent = tx(cat.intro, cat.introEn || cat.intro);
      grid.innerHTML = cat.wines.slice(currentPage * size, (currentPage + 1) * size).map(function (w) {
        var img = w.img || cat.placeholder;
        var wName = tx(w.name, w.nameEn || w.name);
        var wArea = tx(w.area, w.areaEn || w.area);
        var price = w.price == null ? '<p class="wine-card__price wine-card__price--ask">' + tx('Su richiesta', 'On request') + '</p>' : '<p class="wine-card__price">' + euro(w.price) + '</p>';
        return '<article class="wine-card"><div class="wine-card__img"><img src="' + esc(img) + '" alt="' + esc(wName) + '" loading="lazy"></div>' +
          '<div class="wine-card__body"><p class="wine-card__area">' + esc(catName) + ' \u00b7 ' + esc(wArea) + '</p><h3>' + esc(wName) + '</h3>' + price + '</div></article>';
      }).join('');
      pager.hidden = pages < 2;
      pageCount.textContent = (currentPage + 1) + ' / ' + pages;
      pagePrev.disabled = currentPage === 0;
      pageNext.disabled = currentPage === pages - 1;
    };
    var select = function (id, scroll) {
      var cat = cats.filter(function (c) { return c.id === id; })[0] || cats[0];
      currentCat = cat.id; currentPage = 0;
      tabs.forEach(function (t) {
        var on = t.dataset.cat === cat.id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', 'tab-' + cat.id);
      render();
      if (scroll && section) section.scrollIntoView({ behavior: (reduce || scroll === 'instant') ? 'instant' : 'smooth', block: 'start' });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        select(t.dataset.cat, false);
        if (history.replaceState) history.replaceState(null, '', '#' + t.dataset.cat);
      });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); n.click();
      });
    });
    pagePrev.addEventListener('click', function () { currentPage--; render(); });
    pageNext.addEventListener('click', function () { currentPage++; render(); });
    var fromHash = function (scroll) {
      var id = location.hash.replace('#', '');
      var known = cats.some(function (c) { return c.id === id; });
      select(known ? id : cats[0].id, known ? scroll : false);
    };
    window.addEventListener('hashchange', function () { fromHash(true); });
    window.addEventListener('resize', render);
    fromHash('instant');
    langListeners.push(render);
  }

  // Newsletter (not connected to an email service yet)
  var nl = document.querySelector('[data-newsletter]');
  if (nl) {
    nl.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = nl.querySelector('[data-newsletter-msg]');
      if (!nl.email.value || !nl.email.checkValidity()) { msg.textContent = tx('Inserisci un indirizzo email valido.', 'Please enter a valid email address.'); return; }
      if (!nl.privacy.checked) { msg.textContent = tx('Per iscriverti accetta le regole della privacy.', 'Please accept the privacy policy to subscribe.'); return; }
      msg.textContent = tx('Iscrizione non ancora attiva: il servizio email va collegato.', 'Signup is not active yet: the email service still needs to be connected.');
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Footer year
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
  applyLang();
  // Re-align to the #anchor once fonts and images have settled (layout shifts otherwise leave it off-target).
  // Skipped as soon as the visitor scrolls on their own.
  var touched = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
    window.addEventListener(ev, function () { touched = true; }, { passive: true, once: true });
  });
  function alignHash() {
    if (touched) return;
    var id = decodeURIComponent(location.hash.replace('#', ''));
    if (!id) return;
    var el = document.getElementById(id) || (document.querySelector('[data-cat="' + id + '"]') && document.getElementById('catalogo'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  window.addEventListener('load', alignHash);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignHash);
  [400, 1200, 2500].forEach(function (ms) { setTimeout(alignHash, ms); });
})();
