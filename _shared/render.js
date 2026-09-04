/* ============================================================
   Shared renderer — turns content.js into the class vocabulary
   in lectures/CONTRACT.md. All three design generations use
   this same renderer, so the only difference between them is
   the stylesheet.
   ============================================================ */
const DEMOS = {
  dof: { url: './interactives/dof.js', fn: 'mountDof' },
  focal: { url: './interactives/focal.js', fn: 'mountFocal' },
  kelvin: { url: './interactives/kelvin.js', fn: 'mountKelvin' },
  transform: { url: './interactives/transform.js', fn: 'mountTransform' },
  viewfinder: { url: './interactives/viewfinder.js', fn: 'mountViewfinder' },
  fovea: { url: './interactives/fovea.js', fn: 'mountFovea' },
};

/* A bare file name is the week's own assets/ folder. A name with a slash is
   used as written — '../_shared/assets/kabk-logo.jpg', or another week's folder. */
const ASSETS = 'assets/';
const asset = (src) => (window.TS2_EMBED && window.TS2_EMBED[src]) || ((src && src.includes('/')) ? src : ASSETS + src);
/* The editor has to resolve a file name exactly the way the page does, so that
   when it tells you a name is not in assets/ it is talking about the same file
   the page would have gone looking for. One resolver, said once. */
window.TS2_ASSET = asset;

/* The download control. A file is a thing you take away, so it says what it is
   and how big it is before you commit to it. Drawn, not written in emoji. */
/* What this viewer has already taken away. It lives in their own browser and
   goes no further — it is a convenience, not a record. */
const GOT_KEY = 'ts2-got';
function gotSet() {
  try { return new Set(JSON.parse(localStorage.getItem(GOT_KEY) || '[]')); }
  catch (e) { return new Set(); }
}
function markGot(path) {
  try {
    const s = gotSet(); s.add(path);
    localStorage.setItem(GOT_KEY, JSON.stringify([...s]));
  } catch (e) { /* a browser with no storage still downloads the file */ }
}
window.TS2_GOT = { set: gotSet, mark: markGot };

/* ------------------------------------------------------------------
   THE NAME A FILE ARRIVES UNDER
   ------------------------------------------------------------------
   A file changes shape between the site and the copy the students are
   handed. On the site it is a path in the week's assets folder, and the
   ending is the last thing in it. In the student copy the very same file
   has been embedded — data:application/pdf;base64,… — and the path is
   gone, so the media type is the only thing left that says what the file
   is. Anything that wants to know the ending has to ask both, or it will
   be right on the site and wrong in the only copy anybody downloads from.
   ------------------------------------------------------------------ */
/* The few media types whose name is not already the ending people write. */
const MEDIA_EXT = { jpeg: 'jpg', 'svg+xml': 'svg', plain: 'txt', markdown: 'md',
  tiff: 'tif', 'x-zip-compressed': 'zip', 'vnd.adobe.photoshop': 'psd' };
function fileExt(b) {
  const src = b.file || b.link || '';
  const m = /\.([A-Za-z0-9]{1,5})(?:[?#].*)?$/.exec(src);
  if (m) return m[1].toLowerCase();
  const d = /^data:([A-Za-z0-9.+-]+)\/([A-Za-z0-9.+-]+)/.exec(src);
  if (!d) return '';
  const sub = d[2].toLowerCase();
  return MEDIA_EXT[sub] || (/^[a-z0-9]{1,5}$/.test(sub) ? sub : '');
}
/* What the saved file should be called. The words the block already shows the
   room are the right name — they are what the student was reading when they
   pressed it — with the characters no file system will take turned into
   hyphens and the ending put back on the end. */
function fileName(b) {
  const words = String(b.name || b.title || '').replace(/\s+/g, ' ').trim();
  const base = words.replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '-')
    .replace(/^[.\-\s]+/, '').replace(/[.\-\s]+$/, '');
  if (!base) {
    /* Nothing is written on the block. On the site the file's own last path
       segment is a real name and is better than nothing; in the student copy
       there is no path left, and an empty download= leaves the browser to
       guess, which is no worse than a guess of ours. */
    return /^data:/.test(b.file || '') ? '' : (b.file || '').split('/').filter(Boolean).pop() || '';
  }
  const ext = fileExt(b);
  if (!ext || base.toLowerCase().endsWith('.' + ext)) return base;
  return base + '.' + ext;
}
function getBar(b, cls, design) {
  /* Two ways to hand something over. `file` is carried in the week's own
     assets folder and saves straight to the desk. `link` is somewhere else —
     Dropbox, WeTransfer, a library record — and opens that page in a new tab
     instead. A file the week is too heavy to carry is the usual reason. */
  const where = b.file || b.link || '';
  const away = !b.file && !!b.link;
  const had = where ? gotSet().has(where) : false;
  const a = el(where ? 'a' : 'span', cls + (design ? ' get-d' + design : '')
    + (had ? ' got' : '') + (away ? ' get-away' : ''));
  if (b.file) {
    a.setAttribute('href', b.file);
    /* The file has to land on the student's desk under its own name. An empty
       download="" hands the naming to the browser, and in the copy that is
       actually handed out — where the file travels as a data: URI with no path
       left to read a name from — the browser's answer is the same for every
       attachment in the week: download.pdf, then download-1.pdf, download-2.pdf.
       Twenty students taking three hand-outs each end up with sixty files, none
       of which says what it is. The block knows what the thing is called, so
       the link says it. */
    a.setAttribute('download', fileName(b));
  }
  else if (b.link) {
    a.setAttribute('href', b.link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  }
  /* The mark and the word are one thing — the part you press. The
     measurement stands apart from it, so a design can stroke the first as a
     button and let the second stand back. */
  const face = el('span', 'get-face');
  face.append(arrowMark());
  face.append(tickMark());
  face.append(el('span', 'get-n', b.action || (away ? 'Open' : 'Download')));
  /* Both words are drawn and one is shown, so nothing has to write English
     into a stylesheet to say the file has been taken. */
  face.append(el('span', 'get-got', away ? 'Opened' : 'Downloaded'));
  if (away) face.append(awayMark());
  a.append(face);
  /* A link says where it goes, since the reader is about to leave the site. */
  const host = away ? hostOf(b.link) : '';
  const m = [fileKind(b), b.size, host].filter(Boolean).join(' \u00b7 ');
  a.append(el('span', 'get-m', m));
  return a;
}
/* An arrow leaving a box: this one goes somewhere rather than saving. */
function awayMark() {
  const s = svg(16, 16);
  s.setAttribute('class', 'get-away-m');
  s.innerHTML = '<path d="M6.5 3.5H3.2v9.3h9.3V9.5" fill="none" stroke="currentColor" stroke-width="1.5"/>'
    + '<path d="M9.2 3.5h3.3v3.3M12.5 3.5 7.6 8.4" fill="none" stroke="currentColor" stroke-width="1.5"/>';
  return s;
}
/* dropbox.com from a whole URL, so the reader knows where they are being sent */
function hostOf(u) {
  try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
}
/* mm:ss, and never a bare number of seconds — a room reads a clock */
function clockFace(sec) {
  const s = Math.max(0, Math.round(sec));
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}
/* The two-star mark the generated caption already uses, so anything waiting on
   Claude is written in one hand. */
function aiMark() {
  const s = svg(16, 16);
  s.setAttribute('class', 'gen-mark');
  s.innerHTML = '<path d="M8 0.8l1.5 4.4 4.4 1.5-4.4 1.5L8 12.6 6.5 8.2 2.1 6.7l4.4-1.5z"/>'
    + '<path d="M13 10.4l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>';
  return s;
}
/* Behaviour attaches in the render path, not at boot: a timer built by the
   editor, dropped from the palette, or opened in the student copy is the same
   timer. This is the lesson 3.3 cost us — a slideshow wired once at boot was
   dead everywhere else. */
function wireTimer(box) {
  const base = () => Math.max(5, parseInt(box.getAttribute('data-seconds') || '300', 10) || 300);
  let left = base();
  let tick = null;
  let until = 0;   /* while it is running: the wall-clock moment it reaches zero */
  const num = () => box.querySelector('.timer-num');
  const run = () => box.querySelector('.timer-run');
  /* What is left is read from the clock on the wall, never counted by how many
     times the interval has fired. An interval that is late — and the browser
     makes it late whenever the tab is busy, behind another window, or the
     machine is thinking — loses that time for good, and a clock at the front of
     a room that is a minute slow by the end of the exercise is worse than no
     clock at all. */
  const sync = () => { if (tick) left = Math.max(0, Math.ceil((until - Date.now()) / 1000)); };
  const paint = () => {
    const n = num(); if (n) n.textContent = clockFace(left);
    box.classList.toggle('out', left <= 0);
    box.classList.toggle('going', !!tick);
    /* Three states, three words, and the button always says what pressing it
       will do. At zero there is nothing left to start, so it offers the only
       useful thing left: put the whole length back on the clock and count it
       again. This line read `left <= 0 ? 'Start' : 'Start'` — a branch someone
       opened and never filled in — so a finished clock offered the room a
       Start that could not start anything. */
    const r = run(); if (r) r.textContent = tick ? 'Pause' : (left <= 0 ? 'Start again' : 'Start');
  };
  const stop = () => { sync(); clearInterval(tick); tick = null; paint(); };
  const start = () => {
    if (tick) return;
    /* Start at zero is Start again: the length the block was given goes back on
       the clock and runs, which is exactly what the button now promises. */
    if (left <= 0) left = base();
    until = Date.now() + left * 1000;
    /* Five times a second, so the digit changes ON the second rather than up to
       a second after it. The work per tick is one subtraction and one string. */
    tick = setInterval(() => {
      sync();
      if (left <= 0) { clearInterval(tick); tick = null; }
      paint();
    }, 200);
    paint();
  };
  /* A minute either way, running or stopped. The moment you need five more
     minutes is never the moment you want to be editing the page, so this
     changes what is LEFT; the length written into the block is untouched, and
     it is what Reset goes back to. */
  const shift = (delta) => {
    sync();
    left = Math.max(0, Math.min(3600, left + delta));
    if (tick) {
      /* Taking the last minute off a running clock is the same as the clock
         running out, so it ends here — rather than a fifth of a second later,
         with 00:00 already on the wall under a button still saying Pause. */
      if (left <= 0) { stop(); return; }
      until = Date.now() + left * 1000;
    }
    paint();
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b || !box.contains(b)) return;
    e.preventDefault(); e.stopPropagation();
    const act = b.getAttribute('data-act');
    if (act === 'run') { tick ? stop() : start(); return; }
    if (act === 'reset') { stop(); left = base(); paint(); return; }
    if (act === 'more') { shift(60); return; }
    if (act === 'less') { shift(-60); }
  });
  paint();
}
function tickMark() {
  const s = svg(16, 16);
  s.setAttribute('class', 'get-tick');
  s.innerHTML = '<path d="M2.5 8.6 6.4 12.4 13.5 4.2" fill="none" stroke="currentColor" '
    + 'stroke-width="1.8" stroke-linecap="square"/>';
  return s;
}
function arrowMark() {
  const s = svg(16, 16);
  s.setAttribute('class', 'get-arrow');
  s.innerHTML = '<path d="M8 1.5v8.5M4.6 6.6 8 10l3.4-3.4" fill="none" stroke="currentColor" '
    + 'stroke-width="1.6"/><path d="M2 13.6h12" fill="none" stroke="currentColor" stroke-width="1.6"/>';
  return s;
}
/* What is attached. A slip carries a hand-out, but it carries a folder of raw
   files just as well, so the mark says what the thing actually is: taken from
   the file's own ending, or said outright with `kind`. */
