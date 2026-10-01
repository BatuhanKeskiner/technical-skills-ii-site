/* diagram block: draws one library form into its figure at the page's own scale.
   Scale s = the page lede's font size / 23.4 (1.0 at 1440 wide, 1.2 at 1920): every unit
   size in the library is drawn at s, the column grid is the figure's own width. Redraws
   when the figure changes width or the fonts arrive. Light ground only. */
(function () {
  const IDL = window.IDL, G = IDL.G;
  IDL.mount = function (host, spec) {
    const fn = (spec.variant === 'B' && IDL.RB && IDL.RB[spec.form]) || IDL.R[spec.form];
    if (!fn) { host.textContent = 'Unknown diagram form: ' + spec.form; return; }
    const draw = () => {
      const width = host.clientWidth; if (!width) return;
      const step = host.closest('.step'), lede = step && step.querySelector('.line');
      const fs = lede ? parseFloat(getComputedStyle(lede).fontSize) : 23.4, s = fs / 23.4;
      const gut = 0.02 * window.innerWidth / s, T = IDL.theme('light');
      /* 30-09-2026: the frame was 4000 high, so a form that fills its height (frayer, and the B treatments
         of keys, options, pair, formula) drew ~2000 px tall. It now gets the room left on the page: from the
         top of the figure to the foot of the step, less what the blocks after it need. */
      let roomPx = 0;
      if (step) {
        const sr = step.getBoundingClientRect(), hr = host.getBoundingClientRect();
        /* what sits below the figure: in a stacked page the later blocks are their own rows (.pg-item), not
           siblings of the figure, so the distance from the figure's foot to the lowest of them is measured */
        const own = host.closest('.pg-item');
        let low = hr.bottom;
        step.querySelectorAll('.pg-item').forEach((it) => {
          if (it === own || it.contains(host)) return;
          const r = it.getBoundingClientRect(); if (r.height && r.top >= hr.bottom - 1) low = Math.max(low, r.bottom);
        });
        let after = low - hr.bottom; for (let n = host.nextElementSibling; n; n = n.nextElementSibling) after += n.getBoundingClientRect().height;
        /* the foot is the inside of the step and of the grid the figure sits in, not their outer edge (both
           carry bottom padding - page 7 of week 5 B was given ~80 px it did not have) */
        const pb = (e) => parseFloat(getComputedStyle(e).paddingBottom) || 0;
        let foot = sr.bottom - pb(step);
        for (let e = (own || host).parentElement; e && e !== step; e = e.parentElement) foot = Math.min(foot, e.getBoundingClientRect().bottom - pb(e));
        roomPx = foot - hr.top - after - 8;
        /* on a centred page the figure's top moves as it grows, so the room is also measured as the
           height of the page's rows less every block stacked above or below the figure (30-09) */
        const rows = step.querySelector('.pg-rows');
        if (rows && step.classList.contains('centred')) {
          let other = 0, n = 0;
          step.querySelectorAll('.pg-item').forEach((it) => {
            if (it === own || it.contains(host) || host.contains(it)) return;
            const q = it.getBoundingClientRect();
            if (q.height && q.left < hr.right - 1 && q.right > hr.left + 1) { other += q.height; n++; }
          });
          const rs = getComputedStyle(rows), inner = rows.getBoundingClientRect().height - (parseFloat(rs.paddingTop) || 0) - (parseFloat(rs.paddingBottom) || 0);
          const gap = parseFloat(rs.rowGap) || 24;
          /* 01-10-2026: the page's rows decide alone. The measure from the figure's present top is short on a
             centred page, because that top is lower the smaller the figure is, and the smaller of the two kept
             the negative on Reading a Negative small (his note: "fotoğrafı daha da büyütebilirsin") */
          roomPx = inner - other - gap * n - 8;
        }
      }
      /* draw at scale sc: the frame is the column (width / sc) by the room left (roomPx / sc) */
      const render = (sc) => {
        const room = roomPx / sc, H = room > 240 ? Math.min(room, 4000) : 640;
        const c = IDL.ctx(width / sc, H, 1, T, undefined, 1, gut * s / sc);
        c.site = true; c.room = H; c.flags = {}; c.pageTitle = spec.pageTitle || '';
        let m = '';
        try { m = fn(spec.data, c); } catch (e) { console.error('diagram', spec.form, e); }
        if (sc !== 1) m = IDL.hairFix(m);
        host.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="10" viewBox="0 0 ' + width + ' 10" style="display:block;overflow:visible"><g transform="scale(' + sc + ')">' + m + '</g></svg>';
        const svg = host.firstChild, b = svg.firstChild.getBBox(), h = Math.ceil((b.y + b.height) * sc) + 2;
        svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 ' + width + ' ' + h);
        return { h, w: (b.x + b.width) * sc };
      };
      /* 30-09-2026, his choice "Enlarge the drawing to fill the page" - PREVIEW ONLY (?fill) until he has
         seen it: "kural olarak işlemeden önce bir göreyim". A drawing smaller than the room
         left on the page is drawn again larger - up to 1.75x the page scale, never wider than the column
         nor taller than the room - so the figure is not a small thing floating in an empty field. Its type
         grows with it. If the larger drawing does not fit, the page scale stands. */
      const first = render(s);
      if (/[?&]fill\b/.test(location.search) && roomPx > 0 && first.h > 0) {
        const k = Math.min(1.75, roomPx / first.h, width / Math.max(first.w, 1));
        if (k > 1.08) {
          const big = render(s * k);
          if (big.h > roomPx + 2 || big.w > width + 2) render(s);
        }
      }
    };
    let last = 0;
    if (window.ResizeObserver) new ResizeObserver(() => { const w = host.clientWidth; if (w !== last) { last = w; draw(); } }).observe(host);
    /* the blocks around the figure can grow after it is drawn (the review buttons under a generated line
       arrive a moment later), which takes room from it; it is drawn again when they change height (30-09) */
    const stepEl = host.closest('.step');
    if (window.ResizeObserver && stepEl) {
      const own = host.closest('.pg-item'), hs = new Map();
      let t = 0, n = 0, since = 0;
      const ro = new ResizeObserver((es) => {
        let changed = false;
        es.forEach((e) => { const h = Math.round(e.contentRect.height); if (hs.get(e.target) !== h) { if (hs.has(e.target)) changed = true; hs.set(e.target, h); } });
        /* never more than four redraws in two seconds: a neighbour that answers every redraw is a loop, not a late arrival */
        const now = Date.now(); if (now - since > 2000) { since = now; n = 0; }
        if (changed && n < 4) { n += 1; clearTimeout(t); t = setTimeout(draw, 60); }
      });
      /* 01-10-2026: only words are watched. A picture beside the drawing takes the room the drawing leaves,
         so it changes height whenever the drawing is redrawn, and watching it made the two trade height
         for ever (Keeping Negatives, his note: "sürekli oynuyor, görsel sürekli boyut değiştiriyor"). */
      stepEl.querySelectorAll('.pg-item').forEach((it) => {
        if (it === own || it.contains(host) || it.querySelector('figure, img, canvas, video')) return;
        ro.observe(it);
      });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    draw();
  };
})();
