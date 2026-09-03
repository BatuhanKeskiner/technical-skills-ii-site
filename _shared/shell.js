/* ============================================================
   Week #3 shell — the behaviour every generation shares.
   Chapter rail, step navigation, presentation mode, arrange,
   fullscreen interactives, gallery lightbox.
   Design generations differ in CSS only; this file is common.
   ============================================================ */
/* render.js and gen-d.js load as classic scripts before this file. */

/* The week this page belongs to, taken from its FOLDER and nothing else.
   It used to be taken from the whole URL path, which meant /01-introduction/
   and /01-introduction/index.html were two different weeks as far as the draft
   was concerned: work saved under one was invisible under the other, and the
   index page links to the first while a typed URL or a bookmark often gives the
   second. A week is a folder. */
const WEEK_SLUG = (function () {
  const parts = location.pathname.split('/').filter(Boolean)
    .filter((p) => !/^index\.html?$/i.test(p));
  return (parts[parts.length - 1] || 'week').replace(/[^a-z0-9]+/gi, '-');
}());
const ORDER_KEY = 'ts2-order-' + WEEK_SLUG + '-v1';

/* Edit mode keeps its unsaved work as a draft in the browser. When a draft
   exists for this week, it is what renders, until Submit writes content.js or
   Discard removes it. */
window.TS2_DRAFT_KEY = 'ts2-draft-' + WEEK_SLUG;

/* Drafts written under the old path-shaped keys are adopted once, here, before
   anything can save over them. The most recently saved one wins. The originals
   are left exactly where they are — a migration that deletes is a migration you
   cannot check afterwards. */
(function adoptOldDrafts() {
  try {
    if (localStorage.getItem(window.TS2_DRAFT_KEY)) return;
    let best = null;
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (!k || k === window.TS2_DRAFT_KEY) continue;
      if (!/^ts2-draft-/.test(k) || /-superseded$/.test(k)) continue;
      /* the old key was the path, so the folder name is inside it */
      if (k.replace(/[^a-z0-9]+/gi, '-').indexOf(WEEK_SLUG) === -1) continue;
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      let d = null;
      try { d = JSON.parse(raw); } catch (e) { continue; }
      if (!d || !d.week || !d.week.chapters) continue;
      if (!best || (d.t || 0) > (best.t || 0)) best = { key: k, raw, t: d.t || 0 };
    }
    if (!best) return;
    localStorage.setItem(window.TS2_DRAFT_KEY, best.raw);
    const req = localStorage.getItem('ts2-req-' + best.key);
    if (req && !localStorage.getItem('ts2-req-' + window.TS2_DRAFT_KEY)) {
      localStorage.setItem('ts2-req-' + window.TS2_DRAFT_KEY, req);
    }
    window.TS2_DRAFT_ADOPTED = best.key;
  } catch (e) { /* a browser with no storage is not a reason to fail to boot */ }
}());

/* A cheap fingerprint of the week as the file states it. Edit mode stamps every
   draft with the fingerprint of the file it was drafted from. */
function fingerprint(o) {
  const s = JSON.stringify(o);
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return s.length + '-' + h.toString(36);
}
window.TS2_FINGERPRINT = fingerprint;

function loadDraft(week) {
  try {
    const raw = localStorage.getItem(window.TS2_DRAFT_KEY);
    if (!raw) return week;
    const d = JSON.parse(raw);
    if (!d || !d.week || !d.week.chapters) return week;
    /* A draft belongs to the file it was drafted from. Once content.js has moved
       on — a round was applied — the draft is stale and the file wins. It is set
       aside rather than thrown away, so nothing is lost and nobody has to
       remember to press Discard. */
    /* The file's own stamp. A draft stamped the old way — with the fingerprint
       of the derived copy — is still honoured, so nothing made before this was
       fixed is thrown away. */
    const stamp = window.TS2_FILE_STAMP || fingerprint(week);
    const wasDerived = window.TS2_WEEK_FILE ? fingerprint(window.TS2_WEEK_FILE) : null;
    if (d.base && d.base !== stamp && d.base !== wasDerived) {
      /* Set aside, not thrown away - and the setting aside has to SUCCEED before
         the throwing away happens. Written the other way round, the copy was
         attempted, the failure was swallowed, and the original was deleted
         regardless: on a full localStorage - which is reachable, because a
         picture dropped into the editor is embedded in the draft and a week's
         draft can run to megabytes - that is the whole of an afternoon's work
         gone, silently, at the moment the file it was based on changed.
         If the copy cannot be made, the draft stays exactly where it is. It
         will be caught as stale again on the next load and the offer to bring
         it back will be made again; the page shows the file meanwhile, which is
         the same thing the reader would have seen anyway. Refusing to delete is
         always the safe end of this: the worst case is a draft that outlives
         its usefulness, against a best case of losing work that cannot be
         recovered from anywhere. */
      let kept = false;
      try {
        localStorage.setItem(window.TS2_DRAFT_KEY + '-superseded', raw);
        kept = localStorage.getItem(window.TS2_DRAFT_KEY + '-superseded') === raw;
      } catch (e) { kept = false; }
      if (kept) {
        localStorage.removeItem(window.TS2_DRAFT_KEY);
        window.TS2_DRAFT_SUPERSEDED = true;
      }
      return week;
    }
    window.TS2_DRAFT_AT = d.at;
    return d.week;
  } catch (e) { /* ignore a broken draft */ }
  return week;
}

