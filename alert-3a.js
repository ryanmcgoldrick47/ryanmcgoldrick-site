(function () {
  if (window.__rmAlert) return; window.__rmAlert = 1;
  document.addEventListener('submit', function (e) {
    var f = e.target; if (!f.hasAttribute || !f.hasAttribute('data-alert')) return;
    e.preventDefault();
    var b = f.querySelector('button'), msg = f.querySelector('[data-alert-msg]');
    if (b) { b.disabled = true; b.textContent = 'sending…'; }
    fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } }).then(function (r) {
      if (!r.ok) throw 0;
      f.querySelectorAll('input,button').forEach(function (el) { el.style.display = 'none'; });
      if (msg) msg.textContent = "you're on the list. we'll email you when it's on the bench and ready.";
    }).catch(function () {
      if (b) { b.disabled = false; b.textContent = 'notify me'; }
      if (msg) msg.textContent = 'that didn’t go through. email studio@ryanmcgoldrick.com instead.';
    });
  });
})();
