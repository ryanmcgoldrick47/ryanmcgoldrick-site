(function(){
if (window.__rmRadio) return; window.__rmRadio = 1;
function shortPage(){ var f = [].slice.call(document.querySelectorAll('footer')).filter(function(x){ return x.querySelector('nav'); })[0]; if (!f) return;
  f.style.display = ''; var tall = document.documentElement.scrollHeight - f.offsetHeight > innerHeight * 1.25; f.style.display = tall ? '' : 'none'; }
addEventListener('load', function(){ shortPage(); setTimeout(shortPage, 1500); }); addEventListener('resize', shortPage);
var st = document.createElement('style'); st.textContent = '@keyframes rmMarq{from{transform:translateX(0)}to{transform:translateX(-50%)}}'; document.head.appendChild(st);
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, SPEED = 0.22;
var btn = null, ph = null, free = false, raf = 0, x, y, vx, vy, w, h, last = 0;
function open(){ var win = window.open('radio', 'rmradio', 'width=400,height=420'); if (win) win.focus(); }
function tick(now){ var dt = last ? Math.min(50, now - last) / 16.67 : 1; last = now; var W = innerWidth, H = innerHeight; x += vx * dt; y += vy * dt;
  if (x < 0 || x > W - w) { vx = -vx; x = Math.max(0, Math.min(W - w, x)); }
  if (y < 0 || y > H - h) { vy = -vy; y = Math.max(0, Math.min(H - h, y)); }
  btn.style.transform = 'translate(' + x + 'px,' + y + 'px)'; raf = requestAnimationFrame(tick); }
function launch(el){
  btn = el; var r = el.getBoundingClientRect(); w = r.width; h = r.height; x = r.left; y = r.top;
  ph = document.createElement('span'); ph.style.cssText = 'display:inline-block;width:' + w + 'px;height:' + h + 'px;flex:none';
  el.parentNode.insertBefore(ph, el);
  el.style.position = 'fixed'; el.style.left = '0'; el.style.top = '0'; el.style.zIndex = '70'; el.style.margin = '0';
  el.style.boxShadow = '0 10px 24px rgba(0,0,0,.18)'; el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  var a = Math.random() * Math.PI * 2; vx = Math.cos(a) * SPEED; vy = Math.abs(Math.sin(a)) * SPEED + 0.08;
  free = true; last = 0; if (!reduce) raf = requestAnimationFrame(tick);
}
function dock(){
  cancelAnimationFrame(raf); free = false; var el = btn, r = ph.getBoundingClientRect();
  el.style.transition = 'transform 700ms cubic-bezier(.2,.7,.2,1)'; el.style.transform = 'translate(' + r.left + 'px,' + r.top + 'px)';
  setTimeout(function(){ el.style.transition = ''; el.style.position = ''; el.style.left = ''; el.style.top = ''; el.style.zIndex = ''; el.style.transform = ''; el.style.boxShadow = ''; if (ph && ph.parentNode) ph.parentNode.removeChild(ph); ph = null; }, 720);
}
document.addEventListener('click', function(e){
  var el = e.target.closest && e.target.closest('[data-radio-btn]'); if (!el) return;
  e.preventDefault(); e.stopPropagation();
  if (free && el === btn) { dock(); return; }
  open(); launch(el);
}, true);
})();