/* Taking a file away marks it, there and then, so a reading list shows at a
   glance what is already on your machine. It is written in the viewer's own
   browser and is never sent anywhere. */
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a.eb-get, a.pd-get');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href) return;
  if (window.TS2_GOT) window.TS2_GOT.mark(href);
  a.classList.add('got');
});

async function boot(root = document, week) {
  /* What the file itself says, kept aside untouched. Edit mode compares the
     draft against this to list what has been changed since the last save. */
  try {
    /* The stamp a draft is judged by: the week EXACTLY as content.js states it,
       taken before any placement is derived onto it. It used to be taken after,
       from the derived copy, while the loader compared against the raw file —
       two numbers that can never be equal, so every draft was ruled stale on the
       very next load and every edit Batu made disappeared by itself. */
    window.TS2_FILE_STAMP = fingerprint(week);
    window.TS2_WEEK_FILE = JSON.parse(JSON.stringify(week));
    /* Every page is arranged, and a page that names no placement is given one
       as it loads. The baseline must be given the same one, or the panel opens
       saying the whole week has changed when nothing has. */
    if (window.TS2_DERIVE) {
      (window.TS2_WEEK_FILE.chapters || []).forEach((ch) =>
        (ch.steps || []).forEach((st) => window.TS2_DERIVE(st)));
    }
  } catch (e) { window.TS2_WEEK_FILE = null; }
  week = loadDraft(week);
  window.TS2_WEEK = week;
  render(root, week);
  await mountDemos(root);

  const chapters = [...root.querySelectorAll('section.chapter')];
  const list = root.querySelector('#chapter-list');
  railOverflow(root);
  const railButtons = [...list.querySelectorAll('li > button')];
  let ci = 0, si = 0;

  /* ---------- saved order ---------- */
  restoreOrder();

  function steps() { return [...chapters[ci].querySelectorAll('.step')]; }

  /* chapter-opening steps carry their chapter index as a giant numeral */
  function stamp() {
    chapters.forEach((sec) => {
      const n = sec.getAttribute('data-n') || '';
      sec.querySelectorAll('.step').forEach((st) => {
        if (!st.querySelector('h3.dup')) return;
        st.setAttribute('data-part-n', n);
        const busy = st.querySelector('figure, table, canvas, .timetable, .video-slot');
        st.classList.toggle('ts-divider', !busy && !!n);
      });
    });
  }
  stamp();

  function go(i) {
    ci = Math.max(0, Math.min(chapters.length - 1, i));
    const order = currentOrder();
    chapters.forEach((s) => s.classList.remove('active'));
    order[ci].classList.add('active');
    railButtons.forEach((b, k) => b.setAttribute('aria-current', String(k === ci)));
    /* The part label of the part being taught is the one that stands out; the
       others stand back. Which one that is changes as the lecture moves. */
    const part = order[ci] && order[ci].getAttribute('data-part');
    if (list) list.querySelectorAll('.part-label').forEach((el) => el.classList.toggle('on', !!part && el.classList.contains(part)));
    si = 0;
    if (document.body.classList.contains('present')) showStep(0);
    root.querySelectorAll('.chapter-nav').forEach((nav) => {
      const b = nav.querySelectorAll('button');
      if (b[0]) b[0].disabled = ci === 0;
      if (b[1]) b[1].disabled = ci === chapters.length - 1;
    });
    window.scrollTo(0, 0);
    resizeDemos();
  }

  function currentOrder() { return [...root.querySelectorAll('main.content section.chapter')]; }

  function showStep(n) {
    const st = [...currentOrder()[ci].querySelectorAll('.step')];
    if (!st.length) return;
    si = Math.max(0, Math.min(st.length - 1, n));
    st.forEach((s, k) => s.classList.toggle('active', k === si));
    const hud = root.querySelector('#hud-n');
    if (hud) hud.textContent = (si + 1) + ' / ' + st.length;
    /* A row of pictures is levelled by measuring it, and a page that is not on
       the screen has no width to measure — every column is nought pixels wide
       while its page is hidden. Doing the arithmetic once at load therefore did
       it against nothing, and the answer was thrown away. It is done again as
       each page comes up, which is the first moment there is anything to
       measure. */
    sizeRows(st[si] || root);
    levelRows(st[si] || root);
    resizeDemos();
  }

  function step(d) {
    const st = [...currentOrder()[ci].querySelectorAll('.step')];
    if (si + d < 0) {
      if (ci > 0) { go(ci - 1); showStep([...currentOrder()[ci].querySelectorAll('.step')].length - 1); }
      return;
    }
    if (si + d >= st.length) { if (ci < chapters.length - 1) { go(ci + 1); showStep(0); } return; }
    showStep(si + d);
  }

  function present(on) {
    document.body.classList.toggle('present', on);
    if (on) showStep(0);
    resizeDemos();
  }

  function resizeDemos() {
    requestAnimationFrame(() => {
      root.querySelectorAll('figure.demo').forEach((f) => { if (f._demo) f._demo.resize ? f._demo.resize() : f._demo.render(); });
    });
  }

  /* ---------- controls ---------- */
  railButtons.forEach((b, i) => b.addEventListener('click', () => go(i)));

  const bp = root.querySelector('#btn-present');
  if (bp) bp.addEventListener('click', () => present(true));
  const ba = root.querySelector('#btn-arrange');
  if (ba) ba.addEventListener('click', () => document.body.classList.toggle('arrange'));
  const hx = root.querySelector('#hud-exit');
  if (hx) hx.addEventListener('click', () => present(false));
  const hp = root.querySelector('#hud-prev');
  if (hp) hp.addEventListener('click', () => step(-1));
  const hn = root.querySelector('#hud-next');
  if (hn) hn.addEventListener('click', () => step(1));

  document.addEventListener('click', (e) => {
    const nav = e.target.closest && e.target.closest('.chapter-nav');
    if (!nav) return;
    const btn = e.target.closest('button');
    if (!btn) return;
    const b = [...nav.querySelectorAll('button')];
    go(b.indexOf(btn) === 0 ? ci - 1 : ci + 1);
  });

  document.addEventListener('keydown', (e) => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
    if (document.body.classList.contains('pages')) return;   /* pages.js owns the keys there */
    const on = document.body.classList.contains('present');
    if (e.key === 'p' || e.key === 'P') { present(!on); return; }
    if (e.key === 'a' || e.key === 'A') { document.body.classList.toggle('arrange'); return; }
    if (e.key === 'Escape' && on) { present(false); return; }
    if (!on) return;
    if (e.altKey || e.metaKey || e.ctrlKey) return;   /* a modified arrow is the editor's */
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    if (e.key === 'Home') showStep(0);
  });

  /* ---------- arrange: reorder chapters, persist ---------- */
  railButtons.forEach((b, i) => {
    const mv = document.createElement('div');
    mv.className = 'mv';
    ['↑', '↓'].forEach((glyph, k) => {
      const x = document.createElement('button');
      x.type = 'button';
      x.textContent = glyph;
      x.addEventListener('click', (ev) => {
        ev.stopPropagation();
        moveChapter(i, k === 0 ? -1 : 1);
      });
      mv.append(x);
    });
    b.parentElement.append(mv);
  });

  function moveChapter(from, dir) {
    const order = currentOrder();
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    const main = root.querySelector('main.content');
    if (dir < 0) main.insertBefore(order[from], order[to]);
    else main.insertBefore(order[to], order[from]);
    /* the rail follows the document */
    const items = [...list.querySelectorAll('li')];
    if (dir < 0) list.insertBefore(items[from], items[to]);
    else list.insertBefore(items[to], items[from]);
    railButtons.length = 0;
    railButtons.push(...list.querySelectorAll('li > button'));
    railButtons.forEach((b, k) => {
      b.onclick = () => go(k);
    });
    saveOrder();
    syncPartLabels();
    go(Math.max(0, Math.min(order.length - 1, to)));
  }

  function saveOrder() {
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify({ chapters: currentOrder().map((s) => s.id) }));
    } catch (e) { /* private mode */ }
  }

  /* A part label belongs to a RUN of chapters, not to a node, so any reorder
     invalidates every label's position. Rebuilding them from the document's
     current order is the only thing that stays correct — restoreOrder() and
     moveChapter() both re-append `<li>` elements, which silently moved every
     chapter past the labels and stacked all of them at the top of the rail.
     Carrying a label inside its `<li>` would survive the append but would
     travel with the wrong chapter across a part boundary. */
  function syncPartLabels() {
    list.querySelectorAll('.part-label').forEach((n) => n.remove());
    const items = [...list.querySelectorAll('li')];
    let prevPart = null;
    currentOrder().forEach((sec, i) => {
      const part = sec.dataset.part || '';
      if (part && part !== prevPart && items[i]) {
        const label = document.createElement('div');
        label.className = 'part-label ' + part;
        label.textContent = 'Part ' + part.toUpperCase() + ' · ' + (sec.dataset.partTitle || '');
        list.insertBefore(label, items[i]);
      }
      prevPart = part;
    });
  }

  function restoreOrder() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null'); } catch (e) { return; }
    if (!saved || !Array.isArray(saved.chapters)) return;

    /* A saved order only describes the chapters that existed when it was
       saved. Applying it to a document that has since gained or lost one
       re-appends the known chapters and leaves the new one stranded at the
       front — which is how "Next Week" became page 1. An order that does not
       match the document exactly is stale, so it is discarded rather than
       half-applied. */
    const ids = chapters.map((s) => s.id);
    const sameSet = saved.chapters.length === ids.length
      && saved.chapters.every((id) => ids.includes(id));
    if (!sameSet) {
      try { localStorage.removeItem(ORDER_KEY); } catch (e) { /* private mode */ }
      return;
    }

    const main = root.querySelector('main.content');
    const byId = {};
    chapters.forEach((s) => { byId[s.id] = s; });
    const items = {};
    [...list.querySelectorAll('li')].forEach((li, i) => { items[chapters[i].id] = li; });
    saved.chapters.forEach((id) => {
      if (byId[id]) main.append(byId[id]);
      if (items[id]) list.append(items[id]);
    });
    syncPartLabels();
  }

  /* ---------- gallery lightbox ---------- */
  const lb = root.querySelector('#lb');
  if (lb) {
    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('.lb-cap');
    const lbN = lb.querySelector('.lb-n');
    let set = [], at = 0;
    const paint = () => {
      const img = set[at];
      if (!img) return;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      lbCap.textContent = (img.closest('figure').getAttribute('data-title') || '');
      lbN.textContent = (at + 1) + ' / ' + set.length;
      lb.querySelector('.lb-p').hidden = set.length < 2;
      lb.querySelector('.lb-nx').hidden = set.length < 2;
    };
    /* A revealed picture only joins once it is open - before that the click
       belongs to the reveal. */
    window.TS2_ZOOMABLE = 'figure.slide.gallery .strip img, figure.slide.trio .tri img, '
      + 'figure.slide.stack .strip img, figure.slide.reveal.open img, figure.slide > img';
    /* The list above is the whole of the answer to "which pictures enlarge",
       and lecture.css is not allowed a second copy of it. It used to have one —
       the cursor rule — and the two had already drifted apart: a comparison
       opened the lightbox without saying it would, and a revealed picture said
       it would and opened nothing. So the list is read here and stamped onto
       the pictures it matches, and one rule in the stylesheet turns that stamp
       into the zoom cursor. Change the string above and the cursor follows,
       because there is nothing in the stylesheet left to change. */
    const stampZoomable = () => {
      const wanted = new Set(document.querySelectorAll(window.TS2_ZOOMABLE));
      document.querySelectorAll('img.zoomable').forEach((im) => {
        if (!wanted.has(im)) im.classList.remove('zoomable');
      });
      wanted.forEach((im) => im.classList.add('zoomable'));
    };
    /* Pages are rebuilt whenever the editor changes one, and a reveal opens
       without any rebuild at all, so the stamp is renewed on both — watching
       the document is the only way the cursor cannot fall behind the list.
       Once a frame at most: a class is toggled on every drag step while
       editing, and the sweep is a single querySelectorAll either way. */
    let stampDue = false;
    const restamp = () => {
      if (stampDue) return;
      stampDue = true;
      requestAnimationFrame(() => { stampDue = false; stampZoomable(); });
    };
    new MutationObserver(restamp).observe(document.documentElement,
      { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    restamp();
    document.addEventListener('click', (e) => {
      /* Every picture opens, not only the ones in a group. A single photograph
         could not be enlarged at all, which is why a document had to be drawn
         full width and uncropped to be readable — the rule was a workaround for
         a missing zoom. A picture the room should look at closely, and a page
         the room should read, are the same gesture: click it. */
      /* This list and the cursor rule in lecture.css used to be the same list
         said twice, and they had already drifted: a comparison opened but did
         not say so, and a revealed picture said pointer and opened nothing.
         Saying it once was not enough — the copy in the stylesheet was still
         there. It is gone now: the stamping above hands the list to the
         stylesheet as a class, and the same string decides both what this
         listener opens and what the cursor promises. A carousel is the
         exception on purpose: its stage advances on click, which is the better
         gesture for a sequence, and a lightbox on the same target would fight
         it. */
      const img = e.target.closest && e.target.closest(window.TS2_ZOOMABLE);
      if (img) {
        const scope = img.closest('.stk-row') || img.closest('figure');
        set = [...scope.querySelectorAll('img')];
        at = Math.max(0, set.indexOf(img));
        lb.classList.add('on');
        paint();
        return;
      }
      if (e.target.closest('.lb-x')) { lb.classList.remove('on'); return; }
      if (e.target.closest('.lb-p')) { at = (at - 1 + set.length) % set.length; paint(); return; }
      if (e.target.closest('.lb-nx')) { at = (at + 1) % set.length; paint(); return; }
      if (e.target === lb) lb.classList.remove('on');
    });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') { e.stopPropagation(); lb.classList.remove('on'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); at = (at + 1) % set.length; paint(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); at = (at - 1 + set.length) % set.length; paint(); }
    }, true);
  }

  /* Slideshows are wired by the renderer that draws them — see wireCarousel()
     in render.js. Nothing element-specific is attached here any more; what
     genuinely cannot live in the renderer is in wireStep() below. */

  /* ---------- ratio-width rows ----------
     Only the variants that promise "widths follow the pictures" get
     aspect-ratio flex-grow. Applying it to every strip was overriding the
     `grid` and `band` variants, which are meant to be equal-width. */
  /* ---------- things that open ----------
     Three devices ask before they tell: a scenario answer, one of three
     building blocks, and a goal that jumps to the page explaining it. All
     three are delegated from the root, so they survive a page change. */
  root.addEventListener('click', (e) => {
    const t = e.target;
    if (!t || !t.closest) return;

    const rev = t.closest('.reveal-btn');
    if (rev) {
      rev.setAttribute('aria-expanded', rev.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      return;
    }

    const r3btn = t.closest('.r3-btn');
    if (r3btn) {
      const card = r3btn.closest('.r3');
      const group = card.parentElement;
      const opening = !card.classList.contains('on');
      group.querySelectorAll('.r3').forEach((c) => {
        c.classList.remove('on');
        const b = c.querySelector('.r3-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (opening) { card.classList.add('on'); r3btn.setAttribute('aria-expanded', 'true'); }
      return;
    }

    const jump = t.closest('[data-goto]');
    if (jump) {
      document.dispatchEvent(new CustomEvent('lecture:goto', { detail: { id: jump.getAttribute('data-goto') } }));
    }
  });

  wireStep(root);

  window.addEventListener('resize', resizeDemos);
  go(0);
  sizeRows(root); levelRows(root);
  return { go, present, step };
}

/* ============================================================
   Reveal — hidden until asked for
   ------------------------------------------------------------
   The block type is in the contract and the stylesheet has always
   had the `.open` state, but nothing ever set it: the behaviour
   lived in Week 2's own inline engine and went with it when the
   week was migrated. It belongs to the machine, so it lives here
   and every week gets it.

   Click shows the picture for its own number of seconds, counts
   down, then hides it again — the room proposes before it is told.
   ============================================================ */
document.addEventListener('click', (e) => {
  const f = e.target.closest && e.target.closest('figure.slide.reveal');
  if (!f || f.classList.contains('open')) return;
  const secs = Math.max(1, parseInt(f.getAttribute('data-seconds') || '15', 10) || 15);
  const timer = f.querySelector('.timer');
  let left = secs;
  f.classList.add('open');
  if (timer) timer.textContent = left + 's';
  clearInterval(f._revealTick);
  f._revealTick = setInterval(() => {
    left -= 1;
    if (timer) timer.textContent = Math.max(0, left) + 's';
    if (left > 0) return;
    clearInterval(f._revealTick);
    f.classList.remove('open');
    if (timer) timer.textContent = secs + 's';
  }, 1000);
});

/* ============================================================
   A row of pictures at one height, none of them cropped
   ------------------------------------------------------------
   The justified row: each picture's width follows its own shape,
   so at a shared height every one of them is whole. The height is
   the width the row has to give, divided by the sum of the
   shapes — the same arithmetic the gallery strip uses.

   The widths a row like this uses come from the pictures, not
   from the width menu; that is what "not cropped" costs.
   ============================================================ */
/* Find rows to measure inside whatever we were handed — the whole document at
   load, or one step as it comes up. A step passed in is not a descendant of
   itself, so `.step .pg-row` finds nothing in it; this asks the scope for its
   own rows and keeps only those that really are on a page. */
function rowsOfKind(scope, kind) {
  const root = scope || document;
  const sel = '.pg-row[data-lvl=' + kind + ']';
  const out = root.querySelectorAll ? [...root.querySelectorAll(sel)] : [];
  if (root.matches && root.matches(sel)) out.unshift(root);
  return out.filter((r) => r.closest && r.closest('.step'));
}

function levelRows(root) {
  rowsOfKind(root, 'level').forEach((row) => {
    /* A justified row: every picture at one height, none of them cropped, so
       each one takes the width its own shape asks for. The columns are what
       carry the width now, so it is the columns that are given the shares —
       their set widths (a third each, say) are overruled for this row only,
       because a justified row is precisely the case where the widths must be
       allowed to differ. */
    const cols = [...row.children].filter((n) => n.classList && n.classList.contains('pg-col'));
    if (!cols.length) return;
    let sum = 0;
    let pending = false;
    const ars = cols.map((col) => {
      const im = col.querySelector('img');
      if (im && !im.complete) pending = true;
      return im && im.naturalWidth ? im.naturalWidth / im.naturalHeight : 1.5;
    });
    cols.forEach((col, k) => {
      col.style.flexGrow = String(ars[k]);
      col.style.flexBasis = '0';
      col.style.width = 'auto';
      sum += ars[k];
    });
    const gap = parseFloat(getComputedStyle(row).gap) || 0;
    const avail = row.clientWidth - gap * (cols.length - 1);
    if (avail > 0 && sum > 0) {
      /* never taller than the page can spare — the editor warns about the rest */
      const h = Math.min(avail / sum, window.innerHeight * 0.58);
      row.style.setProperty('--pg-level-h', Math.max(40, h) + 'px');
    }
    if (pending) cols.forEach((col) => {
      const im = col.querySelector('img');
      if (im && !im.complete) im.addEventListener('load', () => levelRows(root), { once: true });
    });
  });

  /* The other way of levelling a row, and the one that did nothing at all.
     `same` keeps the columns the widths they were set and crops the pictures
     to one height instead. The stylesheet asked each picture for 100% of its
     item's height — but nothing had ever given the item a height, so 100%
     resolved to `auto`, every picture kept its own shape, and the only thing
     the control changed was `object-fit`. The row is measured here for the
     same reason `level` is: a height in pixels is the one thing CSS cannot
     work out for itself.

     The contract says the row stretches to its TALLEST and each picture is
     cropped to that, which is what the catalogue page says in its own words,
     so that is what is measured. Capped at the same share of the page as
     `level`, so a portrait in the row cannot push it off the screen.

     The columns' widths are deliberately left alone: keeping them is exactly
     what distinguishes `same` from `level`. */
  rowsOfKind(root, 'same').forEach((row) => {
    const cols = [...row.children].filter((n) => n.classList && n.classList.contains('pg-col'));
    if (!cols.length) return;
    let pending = false;
    let tallest = 0;
    cols.forEach((col) => {
      const im = col.querySelector('img');
      if (!im) return;                       /* a column of words sets no height */
      if (!im.complete) pending = true;
      const ar = im.naturalWidth ? im.naturalWidth / im.naturalHeight : 1.5;
      const w = col.clientWidth;
      if (w > 0 && ar > 0) tallest = Math.max(tallest, w / ar);
    });
    if (tallest > 0) {
      const h = Math.min(tallest, window.innerHeight * 0.58);
      row.style.setProperty('--pg-level-h', Math.max(40, h) + 'px');
    }
    if (pending) cols.forEach((col) => {
      const im = col.querySelector('img');
      if (im && !im.complete) im.addEventListener('load', () => levelRows(root), { once: true });
    });
  });
}
/* ---- a row's share of the page, in real pixels ----
   A share written as a percentage never resolved: the chain of definite
   heights from the deck down to the rows box breaks somewhere, so every
   percentage fell back to the row's own content height and dragging a row
   taller did nothing at all. Measured after layout there is nothing to
   resolve — the rows box has a height, and a quarter of it is a number. */
function sizeRows(root) {
  const SHARE = { '1/8': 0.125, '1/4': 0.25, '3/8': 0.375, '1/2': 0.5,
    '5/8': 0.625, '3/4': 0.75, '7/8': 0.875 };
  const scope = root || document;
  const boxes = scope.querySelectorAll ? [...scope.querySelectorAll('.pg-rows')] : [];
  boxes.filter((box) => box.closest('.step.active')).forEach((box) => {
    const rows = [...box.querySelectorAll(':scope > .pg-row')];
    if (!rows.some((r) => r.hasAttribute('data-hgt'))) return;
    /* what the rows have to share, once the foot is taken off */
    const pad = parseFloat(getComputedStyle(box).paddingBottom) || 0;
    const gap = parseFloat(getComputedStyle(box).rowGap) || 0;
    const room = box.clientHeight - pad - gap * Math.max(0, rows.length - 1);
    if (room <= 0) return;
    rows.forEach((r) => {
      const k = r.getAttribute('data-hgt');
      if (!k || !SHARE[k]) return;
      r.style.flex = '0 0 auto';
      r.style.minHeight = '0';
      r.style.height = Math.round(room * SHARE[k]) + 'px';
    });
  });
}
/* ============================================================
   One place where a drawn page is made to work
   ------------------------------------------------------------
   Behaviour used to be attached in boot(), once, over whatever
   the page held at that moment. Everything drawn afterwards —
   the editor rebuilding a page, a block dropped from the
   palette — arrived dead: it looked right and did nothing.

   Two kinds of behaviour, and they live in two places. What
   belongs to one drawn thing is attached by the renderer that
   draws it (see wireCarousel in render.js). What has to be
   measured against the page it has landed on — the widths of a
   row of pictures, which need the room the page actually gives
   them — cannot be known at drawing time, and is done here.

   wireStep() is idempotent: running it twice over the same page
   does not bind anything twice. Everything that puts a page on
   the screen calls it, and nothing else attaches behaviour.
   ============================================================ */
const RATIO_ROWS = 'figure.slide.gallery:not([data-layout]) .strip,'
  + 'figure.slide.gallery[data-layout=ratio] .strip,'
  + 'figure.slide.trio[data-layout=strip] .tri,'
  + 'figure.slide.stack .strip';

/* A row whose widths follow the pictures: each picture grows by its own
   ratio, so at one height every one of them is whole. */
function layoutStrips(scope) {
  const root = scope || document;
  const strips = root.querySelectorAll ? root.querySelectorAll(RATIO_ROWS) : [];
  strips.forEach((strip) => {
    const kids = [...strip.children];
    let sum = 0;
    /* The picture inside the child, not the child itself. A picture that has
       been given its own credit is wrapped in a cell so the credit can sit
       under it, and the cell is a DIV: this asked the DIV for its shape, got
       nothing, and fell back to 1.5 for every captioned picture in the row.
       So a strip of three photographs, two of them credited, divided its width
       between two assumed landscapes and whatever was left — the third came
       out 77 pixels wide beside two full-height frames. Ask the photograph. */
    const picOf = (k) => (k.tagName === 'IMG' ? k : k.querySelector('img'));
    kids.forEach((k) => {
      const pic = picOf(k);
      const ar = pic && pic.naturalWidth
        ? pic.naturalWidth / pic.naturalHeight
        : parseFloat(k.getAttribute('data-ar') || (pic && pic.getAttribute('data-ar')) || '1.5');
      k.style.flexGrow = ar;
      sum += ar;
    });
    const gap = parseFloat(getComputedStyle(strip).gap) || 12;
    strip.style.setProperty('--sa', sum);
    strip.style.setProperty('--gaps', gap * Math.max(0, kids.length - 1) + 'px');
    /* The height at which every picture in this row is WHOLE. Each one takes
       the share of the width its own shape asks for, so at this one height
       none of them has to be cropped to fit. A group of pictures had no such
       bound and was cropped to whatever height the rows happened to divide
       into — a quarter cut off the side of each half of a diptych. Nothing is
       stretched by it: it can only make a row shorter than the space it was
       given, never taller. */
    const avail = strip.clientWidth - gap * Math.max(0, kids.length - 1);
    if (avail > 0 && sum > 0) strip.style.setProperty('--rowh', (avail / sum) + 'px');
    /* a picture that has not arrived yet has no shape to go on; do the row
       again when it does, once per picture */
    kids.forEach((k) => {
      const pic = picOf(k);
      if (pic && !pic.complete && !pic._striped) {
        pic._striped = true;
        pic.addEventListener('load', () => layoutStrips(strip.closest('.step') || document), { once: true });
      }
    });
  });
}

/* The week's timetable: three class groups take the same lesson, so the plan
   is one table and the groups are a switch. */
function wireSchedules(scope) {
  const root = scope || document;
  const list = root.querySelectorAll ? root.querySelectorAll('.schedule') : [];
  list.forEach((sc) => {
    if (sc._wired) return;
    sc._wired = true;
    const tabs = [...sc.querySelectorAll('.sc-tab')];
    const bodies = [...sc.querySelectorAll('.sc-body')];
    function select(i) {
      tabs.forEach((t, k) => t.setAttribute('aria-current', String(k === i)));
      bodies.forEach((b, k) => { if (k === i) b.removeAttribute('hidden'); else b.setAttribute('hidden', ''); });
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      /* arrow keys walk the groups once a tab has focus, and must not also
         turn the lecture page */
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        e.stopPropagation();
        const next = i + (e.key === 'ArrowRight' ? 1 : -1);
        if (next < 0 || next >= tabs.length) return;
        tabs[next].focus();
        select(next);
      });
    });
  });
}

