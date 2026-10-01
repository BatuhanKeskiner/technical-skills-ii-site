/* ============================================================
   Week #3 · Camera I — content source · draft v0.5

   REVISED 13-09-2026 (evening) against his review of the day,
   recorded in _notes/WEEK-03-FROM-BATU.md. The twelve rules in
   that file are the brief for every line here:

   · the order is by dependency, the pinhole is the end
   · a sentence states a mechanism or a fact, and stops
   · a title is the subject, not a claim
   · a model carries no measurements
   · his own sentences are set plain; everything with `gen` is
     mine and orange until he ticks it
   · where he writes, the slot is empty and says so
   · film, not paper — except in the box chapter

   Photographs are his. Their placeholders say what they wait for.
   ============================================================ */

window.TS2_WEEK = {
  course: 'Technical Skills II',
  institution: 'KABK · BA Photography',
  year: '2026–27',
  number: '3',
  title: 'Camera I',
  standfirst: 'A box with a hole, and the two numbers on every camera: how wide the hole is, and how long it is open.',
  revision: 'draft v0.5',
  next: { label: 'Exercise: Copycat', href: '#' },

  chapters: [
    /* ================================================== 0 · Schedule */
    {
      id: 'c-today',
      title: 'Schedule',
      n: '',
      head: { standfirst: 'Week #3 · Camera I' },
      steps: [
        {
          id: 's-0',
          cls: 'title',
          layout: 'stacked',
          title: 'Schedule',
          blocks: [
            {
              /* HIS OWN TIMETABLE, second round 16-09-2026, slide 1:
                 "Presentation : Camera 45 mins · Break 15 min · Assignment #2:
                 Pinhole : 15 min · Demo: Build and Shoot with a pinhole camera
                 1hr 45 min". One presentation, not two, and the demo is most of
                 the session. */
              type: 'schedule',
              plan: [
                'Presentation: Camera',
                'Break',
                'Assignment #2: Pinhole',
                'Demo: Build and Shoot with a pinhole camera',
                'End',
              ],
              classes: [
                { name: 'PHft2A', group: 'Full time', when: 'Thursday 17.09 · morning',
                  times: ['09:30', '10:15', '10:30', '10:45', '12:30'] },
                { name: 'PHft2B', group: 'Full time', when: 'Thursday 17.09 · afternoon',
                  times: ['13:30', '14:15', '14:30', '14:45', '16:30'] },
                { name: 'PHptc2', group: 'Part time', when: 'Monday 21.09 · afternoon',
                  times: ['13:30', '14:15', '14:30', '14:45', '16:30'] },
              ],
            },
          ],
        },
        {
          id: 's-goals',
          layout: 'list',
          title: 'By the end of today',
          blocks: [
            /* HIS WORDS (Keynote, slide 2) */
            { type: 'bul', marker: 'rule', items: [
              'Basic Principles of Camera',
              'Focal Length',
              'Aperture',
              'Shutter Speed',
              'F stop',
              'Depth of Field',
              'DIY Pinhole Camera',
            ] },
          ],
        },
      ],
    },
    {
      id: 'c-obscura',
      title: 'Camera obscura',
      n: 'A1',
      part: 'a',
      partTitle: 'The camera',
      head: { kicker: 'Part A · The camera' },
      steps: [
        {
          id: 's-a3',
          layout: 'plate',
          title: 'Why image is upside down?',
          blocks: [
            /* a square window, centred, and his line under it (slide 5) */
            /* his second round, slide 3: "Make it full width but keep the slider
               size same and centred." The square window left a third of the page
               empty on either side; the room belongs to the drawing. */
            { type: 'model', id: 'obscura', fig: 1,
              caption: 'Move the wall. The flame lands the other way up: small and bright close in, big and faint further back.',
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true } },
            { type: 'line', place: { row: 2, col: 1, w: 'full', align: 'centre' },
              html: 'Light travels in straight lines and passes through the hole to hit the wall.' },
          ],
        },
        {
          id: 's-a1',
          layout: 'stacked',
          title: 'Camera Obscura',
          blocks: [
            /* his engraving, and the Painters paragraph moved here from p04 */
            { type: 'figure', src: 'a1-camera-obscura-engraving.png',
              alt: 'A camera obscura room on legs: light from the landscape enters a small hole and a kneeling man traces the image on the far wall',
              caption: 'Camera obscura, engraving · anonymous · Heritage Images, via Alamy.' },
            { type: 'text', paras: [
              'Painters used this to trace an image for hundreds of years. The challenge for the invention of photography was keeping the image.',
            ] },
          ],
        },
        {
          id: 's-a2',
          layout: 'plate',
          title: 'Camera Obscura in a room.',
          blocks: [
            /* his second round, slide 4: "Put the title of the video in the
               caption and the text underneath the caption." The film first, its
               name and length as one caption under it, and his sentence under
               that. */
            { type: 'video', url: 'https://www.youtube.com/watch?v=X-CRKOtlceg',
              caption: 'Abelardo Morell and the magic of the camera obscura · San Francisco Museum of Modern Art · 3 min 36 s',
              place: { row: 1, col: 1, w: 'full', rgrow: true, fillH: true } },
            { type: 'line', place: { row: 2, col: 1, w: 'full', align: 'centre' },
              html: 'When you have a small hole in a fully darkened room an image appears upside down and reversed on the wall opposite the hole.' },
          ],
        },
        {
          id: 's-a4',
          layout: 'plate',
          title: 'What makes it a camera',
          blocks: [
            /* HIS THREE, moved up from the exposure chapter (slide 6), with the
               box drawn still beside them and a smaller pin */
            /* Keynote 16-09, slide 6: "Move text here, centered on the left, bigger text." */
            { type: 'bul', marker: 'number', big: true, place: { row: 1, col: 1, w: '1/2', rv: 'middle', rgrow: true }, items: [
              'A black box',
              'Light sensitive material',
              'A way to control the amount of light that gets in',
            ] },
            { type: 'model', id: 'boxstill', light: true, place: { row: 1, col: 2, w: '1/2', rgrow: true, fillH: true } },
          ],
        },
      ],
    },
    {
      id: 'c-pinhole',
      title: 'Pinhole',
      n: 'A2',
      part: 'a',
      head: { kicker: 'Part A · The camera' },
      steps: [
        {
          id: 's-b1',
          layout: 'stacked',
          title: 'Pinhole: A very simple camera',
          blocks: [
            /* HIS WORDS, and his four cameras in one row at one height */
            { type: 'line', html: 'Pinhole camera is a box with a tiny hole.' },
            { type: 'gallery', title: 'Four pinhole cameras', images: [
              { src: 'a2-pinhole-camera-muesli-box.jpg', alt: 'A pinhole camera made from a muesli box, taped light-tight' },
              { src: 'a2-pinhole-camera-cigar-box.jpg', alt: 'A pinhole camera built into a cigar box, with two film spools' },
              { src: 'a2-pinhole-camera-fs1.jpg', alt: 'A small 3D-printed pinhole camera, the FS-1' },
              { src: 'a2-pinhole-camera-cardboard.jpg', alt: 'A cardboard-box pinhole camera, open, with a film holder inside' },
            ], caption: 'A muesli box (Brian Auer, 2010), a cigar box (sandravo, Lomography, 2013), a printed FS-1 (Simi Fernezelyi, 2020), a cardboard box (source not confirmed).' },
          ],
        },
        {
          id: 's-b5',
          layout: 'stacked',
          title: 'Pinhole Examples',
          blocks: [
            { type: 'gallery', title: 'Pinhole photographs', images: [
              { src: 'a2-pinhole-photo-boat.jpg', alt: 'A boat on a shingle beach, pinhole, black and white' },
              { src: 'a2-pinhole-photo-tree-bw.jpg', alt: 'A tree seen from below, pinhole, black and white' },
              { src: 'a2-pinhole-photo-carousel.jpg', alt: 'A carousel, riders blurred by the long exposure, pinhole' },
              /* the picture he gave the link for, 16-09-2026 */
              { src: 'b5-kimmeridge-bay.jpg', alt: 'Kimmeridge Bay and the Clavell Tower, pinhole · Ilford Photo' },
            ], caption: 'Will Gudgeon, Our Lady, Hastings, 2021 · source unknown · Stefan Killen, Jane\'s Carousel, Brooklyn, 2013 · Kimmeridge Bay and the Clavell Tower, on ILFORD FP4+, Ilford Photo' },
          ],
        },
        {
          id: 's-b6',
          layout: 'stacked',
          title: 'Pinhole Examples',
          blocks: [
            { type: 'gallery', title: 'Pinhole photographs', images: [
              { src: 'a2-pinhole-photo-tree-colour.jpg', alt: 'A tree by a lake with a stone monument, pinhole, colour' },
              { src: 'a2-pinhole-photo-shore.jpg', alt: 'A rocky shore under a moving sky, pinhole, colour' },
            ], caption: 'Sebastian Schutyser, The Pinhole Project, for Miró Rivera Architects, 2018 · Kenneth Leishman, La Jolla, 2014' },
          ],
        },
        {
          id: 's-b7',
          layout: 'stacked',
          title: 'Solargraph',
          blocks: [
            { type: 'figure', src: 'a2-solargraph.jpg',
              alt: 'A solargraph: months of sun paths arcing over a treeline, on photographic paper',
              caption: 'A solargraph: four months of the sun on Ilford Multigrade RC paper · u/33liter, Reddit, 2021.' },
          ],
        },
        {
          id: 's-b7q',
          layout: 'stacked',
          /* his word, 16-09-2026: "add Justin Quinnell to the references as an
             additional page after solargraphy". The Smileycam: a pinhole camera
             held in his mouth. The nail-biting frame he showed is only kept at
             250 px on his site, so the three largest frames of the same series
             stand here instead. */
          title: 'Justin Quinnell',
          blocks: [
            { type: 'gallery', caption: 'Justin Quinnell · the Smileycam, a pinhole camera held in the mouth · pinholephotography.org', images: [
              { src: 'b7-quinnell-baby.jpg', alt: 'Justin Quinnell, Smileycam: a baby seen from inside a mouth, framed by teeth' },
              { src: 'b7-quinnell-fingers.jpg', alt: 'Justin Quinnell, Smileycam: fingers with painted nails between the teeth' },
              { src: 'b7-quinnell-fish.jpg', alt: 'Justin Quinnell, Smileycam: a toy fish held in the mouth' },
            ] },
          ],
        },
        {
          id: 's-b2',
          layout: 'stacked',
          title: 'Pinhole Camera',
          blocks: [
            /* HIS WORDS; the box on the light ground he picked (slide 11) */
            { type: 'line', html: 'Two measurements: how wide the hole is, and how far the film is behind it.' },
            { type: 'model', id: 'box', fig: 2, light: true,
              caption: 'The two hands a box has: the hole, and the distance to the film.' },
          ],
        },
        {
          id: 's-b4',
          layout: 'stacked',
          /* Keynote 16-09, second round, slide 12: the title takes both hands,
             and "not bigger but tele" - a deeper box is a longer lens, not a
             magnifying glass. The hole belongs on this page too. */
          title: 'Distance & Hole Diameter',
          blocks: [
            { type: 'line', gen: 'b4-say', html: 'Take the film further from the hole and the box becomes a longer lens: a narrower slice of the scene, drawn larger and darker. Widen the hole past the best size for the box and more light comes in, but the picture softens.' },
            { type: 'model', id: 'holelight', fig: 3, light: true,
              caption: 'The box on the left, the picture it makes on the right.' },
          ],
        },
        {
          id: 's-b3',
          layout: 'stacked',
          title: 'Pinhole diameter',
          blocks: [
            /* HIS WORDS */
            { type: 'line', html: 'Past the best size for the box, a wider hole lets more light through but makes a softer picture.' },
            { type: 'model', id: 'discs', fig: 4,
              caption: 'Widen the hole. Each point of the subject lands as a disc as wide as the hole, and the discs overlap.' },
          ],
        },
        {
          id: 's-b8',
          layout: 'stacked',
          /* HIS WORD, 16-09-2026: "bunu gözüm görmesin, tamamen yok et...
             Mesafe için şunun (hole diameter'ın) mesafeli varyasyonunu
             yapacaksın. Bu kadar basit." So the separate instrument is gone and
             this page is the same drawing as the page before it, with the film
             moving instead of the hole changing - the two pages read as one
             thing seen twice. */
          title: 'Distance to the Hole',
          blocks: [
            { type: 'line', gen: 'b8-say', html: 'The hole is one size. Take the film further back and each disc grows a little, but the picture grows more: a deeper box needs a slightly larger hole to stay sharp.' },
            { type: 'model', id: 'discs', fig: 5, pin: { hand: 'distance' },
              caption: 'Move the film away from the hole. The same hole throws a slightly wider disc for every point of a near subject.' },
          ],
        },
      ],
    },
    {
      id: 'c-exposure',
      title: 'Light and time',
      n: 'A3',
      part: 'a',
      head: { kicker: 'Part A · The camera' },
      steps: [
        {
          id: 's-c1',
          layout: 'stacked',
          title: 'Exposure',
          blocks: [
            /* HIS WORDS */
            { type: 'line', html: 'The longer the light comes in, the more of it the film or the sensor collects.' },
            { type: 'model', id: 'exposure', fig: 6,
              caption: 'Press play. The light arrives, the picture comes up — and if nobody stops it, it goes on until the picture is lost: white on a sensor, black on a negative.' },
          ],
        },
        {
          id: 's-c5',
          layout: 'stacked',
          title: 'Exposure',
          blocks: [
            { type: 'line', gen: 'exp-mat', html: 'The same light and the same time, on three different materials.' },
            { type: 'model', id: 'exposure', fig: 7, pin: { materials: 'on' },
              caption: 'A digital sensor, a black-and-white negative, a paper negative. Invert turns a negative into the picture.' },
          ],
        },
        {
          id: 's-c2',
          layout: 'argument',
          title: 'Exposure = Light times Time',
          blocks: [
            /* Keynote 16-09, slide 16: his three names under the three letters,
               "better instead of the whole sentence"; the line under it centred */
            { type: 'formula', cls: 'big', terms: [
              { sym: 'H', label: 'The exposure' }, { op: '=' },
              { sym: 'E', label: 'Brightness of the light' }, { op: '×' },
              { sym: 't', label: 'Time' },
            ] },
            { type: 'line', gen: 'exp-law', place: { row: 2, col: 1, w: 'full', h: 'centre' }, cls: 'centred',
              html: 'Exposure is how bright the light is multiplied by how long it comes in.' },
          ],
        },
        {
          id: 's-c3',
          layout: 'stacked',
          title: 'Time = Shutter Speed',
          blocks: [
            { type: 'line', gen: 'exp-shut', html: 'The shutter sets the time. 1/60 lets the light in for about twice as long as 1/125: one stop.' },
            { type: 'model', id: 'shutter', fig: 8,
              caption: 'Choose a speed and press the release. The photograph takes as long as the shutter is open.' },
          ],
        },
      ],
    },
    {
      id: 'c-aperture',
      title: 'Aperture',
      n: 'A4',
      part: 'a',
      head: { kicker: 'Part A · The camera' },
      steps: [
        {
          id: 's-d1',
          layout: 'stacked',
          title: 'Iris',
          blocks: [
            /* HIS WORDS; the iris exactly as the film he sent (slide 18) */
            { type: 'line', html: 'A mechanism to control the size of the hole therefore the amount of the light.' },
            { type: 'model', id: 'iris', fig: 9, light: true,
              caption: 'Drag it open and shut.' },
          ],
        },
        {
          id: 's-d2',
          layout: 'stacked',
          title: 'What exactly is the aperture value for?',
          blocks: [
            { type: 'line', gen: 'ap-def', html: 'The <em class="term">aperture</em> is the opening in the lens. Its f-number is the focal length divided by the width of the opening.' },
            { type: 'model', id: 'lensparts', fig: 10,
              caption: 'A 50 mm lens cut in half. Step the aperture and the blades close inside it.' },
          ],
        },
        {
          id: 's-d3',
          /* Keynote 16-09, slide 20: "This is a question, it has to be here" -
             in the middle of the page */
          layout: 'question',
          title: 'Why it is 1.4 · 2 · 2.8 · 4 · 5.6 ?',
          blocks: [
            /* HIS WORDS */
            { type: 'lineBig', html: 'Why does it go f/1.4 · f/2 · f/2.8 · f/4 · f/5.6?' },
          ],
        },
        {
          id: 's-d7',
          layout: 'argument',
          title: 'Math Time',
          blocks: [
            /* Keynote 16-09, slide 22: the button off this page; "Put pi r
               square. How to calculate the area of a square." */
            { type: 'formula', cls: 'big two', terms: [
              { sym: 'A', label: 'Area of a circle' }, { op: '=' },
              { sym: 'π' }, { op: '·' }, { sym: 'r²', label: 'Radius × radius' },
            ] },
            /* his second round, slide 23: "This is not related. Instead:
               2A = pi x (r square root 2) square" - the square's area was
               beside the point; what the page needs is what doubles a circle. */
            { type: 'formula', cls: 'big two', terms: [
              { sym: '2A', label: 'Twice the area' }, { op: '=' },
              { sym: 'π' }, { op: '·' }, { sym: '(r√2)²', label: 'The radius, √2 wider' },
            ] },
            { type: 'text', gen: 'ap-math', paras: [
              'The light a lens lets in depends on the <em class="term">area</em> of the opening, not its width. Area is width times width — so a hole twice as wide lets in four times the light.',
              'To let in half the light you do not halve the width. You divide it by the number that, multiplied by itself, makes 2. That number is √2, about 1.4.',
              'So each f-number is the one before it multiplied by √2, about 1.4: 1.4, 2, 2.8, 4, 5.6, 8, 11, 16. Each step is the opening one √2 narrower, half the area, half the light — one stop.',
            ] },
          ],
        },
        {
          id: 's-d4',
          layout: 'stacked',
          title: 'One stop at a time',
          blocks: [
            { type: 'line', gen: 'ap-stop1', html: 'Each f-number lets in half the light of the one before it.' },
            { type: 'model', id: 'fstop', fig: 11,
              caption: 'The opening at this stop, with the one above and the one below.' },
          ],
        },
        {
          id: 's-d5',
          layout: 'argument',
          title: 'One f-stop',
          blocks: [
            { type: 'line', gen: 'exp-stop', html: 'A <em class="term">stop</em> is a doubling or a halving of the light. Aperture, shutter and ISO all move in stops.' },
            /* Keynote 16-09, slide 24: "Give 10 stops in the example from each.
               Align them on their respective column. Make the values bigger." */
            /* his second round, slide 25: an arrow row with +1 on it, and the
               shutter row saying which way it is going */
            /* his round of 16-09: the arrow for +1 runs the other way on the
               aperture row - f/1.4 to f/2 is a stop LESS light - while shutter
               and ISO gain a stop to the right */
            { type: 'spec', gen: 'spec-stops', cls: 'stops', arrows: '+1',
              arrowsLeft: ['Aperture'],
              caption: 'Whole stops — each column one stop from the next',
              rows: [
                ['Aperture', ['f/1.4', 'f/2', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16', 'f/22', 'f/32'], null, 'Narrower'],
                ['Shutter', ['1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1/15', '1/8', '1/4', '1/2'], null, 'Longer'],
                ['ISO', ['100', '200', '400', '800', '1600', '3200', '6400', '12800', '25600', '51200'], null, 'More sensitive'],
              ] },
            { type: 'note', gen: 'exp-stop2', html: 'One stop smaller on the aperture and one stop longer on the shutter gives the same exposure.' },
          ],
        },
        {
          id: 's-d6',
          layout: 'stacked',
          title: 'Lightmeter',
          blocks: [
            { type: 'line', gen: 'exp-meter', font: 'display', html: 'A meter reads the light and gives <em>one pair</em> of settings. Every pair one stop away is the same exposure.' },
            { type: 'demo', id: 'lightmeter', fig: 12,
              caption: 'Choose the light, set the film speed and the shutter, and the aperture answers. Press the body and the meter comes apart.' },
            /* his second round, slide 26: "Add a warning that this works with
               continuous light. With Flash it's different." */
            { type: 'note', gen: 'meter-cont', kind: 'warning', html: 'This is a reading of continuous light — daylight, a lamp, the window. Flash is measured differently: the meter waits for the pop and reads that alone, and the shutter speed no longer changes the flash part of the exposure — only how much of the continuous light is recorded.' },
          ],
        },
      ],
    },
    {
      id: 'c-focal',
      title: 'Focal Length',
      n: 'B1',
      part: 'b',
      partTitle: 'The lens, and the box',
      head: { kicker: 'Part B · The lens, and the box' },
      steps: [
        {
          id: 's-e2',
          layout: 'stacked',
          /* his second round, slide 27: the page a student stands in front of
             comes first, and it is called what it teaches */
          title: 'Focal Length',
          blocks: [
            { type: 'line', gen: 'foc-lens', html: '28, 50 and 85 mm are three distances. Each one cuts a different rectangle out of the same room.' },
            { type: 'demo', id: 'transform', space: 'model', fig: 13,
              caption: 'Walk with W A S D, turn by dragging the picture, and the slider changes the focal length.' },
            { type: 'note', gen: 'foc-lens2', html: 'On a full-frame camera a 50 mm lens sees roughly what the eye sees. On an APS-C camera the same lens sees like a 75 mm (80 mm on Canon); on Micro Four Thirds, like a 100 mm.' },
          ],
        },
        {
          /* his word, 16-09-2026: "Focal Length" - the diagram page carries the
             name in full, in the case an instrument's name takes */
          id: 's-e1',
          layout: 'stacked',
          title: 'Focal Length',
          blocks: [
            { type: 'line', gen: 'foc-say', html: 'Focal length is the distance from the lens to the film when the lens is focused at infinity. It sets how much of the scene fits on the film.' },
            { type: 'model', id: 'boxangle', fig: 14,
              caption: 'The scene, and the slice of it the camera takes.' },
          ],
        },
      ],
    },
    {
      id: 'c-dof',
      title: 'Depth of field',
      n: 'B2',
      part: 'b',
      head: { kicker: 'Part B · The lens, and the box' },
      steps: [
        {
          id: 's-f1',
          layout: 'stacked',
          title: 'Depth of Field',
          blocks: [
            { type: 'line', gen: 'dof-say', html: 'A lens is focused at one distance. What still looks sharp in front of it and behind it is the depth of field.' },
            { type: 'demo', id: 'dof', fig: 15,
              caption: 'Aperture, distance and focal length. The two dashed lines are the near and far limits.' },
          ],
        },
        {
          id: 's-f2',
          /* Keynote 16-09, slide 29: "This is a fact, write these lists here" -
             the list is the page; and "zone kullanımı doğru değil": depth of field */
          layout: 'list',
          title: 'What changes it',
          blocks: [
            { type: 'bulBig', gen: 'dof-move-l', items: [
              'A smaller aperture makes the depth of field deeper.',
              'A more distant subject makes the depth of field deeper.',
              'At the same subject distance, a longer focal length makes the depth of field shallower.',
            ] },
          ],
        },
      ],
    },
    {
      id: 'c-refs',
      title: 'References',
      n: 'B5',
      part: 'b',
      head: { kicker: 'Part B · The lens, and the box' },
      steps: [
        {
          id: 's-j0',
          layout: 'stacked',
          /* HIS ASK, 16-09-2026: add this project to the week and to the brief,
             with its address on it. The pictures are from his own site. */
          title: 'Underwater pinhole',
          blocks: [
            { type: 'line', gen: 'ref-lawrence', html: 'Donald Lawrence has been building pinhole cameras to go into the sea since 1997, and developing what they take in a kayak turned into a darkroom.' },
            { type: 'gallery', title: 'Donald Lawrence · Underwater Pinhole, from 1997',
              images: [
                { src: 'b5-lawrence-01-camera-1997.jpg', alt: 'One of the underwater pinhole cameras, 1997' },
                { src: 'b5-lawrence-02-camera-2002.jpg', alt: 'A later underwater pinhole camera, 2002' },
                { src: 'b5-lawrence-03-kayak-darkroom-1998.jpg', alt: 'The kayak converted into a floating darkroom, 1998' },
                { src: 'b5-lawrence-04-starfish-1998.jpg', alt: 'Starfish in a tidal surge, photographed through a pinhole, 1998' },
                { src: 'b5-lawrence-05-sober-island-2002.jpg', alt: 'Sober Island, 2002' },
              ],
              caption: 'Donald Lawrence · Underwater Pinhole · donaldlawrence.ca' },
            { type: 'link', href: 'https://donaldlawrence.ca/underwater-pinhole',
              kicker: 'Donald Lawrence', text: 'Underwater Pinhole',
              note: 'donaldlawrence.ca', away: true },
          ],
        },
        {
          id: 's-j3',
          layout: 'plate',
          /* HIS SECOND ROUND, slides 31-34: "No title just add these images in a
             right order." The pictures are his own, taken out of the deck he
             wrote on - the Keynote package keeps only 320 px previews, so they
             were pulled at full size from a PDF of it. Four pages: the proposal,
             the build, the photographs, and what came back. */
          title: 'Warsaw',
          noTitle: true,
          blocks: [
            { type: 'gallery', title: '',
              images: [
                { src: 'b5-pinhole20-01-proposal.png', alt: 'The written proposal: Warsaw Trip, “The nightmare dream of a drunken cake-maker”' },
                { src: 'b5-pinhole20-02-palace.png', alt: 'The Palace of Culture and Science, Warsaw' },
              ] },
          ],
        },
        {
          id: 's-j4',
          layout: 'plate',
          title: 'Warsaw',
          noTitle: true,
          blocks: [
            { type: 'gallery', title: '',
              images: [
                { src: 'b5-pinhole20-03-back-to-roots.png', alt: 'Back to roots: the camera cut flat, printed on a sheet' },
                { src: 'b5-pinhole20-04-camera-taped.png', alt: 'The camera taped together on the table' },
                { src: 'b5-pinhole20-05-on-the-tripod.png', alt: 'The camera on a tripod in front of the Palace' },
              ] },
          ],
        },
        {
          id: 's-j5',
          layout: 'plate',
          title: 'Warsaw',
          noTitle: true,
          blocks: [
            { type: 'gallery', title: '',
              images: [
                { src: 'b5-pinhole20-06-statue-one.png', alt: 'A statue in its niche, photographed with the box' },
                { src: 'b5-pinhole20-07-statue-marx-engels-lenin.png', alt: 'The statue holding a book: Marx, Engels, Lenin' },
              ] },
          ],
        },
        {
          id: 's-j6',
          layout: 'plate',
          /* slide 34: "Title: Results" and the line he wants highlighted */
          title: 'Results',
          blocks: [
            { type: 'figure', src: 'b5-pinhole20-08-the-film.png',
              alt: 'The developed film on the light box - the strips, and one frame black',
              place: { row: 1, col: 1, w: '1/2', ruled: true, rgrow: true, fillH: true, iw: '5/6', fit: 'bleed' } },
            { type: 'lineBig', place: { row: 1, col: 2, w: '1/2' },
              html: 'Moral of the story: <em class="term">Shit happens</em>.' },
          ],
        },
      ],
    },
    {
      id: 'c-close',
      title: 'Assignment',
      n: 'B6',
      part: 'b',
      head: { kicker: 'Part B · The lens, and the box' },
      steps: [
        /* Assignment Brief Page (s-brief) was deleted by him in the round of
           16-09-2026, 22:04 - the assignment page below carries the link. */
        {
          id: 's-ass',
          layout: 'stacked',
          title: 'Assignment #2 · Pinhole',
          blocks: [
            { type: 'link', href: '../assignments/02-pinhole/',
              kicker: 'Assignment #2 · Pinhole', text: 'Read the full brief',
              note: 'On this site', away: false },
          ],
        },
        /* Demonstration Pinhole Camera & Practical Matters (s-demo) was deleted
           by him in the same round. */
      ],
    },
    {
      id: 'c-box',
      title: 'The box you build',
      n: 'B3',
      part: 'b',
      head: { kicker: 'Part B · The lens, and the box' },
      steps: [
        {
          id: 's-g1',
          layout: 'argument',
          title: 'A pinhole has a fixed aperture.',
          blocks: [
            { type: 'line', gen: 'box-fixed', html: 'The hole is the aperture and it cannot be changed. A 50 mm deep box with a 0.3 mm hole is f/167.' },
            { type: 'formula', gen: 'form-fnum', html: 'N <span class="op">=</span> <span class="res">f</span> <span class="op">/</span> d',
              note: 'The distance to the film, divided by the width of the hole.' },
          ],
        },
        {
          id: 's-g3',
          layout: 'split',
          /* his second round, slide 39: add "No focusing" */
          title: 'Endless depth of field, no focusing',
          blocks: [
            { type: 'line', gen: 'box-dof', place: { row: 1, col: 1, w: '1/3', rgrow: true },
              html: 'A pinhole has no focus, so nothing is out of focus. Near and far are almost equally soft; only very close subjects get softer.' },
            /* the photograph he gave the link for, 16-09-2026, with his source */
            { type: 'figure', src: 'g3-guhl-pinhole-portrait.jpg',
              alt: 'A pinhole portrait: the sitter close to the camera, the room behind just as soft',
              caption: 'Markus Guhl · Pinhole portraits in Berlin · wayupnorth.co',
              place: { row: 1, col: 2, w: '2/3', fillH: true } },
          ],
        },
        {
          id: 's-g5',
          layout: 'split',
          title: 'Making the hole',
          blocks: [
            { type: 'line', gen: 'hole-make', html: 'Aluminium from a drink can is thin enough. Push a needle through it; do not drill.' },
            { type: 'steplist', gen: 'steps-hole', steps: [
              { title: 'Cut and flatten', detail: 'A 2 × 2 cm square from the wall of a can.' },
              { title: 'Push, do not twist', detail: 'A sewing needle in an eraser, a piece of card underneath as a spacer.', value: 'thinner card · smaller hole' },
              { title: 'Turn the metal', detail: 'Rotate the square around the needle.' },
              { title: 'Sand both sides', detail: 'The burr is what ruins the edge.' },
              { title: 'Blacken and number it', detail: 'Marker around the hole; a number so you know which measurement is which.' },
            ] },
            /* the photograph he gave the link for, 16-09-2026 */
            { type: 'figure', src: 'g5-making-the-hole.jpg',
              alt: 'A needle pushed through a square of drink-can aluminium, held over a cutting mat',
              caption: 'Making the hole · photography.tutsplus.com (Envato Tuts+)' },
          ],
        },
        {
          id: 's-g6',
          layout: 'stacked',
          title: 'Measuring the hole',
          blocks: [
            { type: 'line', gen: 'hole-laser', html: 'A laser through the hole throws rings on a wall. Measure how far the wall is and how wide the first dark ring is across, and the hole&rsquo;s width follows.' },
            { type: 'model', id: 'laser', fig: 16,
              caption: 'Set the distance to the wall and the diameter of the first dark ring; the hole is the answer. A short corridor makes the rings too small to read.' },
            /* HIS WORDS, 20-09-2026, proofread on his word. */
            { type: 'note', html: 'Update: the calculation ran the other way round, and it now follows the order you measure in. You measure the distance to the wall and the diameter of the ring on the wall, and the pinhole&rsquo;s diameter follows from them.' },
          ],
        },
        {
          id: 's-g2',
          layout: 'argument',
          title: 'Long exposure times due to aperture',
          blocks: [
            { type: 'line', gen: 'box-long', html: 'What a camera does in a fraction of a second, the box does in about a second. On paper, in tens of seconds.' },
            { type: 'spec', gen: 'spec-map', caption: 'The same daylight, two cameras',
              rows: [
                ['Your camera', 'f/16 · 1/125 · ISO 100'],
                ['The box, same light', 'f/167 · about 1 second · ISO 100'],
                ['On paper instead', 'f/167 · about 15 seconds, then a test strip · ISO 6'],
              ] },
          ],
        },
        {
          id: 's-g4',
          layout: 'argument',
          title: 'Photographic Paper',
          blocks: [
            { type: 'line', gen: 'mat-iso', html: 'Paper is about ISO 3 to 6, four to seven stops slower than film, and sensitive to blue and green light, not red.' },
            { type: 'spec', gen: 'spec-speed', caption: 'The same light at f/167',
              rows: [
                ['Film, ISO 400', 'about 1/4 second'],
                ['Film, ISO 100', 'about 1 second'],
                ['Paper, ISO 6', 'about 15 seconds; test-strip it'],
              ] },
            { type: 'note', gen: 'mat-iso2', kind: 'warning', html: 'Calculate the exposure before you tape the paper in.' },
          ],
        },
      ],
    },
    {
      id: 'c-sums',
      title: 'The two sums',
      n: 'B4',
      part: 'b',
      head: { kicker: 'Part B · The lens, and the box' },
      steps: [
        {
          id: 's-h1',
          layout: 'stacked',
          title: 'The hole and the optimal f-number',
          blocks: [
            { type: 'line', gen: 'sum-ap', html: 'Enter the hole and the depth of the box. It gives the best hole, the best depth and the f-number.' },
            { type: 'demo', id: 'pinholecalc', fig: 17, pin: { tab: 0 },
              caption: 'Hole and depth in; the best hole, the f-number and the blur on the film out.' },
          ],
        },
        {
          id: 's-h2',
          layout: 'stacked',
          title: 'The lightmeter reading and the exposure calculation',
          blocks: [
            { type: 'line', gen: 'sum-time', html: 'Enter the meter reading, your f-number and the material. It gives the time, with reciprocity included.' },
            { type: 'demo', id: 'pinholecalc', fig: 18, pin: { tab: 1 },
              caption: 'Past a second the material stops keeping up; the gap between the arithmetic and the answer is reciprocity.' },
          ],
        },
      ],
    },
    {
      id: 'c-next',
      title: 'Next week',
      n: 'B7',
      part: 'b',
      head: { kicker: 'Part B · The lens, and the box' },
      steps: [
        {
          id: 's-next',
          layout: 'argument',
          title: 'Next week · Camera II',
          blocks: [
            { type: 'line', gen: 'next-say', html: 'Workflow: files, naming, storage, and getting a negative or a raw file ready to work on.' },
            { type: 'generate', what: 'Batu writes what they bring next week.' },
          ],
        },
      ],
    },
  ],
};
