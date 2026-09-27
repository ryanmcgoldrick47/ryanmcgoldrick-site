(function(){
var s=document.createElement('style');
s.textContent="html[data-wire] body{background:#111 !important;background-image:linear-gradient(#262626 1px,transparent 1px),linear-gradient(90deg,#262626 1px,transparent 1px) !important;background-size:24px 24px !important}html[data-wire] body *{background:transparent !important;color:transparent !important;border-color:transparent !important;box-shadow:none !important;outline:1px solid oklch(88% 0.18 105) !important;outline-offset:-1px !important}html[data-wire] img,html[data-wire] canvas,html[data-wire] svg{opacity:0 !important}";
document.head.appendChild(s);
var buf='',t;
window.addEventListener('keydown',function(e){
  var tg=e.target&&e.target.tagName;if(tg==='INPUT'||tg==='TEXTAREA'||!e.key||e.key.length!==1)return;
  buf=(buf+e.key.toLowerCase()).slice(-4);
  if(buf==='make'){document.documentElement.setAttribute('data-wire','');clearTimeout(t);t=setTimeout(function(){document.documentElement.removeAttribute('data-wire')},1800);}
});
})();

(function(){
var css="@media (max-width:640px){header{padding:12px 16px !important;flex-wrap:nowrap !important}header>a:first-child{white-space:nowrap}header nav{display:none !important}html[data-menu] header nav{display:flex !important;position:absolute;left:0;right:0;top:100%;flex-direction:column;align-items:stretch;background:#fff;padding:4px 16px 12px;gap:0 !important;border-bottom:1px solid oklch(85% 0 0)}header nav a{padding:13px 4px !important;font-size:14px !important}.rm-menu{display:block !important}footer a{padding:10px 0}}.rm-menu{display:none;background:none;border:0;padding:12px 0 12px 12px;margin:-12px 0;font-family:'Martian Mono',monospace;font-size:14px;color:inherit;cursor:pointer}";
var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
function add(){var h=document.querySelector('header');if(!h){return setTimeout(add,100);}if(h.querySelector('.rm-menu'))return;var b=document.createElement('button');b.className='rm-menu';b.textContent='menu';b.onclick=function(){var r=document.documentElement;if(r.hasAttribute('data-menu')){r.removeAttribute('data-menu');b.textContent='menu';}else{r.setAttribute('data-menu','');b.textContent='close';}};h.appendChild(b);}
add();
new MutationObserver(function(){var h=document.querySelector('header');if(h&&!h.querySelector('.rm-menu'))add();}).observe(document.documentElement,{childList:true,subtree:true});
})();