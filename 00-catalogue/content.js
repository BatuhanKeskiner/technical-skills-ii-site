/* ============================================================
   Week #0 · Catalogue — the layouts a lecture is written in
   ------------------------------------------------------------
   One chapter per layout. Each layout is shown twice: with the
   least content it is meant to carry, and with the most. If a
   page does not fit one of these, it is reported, not invented.
   The written spec is Lectures/CONTRACT.md.

   Every step names its layout and carries a title. Image names
   are the week's own assets/ folder. Nothing here sets a size,
   a colour or a font.
   ============================================================ */

window.TS2_WEEK = {
  course: 'Technical Skills II',
  institution: 'KABK · BA Photography',
  year: '2026–27',
  number: '0',
  title: 'Catalogue',
  standfirst: 'Eleven layouts, each at its least and its most, on one screen.',
  revision: 'v2.1',
  next: { label: 'Week #1 · Introduction', href: '../01-introduction/index.html' },

  chapters: [

    /* ================================================== Schedule */
    {
      id: 'c-plan',
      title: 'Schedule',
      n: '',
      head: { standfirst: 'Every week opens with one. The chapter is always called Schedule.' },
      steps: [
        {
          id: 's-plan',
          layout: 'stacked',
          title: 'Schedule',
          blocks: [
            {
              type: 'schedule',
              plan: [
                'Introduction',
                'Break*',
                'Composition',
                'The Form exercise',
                'Format',
                'End',
              ],
              classes: [
                { name: 'PHft2A', group: 'Full time', when: 'Thursday 10.09 · morning',
                  times: ['09:30', '10:30', '10:40', '11:20', '11:50', '12:30'] },
                { name: 'PHft2B', group: 'Full time', when: 'Thursday 10.09 · afternoon',
                  times: ['13:30', '14:30', '14:40', '15:20', '15:50', '16:30'] },
                { name: 'PHptc2', group: 'Part time', pt: true, when: 'Monday 14.09 · afternoon',
                  times: ['13:30', '14:30', '14:40', '15:20', '15:50', '16:30'] },
              ],
            },
          ],
        },
      ],
    },

    /* ================================================== statement */
    {
      id: 'c-statement',
      title: 'Statement',
      n: 'L1',
      part: 'a',
      partTitle: 'Words',
      head: { kicker: 'Part A · Words', standfirst: 'One claim. The sentence that must read from the back of the room.' },
      steps: [
        {
          id: 's-statement-min',
          layout: 'statement',
          title: 'One sentence, alone',
          blocks: [
            { type: 'lineBig', html: 'A 3D → 2D transformation happens.' },
          ],
        },
        {
          id: 's-statement-max',
          layout: 'statement',
          title: 'A statement, and what backs it',
          blocks: [
            { type: 'lineBig', html: 'Composition is not decoration. It is how the picture tells you what matters.' },
            { type: 'line', html: 'Hierarchy, fragility, what must be attended to: structural blocks, light and dark, symmetry, the rules of form.' },
            { type: 'quote', html: 'The photograph is not what was photographed. It is something else.', who: 'Garry Winogrand' },
          ],
        },
      ],
    },

    /* ================================================== question */
    {
      id: 'c-question',
      title: 'Question',
      n: 'L2',
      part: 'a',
      head: { kicker: 'Part A · Words', standfirst: 'A question put to the room. The page waits for an answer.' },
      steps: [
        {
          id: 's-question-min',
          layout: 'question',
          title: 'A question, alone',
          blocks: [
            { type: 'lineBig', html: 'How do we see?' },
          ],
        },
        {
          id: 's-question-max',
          layout: 'question',
          title: 'A question, and the way into it',
          blocks: [
            { type: 'lineBig', html: 'Where did your eyes go first, and where did they go next?' },
            { type: 'line', html: 'Look at the painting for thirty seconds. Then we compare.' },
          ],
        },
      ],
    },

    /* ================================================== argument */
    {
      id: 'c-argument',
      title: 'Argument',
      n: 'L3',
      part: 'a',
      head: { kicker: 'Part A · Words', standfirst: 'Words only. Reading copy the page keeps for the week after.' },
      steps: [
        {
          id: 's-argument-min',
          layout: 'argument',
          title: 'A claim and its reasoning',
          blocks: [
            { type: 'line', html: 'The world in front of the camera is open in every direction and has depth. The photograph has neither.' },
            { type: 'text', paras: [
              'It stops at four edges and it is flat. Everything we call photography happens in that transformation, and it is never neutral.',
            ] },
          ],
        },
        {
          id: 's-argument-max',
          layout: 'argument',
          title: 'A claim, its reasoning, its caveat',
          blocks: [
            { type: 'line', html: 'Photographers begin their relationship with composition by a more indirect route.' },
            { type: 'text', paras: [
              'In painting you start with an empty canvas. You choose the canvas and sketch the distribution of objects in the frame before the work is made, so composition is explicit from the very start of the process.',
              'In photography you cut a section out of the existing world and simplify it. The distribution of objects inside the frame is not decided in advance. It is found, and then it is chosen.',
              'In film, another lens-based practice, everything in the frame passes through the control of tens or hundreds of people. In the final frame everything is placed and constructed deliberately.',
              'So the photographer arrives at composition late, from the world rather than from the sheet, and has to learn to see the frame before the subject.',
              'Where you stand, which lens you use, how you hold the frame and at which moment you press the shutter all change the frame you get. The same world gives an endless number of pictures.',
            ] },
            { type: 'note', html: 'Reading copy is never hidden. The page serves the lecture and the week after.' },
          ],
        },
      ],
    },

    /* ================================================== list */
    {
      id: 'c-list',
      title: 'List',
      n: 'L4',
      part: 'a',
      head: { kicker: 'Part A · Words', standfirst: 'An enumeration that is the page. Goals, outcomes, promises.' },
      steps: [
        {
          id: 's-list-min',
          layout: 'list',
          title: 'A bare list',
          blocks: [
            { type: 'bulBig', items: [
              'Visual Literacy',
              'Photographic Toolkit',
              'Visual Language',
            ] },
          ],
        },
        {
          id: 's-list-max',
          layout: 'list',
          title: 'A list, headed and glossed',
          blocks: [
            { type: 'bulBig', items: [
              'Visual Literacy',
              'Photographic Toolkit',
              'Visual Language',
              'Planning and Execution',
              'Working With Light',
              'Colour and Print',
            ] },
          ],
        },
      ],
    },

    /* ================================================== criteria */
    {
      id: 'c-criteria',
      title: 'Criteria',
      n: 'L5',
      part: 'a',
      head: { kicker: 'Part A · Words', standfirst: 'One assessment domain. The official wording right, what it asks of you left.' },
      steps: [
        {
          id: 's-criteria-min',
          layout: 'criteria',
          title: 'Two criteria, side by side',
          blocks: [
            { type: 'card', cc: 'var(--domain-research)', html: 'You are able to research topics and visual strategies in a methodical and organized way. You understand why producing work is part of doing research and leads to a better understanding of your role as a photographer.' },
            { type: 'bul', items: [
              'Finding relevant visual resources and references',
              'Keeping a logbook that shows the route, not only the result',
              'Testing before deciding',
            ] },
          ],
        },
        {
          id: 's-criteria-max',
          layout: 'criteria',
          title: 'Criteria, with the work beside them',
          blocks: [
            { type: 'card', cc: 'var(--domain-create)', html: 'You show an urge and desire to experiment and produce visual works in all stages of the process. By raising your photographic skills to a professional standard, you prove to be able to articulate yourself more precisely.' },
            { type: 'bul', items: [
              'Trusting the process',
              'Embracing the errors and failures',
              'Learning by doing it, learning from mistakes',
              'Being open to experiment',
              'Shooting, showing, bringing <em class="term">enough</em> images',
              'Printing early, printing often',
              'Naming the technical decision behind every frame you show',
            ] },
          ],
        },
      ],
    },

    /* ================================================== plate */
    {
      id: 'c-plate',
      title: 'Plate',
      n: 'L6',
      part: 'b',
      partTitle: 'Pictures',
      head: { kicker: 'Part B · Pictures', standfirst: 'The photograph is the subject. Picture left, large, words right and smaller.' },
      steps: [
        {
          id: 's-plate-min',
          layout: 'plate',
          title: 'One upright picture, read',
          blocks: [
            { type: 'figure', src: 'sander-01.jpg', alt: 'A pastry cook holding a bowl, photographed frontally', caption: 'August Sander, <i>Pastry Cook</i>, 1928.' },
            { type: 'line', html: 'Frontal, central, still: the composition is the man’s own posture.' },
          ],
        },
        {
          id: 's-plate-max',
          layout: 'plate',
          title: 'An upright picture, read closely',
          blocks: [
            { type: 'figure', src: 'edgerton-01.jpg', alt: 'A bullet passing through an apple, frozen by strobe', caption: 'Harold Edgerton, <i>Bullet Through Apple</i>, 1964.' },
            { type: 'line', html: 'Read the picture as a photographer before you read it as a viewer.' },
            { type: 'bul', items: [
              'Analyse an image from a photographic perspective: camera, lighting, focal length, technique',
              'Read how composition, light, exposure and equipment carry meaning',
              'Recognise a photographer\u2019s work and place it in a wider visual culture',
              'Name the one decision that made the picture possible',
              'Say what would be lost if that decision changed',
            ] },
            { type: 'desc', html: 'A microsecond flash, a dark room, a sound trigger. The technique is the meaning.' },
          ],
        },
      ],
    },

    /* ================================================== split */
    {
      id: 'c-split',
      title: 'Split',
      n: 'L7',
      part: 'b',
      head: { kicker: 'Part B · Pictures', standfirst: 'Argument left, one picture right. The words lead, the picture supports.' },
      steps: [
        {
          id: 's-split-min',
          layout: 'split',
          title: 'Words beside a picture',
          blocks: [
            { type: 'line', html: 'In painting the canvas is empty. Composition is decided before the work is made.' },
            { type: 'figure', src: 'a3-painting.jpg', alt: 'A painter\u2019s canvas with the composition sketched in', caption: 'The canvas is chosen first.' },
          ],
        },
        {
          id: 's-split-max',
          layout: 'split',
          title: 'Words, picture, and the run of them',
          blocks: [
            { type: 'line', html: 'In film, everything in the frame passes through the control of tens or hundreds of people.' },
            { type: 'text', paras: [
              'A produced film is composed the way a painting is: the set is built, the light is placed, the actor is blocked to a mark. In the final frame nothing is accidental.',
              'Photography sits between the two. The world is given, but the frame is chosen, and the choice is the composition.',
            ] },
            { type: 'note', html: 'Three lens-based practices, three routes to the same question: what goes where.' },
            { type: 'figure', src: 'a3-film-set.jpg', alt: 'A film set with crew, lights and camera around one frame', caption: 'A film set: the frame is constructed, not found.' },
          ],
        },
      ],
    },

    /* ================================================== stacked */
    {
      id: 'c-stacked',
      title: 'Stacked',
      n: 'L8',
      part: 'b',
      head: { kicker: 'Part B · Pictures', standfirst: 'Words above, one full-width device beneath: a gallery, an interactive, a comparison, a brief.' },
      steps: [
        {
          id: 's-stacked-min',
          layout: 'stacked',
          title: 'A wide picture, and what to look for',
          blocks: [
            { type: 'line', html: 'Four photographers, four compositional approaches.' },
            { type: 'gallery', images: [
              { src: 'guler-01.jpg', alt: 'A street in Istanbul in fog', ar: 1.5 },
              { src: 'soth-01.jpg', alt: 'A man in overalls holding two model aeroplanes', ar: 1.25 },
              { src: 'walker-02.jpg', alt: 'A staged fashion tableau', ar: 1.5 },
              { src: 'sander-01.jpg', alt: 'A pastry cook holding a bowl', ar: 0.78 },
            ], caption: 'Ara Güler · Alec Soth · Tim Walker · August Sander.' },
          ],
        },
        {
          id: 's-stacked-picture',
          layout: 'stacked',
          title: 'A single picture',
          blocks: [
            { type: 'line', html: 'Shelter, and a body in the foetal position: the circle holds her, the thirds hold the circle.' },
            { type: 'figure', src: 'deck-19.jpg', alt: 'A still from Gravity: a woman curled in the foetal position inside a circular airlock', caption: '<i>Gravity</i>, dir. Alfonso Cuarón, 2013.' },
          ],
        },
        {
          id: 's-stacked-demo',
          layout: 'stacked',
          title: 'An interactive',
          blocks: [
            { type: 'line', html: 'Move the aperture and watch the zone of sharpness open and close.' },
            { type: 'demo', id: 'dof', caption: 'Distance and focal length move it too. Depth is never a property of the lens alone.' },
          ],
        },
        {
          id: 's-stacked-demo-brief',
          layout: 'stacked',
          title: 'An interactive not yet written',
          blocks: [
            { type: 'line', html: 'A placeholder is the instrument\u2019s brief: it reserves the shape the instrument will have, so the page can be built and read before the thing exists.' },
            { type: 'demoPlaceholder', label: 'Depth of field', size: 'm', shape: 'landscape', fullscreen: true,
              brief: 'Two sliders \u2014 aperture and subject distance \u2014 over a photograph, showing what falls out of focus as the aperture opens.',
              caption: 'Size: full width, large, medium, small. Shape: landscape, square, portrait. Position: centred, left, right. It says whether it has to open full screen.' },
          ],
        },
        {
          id: 's-stacked-carousel',
          layout: 'stacked',
          title: 'A slideshow',
          blocks: [
            { type: 'line', html: 'One plate at a time, with the others waiting underneath it. Click the picture for the next; click a thumbnail to go straight to it.' },
            { type: 'carousel', images: [
              { src: 'guler-01.jpg', alt: 'A street in Istanbul in fog' },
              { src: 'soth-01.jpg', alt: 'A man in overalls holding two model aeroplanes' },
              { src: 'sander-01.jpg', alt: 'A pastry cook holding a bowl' },
            ], caption: 'Ara Güler · Alec Soth · August Sander. The counter reads the plate you are on.' },
          ],
        },
        {
          id: 's-stacked-trio',
          layout: 'stacked',
          title: 'A comparison',
          blocks: [
            { type: 'line', html: 'Three distances to one kind of subject: one large, two beside it.' },
            { type: 'trio', big: { src: 'keskiner-05-madonna.jpg', alt: 'A staged interior' },
              small: [ { src: 'keskiner-10-hilton.jpg', alt: 'An architectural interior' }, { src: 'keskiner-03-toros.jpg', alt: 'A white car on red' } ],
              caption: 'Batuhan Keskiner. The first stacks the room onto the subject, the second holds it back, the third flattens the object into a graphic.' },
          ],
        },
        {
          id: 's-stacked-max',
          layout: 'stacked',
          title: 'The assignment, fully set out',
          blocks: [
            { type: 'line', html: 'The assignment, on its own page, with the deadline you will be held to.' },
            { type: 'brief', code: 'TS2-01', due: '17.09 · 18:00', title: 'Photogram',
              brief: 'Three photograms on one theme, made without a camera. The object, the light and the paper are your whole vocabulary.',
              criteria: [
                'A deliberate choice of objects and their placement on the paper',
                'Exposure and development you can repeat',
                'A contact-sheet page showing the tests that led to the three',
                'A 100-word note naming what the light did',
              ],
              deliverables: ['3 × photogram, dry-mounted', 'Test sheet', '100-word note'] },
          ],
        },
      ],
    },

    /* ================================================== duo */
    {
      id: 'c-duo',
      title: 'Duo',
      n: 'L9',
      part: 'b',
      head: { kicker: 'Part B · Pictures', standfirst: 'Two pictures side by side, equal weight. For a comparison of two.' },
      steps: [
        {
          id: 's-duo-min',
          layout: 'duo',
          title: 'Two pictures compared',
          blocks: [
            { type: 'figure', src: 'guler-01.jpg', alt: 'A street in Istanbul in fog', caption: 'Ara Güler, Istanbul, 1958.' },
            { type: 'figure', src: 'guler-02.jpg', alt: 'A ferry on the Bosphorus', caption: 'Ara Güler, Istanbul, 1965.' },
          ],
        },
        {
          id: 's-duo-max',
          layout: 'duo',
          title: 'Two pictures, and the document behind them',
          blocks: [
            { type: 'line', html: 'The same world gives an endless number of pictures. Two photographers, one city.' },
            { type: 'figure', src: 'walker-01.jpg', alt: 'A staged scene with a giant prop', caption: 'Tim Walker: the frame is built before the shutter.' },
            { type: 'figure', src: 'soth-02.jpg', alt: 'A portrait in a domestic interior', caption: 'Alec Soth: the frame is found, then held.' },
          ],
        },
      ],
    },

    /* ================================================== docfull */
    {
      id: 'c-docfull',
      title: 'Document',
      n: 'L10',
      part: 'c',
      partTitle: 'Devices',
      head: { kicker: 'Part C · Devices', standfirst: 'A scanned document is the page. It has to be read, not glanced at.' },
      steps: [
        {
          id: 's-docfull',
          layout: 'docfull',
          title: 'Assessment criteria',
          blocks: [
            { type: 'doc', src: 'b-assessment-criteria.png', alt: 'Assessment criteria table, BA Photography, KABK', mark: 'year2', caption: 'Assessment criteria · BA Photography · KABK. Second year highlighted.' },
          ],
        },
      ],
    },

    /* ================================================== poster */
    {
      id: 'c-poster',
      title: 'Poster',
      n: 'L11',
      part: 'c',
      head: { kicker: 'Part C · Devices', standfirst: 'One object the room must act on, the words centred beneath it.' },
      steps: [
        {
          id: 's-poster',
          layout: 'poster',
          title: 'Scan the QR',
          blocks: [
            { type: 'qr', label: 'Mentimeter QR<br>assets/menti-qr.png' },
            { type: 'biglink', big: true, before: 'or type', href: 'https://menti.com', label: 'menti.com · code — — — —' },
            { type: 'line', html: 'A quick test. Short, anonymous, not graded.' },
          ],
        },
      ],
    },

    /* ================================================== arrangement (new) */
    {
      id: 'c-arrange',
      title: 'Arrangement',
      n: 'M1',
      part: 'd',
      partTitle: 'Arrangement',
      head: { standfirst: 'A page that says where its blocks go. Rows, each item with a width and an alignment — the replacement for choosing one of eleven recipes.' },
      steps: [
        {
          id: 's-arr-centre',
          title: 'A picture centred, words underneath',
          blocks: [
            { type: 'figure', src: 'keskiner-10-hilton.jpg', alt: 'A hotel interior',
              place: { row: 1, w: '1/2', align: 'centre' } },
            { type: 'line', html: 'The words sit under the picture because that is where they were put — not because a layout decided it.',
              place: { row: 2, w: '2/3', align: 'centre' } },
          ],
        },
        {
          id: 's-arr-left',
          title: 'Half and half',
          blocks: [
            { type: 'figure', src: 'keskiner-05-madonna.jpg', alt: 'A portrait',
              place: { row: 1, w: '1/2', align: 'left' } },
            { type: 'text', paras: [
              'Two items in one row, each a half. Swap their order and the picture goes right; change the widths and it becomes a third against two thirds.',
            ], place: { row: 1, w: '1/2' } },
          ],
        },
        {
          id: 's-arr-uneven',
          title: 'A third against two thirds',
          blocks: [
            { type: 'text', paras: ['A narrow column of words beside a wide picture. The widths snap to sixths, so the measure can never come out wrong.'],
              place: { row: 1, w: '1/3' } },
            { type: 'figure', src: 'soth-01.jpg', alt: 'A man holding two model aeroplanes',
              place: { row: 1, w: '2/3' } },
          ],
        },
        {
          id: 's-arr-three',
          title: 'Three across',
          blocks: [
            { type: 'figure', src: 'keskiner-03-toros.jpg', alt: 'A car', place: { row: 1, w: '1/3', align: 'centre' } },
            { type: 'figure', src: 'keskiner-05-madonna.jpg', alt: 'A portrait', place: { row: 1, w: '1/3' } },
            { type: 'figure', src: 'dijkstra-01.jpg', alt: 'A girl on a beach', place: { row: 1, w: '1/3' } },
            { type: 'line', html: 'Three items in one row, each a third.', place: { row: 2, w: 'full', align: 'centre' } },
          ],
        },
        {
          id: 's-arr-same',
          title: 'Pictures at one height',
          blocks: [
            { type: 'figure', src: 'keskiner-03-toros.jpg', alt: 'A car',
              place: { row: 1, w: '1/3', align: 'centre', lvl: 'same' } },
            { type: 'figure', src: 'keskiner-05-madonna.jpg', alt: 'A portrait',
              place: { row: 1, w: '1/3', lvl: 'same' } },
            { type: 'figure', src: 'dijkstra-01.jpg', alt: 'A girl on a beach',
              place: { row: 1, w: '1/3', lvl: 'same' } },
            { type: 'line', html: 'Three shapes, one height. The row stretches to its tallest and each picture is cropped to it, so the line is level instead of stepping.',
              place: { row: 2, w: 'full', align: 'centre' } },
          ],
        },
        {
          id: 's-arr-level',
          title: 'One height, nothing cropped',
          blocks: [
            { type: 'figure', src: 'keskiner-03-toros.jpg', alt: 'A car',
              place: { row: 1, w: '1/3', lvl: 'level' } },
            { type: 'figure', src: 'keskiner-05-madonna.jpg', alt: 'A portrait',
              place: { row: 1, w: '1/3', lvl: 'level' } },
            { type: 'figure', src: 'dijkstra-01.jpg', alt: 'A girl on a beach',
              place: { row: 1, w: '1/3', lvl: 'level' } },
            { type: 'line', html: 'The same level line, but every picture whole: each one takes the width its own shape asks for, so nothing is cut away.',
              place: { row: 2, w: 'full', align: 'centre' } },
          ],
        },
        {
          id: 's-arr-nudge',
          title: 'Nudged down the grid',
          blocks: [
            { type: 'figure', src: 'keskiner-03-toros.jpg', alt: 'A car', place: { row: 1, w: '1/3' } },
            { type: 'figure', src: 'dijkstra-01.jpg', alt: 'A girl on a beach', place: { row: 1, w: '1/3', y: 3 } },
            { type: 'figure', src: 'soth-01.jpg', alt: 'A man holding two model aeroplanes', place: { row: 1, w: '1/3', y: 6 } },
            { type: 'line', html: 'The second and third are nudged down the grid in steps — never to an arbitrary pixel.', place: { row: 2, w: 'full' } },
          ],
        },
      ],
    },
    {
      id: 'c-examples',
      title: 'Examples',
      n: 'N1',
      part: 'e',
      partTitle: 'Examples',
      head: { standfirst: 'Seven pages built the way the design system builds them: a monospaced label under a rule, data set label-left and figure-right, the accent kept for one thing on a page, and a composition that closes at the foot instead of trailing off.' },
      steps: [
        {
          id: 's-ex-annot',
          layout: 'stacked',
          title: 'A photograph, annotated',
          edge: 'TS-II \u00b7 Optics \u00b7 Sheet 01',
          blocks: [
            { type: 'label', html: 'A1 / Optics \u2014 depth of field', place: { row: 1, col: 1, w: 'full' } },
            { type: 'annotate', marks: [
              { label: 'Aperture', value: 'f/2.0 \u2014 two stops down', at: 42 },
              { label: 'Focal plane', value: 'Near eye \u2014 1.4 m', at: 58 },
              { label: 'Circle of confusion', value: '0.030 mm', at: 30, tone: 'signal' },
            ], place: { row: 2, col: 1, w: '1/3', fillH: true, rgrow: true } },
            { type: 'figure', src: 'soth-01.jpg', alt: 'A portrait held on the near eye',
              caption: '85 mm \u00b7 f/2.0 \u00b7 1/250 s \u00b7 ISO 200 \u2014 focus held on the near eye',
              place: { row: 2, col: 2, w: '2/3', fillH: true } },
          ],
        },
        {
          id: 's-ex-three',
          layout: 'stacked',
          title: 'One subject, three exposures',
          blocks: [
            { type: 'label', html: 'A1 / Exposure \u2014 one stop apart', place: { row: 1, col: 1, w: 'full' } },
            { type: 'figure', src: 'walker-01.jpg', alt: 'Two stops under', caption: 'A \u2014 two stops under',
              place: { row: 2, col: 1, w: '1/3', fit: 'landscape', ruled: true, rgrow: true } },
            { type: 'rows', items: [['Aperture', 'f/8'], ['Shutter', '1/2000 s'], ['ISO', '200']],
              place: { row: 2, col: 1, w: '1/3' } },
            { type: 'desc', html: 'The shadows block up and stay there.', place: { row: 2, col: 1, w: '1/3' } },
            { type: 'figure', src: 'walker-02.jpg', alt: 'As metered', caption: 'B \u2014 as metered',
              place: { row: 2, col: 2, w: '1/3', fit: 'landscape' } },
            { type: 'rows', items: [['Aperture', 'f/8'], ['Shutter', '1/500 s'], ['ISO', '200']],
              place: { row: 2, col: 2, w: '1/3' } },
            { type: 'desc', html: 'The whites sit grey, exactly average.', place: { row: 2, col: 2, w: '1/3' } },
            { type: 'figure', src: 'walker-03.jpg', alt: 'Two stops over', caption: 'C \u2014 two stops over',
              place: { row: 2, col: 3, w: '1/3', fit: 'landscape' } },
            { type: 'rows', items: [['Aperture', 'f/8'], ['Shutter', '1/125 s'], ['ISO', '200']],
              place: { row: 2, col: 3, w: '1/3' } },
            { type: 'desc', html: 'The highlights do not come back.', place: { row: 2, col: 3, w: '1/3' } },
          ],
        },
        {
          id: 's-ex-divider',
          layout: 'stacked',
          title: 'A part divider',
          blocks: [
            { type: 'label', html: 'Part A2 / Exposure under pressure', place: { row: 1, col: 1, w: '1/2' } },
            { type: 'quote', html: 'The meter proposes; the photographer decides which tones to keep.',
              place: { row: 2, col: 1, w: '1/2', v: 'bottom', rgrow: true } },
          ],
        },
        {
          id: 's-ex-brief',
          layout: 'stacked',
          title: 'An assignment brief',
          blocks: [
            { type: 'label', html: 'A2 / Assignment 03', place: { row: 1, col: 1, w: 'full' } },
            { type: 'lineBig', html: 'Photograph one subject at six apertures, and print the two frames where depth of field changes what the picture means.',
              place: { row: 2, col: 1, w: '1/2', rgrow: true } },
            { type: 'sheet', title: 'Assignment 03 \u2014 six apertures', kicker: 'weight 30%',
              items: [
                ['Deadline', 'Fri 16 Oct \u2014 18:00'],
                ['Deliverables', '<span class="tag tag-required">Required</span> 2 prints, A4'],
                ['Contact sheet', '36 frames, annotated'],
                ['Capture', 'RAW, manual exposure'],
                ['Assessed on', 'Control of the focal plane'],
                ['Marked by', 'Portfolio review, week 08', 'mark'],
              ],
              place: { row: 2, col: 2, w: '1/2' } },
            { type: 'label', html: 'Conditions', tone: 'quiet', place: { row: 3, col: 1, w: '1/2' } },
            { type: 'desc', html: 'Keep the camera position and the light constant. Submit to the print room, box 03. Late work is marked from B.',
              place: { row: 3, col: 1, w: '1/2' } },
          ],
        },
        {
          id: 's-ex-data',
          layout: 'stacked',
          title: 'A data page',
          marks: true,
          edge: 'Sensor \u00b7 dynamic range \u00b7 TS-II',
          blocks: [
            { type: 'label', html: 'A3 / Sensor \u2014 dynamic range', place: { row: 1, col: 1, w: 'full' } },
            { type: 'stat', value: '14.2', unit: 'stops', label: 'Sensor, base ISO',
              place: { row: 2, col: 1, w: '1/2', v: 'middle', rgrow: true, ruled: true } },
            { type: 'lineBig', html: 'Your eye handles roughly <mark>twenty</mark>.',
              place: { row: 2, col: 2, w: '1/2', v: 'middle' } },
            { type: 'desc', html: 'Everything you decide about exposure is a decision about which six stops to lose.',
              place: { row: 2, col: 2, w: '1/2' } },
            { type: 'sheet', title: 'Against 35 mm', kicker: 'crop factor',
              items: [['Full frame', '1.0\u00d7'], ['APS-C', '1.5\u00d7'], ['Four Thirds', '2.0\u00d7'], ['Medium format', '0.79\u00d7', 'mark']],
              place: { row: 2, col: 2, w: '1/2' } },
          ],
        },
        {
          id: 's-ex-plate',
          layout: 'stacked',
          title: 'A picture and nothing else',
          blocks: [
            { type: 'label', html: 'B1 / Plate', place: { row: 1, col: 1, w: 'full' } },
            { type: 'figure', src: 'edgerton-01.jpg', alt: 'A high-speed photograph',
              caption: 'Harold Edgerton \u2014 a millionth of a second. The page carries one thing, so it is given all of it.',
              place: { row: 2, col: 1, w: 'full', fit: 'landscape', rgrow: true } },
          ],
        },
        {
          id: 's-ex-compare',
          layout: 'stacked',
          title: 'Two pictures at one height',
          blocks: [
            { type: 'label', html: 'B2 / Comparison \u2014 nothing cropped', place: { row: 1, col: 1, w: 'full' } },
            { type: 'figure', src: 'guler-02.jpg', alt: 'An upright photograph',
              caption: 'Ara G\u00fcler \u00b7 upright',
              place: { row: 2, col: 1, w: '1/2', lvl: 'level', rgrow: true } },
            { type: 'figure', src: 'a3-film-set.jpg', alt: 'A film set',
              caption: 'Film set \u00b7 wide',
              place: { row: 2, col: 2, w: '1/2', lvl: 'level' } },
            { type: 'desc', html: 'An upright picture against a wide one, both whole: each takes the width its own shape asks for, so the comparison is about the pictures and not about the crop.',
              place: { row: 3, col: 1, w: '2/3' } },
          ],
        },
      ],
    },

    /* ================================================== P1 · Files
       Two elements, one drawing chosen for each. A PDF is not an element of its
       own — it is one of the things an attachment can be. */
    {
      id: 'c-files',
      title: 'Files',
      n: 'P1',
      part: 'p',
      partTitle: 'Files',
      head: { kicker: 'Part P \u00b7 Files',
              standfirst: 'Two elements: a book, and an attachment. Both ask for themselves in one hairline.' },
      steps: [
        {
          id: 's-file-book',
          layout: 'stacked',
          title: 'Book',
          blocks: [
            { type: 'label', html: 'The plate', place: { row: 1, col: 1, w: '1/2' } },
            { type: 'label', html: 'The shelf', place: { row: 1, col: 2, w: '1/2' } },
            { type: 'ebook', variant: 'b1', title: 'On Photography', author: 'Susan Sontag',
              publisher: 'FSG', year: '1977', pages: '208',
              cover: 'dijkstra-01.jpg', alt: 'Cover',
              file: 'assets/sample.pdf', size: '4.2 MB',
              place: { row: 2, col: 1, w: '1/2' } },
            { type: 'ebook', variant: 'a', title: 'On Photography', author: 'Susan Sontag',
              publisher: 'FSG', year: '1977', pages: '208',
              cover: 'dijkstra-01.jpg', alt: 'Cover',
              file: 'assets/sample.pdf', size: '4.2 MB',
              place: { row: 2, col: 2, w: '1/2' } },
            { type: 'desc', html: 'The plate is a fixed card the width of its own cover, monospace throughout. The shelf lays the same book along a row, for when it sits beside a paragraph.',
              place: { row: 3, col: 1, w: '2/3' } },
          ],
        },
        {
          id: 's-file-attach',
          layout: 'stacked',
          title: 'Attachment',
          blocks: [
            { type: 'label', html: 'The slip', place: { row: 1, col: 1, w: '1/2' } },
            { type: 'label', html: 'The proof', place: { row: 1, col: 2, w: '1/2' } },
            { type: 'pdf', variant: 'a1', name: 'Assignment #1 \u00b7 Format', pages: '4',
              file: 'assets/sample.pdf', size: '820 KB',
              place: { row: 2, col: 1, w: '1/2' } },
            { type: 'pdf', variant: 'b', name: 'Assignment #1 \u00b7 Format', pages: '4',
              file: 'assets/sample.pdf', size: '820 KB',
              preview: 'b-assessment-criteria.png', alt: 'The first page',
              place: { row: 2, col: 2, w: '1/2' } },
            { type: 'desc', html: 'The slip names the file and puts the way to get it underneath, so a reading list stacks. The proof shows the first page, for something whose look matters.',
              place: { row: 3, col: 1, w: '2/3' } },
          ],
        },
        {
          id: 's-clock-and-hole',
          layout: 'stacked',
          title: 'A clock, and a hole',
          blocks: [
            { type: 'label', html: 'Timer', place: { row: 1, col: 1, w: '1/2' } },
            { type: 'label', html: 'To be generated', place: { row: 1, col: 2, w: '1/2' } },
            { type: 'timer', seconds: 300, label: 'Exercise',
              place: { row: 2, col: 1, w: '1/2' } },
            { type: 'generate', what: 'A diagram of what the frame leaves out \u2014 three panels, the same street, three crops.',
              place: { row: 2, col: 2, w: '1/2' } },
            { type: 'desc', html: 'The timer reads from the back of the room and is changed at the lectern: start and pause, a minute either way, reset to what it was set to. The hole is the shape of something not written yet \u2014 give it a place and a size, say what belongs there, and the page can be composed around it.',
              place: { row: 3, col: 1, w: '2/3' } },
          ],
        },
        {
          id: 's-file-kinds',
          layout: 'stacked',
          title: 'The attachment carries anything',
          blocks: [
            { type: 'label', html: 'A hand-out', place: { row: 1, col: 1, w: '1/4' } },
            { type: 'label', html: 'Zip', place: { row: 1, col: 2, w: '1/4' } },
            { type: 'label', html: 'PSD', place: { row: 1, col: 3, w: '1/4' } },
            { type: 'label', html: 'Camera original', place: { row: 1, col: 4, w: '1/4' } },
            { type: 'pdf', name: 'Assignment #1', file: 'assets/sample.pdf', size: '820 KB',
              place: { row: 2, col: 1, w: '1/4' } },
            { type: 'pdf', name: 'Raw files \u00b7 Week 2', file: 'assets/raw-week2.zip', size: '1.2 GB',
              place: { row: 2, col: 2, w: '1/4' } },
            { type: 'pdf', name: 'Retouch, layered', file: 'assets/retouch.psd', size: '240 MB',
              place: { row: 2, col: 3, w: '1/4' } },
            { type: 'pdf', name: 'Camera originals', file: 'assets/frame-0182.dng', size: '48 MB',
              place: { row: 2, col: 4, w: '1/4' } },
            { type: 'label', html: 'A folder', place: { row: 3, col: 1, w: '1/2' } },
            { type: 'label', html: 'Somewhere else \u2014 a link, not a file', place: { row: 3, col: 2, w: '1/2' } },
            { type: 'pdf', name: 'Student tracings \u00b7 2025', kind: 'FOLDER',
              file: 'assets/tracings/', size: '2.4 GB', pages: '31 files',
              place: { row: 4, col: 1, w: '1/2' } },
            { type: 'pdf', name: 'Week 2 \u00b7 full-size scans', kind: 'ZIP',
              link: 'https://www.dropbox.com/scl/fo/example/scans', size: '3.1 GB',
              place: { row: 4, col: 2, w: '1/2' } },
            { type: 'desc', html: 'The mark reads the file\u2019s own ending, so a zip, a TIFF, a PSD and a camera original each say what they are, and each takes the colour it is known by. A folder is drawn as a folder; say <code>kind</code> only to overrule that. Give a <code>link</code> instead of a file and the block sends the room to that page \u2014 for anything too heavy for the site to carry.',
              place: { row: 5, col: 1, w: '2/3' } },
          ],
        },
      ],
    },
  ],
};