const ARCHIVE = /^(zip|rar|7z|tar|gz|tgz|sit)$/;
function fileKind(b) {
  if (b.kind) return String(b.kind).toUpperCase();
  if (b.folder) return 'FOLDER';
  /* the ending of whichever one is set; a share URL rarely has one, so a link
     with nothing to read falls back to LINK rather than claiming to be a file.
     fileExt also reads the media type of an embedded file, so a hand-out in the
     student copy still says PDF rather than losing its badge to FILE. */
  const e = fileExt(b);
  if (e) return e.toUpperCase();
  return (!b.file && b.link) ? 'LINK' : 'FILE';
}
function markShape(kind) {
  if (kind === 'FOLDER') return 'folder';
  if (ARCHIVE.test(kind.toLowerCase())) return 'archive';
  return 'page';
}
function pdfMark(b) {
  const kind = fileKind(b || {});
  const shape = markShape(kind);
  const w = el('span', 'pd-mark pd-mark-' + shape + (kind.length > 3 ? ' long' : ''));
  /* the mark is coloured by what the file actually is */
  w.dataset.kind = kind;
  const s = svg(26, 32);
  if (shape === 'folder') {
    s.innerHTML = '<path d="M1 6h9l3 4h12v21H1z" fill="none" stroke="currentColor" stroke-width="1.6"/>'
      + '<path d="M1 14h24" fill="none" stroke="currentColor" stroke-width="1.2"/>';
  } else if (shape === 'archive') {
    s.innerHTML = '<path d="M1 4h24v27H1z" fill="none" stroke="currentColor" stroke-width="1.6"/>'
      + '<path d="M1 11h24" fill="none" stroke="currentColor" stroke-width="1.2"/>'
      + '<path d="M11 4v7M15 4v7" fill="none" stroke="currentColor" stroke-width="1.2"/>';
  } else {
    s.innerHTML = '<path d="M1 1h15l9 9v21H1z" fill="none" stroke="currentColor" stroke-width="1.6"/>'
      + '<path d="M16 1v9h9" fill="none" stroke="currentColor" stroke-width="1.6"/>';
  }
  w.append(s);
  w.append(el('span', 'pd-mark-t', kind));
  return w;
}
function svg(w, h) {
  const n = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  n.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  n.setAttribute('width', w); n.setAttribute('height', h);
  n.setAttribute('aria-hidden', 'true');
  return n;
}

/* THE KEY A TICK IS REMEMBERED UNDER — the week, the page, and the words.
   Deliberately not the block's index: a checklist that moves up the page is the
   same checklist and its ticks should move with it. And deliberately the words,
   so that an instruction whose wording is changed starts unticked - it is a
   different instruction, and a tick against the old one would be a lie. */
function ckKey(node, text) {
  const step = node.closest && node.closest('.step');
  if (!step || !step.id) return null;
  const wk = (document.querySelector('[data-week-n]') || {}).getAttribute
    ? document.querySelector('[data-week-n]').getAttribute('data-week-n') : '';
  return 'ts2c:' + wk + ':' + step.id + ':'
       + String(text).replace(/\s+/g, ' ').trim().slice(0, 120);
}

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}

/* ============================================================
   A caption nobody wrote says so, on the page
   ------------------------------------------------------------
   Asking Claude for a caption used to put the words "Generated
   caption" into the block and mark the FIGURE, in edit mode
   only — so on the page, and in the room, and in the student's
   copy, a placeholder nobody had chosen read exactly like a
   caption Batu had written. A page must never quietly contain
   words nobody chose, so the caption itself carries the mark,
   in both modes: Claude's violet, italic, with Claude's spark
   in front of it. It goes back to ordinary grey the moment the
   applied round writes the real sentence and takes `gen` off.

   The spark lives here rather than in the editor so that a page
   shown with no editor loaded still has it.
   ============================================================ */
const AI_SPARK = '<path d="M8 0.8l1.5 4.4 4.4 1.5-4.4 1.5L8 12.6 6.5 8.2 2.1 6.7l4.4-1.5z"/>'
  + '<path d="M13 10.4l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>';

/* A picture in a set carries its own credit — three photographs by three
   people want three names. Shown ONE AT A TIME that picture is the whole
   block, and its credit is the only line under it, so the block prints the
   picture's own caption when it has none of its own. The credit stays on the
   picture where it was typed rather than being moved onto the block: moving it
   was what detached one photographer's name from their photograph and hung it
   under all three of them the moment you went back to a strip. */
function capEl(b) {
  const c = el('figcaption', null, b.caption || b.cap);
  if (b && b.gen && b.gen.what === 'caption') {
    c.classList.add('gen-cap');
    /* A caption Claude has WRITTEN and a caption Claude has been ASKED for are
       both violet, and they are not the same thing to the person standing in
       front of the room. `pending` is on the request and gone once the words
       come back, so the page can say which of the two this is — in edit mode,
       where the mark is printed after the words. */
    if (b.gen.pending) c.classList.add('gen-wait');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = AI_SPARK;
    c.prepend(svg);
  }
  return c;
}

/* ---------- block renderers ---------- */
/* ============================================================
   A slideshow steps because the renderer made it step
   ------------------------------------------------------------
   The stepping used to be attached once, on load, over whatever
   was on the page at that moment. Anything built afterwards — a
   slideshow dropped from the palette, a page rebuilt by the
   editor, the student's own copy — looked exactly right and did
   nothing at all when clicked, because nothing had ever wired it.

   Behaviour that belongs to one drawn thing is attached where
   that thing is drawn. Every route on to the page goes through
   the renderer, so every route now gets a working slideshow.
   ============================================================ */
function wireCarousel(fig) {
  const plates = [...fig.querySelectorAll('.car-plate')];
  const thumbs = [...fig.querySelectorAll('.car-thumb')];
  const count = fig.querySelector('.car-count');
  const stage = fig.querySelector('.car-stage');
  if (!plates.length || !stage) return fig;
  const pad = (n) => String(n).padStart(2, '0');
  let at = 0;
  function show(i) {
    at = (i + plates.length) % plates.length;
    plates.forEach((p, k) => p.classList.toggle('on', k === at));
    thumbs.forEach((t, k) => t.classList.toggle('on', k === at));
    if (count) count.textContent = pad(at + 1) + ' / ' + pad(plates.length);
  }
  /* the thumbs stop the click going further; the stage does not, so that in
     edit mode choosing the slideshow and stepping it are the same gesture */
  thumbs.forEach((t, i) => t.addEventListener('click', (e) => { e.stopPropagation(); show(i); }));
  stage.addEventListener('click', () => show(at + 1));
  fig._carousel = { next: () => show(at + 1), prev: () => show(at - 1), at: () => at };
  return fig;
}

