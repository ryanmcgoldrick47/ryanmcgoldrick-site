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