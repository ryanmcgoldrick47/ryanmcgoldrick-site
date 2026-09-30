(function () {
  const Y = 'oklch(42% 0.005 260)', YEL = 'oklch(88% 0.18 105)', G = 'oklch(84% 0 0)';
  const NS = 'http://www.w3.org/2000/svg';
  function Snake3A(root, opts) {
    opts = opts || {};
    const lite = matchMedia('(hover: none)').matches || (/Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Android/.test(navigator.userAgent));
    const speed = () => opts.speed || 420, L = () => opts.length || 280;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('style', 'position:absolute;left:0;top:0;pointer-events:none;z-index:20;overflow:visible');
    const path = document.createElementNS(NS, 'path');
    const PB = 'oklch(42% 0.005 260)', fid = 'rmPencil' + Math.random().toString(36).slice(2, 7);
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = '<filter id="' + fid + '" filterUnits="userSpaceOnUse" x="0" y="0" width="10" height="10"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" result="d"/><feComponentTransfer in="n" result="g"><feFuncA type="linear" slope="1.6" intercept="-0.25"/></feComponentTransfer><feComposite in="d" in2="g" operator="in"/></filter>';
    svg.appendChild(defs); const flt = defs.firstChild;
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', PB); path.setAttribute('stroke-width', '1.8'); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round'); path.setAttribute('opacity', '0.75'); path.setAttribute('filter', 'url(#' + fid + ')');
    const head = document.createElementNS(NS, 'rect');
    head.setAttribute('width', '3'); head.setAttribute('height', '3'); head.setAttribute('rx', '1.5'); head.setAttribute('fill', PB); head.setAttribute('transform', 'translate(3.5,3.5)');
    svg.appendChild(path); svg.appendChild(head); root.appendChild(svg);
    let pts = [], cum = [], total = 1, pos = 0, nodes = [], nodeAt = [], lastNode = -1, last = 0, raf, t;

    function layout() {
      const rb = root.getBoundingClientRect();
      svg.setAttribute('width', root.scrollWidth); svg.setAttribute('height', root.scrollHeight);
      nodes = [...root.querySelectorAll('[data-snake]')].filter(n => n.offsetParent !== null);
      const a = nodes.map(n => { const r = n.getBoundingClientRect(); return [Math.round(r.left - rb.left - 12), Math.round(r.top - rb.top - 12)]; });
      pts = [];
      if (opts.serpentine) {
        const idx = a.map((p, i) => i).sort((i, j) => a[i][1] - a[j][1] || a[i][0] - a[j][0]);
        const rows = []; idx.forEach(i => { const r = rows[rows.length - 1]; if (r && Math.abs(a[r[0]][1] - a[i][1]) < 40) r.push(i); else rows.push([i]); });
        const ord = []; let lx = a[rows[0][0]][0]; rows.forEach(r => { r.sort((i, j) => a[i][0] - a[j][0]); if (Math.abs(a[r[r.length - 1]][0] - lx) < Math.abs(a[r[0]][0] - lx)) r.reverse(); ord.push(...r); lx = a[r[r.length - 1]][0]; });
        nodes = ord.map(i => nodes[i]); const b = ord.map(i => a[i]);
        b.forEach((p, i) => { if (i) pts.push([pts[pts.length - 1][0], p[1]]); pts.push(p); });
        a.length = 0; a.push(...b);
      } else a.forEach((p, i) => { if (i) pts.push([p[0], pts[pts.length - 1][1]]); pts.push(p); });
      cum = [0];
      for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]));
      total = cum[cum.length - 1] || 1;
      nodeAt = a.map((p, i) => cum[i === 0 ? 0 : i * 2]);
      if (pts.length) path.setAttribute('d', 'M' + pts.map(p => p.join(' ')).join(' L'));
      root.querySelectorAll('[data-reveal]').forEach(w => { if (!w.dataset.watch) { w.dataset.watch = 1; cover(w); io.observe(w); } });
    }
    const relayout = () => { clearTimeout(t); t = setTimeout(layout, 150); };
    function pointAt(d) {
      let i = 1; while (i < cum.length && cum[i] < d) i++;
      if (i >= cum.length) return pts[pts.length - 1];
      const k = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
    }
    function tick(now) {
      if (lite && last && now - last < 30) { raf = requestAnimationFrame(tick); return; }
      const dt = last ? Math.min(now - last, 50) : 16; last = now;
      if (pts.length > 1 && opts.show !== false) {
        pos = (pos + speed() * dt / 1000) % (total + L());
        path.setAttribute('stroke-dasharray', L() + ' ' + (total + L()));
        path.setAttribute('stroke-dashoffset', String(-(pos - L())));
        const h = pointAt(Math.min(pos, total)), m = L() + 16;
        flt.setAttribute('x', h[0] - m); flt.setAttribute('y', h[1] - m); flt.setAttribute('width', m * 2); flt.setAttribute('height', m * 2);
        head.setAttribute('x', h[0] - 5); head.setAttribute('y', h[1] - 5); head.setAttribute('opacity', pos > total ? 0 : 1);
        const idx = nodeAt.findIndex(n => Math.abs(n - pos) < 14);
        if (idx >= 0 && idx !== lastNode && !opts.noHighlight) {
          lastNode = idx; const el = nodes[idx];
          if (el) { el.style.transition = 'outline-color 0.8s'; el.style.outline = '3px solid ' + YEL; el.style.outlineOffset = '4px'; setTimeout(() => { el.style.outlineColor = 'transparent'; }, 700); }
        }
      }
      raf = requestAnimationFrame(tick);
    }
    function cover(w) {
      const cv = w.querySelector('canvas'); if (cv) cv.style.display = 'none';
      w.style.background = '#fff';
    }
    function reveal(w) { w.dataset.rv = '1'; w.style.minHeight = '0'; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      requestAnimationFrame(() => reveal(e.target));
    }), { threshold: 0.01, rootMargin: '0px 0px 120px 0px' });
    const ro = new ResizeObserver(relayout); ro.observe(root);
    const mo = new MutationObserver(m => { if (m.some(x => ![...x.addedNodes, ...x.removedNodes].includes(svg) && x.target !== svg && !svg.contains(x.target))) relayout(); });
    mo.observe(root, { childList: true, subtree: true });
    relayout(); raf = requestAnimationFrame(tick);
    [600, 1500, 3000].forEach(ms => setTimeout(relayout, ms));
    if (document.readyState !== 'complete') addEventListener('load', relayout, { once: true });
    return { destroy() { cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); io.disconnect(); svg.remove(); }, layout };
  }
  window.Snake3A = Snake3A;
})();