const BLOCK = {
  line: (b) => el('p', 'line', b.html),
  lineBig: (b) => el('p', 'line big', b.html),
  desc: (b) => el('p', 'line desc', b.html),
  verdict: (b) => el('p', 'verdict', b.html),
  /* An aside, in one of three tempers: the plain technical note, a warning about
     something that will go wrong, and a tip worth passing on. Same shape, so the
     page stays calm; a different edge and a named label, so the room can tell at
     a glance which of the three it is being handed. */
  note: (b) => {
    const kind = b.kind === 'warning' || b.kind === 'tip' ? b.kind : '';
    const n = el('aside', 'note' + (kind ? ' ' + kind : ''));
    if (kind) n.append(el('span', 'note-k', kind === 'warning' ? 'Warning' : 'Tip'));
    const body = el('span', 'note-b', b.html);
    n.append(body);
    return n;
  },
  todo: (b) => el('p', 'todo' + (b.fix ? ' fix' : ''), b.html),

  /* ---- A tag. The lime REQUIRED chip from the assignment sheet, and the
     black/orange/outline variants beside it in the system. ---- */
  tag: (b) => {
    const n = el('span', 'tag tag-' + (b.tone || 'plain'), b.html || b.text || '');
    return n;
  },

  /* ---- An annotated photograph. The label sits in a column of its own, the
     value under it, and a hairline runs from the label out to a point on the
     picture. It is how a technical photograph is marked up on a sheet. ---- */
  annotate: (b) => {
    const box = el('div', 'annot');
    (b.marks || []).forEach((m) => {
      const row = el('div', 'annot-r' + (m.tone === 'signal' ? ' sig' : ''));
      row.append(el('span', 'annot-k', m.label || ''));
      row.append(el('span', 'annot-v', m.value || ''));
      const lead = el('span', 'annot-lead');
      lead.style.setProperty('--to', (m.at != null ? m.at : 60) + '%');
      row.append(lead);
      box.append(row);
    });
    return box;
  },

  /* ---- A specification sheet. The Govino card, and the Braun spec column:
     a ruled box, a name on the left, the figure hard right, a hairline between
     every line. It is how technical information is set when someone means it. ---- */
  sheet: (b) => {
    const box = el('div', 'sheet');
    const head = el('div', 'sheet-h');
    head.append(el('span', 'sheet-n', b.title || 'Specification'));
    if (b.kicker) head.append(el('span', 'sheet-k', b.kicker));
    box.append(head);
    (b.items || []).forEach((r) => {
      const line = el('div', 'sheet-r' + (r[2] ? ' ' + r[2] : ''));
      line.append(el('span', 'sheet-rk', r[0] || ''));
      line.append(el('span', 'sheet-rv', r[1] || ''));
      box.append(line);
    });
    return box;
  },

  /* ---- A section label. Every block in the design system is announced by a
     small monospaced line above it, and a rule under that. It is the device that
     makes a page read as structured rather than as a stack of things. ---- */
  label: (b) => {
    const n = el('p', 'sec-label' + (b.tone === 'quiet' ? ' quiet' : ''));
    n.append(el('span', 'sl-t', b.html || b.text || ''));
    return n;
  },

  /* ---- A number, at the size the number deserves. One figure, its unit set
     small beside it, and a monospaced line under saying what was measured. ---- */
  stat: (b) => {
    const box = el('div', 'stat');
    const v = el('p', 'stat-v');
    v.append(el('span', 'stat-n', b.value || '0'));
    if (b.unit) v.append(el('span', 'stat-u', b.unit));
    box.append(v);
    if (b.label) box.append(el('p', 'stat-l', b.label));
    if (b.html) box.append(el('p', 'stat-note', b.html));
    return box;
  },

  /* ---- A row of label and value, ruled. The way every specification in the
     system is set: the name on the left, the figure hard right, a hairline
     between each, so the column of figures can be read down. ---- */
  rows: (b) => {
    const box = el('div', 'datarows');
    if (b.title) box.append(el('p', 'sec-label', b.title));
    (b.items || []).forEach((r) => {
      const line = el('div', 'dr' + (r[2] ? ' ' + r[2] : ''));
      line.append(el('span', 'dr-k', r[0] || ''));
      line.append(el('span', 'dr-v', r[1] || ''));
      box.append(line);
    });
    if (b.caption) box.append(el('p', 'dr-cap', b.caption));
    return box;
  },

  /* ---- A definition. A lecture keeps stopping to say what a word means, and
     the room needs that in one shape every time: the word, what kind of word it
     is, where it comes from, and then the meaning at the length the moment can
     afford. Three lengths are written; one is shown. ---- */
  define: (b) => {
    const box = el('div', 'define');
    const head = el('p', 'def-head');
    head.append(el('span', 'def-term', b.term || 'Term'));
    if (b.kind) head.append(el('span', 'def-kind', b.kind));
    box.append(head);
    if (b.etym) box.append(el('p', 'def-etym', b.etym));
    const which = b.show || 'mid';
    const body = b[which] || b.mid || b.short || b.long || '';
    if (body) box.append(el('p', 'def-body', body));
    if (b.source) box.append(el('p', 'def-source', b.source));
    return box;
  },

  /* ---- Something to take away: a PDF on the page. Two kinds, because a set
     text and a hand-out are not the same object in a lecture. An E-BOOK is a
     book — it has a cover, an author and a title, and the cover is most of what
     tells you what it is. A DOCUMENT is a hand-out — a brief, a reading, a
     form — and what matters is its name, that it is a PDF, and how to get it.
     Each is drawn two ways; the week chooses with `variant`. ---- */
  ebook: (b) => {
    /* Two ways, now that Batu has chosen: `a` the shelf, and the plate for
       everything else — fixed width wrapping its own cover, monospace, and the
       hairline press. The four button designs were scaffolding for the choice;
       the hairline won and is the only one, here and on every attachment. Old
       data saying b1..b4 still opens, and lands on the plate. */
    const v = b.variant === 'a' ? 'a' : 'b1';
    const design = 1;
    const box = el('div', 'ebook eb-' + v + (v === 'a' ? '' : ' eb-plate'));
    const cover = el('div', 'eb-cover');
    if (b.cover) cover.append(img(b.cover, b.alt || (b.title ? b.title + ' — cover' : 'Cover')));
    else cover.append(el('span', 'eb-nocover', b.title || 'Cover'));
    const meta = el('div', 'eb-meta');
    meta.append(el('p', 'eb-kind', b.kind || 'E-book'));
    meta.append(el('h4', 'eb-title', b.title || 'Title'));
    if (b.author) meta.append(el('p', 'eb-author', b.author));
    const imprint = [b.publisher, b.year, b.pages ? b.pages + ' pp' : ''].filter(Boolean).join(' · ');
    if (imprint) meta.append(el('p', 'eb-imprint', imprint));
    meta.append(getBar(b, 'eb-get', design));
    box.append(cover, meta);
    if (b.caption) box.append(el('p', 'eb-cap', b.caption));
    return box;
  },

  pdf: (b) => {
    /* a — the slip. b — the proof. a1..a4 are the slip with the name above and
       the way to get it below rather than beside it, one per button design. */
    /* Said outright, or worked out from what is attached: a document — a PDF,
       a PSD, an InDesign file — gets the slip with its name above and the way
       to get it below. Everything else the week hands out — a zip of raw files,
       a TIFF, a folder — gets the compact one-line slip. `b` is the proof.
       Old data saying a2..a4 still opens, and lands on the chosen slip. */
    const DOCLIKE = /^(PDF|PSD|DOC|DOCX|INDD|AI|EPUB|TXT|RTF|PAGES|KEY)$/;
    const v = b.variant === 'b' ? 'b'
      : b.variant === 'a' ? 'a'
      : /^a[1-4]$/.test(b.variant || '') ? 'a1'
      : (DOCLIKE.test(fileKind(b)) ? 'a1' : 'a');
    const design = 1;
    const stacked = /^a[1-4]$/.test(v);
    const box = el('div', 'pdfdoc pd-' + v + (stacked ? ' pd-stack' : ''));
    if (v === 'b') {
      const page = el('div', 'pd-page');
      if (b.preview) page.append(img(b.preview, b.alt || (b.name ? b.name + ' — first page' : 'First page')));
      else page.append(el('span', 'pd-blank', ''));
      const badge = el('span', 'pd-badge', fileKind(b));
      badge.dataset.kind = fileKind(b);
      page.append(badge);
      box.append(page);
    } else {
      box.append(pdfMark(b));
    }
    const body = el('div', 'pd-body');
    body.append(el('p', 'pd-name', b.name || b.title || 'Document'));
    const meta = [b.pages ? b.pages + ' pp' : '', b.size, b.note].filter(Boolean).join(' · ');
    if (meta) body.append(el('p', 'pd-meta', meta));
    box.append(body);
    box.append(getBar(b, 'pd-get', design));
    if (b.caption) box.append(el('p', 'pd-cap', b.caption));
    return box;
  },

  /* An empty cell. It holds a column open so a structure can be chosen before
     there is anything to put in it. In the lecture itself it draws nothing and
     is not read out; while editing it is the place a block can be dropped. */
  slot: () => el('div', 'slot'),

  text: (b) => {
    const d = el('div', 'text');
    b.paras.forEach((t) => d.append(el('p', null, t)));
    return d;
  },

  /* prose explaining the format itself — part of the syntax layer */
  docs: (b) => {
    const d = el('div', 'docs');
    d.append(el('p', 'docs-h', 'Format'));
    b.paras.forEach((t) => d.append(el('p', null, t)));
    return d;
  },

  /* ---- A list, and everything a list can be ----
     One block type. Big is a setting on it, not a second kind. The marker,
     how far apart the lines sit and whether it is a checklist are settings
     too, because those are the things anyone actually wants to change about
     a list and there was no way to change any of them. */
  bul: (b) => {
    const u = el('ul', 'bul' + (b.big ? ' big' : '') + (b.two ? ' two' : '') + (b.colBreak ? ' colbreak' : ''));
    if (b.marker) u.setAttribute('data-marker', b.marker);
    if (b.gap) u.setAttribute('data-gap', b.gap);
    b.items.forEach((t) => {
      /* a plain string is a bullet; an object with `goto` jumps to the page
         that explains it, so an overview can be walked from the overview */
      if (typeof t === 'string') { u.append(el('li', null, t)); return; }
      /* A CHECKLIST LINE. The box is real: the student ticks it and their own
         browser remembers, and `done` in the content is only where it starts.

         There is no second block type for this. `marker: 'check'` was already
         in the panel, offered as "A checklist", and rendered a tick nobody
         could tick - an option that looked like the thing without being it.
         Adding a Checklist block beside it would have put two names on one
         shape, which is the fault this system spends most of its rules
         avoiding.

         The ticks go nowhere. Nothing is sent, nothing is recorded, and no one
         but the student can see them - so a checklist is safe on a page that is
         handed out, and it works in the handed-out copy for the same reason. */
      if (t.check !== undefined) {
        const li = el('li', 'tick');
        const lab = el('label');
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.className = 'ck-box';
        box.checked = !!t.done;
        lab.append(box, el('span', 'ck-t', t.check));
        li.append(lab);
        li.classList.toggle('done', box.checked);
        box.addEventListener('change', () => {
          li.classList.toggle('done', box.checked);
          try {
            const k = ckKey(li, t.check);
            if (k) localStorage.setItem(k, box.checked ? '1' : '0');
          } catch (e) { /* no storage: it still ticks, it just forgets */ }
        });
        /* the node is not in the page yet, so the key cannot be read here */
        requestAnimationFrame(() => {
          try {
            const k = ckKey(li, t.check);
            const v = k && localStorage.getItem(k);
            if (v === null || v === undefined) return;   // never touched
            box.checked = v === '1';
            li.classList.toggle('done', box.checked);
          } catch (e) {}
        });
        u.append(li);
        return;
      }
      const li = el('li', 'jump');
      const a = el('button', 'jump-btn', t.label);
      a.type = 'button';
      a.setAttribute('data-goto', t.goto);
      li.append(a);
      u.append(li);
    });
    return u;
  },

  /* three named things you open one at a time */
  reveal3: (b) => {
    const d = el('div', 'reveal3');
    b.items.forEach((i, k) => {
      const card = el('div', 'r3' + (k === 0 ? ' on' : ''));
      const btn = el('button', 'r3-btn');
      btn.type = 'button';
      btn.setAttribute('aria-expanded', k === 0 ? 'true' : 'false');
      btn.append(el('b', null, i.name));
      if (i.lead) btn.append(el('span', 'r3-lead', i.lead));
      btn.append(el('span', 'r3-mark', ''));
      card.append(btn);
      card.append(el('div', 'r3-body', i.detail));
      d.append(card);
    });
    return d;
  },
  bulBig: (b) => BLOCK.bul({ ...b, big: true }),

  two: (b) => grid(b, 'two-up'),
  three: (b) => grid(b, 'three'),
  four: (b) => grid(b, 'four'),
  five: (b) => grid(b, 'five'),

  card: (b) => {
    const p = el('p', 'line card', b.html);
    if (b.cc) p.style.setProperty('--cc', b.cc);
    return p;
  },

  formula: (b) => {
    const p = el('p', 'formula', b.html);
    if (b.note) p.append(el('span', 'fnote', b.note));
    return p;
  },

  spec: (b) => {
    const t = el('table', 'spec');
    if (b.caption) {
      const cap = el('caption', 'figno-table', b.caption);
      t.append(cap);
    }
    b.rows.forEach(([k, v, cls]) => {
      const tr = el('tr');
      tr.append(el('td', null, k));
      tr.append(el('td', cls || null, v));
      t.append(tr);
    });
    return t;
  },

  steplist: (b) => {
    const ol = el('ol');
    ol.style.cssText = 'list-style:none;margin:14px 0 0;padding:0;border-top:1px solid var(--rule)';
    b.steps.forEach((s, i) => {
      const li = el('li', 'procstep');
      li.append(el('span', 'pn', String(i + 1).padStart(2, '0')));
      const body = el('div');
      body.append(el('span', 'pt', s.title));
      if (s.detail) body.append(el('span', 'pd', s.detail));
      if (s.value) body.append(el('span', 'pv', s.value));
      li.append(body);
      ol.append(li);
    });
    return ol;
  },

  takeaway: (b) => {
    const d = el('div', 'takeaway');
    d.append(el('h3', null, b.title));
    const ol = el('ol');
    b.items.forEach((t) => ol.append(el('li', null, t)));
    d.append(ol);
    return d;
  },

  brief: (b) => {
    const s = el('section', 'brief');
    const bar = el('div', 'brief-bar');
    bar.append(el('span', null, b.code + ' — Assignment'));
    if (b.due) bar.append(el('span', 'due', 'Due ' + b.due));
    s.append(bar);
    const body = el('div', 'brief-body');
    body.append(el('h3', null, b.title));
    if (b.brief) body.append(el('p', null, b.brief));
    if (b.criteria) {
      body.append(el('div', 'brief-h', 'Assessed on'));
      const ul = el('ul', 'brief-crit');
      b.criteria.forEach((c) => ul.append(el('li', null, '<span>+</span>' + c)));
      body.append(ul);
    }
    if (b.deliverables) {
      const row = el('div', 'brief-del');
      b.deliverables.forEach((d) => row.append(el('span', 'tagx', d)));
      body.append(row);
    }
    s.append(body);
    return s;
  },

  figure: (b) => {
    const f = el('figure', 'slide' + (b.cls ? ' ' + b.cls : ''));
    if (b.fig) f.setAttribute('data-fig', b.fig === true ? '' : b.fig);
    f.setAttribute('data-layout', b.layout || 'stacked');
    f.append(b.src ? img(b.src, b.alt, b.ar) : phBox(b.label || 'Plate', b.shape || ''));
    if (b.caption || b.cap) f.append(capEl(b));
    return f;
  },

  gallery: (b) => {
    const f = el('figure', 'slide gallery');
    f.setAttribute('data-layout', b.layout || 'stacked');
    if (b.title) f.setAttribute('data-title', b.title);
    const strip = el('div', 'strip');
    b.images.forEach((i) => strip.append(cell(i, i.src ? img(i.src, i.alt, i.ar) : phBox(i.label || '', ''))));
    f.append(strip);
    if (b.caption) f.append(capEl(b));
    return f;
  },

  /* Several groups of work on one page — one row each, caption under the row.
     Clicking a photograph opens it in the page's own lightbox. */
  stack: (b) => {
    const f = el('figure', 'slide stack');
    /* The name of the set, for the corner of the enlargement — a gallery and a
       slideshow have carried it here for months and a group did not, so a
       group was the one way of showing pictures whose title could be typed and
       never appeared anywhere. */
    if (b.title) f.setAttribute('data-title', b.title);
    b.rows.forEach((row) => {
      const g = el('div', 'stk-row');
      const strip = el('div', 'strip');
      if (row.title) g.setAttribute('data-title', row.title);
      row.images.forEach((i) => strip.append(cell(i, i.src ? img(i.src, i.alt, i.ar) : phBox(i.label || '', ''))));
      g.append(strip);
      if (row.caption) g.append(el('p', 'stk-cap', row.caption));
      f.append(g);
    });
    if (b.caption) f.append(capEl(b));
    return f;
  },

  carousel: (b) => {
    const f = el('figure', 'slide carousel');
    f.setAttribute('data-layout', b.layout || 'stacked');
    if (b.title) f.setAttribute('data-title', b.title);
    const stage = el('div', 'car-stage');
    const rail = el('div', 'car-rail');
    b.images.forEach((i, k) => {
      const plate = i.src ? img(i.src, i.alt) : phBox(i.label || '', '');
      plate.classList.add('car-plate');
      if (k === 0) plate.classList.add('on');
      stage.append(plate);
      const th = el('button', 'car-thumb' + (k === 0 ? ' on' : ''));
      th.type = 'button';
      th.setAttribute('aria-label', 'Plate ' + (k + 1));
      const ti = i.src ? img(i.src, '') : phBox('', '');
      th.append(ti);
      rail.append(th);
    });
    const count = el('span', 'car-count', '01 / ' + String(b.images.length).padStart(2, '0'));
    stage.append(count);
    f.append(stage, rail);
    if (b.caption) f.append(capEl(b));
    return wireCarousel(f);
  },

  trio: (b) => {
    const f = el('figure', 'slide trio');
    f.setAttribute('data-layout', b.layout || 'stacked');
    const tri = el('div', 'tri');
    const big = b.big.src ? img(b.big.src, b.big.alt) : phBox(b.big.label || '', '');
    big.classList.add('big');
    tri.append(big);
    b.small.forEach((i) => tri.append(i.src ? img(i.src, i.alt) : phBox(i.label || '', '')));
    f.append(tri);
    if (b.caption) f.append(capEl(b));
    return f;
  },

  /* SCHEDULE
     One lesson plan, several class groups. The plan is written once; each
     class carries only what actually differs — its day and its times. A
     button per class switches the table, which is why the plan is not
     repeated three times on the page.
       plan:    ['Introduction', 'Break*', 'The Test', …]   * marks a break
       classes: [{ name, group, when, times: [...] }]        aligned to plan
     A class may instead carry its own `rows` when its plan really differs. */
  schedule: (b) => {
    const wrap = el('div', 'schedule');
    const plan = b.plan || [];

    const tabs = el('div', 'sc-tabs');
    const bodies = el('div', 'sc-bodies');

    (b.classes || []).forEach((c, i) => {
      const btn = el('button', 'sc-tab');
      btn.type = 'button';
      btn.setAttribute('aria-current', String(i === 0));
      btn.setAttribute('data-sc', String(i));
      btn.append(el('span', 'nm', c.name));
      if (c.group) btn.append(el('span', 'gp', c.group));
      tabs.append(btn);

      const body = el('div', 'sc-body');
      body.setAttribute('data-sc', String(i));
      if (i !== 0) body.setAttribute('hidden', '');
      body.append(el('p', 'when', c.when));

      const t = el('table', 'plan sc-plan');
      const rows = c.rows || plan.map((what, k) => {
        const brk = /\*$/.test(what);
        return [(c.times || [])[k] || '', brk ? what.replace(/\*$/, '') : what, brk ? 'brk' : null];
      });
      /* Duration is derived from the next row's clock, never written by hand:
         a schedule that states both is a schedule that can contradict itself.
         The last row is an end marker and has no duration. */
      const mins = (hhmm) => {
        const m = /^(\d{1,2}):(\d{2})$/.exec((hhmm || '').trim());
        return m ? (+m[1]) * 60 + (+m[2]) : null;
      };
      /* Three real columns — clock, duration, name — so the durations align
         under each other and the name starts at one consistent left edge
         instead of drifting with the width of the cell before it. */
      rows.forEach(([time, what, cls], k) => {
        const tr = el('tr', cls === 'brk' ? 'brk' : null);
        tr.append(el('td', 'sc-time', time));
        const a = mins(time);
        const b = mins((rows[k + 1] || [])[0]);
        tr.append(el('td', 'sc-dur', a != null && b != null && b > a ? (b - a) + ' min' : ''));
        tr.append(el('td', 'sc-what', what));
        t.append(tr);
      });
      body.append(t);
      bodies.append(body);
    });

    wrap.append(tabs, bodies);
    return wrap;
  },

  timetable: (b) => {
    const wrap = el('div', 'timetable');
    b.groups.forEach((g) => {
      const grp = el('div', 'tt-group' + (g.pt ? ' pt' : ''));
      grp.append(el('p', 'tt-h', g.label));
      const cols = el('div', 'cols');
      g.cols.forEach((c) => {
        const one = el('div', 'grp');
        one.append(el('h4', null, c.name));
        one.append(el('p', 'when', c.when));
        const t = el('table', 'plan');
        c.rows.forEach(([time, what, cls]) => {
          const tr = el('tr', cls === 'brk' ? 'brk' : null);
          tr.append(el('td', null, time));
          tr.append(el('td', null, what));
          t.append(tr);
        });
        one.append(t);
        cols.append(one);
      });
      grp.append(cols);
      wrap.append(grp);
    });
    return wrap;
  },

  /* A written instrument keeps the room it was given. The rule used to be that
     the moment an instrument was written the block became a `demo` and the sizes
     went away - which is why every instrument took the full width whether it
     needed it or not, and it was Batu's own complaint. The brief stops being a
     specification the moment it is built; it becomes a setting. */
  demo: (b) => {
    const f = el('figure', 'demo');
    f.setAttribute('data-demo', b.id);
    f.setAttribute('data-size', b.size || 'column');
    if (b.shape) f.setAttribute('data-shape', b.shape);
    if (b.pos && (b.size || 'column') !== 'column') f.setAttribute('data-pos', b.pos);
    if (b.fullscreen) f.setAttribute('data-fullscreen', '');
    const cap = el('figcaption');
    if (b.fig) cap.append(el('span', 'figno', 'Fig. ' + b.fig));
    if (b.caption) cap.insertAdjacentHTML('beforeend', ' ' + b.caption);
    f.append(cap);
    return f;
  },

  /* ---- text ---- */
  quote: (b) => {
    const f = document.createDocumentFragment();
    f.append(el('p', 'quote', b.html));
    if (b.who) f.append(el('p', 'who', b.who));
    return f;
  },

  /* ---- moving image ----------------------------------------
     A YouTube or Vimeo link becomes a privacy-friendly embed:
     nothing loads until the poster is clicked, so opening a
     lecture does not phone a video host on every page. ---- */
  video: (b) => {
    const slot = el('div', 'video-slot' + (b.cls ? ' ' + b.cls : ''));
    const ratio = el('div', 'ratio');
    const id = videoId(b.url || b.id || '');
    if (!id) {
      const ph = el('div', 'placeholder');
      ph.append(el('p', 'ui', b.label || 'A video is embedded here'));
      ph.append(el('p', 'mono', 'iframe · 16:9'));
      ratio.append(ph);
      slot.append(ratio);
      const empty = document.createElement('div');
      empty.className = 'video-block';
      empty.append(slot);
      return empty;
    }
    const poster = el('button', 'video-poster');
    poster.type = 'button';
    poster.setAttribute('aria-label', 'Play ' + (b.title || 'video'));
    if (id.kind === 'youtube') {
      const thumb = el('img');
      thumb.src = 'https://i.ytimg.com/vi/' + id.id + '/hqdefault.jpg';
      thumb.alt = '';
      poster.append(thumb);
    }
    poster.append(el('span', 'play', '▶'));
    poster.addEventListener('click', () => {
      const frame = el('iframe');
      frame.src = id.kind === 'youtube'
        ? 'https://www.youtube-nocookie.com/embed/' + id.id + '?autoplay=1&rel=0&modestbranding=1'
        : 'https://player.vimeo.com/video/' + id.id + '?autoplay=1';
      frame.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      frame.setAttribute('allowfullscreen', '');
      frame.setAttribute('title', b.title || 'Video');
      frame.setAttribute('frameborder', '0');
      poster.replaceWith(frame);
    });
    ratio.append(poster);
    slot.append(ratio);
    const wrap = document.createElement('div');
    wrap.className = 'video-block';
    wrap.append(slot);
    if (b.title) wrap.append(el('p', 'video-title', b.title));
    if (b.caption) wrap.append(el('p', 'video-cap', b.caption));
    return wrap;
  },

  /* ---- image variants ---- */
  /* The picture and its cover share a frame that is the size of the picture, so
     the grey stands exactly where the image will appear — not over the whole slot
     with the image cropped inside it. */
  /* ---- a clock the room can see ----------------------------------------
     The countdown already existed, welded to `reveal` — click a hidden plate,
     it shows for fifteen seconds and hides again. An exercise is not fifteen
     seconds, so this is the same mechanism as its own object: minutes and
     seconds, stoppable, and changeable at the lectern without going near the
     editor, because the moment you need five more minutes is never the moment
     you want to be editing a page. */
  timer: (b) => {
    const total = Math.max(5, parseInt(b.seconds, 10) || 300);
    const f = el('div', 'timerbox' + (b.cls ? ' ' + b.cls : ''));
    f.setAttribute('data-seconds', total);
    if (b.label) f.append(el('p', 'timer-lab', b.label));
    f.append(el('div', 'timer-num', clockFace(total)));
    const bar = el('div', 'timer-bar');
    [['less', '− 1 min'], ['more', '+ 1 min'],
     ['run', 'Start'], ['reset', 'Reset']].forEach(([act, word]) => {
      const btn = el('button', 'timer-b timer-' + act, word);
      btn.type = 'button';
      btn.setAttribute('data-act', act);
      bar.append(btn);
    });
    f.append(bar);
    if (b.caption) f.append(capEl(b));
    wireTimer(f);
    return f;
  },

  /* ---- a hole in the page, and what is meant to fill it -----------------
     Batu lays a page out before its content exists. This is the shape of the
     thing that is coming: give it a place and a size like any other block, say
     what it should be, and the page can be composed around it. It is written
     in the colour a generated thing is written in, so it is never mistaken for
     something that is finished. */
  generate: (b) => {
    const f = el('div', 'genbox');
    const head = el('div', 'gen-head');
    head.append(aiMark());
    head.append(el('span', 'gen-tag', 'To be generated'));
    f.append(head);
    f.append(el('p', 'gen-what', b.what || 'Say what should go here.'));
    if (b.caption) f.append(capEl(b));
    return f;
  },

  reveal: (b) => {
    const f = el('figure', 'slide reveal');
    f.setAttribute('data-seconds', b.seconds || 15);
    const frame = el('div', 'reveal-frame');
    frame.append(b.src ? img(b.src, b.alt) : phBox(b.label || 'Hidden plate', 'wide'));
    frame.append(el('div', 'cover', b.cover || 'Click to reveal.'));
    f.append(frame);
    f.append(el('span', 'timer', (b.seconds || 15) + 's'));
    if (b.caption) f.append(capEl(b));
    return f;
  },

  pair: (b) => {
    const f = el('figure', 'slide pair');
    f.setAttribute('data-layout', b.layout || 'stacked');
    if (b.fig) f.setAttribute('data-fig', b.fig === true ? '' : b.fig);
    const duo = el('div', 'duo');
    b.images.forEach((i) => duo.append(i.src ? img(i.src, i.alt) : phBox(i.label || '', '')));
    f.append(duo);
    if (b.caption) f.append(capEl(b));
    return f;
  },
  grid2: (b) => BLOCK.pair(b),

  doc: (b) => {
    const f = el('figure', 'slide doc' + (b.mark ? ' marked mark-' + b.mark : ''));
    f.append(b.src ? img(b.src, b.alt, b.ar) : phBox(b.label || 'Document scan', 'wide'));
    if (b.mark) f.append(el('span', 'doc-mark'));
    if (b.caption || b.cap) f.append(capEl(b));
    return f;
  },

  /* A QR carries no caption: the room scans it or types the link printed beneath
     it, and a line of prose under a code is read by nobody. */
  qr: (b) => {
    const f = el('figure', 'slide qr');
    f.append(b.src ? img(b.src, b.alt) : phBox(b.label || 'QR code', 'square'));
    /* A QR code is unreadable to anyone not holding a phone at it, so the
       caption is the only thing that says where it goes. It was the one
       evidence block that silently dropped it. */
    if (b.caption || b.cap) f.append(capEl(b));
    return f;
  },

  svg: (b) => {
    const f = el('figure', 'slide icons');
    f.insertAdjacentHTML('afterbegin', b.svg);
    if (b.caption) f.append(capEl(b));
    return f;
  },

  /* ---- tables ---- */
  plan: (b) => planTable(b, 'plan'),
  scen: (b) => planTable(b, 'plan scen'),
  sem: (b) => planTable(b, 'plan sem'),

  /* ---- reference devices ---- */
  zones: (b) => {
    const f = document.createDocumentFragment();
    const strip = el('div', 'zonestrip');
    const labels = el('div', 'zonelabels');
    ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].forEach((z, i) => {
      const sp = el('span', (b.mark || []).includes(i) ? 'mark' : null);
      sp.style.background = 'var(--zone-' + i + ')';
      strip.append(sp);
      labels.append(el('span', null, z));
    });
    f.append(strip, labels);
    return f;
  },

  biglink: (b) => {
    const p = el('p', 'line' + (b.big ? ' big' : ''));
    const a = el('a', 'biglink', b.label || b.href);
    a.href = b.href;
    a.target = '_blank';
    a.rel = 'noopener';
    if (b.before) p.insertAdjacentHTML('afterbegin', b.before + ' ');
    p.append(a);
    return p;
  },

  /* An instrument that has not been written yet. The placeholder is its brief:
     it reserves the shape the instrument will have, so the page can be built and
     read before the thing exists, and it carries what the instrument is meant to
     teach so nobody has to remember. When the real one lands it becomes a `demo`
     and the size is the instrument's own. */
  demoPlaceholder: (b) => {
    const f = el('figure', 'demo ph-spec');
    f.setAttribute('data-size', b.size || 'column');
    f.setAttribute('data-shape', b.shape || 'landscape');
    if (b.pos && b.size && b.size !== 'column') f.setAttribute('data-pos', b.pos);
    const stage = el('div', 'stage wide');
    const ph = el('div', 'ph');
    ph.append(el('span', 'ph-label', b.label || 'Interactive'));
    const spec = [
      /* the floor it needs, in the words the panel asks the question in */
      ({ third: 'a third of the page', half: 'half the page',
         column: 'the full text column', bleed: 'edge to edge',
         page: 'its own page',
         /* what content written before these names says */
         full: 'the full text column', l: 'the full text column',
         m: 'half the page', s: 'a third of the page' })[b.size || 'column'],
      ({ landscape: 'landscape', square: 'square', portrait: 'portrait' })[b.shape || 'landscape'],
    ];
    if (b.fullscreen) spec.push('opens full screen');
    ph.append(el('span', 'ph-spec-line', spec.join(' · ')));
    if (b.brief) ph.append(el('p', 'ph-brief', b.brief));
    stage.append(ph);
    f.append(stage);
    const cap = el('figcaption');
    if (b.fig) cap.append(el('span', 'figno', 'Fig. ' + b.fig));
    if (b.caption) cap.insertAdjacentHTML('beforeend', ' ' + b.caption);
    f.append(cap);
    return f;
  },
};