/* ---- the band a row reserves for its credits ----
   A strip promises that every photograph in it is the same height. A picture
   given its own credit is wrapped so the credit can sit under it, and on a row
   with no height to spare that credit was taken out of the picture — so the
   credited photograph came out shorter than its neighbours and the row stopped
   lining up along the bottom.

   How tall a credit is cannot be written in the stylesheet: it is one line for
   a name and two for a full attribution, and which it is depends on how wide
   that picture ended up. So the tallest credit in the row is measured here and
   the stylesheet reserves that same band under every picture in the row,
   including the ones with no credit — a row of one height is the thing being
   kept. A row with no credit in it is left exactly as it was. */
function capRows(scope) {
  const root = scope || document;
  const rows = root.querySelectorAll ? root.querySelectorAll('.strip') : [];
  rows.forEach((row) => {
    const caps = [...row.querySelectorAll(':scope > .cell > .cell-cap')];
    if (!caps.length) {
      row.removeAttribute('data-capped');
      row.style.removeProperty('--cap-h');
      return;
    }
    /* measured with nothing reserved yet, or the next pass would measure the
       band the last one reserved and the row would creep on every redraw */
    row.style.setProperty('--cap-h', '0px');
    let band = 0;
    caps.forEach((c) => {
      const top = parseFloat(getComputedStyle(c).marginTop) || 0;
      band = Math.max(band, c.offsetHeight + top);
    });
    row.setAttribute('data-capped', '');
    row.style.setProperty('--cap-h', Math.ceil(band) + 'px');
  });
}

function wireStep(el) {
  const scope = el || document;
  layoutStrips(scope);
  capRows(scope);
  wireSchedules(scope);
  return scope;
}
/* The rail fades at the foot only while something is scrolled out of sight —
   fifteen chapters in room for twelve, and nothing said the rest were below. */
function railOverflow(root) {
  const list = (root || document).querySelector('#chapter-list');
  if (!list) return;
  const mark = () => list.classList.toggle('has-more',
    list.scrollHeight - list.clientHeight - list.scrollTop > 4);
  mark();
  list.addEventListener('scroll', mark, { passive: true });
  try { new ResizeObserver(mark).observe(list); } catch (e) { /* old browser */ }
  window.addEventListener('resize', mark);
}
window.TS2_RAIL = railOverflow;

window.TS2_WIRE = wireStep;

window.TS2_SIZE_ROWS = sizeRows;
window.TS2_LEVEL_ROWS = function (root) { sizeRows(root); levelRows(root); capRows(root); };
addEventListener('resize', () => { sizeRows(document); levelRows(document); capRows(document); });

window.boot = boot;
