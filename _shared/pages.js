/* ============================================================
   Generation D — Pages · shell
   ------------------------------------------------------------
   Turns a lecture document into a flat sequence of full pages.

   It does not replace the page's own shell — it sits on top of
   it. The host shell already knows how to make a chapter and a
   step active; this module flattens every step in the document
   into one ordered list, keeps `body.present` on permanently so
   lecture.css's slide geometry applies, and drives the sequence
   from a Previous / Next footer.

   Load last, after the page's own shell script.
   ============================================================ */
(function () {
  const body = document.body;
  const chapters = [...document.querySelectorAll('section.chapter')];
  if (!chapters.length) return;

  /* A chapter-opening step carries two things: a repeat of the chapter title
     and standfirst (that is what `.dup` means, and present mode showed them as
     a title slide), and often a real opening claim.

     Pages does not want the title slide — the running head names the chapter on
     every page — but the claim is teaching content and must not be lost. So the
     step is KEPT and the duplicated heading is dropped, which turns a divider
     into an ordinary statement page. */
  /* A heading that repeats the chapter title is NOT redundant — the running
     head is a small mono locator, the title is the page's heading, and they do
     different jobs. Only an explicitly duplicated title (`dupTitle`, which
     existed to give present mode an opening slide) is suppressed. */
  function redundantHeading(step, chapter) {
    const h = step.querySelector('h3');
    if (!h || !h.classList.contains('dup')) return null;
    /* `.dup` is not proof on its own. A page built from content.js only carries
       it on a true repeat, but a hand-written week uses it to mean "show this
       in present mode" — so it also sits on real page titles like "Photography:
       3D to 2D". Hiding those leaves the page opening on a void. Compare the
       words: a heading is redundant only when it says what the chapter says. */
    const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const chapterTitle = norm(chapter && chapter.getAttribute('data-title'));
    if (!chapterTitle || norm(h.textContent) !== chapterTitle) return null;
    /* Even a true repeat stays when it is the page's ONLY title. Suppressing it
       is only right where something else supplies one — a week rendered from
       content.js emits .pg-title; a hand-written week does not, and hiding the
       heading there opens the chapter on a void. */
    const other = step.querySelector('.pg-title');
    return other && other.textContent.trim() ? h : null;
  }

  /* What is left once the redundant heading and the duplicated standfirst are
     hidden. Nothing left means the page was only a chapter title, in any of its
     variants — and none of those are wanted as a page. */
  function hasOwnContent(step) {
    return !!step.querySelector(
      'figure, table, canvas, .timetable, .video-slot, section.brief,' +
      '.line:not(.dup), .text, ul.bul, .quote, .note, .takeaway, .formula, .zonestrip'
    );
  }

  /* ---- the flat page list ---- */
  const pages = [];
  chapters.forEach((chapter, ci) => {
    const title = chapter.getAttribute('data-title') || '';
    const n = chapter.getAttribute('data-n') || '';
    let si = 0;
    [...chapter.querySelectorAll('.step')].forEach((step) => {
      const dupHead = redundantHeading(step, chapter);
      if (dupHead) {
        dupHead.classList.add('dup-head');
        if (!hasOwnContent(step)) return;   /* a chapter title page: dropped */
        step.classList.add('opener');
      }
      pages.push({ step, chapter, ci, si: si++, title, n });
    });
  });
  if (!pages.length) return;

  /* ---- pages mode is permanent: present geometry, no toggle ---- */
  body.classList.add('pages', 'present');

  /* ---- page structure ----------------------------------------------
     A page is built, not just styled: the step's flat children are
     sorted into an ARGUMENT column and an EVIDENCE column, each in its
     own box. Trying to lay this out on the flat children directly means
     the two columns cannot control their own heights, which leaves dead
     space under a figure and pushes short pages off-centre.
     ------------------------------------------------------------------ */
  const EVIDENCE = 'figure, .video-slot, .timetable, .schedule, table.spec, table.plan, .three, .four, .five, .two-up, .zonestrip, .zonelabels, .compare, section.brief, .takeaway, .formula, .video-block';
  /* Blocks Pages hides: a duplicated title, a duplicated standfirst, and the
     author's own working notes. They occupy no space, so they must not count
     when deciding whether a column has anything to show. */
  const HIDDEN = '.dup-head, .line.dup, p.dup, .todo, .page-only';
  /* devices that want the whole width of the page rather than a column.
     An interactive is the subject of its page, never a sidebar to it. */
  const FULL_WIDTH = 'figure.demo, figure.gallery, figure.trio, figure.slide.grid, figure.icons, figure.reveal, .timetable, .schedule, .three, .four, .five, .two-up, section.brief, .formula, .video-block, figure.slide.qr';

  /* "columns" divides the ARGUMENT itself at the block marked colBreak, for a
     page whose two halves are both text. "split" cannot serve that: it divides
     argument from evidence, and every text device sorts as argument. */
  function buildColumns(arg) {
    const kids = [...arg.children];
    const at = kids.findIndex((k) => k.hasAttribute('data-col-break'));
    if (at < 1) return false;
    const left = document.createElement('div');
    left.className = 'pg-col';
    const right = document.createElement('div');
    right.className = 'pg-col';
    kids.forEach((k, i) => (i < at ? left : right).appendChild(k));
    arg.append(left, right);
    arg.classList.add('pg-split-arg');
    return true;
  }

  function composeStep(step) {
    if (step.querySelector(':scope > .pg-body')) return;
    /* An arranged page has placed its own blocks in rows. The automatic sort is
       for pages that do not say; it must not overrule one that does. */
    if (step.classList.contains('arranged')) {
      const h = step.querySelector(':scope > h3:not(.dup-head)');
      if (h && !step.querySelector(':scope > .pg-title')) {
        const t = document.createElement('div');
        t.className = 'pg-title';
        t.appendChild(h);
        step.insertBefore(t, step.firstChild);
      }
      step.classList.add('composed');
      return;
    }
    const kids = [...step.children];
    const arg = document.createElement('div');
    arg.className = 'pg-arg';
    const ev = document.createElement('div');
    ev.className = 'pg-ev';
    const bodyBox = document.createElement('div');
    bodyBox.className = 'pg-body';

    /* A page title is a title: it belongs directly under the running head, in
       the same place on every page, not floating in the middle of a centred
       argument column. Extracted before the sort so no composition can move
       it — except `bleed`, where the words overlay the picture's foot and the
       title belongs with them. */
    const titleBox = document.createElement('div');
    titleBox.className = 'pg-title';
    if (step.getAttribute('data-layout') !== 'bleed') {
      const h = step.querySelector(':scope > h3:not(.dup-head)');
      if (h) titleBox.appendChild(h);
    }

    /* Which came first in the source decides the reading order, so a line
       written as a caption under a photograph stays under it.
       Page furniture — the title, the kicker, the duplicated chapter heading —
       is neither argument nor evidence. Counting it as argument meant a page
       that opens on a photograph could never lead with it. */
    /* `h3` is here because the title is still in `kids` at this point — it was
       moved into its own box a moment ago, but the list was taken before that.
       Without it the title counted as the first argument, so evidence could
       never lead and a page written picture-first still rendered words-first:
       reordering the blocks changed the file and nothing on the screen. */
    const FURNITURE = '.pg-title, .kicker, .dup-head, .step-mv, h3';
    const firstEvidence = kids.findIndex((k) => k.matches(EVIDENCE));
    const firstArgument = kids.findIndex((k) => !k.matches(EVIDENCE) && !k.matches(FURNITURE));
    const evidenceLeads = firstEvidence > -1 && firstArgument > -1 && firstEvidence < firstArgument;

    kids.forEach((k) => {
      /* the title was already moved into its own box, so skip anything that is
         no longer a child of the step */
      if (k.parentNode !== step) return;
      if (k.matches('.step-mv')) return;
      (k.matches(EVIDENCE) ? ev : arg).appendChild(k);
    });

    /* `plate` puts the picture first whatever the source order, because that
       is what the composition means */
    /* A declared layout that cannot be honoured must not degrade silently:
       `split` divides argument from evidence, so a page whose halves are both
       text left a row body with one child and dead space. `columns` divides
       the argument itself; anything else with no evidence falls back. */
    let declared = step.getAttribute('data-layout');
    if (declared === 'columns' && !buildColumns(arg)) {
      console.warn('[pages] "columns" needs a block marked colBreak — using argument on', step.id);
      declared = 'argument';
      step.setAttribute('data-layout', declared);
    }
    if (declared && declared !== 'columns' && !ev.children.length &&
        /^(split|sidebar|duo|quad|plate|bleed)$/.test(declared)) {
      console.warn('[pages] "' + declared + '" needs an evidence block — using argument on', step.id);
      declared = 'argument';
      step.setAttribute('data-layout', declared);
    }

    const evFirst = evidenceLeads || declared === 'plate' || declared === 'poster';
    const boxes = evFirst ? [ev, arg] : [arg, ev];
    boxes.forEach((b) => { if (b.children.length) bodyBox.appendChild(b); });
    step.appendChild(titleBox);
    step.appendChild(bodyBox);
    step.classList.toggle('evidence-first', evidenceLeads);

    /* An empty column must not claim space. Without this an argument box whose
       every child is hidden still takes a share of the free space, which pushed
       the timetable a third of the way down page one. */
    const argVisible = [...arg.children].filter((c) => !c.matches(HIDDEN)).length;
    arg.classList.toggle('pg-empty', argVisible === 0);
    ev.classList.toggle('pg-empty', ev.children.length === 0);

    const hasBoth = !!(argVisible && ev.children.length);

    /* An authored layout wins over the automatic sort — the engine's guess is
       a fallback for pages that do not care, not a rule. */
    const authored = step.getAttribute('data-layout');
    if (authored) {
      step.classList.add('composed');
      /* A composition that governs the picture itself is mirrored onto the
         figure, so images.css owns the picture and compose.css owns the page —
         they never fight over the same element. */
      if (authored === 'bleed') {
        const only = ev.querySelector('figure.slide');
        if (only) only.setAttribute('data-layout', 'bleed');
      }
      /* each evidence item gets its own slot, in source order */
      if (authored === 'duo' || authored === 'quad') {
        [...ev.children].forEach((k) => {
          const slot = document.createElement('div');
          slot.className = 'pg-slot';
          k.replaceWith(slot);
          slot.appendChild(k);
        });
      }
      return;
    }

    const wide = ev.querySelector(FULL_WIDTH);
    /* an argument that is only a heading does not earn its own column */
    const thinArg = !arg.querySelector('.line:not(.dup), .text, ul.bul, .quote, .note, .takeaway, .formula');
    step.classList.toggle('split', !!(hasBoth && !wide && !thinArg));
    step.classList.toggle('stacked', !!(hasBoth && (wide || thinArg)));
    step.classList.toggle('argument-only', !ev.children.length);
    step.classList.toggle('evidence-only', argVisible === 0);
  }
  pages.forEach(({ step }) => composeStep(step));

  /* ---- the chapter's standfirst, somewhere it can actually be read ----
     render.js writes it into `.chapter-head`, and pages mode hides
     `.chapter-head` outright — so the paragraph the panel calls "the sentence
     under the chapter title" has never once been on the screen: all of them
     measure 0x0 with no offsetParent. Pages has no chapter-title slide to hang
     it on, so it goes where the field's own words say it goes — at the top of
     the chapter, under the title of the chapter's first page, and on no page
     after that one. */
  function seatStandfirst(p) {
    const step = p.step;
    const already = step.querySelector(':scope > .pg-title > .pg-standfirst');
    if (already) already.remove();
    if (p.si !== 0) return;
    const src = p.chapter.querySelector(':scope > .chapter-head > .standfirst');
    const words = src ? src.textContent.trim() : '';
    if (!words) return;
    const box = step.querySelector(':scope > .pg-title');
    if (!box) return;
    const line = document.createElement('p');
    line.className = 'pg-standfirst';
    line.textContent = words;
    box.appendChild(line);
  }
  pages.forEach(seatStandfirst);

  /* A long table has no natural height budget — it just grows past the page.
     CSS cannot count rows, so mark the dense ones here and let compose.css
     step their density down. */
  function markDense(step) {
    step.querySelectorAll('table').forEach((t) => {
      const rows = t.querySelectorAll('tr').length;
      t.classList.toggle('tbl-dense', rows > 8);
      t.classList.toggle('tbl-denser', rows > 12);
    });
  }
  pages.forEach(({ step }) => markDense(step));

  /* ---- chapter-opening pages carry the chapter numeral ---- */
  chapters.forEach((chapter) => {
    const n = chapter.getAttribute('data-n') || '';
    chapter.querySelectorAll('.step').forEach((step) => {
      if (!step.querySelector('h3.dup')) return;
      step.setAttribute('data-part-n', n);
      /* Pages has no divider slides: an opener is a statement page */
      step.classList.remove('ts-divider');
    });
  });

  /* ---- week-to-week nav in the rail ----------------------------------
     Built from lectures/weeks.js so adding a week is one entry there, not an
     edit in every lecture. Silently absent if the list has not been loaded. */
  (function weekNav() {
    const rail = document.querySelector('nav.chapters');
    const all = (window.TS2_WEEKS || []).concat(window.TS2_REFERENCE || []);
    if (!rail || !all.length) return;
    /* A hand-written .weeknav is REPLACED, never deferred to: Week #2 carried
       one whose hrefs used the old folder naming, and both links 404'd. */
    const stale = rail.querySelector('.weeknav');
    if (stale) stale.remove();

    const here = (location.pathname.match(/\/([^/]+)\/[^/]*$/) || [])[1];
    const teaching = window.TS2_WEEKS || [];
    const at = teaching.findIndex((w) => w.slug === here);
    const prev = at > 0 ? teaching[at - 1] : null;
    const next = at > -1 && at < teaching.length - 1 ? teaching[at + 1] : null;

    const nav = document.createElement('div');
    nav.className = 'weeknav';
    const link = (href, cls, text) => {
      const a = document.createElement('a');
      a.href = href; a.className = cls; a.textContent = text;
      return a;
    };
    nav.append(prev
      ? link('../' + prev.slug + '/index.html', 'prev', '← #' + prev.n)
      : Object.assign(document.createElement('span'), { className: 'prev' }));
    nav.append(link('../index.html', 'home', 'All weeks'));
    nav.append(next
      ? link('../' + next.slug + '/index.html', 'next', '#' + next.n + ' →')
      : Object.assign(document.createElement('span'), { className: 'next' }));

    const anchor = rail.querySelector('#chapter-list') || rail.querySelector('ol');
    if (anchor) rail.insertBefore(nav, anchor); else rail.appendChild(nav);
  })();

  /* ---- the footer ---- */
  const bar = document.createElement('div');
  bar.id = 'pagebar';
  bar.innerHTML =
    '<div class="where">' +
      '<span class="ch"></span>' +
      '<span class="bar"><span></span></span>' +
    '</div>' +
    '<div class="count"><span class="at"></span><span class="of"></span></div>' +
    '<button type="button" class="prev"><span class="arw">←</span>Previous</button>' +
    '<button type="button" class="next">Next<span class="arw">→</span></button>';
  body.appendChild(bar);

  const elCh = bar.querySelector('.ch');
  const elFill = bar.querySelector('.bar > span');
  const elBar = bar.querySelector('.bar');
  const elAt = bar.querySelector('.at');
  const elOf = bar.querySelector('.of');

  /* CHAPTER TICKS
     A tick on the bar wherever a chapter begins, so the bar reads as the
     lecture's structure and not just a percentage: you can see how many
     chapters there are and how the pages are distributed between them.
     Built once from the flat page list — the same list the counter uses,
     so a tick can never disagree with the page it marks. */
  (function ticks() {
    let prev = null;
    pages.forEach((p, i) => {
      if (p.ci === prev) { prev = p.ci; return; }
      prev = p.ci;
      if (i === 0) return;                    /* page one needs no mark */
      const t = document.createElement('span');
      t.className = 'tick';
      t.style.left = ((i / pages.length) * 100) + '%';
      t.title = [p.n, p.title].filter(Boolean).join(' · ');
      elBar.appendChild(t);
    });
  })();
  const btnPrev = bar.querySelector('.prev');
  const btnNext = bar.querySelector('.next');

  const railButtons = [...document.querySelectorAll('nav.chapters ol li > button')];
  const pad = (n) => String(n).padStart(2, '0');
  let at = 0;

  function show(i, opts) {
    at = Math.max(0, Math.min(pages.length - 1, i));
    const page = pages[at];

    chapters.forEach((c) => c.classList.toggle('active', c === page.chapter));
    pages.forEach((p) => p.step.classList.toggle('active', p === page));
    /* A week with its own inline shell re-adds the divider class after gen-d
       has run, so stripping it once at boot does not hold. Pages has no title
       slides in any form; strip it every time a page is shown. */
    page.step.classList.remove('ts-divider');
    railButtons.forEach((b, k) => b.setAttribute('aria-current', k === page.ci ? 'true' : 'false'));
    /* The part label of the part being taught is the one that stands out; the
       others stand back. Which one that is changes as the lecture moves. */
    const part = page.chapter && page.chapter.getAttribute('data-part');
    document.querySelectorAll('nav.chapters .part-label').forEach((el) => el.classList.toggle('on', !!part && el.classList.contains(part)));

    /* Keep the active chapter inside the rail's visible band. Without this the
       rail highlights a row that has scrolled out of sight, so on a long week
       the last chapters look unhighlighted. Computed against the list rather
       than scrollIntoView, which moves the whole page. */
    const activeBtn = railButtons[page.ci];
    if (activeBtn) {
      const list = activeBtn.closest('#chapter-list') || activeBtn.closest('nav.chapters');
      if (list && list.scrollHeight > list.clientHeight) {
        /* measured against the list's own box, not offsetTop — the button's
           offsetParent is not the list, so offsetTop reports the wrong origin */
        const btnBox = activeBtn.getBoundingClientRect();
        const listBox = list.getBoundingClientRect();
        const above = btnBox.top - listBox.top;
        const below = btnBox.bottom - listBox.bottom;
        if (above < 0) list.scrollTop += above - 8;
        else if (below > 0) list.scrollTop += below + 8;
      }
    }

    const head = [page.n, page.title].filter(Boolean).join(' · ');
    const inChapter = pages.filter((p) => p.ci === page.ci).length;
    page.step.setAttribute('data-page-head', head + '  —  ' + pad(page.si + 1) + ' / ' + pad(inChapter));

    elCh.textContent = head;
    elAt.textContent = pad(at + 1);
    elOf.textContent = '/ ' + pad(pages.length);
    elFill.style.width = (((at + 1) / pages.length) * 100) + '%';
    btnPrev.disabled = at === 0;
    btnNext.disabled = at === pages.length - 1;

    if (!opts || !opts.silent) {
      try { history.replaceState(null, '', '#p' + (at + 1)); } catch (e) { /* file:// */ }
    }
    /* A row of pictures levelled to one height is levelled by measuring it, and
       a page that has not been shown yet has no width to measure — every column
       in it is nought pixels wide. Measuring once at load therefore measured
       nothing. Each page is measured as it comes up, which is the first moment
       there is anything to measure. */
    if (window.TS2_WIRE) window.TS2_WIRE(page.step);
    if (window.TS2_LEVEL_ROWS) window.TS2_LEVEL_ROWS(page.step);
    const demo = page.step.querySelector('figure.demo');
    if (demo && demo._demo && typeof demo._demo.resize === 'function') demo._demo.resize();
  }

  const go = (d) => show(at + d);

  /* a page can send you to another page by step id */
  document.addEventListener('lecture:goto', (e) => {
    const i = pages.findIndex((p) => p.step.id === e.detail.id);
    if (i >= 0) show(i);
  });

  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));

  /* the rail jumps to a chapter's first page */
  railButtons.forEach((b, ci) => {
    b.addEventListener('click', () => {
      const first = pages.findIndex((p) => p.ci === ci);
      if (first >= 0) show(first);
    }, true);
  });

  /* ---- keys. Arrows and space always navigate; P is meaningless here. ---- */
  document.addEventListener('keydown', (e) => {
    /* A key pressed inside words being typed into belongs to the words, never
       to the deck. `isContentEditable` alone does not settle that: it is a
       rendering answer and goes false the moment the element leaves the
       document, and the editor redraws the page from the model between the
       keystroke and this handler — so a space bar pressed in the middle of a
       sentence used to arrive here looking like a space pressed on the body,
       and turned the page while the sentence was being written. The attribute
       stays on the element after it has been torn out, so ask for that too. */
    const typing = e.target.isContentEditable
      || (e.target.closest && e.target.closest('[contenteditable="true"]'));
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || typing) return;
    if (document.querySelector('#lb.on')) return;
    /* A modified arrow is a command, not a page turn: the editor uses Alt+arrow
       to move what is selected. Unmodified arrows still turn the page. */
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.key === 'p' || e.key === 'P') { e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); e.stopImmediatePropagation(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); e.stopImmediatePropagation(); go(-1); }
    /* S reveals the content.js snippet behind each block — only present on
       the prototype, harmless elsewhere. */
    if (e.key === 's' || e.key === 'S') {
      if (!document.querySelector('.syntax')) return;
      e.preventDefault(); e.stopImmediatePropagation();
      body.classList.toggle('show-syntax');
      return;
    }
    if (e.key === 'Home') { e.preventDefault(); e.stopImmediatePropagation(); show(0); }
    if (e.key === 'End') { e.preventDefault(); e.stopImmediatePropagation(); show(pages.length - 1); }
  }, true);

  body.classList.remove('booting');

  /* A week with its own inline shell never loads shell.js, so the schedule's
     class tabs would be inert. Bind them here, marking the element so a week
     that DOES load shell.js is not bound twice. */
  document.querySelectorAll('.schedule:not([data-sc-bound])').forEach((sc) => {
    sc.setAttribute('data-sc-bound', '');
    const tabs = [...sc.querySelectorAll('.sc-tab')];
    const bodies = [...sc.querySelectorAll('.sc-body')];
    tabs.forEach((t, i) => t.addEventListener('click', () => {
      tabs.forEach((x, k) => x.setAttribute('aria-current', String(k === i)));
      bodies.forEach((x, k) => x.toggleAttribute('hidden', k !== i));
    }));
  });

  /* ---- deep link, so a page can be sent to a student ---- */
  const hash = (location.hash.match(/^#p(\d+)$/) || [])[1];
  show(hash ? parseInt(hash, 10) - 1 : 0, { silent: !hash });

  /* A link to #p12 has to mean page 12 whether the tab is arriving at the deck
     or already standing in it. Only the FIRST navigation loads the document;
     every later one changes the fragment and nothing else, so the line above ran
     once and never again — the deck went on showing whatever page it was already
     showing while the address bar said something different.
     That is not only a navigation annoyance. The editor asks the deck which page
     it is on, so every piece of page bookkeeping — insert after this one, move
     this one, renumber from here — was being done against a page that had
     scrolled out of the story, which is how "new page after this one" came to
     land in chapter one no matter where the author thought he was standing. */
  window.addEventListener('hashchange', () => {
    const m = (location.hash.match(/^#p(\d+)$/) || [])[1];
    if (!m) return;
    const i = parseInt(m, 10) - 1;
    /* silent: the address already says this — writing it again would only
       replace the entry the browser has just made */
    if (i !== at) show(i, { silent: true });
  });

  /* ---- edit mode hooks: rebuild one page in place without a reload ---- */
  window.TS2_PAGES = {
    show, go,
    current: () => ({ at, page: pages[at], count: pages.length }),
    replaceStep(oldStep, newStep) {
      const p = pages.find((x) => x.step === oldStep);
      /* what this file stamped onto the page at load time carries over */
      ['data-page-head', 'data-part-n', 'data-page-n'].forEach((a) => { const v = oldStep.getAttribute(a); if (v != null) newStep.setAttribute(a, v); });
      composeStep(newStep); markDense(newStep);
      oldStep.replaceWith(newStep);
      if (p) { p.step = newStep; seatStandfirst(p); }
      newStep.classList.add('active');
      if (typeof window.mountDemos === 'function') window.mountDemos(newStep);
    },
  };

  window.addEventListener('resize', () => {
    const demo = pages[at].step.querySelector('figure.demo');
    if (demo && demo._demo && typeof demo._demo.resize === 'function') demo._demo.resize();
  });
})();