/* youtu.be/ID · watch?v=ID · embed/ID · vimeo.com/ID · a bare id */
function videoId(url) {
  const y = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  if (y) return { kind: 'youtube', id: y[1] };
  const v = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (v) return { kind: 'vimeo', id: v[1] };
  if (/^[\w-]{11}$/.test(url)) return { kind: 'youtube', id: url };
  return null;
}

function phBox(label, cls) {
  return el('div', 'ph' + (cls ? ' ' + cls : ''), label);
}

function planTable(b, cls) {
  const t = el('table', cls);
  if (b.head) {
    const tr = el('tr');
    b.head.forEach((h) => tr.append(el('th', null, h)));
    t.append(tr);
  }
  b.rows.forEach((row) => {
    const cells = Array.isArray(row) ? row : row.cells;
    const rowCls = Array.isArray(row) ? null : row.cls;
    const tr = el('tr', rowCls);
    cells.forEach((c, i) => {
      /* the last column of a reveal table is an answer: hidden until asked
         for, so the room proposes before it is told */
      if (b.reveal && i === cells.length - 1) {
        const td = el('td', 'answer');
        const btn = el('button', 'reveal-btn');
        btn.type = 'button';
        btn.setAttribute('aria-expanded', 'false');
        btn.append(el('span', 'ask', 'Reveal'));
        btn.append(el('span', 'ans', c));
        td.append(btn);
        tr.append(td);
      } else {
        tr.append(el('td', null, c));
      }
    });
    t.append(tr);
  });
  if (b.reveal) t.classList.add('reveal');
  return t;
}

