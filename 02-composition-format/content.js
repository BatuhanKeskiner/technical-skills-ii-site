/* ============================================================
   Week #2 · Composition & Format — content source
   ------------------------------------------------------------
   Migrated from the hand-built page (its own inline engine,
   43 steps written as literal HTML) into the shared format.
   Wording, images, credits and running order are unchanged.

   Two pages were added, because a written interactive is the
   subject of its page and never a sidebar to it (CONTRACT §2):
   s-a2b carries the viewfinder instrument that s-a2 asked for,
   s-a8b the foveation instrument that s-a8 asked for.

   Chapter indices are derived from the part and the order —
   the old file's numbering had drifted (A1, A3, A4, A6…) and
   is not preserved. The written spec is ../CONTRACT.md.
   ============================================================ */

window.TS2_WEEK = {
  course: 'Technical Skills II',
  institution: 'KABK · BA Photography',
  year: '2026–27',
  number: '2',
  title: 'Composition & Format',
  standfirst: 'How a three-dimensional world becomes a bounded rectangle, and what the shape and the size of that rectangle decide.',
  revision: 'draft v3.0',
  next: { label: 'Camera I', href: '#' },

  chapters: [
    /* ================================================== 0 · Schedule */
    {
      id: 'c-today',
      title: 'Schedule',
      n: '',
      head: { standfirst: 'Week #2 · Composition & Format' },
      steps: [
        {
          id: 's-0',
          cls: 'title',
          layout: 'stacked',
          title: 'Schedule',
          blocks: [
            {
              type: 'schedule',
              /* HIS TIMETABLE, 09-09-2026: one hour on Composition, a quarter
                 of an hour off, half an hour of exercise, a quarter off, three
                 quarters on Format, a quarter on the assignment. Three hours
                 exactly, so the end times are the ones the studio already had.
                 Only the clocks are written; every duration on the page is the
                 gap to the next row, so the two can never disagree. */
              plan: [
                'Presentation: Composition',
                'Break*',
                'Exercise',
                'Break*',
                'Presentation: Format',
                'Assignment #1: Photogram',
                'End',
              ],
              classes: [
                { name: 'PHft2A', group: 'Full time', when: 'Thursday 10.09 · morning',
                  times: ['09:30', '10:30', '10:45', '11:15', '11:30', '12:15', '12:30'] },
                { name: 'PHft2B', group: 'Full time', when: 'Thursday 10.09 · afternoon',
                  times: ['13:30', '14:30', '14:45', '15:15', '15:30', '16:15', '16:30'] },
                { name: 'PHptc2', group: 'Part time', when: 'Monday 14.09 · afternoon',
                  times: ['13:30', '14:30', '14:45', '15:15', '15:30', '16:15', '16:30'] },
              ],
            },
          ],
        },
      ],
    },

    /* ================================================== A1 · Photography: 3D → 2D */
    {
      id: 'c-seeing',
      title: 'Vision',
      n: 'A1',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'The eye, and how it sees.' },
      steps: [
        {
          id: 's-a5',
          cls: 'white',
          layout: 'stacked',
          title: 'The Evolution of the Eye',
          blocks: [
            { type: 'figure', src: 'a4-eye-evolution.jpg', alt: 'Seven stages: photoreceptor, pigment spot, pigment cup, pinhole, primitive enclosed, primitive lensed, complex camera eye',
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true } },
            { type: 'line', place: { row: 2, col: 1, w: 'full', align: 'centre' }, html: 'Photoreceptor → Pigment spot → Pigment cup → Pinhole → Enclosed → Lensed → Complex camera eye' },
          ],
        },
        {
          id: 's-a5b',
          cls: 'white',
          layout: 'stacked',
          title: 'The Eye as a Camera',
          /* The engraving is on pure white and was sitting on the paper
             ground with its own edge showing, which made it a picture OF an
             engraving. On a white page the plate has no edge, so the eye is
             on the page rather than pasted to it. Words after the picture:
             the eye is the thing to look at first. */
          blocks: [
            { type: 'figure', src: 'a4-eye-anatomy.jpg', alt: 'Engraving of a human eye', cls: 'mid',
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true } },
            { type: 'line', place: { row: 2, col: 1, w: 'full', align: 'centre' }, html: 'Lens · Iris · Retina · Focus' },
            { type: 'text', place: { row: 3, col: 1, w: 'full', align: 'centre' }, paras: [
              'The parallels are exact enough to use as a vocabulary: the lens is the lens, the iris is the aperture, the retina is the sensor, the eye muscles are the focus.',
            ] },
          ],
        },
        {
          id: 's-a6',
          cls: 'white',
          layout: 'stacked',
          title: 'Human Vision Specs',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'If your eyes would be a camera..' },
            /* The eye written out as if it were a body somebody could buy.
               COLOUR: ≈ 10 million distinguishable colours is the CIE 1931
               figure, which is about 24 bits. It is the number usually quoted
               and it is not settled — other measurements put it nearer 2
               million, about 20 bits — so it is given as an approximation and
               the paragraph above already says every figure here misleads. */
            { type: 'sheet', title: 'As a camera', place: { row: 2, col: 2, w: '1/2', ruled: true, rgrow: true, fillH: true }, items: [
              /* ONE FACT PER ROW. "automatic · variable aperture" and
                 "≈ 10 million · about 24-bit" both wrapped in a third of the
                 page and broke mid-phrase, which is how a spec sheet stops
                 looking like one. Split, they fit on one line each. */
              ['Resolution', '576 MP'],
              ['Colour', '≈ 10 million'],
              ['Colour depth', '≈ 24-bit'],
              ['Sight', '3D'],
              ['Angle of view', '120–200° · 22 mm'],
              ['Central field', '40–60°'],
              ['Sharp field', '≈ 2°'],
              ['ISO', '1–800'],
              ['Dynamic range', '22–24 stops'],
              ['White balance', 'automatic'],
              ['Exposure', 'automatic'],
              ['Aperture', 'variable'],
              ['Focus', 'automatic'],
            ] },
            /* THE DIAGRAM ON ITS OWN. Last year's slide carried the two
               field-of-view drawings, a second copy of the spec column beside
               them, and a paragraph explaining both - so the page said
               everything twice and the drawings were the smallest thing on
               it. Cut to the drawings and desaturated, they are the only
               thing here the words cannot say. */
            { type: 'figure', src: 'a5-visual-field.jpg',
              alt: 'Two diagrams of the human visual field: from above, binocular vision and symbol recognition; from the side, upper and lower field with the limits of eye rotation',
              place: { row: 2, col: 1, w: '1/2', v: 'middle', align: 'left' } },
          ],
        },
        {
          id: 's-zsbow',
          layout: 'statement',
          title: 'Our vision',
          centred: true,
          blocks: [
            { type: 'lineBig', place: { row: 1, col: 1, w: '3/4', v: 'middle' },
              html: 'What do we see when we look?' },
          ],
        },
        {
          id: 's-a7',
          layout: 'stacked',
          title: 'What do we see?',
          blocks: [
            { type: 'figure', src: 'deck-11a.jpg', alt: 'Landscape photograph sharp only in the centre, degraded towards the edges',
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true },
              caption: 'Qualitative representation of visual detail using a single glance of the eyes.' },
            { type: 'text', place: { row: 2, col: 1, w: 'full' }, paras: [
              'This is roughly what one fixation gives you: a small sharp centre and a wide, vague surround. Everything you believe you see in detail, you have assembled from many such glances.',
            ] },
          ],
        },
        {
          id: 's-a8',
          layout: 'stacked',
          title: 'Central and peripheral vision',
          blocks: [
            /* W15 · THE SAME SENTENCE WAS SAID TWICE, IN THE SAME CELL. A
               headline saying "sharp vision covers a few degrees" sat above a
               paragraph opening "sharp vision covers only a few degrees at the
               centre". The headline goes. The paragraph's last clause goes too
               - "composition is the attempt to steer that route" is the gloss
               his round of 09-09-2026 struck: "Don't add any comment like
               composition steer etc." */
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'Sharp vision covers only a few degrees at the centre; the rings around it see less and less. Because the sharp area is so small, the eyes never rest — they travel across a scene. A photograph is looked at the same way.' },
            /* THE DICTIONARY SENSE, AND NOTHING ADDED. It carried a gloss of
               my own - "it is what composition steers" - and his round of
               09-09-2026 took it out: "find the proper dictionary defintion of
               it. Don't add any comment like composition steer etc." What is
               left is the lexical entry: the word, what part of speech it is,
               where it comes from, and what it means. */
            { type: 'define', place: { row: 2, col: 1, w: '1/3', ruled: true, rgrow: true }, term: 'Gaze', kind: 'noun',
              etym: 'Middle English <i>gasen</i>, to stare',
              short: 'A steady, intent look.',
              mid: 'A steady, intent look; the act or an instance of looking long and fixedly at something.',
              long: 'A steady, intent look; the act or an instance of looking long and fixedly at something. As a verb: to look steadily and intently, especially in admiration, surprise, or thought.',
              show: 'mid' },
          ],
        },
        {
          id: 's-a8b',
          layout: 'stacked',
          title: 'Simulation: Looking',
          blocks: [
            { type: 'demo', id: 'fovea', fig: 3,
              caption: 'A picture seen the way the eye sees it: sharp where you are looking, falling away to vague and almost colourless at the edge. The sharp patch follows the mouse; a click leaves a mark, and the marks joined up are the route your gaze has taken.' },
          ],
        },
      ],
    },

    /* ================================================== A4 · Gaze */
    {
      id: 'c-gaze',
      title: 'Gaze',
      n: 'A2',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'Where the eyes go.' },
      steps: [
        {
          id: 's-a9',
          layout: 'statement',
          title: 'Gaze',
          centred: true,
          blocks: [
            { type: 'lineBig', place: { row: 1, col: 1, w: 'full', v: 'middle', align: 'centre' }, html: 'Take a look at this painting.' },
          ],
        },
        {
          id: 's-a10',
          layout: 'stacked',
          title: 'Gaze',
          noTitle: true,
          blocks: [
            { type: 'reveal', src: 'a6-repin.jpg', seconds: 15,
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true },
              alt: 'Ilya Repin, Unexpected Visitors (1884)',
              cover: 'Click to see the painting for 15 seconds' },
          ],
        },
        {
          /* HIS NOTE OF 09-09-2026: the same instrument, on the painting they
             have just spent fifteen seconds with. They looked at it whole;
             here they see how little of it was ever sharp at once. Yarbus's
             traces are the page after, so the order is: look, learn how you
             looked, then see it measured. */
          id: 's-a10f',
          layout: 'stacked',
          title: 'How you looked at it',
          blocks: [
            { type: 'demo', id: 'fovea', pin: { plate: 'repin' }, fig: 4,
              caption: 'The same painting, seen the way the eye sees it: sharp only where you are looking. The sharp patch follows the mouse; a click leaves a mark, and the marks joined up are the route your gaze has taken.' },
          ],
        },
        {
          id: 's-a11',
          cls: 'white',
          layout: 'stacked',
          title: 'Yarbus, 1967',
          blocks: [
            { type: 'figure', src: 'deck-15.jpg', alt: 'Repin’s painting beside the same painting with eye-tracking traces superimposed',
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true } },
            { type: 'text', place: { row: 2, col: 1, w: 'full' }, paras: [
              'The white lines are the record of a viewer’s eyes. They do not wander evenly. They go to faces, to the man in the door, to the woman standing up, and they go back and forth between them. The painting was built so that they would.',
            ] },
          ],
        },
        {
          id: 's-a12',
          layout: 'statement',
          title: 'Gaze',
          blocks: [
            { type: 'lineBig', html: 'Take a look at the painting <em>again</em>. This time try to figure out what this painting can be about.' },
          ],
        },
        {
          id: 's-a13',
          layout: 'stacked',
          title: 'Gaze',
          noTitle: true,
          blocks: [
            { type: 'reveal', src: 'a6-repin.jpg', seconds: 15,
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true },
              alt: 'Ilya Repin, Unexpected Visitors, shown again',
              cover: 'Click to see the painting for 15 seconds' },
          ],
        },
        {
          /* HIS NOTE OF 09-09-2026: what the picture is about, and then where
             in the picture you actually read it. Two pages, because those are
             two different acts - one is the story, the other is looking - and
             because this chapter is about the gaze: the second page is the
             chapter's own lesson performed on a painting they have now spent
             thirty seconds with. Facts checked 09-09-2026 against the Russian
             Wikipedia article and A. Boguslawski's reading (Rollins College);
             the words are Claude's, so they are orange until he ticks them. */
          id: 's-a13x',
          layout: 'stacked',
          title: 'Unexpected Visitor',
          blocks: [
            { type: 'figure', src: 'a6-repin.jpg',
              alt: 'Ilya Repin, They Did Not Expect Him: a man in a worn coat entering a room, his family turning towards him',
              place: { row: 1, col: 1, w: '1/2', rgrow: true, fillH: true },
              caption: 'Ilya Repin, <i>Не ждали</i> — They Did Not Expect Him, 1884–88. Oil on canvas, 160.5 × 167.5 cm. State Tretyakov Gallery, Moscow.' },
            { type: 'text', gen: 'a13x', place: { row: 1, col: 2, w: '1/2', v: 'middle' }, paras: [
              'A man in a worn coat has come through the door and stopped, still holding his hat. Nobody has moved towards him. His mother is rising out of her chair with her back to us, so the one face we would most want to see is the one Repin refuses to show. His wife has turned at the piano and is smiling uncertainly — she has not stood up, and she does not go to him. The boy at the table knows him at once. The girl beside the boy does not: she was too small when he left, and she is looking at a stranger. The maid still has her hand on the door she opened, unsure whether she should have.',
              'He is a <i>narodnik</i>, one of the revolutionary populists, home from Siberian exile — and Repin was painting this in the years after Alexander II was assassinated, when a returning political prisoner was a son and a danger to the household at the same time. Nobody in the room says any of that. It is on the wall behind them: Nekrasov and Shevchenko, writers of the democratic opposition; Steuben’s Christ on the road to Golgotha; and a print of the dead emperor. Repin hangs the family’s politics up in the room and lets you find it.',
              'He was never satisfied with the man’s face. He repainted it in 1885, in 1887 and again in 1888 — years after Pavel Tretyakov had bought the canvas — looking for someone who could be a hero and a wreck at once. What he finally left is a man who does not yet know whether he is welcome, and that is the subject: not the reunion, but the second before anybody decides.',
            ] },
          ],
        },
        {
          /* THE CHAPTER'S OWN LESSON, ON A PICTURE THEY NOW KNOW. Gaze is the
             subject of A4; this page says where the eye goes on this painting
             and what it picks up at each stop. Short right-hand phrases: it is
             read from six metres. */
          id: 's-a13y',
          layout: 'stacked',
          title: 'Where you read it',
          blocks: [
            { type: 'figure', src: 'a6-repin.jpg',
              alt: 'The same painting again, to be read place by place',
              place: { row: 1, col: 1, w: '1/2', rgrow: true, fillH: true } },
            { type: 'rows', title: 'Nothing here is written down but communicates', place: { row: 1, col: 2, w: '1/2', ruled: true, rgrow: true, fillH: true }, items: [
              ['The floorboards', 'run to the door, and the eye runs with them — you find him first', 'say'],
              ['The open door', 'cuts the room in two: his half is in the light, theirs is not', 'say'],
              ['The mother, in front', 'rising out of the chair, in black, her face turned away from us', 'say'],
              ['The wife at the piano', 'has turned, and has not stood up', 'say'],
              ['The boy', 'knows him', 'say'],
              ['The girl beside him', 'does not recognize — she was too small when he left', 'say'],
              ['The maid', 'still has her hand on the door, surprise and uncertainty', 'say'],
              ['The wall behind them', 'Nekrasov and Shevchenko, Christ on Golgotha, and Alexander II dead', 'say'],
            ] },
          ],
        },
        {
          id: 's-a14',
          layout: 'stacked',
          title: 'Eye tracking',
          blocks: [
            { type: 'figure', src: 'deck-18.jpg', alt: 'Eye-tracking software; scan paths and heat-maps on a website and on advertisements',
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true } },
            { type: 'text', place: { row: 2, col: 1, w: 'full' }, paras: [
              'What Yarbus recorded in 1967 with laboratory apparatus is now done with an eye-tracking camera, and the results are sold: heat-maps of where people look on a web page or an advertisement. Designers use them to control the gaze. So do painters, cinematographers and photographers — they just do it by composition rather than by measurement.',
            ] },
          ],
        },
      ],
    },

    /* ================================================== A5 · Composition */
    {
      id: 'c-communicates',
      title: 'Composition',
      n: 'A3',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'Structure · Hierarchy · Balance · Symmetry · Lines · Shapes' },
      steps: [
        {
          id: 's-a15',
          layout: 'statement',
          title: 'Composition',
          blocks: [
            { type: 'lineBig', font: 'display', html: 'Composition communicates: <em>hierarchy, fragility, attention, power, tension, calm…</em>' },
          ],
        },
        {
          id: 's-a16',
          layout: 'stacked',
          title: 'Composition',
          blocks: [
            { type: 'figure', place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true }, src: 'deck-19.jpg', alt: 'Gravity: Sandra Bullock curled in the airlock, with a circle and vertical divisions',
              caption: '<i>Gravity</i>, dir. Alfonso Cuarón, 2013.' },
          ],
        },
        {
          id: 's-a17',
          layout: 'stacked',
          title: 'Composition',
          blocks: [
            { type: 'figure', place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true }, src: 'deck-20.jpg', alt: 'Breaking Bad: three men in the desert, a triangle drawn over the frame',
              caption: '<i>Breaking Bad</i>, created by Vince Gilligan, AMC, 2008–2013.' },
          ],
        },
        {
          id: 's-a18',
          layout: 'stacked',
          title: 'Composition',
          blocks: [
            { type: 'figure', place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true }, src: 'deck-21.jpg', alt: 'The Shining: the corridor with the twins, symmetry and one-point perspective lines',
              caption: '<i>The Shining</i>, dir. Stanley Kubrick, 1980.' },
          ],
        },
        {
          id: 's-a19',
          layout: 'stacked',
          title: 'Composition',
          blocks: [
            { type: 'text', place: { row: 2, col: 1, w: 'full' }, paras: [
              'Architecture as a frame within the frame: the receding arches and the floor pattern all converge on one vanishing point, and it sits exactly between the two central figures, so the eye arrives at Plato and Aristotle whichever way it enters. The two are also the picture’s argument — Plato points upward, to the ideal and the divine; Aristotle holds his hand flat over the ground, the earthly and the observed. The crowd is sorted the same way: on Plato’s side the philosophers of the abstract (Pythagoras writing, Heraclitus brooding on the steps), on Aristotle’s the empirical sciences (Euclid bending over his slate, Ptolemy with the globe). Left and right groups mirror each other in mass; the steps and the parapet make horizontal bands that keep the whole crowd readable; the statues of Apollo and Minerva in the niches repeat the split above the heads. Nothing here is accidental: the geometry carries the meaning.',
            ] },
            { type: 'figure', src: 'a7-school-of-athens.jpg', alt: 'Raphael, The School of Athens',
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true },
              caption: 'Raphael, <i>The School of Athens</i>, 1509–11.' },
          ],
        },
        {
          id: 's-a20',
          layout: 'stacked',
          title: 'Composition',
          blocks: [
            { type: 'figure', place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true }, src: 'a7-birth-of-venus.jpg', alt: 'Botticelli, The Birth of Venus',
            /* The lines are not in the picture. They were read off last year's
               slide - the white web drawn on deck-23 - and turned into points,
               so the painting can be shown clean first and the analysis put
               over it afterwards, one set at a time. */
            overlay: { open: '', sets: [
                { id: 'tri', name: 'Triangles', lines: [
                  [0.0047, 0.0088, 0.9945, 0.4386],
                  [0.0047, 0.7494, 0.9826, 0.9912],
                  [0.5607, 0.0075, 0.9945, 0.9912],
                  [0.0047, 0.0113, 0.4361, 0.9912],
                  [0.5584, 0.0075, 0.0047, 0.7444],
                  [0.5591, 0.0075, 0.2516, 0.9912],
                  [0.7468, 0.0075, 0.4385, 0.9912],
                  [0.7476, 0.0088, 0.9945, 0.99],
                  [0.0047, 0.015, 0.2508, 0.9912],
                  [0.5599, 0.0075, 0.9945, 0.4373],
                ] },
              ] },
              caption: 'Botticelli, <i>The Birth of Venus</i>, c. 1485.' },
          ],
        },
        {
          id: 's-a4',
          layout: 'split',
          title: 'Painting · Film · Photography',
          blocks: [
            { type: 'line', html: 'In painting the frame is <em>composed</em> before the work. In film it is <em>constructed</em>. In photography it is <em>cut out</em> of the world.' },
            { type: 'text', paras: [
              'A painter starts from an empty canvas: the canvas is chosen first, the objects are sketched into it, and the distribution of things inside the frame is settled before the work is made. Composition is at the very beginning of the process. A photographer does the opposite: the world already exists, and the frame is a section cut out of it and simplified. The distribution of things is not decided in advance. Film is lens-based too, but on a produced film everything inside the frame passes through the hands of tens or hundreds of people — in the final frame, everything was put there on purpose.',
              'So the photographer’s relationship with composition starts by a more indirect route: not by placing things, but by choosing where to stand and what to leave out.',
            ] },
            /* Three at once made the class read them as a comparison chart.
               One at a time, in the order the paragraph names them, and the
               picture is looked at rather than scanned. No captions: the
               paragraph beside them already says which is which. */
            { type: 'carousel', images: [
              { src: 'a3-painting.jpg', alt: 'An unfinished painted portrait, the sketched composition still visible' },
              { src: 'a3-film-set.jpg', alt: 'A film set in a warehouse: crew, lights, monitor, camera' },
              { src: 'a3-viewfinder.jpg', alt: 'A twin-lens reflex on the beach, the scene framed in its waist-level finder' },
            ] },
          ],
        },
      ],
    },

    /* ================================================== A6 · Composition in Photography */
    {
      id: 'c-compression',
      title: 'Photography: 3D → 2D',
      n: 'A4',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'An open three-dimensional world, a bounded two-dimensional frame.' },
      steps: [
        {
          id: 's-a2',
          layout: 'stacked',
          title: 'Transformation',
          blocks: [
            { type: 'text', place: { row: 1, col: 2, w: '1/3' }, paras: [
              'The world is three-dimensional; from the sensor onwards everything is two-dimensional. The variables on the arrows are the controls you have over the result. Some belong to this week — position, focal length, framing, time — and the rest (exposure, focus, depth of field, dynamic range, sensor type) come in the following weeks. Keep the list; the course is the list.',
            ] },
            /* Drawn, not a screenshot of last year's slide. Every variable is
               on the arrow it acts on: nothing about the sensor is written
               beside the lens, and the chain can be read down without
               crossing to a list on the other side of the page. */
            { type: 'chain', place: { row: 1, col: 1, w: '2/3', v: 'middle' },
              stages: [
                { name: 'Real world', note: '3 dimensional' },
                { name: 'Lens' },
                { name: 'Sensor / Film', note: '2 dimensional' },
                { name: 'Display / Scan' },
                { name: 'Editing' },
                { name: 'Printing' },
              ],
              links: [
                ['Time', 'Position'],
                ['Filters', 'Focal length', 'Depth of field', 'Focus'],
                ['Framing', 'Sensor type', 'Exposure', 'Dynamic range'],
                [], [],
              ] },
          ],
        },
        {
          id: 's-a1',
          layout: 'stacked',
          title: 'Photography: 3D → 2D',
          blocks: [
            /* The line that stood here read "3D open world → 2D constrained
               frame". The page is called Photography: 3D → 2D and the stage
               writes both halves on itself, at the two corners they belong
               to. Three sayings of one thing, and the one that was only words
               went. */
            { type: 'demo', id: 'transform', space: 'model', size: 'page', fig: 1,
              caption: 'The room, the camera standing in it, and the cone in front of the lens — that cone is the frame. Walk with W A S D, look with the arrow keys, and the slider changes the focal length.' },
          ],
        },
      ],
    },

    /* ================================================== A2 · Painting · Film · Photography */
    {
      id: 'c-photographers',
      title: 'Composition in Photography',
      n: 'A5',
      part: 'a',
      partTitle: 'Composition',
      /* NO SUBTITLE. The line named the four photographers and each of the
         four pages is titled with one of their names, so it said on every page
         what the page already said. His note, 09-09-2026: "bu sayfada ve
         subtitle'da ayni cumle tekrar ediyor ... subtitle'i kaldir." (W15) */
      head: { kicker: 'Part A · Composition' },
      steps: [
        {
          id: 's-a21',
          layout: 'statement',
          title: 'Composition in Photography',
          centred: true,
          blocks: [
            { type: 'quote', who: 'Ernst Haas',
              html: '“My theory of composition? Simple: do not release the shutter until everything in the viewfinder feels just right.”' },
          ],
        },
        {
          id: 's-a22',
          layout: 'stacked',
          title: 'Ara Güler',
          blocks: [
            { type: 'gallery', caption: 'Ara Güler', place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true }, images: [
              { src: 'guler-01.jpg', alt: 'Ara Güler: a man lighting a cigarette by a barred window' },
              { src: 'guler-02.jpg', alt: 'Ara Güler: a woman before a ship’s hull, a face in the porthole' },
              { src: 'guler-03.jpg', alt: 'Ara Güler: a man asleep on a chair outside a café' },
            ] },
          ],
        },
        {
          id: 's-a23',
          layout: 'stacked',
          title: 'Alec Soth',
          blocks: [
            { type: 'gallery', place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true },
              caption: 'Alec Soth, <i>Sleeping by the Mississippi</i>', images: [
              { src: 'soth-01.jpg', alt: 'Alec Soth: a man in overalls holding two model aeroplanes' },
              { src: 'soth-02.jpg', alt: 'Alec Soth: a man in a pale suit holding a palm frond' },
            ] },
          ],
        },
        {
          id: 's-a24',
          layout: 'stacked',
          title: 'Tim Walker',
          blocks: [
            { type: 'gallery', caption: 'Tim Walker', place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true }, images: [
              { src: 'walker-02.jpg', alt: 'Tim Walker: Tilda Swinton with porcelain hands and roses' },
              { src: 'walker-03.jpg', alt: 'Tim Walker: Vivienne Westwood with roses' },
              { src: 'walker-04.jpg', alt: 'Tim Walker: a figure in red lace against a bare wall' },
            ] },
          ],
        },
        {
          id: 's-a25',
          layout: 'stacked',
          title: 'August Sander',
          blocks: [
            { type: 'gallery', caption: 'August Sander, <i>Pastry Cook</i>, 1928',
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true }, images: [
              { src: 'sander-01.jpg', alt: 'August Sander, Pastry Cook, 1928' },
            ] },
          ],
        },
      ],
    },

    /* ================================================== A7 · Exercise: Form */
    {
      id: 'c-form',
      title: 'Exercise: Form',
      n: 'A6',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'Fifteen pictures, each reduced to three or four shapes.' },
      steps: [
        {
          /* HIS NOTE OF 09-09-2026: the room should be told the exercise has
             started before it is told how to do it. Said once, big, and
             nothing under it - the words after this are his to say out loud
             (W3), and a second line here would only repeat the first (W15). */
          id: 's-exform',
          layout: 'statement',
          title: 'Exercise: Form',
          noTitle: true,
          centred: true,
          blocks: [
            { type: 'lineBig', place: { row: 1, col: 1, w: 'full', v: 'middle', align: 'centre' }, html: 'Exercise: Form' },
          ],
        },
        {
          id: 's-a26b',
          layout: 'stacked',
          title: 'Only these four shapes',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'Line · Rectangle · Triangle · Circle — the ones that stand out most.' },
            { type: 'svg', place: { row: 2, col: 1, w: 'full', rgrow: true, fillH: true }, svg: '<svg viewBox="0 0 1010 200" role="img" aria-label="Line, rectangle, triangle, circle"><line x1="30" y1="190" x2="170" y2="10" stroke="currentColor" stroke-width="20" stroke-linecap="square"/><rect x="270" y="0" width="200" height="200" fill="currentColor"/><polygon points="640,0 740,200 540,200" fill="currentColor"/><circle cx="910" cy="100" r="100" fill="currentColor"/></svg>' },
          ],
        },
        {
          id: 's-a26c',
          cls: 'white',
          layout: 'stacked',
          title: 'Print → Tracing paper → Drawing',
          blocks: [
            { type: 'figure', place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true }, src: 'form-steps-02.jpg', alt: 'The same landscape three times: the print, the tracing paper laid over it, the drawing of its shapes',
              caption: 'Print · tracing paper · drawing — from last year’s Week #1 deck.' },
          ],
        },
        {
          id: 's-a26d',
          layout: 'stacked',
          title: 'Exercise: Form',
          blocks: [
            { type: 'figure', src: 'form-example-01.jpg', alt: 'A student example: a figure on an orange ground, and the same picture in black and white',
              caption: 'Student example, 2023–24 — to be credited.' },
          ],
        },
        {
          id: 's-a27',
          layout: 'stacked',
          title: 'Pay Attention.',
          blocks: [
            { type: 'figure', place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true }, src: 'form-03.jpg', alt: 'A seated figure in a gown, and its reduction to a circle, a rectangle, a triangle and two lines',
              caption: 'Left the picture, right its skeleton.' },
          ],
        },
        {
          id: 's-a28',
          layout: 'stacked',
          title: 'Exercise: Form',
          blocks: [
            { type: 'stack', caption: 'The subject disappears, the structure stays.', rows: [
              { images: [
                { src: 'form-04.jpg', alt: 'Bathtubs in a garden and their reduction' },
                { src: 'form-10.jpg', alt: 'Botticelli’s Venus and its reduction' },
              ] },
              { images: [
                { src: 'form-12.jpg', alt: 'Zorn’s bather and its reduction' },
                { src: 'form-16.jpg', alt: 'Francesca Woodman and its reduction' },
              ] },
            ] },
          ],
        },
        /* THE TIMER IS THE LAST THING BEFORE PART B. His note of
           09-09-2026: the exercise is what Part A ends on - the room
           works, the clock runs out, and only then does Format start.
           It sat four pages earlier, in the middle of the shapes. */
        {
          id: 's-fyuyo',
          layout: 'statement',
          title: 'Exercise: Form',
          centred: true,
          blocks: [
            { type: 'timer', seconds: 1800, label: 'Exercise',
              place: { row: 1, col: 1, w: 'full', v: 'middle' } },
          ],
        },
      ],
    },

    /* ================================================== B1 · Format */
    /* ================================================== PART B · FORMAT
       Seven chapters, not one. Part A has a heading per subject; Part B had a
       single "B1 · Format" over fifteen pages, so the side of the deck said
       nothing about where you were inside it. His note, 09-09-2026: "2.
       sunumda part B'nin alt basliklari yok." The pages are untouched; only
       the chapters they sit in are new, and A Series joins the first of them.
       The standfirst under each heading is left out on purpose: that line is
       his to write. */
    {
      id: 'c-ratio',
      title: 'Aspect Ratio',
      n: 'B1',
      part: 'b',
      partTitle: 'Format',
      head: { kicker: 'Part B · Format' },
      steps: [
        {
          id: 's-b0',
          layout: 'statement',
          title: 'Format',
          blocks: [
            { type: 'lineBig', html: 'Format: a <em>shape</em> and a <em>size</em>.' },
            { type: 'line', html: 'Ratio decides how you compose and what survives a crop. Size decides what a lens does, how much you enlarge, and how much the image can take before it falls apart.' },
          ],
        },
        {
          id: 's-a3',
          layout: 'stacked',
          title: 'Frame',
          blocks: [
            /* Drawn rather than photographed, and draggable rather than
               fixed: the corner is pinned at the top left and pulled from the
               bottom right, so the two numbers are the two directions a hand
               moves in. The landscape behind does not scale - the frame CUTS
               it, which is the difference between a frame and a zoom and the
               thing the page before this one is about. */
            { type: 'demo', id: 'frame', size: 'page', fig: 3,
              place: { row: 2, col: 1, w: 'full', rgrow: true, fillH: true },
              caption: '' },
            /* the words under the thing they are about, on his round of
               09-09-2026: "Put the text below the interaction." */
            { type: 'text', place: { row: 3, col: 1, w: 'full' }, paras: [
              'Everything two-dimensional has two components: a height and a width. The image lives inside that rectangle and nowhere else. Composition is simply the question of how things are placed inside it — and how consciously that placing is done.',
            ] },
          ],
        },
        {
          id: 's-a2b',
          layout: 'stacked',
          title: 'What the camera sees',
          blocks: [
            { type: 'line', html: 'Turn the camera, change the lens: the same world, a different picture.' },
            { type: 'demo', id: 'transform', space: 'photo', size: 'page', fig: 2,
              caption: 'The same instrument standing inside a photograph instead of a model. You cannot walk here — a photograph has no depth to walk into — so all that is left is where you point and how much you take.' },
          ],
        },
        {
          id: 's-b1',
          layout: 'stacked',
          title: 'Shape',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'The shape of the frame, with no size attached. Written short side first: 2:3, 4:5, 3:4.' },
            { type: 'text', place: { row: 1, col: 1, w: 'full' }, paras: [
              'There are fewer shapes than you would think — 1:1, 4:5, 3:4, 6:7, 2:3, 9:16, 1:2.39 — and each exists because a piece of film, a screen or a sheet of paper was once made that way. In this course ratios are written short side first, the way film formats are named; it is the same shape whichever way you hold the camera.',
            ] },
            /* HIS EDIT OF 09-09-2026, 20:17: his own names for the shapes,
               and the old slide taken out - deck-07 drew the ratios AND the
               formats on one picture, which is the page after this one's job
               now. The list has the column to itself. */
            { type: 'rows', title: 'The shapes', place: { row: 2, col: 1, w: 'full', ruled: true, rgrow: true, fillH: true }, items: [
              ['1:1', 'Square · 6×6, Album Covers'],
              ['4:5', 'Sheet film · Instagram Feed'],
              ['3:4', 'Micro Four Thirds · iPhone · Old TV’s'],
              ['6:7', 'Mamiya RZ67'],
              ['2:3', '35 mm · Mirrorless Cameras, DSLR'],
              ['9:16', 'Stories, Reels, Tiktok'],
              ['1:2.39', 'Anamorphic Widescreen'],
            ], caption: 'Short side first, the way film formats are named.' },
          ],
        },
        {
          id: 's-b1i',
          layout: 'stacked',
          title: 'Aspect Ratio',
          blocks: [
            { type: 'demo', id: 'ratio', fig: 5,
              caption: 'One picture, and every shape cut out of it: the photograph stays where it is and only the frame changes. Underneath, the cameras, screens and places that use the shape you are holding.' },
          ],
        },
        {
          /* HIS PAGE, AND NOW IT HAS ITS PICTURE. He asked on 09-09-2026 for
             an A4 drawn rather than photographed, put in front of the
             instrument that explains it: "bu A4 nedendir diye soracagim.
             Sonra bu acikladigim sunum sayfasinda da aciklayacagim." So the
             sheet carries its two millimetre numbers and nothing else - the
             odd pair is the question, and the answer is the next page. */
          id: 's-r6c4c',
          layout: 'stacked',
          title: 'A4',
          blocks: [
            { type: 'svg', place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true },
              svg: '<svg viewBox="0 0 336 372" role="img" aria-label="A sheet of A4, 210 by 297 millimetres" style="font-family:var(--font-mono);font-size:13px;letter-spacing:.06em"><rect x="62" y="10" width="210" height="297" fill="none" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1" opacity=".55"><line x1="62" y1="330" x2="272" y2="330"/><line x1="62" y1="325" x2="62" y2="335"/><line x1="272" y1="325" x2="272" y2="335"/><line x1="38" y1="10" x2="38" y2="307"/><line x1="33" y1="10" x2="43" y2="10"/><line x1="33" y1="307" x2="43" y2="307"/></g><text x="167" y="352" text-anchor="middle" fill="currentColor">210 mm</text><text x="0" y="0" text-anchor="middle" fill="currentColor" transform="translate(24 158) rotate(-90)">297 mm</text></svg>' },
          ],
        },
        {
          /* THE ANSWER, IN SEVEN STEPS, IN HIS ORDER. See root2.js. */
          id: 's-r2why',
          layout: 'stacked',
          title: 'Why the ratio is 1.414?',
          blocks: [
            { type: 'demo', id: 'root2', fig: 7 },
          ],
        },
      ],
    },

    {
      id: 'c-formats',
      title: 'Analog / Digital Formats',
      n: 'B2',
      part: 'b',
      partTitle: 'Format',
      head: { kicker: 'Part B · Format' },
      steps: [
        {
          id: 's-b2',
          layout: 'argument',
          /* His edits of 09-09-2026: "Analog / Digital Formats" -> "Format"
             at 19:19, "Format" -> "Photography Formats" at 19:52. The chapter
             keeps its own name; these are the page's. */
          title: 'Photography Formats',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'The camera decides the format.' },
            { type: 'text', place: { row: 1, col: 1, w: 'full' }, paras: [
              'A phone is 3:4 on a sensor the size of a fingernail; a mirrorless body is 2:3 on APS-C or full frame; a Hasselblad is 1:1 on 6×6; a view camera is 4:5 on a sheet you load by hand. Film and sensors are the same family of rectangles at very different sizes, and cinema has its own set, from Super 8 to IMAX.',
            ] },
            { type: 'rows', title: 'Film', place: { row: 2, col: 1, w: '1/2', ruled: true, rgrow: true, fillH: true }, items: [
              ['35 mm', '36 × 24 mm · 2:3'],
              ['6 × 6', '56 × 56 mm · 1:1'],
              ['6 × 7', '70 × 56 mm · 6:7'],
              ['4 × 5 in', '95 × 120 mm · 4:5'],
              ['8 × 10 in', '194 × 245 mm · 4:5'],
            ] },
            { type: 'rows', title: 'Digital', place: { row: 2, col: 2, w: '1/2', fillH: true }, items: [
              ['Phone (1/1.28″)', '9.8 × 7.3 mm · 3:4'],
              ['Micro Four Thirds', '17.3 × 13 mm · 3:4'],
              ['APS-C', '23.5 × 15.6 mm · 2:3'],
              ['Full frame', '36 × 24 mm · 2:3'],
              ['Medium format', '44 × 33 mm · 3:4'],
            ] },
          ],
        },
        {
          id: 's-b2i',
          layout: 'stacked',
          title: 'Camera Formats: Digital & Analog',
          blocks: [
            { type: 'demo', id: 'sizechart', fig: 7,
              caption: 'Every camera at one fixed scale, grouped digital, film and cinema. Four at a time, each in its own colour, the dashed ring the image circle a lens must cover. Try adding Super 8 next to 8×10.' },
          ],
        },
      ],
    },

    {
      id: 'c-size',
      title: 'Sensor / Film Size',
      n: 'B3',
      part: 'b',
      partTitle: 'Format',
      head: { kicker: 'Part B · Format' },
      steps: [
        {
          id: 's-b3i',
          layout: 'stacked',
          title: 'Size of the Sensor & Film',
          blocks: [
            { type: 'demo', id: 'formats', fig: 8, pin: { cams: 'ff,phone' },
              caption: 'A phone sensor and a full frame at the same scale. The readout carries the area against full frame and what a 30 cm print asks each of them to grow by.' },
          ],
        },
      ],
    },

    {
      id: 'c-resolution',
      title: 'Resolution',
      n: 'B4',
      part: 'b',
      partTitle: 'Format',
      head: { kicker: 'Part B · Format' },
      steps: [
        {
          id: 's-b4',
          layout: 'argument',
          title: 'What about Megapixels?',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'Megapixels on a sensor. Line pairs per millimetre on film.' },
            /* HIS EDIT OF 09-09-2026, 19:52: the two prose blocks out, the
               film sheet across to the left, and the free half filled with
               real cameras - "so we can see MP is not a factor by itself for
               quality". The second column is what makes the argument: the
               list is ordered by megapixels and the pixel size does not
               follow it. The iPhone has more pixels than a Canon R5 and each
               one is a quarter of its width - a twentieth of its area. Every
               figure is the maker's own; pitch is the sensor width divided by
               the pixels across it. Checked 09-09-2026. */
            { type: 'sheet', title: 'Megapixels', kicker: 'And the size of one pixel', place: { row: 2, col: 1, w: '1/2', ruled: true, fillH: true }, items: [
              ['Nikon Z6 III', '24.5 MP · 5.94 µm'],
              ['Sony α7 IV', '33 MP · 5.12 µm'],
              ['Canon EOS R5', '45 MP · 4.39 µm'],
              ['iPhone 16 Pro', '48 MP · 1.22 µm'],
              ['Fujifilm GFX100 II', '102 MP · 3.76 µm'],
              ['Phase One IQ4', '151 MP · 3.76 µm'],
            ] },
            { type: 'sheet', title: 'Detail on film', kicker: 'At 60 lp/mm', place: { row: 2, col: 2, w: '1/2', fillH: true }, items: [
              ['35 mm', '≈ 12 MP'],
              ['6 × 7', '≈ 55 MP'],
              ['4 × 5 in', '≈ 165 MP'],
              ['8 × 10 in', '≈ 680 MP'],
            ] },
          ],
        },
        {
          id: 's-b4i',
          layout: 'stacked',
          title: 'Resolution: Megapixels, Grain, Sensor Size',
          blocks: [
            { type: 'demo', id: 'resolution', fig: 9,
              caption: 'A hundred microns of the surface: the Bayer grid at its real pitch on a sensor, grain at the resolving power you set on film. Beside it, what the surface holds against what a scan makes of it.' },
          ],
        },
      ],
    },

    {
      id: 'c-cropfactor',
      title: 'Crop Factor',
      n: 'B5',
      part: 'b',
      partTitle: 'Format',
      head: { kicker: 'Part B · Format' },
      steps: [
        {
          id: 's-b5',
          layout: 'argument',
          title: 'What is Crop Factor?',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'The lens projects a circle. The format cuts a rectangle out of it.' },
            { type: 'define', place: { row: 2, col: 1, w: '1/2', ruled: true }, term: 'Crop factor', kind: 'noun',
              etym: 'the ratio of the format’s diagonal to full frame’s 43 mm',
              short: 'How much narrower this format sees, with the same lens.',
              mid: 'The number you multiply a focal length by to find the full-frame lens that frames the same picture. Nothing is magnified: the smaller rectangle is simply shown at the same size afterwards.',
              long: 'A small sensor cuts a small rectangle out of the circle and sees a narrow slice; a large negative sees more of the same circle. The crop factor is the ratio of diagonals against full frame — multiply the focal length by it and you have the full-frame lens that frames the same picture.',
              show: 'mid' },
            { type: 'note', kind: 'tip', place: { row: 2, col: 1, w: '1/2' }, html: 'A normal lens is the diagonal of the format — whatever the format. That is the whole rule, and it is why normal is 43 mm on full frame and 90 mm on 6×7. The 50 mm everyone calls normal is the trade rounding up, not the rule.' },
            { type: 'sheet', title: 'Crop factor', kicker: 'Against full frame', place: { row: 2, col: 2, w: '1/2', fillH: true }, items: [
              ['Micro Four Thirds', '×2.0 · normal 22 mm'],
              ['APS-C', '×1.5 · normal 28 mm'],
              ['Full frame', '×1.0 · normal 43 mm'],
              ['6 × 7', '×0.47 · normal 90 mm'],
              ['4 × 5 in', '×0.28 · normal 153 mm'],
            ] },
          ],
        },
        {
          id: 's-b5i',
          layout: 'stacked',
          title: 'Crop Factor',
          blocks: [
            { type: 'demo', id: 'crop', fig: 10, pin: { cam: 'apsc' },
              caption: 'The lens projects a circle; the format cuts a rectangle out of it. Everything outside the circle is dark, full frame is dashed, and beside it is the photograph this format makes with this lens. A normal lens is the diagonal — one press sets it.' },
          ],
        },
      ],
    },

    {
      id: 'c-delivery',
      title: 'Delivery Ratio & Cropping',
      n: 'B6',
      part: 'b',
      partTitle: 'Format',
      head: { kicker: 'Part B · Format' },
      steps: [
        {
          id: 's-b6',
          layout: 'stacked',
          title: 'Crop',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'The delivery ratio decides the framing before the shutter.' },
            { type: 'text', place: { row: 1, col: 1, w: 'full' }, paras: [
              'You shoot 2:3 because that is what the sensor is; the client wants 4:5 for the feed, 9:16 for a story, 1:1 for a thumbnail. Every ratio change discards a computable share of the frame, and of the pixels with it.',
            ] },
            { type: 'sheet', title: 'What survives', kicker: 'From a 2:3 frame', place: { row: 2, col: 1, w: '1/3', ruled: true, rgrow: true, fillH: true }, items: [
              ['1:1 square', '67%'],
              ['4:5 from landscape', '53%'],
              ['4:5 from portrait', '83%'],
              ['9:16 from landscape', '38%'],
              ['9:16 from portrait', '84%'],
            ] },
            { type: 'note', kind: 'tip', place: { row: 1, col: 1, w: 'full' }, html: 'Turning the camera before the shutter is worth thirty points of the frame. It costs nothing and cannot be recovered afterwards.' },
            { type: 'figure', src: 'deck-08.jpg', alt: 'A woman, a tree, a lamp and a dog: the same scene framed landscape and portrait', place: { row: 2, col: 2, w: '2/3', fillH: true } },
          ],
        },
        {
          id: 's-b6i',
          layout: 'stacked',
          title: 'Delivery Ratio & Cropping',
          blocks: [
            { type: 'demo', id: 'delivery', fig: 11,
              caption: 'The frame you shot, drawn through a real lens at that sensor\u2019s size, with the delivered ratio cut out of it as large as it will go and the rest hatched away. A portrait post is portrait however the camera was held.' },
          ],
        },
      ],
    },

    {
      id: 'c-dof',
      title: 'Depth of Field',
      n: 'B7',
      part: 'b',
      partTitle: 'Format',
      head: { kicker: 'Part B · Format' },
      steps: [
        {
          id: 's-b7',
          layout: 'argument',
          title: 'Depth of Field',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'Depth of Field = focal length, aperture, distance. Keep the lens and the format changes nothing; keep the framing and it changes everything.' },
            { type: 'text', place: { row: 2, col: 1, w: '1/2', ruled: true, rgrow: true }, paras: [
              'Depth of field cares about the focal length, the aperture and the distance — not about the format itself. Put the same lens on a bigger format and nothing about the blur moves: the format only cuts a wider rectangle out of the same circle.',
              'But you rarely keep the lens; you keep the picture. To frame the same thing a larger format needs a longer lens, and a longer lens at the same f-number gives a shallower zone of sharpness. That, and nothing more mysterious, is the “medium-format look” — and it is why the table beside this says <em>same framing</em>.',
              'Multiply the f-number by the crop factor and you have the equivalent aperture: the full-frame f-number that would blur the same.',
            ] },
            /* HIS NOTE OF 09-09-2026 asked for a diagram from shotkit.com.
               The file is behind Cloudflare's bot check and cannot be fetched,
               and it is their drawing, which a public student site should not
               be reprinting. Drawn here instead, in the house's own hand and
               in whatever colour the page is: near limit, plane of focus, far
               limit, and the third-in-front two-thirds-behind that everyone is
               taught and nobody is shown. Swap it for his file if he wants
               that one - the slot is a picture either way. */
            { type: 'svg', place: { row: 3, col: 1, w: 'full', rgrow: true, fillH: true }, svg: '<svg viewBox="0 0 1000 300" role="img" aria-label="Depth of field: near limit, plane of focus and far limit, with the sharp zone between them" style="font-family:var(--font-mono);font-size:15px;letter-spacing:.08em"><rect x="430" y="60" width="390" height="150" fill="currentColor" opacity=".13"/><line x1="120" y1="210" x2="960" y2="210" stroke="currentColor" stroke-width="2" opacity=".45"/><rect x="26" y="150" width="78" height="60" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="112" cy="180" r="22" fill="none" stroke="currentColor" stroke-width="3"/><line x1="120" y1="180" x2="960" y2="52" stroke="currentColor" stroke-width="1" opacity=".35" stroke-dasharray="6 5"/><line x1="120" y1="180" x2="960" y2="242" stroke="currentColor" stroke-width="1" opacity=".35" stroke-dasharray="6 5"/><line x1="430" y1="60" x2="430" y2="230" stroke="currentColor" stroke-width="2" stroke-dasharray="7 5"/><line x1="560" y1="40" x2="560" y2="230" stroke="currentColor" stroke-width="4"/><line x1="820" y1="60" x2="820" y2="230" stroke="currentColor" stroke-width="2" stroke-dasharray="7 5"/><line x1="430" y1="252" x2="820" y2="252" stroke="currentColor" stroke-width="2"/><line x1="430" y1="245" x2="430" y2="259" stroke="currentColor" stroke-width="2"/><line x1="820" y1="245" x2="820" y2="259" stroke="currentColor" stroke-width="2"/><text x="430" y="34" text-anchor="middle" fill="currentColor">Near limit</text><text x="560" y="34" text-anchor="middle" fill="currentColor" font-weight="700">Plane of focus</text><text x="820" y="34" text-anchor="middle" fill="currentColor">Far limit</text><text x="625" y="278" text-anchor="middle" fill="currentColor">Depth of field</text><text x="495" y="200" text-anchor="middle" fill="currentColor" font-size="13" opacity=".75">one third</text><text x="690" y="200" text-anchor="middle" fill="currentColor" font-size="13" opacity=".75">two thirds</text><text x="65" y="238" text-anchor="middle" fill="currentColor" font-size="13" opacity=".75">camera</text></svg>' },
            { type: 'sheet', title: 'Equivalent aperture', kicker: 'Same framing, against full frame', place: { row: 2, col: 2, w: '1/2', fillH: true }, items: [
              ['f/2.8 on Micro Four Thirds', 'f/5.6'],
              ['f/2.8 on APS-C', 'f/4.2'],
              ['f/2.8 on full frame', 'f/2.8'],
              ['f/4 on 6×7', 'f/1.9'],
              ['f/5.6 on 4×5 in', 'f/1.6'],
            ] },
          ],
        },
        {
          id: 's-b7i',
          layout: 'stacked',
          title: 'Depth of Field',
          blocks: [
            { type: 'demo', id: 'dof', fig: 12, pin: { hold: 'framing', view: 'both' },
              caption: 'Step the format and the focal length answers, so the framing does not change. Hold the lens instead and watch the depth stand still.' },
          ],
        },
      ],
    },
    /* ================================================== Close */
    {
      id: 'c-close',
      title: 'Assignment',
      n: '',
      head: { standfirst: 'What goes out.' },
      steps: [
        {
          id: 's-ass',
          layout: 'argument',
          title: 'Assignment #1: Photogram',
          blocks: [
            { type: 'tag', tone: 'signal', place: { row: 1, col: 1, w: 'full' }, text: 'Assignment #1' },
            /* NO DATE HERE. It said "due Week #4, 24.09." while the
               assignments board said Week #5, 01.10 - two places disagreeing
               about a deadline, which is exactly the disagreement a student
               acts on. CLAUDE.md: an assignment never carries its own dates;
               they come from ASSIGNMENTS in make-site.py so the board and the
               brief cannot disagree. The lecture says it goes out; the brief
               says when it is due. */
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'Creating images without a camera.&nbsp;' },
            /* HIS EDIT OF 09-09-2026, 19:19: the spec sheet became a brief.
               The values are the placeholders he typed to shape the block -
               the words in it are his to write, and W3 says I do not write
               them for him. `due` is a placeholder too, and it contradicts
               CLAUDE.md, which says an assignment never carries its own date:
               dates come from ASSIGNMENTS in make-site.py so the board and
               the brief cannot disagree. Left exactly as he submitted it,
               and raised with him rather than silently corrected. */
            /* HIS NOTE OF 09-09-2026: "We need to create a link to the
               Assignment Brief page. So it can lead to the page." The brief
               lives at assignments/01-photogram/ and is one page for the whole
               course; the lecture announces it and hands over the address
               rather than reprinting it. */
            { type: 'link', place: { row: 2, col: 1, w: 'full' },
              href: '../assignments/01-photogram/', kicker: 'Assignment #1 · Photogram',
              text: 'Read the full brief', note: 'On this site' },
          ],
        },
      ],
    },
  ],
};
