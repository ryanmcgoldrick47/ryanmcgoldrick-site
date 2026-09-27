(function(){
if (window.__rmSnitch) return; window.__rmSnitch = 1;
try { if (sessionStorage.getItem('rmCalliperCaught')) return; } catch (e) {}
var MSG = window.RM_SNITCH_MSG || 'congrats seeker, you caught the golden calliper! 150 points to you. alas, earwax flavoured: you now owe ryan a coffee. reach out to the studio pronto!';
var st = document.createElement('style');
st.textContent = '@keyframes rmWingL{0%,100%{transform:rotate(-8deg) scaleY(1)}50%{transform:rotate(-38deg) scaleY(.55)}}@keyframes rmWingR{0%,100%{transform:rotate(8deg) scaleY(1)}50%{transform:rotate(38deg) scaleY(.55)}}@keyframes rmHover{0%,100%{margin-top:0}50%{margin-top:-3px}}';
document.head.appendChild(st);
var ball = document.createElement('div');
ball.setAttribute('aria-hidden', 'true');
ball.style.cssText = 'position:absolute;width:30px;height:22px;z-index:-1;pointer-events:none;transition:transform 380ms cubic-bezier(.3,1.4,.5,1),opacity 200ms;opacity:0';
ball.innerHTML = '<span style="position:absolute;left:-14px;top:0;width:18px;height:9px;border-radius:100% 0 100% 0;background:rgba(255,255,255,.92);box-shadow:0 0 0 1px rgba(0,0,0,.18);transform-origin:right center;animation:rmWingL 90ms linear infinite"></span><span style="position:absolute;right:-14px;top:0;width:18px;height:9px;border-radius:0 100% 0 100%;background:rgba(255,255,255,.92);box-shadow:0 0 0 1px rgba(0,0,0,.18);transform-origin:left center;animation:rmWingR 90ms linear infinite"></span><svg viewBox="0 0 30 22" width="30" height="22" style="position:absolute;inset:0;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35));animation:rmHover 600ms ease-in-out infinite"><defs><linearGradient id="rmGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".45" stop-color="#f2c230"/><stop offset="1" stop-color="#a87a0a"/></linearGradient></defs><rect x="1" y="3" width="28" height="4" rx="1" fill="url(#rmGold)"/><path d="M3 3h4v17l-2 1.5L3 20z" fill="url(#rmGold)"/><path d="M17 1h7v7h-3v12l-2 1.5L17 20z" fill="url(#rmGold)"/><g stroke="#8a6408" stroke-width=".6"><line x1="9" y1="3.4" x2="9" y2="5"/><line x1="11" y1="3.4" x2="11" y2="4.4"/><line x1="13" y1="3.4" x2="13" y2="5"/><line x1="15" y1="3.4" x2="15" y2="4.4"/><line x1="26" y1="3.4" x2="26" y2="5"/></g></svg></span>';
var card = null, out = false, timer = 0, caught = false, done = false, sides = ['top','right','left'];
function cards(){ return [].slice.call(document.querySelectorAll('[data-card]')); }
function hide(){ out = false; ball.style.opacity = '0'; ball.style.transform = 'translate(0,0)'; }
function peek(){
  var list = cards(); if (!list.length || caught) { timer = setTimeout(peek, 2000); return; }
  var next = list[Math.floor(Math.random() * list.length)]; if (next === card && list.length > 1) next = list[(list.indexOf(next) + 1) % list.length];
  card = next; if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
  card.appendChild(ball);
  var side = sides[Math.floor(Math.random() * sides.length)], w = card.offsetWidth, h = card.offsetHeight, a = 0.2 + Math.random() * 0.6, dx = 0, dy = 0;
  if (side === 'top') { ball.style.left = (w * a - 15) + 'px'; ball.style.top = '4px'; dy = -24; }
  if (side === 'right') { ball.style.left = (w - 34) + 'px'; ball.style.top = (h * a * 0.7) + 'px'; dx = 28; }
  if (side === 'left') { ball.style.left = '4px'; ball.style.top = (h * a * 0.7) + 'px'; dx = -28; }
  ball.style.transform = 'translate(0,0)'; ball.style.opacity = '1';
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ out = true; ball.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; }); });
  timer = setTimeout(function(){ hide(); timer = setTimeout(peek, 2500 + Math.random() * 5000); }, 1100 + Math.random() * 700);
}
function win(){
  caught = true; clearTimeout(timer); try { sessionStorage.setItem('rmCalliperCaught', '1'); } catch (e) {}
  var from = ball.getBoundingClientRect(), art = ball.innerHTML.split('rmGold').join('rmGoldF'); hide();
  var m = document.createElement('div');
  m.style.cssText = 'position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;background:rgba(20,20,20,.35);padding:20px';
  m.innerHTML = '<div role="dialog" aria-live="polite" style="max-width:420px;background:#fff;box-shadow:0 20px 50px rgba(0,0,0,.25);font-family:\'Martian Mono\',monospace;color:oklch(16% 0 0)"><div style="background:oklch(78% 0.08 300);padding:10px 14px;font-size:13px">+150 points</div><div data-slot="1" style="height:110px;display:flex;align-items:center;justify-content:center;background-color:#fff;background-image:linear-gradient(oklch(92% 0.02 250) 1px, transparent 1px),linear-gradient(90deg, oklch(92% 0.02 250) 1px, transparent 1px);background-size:12px 12px"></div><p style="margin:0;padding:18px 16px;font-size:15px;line-height:1.6;text-wrap:pretty">' + MSG + '</p><div style="display:flex;gap:4px;padding:0 16px 16px;flex-wrap:wrap"><a href="mailto:studio@ryanmcgoldrick.com?subject=I%20found%20it%2C%20coffee%20is%20on%20me" style="background:oklch(16% 0 0);color:#fff;padding:12px 14px;font-size:14px;text-decoration:none">email the studio</a><button type="button" style="background:oklch(84% 0 0);border:none;padding:12px 14px;font-family:inherit;font-size:14px;cursor:pointer">back to the bench</button></div></div>';
  m.querySelector('button').onclick = function(){ m.remove(); if (ball.parentNode) ball.parentNode.removeChild(ball); done = true; };
  var armed = false; setTimeout(function(){ armed = true; }, 600);
  m.addEventListener('click', function(e){ if (armed && e.target === m) m.querySelector('button').onclick(); });
  m.style.opacity = '0'; m.style.transition = 'opacity 250ms'; document.body.appendChild(m);
  var slot = m.querySelector('[data-slot]'), to = slot.getBoundingClientRect(), K = 3.2;
  var fly = document.createElement('div'); fly.innerHTML = art;
  fly.style.cssText = 'position:fixed;left:0;top:0;width:30px;height:22px;z-index:95;pointer-events:none;transform-origin:0 0;transform:translate(' + from.left + 'px,' + from.top + 'px) scale(1);transition:transform 750ms cubic-bezier(.3,1.25,.4,1)';
  document.body.appendChild(fly);
  requestAnimationFrame(function(){ m.style.opacity = '1'; requestAnimationFrame(function(){
    fly.style.transform = 'translate(' + (to.left + to.width / 2 - 15 * K) + 'px,' + (to.top + to.height / 2 - 11 * K) + 'px) scale(' + K + ') rotate(-6deg)';
  }); });
  setTimeout(function(){ fly.style.cssText = 'position:relative;width:30px;height:22px;transform:scale(' + K + ') rotate(-6deg)'; slot.appendChild(fly); }, 780);
}
function hit(e){ if (!out || !card) return false; var c = e.target.closest && e.target.closest('[data-card]'); return c === card; }
document.addEventListener('pointerdown', function(e){ if (hit(e)) { e.preventDefault(); e.stopPropagation(); win(); } }, true);
document.addEventListener('click', function(e){ if (caught && !done) { var c = e.target.closest && e.target.closest('[data-card]'); if (c) { e.preventDefault(); e.stopPropagation(); } } }, true);
timer = setTimeout(peek, 6000);
})();