function grid(b, cls) {
  const d = el('div', cls + (b.mono ? ' mono-names' : '') + (b.wide ? ' wide' : ''));
  b.items.forEach((i) => {
    const cell = el('div');
    if (i.n) cell.append(el('span', 'n', i.n));
    cell.append(el('b', null, i.name));
    /* when the thing runs — a module's weeks, sitting under its name */
    if (i.when) cell.append(el('span', 'when', i.when));
    if (i.desc) cell.append(el('span', null, i.desc));
    d.append(cell);
  });
  return d;
}

/* ---- a picture in a set, with its own caption if it has been given one ----
   A strip of four photographs by four people wants four credits, not one line
   holding all of them. The caption is optional: a picture without one is
   rendered exactly as it was before, so no page that does not use this
   changes at all. */
function cell(i, node) {
  if (!i || !i.cap) return node;
  const c = el('div', 'cell');
  c.append(node);
  c.append(el('p', 'cell-cap', i.cap));
  return c;
}

function img(src, alt, ar) {
  const i = el('img');
  i.src = (/^(https?:|\.|\/)/.test(src) ? src : asset(src));
  i.alt = alt || '';
  if (ar) i.setAttribute('data-ar', ar);
  return i;
}

/* An element whose entire content is a syntax snippet is hidden with it,
   rather than leaving an empty paragraph behind. */
function markSyntaxOnly(scope) {
  scope.querySelectorAll('.text p, p.todo, p.line, li').forEach((n) => {
    const spans = [...n.querySelectorAll(':scope > .syntax')];
    if (!spans.length) return;
    const own = n.textContent.trim();
    const inSpans = spans.map((s) => s.textContent.trim()).join('').trim();
    if (own && own.replace(/[\s—·.,]/g, '') === inSpans.replace(/[\s—·.,]/g, '')) {
      n.classList.add('syntax-only');
    }
  });
}

/* ---------- page assembly ---------- */
/* One step → one .step element. Used by render() and by edit mode, which
   rebuilds a single page after a change. Every block node carries data-bi,
   its index in st.blocks, so an element on the page maps back to its data. */
/* ============================================================
   Arrangement — rows of items, each with a width and an alignment
   ------------------------------------------------------------
   The eleven layouts sort blocks into two fixed slots by type. An
   arranged page instead does what its manuscript says: every block
   names the row it belongs to, how wide it is and where it sits in
   that row. Widths snap to sixths of the page, so a page can be
   arranged freely without being able to come out off-measure.

   `y` nudges an item down (or up, if negative) in grid steps, for
   the times a picture wants to sit a little lower than its
   neighbour.
   ============================================================ */
/* ============================================================
   Two ways a page can be arranged
   ------------------------------------------------------------
   FITTED — the default. Rows, the columns in them, the items in
   those. Everything shares: widen one column and its neighbour
   narrows, make a row taller and the others give up the height.
   Nothing can overlap and nothing can be left behind.

   FREE — the same twelve columns and eight rows, but drawn
   rather than shared. Each block holds a rectangle on that grid
   and keeps it; moving one leaves the others where they are.
   It snaps to the grid, so a free page is still on the format.

   Fitted is right for a page that has to hold together as the
   words change. Free is right when you know exactly where a
   thing goes and want it to stay there.
   ============================================================ */
const GRID_X = 12, GRID_Y = 8;

/* The attributes a picture sets on its own content node that the WRAPPER has to
   carry, because the stylesheet reads them off the wrapper. One list, used by
   both arrangements — arrange() and arrangeFree() — so a new one can never be
   added to one and forgotten in the other. That is exactly how "fill the whole
   page" came to tick a box and do nothing: data-bleed was set on the picture
   and never copied out, so no bleed rule could ever match.
   Read by lecture.css: the crop block (.pg-item[data-fit], [data-pos]) and the
   bleed block (.pg-item[data-bleed]). */
/* `data-card` is here because the criteria page divides ONE cell between the
   official wording and what it asks of you, so the mark that says which of
   the two is the wording has to survive the move from the block's node onto
   the item the stylesheet actually places. */
/* `data-align` is the words' own ranging - left, centre, right - written on
   the block by the format bar. It is lifted onto the item like the rest so
   the rule that reads it does not have to know which of the two elements a
   given block put it on. */
const ITEM_ATTRS = ['data-fit', 'data-pos', 'data-bleed', 'data-fill', 'data-nogrow', 'data-card', 'data-align'];

