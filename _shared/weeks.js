/* ============================================================
   The weeks of Technical Skills II — one list, two readers.

   `lectures/index.html` renders its rows from this file, and
   gen-d.js builds the week-to-week nav in every lecture's rail
   from it. Adding a week is one entry here; nothing else needs
   to be touched.

   Order is the teaching order. `slug` is the folder.

   `status` is where the week has got to, and the index shows it:
     'done'  — finished. A door, and the card says whether the site has it.
     'open'  — a door, and the card says IN PROGRESS. For a week Batu wants
               reachable while it is still being made. Added 08-09-2026: the
               only way to give week 2 a door was 'done', which announced it
               as published while we were working on it and while nothing had
               been pushed at all.
     'wip'   — no door. The address still works for him.
     'todo'  — not started
   ('live' is read as 'wip' so nothing written earlier breaks.)
   ============================================================ */
window.TS2_WEEKS = [
  {
    n: '1',
    slug: '01-introduction',
    title: 'Introduction',
    desc: 'Who is teaching, what the course is, the five modules, the learning goals and the assessment criteria.',
    status: 'done',
  },
  {
    n: '2',
    slug: '02-composition-format',
    title: 'Composition & Format',
    desc: 'Aspect ratio, sensor and film size, crop factor, and what a crop costs. Gaze, composition, and the form exercise.',
    status: 'done',
  },
];

/* Not a teaching week — the format catalogue. Listed separately. */
window.TS2_REFERENCE = [
  {
    n: '0',
    slug: '00-catalogue',
    title: 'Catalogue',
    desc: 'The layout catalogue — every page type the lectures are written in, shown at its smallest and its fullest.',
    status: 'reference',
  },
];
