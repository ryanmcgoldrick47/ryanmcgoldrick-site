(function () {
  if (window.__rmSeo) return; window.__rmSeo = 1;
  document.documentElement.lang = 'en-AU';
  var SITE = 'https://ryanmcgoldrick.com', NAME = 'Ryan McGoldrick';
  var q = new URLSearchParams(location.search), slug = q.get('item') || q.get('w');
  function meta(attr, key, val) { var m = document.head.querySelector('meta[' + attr + '="' + key + '"]'); if (!m) { m = document.createElement('meta'); m.setAttribute(attr, key); document.head.appendChild(m); } m.setAttribute('content', val); }
  function ld(obj, id) { var s = document.getElementById(id); if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = id; document.head.appendChild(s); } s.textContent = JSON.stringify(obj); }
  function abs(p) { return /^https?:/.test(p) ? p : SITE + '/' + p.replace(/^\.?\//, ''); }
  function clean(t) { return String(t || '').replace(/\s+/g, ' ').trim(); }
  fetch('content/works.json').then(function (r) { return r.json(); }).then(function (works) {
    var by = {}; works.forEach(function (w) { by[w.slug] = w; });
    var alts = {}; works.forEach(function (w) { var m = w.specs && (w.specs.materials || w.specs.material); (w.images || []).forEach(function (src, i) { alts[src] = clean(w.title + (m ? ', ' + m : '') + (i ? ' (photo ' + (i + 1) + ')' : '')); }); });
    function fixAlts() { [].forEach.call(document.querySelectorAll('img'), function (im) { var s = im.getAttribute('src'); if (s && alts[s] && im.getAttribute('alt') !== alts[s]) im.setAttribute('alt', alts[s]); }); }
    fixAlts(); new MutationObserver(fixAlts).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    var p = slug && by[slug];
    if (p) {
      var desc = clean(p.description).slice(0, 155), img = abs((p.images || [])[0] || 'brand/og-image.jpg'), isItem = /item/.test(location.pathname);
      document.title = p.title + (p.client ? ' for ' + p.client : '') + ' | ' + NAME;
      meta('name', 'description', desc); meta('property', 'og:title', document.title); meta('property', 'og:description', desc); meta('property', 'og:image', img); meta('property', 'og:url', location.href);
      var c = document.head.querySelector('link[rel="canonical"]'); if (c) c.href = SITE + location.pathname + '?item=' + slug;
      var work = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: desc, image: (p.images || []).map(abs), creator: { '@type': 'Person', name: NAME } };
      if (!isItem) { ld(work, 'rm-ld-page'); return; }
      // Product markup only when the shop item has a real price; Google flags a Product with no offer as invalid.
      fetch('content/shop.json').then(function (r) { return r.json(); }).then(function (shop) {
        var it = shop.filter(function (x) { return x.slug === slug; })[0] || {};
        var offers = (it.options || [{ name: '', price: it.price, status: it.status }]).map(function (o) {
          var n = parseFloat(String(o.price || '').replace(/[^0-9.]/g, ''));
          return isNaN(n) || !n ? null : { '@type': 'Offer', name: o.name || undefined, price: n.toFixed(2), priceCurrency: 'AUD', url: location.href, availability: 'https://schema.org/' + (o.status === 'sold out' ? 'OutOfStock' : 'InStock') };
        }).filter(Boolean);
        ld(offers.length ? { '@context': 'https://schema.org', '@type': 'Product', name: p.title, description: desc, image: (p.images || []).map(abs), brand: { '@type': 'Brand', name: NAME }, material: p.specs && p.specs.materials, offers: offers } : work, 'rm-ld-page');
      }).catch(function () { ld(work, 'rm-ld-page'); });
    }
  }).catch(function () {});
})();