function arrangeFree(step, st) {
  const placed = [...step.children].filter((n) => n.classList && n.classList.contains('pg-placed'));
  if (!placed.length) return;
  const box = el('div', 'pg-rows pg-free');
  placed.forEach((n) => {
    const item = el('div', 'pg-item pg-fitem');
    const g = n._g || {};
    const x = Math.max(1, Math.min(GRID_X, g.x || 1));
    const y = Math.max(1, Math.min(GRID_Y, g.y || 1));
    const w = Math.max(1, Math.min(GRID_X - x + 1, g.w || GRID_X));
    const h = Math.max(1, Math.min(GRID_Y - y + 1, g.h || 1));
    item.style.gridColumn = x + ' / span ' + w;
    item.style.gridRow = y + ' / span ' + h;
    item.setAttribute('data-gx', x); item.setAttribute('data-gy', y);
    item.setAttribute('data-gw', w); item.setAttribute('data-gh', h);
    ITEM_ATTRS.forEach((a) => { if (n.hasAttribute(a)) item.setAttribute(a, n.getAttribute(a)); });
    n.classList.remove('pg-placed');
    item.append(n);
    box.append(item);
  });
  step.append(box);
  step.classList.add('arranged', 'free');
}

function arrange(step) {
  const placed = [...step.children].filter((n) => n.classList && n.classList.contains('pg-placed'));
  if (!placed.length) return;
  const rowsBox = el('div', 'pg-rows');
  /* Where the whole stack sits inside the frame — the outermost container.
     Read off the step, because it belongs to the page and not to any one row. */
  const pageAlign = step.getAttribute('data-page-align');
  if (pageAlign) rowsBox.setAttribute('data-align', pageAlign);
  const pageSpread = step.getAttribute('data-page-spread');
  if (pageSpread) rowsBox.setAttribute('data-spread', pageSpread);
  const pageGap = step.getAttribute('data-row-gap');
  if (pageGap) rowsBox.setAttribute('data-gap', pageGap);

  /* row → column → the items stacked in it. The column is the level that was
     missing: it is what you resize, what you align things inside, and what you
     add an item to without touching the one beside it. */
  const byRow = new Map();
  placed.forEach((n) => {
    const r = +(n.getAttribute('data-place-row') || 1);
    const c = +(n.getAttribute('data-place-col') || 1);
    if (!byRow.has(r)) byRow.set(r, new Map());
    const cols = byRow.get(r);
    if (!cols.has(c)) cols.set(c, []);
    cols.get(c).push(n);
  });

  [...byRow.keys()].sort((a, b) => a - b).forEach((r) => {
    const row = el('div', 'pg-row');
    const cols = byRow.get(r);
    /* Everything a ROW is told is stored on the blocks in it, and any one of
       them may carry it — the author sets a row's height by dragging whichever
       block is under the pointer, and that is rarely the first one. So the row
       asks all of its blocks, not only the first. */
    const inRow = [...cols.keys()].sort((a, b) => a - b)
      .reduce((a, k) => a.concat(cols.get(k)), []);
    const rowAttr = (name) => {
      const hit = inRow.find((n) => n.hasAttribute(name));
      return hit ? hit.getAttribute(name) : null;
    };
    const rowHas = (name) => inRow.some((n) => n.hasAttribute(name));
    const firstOfRow = inRow[0];
    const rg = rowAttr('data-gap');
    if (rg) row.setAttribute('data-gap', rg);
    /* how the pictures across this row are levelled — the row's business,
       because levelling is a comparison between columns, not inside one */
    const lvl = rowAttr('data-lvl');
    if (lvl) row.setAttribute('data-lvl', lvl);
    const rh = rowAttr('data-rh');
    if (rh) row.setAttribute('data-rh', rh);
    /* how much of the page's height this row was given, in eighths */
    /* A row that has been given a height is not also the row that takes
       whatever is left: the two instructions contradict each other, and which
       one won depended on the order of two rules in the stylesheet. */
    /* A row's share of the page. Set on the element rather than left to the
       stylesheet: a percentage flex-basis would not resolve, a percentage
       height was outranked, and the row kept its content height either way.
       An inline height is the one thing nothing else can answer first. */
    const hgt = rowAttr('data-hgt');
    if (hgt) {
      row.setAttribute('data-hgt', hgt);
      row.removeAttribute('data-rgrow');
      /* the pixels are worked out after layout, by TS2_SIZE_ROWS in shell.js —
         a percentage has nothing definite to resolve against here */
      row.style.flex = '0 0 auto';
      row.style.minHeight = '0';
    }
    const rv = rowAttr('data-rv');
    if (rv) row.setAttribute('data-rv', rv);
    if (rowHas('data-rgrow')) row.setAttribute('data-rgrow', '');
    if (rowHas('data-ruled')) row.setAttribute('data-ruled', '');
    [...cols.keys()].sort((a, b) => a - b).forEach((c) => {
      const items = cols.get(c);
      const col = el('div', 'pg-col');
      /* a column's width and alignment are read from its first item, so one
         control in the panel sets the whole column */
      const first = items[0];
      col.setAttribute('data-w', first.getAttribute('data-w') || 'full');
      const hAlign = first.getAttribute('data-h');
      if (hAlign) col.setAttribute('data-h', hAlign);
      const vAlign = first.getAttribute('data-v');
      if (vAlign) col.setAttribute('data-v', vAlign);
      const ig = first.getAttribute('data-igap');
      if (ig) col.setAttribute('data-igap', ig);
      /* which way this container lays its items out, and whether it fills the
         height it has been given rather than sitting at the top of it */
      const dir = first.getAttribute('data-dir');
      if (dir) col.setAttribute('data-dir', dir);
      if (first.hasAttribute('data-fillh')) col.setAttribute('data-fillh', '');
      const y = first.style.getPropertyValue('--pg-y');
      if (y) col.style.setProperty('--pg-y', y);
      /* One block is not always one element. A quotation is the words and
         the name beneath them; both carry the same block number. Seating
         them as two items gave the page two of everything — two borders,
         two grips, two sets of handles — and selecting the words lit both.
         Consecutive nodes from the same block are one item. */
      const groups = [];
      items.forEach((n) => {
        const bi = n.getAttribute('data-bi');
        const last = groups[groups.length - 1];
        if (last && bi != null && last.bi === bi) last.nodes.push(n);
        else groups.push({ bi: bi, nodes: [n] });
      });
      groups.forEach((grp) => {
        const n = grp.nodes[0];
        /* Whether this is the only thing in its column decides whether a
           picture hugs its own width or takes the column's. It used to be read
           off `:only-child`, which the editor breaks the moment it puts a name
           tab or a bar into the column — so a photograph changed size purely
           because something had been selected. It is settled here, once, from
           the content. */
        const item = el('div', 'pg-item' + (groups.length === 1 ? ' pg-solo' : ''));
        ITEM_ATTRS.forEach((a) => { if (n.hasAttribute(a)) item.setAttribute(a, n.getAttribute(a)); });
        /* An item may set its own place inside the column, overruling the
           column's: its own alignment across, its own width, its own nudge. */
        const ih = n.getAttribute('data-ih');
        if (ih) item.setAttribute('data-h', ih);
        const iw = n.getAttribute('data-iw');
        if (iw) item.setAttribute('data-w', iw);
        const iy = n.style.getPropertyValue('--pg-iy');
        if (iy) item.style.setProperty('--pg-y', iy);
        /* how much of its column this one item takes, in eighths */
        const ihgt = n.getAttribute('data-ihgt');
        if (ihgt) item.setAttribute('data-ihgt', ihgt);
        /* the one item in the row that was told to take the height left over.
           The row grows; this says which of the things in it grows with it,
           so a caption beside a photograph does not share the space. */
        if (n.hasAttribute('data-cangrow')) item.setAttribute('data-grow', '');
        if (n.hasAttribute('data-iv')) item.setAttribute('data-v', n.getAttribute('data-iv'));
        grp.nodes.forEach((x) => { x.classList.remove('pg-placed'); item.append(x); });
        col.append(item);
      });
      row.append(col);
    });
    rowsBox.append(row);
  });
  step.append(rowsBox);
  step.classList.add('arranged');
}

/* ============================================================
   Every page is arranged
   ------------------------------------------------------------
   A page written before placement existed named a layout and
   nothing else, and the eleven layouts deal blocks into two
   fixed slots BY TYPE: every picture to one side, every word to
   the other. That is why moving a block up or down changed the
   file and nothing on the screen, and why the alignment controls
   had nothing to bite on.

   The layout is kept for what it always meant typographically —
   the big serif question, the numbered list, the two-column
   argument, the smaller type on a plate — and its geometry is
   written out here, once, as a real arrangement: rows, the
   columns in them, the items in those. Nothing moves on the
   page. Everything becomes movable.

   The derivation follows the manuscript. A block written before
   the picture is above it; a block written after it is below.
   Order on the page is the order in the file, which is what
   makes the up and down arrows mean anything.
   ============================================================ */

/* What a block becomes: a picture or a device (evidence), or words. Kept here
   because it is the renderer that knows what each type builds. */
const EVIDENCE_BLOCKS = new Set([
  'figure', 'gallery', 'stack', 'carousel', 'trio', 'pair', 'grid2', 'annotate',
  'doc', 'qr', 'svg', 'video', 'demo', 'demoPlaceholder',
  'schedule', 'timetable', 'spec', 'plan', 'scen', 'sem',
  'two', 'three', 'four', 'five', 'zones', 'brief', 'takeaway', 'formula',
  'reveal', 'reveal3',
]);
const isEvidence = (b) => EVIDENCE_BLOCKS.has(b.type);
/* A working note is not part of the composition; it is never placed, and Pages
   hides it. This is the same rule the panel already follows. */
const isPlaceable = (b) => b.type !== 'todo' && b.type !== 'slot';

/* How each of the eleven reads as a shape.
     'column'  everything in one column, the column's width and where it sits
     'beside'  words one side, pictures the other, in one row
     'band'    every picture its own column in one row, words above
     'object'  one picture across the top, the words centred beneath it
     'card'    one cell holding the official wording on a card and, beside it,
               what that wording asks of you
     'flow'    the manuscript's own order: each run of words a row, each
               picture a row of its own, the last one growing into the foot

   Every one of the eleven has to name a DIFFERENT shape, or two names produce
   one page and the row that chooses them is a decoration. `question` and
   `poster` were the same column and `criteria` and `split` the same pair of
   halves, which is two of the five pages the audit found where there should
   have been eleven. */
const SHAPES = {
  statement: { kind: 'column', w: '3/4', v: 'middle' },
  question:  { kind: 'column', w: 'full', v: 'middle', h: 'centre' },
  list:      { kind: 'column', w: 'full', v: 'middle' },
  poster:    { kind: 'object', h: 'centre' },
  argument:  { kind: 'column', w: 'full' },
  /* "A scanned document IS the page. It has to be read, not glanced at." —
     so the document takes the frame and anything else reads under it. Same
     shape as a poster, ranged left rather than centred, because a document
     is read from its own left edge. */
  docfull:   { kind: 'object' },
  criteria:  { kind: 'card' },
  plate:     { kind: 'beside', words: '1/3', ev: '2/3', lead: 'ev', ruled: true },
  split:     { kind: 'beside', words: '1/2', ev: '1/2', lead: 'words' },
  duo:       { kind: 'band', lvl: 'same' },
  stacked:   { kind: 'flow' },
};

/* Devices that can afford to be larger. A photograph fills the height it is
   given and stays itself; a table stretched to fill one is just a table with
   air in it. */
/* A photograph stretches to the height it is given and is still a photograph.
   An interactive, a video and a written device size themselves — given the
   same instruction they overflow. So there are two lists: what may take the
   height left over, and the smaller set that may also be stretched into it. */
