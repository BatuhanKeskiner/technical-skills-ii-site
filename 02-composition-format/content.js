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
              plan: [
                'Composition',
                'Break*',
                'Exercise · Form',
                'The Test',
                'Format · Assignment #1',
                'End',
              ],
              classes: [
                { name: 'PHft2A', group: 'Full time', when: 'Thursday 10.09 · morning',
                  times: ['09:30', '10:30', '10:40', '11:30', '11:50', '12:30'] },
                { name: 'PHft2B', group: 'Full time', when: 'Thursday 10.09 · afternoon',
                  times: ['13:30', '14:30', '14:40', '15:30', '15:50', '16:30'] },
                { name: 'PHptc2', group: 'Part time', when: 'Monday 14.09 · afternoon',
                  times: ['13:30', '14:30', '14:40', '15:30', '15:50', '16:30'] },
              ],
            },
            { type: 'todo', fix: true, html: '<b>Draft timetable</b> — minutes to be fixed by Batu. Same plan for all three groups; PHptc2 takes the lesson the following Monday.' },
          ],
        },
      ],
    },

    /* ================================================== A1 · Photography: 3D → 2D */
    {
      id: 'c-compression',
      title: 'Photography: 3D → 2D',
      n: 'A1',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'An open three-dimensional world, a bounded two-dimensional frame.' },
      steps: [
        {
          id: 's-a1',
          layout: 'stacked',
          title: 'Photography: 3D → 2D',
          blocks: [
            { type: 'line', html: '3D open world → 2D constrained frame' },
            { type: 'demo', id: 'transform', fig: 1,
              caption: 'Transformation — the world behind the camera, and the frame the camera makes of it on its screen. Drag the picture or the pad to pan and tilt; the slider zooms.' },
            { type: 'todo', html: '<b>Interactive v6</b> — pan · tilt on a round pad (drag inside the circle, or drag the picture), zoom on a slider; fullscreen keeps the stage’s aspect ratio (theatre). <i>Photograph</i>: the 360° panorama, blurred. <i>3D model</i>: the space from behind and above, the camera a small model with its field of view. Batu picks one space; the other goes.' },
          ],
        },
        {
          id: 's-a2',
          layout: 'stacked',
          title: 'Transformation',
          blocks: [
            { type: 'line', html: 'Real world → lens → sensor → display → editing → print. The variables in between.' },
            { type: 'text', paras: [
              'The world is three-dimensional; from the sensor onwards everything is two-dimensional. The variables on the right are the controls you have over the result. Some belong to this week — position, focal length, framing, time — and the rest (exposure, focus, depth of field, dynamic range, sensor type) come in the following weeks. Keep the list; the course is the list.',
            ] },
            { type: 'figure', src: 'deck-04.jpg', alt: 'Real World → Lens → Sensor / Film → Display / Scan → Editing → Printing, with the list of variables' },
            { type: 'todo', html: '<b>Interactive (agreed)</b> — one scene; sliders for camera rotation and focal length change what the camera sees; the result appears on the screen/viewfinder of a real camera image.' },
          ],
        },
        {
          id: 's-a2b',
          layout: 'stacked',
          title: 'What the camera sees',
          blocks: [
            { type: 'line', html: 'Turn the camera, change the lens: the same world, a different picture.' },
            { type: 'demo', id: 'viewfinder', fig: 2,
              caption: 'One scene, one camera. Rotation moves the camera through the world; focal length decides how much of it the frame holds. The result is what appears on the camera’s own screen.' },
          ],
        },
        {
          id: 's-a3',
          layout: 'stacked',
          title: 'Height & Width',
          blocks: [
            { type: 'line', html: 'Every two-dimensional object has a height and a width.' },
            { type: 'text', paras: [
              'Everything two-dimensional has two components: a height and a width. The image lives inside that rectangle and nowhere else. Composition is simply the question of how things are placed inside it — and how consciously that placing is done.',
            ] },
            { type: 'figure', src: 'deck-05.jpg', alt: 'A frame with X (height) and Y (width) arrows' },
          ],
        },
      ],
    },

    /* ================================================== A2 · Painting · Film · Photography */
    {
      id: 'c-three',
      title: 'Painting · Film · Photography',
      n: 'A2',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'How the frame is composed differently in each.' },
      steps: [
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
            { type: 'trio',
              big: { src: 'a3-painting.jpg', alt: 'An unfinished painted portrait, the sketched composition still visible' },
              small: [
                { src: 'a3-film-set.jpg', alt: 'A film set in a warehouse: crew, lights, monitor, camera' },
                { src: 'a3-viewfinder.jpg', alt: 'A twin-lens reflex on the beach, the scene framed in its waist-level finder' },
              ],
              caption: 'Left: unfinished portrait, the composition sketched before the paint — painter and source to be credited. Right: a film set; a twin-lens reflex framing the shore — sources to be credited.' },
          ],
        },
      ],
    },

    /* ================================================== A3 · Vision */
    {
      id: 'c-seeing',
      title: 'Vision',
      n: 'A3',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'The eye, and how it sees.' },
      steps: [
        {
          id: 's-a5',
          layout: 'stacked',
          title: 'The Evolution of the Eye',
          blocks: [
            { type: 'figure', src: 'a4-eye-evolution.jpg', alt: 'Seven stages: photoreceptor, pigment spot, pigment cup, pinhole, primitive enclosed, primitive lensed, complex camera eye' },
            { type: 'line', html: 'Photoreceptor → Pigment spot → Pigment cup → Pinhole → Enclosed → Lensed → Complex camera eye' },
          ],
        },
        {
          id: 's-a5b',
          layout: 'stacked',
          title: 'The Eye as a Camera',
          blocks: [
            { type: 'line', html: 'Lens · Aperture · Sensor · Focus' },
            { type: 'text', paras: [
              'The parallels are exact enough to use as a vocabulary: the lens is the lens, the iris is the aperture, the retina is the sensor, the eye muscles are the focus.',
            ] },
            { type: 'figure', src: 'a4-eye-anatomy.jpg', alt: 'Engraving of a human eye' },
          ],
        },
        {
          id: 's-a6',
          layout: 'stacked',
          title: 'Human Vision Specs',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'The eye is not a single-frame camera.' },
            { type: 'text', place: { row: 1, col: 1, w: 'full' }, paras: [
              'Every figure below is true and every one of them is misleading: the eye is not a single-frame camera. It moves in small jumps and only appears to see everything at once.',
            ] },
            { type: 'sheet', title: 'As a camera', place: { row: 2, col: 1, w: '1/3', ruled: true, rgrow: true, fillH: true }, items: [
              ['Resolution', '576 MP'],
              ['Angle of view', 'up to 200°'],
              ['Dynamic range', '≈ 22 stops'],
              ['Sharp field', '≈ 2°'],
              ['Focus', 'automatic'],
              ['Frame rate', 'none — continuous', 'out'],
            ] },
            { type: 'figure', src: 'deck-10.jpg', alt: 'Human Vision Specs and the visual field diagram', place: { row: 2, col: 2, w: '2/3', fillH: true } },
            { type: 'todo', fix: true, html: '<b>Image</b> — the slide on the right now repeats the spec column on the left; only the visual-field diagram is still wanted from it. Batu adds the collage of competing claims about these “specs”, and the diagram on its own.' },
          ],
        },
        {
          id: 's-a7',
          layout: 'stacked',
          title: 'What do we see?',
          blocks: [
            { type: 'text', paras: [
              'This is roughly what one fixation gives you: a small sharp centre and a wide, vague surround. Everything you believe you see in detail, you have assembled from many such glances.',
            ] },
            { type: 'figure', src: 'deck-11a.jpg', alt: 'Landscape photograph sharp only in the centre, degraded towards the edges',
              caption: 'Qualitative representation of visual detail using a single glance of the eyes.' },
            { type: 'todo', fix: true, html: '<b>Image</b> — Batu replaces this with a better visual.' },
          ],
        },
        {
          id: 's-a8',
          layout: 'stacked',
          title: 'Central and peripheral vision',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'Sharp vision covers a few degrees. The gaze is <em>always moving</em>.' },
            { type: 'text', place: { row: 1, col: 1, w: 'full' }, paras: [
              'Sharp vision covers only a few degrees at the centre; the rings around it see less and less. Because the sharp area is so small, the eyes never rest — they travel across a scene. A photograph is looked at the same way, and composition is, to a large degree, the attempt to steer that route.',
            ] },
            { type: 'define', place: { row: 2, col: 1, w: '1/3', ruled: true, rgrow: true }, term: 'Gaze', kind: 'noun',
              etym: 'Middle English <i>gasen</i>, to stare',
              short: 'The route the eyes take across a picture.',
              mid: 'The route the eyes take across a scene or a picture: a sequence of fixations joined by jumps. It is not a metaphor — it can be recorded, and it is what composition steers.',
              long: 'The route the eyes take across a scene or a picture. Because the sharp field is only about two degrees wide, seeing is a sequence of brief fixations joined by fast jumps called saccades; nothing is taken in during the jump. What you believe you saw at once was assembled from many such glances, in an order the picture itself largely decided.',
              show: 'mid' },
            { type: 'figure', src: 'deck-12.jpg', alt: 'Human vision diagram: central vision and the peripheral rings', place: { row: 2, col: 2, w: '2/3', fillH: true } },
            { type: 'todo', html: '<b>Interactive (agreed)</b> — a blurred photograph; wherever you click, that area comes into focus and the rest stays blurred; the cursor carries an indicator; each click moves the sharp area.' },
          ],
        },
        {
          id: 's-a8b',
          layout: 'stacked',
          title: 'How we look',
          blocks: [
            { type: 'demo', id: 'fovea', fig: 3,
              caption: 'A photograph seen the way the eye sees it: sharp where you are fixating, vague everywhere else. Each click moves the fixation; the trail is the route your gaze has taken.' },
          ],
        },
      ],
    },

    /* ================================================== A4 · Gaze */
    {
      id: 'c-gaze',
      title: 'Gaze',
      n: 'A4',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'Where the eyes go.' },
      steps: [
        {
          id: 's-a9',
          layout: 'statement',
          title: 'Gaze',
          blocks: [
            { type: 'lineBig', html: 'Take a look at this painting.' },
          ],
        },
        {
          id: 's-a10',
          layout: 'stacked',
          title: 'Gaze',
          blocks: [
            { type: 'text', paras: [
              'Ilya Repin, <i>Unexpected Visitors</i>, 1884.',
            ] },
            { type: 'reveal', src: 'deck-14.jpg', seconds: 15,
              alt: 'Ilya Repin, Unexpected Visitors (1884)',
              cover: 'Click to see the painting for 15 seconds' },
          ],
        },
        {
          id: 's-a11',
          layout: 'stacked',
          title: 'Yarbus, 1967',
          blocks: [
            { type: 'text', paras: [
              'The white lines are the record of a viewer’s eyes. They do not wander evenly. They go to faces, to the man in the door, to the woman standing up, and they go back and forth between them. The painting was built so that they would.',
            ] },
            { type: 'figure', src: 'deck-15.jpg', alt: 'Repin’s painting beside the same painting with eye-tracking traces superimposed' },
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
          blocks: [
            { type: 'text', paras: [
              'With a question in mind the eyes take a different route: Yarbus found that the same viewer, given a different task, produced a different scan path over the same painting. What you are looking for changes what you look at.',
            ] },
            { type: 'reveal', src: 'deck-17.jpg', seconds: 15,
              alt: 'Ilya Repin, Unexpected Visitors, shown again',
              cover: 'Click to see the painting for 15 seconds' },
            { type: 'todo', html: '<b>Interactive candidate</b> — choose a task (how wealthy is the family? how old are they? what were they doing before he came in?) and see Yarbus’s scan path for that task.' },
          ],
        },
        {
          id: 's-a14',
          layout: 'stacked',
          title: 'Eye tracking',
          blocks: [
            { type: 'line', html: 'Scan paths and heat-maps: where people look on a page or an advertisement.' },
            { type: 'text', paras: [
              'What Yarbus recorded in 1967 with laboratory apparatus is now done with an eye-tracking camera, and the results are sold: heat-maps of where people look on a web page or an advertisement. Designers use them to control the gaze. So do painters, cinematographers and photographers — they just do it by composition rather than by measurement.',
            ] },
            { type: 'figure', src: 'deck-18.jpg', alt: 'Eye-tracking software; scan paths and heat-maps on a website and on advertisements' },
          ],
        },
      ],
    },

    /* ================================================== A5 · Composition */
    {
      id: 'c-communicates',
      title: 'Composition',
      n: 'A5',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'Structure · hierarchy · balance · symmetry · lines · shapes · light and dark · colour · scale · form.' },
      steps: [
        {
          id: 's-a15',
          layout: 'statement',
          title: 'Composition',
          blocks: [
            { type: 'lineBig', html: 'Composition communicates: <em>hierarchy, fragility, attention, power, tension, calm…</em>' },
          ],
        },
        {
          id: 's-a16',
          layout: 'stacked',
          title: 'Composition',
          blocks: [
            { type: 'text', paras: [
              'Shelter, and a body in the foetal position: the circle holds her, the thirds hold the circle.',
            ] },
            { type: 'figure', src: 'deck-19.jpg', alt: 'Gravity: Sandra Bullock curled in the airlock, with a circle and vertical divisions',
              caption: '<i>Gravity</i>, dir. Alfonso Cuarón, 2013.' },
          ],
        },
        {
          id: 's-a17',
          layout: 'stacked',
          title: 'Composition',
          blocks: [
            { type: 'text', paras: [
              'The man at the apex is the one with power; the other two hold the base.',
            ] },
            { type: 'figure', src: 'deck-20.jpg', alt: 'Breaking Bad: three men in the desert, a triangle drawn over the frame',
              caption: '<i>Breaking Bad</i>, created by Vince Gilligan, AMC, 2008–2013.' },
            { type: 'todo', fix: true, html: '<b>Caption</b> — season and episode of this frame to add (Batu).' },
          ],
        },
        {
          id: 's-a18',
          layout: 'stacked',
          title: 'Composition',
          blocks: [
            { type: 'text', paras: [
              'Every line in the corridor leads to the twins. Symmetry this exact is unsettling on purpose.',
            ] },
            { type: 'figure', src: 'deck-21.jpg', alt: 'The Shining: the corridor with the twins, symmetry and one-point perspective lines',
              caption: '<i>The Shining</i>, dir. Stanley Kubrick, 1980.' },
          ],
        },
        {
          id: 's-a19',
          layout: 'stacked',
          title: 'Composition',
          blocks: [
            { type: 'text', paras: [
              'Architecture as a frame within the frame: the receding arches and the floor pattern all converge on one vanishing point, and it sits exactly between the two central figures, so the eye arrives at Plato and Aristotle whichever way it enters. The two are also the picture’s argument — Plato points upward, to the ideal and the divine; Aristotle holds his hand flat over the ground, the earthly and the observed. The crowd is sorted the same way: on Plato’s side the philosophers of the abstract (Pythagoras writing, Heraclitus brooding on the steps), on Aristotle’s the empirical sciences (Euclid bending over his slate, Ptolemy with the globe). Left and right groups mirror each other in mass; the steps and the parapet make horizontal bands that keep the whole crowd readable; the statues of Apollo and Minerva in the niches repeat the split above the heads. Nothing here is accidental: the geometry carries the meaning.',
            ] },
            { type: 'figure', src: 'deck-22.jpg', alt: 'Raphael, The School of Athens',
              caption: 'Raphael, <i>The School of Athens</i>, 1509–11.' },
          ],
        },
        {
          id: 's-a20',
          layout: 'stacked',
          title: 'Composition',
          blocks: [
            { type: 'text', paras: [
              'Three groups, one axis: the triangles hold the figures apart and tie them together at the same time.',
            ] },
            { type: 'figure', src: 'deck-23.jpg', alt: 'Botticelli, The Birth of Venus, with triangular construction lines',
              caption: 'Botticelli, <i>The Birth of Venus</i>, c. 1485.' },
          ],
        },
        {
          id: 's-a21',
          layout: 'statement',
          title: 'Composition',
          centred: true,
          blocks: [
            { type: 'quote', who: 'Ernst Haas',
              html: '“My theory of composition? Simple: do not release the shutter until everything in the viewfinder feels just right.”' },
          ],
        },
      ],
    },

    /* ================================================== A6 · Composition in Photography */
    {
      id: 'c-photographers',
      title: 'Composition in Photography',
      n: 'A6',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'Ara Güler · Alec Soth · Tim Walker · August Sander' },
      steps: [
        {
          id: 's-a22',
          layout: 'stacked',
          title: 'Ara Güler',
          blocks: [
            { type: 'text', paras: [
              'Light and dark do the composing; the figure is placed where the shadow allows.',
            ] },
            { type: 'gallery', title: 'Ara Güler', caption: 'Ara Güler', images: [
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
            { type: 'text', paras: [
              'The subject in the centre, the surroundings given as much weight as the person.',
            ] },
            { type: 'gallery', title: 'Alec Soth', caption: 'Alec Soth, <i>Sleeping by the Mississippi</i>', images: [
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
            { type: 'gallery', title: 'Tim Walker', caption: 'Tim Walker', images: [
              { src: 'walker-01.jpg', alt: 'Tim Walker: figures in white quilted cocoons' },
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
            { type: 'text', paras: [
              'A man, his tools and his room, given equal standing.',
            ] },
            { type: 'gallery', title: 'August Sander', caption: 'August Sander, <i>Pastry Cook</i>, 1928', images: [
              { src: 'sander-01.jpg', alt: 'August Sander, Pastry Cook, 1928' },
            ] },
            { type: 'todo', html: '<b>Images</b> — these are cut from last year’s slides; Batu supplies higher-resolution files for every photographic reference (drop them in <code>assets/</code>, one per photograph).' },
          ],
        },
      ],
    },

    /* ================================================== A7 · Exercise: Form */
    {
      id: 'c-form',
      title: 'Exercise: Form',
      n: 'A7',
      part: 'a',
      partTitle: 'Composition',
      head: { kicker: 'Part A · Composition', standfirst: 'Fifteen pictures, each reduced to three or four shapes.' },
      steps: [
        {
          id: 's-a26',
          layout: 'argument',
          title: 'Exercise: Form',
          blocks: [
            { type: 'tag', tone: 'signal', place: { row: 1, col: 1, w: 'full' }, text: 'Bring to class' },
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: '15 images — 5 photographs, 5 paintings, 5 of your own — each reduced to 3–4 shapes on tracing paper.' },
            { type: 'text', place: { row: 2, col: 1, w: '1/2', ruled: true, rgrow: true }, paras: [
              'Bring fifteen printed images whose composition you find good. Lay tracing paper over each one and reduce the picture to three or four simple shapes — a rectangle, a circle, a triangle, a line. Draw the shapes, not the subject.',
              'What you are looking for is the skeleton. Every picture you admire has one, and you can only see it once you stop seeing what the picture is of.',
            ] },
            { type: 'sheet', title: 'What to bring', kicker: 'Fifteen sheets', place: { row: 2, col: 2, w: '1/2' }, items: [
              ['Photographs by others', '5'],
              ['Paintings', '5'],
              ['Your own photographs', '5'],
              ['Tracing paper', 'one sheet each'],
              ['Shapes per image', '3–4'],
              ['Printed, not on screen', 'required', 'out'],
            ] },
            { type: 'note', kind: 'tip', place: { row: 2, col: 2, w: '1/2' }, html: 'If a picture needs five shapes, you have not finished looking at it yet.' },
            { type: 'todo', html: '<b>Student references</b> — this chapter should open a gallery of last year’s tracings. <b>Interactive candidate</b> — a digital version: an image under tracing paper, a black-shape tool, hide the photo, export. Does not replace paper.' },
          ],
        },
        {
          id: 's-a26b',
          layout: 'stacked',
          title: 'Only these four shapes',
          blocks: [
            { type: 'line', html: 'Line · Rectangle · Triangle · Circle — the ones that stand out most.' },
            { type: 'svg', svg: '<svg viewBox="0 0 640 160" role="img" aria-label="Line, rectangle, triangle, circle"><line x1="40" y1="130" x2="120" y2="30" stroke="currentColor" stroke-width="8" stroke-linecap="square"/><rect x="190" y="30" width="100" height="100" fill="currentColor"/><polygon points="400,30 460,130 340,130" fill="currentColor"/><circle cx="560" cy="80" r="50" fill="currentColor"/></svg>' },
          ],
        },
        {
          id: 's-a26c',
          layout: 'stacked',
          title: 'Print → Tracing paper → Drawing',
          blocks: [
            { type: 'text', paras: [
              'Print in black and white on plain A4 — do not spend money on the prints. Lay the tracing paper over the print, draw only the shapes that stand out, then photograph or scan the tracing.',
            ] },
            { type: 'figure', src: 'form-steps-02.jpg', alt: 'The same landscape three times: the print, the tracing paper laid over it, the drawing of its shapes',
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
          title: 'Exercise: Form',
          blocks: [
            { type: 'figure', src: 'form-03.jpg', alt: 'A seated figure in a gown, and its reduction to a circle, a rectangle, a triangle and two lines',
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
      ],
    },

    /* ================================================== B1 · Format */
    {
      id: 'c-format',
      title: 'Format',
      n: 'B1',
      part: 'b',
      partTitle: 'Format',
      head: { kicker: 'Part B · Format', standfirst: 'Aspect ratio · formats · size · resolution · crop factor · delivery · depth of field.' },
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
          id: 's-b1',
          layout: 'stacked',
          title: 'Aspect Ratio',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'The shape of the frame, with no size attached. Written short side first: 2:3, 4:5, 3:4.' },
            { type: 'text', place: { row: 1, col: 1, w: 'full' }, paras: [
              'There are fewer shapes than you would think — 1:1, 4:5, 3:4, 6:7, 2:3, 9:16, 1:2.39 — and each exists because a piece of film, a screen or a sheet of paper was once made that way. In this course ratios are written short side first, the way film formats are named; it is the same shape whichever way you hold the camera. Last year’s slide put the ratios and the formats on one page; this year they are separated: shape first, size after.',
            ] },
            { type: 'rows', title: 'The shapes', place: { row: 2, col: 1, w: '1/3', ruled: true, rgrow: true, fillH: true }, items: [
              ['1:1', 'Square · 6×6, thumbnail'],
              ['4:5', 'Sheet film · Instagram feed'],
              ['3:4', 'Micro Four Thirds · most phones'],
              ['6:7', 'The “ideal format” · 6×7'],
              ['2:3', '35 mm · most mirrorless'],
              ['9:16', 'Stories, reels, vertical video'],
              ['1:2.39', 'Anamorphic widescreen'],
            ], caption: 'Short side first, the way film formats are named.' },
            { type: 'figure', src: 'deck-07.jpg', alt: 'Aspect ratios and film/digital formats on one slide', place: { row: 2, col: 2, w: '2/3', rgrow: true, fillH: true } },
            { type: 'todo', html: '<b>Interactive candidate</b> — Module 01 Fig. 1: the shapes, and where they live (cameras · screens · social media).' },
          ],
        },
        {
          id: 's-b2',
          layout: 'argument',
          title: 'Analog / Digital Formats',
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
              ['Phone (1/1.3″)', '9.8 × 7.3 mm · 3:4'],
              ['Micro Four Thirds', '17.3 × 13 mm · 3:4'],
              ['APS-C', '23.5 × 15.6 mm · 2:3'],
              ['Full frame', '36 × 24 mm · 2:3'],
              ['Medium format', '44 × 33 mm · 3:4'],
            ] },
            { type: 'todo', html: '<b>Interactive candidate</b> — Module 01 Fig. 2: every camera at one fixed scale, up to four compared.' },
          ],
        },
        {
          id: 's-b3',
          layout: 'argument',
          title: 'Sensor / Film Size',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'Size is what a lens and a print respond to. Everything on the negative is enlarged with it.' },
            { type: 'stat', place: { row: 2, col: 1, w: '1/3' }, value: '×12', label: 'Phone → full frame', html: 'The first step up, in area.' },
            { type: 'stat', place: { row: 2, col: 2, w: '1/3' }, value: '×4.5', label: 'Full frame → 6×7', html: 'The second step up.' },
            { type: 'stat', place: { row: 2, col: 3, w: '1/3' }, value: '×55', label: 'Full frame → 8×10 in', html: 'The whole distance, end to end.' },
            { type: 'text', place: { row: 3, col: 1, w: '1/2', ruled: true }, paras: [
              'A 4×5 sheet has thirteen times the area of full frame, an 8×10 sheet fifty-five. A full-frame negative is enlarged about eight times to make a 30 cm print, a 4×5 sheet two and a half times, a phone sensor thirty. Grain, pixel and focus error are all enlarged with it — which is why the same mistake is invisible on one format and fatal on another.',
            ] },
            { type: 'sheet', title: 'Enlargement', kicker: 'To a 30 cm print', place: { row: 3, col: 2, w: '1/2', fillH: true }, items: [
              ['Phone (1/1.3″)', '×31'],
              ['Micro Four Thirds', '×17'],
              ['APS-C', '×13'],
              ['Full frame', '×8.3'],
              ['6 × 7', '×4.3'],
              ['4 × 5 in', '×2.5'],
              ['8 × 10 in', '×1.2'],
            ] },
          ],
        },
        {
          id: 's-b4',
          layout: 'argument',
          title: 'Resolution',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'Megapixels on a sensor. Line pairs per millimetre on film.' },
            { type: 'text', place: { row: 2, col: 1, w: '1/2', ruled: true, rgrow: true }, paras: [
              'A sensor has a fixed number of pixels. Film has resolving power — line pairs per millimetre — which depends on the emulsion, the lens, the focus and the exposure, and only becomes a pixel count when you scan.',
            ] },
            { type: 'note', kind: 'warning', place: { row: 2, col: 1, w: '1/2' }, html: 'A scan can have far more pixels than the negative has detail. The number on the file is not the number on the film.' },
            { type: 'sheet', title: 'Detail on film', kicker: 'At 60 lp/mm', place: { row: 2, col: 2, w: '1/2', fillH: true }, items: [
              ['35 mm', '≈ 12 MP'],
              ['6 × 7', '≈ 55 MP'],
              ['4 × 5 in', '≈ 165 MP'],
              ['8 × 10 in', '≈ 680 MP'],
            ] },
            { type: 'todo', html: '<b>Interactive candidate</b> — Module 01 Fig. 3: 100 µm of the surface; pixels against detail.' },
          ],
        },
        {
          id: 's-b5',
          layout: 'argument',
          title: 'Crop Factor',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'The lens projects a circle. The format cuts a rectangle out of it.' },
            { type: 'define', place: { row: 2, col: 1, w: '1/2', ruled: true }, term: 'Crop factor', kind: 'noun',
              etym: 'the ratio of the format’s diagonal to full frame’s 43 mm',
              short: 'How much narrower this format sees, with the same lens.',
              mid: 'The number you multiply a focal length by to find the full-frame lens that frames the same picture. Nothing is magnified: the smaller rectangle is simply shown at the same size afterwards.',
              long: 'A lens projects a circle of image and the format cuts a rectangle out of that circle. A small sensor cuts a small rectangle and sees a narrow slice; a large negative sees more of the same circle. The crop factor is the ratio of diagonals against full frame — multiply the focal length by it and you have the full-frame lens that frames the same picture.',
              show: 'mid' },
            { type: 'note', kind: 'tip', place: { row: 2, col: 1, w: '1/2' }, html: 'A normal lens is the diagonal of the format — whatever the format. That is the whole rule, and it is why 50 mm is normal on full frame and 150 mm is normal on 6×7.' },
            { type: 'sheet', title: 'Crop factor', kicker: 'Against full frame', place: { row: 2, col: 2, w: '1/2', fillH: true }, items: [
              ['Micro Four Thirds', '×2.0 · normal 22 mm'],
              ['APS-C', '×1.5 · normal 28 mm'],
              ['Full frame', '×1.0 · normal 43 mm'],
              ['6 × 7', '×0.47 · normal 90 mm'],
              ['4 × 5 in', '×0.28 · normal 153 mm'],
            ] },
            { type: 'todo', html: '<b>Interactive candidate</b> — Module 01 Fig. 4: one lens, every format; Normal lens button.' },
          ],
        },
        {
          id: 's-b6',
          layout: 'stacked',
          title: 'Delivery Ratio & Cropping',
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
            { type: 'todo', html: '<b>Interactive candidate</b> — Module 01 Fig. 5: the crop calculator.' },
          ],
        },
        {
          id: 's-b7',
          layout: 'argument',
          title: 'Depth of Field',
          blocks: [
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'Focal length, aperture, distance. The format changes the first.' },
            { type: 'text', place: { row: 2, col: 1, w: '1/2', ruled: true, rgrow: true }, paras: [
              'Depth of field cares about the focal length, the aperture and the distance — not about the format. To frame the same picture a larger format needs a longer lens, and a longer lens at the same f-number gives a shallower zone of sharpness. That, and nothing more mysterious, is the “medium-format look”.',
              'Multiply the f-number by the crop factor and you have the equivalent aperture: the full-frame f-number that would blur the same.',
            ] },
            { type: 'note', kind: 'tip', place: { row: 2, col: 1, w: '1/2' }, html: 'Hold the lens instead of the framing and the format drops out of the equation entirely: it only crops.' },
            { type: 'sheet', title: 'Equivalent aperture', kicker: 'Same framing, against full frame', place: { row: 2, col: 2, w: '1/2', fillH: true }, items: [
              ['f/2.8 on Micro Four Thirds', 'f/5.6'],
              ['f/2.8 on APS-C', 'f/4.2'],
              ['f/2.8 on full frame', 'f/2.8'],
              ['f/4 on 6×7', 'f/1.9'],
              ['f/5.6 on 4×5 in', 'f/1.6'],
            ] },
            { type: 'todo', html: '<b>Interactive candidate</b> — Module 01 Fig. 6: plan view; hold framing / hold lens.' },
          ],
        },
      ],
    },

    /* ================================================== Close */
    {
      id: 'c-close',
      title: 'Test · Assignment · Next week',
      n: '',
      head: { standfirst: 'What is checked, what goes out, and what comes next.' },
      steps: [
        {
          id: 's-test',
          layout: 'argument',
          title: 'The Test',
          blocks: [
            { type: 'line', html: 'In-class check.' },
            { type: 'todo', fix: true, html: '<b>Content to come</b> — question set from Batu.' },
          ],
        },
        {
          id: 's-ass',
          layout: 'argument',
          title: 'Photogram',
          blocks: [
            { type: 'tag', tone: 'signal', place: { row: 1, col: 1, w: 'full' }, text: 'Assignment #1' },
            { type: 'line', place: { row: 1, col: 1, w: 'full' }, html: 'Out today · due Week #4, 24.09.' },
            { type: 'text', place: { row: 2, col: 1, w: '1/2', ruled: true, rgrow: true }, paras: [
              'A photogram is an exposure with no lens. What reaches the paper is the only thing recorded, which makes it the shortest possible route to the two questions this week is about: what shape is the frame, and what is placed inside it.',
            ] },
            { type: 'sheet', title: 'The three controls', kicker: 'And nothing else', place: { row: 2, col: 2, w: '1/2' }, items: [
              ['What blocks the light', 'opacity'],
              ['How far above the paper', 'distance'],
              ['For how long', 'time'],
            ] },
            { type: 'todo', fix: true, html: '<b>Brief to come</b> — the assignment page (Module 02 · Photogram) carries the full brief, references and student references.' },
          ],
        },
        {
          id: 's-next',
          layout: 'argument',
          title: 'Camera I',
          blocks: [
            { type: 'line', html: 'Exposure · aperture and shutter speed · film and development · metering · pinhole.' },
            { type: 'text', paras: [
              'Assignment #2 Pinhole goes out.',
            ] },
          ],
        },
      ],
    },
  ],
};
