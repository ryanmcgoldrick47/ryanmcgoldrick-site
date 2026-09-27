(function () {
  const Y = 'oklch(88% 0.18 105)', G = 'oklch(84% 0 0)';
  const NS = 'http://www.w3.org/2000/svg';
  function Snake3A(root, opts) {
    opts = opts || {};
    const speed = () => opts.speed || 420, L = () => opts.length || 280;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('style', 'position:absolute;left:0;top:0;pointer-events:none;z-index:20;overflow:visible');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', Y); path.setAttribute('stroke-width', '4'); path.setAttribute('stroke-linecap', 'square');
    const head = document.createElementNS(NS, 'rect');
    head.setAttribute('width', '10'); head.setAttribute('height', '10'); head.setAttribute('fill', Y);
    svg.appendChild(path); svg.appendChild(head); root.appendChild(svg);
    let pts = [], cum = [], total = 1, pos = 0, nodes = [], nodeAt = [], lastNode = -1, last = 0, raf, t;

    function layout() {
      const rb = root.getBoundingClientRect();
      svg.setAttribute('width', root.scrollWidth); svg.setAttribute('height', root.scrollHeight);
      nodes = [...root.querySelectorAll('[data-snake]')].filter(n => n.offsetParent !== null);
      const a = nodes.map(n => { const r = n.getBoundingClientRect(); return [Math.round(r.left - rb.left - 12), Math.round(r.top - rb.top - 12)]; });
      pts = [];
      a.forEach((p, i) => { if (i) pts.push([p[0], pts[pts.length - 1][1]]); pts.push(p); });
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
      const dt = last ? Math.min(now - last, 50) : 16; last = now;
      if (pts.length > 1 && opts.show !== false) {
        pos = (pos + speed() * dt / 1000) % (total + L());
        path.setAttribute('stroke-dasharray', L() + ' ' + (total + L()));
        path.setAttribute('stroke-dashoffset', String(-(pos - L())));
        const h = pointAt(Math.min(pos, total));
        head.setAttribute('x', h[0] - 5); head.setAttribute('y', h[1] - 5); head.setAttribute('opacity', pos > total ? 0 : 1);
        const idx = nodeAt.findIndex(n => Math.abs(n - pos) < 14);
        if (idx >= 0 && idx !== lastNode) {
          lastNode = idx; const el = nodes[idx];
          if (el) { el.style.transition = 'outline-color 0.6s'; el.style.outline = '2px solid ' + Y; el.style.outlineOffset = '4px'; setTimeout(() => { el.style.outlineColor = 'transparent'; }, 500); }
        }
      }
      raf = requestAnimationFrame(tick);
    }
    function cover(w) {
      const cv = w.querySelector('canvas'); if (!cv) return;
      const r = w.getBoundingClientRect(); cv.width = Math.max(1, r.width); cv.height = Math.max(1, r.height);
      const c = cv.getContext('2d'); c.fillStyle = G; c.fillRect(0, 0, cv.width, cv.height);
    }
    function reveal(w) {
      w.style.minHeight = '0';
      const cv = w.querySelector('canvas'); if (!cv) return;
      const r = w.getBoundingClientRect(), W = r.width, H = r.height; cv.width = W; cv.height = H;
      const c = cv.getContext('2d'); c.fillStyle = G; c.fillRect(0, 0, W, H);
      const cell = Math.max(24, Math.round(W / 18)), cols = Math.ceil(W / cell), rows = Math.ceil(H / cell), order = [];
      for (let y = 0; y < rows; y++) for (let i = 0; i < cols; i++) order.push([y % 2 ? cols - 1 - i : i, y]);
      const per = Math.max(1, Math.ceil(order.length / (opts.revealFrames || 55))), len = Math.max(6, Math.round(cols * 0.8));
      const body = []; let k = 0;
      (function frame() {
        body.forEach(([x, y]) => c.clearRect(x * cell, y * cell, cell, cell));
        for (let s = 0; s < per && k < order.length; s++, k++) { const p = order[k]; c.clearRect(p[0] * cell, p[1] * cell, cell, cell); body.push(p); if (body.length > len) body.shift(); }
        if (k >= order.length && body.length) body.splice(0, per);
        c.fillStyle = Y;
        body.forEach(([x, y], i) => { const g = i === body.length - 1 ? 1 : 3; c.fillRect(x * cell + g, y * cell + g, cell - g * 2, cell - g * 2); });
        if (k < order.length || body.length) requestAnimationFrame(frame); else cv.style.display = 'none';
      })();
    }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const img = e.target.querySelector('img'), go = () => requestAnimationFrame(() => reveal(e.target));
      if (!img || (img.complete && img.naturalHeight)) go(); else img.addEventListener('load', go, { once: true });
    }), { threshold: 0.15 });
    const ro = new ResizeObserver(relayout); ro.observe(root);
    const mo = new MutationObserver(m => { if (m.some(x => ![...x.addedNodes, ...x.removedNodes].includes(svg) && x.target !== svg && !svg.contains(x.target))) relayout(); });
    mo.observe(root, { childList: true, subtree: true });
    relayout(); raf = requestAnimationFrame(tick);
    return { destroy() { cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); io.disconnect(); svg.remove(); }, layout };
  }
  window.Snake3A = Snake3A;
})();