const FILLS = new Set([
  'figure', 'gallery', 'stack', 'carousel', 'trio', 'pair', 'grid2', 'annotate', 'doc', 'svg',
]);
const GROWS = new Set([
  ...FILLS, 'video', 'demo', 'demoPlaceholder', 'reveal', 'zones', 'brief',
]);

/* The foot. A fixed rectangle is closed on four edges, so whatever height
   nobody claimed has to land inside the composition rather than pool
   underneath it. The principal picture takes it when there is one. A page of
   words instead sits: the emptiness is placed above and below it, which is a
   margin, where the same emptiness at the foot alone is a page that ran out. */
function seat(st, blocks) {
  const growable = blocks.filter((b) => GROWS.has(b.type));
  const pick = growable[growable.length - 1];
  /* decided fresh every time: a page of words is seated, and the moment it is
     given a picture the picture takes the foot instead. Leaving `centred` on
     from an earlier state centred a page that now had a photograph in it. */
  if (!pick) { st.centred = true; return; }
  delete st.centred;
  pick.place.rgrow = true;
  if (FILLS.has(pick.type)) pick.place.fillH = true;
}

function derivePlaces(st) {
  const blocks = (st.blocks || []).filter(isPlaceable);
  if (!blocks.length) return;
  /* A page that already says where its blocks go says it; this never overrules
     a placement, it only supplies one that was never written. */
  if (blocks.some((b) => b.place)) return;

  const shape = SHAPES[st.layout] || SHAPES.stacked;
  const words = blocks.filter((b) => !isEvidence(b));
  const ev = blocks.filter(isEvidence);
  const put = (b, place) => { b.place = place; };

  /* A shape that needs two things and has been given one is not that shape.
     `beside` divides words from pictures, so it needs both; `band` sets
     pictures against each other, so it needs only the pictures. Getting this
     wrong turned a page of two photographs into one column of two
     photographs, each half the height it should have been. */
  /* How many characters the words come to. A column half the width of the page
     holds about five hundred before it runs past the foot — and the old
     format hid that by squeezing the type until it clipped. Past that, the
     page is an argument with a picture under it, which is `flow`. */
  const wordLen = words.reduce((a, b) => a
    + (b.html ? b.html.replace(/<[^>]*>/g, '').length : 0)
    + ((b.paras || []).join(' ').replace(/<[^>]*>/g, '').length)
    + ((b.items || []).map((x) => (typeof x === 'string' ? x : '')).join(' ').length), 0);

  /* Two columns hold MORE than one, so a page with a lot of words is better
     beside its picture than under it — reading it down was tried and made the
     overflow twice as bad. What a long page needs is less on it, and the page
     check now says so instead of the format hiding it by squeezing the type
     until it clipped. `wordLen` is reported, not acted on. */
  const usable = shape.kind === 'beside' ? !!(ev.length && words.length)
    : shape.kind === 'band' ? !!ev.length
    /* a poster needs the object; with nothing to look at it is a centred line,
       which is what the one-column fallback below already builds */
    : shape.kind === 'object' ? !!ev.length
    /* criteria needs nothing but words: the wording IS the page */
    : shape.kind === 'card' ? true
    : shape.kind === 'flow';
  if (wordLen > 900 && typeof console !== 'undefined') {
    console.warn('[page] ' + st.id + ' carries ' + wordLen + ' characters of prose — '
      + 'more than one screen holds at this type size. Split it, or cut it.');
  }

  if (!usable) {
    /* One column. Also the answer whenever a "beside" or "band" page turns out
       to hold only words or only pictures — which is what used to make a
       declared layout fall back to `argument` with a warning. */
    const w = (shape.kind === 'column' && shape.w) || 'full';
    blocks.forEach((b) => {
      const p = { row: 1, col: 1, w };
      if (shape.h) p.h = shape.h;
      if (shape.v) p.v = shape.v;
      if (shape.fillH) p.fillH = true;
      put(b, p);
    });
    seat(st, blocks);
    return;
  }

  if (shape.kind === 'beside') {
    const evCol = shape.lead === 'ev' ? 1 : 2;
    const wordCol = shape.lead === 'ev' ? 2 : 1;
    words.forEach((b) => put(b, { row: 1, col: wordCol, w: shape.words }));
    ev.forEach((b) => put(b, { row: 1, col: evCol, w: shape.ev }));
    if (shape.ruled) {
      const first = shape.lead === 'ev' ? ev[0] : words[0];
      if (first) first.place.ruled = true;
    }
    /* both columns run the depth of the page, so the picture is as tall as the
       words beside it rather than a small thing at the top of a tall column */
    const lead = shape.lead === 'ev' ? ev[0] : words[0];
    /* rgrow alone does that: it gives the row the height the page has left
       over, and a cell is at its container's full height unless something takes
       it away. `rv:'stretch'` was written here as well and named no arrangement
       the page could be in - measured pixel-identical to saying nothing on all
       nine containers it was written to - while blanking the container's
       nine-point grid, which lights a square for top, middle and bottom and had
       no square for a word that means the same as top. */
    if (lead) { lead.place.rgrow = true; }
    if (ev[0] && FILLS.has(ev[0].type)) ev[0].place.fillH = true;
    return;
  }

  if (shape.kind === 'object') {
    /* A poster is one object and a line under it. The first picture or device
       is the object and takes the height the page has left; anything else
       joins the words beneath it. A poster with two subjects is not a poster,
       so nothing else is promoted to the top row. */
    const obj = ev[0];
    const op = { row: 1, col: 1, w: 'full' };
    if (shape.h) op.h = shape.h;
    /* Only something that can be enlarged is told to take the height left over.
       A QR code, a link, a table given the whole foot of the page is the same
       size with white under it — and the row it sits in then anchors to the top
       instead of the composition sitting seated in the frame, which is how the
       catalogue's own poster page came to have the code hanging at the top and
       a hand's width of nothing under it. */
    if (GROWS.has(obj.type)) {
      op.rgrow = true;
      if (FILLS.has(obj.type)) op.fillH = true;
    }
    put(obj, op);
    /* One row for everything under it, not a row each: the words beneath a
       poster are one block of words, and giving each of them a row of its own
       divided the page five ways and left the object 90px tall. */
    blocks.forEach((b) => {
      if (b === obj) return;
      const p = { row: 2, col: 1, w: 'full' };
      if (shape.h) p.h = shape.h;
      put(b, p);
    });
    /* Nothing on the page can grow, so the emptiness is placed instead of left
       over: the rows are seated in the middle of the frame rather than hung
       from the top with the whole foot white. */
    if (!GROWS.has(obj.type)) st.centred = true;
    return;
  }

  if (shape.kind === 'card') {
    /* One assessment domain. The official wording sits on its own card at the
       side and what it asks of you reads beside it — both inside ONE cell,
       because a card is narrower than any twelfth on the ladder and the
       division is a division of the type, not of the grid. The stylesheet
       makes that division; here we only say which block is the wording.
       A page written with a `card` block says so itself. A page that has none
       — and any page can be given this look — is told that the words which
       lead it are the wording, which is what the name claims about it. */
    const wording = blocks.find((b) => b.type === 'card') || words[0] || blocks[0];
    blocks.forEach((b) => put(b, { row: 1, col: 1, w: 'full' }));
    if (wording) wording.place.card = true;
    seat(st, blocks);
    return;
  }

  if (shape.kind === 'band') {
    /* Words across the top, then the pictures side by side and levelled. */
    let row = 1;
    if (words.length) { words.forEach((b) => put(b, { row: 1, col: 1, w: 'full' })); row = 2; }
    const w = ev.length >= 4 ? '1/4' : ev.length === 3 ? '1/3' : ev.length === 2 ? '1/2' : 'full';
    ev.forEach((b, k) => {
      const p = { row, col: k + 1, w };
      if (k === 0) { p.lvl = shape.lvl || 'same'; p.rgrow = true; }
      if (FILLS.has(b.type)) p.fillH = true;
      put(b, p);
    });
    return;
  }

  /* flow — the manuscript's own order. A run of words is a row; a picture or a
     device is a row of its own. The last row grows, so what is left over lands
     inside the composition instead of pooling under it. */
  let row = 0;
  let lastKind = null;
  blocks.forEach((b) => {
    const kind = isEvidence(b) ? 'ev' : 'words';
    if (kind === 'ev' || kind !== lastKind) row += 1;
    lastKind = kind;
    put(b, { row, col: 1, w: 'full' });
  });
  seat(st, blocks);
}

/* Placements written before columns existed named only a row. Two things in one
   row meant two things side by side, so that is what they become: one column
   each, in the order they were written. Anything with an explicit column is left
   exactly as it is. */
function normalisePlaces(st) {
  /* Levelling used to be written into `v`, which now means alignment. A page
     written before the split keeps working: the old word is moved to its own
     property rather than being silently reinterpreted as an alignment. */
  (st.blocks || []).forEach((b) => {
    if (b.place && (b.place.v === 'same' || b.place.v === 'level')) {
      b.place.lvl = b.place.v;
      delete b.place.v;
    }
  });
  const rows = new Map();
  (st.blocks || []).forEach((b) => {
    if (!b.place) return;
    const r = b.place.row || 1;
    if (!rows.has(r)) rows.set(r, []);
    rows.get(r).push(b);
  });
  rows.forEach((items) => {
    if (items.some((b) => b.place.col != null)) return;
    items.forEach((b, k) => { b.place.col = items.length > 1 ? k + 1 : 1; });
  });
}

