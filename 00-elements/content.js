/* ============================================================
   Reference \u00b7 Elements

   Every element the lectures are written with, one to a page,
   centred both ways at the size it comes with. The page title is
   the element's name, so the deck reads as a list of parts.

   This is not a teaching week. It is the thing to look at when
   choosing what to put on a page, and the thing to hand to a
   designer who has to compose with these and has never seen them.

   The pictures are deliberately generic - grey fields with their
   ratio written on them - because the question an element sheet
   answers is about mass and shape, and a photograph of somebody's
   work answers a different one.
   ============================================================ */
window.TS2_WEEK = {
  course: 'Technical Skills II',
  institution: 'KABK',
  year: '2026\u201327',
  number: '0',
  title: 'Elements',
  standfirst: 'Every element, one to a page.',
  revision: '1',
  chapters: [
    {
      id: 'e-linebig',
      title: 'Big line',
      n: 'E1',
      part: 'WORDS',
      steps: [
        {
          id: 'e-linebig',
          layout: 'plate',
          centred: true,
          title: 'Big line',
          blocks: [
            { type: 'lineBig', html: 'A photograph is a decision about what to leave out.', place: { row: 1, col: 1, w: '3/4', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-line',
      title: 'Line',
      n: 'E2',
      part: 'WORDS',
      steps: [
        {
          id: 'e-line',
          layout: 'plate',
          centred: true,
          title: 'Line',
          blocks: [
            { type: 'line', html: 'Format is the frame you choose before anything else is decided.', place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-desc',
      title: 'Quiet line',
      n: 'E3',
      part: 'WORDS',
      steps: [
        {
          id: 'e-desc',
          layout: 'plate',
          centred: true,
          title: 'Quiet line',
          blocks: [
            { type: 'desc', html: 'Written short side first, the way film formats have always been named.', place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-text',
      title: 'Reading text',
      n: 'E4',
      part: 'WORDS',
      steps: [
        {
          id: 'e-text',
          layout: 'plate',
          centred: true,
          title: 'Reading text',
          blocks: [
            { type: 'text', paras: ['In painting you begin with an empty canvas and put things into it, so the composition is decided before the work is made.', 'In photography you cut a section out of a world that is already full. The decision is where to stand and when to stop looking.'], place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-quote',
      title: 'Quote',
      n: 'E5',
      part: 'WORDS',
      steps: [
        {
          id: 'e-quote',
          layout: 'plate',
          centred: true,
          title: 'Quote',
          blocks: [
            { type: 'quote', html: 'The photograph is not what was photographed. It is something else.', who: 'Garry Winogrand', place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-note',
      title: 'Note',
      n: 'E6',
      part: 'WORDS',
      steps: [
        {
          id: 'e-note',
          layout: 'plate',
          centred: true,
          title: 'Note',
          blocks: [
            { type: 'note', kind: 'tip', html: '<b>Meter for the highlights.</b> A blown highlight has no information in it; a dark shadow still does.', place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-bul',
      title: 'List',
      n: 'E7',
      part: 'WORDS',
      steps: [
        {
          id: 'e-bul',
          layout: 'plate',
          centred: true,
          title: 'List',
          blocks: [
            { type: 'bul', marker: 'dot', items: ['Where the light comes from', 'What it falls on', 'What it leaves dark'], place: { row: 1, col: 1, w: '1/2', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-bulbig',
      title: 'Numbered list',
      n: 'E8',
      part: 'WORDS',
      steps: [
        {
          id: 'e-bulbig',
          layout: 'plate',
          centred: true,
          title: 'Numbered list',
          blocks: [
            { type: 'bul', big: true, marker: 'number', items: ['Set the aperture', 'Meter the highlight', 'Make the frame'], place: { row: 1, col: 1, w: '1/2', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-define',
      title: 'Definition',
      n: 'E9',
      part: 'WORDS',
      steps: [
        {
          id: 'e-define',
          layout: 'plate',
          centred: true,
          title: 'Definition',
          blocks: [
            { type: 'define', term: 'Gaze', kind: 'noun', mid: 'The route the eyes take across a picture, and what holds them on the way.', show: 'mid', place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-label',
      title: 'Section label',
      n: 'E10',
      part: 'WORDS',
      steps: [
        {
          id: 'e-label',
          layout: 'plate',
          centred: true,
          title: 'Section label',
          blocks: [
            { type: 'label', html: 'Part B \u00b7 Pictures', place: { row: 1, col: 1, w: '1/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-stat',
      title: 'Number',
      n: 'E11',
      part: 'WORDS',
      steps: [
        {
          id: 'e-stat',
          layout: 'plate',
          centred: true,
          title: 'Number',
          blocks: [
            { type: 'stat', n: '40', unit: '\u00b0', label: 'Angle of view, 50 mm', place: { row: 1, col: 1, w: '1/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-figure',
      title: 'Picture',
      n: 'E12',
      part: 'PICTURES',
      steps: [
        {
          id: 'e-figure',
          layout: 'plate',
          centred: true,
          title: 'Picture',
          blocks: [
            { type: 'figure', src: 'ph-32.svg', alt: 'A placeholder at three by two', caption: 'A landscape picture, with its caption beneath.', place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-figure-tall',
      title: 'Picture, upright',
      n: 'E13',
      part: 'PICTURES',
      steps: [
        {
          id: 'e-figure-tall',
          layout: 'plate',
          centred: true,
          title: 'Picture, upright',
          blocks: [
            { type: 'figure', src: 'ph-23.svg', alt: 'A placeholder at two by three', caption: 'An upright picture takes less width and more height.', place: { row: 1, col: 1, w: '1/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-gallery',
      title: 'Group of pictures',
      n: 'E14',
      part: 'PICTURES',
      steps: [
        {
          id: 'e-gallery',
          layout: 'plate',
          centred: true,
          title: 'Group of pictures',
          blocks: [
            { type: 'gallery', images: [{ src: 'ph-32.svg', alt: 'one' }, { src: 'ph-32.svg', alt: 'two' }, { src: 'ph-32.svg', alt: 'three' }], caption: 'Three pictures read as one object.', place: { row: 1, col: 1, w: 'full', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-card',
      title: 'Card',
      n: 'E15',
      part: 'DEVICES',
      steps: [
        {
          id: 'e-card',
          layout: 'plate',
          centred: true,
          title: 'Card',
          blocks: [
            { type: 'card', cc: 'var(--domain-research)', html: 'You are able to research topics and visual strategies in a methodical and organised way.', place: { row: 1, col: 1, w: '1/2', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-sheet',
      title: 'Table',
      n: 'E16',
      part: 'DEVICES',
      steps: [
        {
          id: 'e-sheet',
          layout: 'plate',
          centred: true,
          title: 'Table',
          blocks: [
            { type: 'sheet', head: ['Ratio', 'Where it comes from'], rows: [['1:1', 'Square \u00b7 6\u00d76, thumbnail'], ['2:3', '35 mm \u00b7 most mirrorless'], ['4:5', 'Sheet film \u00b7 Instagram feed']], place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-rows',
      title: 'Data rows',
      n: 'E17',
      part: 'DEVICES',
      steps: [
        {
          id: 'e-rows',
          layout: 'plate',
          centred: true,
          title: 'Data rows',
          blocks: [
            { type: 'rows', title: 'The shapes', items: [['1:1', 'Square'], ['4:5', 'Sheet film'], ['2:3', '35 mm']], caption: 'Short side first.', place: { row: 1, col: 1, w: '1/2', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-timer',
      title: 'Timer',
      n: 'E18',
      part: 'DEVICES',
      steps: [
        {
          id: 'e-timer',
          layout: 'plate',
          centred: true,
          title: 'Timer',
          blocks: [
            { type: 'timer', seconds: 480, label: 'Exercise \u00b7 make three frames', place: { row: 1, col: 1, w: '1/2', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-generate',
      title: 'To be generated',
      n: 'E19',
      part: 'DEVICES',
      steps: [
        {
          id: 'e-generate',
          layout: 'plate',
          centred: true,
          title: 'To be generated',
          blocks: [
            { type: 'generate', what: 'a diagram of the exposure triangle, ISO against aperture against shutter', place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-interactive',
      title: 'Interactive',
      n: 'E20',
      part: 'DEVICES',
      steps: [
        {
          id: 'e-interactive',
          layout: 'plate',
          centred: true,
          title: 'Interactive',
          blocks: [
            { type: 'demoPlaceholder', label: 'Depth of field', size: 'm', shape: 'landscape', fullscreen: true, brief: 'Turn the aperture and watch what stays sharp. The room should be able to find the distance at which the whole face is in focus.', place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-pdf',
      title: 'Attachment',
      n: 'E21',
      part: 'FILES',
      steps: [
        {
          id: 'e-pdf',
          layout: 'plate',
          centred: true,
          title: 'Attachment',
          blocks: [
            { type: 'pdf', variant: 'a1', name: 'Assignment #1 \u00b7 Format', pages: '4', file: 'assets/sample.pdf', size: '820 KB', place: { row: 1, col: 1, w: '1/2', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-ebook',
      title: 'Book',
      n: 'E22',
      part: 'FILES',
      steps: [
        {
          id: 'e-ebook',
          layout: 'plate',
          centred: true,
          title: 'Book',
          blocks: [
            { type: 'ebook', variant: 'b1', title: 'On Photography', author: 'Susan Sontag', publisher: 'FSG', year: '1977', pages: '208', cover: 'ph-cover.svg', alt: 'Cover', file: 'assets/sample.pdf', size: '4.2 MB', place: { row: 1, col: 1, w: '1/2', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-biglink',
      title: 'Big link',
      n: 'E23',
      part: 'FILES',
      steps: [
        {
          id: 'e-biglink',
          layout: 'plate',
          centred: true,
          title: 'Big link',
          blocks: [
            { type: 'biglink', big: true, before: 'Go to', href: 'https://menti.com', label: 'menti.com \u00b7 code 7525 6830', place: { row: 1, col: 1, w: '2/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
    {
      id: 'e-qr',
      title: 'QR code',
      n: 'E24',
      part: 'FILES',
      steps: [
        {
          id: 'e-qr',
          layout: 'plate',
          centred: true,
          title: 'QR code',
          blocks: [
            { type: 'qr', src: 'ph-11.svg', alt: 'A code the room scans', place: { row: 1, col: 1, w: '1/3', rh: 'centre', v: 'middle' } },
          ],
        },
      ],
    },
  ],
};
