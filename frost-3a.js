(function(){
  if (window.__rmFrost) return; window.__rmFrost = 1;
  var small = innerWidth < 700, rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NOISE = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'1.6\' numOctaves=\'2\' stitchTiles=\'stitch\'/><feColorMatrix values=\'0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 4 -1.6\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>")';
  var E = small ? 90 : 140, BAND = small ? 0.16 : 0.2;
  var blur = small ? 'blur(7px) saturate(1.15)' : 'blur(11px) saturate(1.2)';
  var p = document.createElement('div'); p.setAttribute('aria-hidden', 'true');
  p.style.cssText = 'position:fixed;left:0;right:0;top:0;height:calc(100vh + ' + E + 'px);z-index:25;pointer-events:none;background:rgba(255,255,255,.42);backdrop-filter:' + blur + ';-webkit-backdrop-filter:' + blur + ';-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ' + E + 'px);mask-image:linear-gradient(180deg,transparent 0,#000 ' + E + 'px);transform:translate3d(0,-' + E + 'px,0);will-change:transform;transition:opacity 500ms ease';
  var d = document.createElement('div');
  d.style.cssText = 'position:absolute;left:0;right:0;top:' + Math.round(E * 0.15) + 'px;height:' + Math.round(E * 0.8) + 'px;background-image:' + NOISE + ';background-size:120px 120px;opacity:.85;-webkit-mask-image:linear-gradient(180deg,transparent,#000 55%,transparent);mask-image:linear-gradient(180deg,transparent,#000 55%,transparent)';
  p.appendChild(d);
  var slid = false;
  function end() { return 'translate3d(0,' + Math.round(innerHeight * (1 - BAND)) + 'px,0)'; }
  var acc = 0, vel = 0, lastY = scrollY, lastT = performance.now(), cur = null, live = false;
  function frame(now) {
    if (gone) return;
    var dt = Math.max(1, now - lastT); lastT = now;
    var dy = scrollY - lastY; lastY = scrollY;
    acc = acc * Math.exp(-dt / 420) + Math.abs(dy);
    var raw = acc / 420; vel += (raw - vel) * (raw > vel ? 0.05 : 0.025);
    var max = Math.max(1, document.documentElement.scrollHeight - innerHeight), prog = Math.min(1, scrollY / max);
    var band = BAND * (1 - prog * 0.45) + Math.min(0.18, vel * 0.07);
    var target = innerHeight * (1 - band);
    cur = cur == null ? target : cur + (target - cur) * 0.06;
    p.style.transform = 'translate3d(0,' + cur.toFixed(1) + 'px,0)';
    d.style.backgroundPosition = (scrollY * 0.12).toFixed(1) + 'px ' + (-scrollY * 0.35).toFixed(1) + 'px';
    d.style.opacity = String(Math.min(1, 0.7 + vel * 0.5));
    if (vel > 0.002 || acc > 0.5 || Math.abs(target - cur) > 0.5) requestAnimationFrame(frame); else live = false;
  }
  function kick() { if (!slid || gone || !done) return; if (!live) { live = true; lastT = performance.now(); requestAnimationFrame(frame); } }
  var done = false;
  var gone = false;
  function upd() {
    if (!slid || gone) return;
    var left = document.documentElement.scrollHeight - (scrollY + innerHeight);
    if (left < 160 && document.documentElement.scrollHeight > innerHeight + 200) {
      gone = true;
      p.style.transition = 'opacity 1600ms ease, filter 1600ms ease';
      d.style.transition = 'opacity 900ms ease'; d.style.opacity = '0';
      p.style.opacity = '0';
      setTimeout(function () { p.remove(); }, 1700);
    }
  }
  function slide() {
    if (slid) return; slid = true;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      p.style.transition = 'transform ' + (rm ? 300 : 1800) + 'ms cubic-bezier(.65,0,.25,1), opacity 500ms ease';
      p.style.transform = end();
      setTimeout(function () { done = true; p.style.transition = 'opacity 500ms ease'; cur = innerHeight * (1 - BAND); upd(); }, 1900);
    }); });
  }
  function mount() {
    document.body.appendChild(p);
    var t0 = performance.now();
    (function poll() {
      var el = performance.now() - t0, ims = document.querySelectorAll('img'), ok = true, any = false;
      for (var i = 0; i < ims.length; i++) { var r = ims[i].getBoundingClientRect(); if (r.width < 20 || r.bottom < 0 || r.top > innerHeight) continue; any = true; if (!(ims[i].complete && ims[i].naturalHeight)) { ok = false; break; } }
      if ((el > 500 && any && ok) || el > 2400) return slide();
      setTimeout(poll, 90);
    })();
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  addEventListener('scroll', function () { upd(); kick(); }, { passive: true });
  addEventListener('resize', function () { if (slid && !done) { p.style.transition = 'opacity 500ms ease'; p.style.transform = end(); } upd(); });
})();