function renderStep(st, ch) {
  derivePlaces(st);
  normalisePlaces(st);
  const step = el('div', 'step' + (st.cls ? ' ' + st.cls : ''));
  step.id = st.id;
  if (st.layout) step.setAttribute('data-layout', st.layout);
  if (st.centred) step.classList.add('centred');
  if (st.proof) step.classList.add('proof-page');
  if (st.align) step.setAttribute('data-page-align', st.align);
  /* How the containers share the height they have is a different question from
     where the stack of them sits, and one field could only ever answer one of
     them — so it has one of its own. */
  if (st.spread) step.setAttribute('data-page-spread', st.spread);
  if (st.marks) step.classList.add('reg-marks');
  if (st.edge) step.setAttribute('data-edge', st.edge);
  if (st.rowGap) step.setAttribute('data-row-gap', st.rowGap);
  if (st.dupTitle) step.append(el('h3', 'dup', st.dupTitle));
  /* Every page carries a title in the same place. A step without one takes
     the chapter's name — the row is never empty. */
  step.append(el('h3', null, st.title || ch.title));
  if (!st.layout) console.warn('step ' + st.id + ' names no layout — the automatic sort applied');
  if (st.dupLine) step.append(el('p', 'line dup', st.dupLine));
  (st.blocks || []).forEach((b, i) => {
    const fn = BLOCK[b.type];
    if (!fn) { console.warn('unknown block', b.type); return; }
    const node = fn(b);
    /* a block that renders as a fragment (quote, zones) tags each of its parts */
    const parts = node.nodeType === 11 ? [...node.children] : [node];
    parts.forEach((n) => {
      n.setAttribute('data-bi', i);
      if (b.plate) n.classList.add('plate-box');
      /* Face and size, when a block has been given its own. A number is a
         multiplier of whatever the role already sets, so the type scale is the
         thing being adjusted rather than replaced. */
      if (b.font) n.setAttribute('data-font', b.font);
      if (b.sz) {
        const mult = typeof b.sz === 'number' ? b.sz : (b.sz === 'big' ? 1.18 : b.sz === 'small' ? 0.86 : 0);
        if (mult) n.style.setProperty('--sz', String(mult));
      }
      if (b.fix) n.classList.add('fix');
      if (b.proof) n.classList.add('proof');
      /* Anything Claude wrote is marked until Batu has read it and kept it —
         a page should never quietly contain words nobody chose. */
      if (b.gen) { n.classList.add('gen'); if (b.gen.what) n.setAttribute('data-gen', b.gen.what); }
      if (b.ai && b.ai.length) n.classList.add('asked');
    });
    /* colBreak marks where a "columns" page divides its own text */
    if (b.colBreak) node.setAttribute('data-col-break', '');
    /* a placed block carries its own arrangement — see arrange() below */
    if (b.place) parts.forEach((n) => {
      n.classList.add('pg-placed');
      n.setAttribute('data-place-row', String(b.place.row || 1));
      n.setAttribute('data-place-col', String(b.place.col || 1));
      n.setAttribute('data-w', b.place.w || 'full');
      if (b.place.h) n.setAttribute('data-h', b.place.h);
      if (b.place.ih) n.setAttribute('data-ih', b.place.ih);
      if (b.place.gap) n.setAttribute('data-gap', b.place.gap);
      if (b.place.igap) n.setAttribute('data-igap', b.place.igap);
      if (b.place.iw) n.setAttribute('data-iw', b.place.iw);
      if (b.place.y) n.style.setProperty('--pg-iy', String(b.place.y));
      if (b.place.align) n.setAttribute('data-align', b.place.align);
      /* the words' own ranging, which is the block's and not the place's */
      if (b.align) n.setAttribute('data-align', b.align);
      if (b.place.fit) n.setAttribute('data-fit', b.place.fit);
      if (b.place.v) n.setAttribute('data-v', b.place.v);
      if (b.place.lvl) n.setAttribute('data-lvl', b.place.lvl);
      if (b.place.bleed) n.setAttribute('data-bleed', '');
      /* Never enlarge this picture. Deliberately NOT a value of `fit`: the
         stylesheet picks the whole-picture geometry with :not([data-fit]), so a
         fit named here would take that geometry away. It is a flag on top of
         the whole-picture case, and it only changes object-fit. */
      if (b.place.nogrow) n.setAttribute('data-nogrow', '');
      if (b.place.dir) n.setAttribute('data-dir', b.place.dir);
      if (b.place.fillH) n.setAttribute('data-fillh', '');
      if (b.place.fill) n.setAttribute('data-fill', '');
      if (b.place.rh) n.setAttribute('data-rh', b.place.rh);
      if (b.place.rv) n.setAttribute('data-rv', b.place.rv);
      if (b.place.rgrow) n.setAttribute('data-rgrow', '');
      /* `rgrow` is an instruction to the ROW. Whether THIS item is the one that
         absorbs the height is a different question, and only a picture or a
         device can answer yes — a paragraph told to absorb it was given
         `flex:1 1 auto; min-height:0` and collapsed to nothing when the column
         was tight. */
      if (b.place.rgrow && GROWS.has(b.type)) n.setAttribute('data-cangrow', '');
      if (b.place.ruled) n.setAttribute('data-ruled', '');
      /* this block carries the official wording of an assessment domain */
      if (b.place.card) n.setAttribute('data-card', '');
      if (b.place.pos) n.setAttribute('data-pos', b.place.pos);
      if (b.place.hgt) n.setAttribute('data-hgt', b.place.hgt);
      if (b.place.ihgt) n.setAttribute('data-ihgt', b.place.ihgt);
      /* the rectangle this block holds on the grid, when the page is free */
      if (b.place.g) n._g = b.place.g;
      if (b.place.iv) n.setAttribute('data-iv', b.place.iv);
      if (b.place.y) n.style.setProperty('--pg-y', String(b.place.y));
    });
    step.append(node);
  });
  /* A page whose blocks say where they go is arranged rather than sorted: the
     rows are built here, and Pages leaves it alone. */
  if ((st.blocks || []).some((b) => b.place)) {
    if (st.free) arrangeFree(step, st); else arrange(step);
  }
  if (st.marks) markLiveArea(step);
  return step;
}

/* The registration marks bracket the live area — the top and the bottom of the
   rows box, a little outside it on all four sides. They used to be drawn as
   ::before/::after on .pg-rows itself, which meant .pg-rows had to be
   positioned to hold them; and a positioned .pg-rows becomes the containing
   block for a picture told to fill the whole page, so on any page carrying
   marks the picture filled the rows box instead — title, running head and
   margins all still showing. Nothing between the step and a bled picture may
   be positioned.
   So the marks hang off two hairlines of their own: empty, zero-height
   siblings that sit exactly where the rows begin and where they end. Being
   siblings they can be positioned as freely as they like, because no picture
   is ever inside them, and having no height they change nothing about how the
   page is laid out. lecture.css draws the crosses on them. */
function markLiveArea(step) {
  const rows = step.querySelector(':scope > .pg-rows');
  if (!rows) return;
  const top = el('div', 'pg-mark pg-mark-t');
  const bottom = el('div', 'pg-mark pg-mark-b');
  /* decoration, not content: a reader hears nothing here */
  top.setAttribute('aria-hidden', 'true');
  bottom.setAttribute('aria-hidden', 'true');
  rows.before(top);
  rows.after(bottom);
}

function render(root, week) {
  const main = root.querySelector('main.content');
  const list = root.querySelector('#chapter-list');

  week.chapters.forEach((ch, ci) => {
    const sec = el('section', 'chapter');
    sec.id = ch.id;
    sec.setAttribute('data-title', ch.title);
    sec.setAttribute('data-n', ch.n || '');
    if (ch.part) {
      sec.setAttribute('data-part', ch.part);
      sec.setAttribute('data-part-title', ch.partTitle || '');
    }

    const head = el('div', 'chapter-head');
    if (ch.head && ch.head.kicker) head.append(el('p', 'kicker ' + (ch.part || ''), ch.head.kicker));
    head.append(el('h2', null, ch.title));
    if (ch.head && ch.head.standfirst) head.append(el('p', 'standfirst', ch.head.standfirst));
    sec.append(head);

    ch.steps.forEach((st) => sec.append(renderStep(st, ch)));

    const nav = el('div', 'chapter-nav');
    nav.append(btn('← Previous'), btn('Next →'));
    sec.append(nav);

    main.append(sec);

    /* rail */
    const prevPart = ci ? week.chapters[ci - 1].part : null;
    if (ch.part && ch.part !== prevPart) {
      list.append(el('div', 'part-label ' + ch.part, 'Part ' + ch.part.toUpperCase() + ' · ' + (ch.partTitle || '')));
    }
    const li = el('li');
    const b = btn('<span class="n">' + (ch.n || '') + '</span>' + ch.title);
    li.append(b);
    list.append(li);
  });

  /* masthead text */
  root.querySelectorAll('[data-week-eyebrow]').forEach((n) => {
    /* two elements, not one string: the course and the week are separate
       lines, so "Week #1" can never break mid-token in a narrow rail */
    n.textContent = '';
    const course = document.createElement('span');
    course.className = 'e-course';
    course.textContent = week.course;
    const wk = document.createElement('span');
    wk.className = 'e-week';
    wk.textContent = 'Week #' + week.number;
    n.append(course, wk);
  });
  root.querySelectorAll('[data-week-title]').forEach((n) => {
    n.textContent = week.title;
    n.setAttribute('data-week-n', week.number);
  });
  root.querySelectorAll('[data-week-standfirst]').forEach((n) => { n.textContent = week.standfirst; });
  root.querySelectorAll('[data-week-footer]').forEach((n) => {
    n.innerHTML = '<span>' + week.institution + ' · ' + week.course + ' · ' + week.year + '</span>'
      + '<span>Week #' + week.number + ' — ' + week.revision + '</span>';
  });
  markSyntaxOnly(main);
  document.title = 'Week #' + week.number + ' · ' + week.title + ' — ' + week.course;
}

function btn(html) {
  const b = el('button', null, html);
  b.type = 'button';
  return b;
}

/* ---------- interactives ---------- */
async function mountDemos(root) {
  const surface = (document.querySelector('meta[name="demo-surface"]') || {}).content;
  if (surface === 'light') root.querySelectorAll('figure.demo').forEach((f) => f.classList.add('light'));
  const figs = [...root.querySelectorAll('figure.demo[data-demo]')];
  for (const fig of figs) {
    const key = fig.getAttribute('data-demo');
    if (!DEMOS[key]) continue;
    try {
      const spec = DEMOS[key];
      const mount = window[spec.fn];
      if (typeof mount !== 'function') throw new Error(spec.fn + ' not loaded');
      fig._demo = mount(fig);
    } catch (e) {
      console.error('demo failed:', key, e);
      const stage = el('div', 'stage wide');
      stage.append(el('div', 'ph', 'Interactive failed to load'));
      fig.prepend(stage);
    }
  }
}

window.render = render; window.renderStep = renderStep; window.mountDemos = mountDemos; window.BLOCK = BLOCK;
/* The editor re-seats a page after it has been given a new shape: the foot is
   part of the composition, so it has to be decided again whenever the rows do. */
window.TS2_SEAT = function (st) {
  const blocks = (st.blocks || []).filter(isPlaceable).filter((b) => b.place);
  blocks.forEach((b) => { delete b.place.rgrow; delete b.place.fillH; });
  delete st.centred;
  if (blocks.length) seat(st, blocks);
};
window.TS2_EVIDENCE = (t) => EVIDENCE_BLOCKS.has(t);
/* The file kept aside for the change list has to be given the same derived
   placement the page is given, or opening Edit reports every page in the week
   as changed before anything has been touched. */
window.TS2_DERIVE = function (st) { derivePlaces(st); normalisePlaces(st); };
/* ------------------------------------------------------------
   Choosing a look re-arranges the page.

   A name in the Look row is a promise about WHERE things go as much as about
   how they are set, and it is read that way: "a picture is the subject; the
   words beside it step down a size" says which side the picture is on, and
   "two pictures of equal weight" says they are side by side. `derivePlaces`
   above supplies a placement only to a page that has none, which is right on
   load — a page that says where its blocks go must keep saying it — but it
   also meant that after the first draw no look could ever move anything
   again, and eleven names produced five pages. All that changed was the word
   written on the step.

   So choosing a look throws the derived placement away and derives it again
   for the name just chosen. It is destructive of an arrangement made by hand,
   and deliberately so: the author asked for this page to be a Plate, and a
   Plate is a shape. It costs one Undo, like every other edit.
   ------------------------------------------------------------ */
window.TS2_RELAYOUT = function (st, layout) {
  st.layout = layout;
  /* An empty cell belongs to the shape somebody picked by hand; a page being
     re-dealt by name has no such cells, and leaving them in would keep holes
     in the new arrangement that nothing in the panel could then remove. */
  st.blocks = (st.blocks || []).filter((b) => b.type !== 'slot');
  st.blocks.forEach((b) => { delete b.place; });
  /* The Shape row below is the hand-made override of this one. Saying a page
     is still the shape somebody picked would light a diagram that no longer
     describes it. */
  delete st.preset;
  /* seat() decides this again from the blocks the new shape has */
  delete st.centred;
  derivePlaces(st);
  normalisePlaces(st);
};
