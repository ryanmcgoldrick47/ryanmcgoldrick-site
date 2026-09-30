(function () {
  if (window.__rmPlace) return; window.__rmPlace = 1;
  var PL = ['wollongong, australia', 'dharawal country', 'south coast, nsw'], G = '▖▗▘▙▚▛▜▝▞▟#%/<>=+';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function scramble(el, from, to) {
    var t0 = performance.now(), n = Math.max(from.length, to.length);
    (function f(now) { var e = now - t0, d = Math.floor(e / 28), s = '';
      for (var k = 0; k < n; k++) s += k < d - 6 ? (to[k] || '') : k < d ? G[(k * 7 + Math.floor(e / 40)) % G.length] : (from[k] || '');
      el.textContent = s.replace(/\s+$/, ''); if (d - 6 < n) requestAnimationFrame(f); else el.textContent = to; })(t0);
  }
  function type(el, from, to) {
    var i = from.length, phase = 0;
    var iv = setInterval(function () {
      if (phase === 0) { i--; el.textContent = from.slice(0, i); if (i <= 0) { phase = 1; i = 0; } }
      else { i++; el.textContent = to.slice(0, i); if (i >= to.length) clearInterval(iv); }
    }, phase === 0 ? 45 : 60);
  }
  function start() {
    var els = [].slice.call(document.querySelectorAll('[data-place]'));
    els.forEach(function (el, j) {
      if (el.dataset.placeOn) return; el.dataset.placeOn = 1;
      var idx = 0, mode = el.getAttribute('data-place'), L = el.hasAttribute('data-place-short') ? ['wollongong', 'dharawal country', 'south coast'] : PL;
      setTimeout(function tick() {
        var from = el.textContent, to = L[(idx = (idx + 1) % L.length)];
        type(el, from, to);
        setTimeout(tick, 5200);
      }, 3200 + j * 900);
    });
  }
  new MutationObserver(start).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState !== 'loading') start(); else document.addEventListener('DOMContentLoaded', start);
})();
