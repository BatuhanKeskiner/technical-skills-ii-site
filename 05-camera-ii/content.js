/* ============================================================
   Week #5 · Camera II — content source · draft v0.1

   Built 30-09-2026 from the goals doc (Claude Docs, "Week 5 ·
   Camera II — Goals") and his instruction of 29-09:

     "leave the analog workflow empty. Make one section first that
      is digital workflow. Stay away from wordy and unnecessary
      claims. I want you to be clear, instructive and technical.
      Use the same language as your book resources. Neutral,
      explaining, and clear. ... Leave the images I need to fill
      empty / place holder."

   The rules of _notes/WEEK-03-FROM-BATU.md hold here too:
   · order by dependency; a sentence states a mechanism or a fact
   · a title is the subject, not a claim
   · every sentence with `gen` is mine and orange until he ticks it
   · pictures and screenshots are his; each placeholder says what
     it waits for
   · an interactive that does not exist yet is a demoPlaceholder
     carrying its brief; names are provisional until he names them

   Analog Workflow is deliberately empty (his word, 29-09).
   Tethered Shooting & Capture One and the #3 hand-out come next.
   ============================================================ */

window.TS2_WEEK = {
  course: 'Technical Skills II',
  institution: 'KABK · BA Photography',
  year: '2026–27',
  number: '5',
  title: 'Camera II',
  standfirst: '',
  revision: 'draft v0.1',
  next: { label: 'Light I', href: '#' },

  chapters: [
    /* ================================================== 0 · Schedule */
    {
      id: 'c-today',
      title: 'Schedule',
      n: '',
      head: { standfirst: 'Week #5 · Camera II' },
      steps: [
        {
          id: 's-0',
          cls: 'title',
          layout: 'stacked',
          title: 'Schedule',
          blocks: [
            /* Drafted 30-09 night from the time budget in notes/STORYBOARD.md (proposed 29-09,
               not agreed) and week 3's class times. Orange until he ticks it. */
            {
              type: 'schedule', gen: 'w5-schedule-2',
              plan: [
                'Photogram Submissions',
                'Analog and Digital · Analog Workflow',
                'Digital Workflow · Formats, Files & Folders',
                'Break',
                'Digital Workflow · Lightroom & Storage',
                'Tethered Shooting & Capture One',
                'Demo: Tethered Shooting',
                'Assignment #3: Anti-Self Portrait',
                'End',
              ],
              classes: [
                { name: 'PHft2A', group: 'Full time', when: 'Thursday 01.10 · morning',
                  times: ['09:30', '09:45', '10:20', '11:00', '11:15', '11:45', '11:55', '12:25', '12:30'] },
                { name: 'PHft2B', group: 'Full time', when: 'Thursday 01.10 · afternoon',
                  times: ['13:30', '13:45', '14:20', '15:00', '15:15', '15:45', '15:55', '16:25', '16:30'] },
                { name: 'PHptc2', group: 'Part time', when: 'Monday 05.10 · afternoon',
                  times: ['13:30', '13:45', '14:20', '15:00', '15:15', '15:45', '15:55', '16:25', '16:30'] },
              ],
            },
          ],
        },
        /* The pinhole radius/diameter page (his word 20-09) was taken out 30-09 on his note
           "böyle bir sunum olmayacak"; it is kept in notes/REMOVED-s-0b.js. */
        {
          id: 's-photogram',
          /* his word 30-09: "Dersin başında Photogram assignmentına 15 dakika ayıralım." */
          layout: 'statement',
          title: 'Assignment #1: Photogram',
          blocks: [
            { type: 'lineBig', gen: 'w5-photogram-say', html: 'The photograms from Assignment #1 are reviewed together.' },
          ],
        },
      ],
    },

    /* ================================================== Front · Analog and Digital — his request 30-09:
       "one page in the very beginning explaining what is analog and what is
       digital. in terms of signals with visuals." The visual is a placeholder
       until the information-design library arrives. */
    {
      id: 'c-signal',
      title: 'Analog and Digital',
      n: '',
      steps: [
        {
          id: 's-anadig',
          /* 30-09, his note on the drawing variants: a page before Analog and Digital, "Whats Analog and Whats Digital".
             22:14, his note on the line: "'These refer to the type of the signals' diye başla. Ve yukarıya taşı" */
          layout: 'stacked',
          title: 'What’s Analog and What’s Digital',
          blocks: [
            { type: 'line', gen: 'w5-anadig-say-2', html: 'These refer to the type of the signals. Analog and digital are two ways of recording a quantity, as a continuous value or as a number.' },
            { type: 'diagram', gen: 'w5-anadig-dia-2', form: 'options', data: {"items": [
              {"name": "Analog", "role": "Continuous", "line": "The recorded quantity can take any value within its range, like the density of silver across a negative."},
              {"name": "Digital", "role": "In steps", "line": "The recorded quantity is a whole number from a fixed set, like the number a camera records for each pixel."}]} },
            /* Round 30-09 23:48, his word: an LP and a zoomed groove section; a CD and a strongly zoomed CD section */
            { type: 'gallery', layout: 'grid', caption: 'Images: Evan-Amos, Wikimedia Commons (LP); University of Rochester: URnano (groove); Dillan Payne, CC BY-SA 4.0 (CD); Tycho, CC0 (pits).', images: [
              { src: 'anadig-lp.jpg', alt: 'A 12-inch vinyl LP record', cap: 'LP' },
              { src: 'anadig-lp-groove.jpg', alt: 'Electron micrograph of an LP groove, cut through, the groove walls continuously wavy', cap: 'LP groove · electron microscope, ×142' },
              { src: 'anadig-cd.jpg', alt: 'The reading side of an audio CD', cap: 'CD' },
              { src: 'anadig-cd-pits.jpg', alt: 'Electron micrograph of the pits of a CD in tracks, each pit a separate step', cap: 'CD pits · electron microscope' },
            ] },
          ],
        },
        {
          id: 's-signal',
          layout: 'stacked',
          title: 'Analog and Digital',
          blocks: [
            { type: 'line', gen: 'w5-sig-say-2', html: 'On a negative, density changes continuously across the frame, so film records an <em class="term">analog</em> signal. A sensor measures the light at each pixel, and the camera converts each measurement to a number, so it records a <em class="term">digital</em> signal.' },
            { type: 'diagram', gen: 'w5-sig-dia-2', form: 'signal', data: {"samples":12,"levels":8,"panels":[{"name":"Analog","line":"Film records light as a continuous range of silver or dye density."},{"name":"Sampling","line":"A sensor measures light at each pixel."},{"name":"Quantisation","line":"Each reading is rounded to one of a fixed number of levels; bit depth sets how many."}]} },
          ],
        },
        {
          id: 's-b17',
          layout: 'stacked',
          title: 'Pixels and DPI',
          blocks: [
            { type: 'line', gen: 'w5-b17-say', html: 'Image size is measured in pixels. The ppi value stored in the file, often labelled dpi, is used only when the file is printed.' },
            { type: 'diagram', gen: 'w5-b17-dia', form: 'formula', data: {"terms": [{"t": "Print size", "u": "inches", "key": 1}, {"t": "=", "op": 1}, {"t": "Pixels", "u": "along one side"}, {"t": "÷", "op": 1}, {"t": "Resolution", "u": "ppi"}], "example": ["20 in", "=", "6,000 px", "÷", "300 ppi"], "note": "20 inches is 50.8 cm."} },
            { type: 'text', gen: 'w5-b17-text', paras: ['A digital image has a fixed number of pixels. Resolution is given as ppi, pixels per inch, for a file and as dpi, dots per inch, for a printer; the two terms are often used for the same value. The ppi value stored in the file tells a printer how many pixels to place in an inch, so changing it without resampling changes the print size while the pixels stay the same. A screen ignores the value and draws the image pixel by pixel.'] },
            { type: 'figure', src: 'b17-image-size.jpg', alt: 'Photoshop’s Image Size dialog: 7000 × 4667 px at 300 pixels per inch, 59.27 × 39.51 cm', caption: 'Photoshop · Image Size. 7,000 px ÷ 300 ppi = 23.3 in = 59.27 cm. Screenshot: Batuhan Keskiner.' },
          ],
        },
        {
          id: 's-b15',
          layout: 'stacked',
          title: 'Bit Depth',
          blocks: [
            { type: 'line', gen: 'w5-b15-say', html: 'Bit depth is the number of bits that store each colour channel of a pixel. Each added bit doubles the number of tones.' },
            /* 30-09, his pick in the Comparative Review: Design's 11C, each bit depth drawn as its own grey ramp */
            { type: 'diagram', gen: 'w5-b15-dia', form: 'alt', data: { topic: 10, key: 'C' } },
            { type: 'text', gen: 'w5-b15-text-3', paras: ['An 8-bit channel holds 256 tones and a 16-bit channel 65,536. On a screen the two look the same, because most screens show 8 bits per channel. The difference appears in editing. When a curve or a white-balance change stretches part of the tonal range, the 256 tones of an 8-bit file are spread apart and show as bands, and the 65,536 of a 16-bit file stay smooth. Most raw files are recorded at 12 or 14 bits, and some medium-format cameras record 16. They are edited at 16 bits, and the 8-bit JPEG is made last.'] },
          ],
        },
        {
          id: 's-b15e',
          /* 30-09: the Bit Depth instrument on its own page; under the ramps and the paragraph it had no room */
          layout: 'stacked',
          title: 'Bit Depth',
          blocks: [
            { type: 'line', gen: 'w5-b15e-say-2', html: 'Set the curve to Hard, then switch between 16 and 8 bit and look at the sky. Even though it doesn’t feel like there is a difference between 8 and 16 bit with your eyes, the effect gets dramatic when you start editing and modifying colours or tones of the original photo.' },
            { type: 'demo', id: 'bitdepth', size: 'full' },
          ],
        },
/* His own diagram, 29-09: "zamanında şöyle bir şey yapmışım bunu direkt uyarlayalım."
   Same nodes and branches. Round 30-09 23:48, his word: every name capitalised, analog stages and
   their arrows orange, digital green; the analog process further left, the middle line with it,
   each process centred in its column. */
{
  id: 's-signal-wf',
  layout: 'stacked',
  title: 'Analog and Digital Workflow',
  blocks: [
    { type: 'svg', gen: 'w5-sigwf-tree', svg: '<svg viewBox="0 0 1061 520" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><defs><marker id="w5wf-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--signal-600, #C42D00)" stroke="none"/></marker><marker id="w5wf-d" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--state-ok, #1F7A4D)" stroke="none"/></marker></defs><style>text{stroke:none;font-weight:500}.lab{font-family:var(--font-mono);font-size:12px;letter-spacing:.12em;font-weight:400}.hair{stroke-width:1;stroke-dasharray:1 3}</style><text x="190" y="64" text-anchor="middle" style="fill:var(--ink-900, currentColor)">Scene</text><path d="M190 74V94" style="stroke:var(--signal-600, #C42D00)" marker-end="url(#w5wf-a)"/><text x="190" y="120" text-anchor="middle" style="fill:var(--signal-600, #C42D00)">Film Stock</text><path d="M190 130V150" style="stroke:var(--signal-600, #C42D00)" marker-end="url(#w5wf-a)"/><text x="190" y="176" text-anchor="middle" style="fill:var(--signal-600, #C42D00)">Camera</text><path d="M190 186V206" style="stroke:var(--signal-600, #C42D00)" marker-end="url(#w5wf-a)"/><text x="190" y="232" text-anchor="middle" style="fill:var(--signal-600, #C42D00)">Film Development</text><path d="M190 242V262" style="stroke:var(--state-ok, #1F7A4D)" marker-end="url(#w5wf-d)"/><text x="190" y="288" text-anchor="middle" style="fill:var(--state-ok, #1F7A4D)">Scanning</text><path d="M190 298V318" style="stroke:var(--state-ok, #1F7A4D)" marker-end="url(#w5wf-d)"/><text x="190" y="344" text-anchor="middle" style="fill:var(--state-ok, #1F7A4D)">Creative Editing</text><path d="M190 354V374" style="stroke:var(--state-ok, #1F7A4D)" marker-end="url(#w5wf-d)"/><text x="190" y="400" text-anchor="middle" style="fill:var(--state-ok, #1F7A4D)">Displaying</text><path d="M190 410V430" style="stroke:var(--state-ok, #1F7A4D)" marker-end="url(#w5wf-d)"/><text x="190" y="456" text-anchor="middle" style="fill:var(--state-ok, #1F7A4D)">Digital Printing</text><path d="M283 226H414V262" style="stroke:var(--signal-600, #C42D00)" marker-end="url(#w5wf-a)"/><text x="414" y="288" text-anchor="middle" style="fill:var(--signal-600, #C42D00)">Darkroom</text><path d="M414 298V318" style="stroke:var(--signal-600, #C42D00)" marker-end="url(#w5wf-a)"/><text x="414" y="344" text-anchor="middle" style="fill:var(--signal-600, #C42D00)">Paper</text><path d="M414 354V374" style="stroke:var(--signal-600, #C42D00)" marker-end="url(#w5wf-a)"/><text x="414" y="400" text-anchor="middle" style="fill:var(--signal-600, #C42D00)">Editing</text><path d="M414 410V430" style="stroke:var(--signal-600, #C42D00)" marker-end="url(#w5wf-a)"/><text x="414" y="456" text-anchor="middle" style="fill:var(--signal-600, #C42D00)">Paper Development</text><path d="M414 466V486" style="stroke:var(--signal-600, #C42D00)" marker-end="url(#w5wf-a)"/><text x="414" y="512" text-anchor="middle" style="fill:var(--signal-600, #C42D00)">Analog Print</text><path class="hair" d="M100 282H88V450H100" style="stroke:var(--state-ok, #1F7A4D)"/><text class="lab" x="74" y="366" text-anchor="middle" transform="rotate(-90 74 366)" style="fill:var(--state-ok, #1F7A4D)">DIGITAL</text><path class="hair" d="M250 114H530V506H506" style="stroke:var(--signal-600, #C42D00)"/><text class="lab" x="546" y="310" text-anchor="middle" transform="rotate(-90 546 310)" style="fill:var(--signal-600, #C42D00)">ANALOG</text><text class="lab" x="305" y="14" text-anchor="middle" style="fill:var(--ink-900, currentColor)">ANALOG PROCESS</text><path d="M610 0V516" stroke-width="1.5"/><text x="857" y="64" text-anchor="middle" style="fill:var(--ink-900, currentColor)">Scene</text><path d="M857 74V94" style="stroke:var(--state-ok, #1F7A4D)" marker-end="url(#w5wf-d)"/><text x="857" y="120" text-anchor="middle" style="fill:var(--state-ok, #1F7A4D)">Camera</text><path d="M857 130V150" style="stroke:var(--state-ok, #1F7A4D)" marker-end="url(#w5wf-d)"/><text x="857" y="176" text-anchor="middle" style="fill:var(--state-ok, #1F7A4D)">Camera Colour Profile</text><path d="M857 186V206" style="stroke:var(--state-ok, #1F7A4D)" marker-end="url(#w5wf-d)"/><text x="857" y="232" text-anchor="middle" style="fill:var(--state-ok, #1F7A4D)">RAW Conversion</text><path d="M857 242V262" style="stroke:var(--state-ok, #1F7A4D)" marker-end="url(#w5wf-d)"/><text x="857" y="288" text-anchor="middle" style="fill:var(--state-ok, #1F7A4D)">Creative Editing</text><path d="M857 298V318" style="stroke:var(--state-ok, #1F7A4D)" marker-end="url(#w5wf-d)"/><text x="857" y="344" text-anchor="middle" style="fill:var(--state-ok, #1F7A4D)">Displaying</text><path d="M857 354V374" style="stroke:var(--state-ok, #1F7A4D)" marker-end="url(#w5wf-d)"/><text x="857" y="400" text-anchor="middle" style="fill:var(--state-ok, #1F7A4D)">Printing</text><path class="hair" d="M738 114H726V394H738" style="stroke:var(--state-ok, #1F7A4D)"/><text class="lab" x="712" y="254" text-anchor="middle" transform="rotate(-90 712 254)" style="fill:var(--state-ok, #1F7A4D)">DIGITAL</text><text class="lab" x="835" y="14" text-anchor="middle" style="fill:var(--ink-900, currentColor)">DIGITAL PROCESS</text></svg>' },
  ],
},
      ],
    },

    /* ================================================== A · Analog — EMPTY, his word 29-09 */
    {
      id: 'c-analog',
      title: 'Negatives',
      part: 'a',
      partTitle: 'Analog Workflow',
      head: { kicker: 'Part A · Analog Workflow' },
      steps: [
        /* Drafted 29-09 night on his word in the decision doc ("Evet"). Storyboard:
           notes/STORYBOARD.md, Part A REVISED. Register: Part B. Facts: Ilford processing
           guide, Langford ch. 8 and 10, Negative Lab Pro scanning guide (notes/RESOURCES.md).
           Every picture is his: negatives, scans, screenshots. */
        {
          id: 's-a1',
          /* 30-09, his notes: drawn like Digital Workflow, left to right in time order; the analog (darkroom) route branches off the negative */
          /* Round 30-09 23:48: Finished file removed, Export into Storage, the print does not go into Storage; his tags and link names */
          layout: 'stacked',
          title: 'Analog Workflow',
          blocks: [
            { type: 'diagram', gen: 'w5-a1-dia-2', form: 'flow', data: {"stages": [{"id": "cam", "name": "Camera", "col": 0, "icon": "camera"}, {"id": "neg", "name": "Negative", "col": 1, "icon": "film", "tags": ["Store Analog"]}, {"id": "scan", "name": "Scanner", "col": 2, "icon": "scanner", "tags": ["Film Scanners", "Scanning Software"]}, {"id": "dark", "name": "Darkroom", "col": 2, "icon": "enlarger", "tags": ["Paper"]}, {"id": "pc", "name": "Computer", "col": 3, "icon": "laptop", "tags": ["Photo Editing"], "key": true}, {"id": "print", "name": "Darkroom Print", "col": 3, "icon": "printer"}, {"id": "store", "name": "Storage", "col": 4, "icon": "drives", "tags": ["File Structure", "Archive"]}], "links": [{"from": "cam", "to": "neg", "label": "Film Development"}, {"from": "neg", "to": "scan", "label": "Cut"}, {"from": "neg", "to": "dark", "label": "Enlarge"}, {"from": "scan", "to": "pc", "label": "Scan"}, {"from": "dark", "to": "print", "label": "Paper Development"}, {"from": "pc", "to": "store", "label": "Export"}]} },
          ],
        },
        {
          id: 's-a2',
          /* 30-09, hızlı karar rows 5-7: his negative in the callouts; edge markings first, as Ilford reads a film */
          layout: 'stacked',
          title: "Reading a Negative",
          blocks: [
            { type: 'line', gen: 'w5-a2-say', html: 'Put the strip on a light box and look through a loupe. Four places on it tell you what happened in the camera and in the tank.' },
            { type: 'diagram', gen: 'w5-a2-b-dia-3', form: 'callouts', data: {"image": {"src": "assets/devchart/devchart-correct-correct-neg.jpg", "alt": "A correctly exposed and developed 35 mm negative on a light box", "aspect": 0.9210422424003158}, "parts": [{"name": "Edge markings", "note": "exposed at the factory · to understand negative development", "x": 0.965, "y": 0.05, "key": 1}, {"name": "Film base", "note": "detect light leaks, fog, fixer faults", "x": 0.13, "y": 0.09}, {"name": "Shadows", "note": "low silver density · judge exposure", "x": 0.27, "y": 0.3}, {"name": "Highlights", "note": "high silver density · judge development", "x": 0.6, "y": 0.58}]} },
            { type: 'note', html: 'Alisa — Photo: Batuhan Keskiner. Simulated from a single photo.' },
          ],
        },
        {
          id: 's-a3',
          /* 30-09, hızlı karar rows 8-12: the five cases with his negatives and prints, a Negative / Print switch */
          layout: 'stacked',
          title: "Exposure or Development?",
          blocks: [
            { type: 'line', gen: 'w5-a3-say', html: 'Exposure sets the shadows. Development sets the highlights and the contrast. The edge markings receive no exposure in the camera, so they separate the two.', place: { row: 1, w: 'full' } },
            /* Round 30-09 23:48: a reading line under each; the enlargement opens it beside Correct */
            { type: 'gallery', layout: 'grid', gen: 'w5-a3-read', compare: 0, flip: ['Negative', 'Invert'], caption: 'Alisa — Photo: Batuhan Keskiner. Simulated from a single photo.', place: { row: 2, w: 'full', rgrow: true, fillH: true }, images: [
              { src: 'assets/devchart/devchart-correct-correct-neg.jpg', flip: 'assets/devchart/devchart-correct-correct-inv.jpg', alt: 'correct', cap: 'Correct', sub: 'Detail in the shadows and in the highlights' },
              { src: 'assets/devchart/devchart-under-correct-neg.jpg', flip: 'assets/devchart/devchart-under-correct-inv.jpg', alt: 'under-exposed', cap: 'Under-exposed', sub: 'Thin shadows with little detail · edge markings normal' },
              { src: 'assets/devchart/devchart-over-correct-neg.jpg', flip: 'assets/devchart/devchart-over-correct-inv.jpg', alt: 'over-exposed', cap: 'Over-exposed', sub: 'Dense shadows, dense overall · edge markings normal' },
              { src: 'assets/devchart/devchart-correct-under-neg.jpg', flip: 'assets/devchart/devchart-correct-under-inv.jpg', alt: 'under-developed', cap: 'Under-developed', sub: 'Thin highlights, low contrast · faint edge markings' },
              { src: 'assets/devchart/devchart-correct-over-neg.jpg', flip: 'assets/devchart/devchart-correct-over-inv.jpg', alt: 'over-developed', cap: 'Over-developed', sub: 'Dense highlights · dark edge markings, darker base' },
            ] },
            { type: 'text', gen: 'w5-a3-push-2', paras: ['Longer development raises the contrast and the density of the highlights. It is used for film exposed at a higher speed than the box speed, which is called a push. Shadow detail that under-exposure did not record does not return. Shorter development lowers the contrast and is used for over-exposed film or a contrasty scene, which is called a pull.'], place: { row: 3, w: 'full' } },
                      ],
        },
        {
          id: 's-a3c',
          /* Round 30-09 23:48, his word: "Bu scanner comparison'ın aynısını bu 9'lu grid ve negatifleriyle birlikte
             Alisanın fotoğrafı için de yap ... tüm kombinasyonlara yan yana bakabilelim." Title provisional, as the instrument's. */
          layout: 'stacked',
          title: 'Exposure and Development',
          blocks: [
            { type: 'demo', id: 'devcompare', size: 'page' },
            { type: 'note', html: 'Alisa — Photo: Batuhan Keskiner. Simulated from a single photo.' },
          ],
        },

        {
          id: 's-a4',
          /* 30-09, hızlı karar rows 13-17: Ilford's order (symptom · cause · prevention), all thirteen faults
             as tabs on one page, a Negative / Print switch; the pictures are simulated from his photograph
             (notes/BRIEF-FAULTS.md) and come in as assets/faults/fault-<slug>-neg.jpg and -pos.jpg */
          layout: 'stacked',
          title: 'Developing Errors',
          blocks: [
            { type: 'line', gen: 'w5-a4-say-2', html: 'When a film comes out wrong after development, you can diagnose the cause by paying attention to these details.' },
            { type: 'tabs', gen: 'w5-a4-tabs-3', flip: ['Negative', 'Invert'], items: [{"tab": "Blank, no edge", "alt": "blank, no edge — negative", "rows": [["Symptom", "The whole film is clear, with no frames and no edge markings."], ["Cause", "The film was not developed. It went into water or fixer in place of the developer."], ["Prevention", "Set out the solutions in order before the light goes off, and label each one."]], "src": "assets/faults/fault-blank-no-edge-neg.jpg", "flip": "assets/faults/fault-blank-no-edge-inv.jpg"}, {"tab": "Blank, edge visible", "alt": "blank, edge visible — negative", "rows": [["Symptom", "The frames are clear, and the edge markings are dark and sharp."], ["Cause", "The film was developed but not exposed. It did not catch on the take-up spool, so it did not advance."], ["Prevention", "When loading, check that the rewind lever turns as the film advances."]], "src": "assets/faults/fault-blank-edge-neg.jpg", "flip": "assets/faults/fault-blank-edge-inv.jpg"}, {"tab": "Fogged", "alt": "fogged — negative", "rows": [["Symptom", "The film is dark overall, or dark in patches that run in from the edge."], ["Cause", "Light reached the film when the camera or the tank was loaded, or while it was stored."], ["Prevention", "Load the tank in total darkness, keep film out of bright light, and seal roll film after exposure."]], "src": "assets/faults/fault-fogged-neg.jpg", "flip": "assets/faults/fault-fogged-inv.jpg"}, {"tab": "Too dense", "alt": "too dense — negative", "rows": [["Symptom", "The negative is denser than expected."], ["Cause", "Over-exposure from a faulty meter or a wrong reading, or over-development from a time too long, a developer too warm or too strong, or too much agitation. Exposure or Development? shows how the edge markings tell the two apart."], ["Prevention", "Check the meter, and follow the time, temperature, dilution and agitation on the data sheet."]], "src": "assets/faults/fault-too-dense-neg.jpg", "flip": "assets/faults/fault-too-dense-inv.jpg"}, {"tab": "Too thin", "alt": "too thin — negative", "rows": [["Symptom", "The negative is thinner than expected."], ["Cause", "Under-exposure, or under-development from a time too short, a developer too cold or too dilute, or too little agitation. Exposure or Development? shows how the edge markings tell the two apart."], ["Prevention", "Check the meter, and follow the time, temperature, dilution and agitation on the data sheet."]], "src": "assets/faults/fault-too-thin-neg.jpg", "flip": "assets/faults/fault-too-thin-inv.jpg"}, {"tab": "Crescents", "alt": "crescents — negative", "rows": [["Symptom", "Short crescent-shaped marks appear at random."], ["Cause", "The film was creased or kinked while it was loaded onto the spiral."], ["Prevention", "Load the spiral slowly and without force."]], "src": "assets/faults/fault-crescent-neg.jpg", "flip": "assets/faults/fault-crescent-inv.jpg"}, {"tab": "Clear patches", "alt": "clear patches — negative", "rows": [["Symptom", "Parts of frames are light or clear."], ["Cause", "The film touched itself on the spiral, so the developer could not reach it."], ["Prevention", "Check that each turn of film runs in its own groove of the spiral."]], "src": "assets/faults/fault-clear-patches-neg.jpg", "flip": "assets/faults/fault-clear-patches-inv.jpg"}, {"tab": "Light band", "alt": "light band — negative", "rows": [["Symptom", "A lighter band runs along one edge of the film, through the pictures."], ["Cause", "There was too little developer in the tank to cover the film."], ["Prevention", "Fill the tank to the volume the maker gives for the number of spirals."]], "src": "assets/faults/fault-edge-band-neg.jpg", "flip": "assets/faults/fault-edge-band-inv.jpg"}, {"tab": "Milky", "alt": "milky — negative", "rows": [["Symptom", "The film looks milky or cloudy after fixing."], ["Cause", "The film is not fully fixed, because the fixer was too little, exhausted or over-diluted."], ["Prevention", "Put the film back in fresh fixer until it clears. Ilford and Kentmere films are fully fixed in 2–5 minutes."]], "src": "assets/faults/fault-milky-neg.jpg", "flip": "assets/faults/fault-milky-inv.jpg"}, {"tab": "Drying marks", "alt": "drying marks — negative", "rows": [["Symptom", "Dull spots and irregular marks on the surface of the film."], ["Cause", "Drops of water dried on the film, more often with hard water."], ["Prevention", "Add a wetting agent to the last rinse, and squeegee or wipe the film."]], "src": "assets/faults/fault-drying-marks-neg.jpg", "flip": "assets/faults/fault-drying-marks-inv.jpg"}, {"tab": "Surge marks", "alt": "surge marks — negative", "rows": [["Symptom", "Denser streaks run from the sprocket holes into the frames."], ["Cause", "Too much agitation pushed the developer through the holes."], ["Prevention", "Agitate as often as the data sheet says, gently."]], "src": "assets/faults/fault-surge-neg.jpg", "flip": "assets/faults/fault-surge-inv.jpg"}, {"tab": "Air bells", "alt": "air bells — negative", "rows": [["Symptom", "Small clear round spots."], ["Cause", "Air bubbles on the film kept the developer off."], ["Prevention", "Tap the tank firmly on the bench after filling it and after each agitation."]], "src": "assets/faults/fault-air-bells-neg.jpg", "flip": "assets/faults/fault-air-bells-inv.jpg"}, {"tab": "Scratches", "alt": "scratches — negative", "rows": [["Symptom", "Thin straight lines along the length of the film."], ["Cause", "Grit on the camera’s pressure plate, in the cassette, or on a squeegee or a cloth was dragged across the film."], ["Prevention", "Keep squeegees and cloths clean, and dust the cassette lips."]], "src": "assets/faults/fault-scratches-neg.jpg", "flip": "assets/faults/fault-scratches-inv.jpg"}] },
          ],
        },
        {
          id: 's-a7',
          layout: 'stacked',
          title: 'Storing Negatives',
          /* 01-10, his round: the list smaller on the left, the picture on its right so it can be bigger */
          blocks: [
            { type: 'diagram', gen: 'w5-a7-b-dia-2', form: 'steps', data: {"orient": "v", "steps": [{"t": "Dry", "line": "A damp strip picks up dust, so film is cut only when fully dry."}, {"t": "Cut", "line": "Five or six frames a strip for 35 mm, by sleeve; for 120, two to four by frame size."}, {"t": "Sleeve", "line": "Polyethylene, polypropylene or acid-free paper sleeves; PVC gives off acid."}, {"t": "Label", "line": "Each sheet carries the date, the film and the roll number."}, {"t": "Contact sheet", "line": "A low-resolution scan of each sheet shows every frame without handling the film."}, {"t": "Store", "line": "Flat, dark, cool and dry, away from radiators and darkrooms."}]}, place: { row: 1, col: 1, w: '1/2' } },
            { type: 'figure', src: 'a7-sleeve.jpg', alt: 'Strips of negatives in a labelled archival sleeve', caption: 'An archival negative sleeve. Image: Print File, via amazon.com.', place: { row: 1, col: 2, w: '1/2', fillH: true, rgrow: true } },
          ],
        },
      ],
    },
    {
      id: 'c-scanning',
      title: "Scanning",
      part: 'a',
      steps: [
        {
          id: 's-a8',
          layout: 'stacked',
          title: 'Scanning Devices',
          blocks: [
            { type: 'line', gen: 'w5-a8-say-3', html: 'At home, the negative can be scanned flat, with low contrast, no tone clipped to pure black or white and no automatic corrections. Inversion and colour are then set in Lightroom, where they can be changed. A lab scanner inverts the negative and sets its colour during the scan.' },
            { type: 'spec', gen: 'w5-a8-routes-3',
              rows: [
                ['Flatbed', 'Epson V-series. 35 mm to 8 × 10 in on the V800 and V850, in holders up to 4 × 5 and larger sheets on the glass; slow; less resolution than a lab scanner on 35 mm and 120; focus set by the holder height'],
                ['Drum', 'Heidelberg Tango, and the Hasselblad Flextight as a virtual drum. The film is mounted on a drum, or bent around a curve, and read point by point; the most detail and tonal range; a service of specialist labs, priced per frame'],
                ['Camera Reproduction', 'Macro lens, light panel, copy stand. Fastest at home; sharpness from the lens; needs a level set-up'],
                ['Lab', 'Frontier or Noritsu. Colour and inversion decided by the operator'],
              ] },
            { type: 'gallery', layout: 'grid', caption: 'Images: Epson (V800), The Black and White Box (Frontier, S1R set-up, Noritsu), marktplaza.nl (Flextight).', images: [
              { src: 'a8-flatbed.jpg', alt: 'An Epson V800 flatbed scanner', cap: 'Flatbed · Epson V800' },
              { src: 'a8-flextight.jpg', alt: 'A Hasselblad Flextight film scanner', cap: 'Virtual drum · Hasselblad Flextight (Imacon)' },
              { src: 'a8-camera-scan.jpg', alt: 'A camera on a copy stand scanning film on a light panel', cap: 'Camera · Panasonic S1R set-up' },
              { src: 'a8-frontier-bwbox.jpg', alt: 'A Fujifilm Frontier SP3000 lab scanner', cap: 'Lab · Fujifilm Frontier' },
              { src: 'a8-noritsu.jpg', alt: 'A Noritsu HS-1800 lab scanner', cap: 'Lab · Noritsu HS-1800' },
            ] },
          ],
        },
        {
          id: 's-a6',
          layout: 'stacked',
          title: "Lab Scans",
          /* 01-10, his round: the pairs are the largest element, the words beside them, the table under them */
          blocks: [
            { type: 'carousel', images: [
              { src: 'a6-lab-1.jpg', alt: 'Frontier and Noritsu scans of the same frame, a boat on a beach' },
              { src: 'a6-lab-2.jpg', alt: 'Frontier and Noritsu scans of the same frame, a woman walking on a beach' },
              { src: 'a6-lab-3.jpg', alt: 'Frontier and Noritsu scans of the same frame, a portrait' },
              { src: 'a6-lab-4.jpg', alt: 'Frontier and Noritsu scans of the same frame, rocks and sea' },
              { src: 'a6-lab-5.jpg', alt: 'Frontier and Noritsu scans of the same frame, a figure on a beach' },
            ], caption: 'Scans: Carmencita Film Lab. Table after Carmencita and The Black and White Box.', place: { row: 2, col: 1, w: '2/3', fillH: true, rgrow: true } },
            { type: 'line', gen: 'w5-a6-say', html: 'Most labs scan colour film on a Fujifilm Frontier or a Noritsu. The operator sets the colour, so two labs return two different versions of the same negative.', place: { row: 2, col: 2, w: '1/3' } },
            { type: 'text', gen: 'w5-a6-bc-text-2', paras: ["Colour negative film carries an orange mask, formed by coloured couplers in its dye layers, which corrects the colour of the dyes when the negative is printed. Ask the lab for flat scans, saved as TIFF or as the largest JPEG, without sharpening. Labs offer scans in several sizes, so ask for the size in pixels before you order."], place: { row: 2, col: 2, w: '1/3' } },
            { type: 'diagram', gen: 'w5-a6-c-dia-2', form: 'table', data: {"head": "Scanner", "cols": ["Detail and grain", "File size", "Best for"], "mark": {"col": 0}, "rows": [{"name": "Frontier", "v": ["Smoothed grain", "Smaller", "Colour negative, saturated colour"]}, {"name": "Noritsu", "v": ["Sharper, more visible grain", "Larger", "Black and white, slide, a neutral look"]}]}, place: { row: 3, w: 'full' } },
          ],
        },
        {
          id: 's-a6c',
          /* 30-09, his word: "bu kıyaslamalar için bir perde interaction'ı yapalım ... sağa sola
             kaydırarak farkı gördüğümüz şey". The scans are The Black and White Box's, split out of
             their side-by-side composites and aligned to one another by
             _shared/tools/make-scancompare.py (assets/scancompare/). Title provisional. */
          layout: 'stacked',
          title: 'Scanner Comparison',
          blocks: [
            { type: 'line', gen: 'w5-a6c-say-2', html: 'Each frame here was scanned on up to six devices, from a flatbed and a camera to a drum scanner. The files differ in colour, contrast and resolution.' },
            { type: 'demo', id: 'scancompare', size: 'page' },
            { type: 'note', html: 'Scans: The Black and White Box, Film Scanner Comparison.' },
          ],
        },
        {
          id: 's-a6w',
          /* 30-09, his word: "bu yolladığım son linkten content de çekebiliriz" - the article's "Which scanner should I use?" */
          layout: 'stacked',
          title: 'Choosing a Scanner',
          blocks: [
            { type: 'line', gen: 'w5-a6w-say', html: 'The film format, use cases and the size of the final print might change which scanner to use.' },
            { type: 'scen', gen: 'w5-a6w-table-3',
              head: ['Film or print', 'Scanner', 'Why'],
              rows: [
                ['Colour negative (C-41)', 'Any; the Frontier for saturated colour, the Noritsu for a flatter, neutral look', 'The “film look” people describe is usually the Frontier’s colour.'],
                ['Slide (E-6)', 'Noritsu, or a drum scan', 'In the test the Frontier gave slide film a green cast and yellow highlights.'],
                ['Black and white', 'Noritsu', 'More shadow detail, no colour tint, and more controls for tone.'],
                ['4 × 5 and larger', 'Drum scanner, a flatbed, or the Imacon up to 4 × 5', 'The Frontier and the Noritsu take 35 mm, APS and 120 film.'],
                ['Prints larger than A2', 'Drum scanner or Imacon', 'Frontier and Noritsu files show their limits above A2.'],
              ] },
            { type: 'note', html: 'After The Black and White Box, Film Scanner Comparison.' },
          ],
        },
        {
          id: 's-a8s',
          /* 30-09: split from Scanning Devices, which had no room left for the device photographs */
          layout: 'stacked',
          title: 'Scanner Settings',
          blocks: [
            { type: 'spec', gen: 'w5-a8-settings-3', caption: 'Scanner software',
              rows: [
                ['Mode', 'Positive (transparency) mode, so the scanner does not invert; no automatic corrections; 16 bits per channel (48-bit colour, 16-bit greyscale), which keeps gradients smooth through editing'],
                ['Exposure', 'Flat, with the histogram ending short of both edges, so no tone is clipped to pure black or pure white'],
                ['Sharpening and dust removal', 'Off. Sharpen in Lightroom. Digital ICE, the scanner’s infrared dust removal, only on colour and chromogenic black-and-white film'],
                ['Inversion', 'Negative Lab Pro, a Lightroom plug-in for converting negatives, or the red, green and blue curves in Lightroom’s Tone Curve. Sampling the film base with the white-balance picker works on camera raw files; on a scanner TIFF it adds blue (Negative Lab Pro)'],
              ] },
            { type: 'figure', src: 'a8s-epson-scan.jpg', alt: 'Epson Scan in Professional Mode, set to positive film and 48-bit colour', caption: 'Epson Scan, Professional Mode. Image: Nate Johnson, Negative Lab Pro.' },
          ],
        },
        {
          id: 's-a5',
          /* 30-09: as tabs, like Developing Faults; text after _notes/research/SCANNING-FAULTS.md, pictures he saved */
          layout: 'stacked',
          title: 'Scanning Errors',
          blocks: [
            { type: 'line', gen: 'w5-a5-say-3', html: 'A scan can add errors the negative does not have, and it shows the errors the film already has. Each tab shows one error, its cause and how to avoid it.' },
            { type: 'tabs', gen: 'w5-a5-tabs-4', items: [{"tab": "Clipped tones", "cap": "A lab scan with the sky clipped to white (left), and a flatbed scan of the same negative that keeps the clouds (right). Image: KJ Vogelius.", "rows": [["Symptom", "Shadows print flat black and bright areas flat white, with no texture where the negative has detail."], ["Cause", "The scanner software spreads the tones to pure black and white for contrast, or its automatic exposure cuts one end of the range."], ["Prevention", "Ask the lab for flat scans; at home, scan flat with automatic corrections off and set the contrast afterwards."]], "src": "a5-clipped.jpg", "alt": "A lab scan with a white, clipped sky beside a flatbed scan of the same negative with clouds"}, {"tab": "Colour cast", "cap": "Image: minilabhelp.com.", "rows": [["Symptom", "The whole frame is tinted, most often deep blue or cyan."], ["Cause", "The orange mask of colour negative film was inverted without being removed, or the scanner’s own colour correction was left on."], ["Prevention", "On a flatbed, turn the scanner’s colour correction off. With a camera, white-balance the camera’s raw file on the film border before converting it in Negative Lab Pro."]], "src": "a5-colour-cast.jpg", "alt": "Colour cast on a film scan"}, {"tab": "Dust and hairs", "cap": "Infrared cleaning off. Image: Ubrigens.", "rows": [["Symptom", "Small specks and curled fibres, white on a scan of a negative."], ["Cause", "Dust on the film, the glass or the holder blocks the light and is enlarged with the frame; on a negative the blocked spot turns white when inverted."], ["Prevention", "Blow dust off the film, and clean the glass and the holders. Infrared cleaning (Digital ICE, iSRD) works on colour film and on chromogenic black-and-white film such as XP2, and fails on silver black-and-white film."]], "src": "a5-dust-2.jpg", "alt": "White specks and fibres on a colour negative scanned with infrared cleaning off"}, {"tab": "Scan lines", "cap": "Dirt in the scanner’s calibration area. Image: Negative Lab Pro forum.", "rows": [["Symptom", "Thin, straight, regular lines across the frame in the direction of the scan. The negative itself is clean."], ["Cause", "Dirt on the scanner glass or sensor blocks the same point on every pass, and the line is carried down the image."], ["Prevention", "Look at the negative under angled light. If the line is not there, clean the scanner or ask the lab to rescan."]], "src": "a5-scan-lines-2.jpg", "alt": "A thin straight line running top to bottom through a flatbed scan"}, {"tab": "Staircase effect", "cap": "Image: Richard Photo Lab.", "rows": [["Symptom", "Soft, evenly spaced bands across smooth areas such as sky, often coming in from one side."], ["Cause", "Probably flare or reflections inside the scanner where dense and thin parts of the negative lie side by side; the exact cause is uncertain."], ["Prevention", "On a flatbed, mask the frame tightly with black card; at a lab, ask for a rescan."]], "src": "a5-staircase.jpg", "alt": "Staircase effect on a film scan"}, {"tab": "Scratches", "cap": "Image: Learn Film Photography.", "rows": [["Symptom", "Long straight lines parallel to the film edge, running on through the gaps between frames."], ["Cause", "Contact while the film moves, from grit on the camera’s pressure plate, the cassette felt, rollers or a squeegee."], ["Prevention", "Find the source first. The same line on several rolls from one camera points to the camera. A rescan on the same scanner keeps the line. A wet-mounted drum scan fills fine scratches, and infrared cleaning reduces them on colour film."]], "src": "a5-scratches.jpg", "alt": "A long straight scratch across a film scan"}, {"tab": "Newton’s rings", "cap": "Image: Shoot It With Film.", "rows": [["Symptom", "Small patches of wavy, rainbow-coloured rings, most visible in even areas."], ["Cause", "Light interferes where the film touches the scanner glass."], ["Prevention", "Keep the film off the glass with a holder, or use anti-Newton glass against the shiny side of the film."]], "src": "a5-newton.jpg", "alt": "Rainbow-coloured Newton’s rings in the sky of a film scan"}, {"tab": "Soft frame", "cap": "A bowed slide, sharp on the left and soft on the right. Image: old-photo.com.", "rows": [["Symptom", "Part of the frame is sharp and part is soft, often a corner or one half."], ["Cause", "A scan has very little depth of field, so film that curls lifts out of focus; a flatbed focuses at a fixed holder height."], ["Prevention", "Find the sharpest holder height by scanning one frame at each setting; use a carrier that holds the film flat."]], "src": "a5-soft.jpg", "alt": "A slide scan sharp on the left and soft on the right"}, {"tab": "Banding", "cap": "A digital photograph of a sky edited in 8 bit. Image: Steve F, geograph.org.uk.", "rows": [["Symptom", "A smooth gradient such as sky breaks into visible steps."], ["Cause", "An 8-bit scan has 256 levels per channel; a strong edit spreads them apart and leaves gaps."], ["Prevention", "Scan at 16 bits per channel and edit in 16 bit. When the edit will be heavy, ask the lab whether its scanner writes 16-bit TIFF."]], "src": "a5-banding.jpg", "alt": "A clear sky broken into stepped bands"}, {"tab": "Grain aliasing", "cap": "The same negative scanned at 187 MP (left) and at 47 MP (right). Image: Negative Lab Pro forum.", "rows": [["Symptom", "Grain looks coarse, clumped or wormy."], ["Cause", "The scanner’s sensor spacing and the grain pattern can interfere, and sharpening in the scanner software makes grain coarser. How often this happens is disputed (Koren, Photoscientia)."], ["Prevention", "Turn scanner sharpening off and sharpen afterwards; scan at the scanner’s native resolution."]], "src": "a5-grain.jpg", "alt": "Fine grain (left) and coarse, clumped grain (right) from the same black-and-white negative"}] },
          ],
        },
        {
          id: 's-a9',
          layout: 'stacked',
          title: 'Resolution and Export',
          blocks: [
            { type: 'line', gen: 'w5-a9-say-2', html: 'Scan resolution is given in ppi, the number of pixels recorded for each inch of film. For the largest print, choose the scanner’s highest optical resolution; settings above it add pixels without adding detail. Keep a 16-bit full-resolution TIFF as the master (unedited) and export every other digital version from it.' },
            /* Round 30-09 23:48: medium and large format as well (6 × 7 taken as 56 × 70 mm) */
            { type: 'spec', gen: 'w5-a9-res-2', caption: 'Film format and scan resolution, printed at 300 ppi',
              rows: [
                ['35 mm · 2400 ppi', '24 × 36 mm · 2,268 × 3,402 px · 7.7 MP · print 19 × 29 cm'],
                ['35 mm · 4000 ppi', '24 × 36 mm · 3,780 × 5,669 px · 21.4 MP · print 32 × 48 cm'],
                ['6 × 7 · 3200 ppi', '56 × 70 mm · 7,055 × 8,819 px · 62.2 MP · print 60 × 75 cm'],
                ['8 × 10 in · 1200 ppi', '203 × 254 mm · 9,600 × 12,000 px · 115.2 MP · print 81 × 102 cm'],
              ] },
            { type: 'spec', gen: 'w5-a9-export-2',
              rows: [
                ['Master File', 'No compression, lossless TIFF, 16 bit (65,536 tones per channel), no sharpening applied; Adobe RGB, a colour space wider than a screen’s, for colour film, and greyscale for black-and-white film'],
                ['Preview Copy', 'JPEG (small, compressed with loss), sRGB (the colour space of screens), resized for screen or transferring, hand-in or print'],
                ['File Naming', 'Date first, then subject, initials, roll number and frame, as in 20261001_Cezanne_Paul_BK_2445_01.tif, or a separate naming convention for the analog archive'],
              ] },
          ],
        },
      ],
    },

    /* ================================================== B3 · Formats */
    {
      id: 'c-formats',
      title: 'File Formats',
      part: 'b',
      partTitle: 'Digital Workflow',
      head: { kicker: 'Part B · Digital Workflow' },
      steps: [
        {
          id: 's-b1',
          layout: 'stacked',
          title: "Digital Workflow",
          blocks: [
            { type: 'diagram', gen: 'w5-b1-b-dia-2', form: 'flow', data: {"stages": [{"id": "cam", "name": "Camera", "col": 0, "icon": "camera", "formats": ["RAW"]}, {"id": "scan", "name": "Scan", "col": 0, "icon": "film", "formats": ["TIFF"]}, {"id": "pc", "name": "Computer", "col": 1, "icon": "laptop", "tags": ["Lightroom", "Capture One", "Photoshop"], "key": true, "formats": ["PSD", "TIFF"]}, {"id": "file", "name": "Edited Image", "col": 2, "icon": "card", "formats": ["TIFF"]}, {"id": "store", "name": "Storage", "col": 3, "icon": "drives", "tags": ["Working drive", "Archive", "Backup"], "formats": ["DNG", "PSD"]}, {"id": "show", "name": "Display", "col": 4, "icon": "monitor", "formats": ["JPEG"]}, {"id": "print", "name": "Print", "col": 4, "icon": "printer", "formats": ["TIFF", "PDF"]}], "links": [{"from": "cam", "to": "pc", "label": "Import"}, {"from": "scan", "to": "pc", "label": "Import"}, {"from": "pc", "to": "file", "label": "Edit · Export"}, {"from": "file", "to": "store", "label": "Store"}, {"from": "store", "to": "show", "label": "Deliver"}, {"from": "store", "to": "print", "label": "Deliver"}]} },
          ],
        },
        {
          id: 's-b12',
          layout: 'stacked',
          title: 'File Formats',
          blocks: [
            { type: 'line', gen: 'w5-b12-say-2', html: 'Each format has its own use cases and functions. Raw is used at capture, PSD while editing, DNG and PSD in the archive, JPEG for online and screens, and TIFF or PDF for print.' },
            /* 01-10, his yes in the doc: Digital Workflow keeps the flow; here the formats by stage, archive DNG + PSD as there */
            { type: 'diagram', gen: 'w5-b12-dia-2', form: 'table', data: {"head": "Stage", "cols": ["Format", "Why"], "mark": {"col": 0}, "rows": [{"name": "Capture", "v": ["RAW", "All the sensor data, kept for editing"]}, {"name": "Scan", "v": ["TIFF", "The scan, saved without loss"]}, {"name": "Edit", "v": ["PSD, TIFF", "Layers and adjustments stay editable"]}, {"name": "Archive", "v": ["DNG, PSD", "Raw data in an open format; the layered master"]}, {"name": "Screen", "v": ["JPEG", "Small files for the web and screens"]}, {"name": "Print", "v": ["TIFF, PDF", "Full quality for the printer"]}]} },
            { type: 'text', gen: 'w5-b12-text', paras: ['A raw file is the sensor data with the camera settings attached, before it has been turned into an image; it is read by raw-processing software. PSD stores the layers and adjustments made while editing. For the archive, DNG keeps raw data in an open, documented format, and TIFF keeps a finished image without loss. The copies for screen and print are exported last.'] },
          ],
        },
        {
          id: 's-b16',
          layout: 'stacked',
          title: 'Colour Space',
          blocks: [
            { type: 'line', gen: 'w5-b16-say', html: 'A colour space sets the range of colours a file can describe. Lightroom edits in a wide space; the file’s space is set at export.' },
            { type: 'scen', gen: 'w5-b16-table-2',
              head: ['Colour space', 'Range', 'Use it for'],
              rows: [
                ['sRGB', 'Smallest of the three RGB spaces and the most common; additive colour mixing', 'Screens, web, most labs'],
                ['Adobe RGB', 'Wider colour range in greens and cyans', 'Print workflows'],
                ['ProPhoto RGB', 'Widest', 'Editing in Lightroom'],
                ['CMYK', 'Suitable for printing, subtractive colour mixing', 'Press — converted by the printer'],
              ] },
            { type: 'text', gen: 'w5-b16-text', paras: ['sRGB is the standard for screens and the web, and a file without a profile is usually read as sRGB. Adobe RGB and ProPhoto RGB hold more saturated colours than most screens show; in a program that ignores the profile those colours are shifted and look dull. Files for screens are therefore exported in sRGB, and the wider spaces are kept for editing and print.'] },
            { type: 'note', gen: 'w5-b16-note', html: 'Colour management is covered in Colour II.' },
          ],
        },
        {
          id: 's-b13c',
          layout: 'stacked',
          title: 'Compression and Resize',
          blocks: [
            { type: 'demo', id: 'compression', size: 'full', place: { row: 1, col: 1, w: 'full', rgrow: true } },
            { type: 'text', gen: 'w5-b13c-text-2', paras: ['Lossless compression, such as ZIP or LZW in a TIFF, writes repeated patterns in the data more briefly, and opening the file restores every pixel. JPEG divides the image into blocks of 8 × 8 pixels and discards the fine detail and colour variation the eye notices least. The quality setting decides how much is discarded.'], place: { row: 2, col: 1, w: 'full' } },
          ],
        },
        {
          id: 's-b13g',
          /* 30-09, his word: "Multiple Compression gösterimi için de bir asset üret … Bir görseli adım adım slider ile
             dönüşümünü görelim." Frames made by _shared/tools/make-generations.py */
          layout: 'stacked',
          title: 'Generation Loss',
          blocks: [
            { type: 'line', gen: 'w5-b13g-say', html: 'Every save of an edited JPEG compresses it again, and the losses add up. This is generation loss.' },
            { type: 'sequence', title: 'Saves', frames: [
              { src: 'assets/generations/gen-000.jpg', detail: 'assets/generations/gen-000-detail.png', label: 'Original', alt: 'The alley photograph after original' },
              { src: 'assets/generations/gen-001.jpg', detail: 'assets/generations/gen-001-detail.png', label: '1 save', alt: 'The alley photograph after 1 save' },
              { src: 'assets/generations/gen-002.jpg', detail: 'assets/generations/gen-002-detail.png', label: '2 saves', alt: 'The alley photograph after 2 saves' },
              { src: 'assets/generations/gen-005.jpg', detail: 'assets/generations/gen-005-detail.png', label: '5 saves', alt: 'The alley photograph after 5 saves' },
              { src: 'assets/generations/gen-010.jpg', detail: 'assets/generations/gen-010-detail.png', label: '10 saves', alt: 'The alley photograph after 10 saves' },
              { src: 'assets/generations/gen-020.jpg', detail: 'assets/generations/gen-020-detail.png', label: '20 saves', alt: 'The alley photograph after 20 saves' },
              { src: 'assets/generations/gen-050.jpg', detail: 'assets/generations/gen-050-detail.png', label: '50 saves', alt: 'The alley photograph after 50 saves' },
              { src: 'assets/generations/gen-100.jpg', detail: 'assets/generations/gen-100-detail.png', label: '100 saves', alt: 'The alley photograph after 100 saves' },
            ] },
            { type: 'note', gen: 'w5-b13g-note-2', html: 'The photograph was saved 100 times. Each save used another quality setting between 30 and 80, as different apps and platforms do, and was made with the picture moved by up to two pixels, as a crop does. Saved again unchanged at one quality, a JPEG barely changes after the first save. Photo: Batuhan Keskiner.' },
          ],
        },
        /* His request 30-09: non-destructive editing, as its own slide. First in
           this chapter so the term is known before the catalogue page uses it. */
        {
          id: 's-b17n',
          layout: 'stacked',
          title: 'Non-Destructive Editing',
          blocks: [
            { type: 'define', gen: 'w5-nd-def', term: 'Non-destructive editing', kind: 'process',
              short: 'Editing that leaves the original file unchanged.',
              mid: 'Editing in which the changes are stored as instructions or as separate layers, so the original pixels stay as they were and every change can be undone or adjusted later.',
              show: 'mid' },
            { type: 'scen', gen: 'w5-nd-table',
              head: ['Where', 'Non-destructive', 'Destructive'],
              rows: [
                ['Lightroom · Capture One', 'Edits stored as instructions in the catalogue, the session or an XMP file; Export writes a new file', 'Editing the exported JPEG and saving over it'],
                ['Photoshop', 'Adjustment layers, masks, Smart Objects', 'Image → Adjustments on a pixel layer; the Eraser'],
                ['Saving', 'PSD or TIFF with its layers', 'Flattening; saving a JPEG again'],
              ] },
            { type: 'text', gen: 'w5-nd-text', paras: ['A destructive edit rewrites the pixel values, and the earlier values are lost when the file is saved. A non-destructive edit is stored as a description of the change, such as exposure +0.5, and the program applies it to the original each time the image is shown or exported. An XMP file is a small text file, saved beside the raw file, that holds these instructions.'] },
          ],
        },
        {
          id: 's-b13',
          layout: 'stacked',
          title: 'Formats Compared',
          blocks: [
            { type: 'line', gen: 'w5-b13-say', html: 'Formats differ in how they compress, how many tones they hold and whether they keep layers and edits.' },
            { type: 'scen', gen: 'w5-b13-table',
              head: ['Format', 'Compression', 'Bit depth', 'Layers', 'Non-destructive editing', 'Used for'],
              rows: [
                ['Raw<span class="sub">Not an abbreviation</span>', 'None, lossless or lossy (a camera setting)', '12–16', '—', 'Edits stored apart from the file', 'Capture; most makers’ own format'],
                ['DNG<span class="sub">Digital Negative</span>', 'Lossless or lossy', '12–16', '—', 'Can store edits', 'Open raw; Leica, Pentax, ProRAW'],
                ['TIFF<span class="sub">Tagged Image File Format</span>', 'None, LZW, ZIP or JPEG', '8 · 16', 'Yes', 'With layers', 'Master file; print'],
                ['PSD<span class="sub">Photoshop Document</span>', 'Lossless', '8 · 16', 'Yes', 'Adjustment layers, masks, Smart Objects', 'Layered Photoshop work'],
                ['PSB<span class="sub">Large Document Format</span>', 'Lossless', '8 · 16', 'Yes', 'Adjustment layers, masks, Smart Objects', 'Beyond PSD’s 30,000 px or 2 GB'],
                ['JPEG<span class="sub">Joint Photographic Experts Group</span>', 'Lossy', '8', 'No', 'Each save compresses the image again', 'Screen, sharing'],
                ['HEIC<span class="sub">High Efficiency Image Container</span>', 'Lossy', '8 · 10', 'No', 'No', 'Phone capture; limited support'],
                ['PDF<span class="sub">Portable Document Format</span>', 'Set per image', 'As placed', 'Pages', 'No', 'Portfolios, hand-ins, print'],
              ] },
          ],
        },
        {
          id: 's-b13raw',
          /* 30-09, his word: explanation slides for DNG, RAW, TIFF, PSB/PSD, JPEG and BMP, like the PDF page */
          layout: 'stacked',
          align: 'ml',   /* centred in the height, like every page without a filling picture */
          title: 'RAW',
          blocks: [
            /* 01-10: the file's own mark, large (block fileicon) */
            { type: 'fileicon', kinds: ['RAW'], place: { row: 1, col: 1, w: 'hug' } },
            { type: 'label', html: 'CR3 · CR2 · NEF · ARW · RAF · ORF · RW2 · PEF · 3FR · IIQ', place: { row: 1, col: 2, w: 'fill' } },
            { type: 'line', gen: 'w5-raw-say-2', html: "A raw file holds the sensor’s data as the camera recorded it, before it is turned into an image. Most makers have their own format, such as CR3 (Canon), NEF (Nikon), ARW (Sony), RAF (Fujifilm), ORF (OM System) and RW2 (Panasonic).", place: { row: 1, col: 2, w: 'fill' } },
            { type: 'spec', gen: 'w5-raw-use-2', place: { row: 2, col: 1, w: 'full' }, rows: [["Used for", "Capture, whenever the picture will be edited"], ["Fields", "Professional, editorial and art photography; any work that is printed or edited heavily"], ["Advantages", "12 or 14 bits, and 16 on some medium-format cameras; white balance, exposure and colour are set afterwards without loss; the original data stays untouched"], ["Disadvantages", "Needs a raw converter to be seen; larger files than JPEG; each maker’s format needs support in the software; used for editing, while delivery happens in other formats"], ["Features", "Edits are stored apart from the file, in the catalogue or in an XMP sidecar; an embedded JPEG preview"]] },
          ],
        },
        {
          id: 's-b13dng',
          /* 30-09, his word: explanation slides for DNG, RAW, TIFF, PSB/PSD, JPEG and BMP, like the PDF page */
          layout: 'stacked',
          align: 'ml',   /* centred in the height, like every page without a filling picture */
          title: 'DNG',
          blocks: [
            /* 01-10: the file's own mark, large (block fileicon) */
            { type: 'fileicon', kinds: ['DNG'], place: { row: 1, col: 1, w: 'hug' } },
            { type: 'label', html: 'Digital Negative', place: { row: 1, col: 2, w: 'fill' } },
            { type: 'line', gen: 'w5-dng-say-3', html: "DNG is an open raw format, published by Adobe in 2004. It holds the sensor’s data like a maker’s own raw file, in a documented form that any software can read and support. Each maker’s raw format depends on that maker’s software, and support for it may end within the decades a photograph is kept. A raw file converted to lossless DNG keeps its image data and can still be opened and edited in 50 or 60 years, which makes DNG the format for archiving raw files.", place: { row: 1, col: 2, w: 'fill' } },
            { type: 'spec', gen: 'w5-dng-use', place: { row: 2, col: 1, w: 'full' }, rows: [["Used for", "Archiving raw files; capture on cameras that record DNG, such as Leica, Pentax and iPhone ProRAW"], ["Fields", "Archives, studios, long-term collections"], ["Advantages", "Open and documented, so it stays readable; edits and a preview can be stored inside the file; lossless compression makes it smaller than many makers’ raw files"], ["Disadvantages", "Converting a maker’s raw file to DNG can drop maker-specific data; some makers’ own software does not read it"], ["Features", "Lossless or lossy DNG; the original raw file can be embedded inside it"]] },
          ],
        },
        {
          id: 's-b13tif',
          /* 30-09, his word: explanation slides for DNG, RAW, TIFF, PSB/PSD, JPEG and BMP, like the PDF page */
          layout: 'stacked',
          align: 'ml',   /* centred in the height, like every page without a filling picture */
          title: 'TIFF',
          blocks: [
            /* 01-10: the file's own mark, large (block fileicon) */
            { type: 'fileicon', kinds: ['TIFF'], place: { row: 1, col: 1, w: 'hug' } },
            { type: 'label', html: 'Tagged Image File Format', place: { row: 1, col: 2, w: 'fill' } },
            { type: 'line', gen: 'w5-tif-say', html: "A TIFF holds a finished image pixel by pixel, at 8 or 16 bits per channel, with or without layers.", place: { row: 1, col: 2, w: 'fill' } },
            { type: 'spec', gen: 'w5-tif-use', place: { row: 2, col: 1, w: 'full' }, rows: [["Used for", "Master files after editing; scans; files for print"], ["Fields", "Print and publishing, archives, scanning"], ["Advantages", "Lossless when saved without JPEG compression; 16 bits per channel; read by almost every program"], ["Disadvantages", "Large files; unsuited to the web"], ["Features", "Compression None, LZW, ZIP or JPEG; can keep Photoshop layers; carries its colour profile"]] },
          ],
        },
        {
          id: 's-b13psd',
          /* 30-09, his word: explanation slides for DNG, RAW, TIFF, PSB/PSD, JPEG and BMP, like the PDF page */
          layout: 'stacked',
          align: 'ml',   /* centred in the height, like every page without a filling picture */
          title: 'PSD & PSB',
          blocks: [
            /* 01-10: the file's own mark, large (block fileicon) */
            { type: 'fileicon', kinds: ['PSD', 'PSB'], place: { row: 1, col: 1, w: 'hug' } },
            { type: 'label', html: 'Photoshop Document · Large Document Format', place: { row: 1, col: 2, w: 'fill' } },
            { type: 'line', gen: 'w5-psd-say-3', html: "PSD is Adobe Photoshop’s own format. It keeps the work open, with its layers, masks, adjustment layers and Smart Objects. PSB is the same format for files beyond the PSD limits of 2 GB and 30,000 pixels a side.", place: { row: 1, col: 2, w: 'fill' } },
            { type: 'spec', gen: 'w5-psd-use-3', place: { row: 2, col: 1, w: 'full' }, rows: [["Used for", "Layered editing, retouching and compositing in progress"], ["Fields", "Retouching, design, compositing"], ["Advantages", "Non-destructive editing, since layers, masks, adjustment layers and Smart Objects stay editable; 8, 16 or 32 bits per channel"], ["Disadvantages", "Large files; opened in full only by Photoshop, while Affinity Photo, GIMP and Photopea open the layers with some features lost; used for work in progress, with delivery in other formats"], ["Features", "PSD up to 30,000 × 30,000 px and 2 GB; PSB up to 300,000 × 300,000 px"]] },
          ],
        },
        {
          id: 's-b13jpg',
          /* 30-09, his word: explanation slides for DNG, RAW, TIFF, PSB/PSD, JPEG and BMP, like the PDF page */
          layout: 'stacked',
          align: 'ml',   /* centred in the height, like every page without a filling picture */
          title: 'JPEG',
          blocks: [
            /* 01-10: the file's own mark, large (block fileicon) */
            { type: 'fileicon', kinds: ['JPEG'], place: { row: 1, col: 1, w: 'hug' } },
            { type: 'label', html: 'Joint Photographic Experts Group', place: { row: 1, col: 2, w: 'fill' } },
            { type: 'line', gen: 'w5-jpg-say', html: "A JPEG holds a finished image at 8 bits per channel, compressed with loss into a small file.", place: { row: 1, col: 2, w: 'fill' } },
            { type: 'spec', gen: 'w5-jpg-use', place: { row: 2, col: 1, w: 'full' }, rows: [["Used for", "Screens, the web, sharing, quick or amateur prints"], ["Fields", "Every field that shows or sends photographs"], ["Advantages", "Small files; opened by every device and program"], ["Disadvantages", "Lossy, so detail is discarded when an edited file is saved again; 8 bits per channel, so strong edits show banding; no layers"], ["Features", "A quality setting decides the size and the loss; carries its colour profile, usually sRGB"]] },
          ],
        },
        {
          id: 's-b13png',
          /* Round 30-09 23:48, his word: "swap this with PNG, nobody needs BMP" */
          layout: 'stacked',
          align: 'ml',   /* centred in the height, like every page without a filling picture */
          title: 'PNG',
          blocks: [
            /* 01-10: the file's own mark, large (block fileicon) */
            { type: 'fileicon', kinds: ['PNG'], place: { row: 1, col: 1, w: 'hug' } },
            { type: 'label', html: 'Portable Network Graphics', place: { row: 1, col: 2, w: 'fill' } },
            { type: 'line', gen: 'w5-png-say', html: "PNG stores an image with lossless compression, at 8 or 16 bits per channel, and can keep an alpha channel, a transparent background.", place: { row: 1, col: 2, w: 'fill' } },
            { type: 'spec', gen: 'w5-png-use', place: { row: 2, col: 1, w: 'full' }, rows: [["Used for", "Screenshots, graphics and logos; images with transparent areas; web images that must not lose detail"], ["Fields", "Web and interface design, graphic design, documentation"], ["Advantages", "No loss; transparency; 16 bits per channel possible; opened by every browser and program"], ["Disadvantages", "Much larger than JPEG for photographs; no CMYK, so unsuited to files for press printing"], ["Features", "Lossless compression; an alpha channel for transparency; 8 or 16 bits per channel; carries a colour profile"]] },
          ],
        },
        /* PDF — his request 30-09: "include PDF as a file format ... what is the
           capacity, how the size is affected by, how to reduce size". */
        {
          id: 's-b13p',
          layout: 'stacked',
          align: 'ml',   /* centred in the height, like every page without a filling picture */
          title: 'PDF',
          blocks: [
            /* 01-10: the file's own mark, large (block fileicon) */
            { type: 'fileicon', kinds: ['PDF'], place: { row: 1, col: 1, w: 'hug' } },
            { type: 'label', html: 'Portable Document Format', place: { row: 1, col: 2, w: 'fill' } },
            { type: 'line', gen: 'w5-pdf-say', html: 'A PDF is a container. It holds pages of images, text, vector graphics and fonts, and keeps their layout the same on every screen and printer.', place: { row: 1, col: 2, w: 'fill' } },
            /* His note 30-09: not the maximum size, but what it is used for, in
               which field, its advantages and disadvantages, and the features
               that make people choose it. */
            { type: 'spec', gen: 'w5-pdf-use', place: { row: 2, col: 1, w: 'full' },
              rows: [
                ['Used for', 'Portfolios, hand-ins and applications; print files for printers and publishers; photobooks and zines; contact sheets'],
                ['Fields', 'Publishing and print, graphic design, education, archives'],
                ['Advantages', 'Looks the same on every device; opens without the software that made it; many pages in one file; fonts and colour profiles travel inside it'],
                ['Disadvantages', 'Difficult to edit; image quality depends on the export settings; large when images are uncompressed; used for delivery, while editing happens in the source files'],
                ['Features', 'PDF/X for print (fonts embedded, output colour profile defined); PDF/A for long-term archiving; links; password protection, which PDF/X does not allow'],
              ] },
          ],
        },
        {
          id: 's-b13q',
          layout: 'stacked',
          title: 'PDF: File Size',
          blocks: [
            { type: 'line', gen: 'w5-pdfq-say', html: 'When your PDF is too large to upload, check the sizes of the images first. Most of the size of a photographic PDF comes from them.' },
            { type: 'diagram', gen: 'w5-pdfq-c-dia', form: 'table', data: {"head": "Cause", "cols": ["What makes the PDF large"], "mark": {"row": 0}, "rows": [
              {"name": "Image pixels", "v": ["Images placed at full resolution, larger than the page needs"]},
              {"name": "Image compression", "v": ["Lossless (ZIP) instead of JPEG"]},
              {"name": "Bit depth and colour", "v": ["16-bit or CMYK images"]},
              {"name": "Editing data", "v": ["Photoshop PDF with “Preserve Photoshop Editing Capabilities” on"]},
              {"name": "Fonts", "v": ["Whole fonts embedded instead of the characters used"]}]} },
          ],
        },
        {
          id: 's-b13r',
          layout: 'stacked',
          title: 'Reducing a PDF File Size',
          blocks: [
            { type: 'line', gen: 'w5-pdfr-say', html: 'To make your PDF smaller, give its images fewer pixels, stronger compression and fewer bits.' },
            { type: 'diagram', gen: 'w5-pdf-reduce', form: 'steps', data: {"orient":"v","steps":[
              {"t":"Downsample","line":"Bring images to the ppi the output needs, about 150 ppi for screen and 300 ppi for print."},
              {"t":"Compress","line":"Use JPEG at a high quality setting."},
              {"t":"Convert","line":"Convert images to 8 bit and sRGB for a PDF read on screen."},
              {"t":"Export","line":"InDesign: Smallest File Size or High Quality Print preset. Photoshop: editing capabilities off."}]} },
            { type: 'note', gen: 'w5-pdfr-after', html: 'For a PDF that is already made, use Acrobat’s Reduce File Size or PDF Optimizer. In Preview, File → Export → Quartz Filter → Reduce File Size makes the file much smaller and visibly lowers image quality.' },
            { type: 'note', gen: 'w5-pdfr-eg', html: 'An A4 page at 300 ppi needs 2,480 × 3,508 px. A 6,000 × 9,000 px image placed on it carries about six times the pixels the page can print.' },
            { type: 'todo', html: 'Batu: the upload limit of the school’s hand-in portal, if there is one.' },
          ],
        },
      ],
    },

    /* ================================================== B1 · Files */
    {
      id: 'c-files',
      title: 'Files & Folders',
      part: 'b',
      steps: [
        {
          id: 's-b2',
          layout: 'stacked',
          title: 'Folder Structure',
          blocks: [
            { type: 'line', gen: 'w5-b2-say', html: 'Recommended Simplest Structure: All photographs are kept in one archive folder, divided by year, then by project, then by shoot.' },
            { type: 'bul', gen: 'w5-b2-rules', items: [
              'Use the same structure on every drive.',
              'Store files only inside the folder structure.',
              'Name each folder after what it holds, in a few words.',
            ] },
            { type: 'diagram', gen: 'w5-b2-dia', form: 'tree', data: {"root":{"name":"Photography","children":[{"name":"2025"},{"name":"2026","children":[{"name":"Portraits"},{"name":"TS2 Assignments","children":[{"name":"20261001_Cezanne_Paul"},{"name":"20261008_Still"}]}]},{"name":"2027"}]},"path":["Photography","2026","TS2 Assignments","20261001_Cezanne_Paul"]} },
          ],
        },
        {
          id: 's-b2p',
          /* 30-09, his note on the drawing variants: both A (the tree) and C (the path), on separate pages */
          layout: 'stacked',
          title: 'Folder Path',
          blocks: [
            { type: 'line', gen: 'w5-b2p-say', html: 'The path of a shoot names every folder from the top folder down to the shoot.' },
            { type: 'diagram', gen: 'w5-b2-c-dia', form: 'anat', data: {"parts": [{"t": "Photography", "label": "All photographs"}, {"t": "/", "sep": 1}, {"t": "2026", "label": "Year"}, {"t": "/", "sep": 1}, {"t": "TS2 Assignments", "label": "Project"}, {"t": "/", "sep": 1}, {"t": "20261001_Cezanne_Paul", "label": "Shoot", "key": 1}]} },
          ],
        },
        /* His word 30-09: "I will show mine but I also want to show there are many
           different ways." Researched in notes/RESOURCES.md, section B+. */
        {
          id: 's-b2b',
          layout: 'stacked',
          title: 'Other Ways to Organise',
          blocks: [
            { type: 'line', gen: 'w5-b2b-say', html: 'Different systems suit different uses and different archive structures. <em>There is no one correct folder structure.</em>' },
            { type: 'scen', gen: 'w5-b2b-table',
              head: ['Method', 'Organised by', 'Used by'],
              rows: [
                ['Date<span class="sub">2026 / 2026-09-29</span>', 'Capture date; the subject is kept in keywords', 'Lightroom’s default import; Peter Krogh'],
                ['Project or job<span class="sub">Client / Job / Shoot</span>', 'One job as one unit, to deliver and invoice', 'Commercial studios; Capture One Sessions'],
                ['Subject or story<span class="sub">Photographer / Subject / Place</span>', 'Who, what and where', 'Agencies and archives (Magnum)'],
                ['Metadata<span class="sub">Few folders; keywords, collections</span>', 'Descriptions and search; one image in many groups', 'Lightroom and Capture One catalogues; Apple Photos'],
                ['Roll number<span class="sub">2445 → 2445_01.tif</span>', 'One number on the sleeve, the contact sheet and the scan', 'Film photographers'],
                ['Numbered system<span class="sub">Johnny.Decimal</span>', 'Numbered areas and categories', 'Admin, briefs and references'],
              ] },
          ],
        },
        {
          id: 's-b3',
          layout: 'stacked',
          title: 'Photo File Naming',
          blocks: [
            { type: 'line', gen: 'w5-b3-say', html: 'Start each file name with the date, written year-month-day, so that your files sort in the order you made them with a clear naming convention. A computer sorts names character by character. When you need to look for the photos taken that day or for a specific project, you should be able to search in the Finder and find them in seconds.' },
            { type: 'diagram', gen: 'w5-b3-dia', form: 'anat', data: {"parts":[{"t":"20261001","label":"Date","note":"YYYYMMDD","key":1},{"t":"_","sep":1},{"t":"Vogue_Italia","label":"Subject","note":"PROJECT · SUBJECT · BRAND"},{"t":"_","sep":1},{"t":"BK","label":"Initials","note":"PHOTOGRAPHER"},{"t":"_","sep":1},{"t":"0125","label":"Sequence","note":"FOUR DIGITS"},{"t":".","sep":1},{"t":"tif","label":"Format","note":"EXTENSION"}]} },
            { type: 'line', gen: 'w5-b3-note', html: 'Use underscores between the parts, and leave out spaces, accents, slashes, special characters and full stops before the extension. A shoot on 1 October starts 20261001 and sorts before one on 8 October, 20261008 automatically.' },
          ],
        },
        {
          id: 's-b3b',
          layout: 'stacked',
          title: 'Naming Patterns',
          blocks: [
            { type: 'line', gen: 'w5-b3b-say', html: 'Decide whether your file names start with the date, a number or a job. The first part decides the order your files sort, in your own system.' },
            { type: 'scen', gen: 'w5-b3b-table',
              head: ['Pattern', 'Sorts by', 'Needs'],
              rows: [
                ['Date first<span class="sub">20260929_Cezanne_Paul_BK_0125</span>', 'Time, across years', 'Nothing else'],
                ['Number first<span class="sub">2445_01</span>', 'Roll or story number', 'A log that says what each number is'],
                ['Job first<span class="sub">J2026-041_Rijksmuseum_0001</span>', 'Job, in the order jobs were booked', 'A job list'],
                ['Camera original<span class="sub">IMG_1234 · DSC_1234</span>', 'Frame counter only', 'Renaming on import'],
              ] },
            { type: 'note', gen: 'w5-b3b-note', kind: 'warning', html: 'Your camera counts from 0001 to 9999 and then starts again. Two Canon bodies can both write IMG_1234, and if you copy both cards into one folder, one file can replace the other.' },
          ],
        },
        {
          id: 's-b5',
          /* 30-09: stacked with a gallery, which shows each screenshot whole; the duo frame crops to equal shapes and cut the dialogs */
          layout: 'stacked',
          title: 'Renaming Files',
          blocks: [
            { type: 'line', gen: 'w5-b5-say', html: 'You can batch rename your files at once. These are the examples for Finder and Lightroom.' },
            { type: 'gallery', layout: 'grid', caption: 'Images: publicspace.net (Finder), Julieanne Kost (Lightroom).', images: [
              { src: 'b5-finder-rename.jpg', alt: 'The Finder’s Rename dialog set to Format, Name and Index', cap: 'Finder · Rename · Format' },
              { src: 'b5-lr-rename.jpg', alt: 'Lightroom Classic’s Rename Photos dialog with the File Naming menu open', cap: 'Lightroom Classic · Rename Photos' },
            ] },
            { type: 'text', gen: 'w5-b5-text', paras: ['You can batch rename your files in many applications, such as Adobe Bridge, Capture One and Photo Mechanic. Finder and Lightroom are two common ones that are easy to reach.'] },
          ],
        },
        {
          id: 's-b24',
          /* 01-10, his note: a live demo on his own Downloads folder, organised in class; no screenshots */
          layout: 'stacked',
          title: 'AI Tools for Organisation',
          blocks: [
            { type: 'line', gen: 'w5-b24-say-2', html: 'Live demo: Claude Cowork renames the files of a Downloads folder to the naming convention and sorts them into the folder structure.' },
          ],
        },
      ],
    },

    /* ================================================== B4 · Lightroom */
    {
      id: 'c-lightroom',
      title: 'Lightroom Classic',
      part: 'b',
      steps: [
        {
          id: 's-b18',
          layout: 'stacked',
          title: 'Lightroom Catalogue',
          blocks: [
            { type: 'line', gen: 'w5-b18-say', html: 'The Lightroom catalogue is a database of edits and file locations, with its previews stored beside it. The photographs stay in their folders on the drive.' },
            { type: 'diagram', gen: 'w5-b18-b-dia', form: 'flow', data: {"icons": false, "chipStyle": "text", "stages": [
              {"id": "cat", "name": "Catalogue (.lrcat)", "col": 0, "tags": ["Previews beside it"], "key": true},
              {"id": "ph", "name": "Photographs", "col": 1, "tags": ["Folders on the drive"]}],
              "links": [{"from": "cat", "to": "ph", "label": "Path · breaks if moved in Finder"}]} },
            { type: 'bul', gen: 'w5-b18-b-bul', items: [
              'Files are moved and renamed inside Lightroom.',
              'The catalogue is backed up with the photographs.',
            ] },
            { type: 'text', gen: 'w5-b18-b-text', paras: ['The edits are stored in the catalogue file (.lrcat), so a lost catalogue loses the edits while the photographs survive, unless the edits were also written to XMP files.'] },
            { type: 'figure', src: 'b18-missing.jpg', alt: 'Lightroom Classic folders marked with a question mark and thumbnails with the missing-file badge', caption: 'Lightroom Classic · missing folders and files. Image: Adobe.' },
          ],
        },
        {
          id: 's-b19',
          layout: 'stacked',
          title: 'Import Settings',
          blocks: [
            { type: 'line', gen: 'w5-b19-say', html: 'The Import window decides where the files are copied to, what they are called and in which format they are stored.' },
            { type: 'diagram', gen: 'w5-b19-b-dia', form: 'options', data: {"items": [
              {"name": "Copy as DNG", "role": "Card or drive", "line": "Copies and converts to DNG."},
              {"name": "Copy", "role": "Card or drive", "line": "Copies to a new location; the originals stay."},
              {"name": "Move", "role": "Drive only", "line": "Moves the files; the originals are removed."},
              {"name": "Add", "role": "Drive only", "line": "Leaves the files where they are."}]} },
            { type: 'text', gen: 'w5-b19-b-text', paras: ['Copy and Move place the files in the destination folder chosen in the Import window; Add registers files that are already in place. From a memory card the files remain on the card until it is formatted.'] },
            { type: 'figure', src: 'b19-import.jpg', alt: 'The Lightroom Classic Import window with File Handling, File Renaming and Destination open', caption: 'Lightroom Classic · Import. Image: The Lens Lounge.' },
          ],
        },
        {
          id: 's-b20',
          layout: 'stacked',
          title: 'Export Settings',
          blocks: [
            { type: 'line', gen: 'w5-b20-say', html: 'Export writes a new file from the original and its edits, in the format, colour space and size the destination needs.' },
            { type: 'scen', gen: 'w5-b20-table',
              head: ['Preset', 'Format', 'Colour space', 'Size, pixels'],
              rows: [
                ['Web', 'JPEG', 'sRGB', 'Long edge in pixels'],
                ['Print', 'TIFF, 16 bit', 'Adobe RGB', 'Full size'],
                ['Archive', 'DNG or TIFF', '—', 'Full size'],
              ] },
            { type: 'text', gen: 'w5-b20-text', paras: ['The Export window groups its settings into panels: Export Location, File Naming, File Settings (format, colour space, bit depth, quality), Image Sizing, Output Sharpening and Metadata. A preset saves all of them under one name, so each destination receives the same settings every time.'] },
            { type: 'figure', src: 'b20-export.jpg', alt: 'The Lightroom Classic Export dialog', caption: 'Lightroom Classic · Export. Image: Adobe.' },
          ],
        },
        {
          id: 's-b21',
          layout: 'duo',
          title: 'Contact Sheets',
          blocks: [
            { type: 'line', gen: 'w5-b21-say', html: 'A contact sheet shows a whole shoot on one page. Lightroom and Photoshop each make one.' },
            { type: 'figure', src: 'b21-lr-contact.jpg', alt: 'The Lightroom Classic Print module laying out a contact sheet', caption: 'Lightroom Classic · Print · Contact Sheet / Grid. Image: ExpertPhotography.' },
            { type: 'figure', src: 'b21-ps-contact.jpg', alt: 'The Photoshop Contact Sheet II dialog', caption: 'Photoshop · File → Automate → Contact Sheet II. Image: Adobe Community.' },
            { type: 'text', gen: 'w5-b21-text', paras: ['The name comes from the darkroom, where strips of negatives were laid on photographic paper and printed at their own size. The sheet is used to compare frames, choose selects and find a picture later.'] },
          ],
        },
        {
          id: 's-b22',
          layout: 'stacked',
          title: 'Batch Processing',
          blocks: [
            { type: 'line', gen: 'w5-b22-say', html: 'Batch processing applies one set of settings to many files in a single operation, such as the same edit, name pattern or export size for a whole shoot.' },
            { type: 'diagram', gen: 'w5-b22-b-dia', form: 'table', data: {"head": "Task", "cols": ["Program", "Command"], "rows": [
              {"name": "Same edit on many photos", "v": ["Lightroom Classic", "Develop → Sync Settings"]},
              {"name": "Rename a shoot", "v": ["Lightroom Classic", "Library → Rename Photos"]},
              {"name": "Export many at once", "v": ["Lightroom Classic", "Select all → File → Export"]},
              {"name": "Convert and resize a folder", "v": ["Photoshop", "File → Scripts → Image Processor"]},
              {"name": "Repeat a recorded Action", "v": ["Photoshop", "File → Automate → Batch"]}]} },
            { type: 'text', gen: 'w5-b22-b-text', paras: ['Rename Photos, Export and Image Processor write every file with the same settings, and Batch plays a recorded Action (a saved sequence of Photoshop steps) on every file in a folder. An error in the settings is repeated on every file, so the settings are tested on one photograph before the batch runs.'] },
            { type: 'figure', src: 'b22-image-processor.jpg', alt: 'The Photoshop Image Processor dialog, sections 1 to 4', caption: 'Photoshop · File → Scripts → Image Processor. Image: Helen Bradley, Digital Photography School.' },
          ],
        },
      ],
    },

    /* ================================================== B2 · Storage */
    {
      id: 'c-storage',
      title: 'Storage',
      part: 'b',
      steps: [
        {
          id: 's-b6',
          layout: 'stacked',
          title: 'Storage Pricing',
          blocks: [
            { type: 'line', gen: 'w5-b6-say', html: 'Storage types differ in capacity, speed and cost per terabyte. Hard drives cost the least per terabyte, which is why archives are kept on them; however, they are slow for transferring data, unsuited to working files and vulnerable to impact.' },
            { type: 'diagram', gen: 'w5-b6-c-dia-2', form: 'keys', data: {"items": [{"fig": "€25", "unit": "/TB", "label": "HDD", "line": "Archive and backup copies.", "key": 1}, {"fig": "€60", "unit": "/TB", "label": "NAS", "line": "An archive shared by several computers. The price is for a two-bay box with two drives; mirrored, each usable terabyte costs about €120."},
    {"fig": "€100", "unit": "/TB", "label": "SSD, SATA", "line": "Working drive for current projects."}, {"fig": "€110", "unit": "/TB", "label": "SSD, NVMe", "line": "Editing large files and catalogues."}]} },
            { type: 'text', gen: 'w5-b6-text-2', paras: ['A hard disk drive (HDD) stores data on spinning magnetic platters read by a moving head. A solid-state drive (SSD) stores it in flash memory chips with no moving parts, which makes it faster and less sensitive to knocks. A platter holds more data for its cost than flash memory, so the price per terabyte of a hard drive is the lowest. A NAS (network-attached storage) is a box of hard drives on the network, shared by several computers. Prices are the lowest per terabyte in late September 2026 and change each year. The hard drive price holds for drives of 16 TB and more; a 4–8 TB drive costs about €30–40 per terabyte.'] },
          ],
        },
        {
          id: 's-b8',
          layout: 'stacked',
          title: 'Drives',
          blocks: [
            /* 30-09, his note: no text, a caption under each picture; two rows, hard disks and SSDs,
               so the pictures take the page instead of one small row */
            { type: 'stack', rows: [
              { caption: 'Hard disk drives · Images: amazon.com, coolblue.nl, backmarket.nl', images: [
                { src: 'b8-hdd-35-open.jpg', alt: 'A 3.5-inch hard drive with its cover off, platters and head visible', cap: '3.5″ HDD, opened · platters and head' },
                { src: 'b8-hdd-35-desktop.jpg', alt: 'A desktop external hard drive', cap: '3.5″ HDD · desktop, mains power' },
                { src: 'b8-hdd-25-portable.jpg', alt: 'A rugged portable hard drive', cap: '2.5″ HDD · portable, bus-powered' },
                { src: 'b8-nas.jpg', alt: 'A two-bay network-attached storage box', cap: 'NAS · drives on the network' },
              ] },
              { caption: 'Solid-state drives · Images: ebay.com, elyamamastore.com, via Google Images', images: [
                { src: 'b8-ssd-sata.jpg', alt: 'A 2.5-inch SATA solid-state drive', cap: '2.5″ SATA SSD' },
                { src: 'b8-ssd-nvme.jpg', alt: 'An NVMe M.2 solid-state drive', cap: 'NVMe M.2 SSD' },
                { src: 'b8-ssd-portable.jpg', alt: 'A portable solid-state drive', cap: 'Portable SSD' },
              ] },
            ] },
          ],
        },
        {
          id: 's-b9',
          layout: 'stacked',
          title: 'Cable Types & Transfer Speeds',
          blocks: [
            { type: 'line', gen: 'w5-b9-say', html: 'USB-C is a connector type. Its transfer rate depends on the standard it supports, from 480 Mb/s to 120 Gb/s.' },
            { type: 'gallery', layout: 'grid', caption: 'Images: kabelshop.nl (USB 2.0), 1worldsync.com (USB-C 10Gbps), CalDigit (Thunderbolt 4 and 5).', images: [
              { src: 'b9-usb2.jpg', alt: 'A USB 2.0 cable, USB-A to mini-B', ar: 1.6, cap: 'USB 2.0 · USB-A to mini-B' },
              { src: 'b9-usb10.jpg', alt: 'A USB-C 10Gbps cable', ar: 1.6, cap: 'USB 10Gbps · USB-C' },
              { src: 'b9-tb4.jpg', alt: 'A Thunderbolt 4 cable, its plug marked with a bolt and a 4', ar: 1.6, cap: 'Thunderbolt 4 · USB-C' },
              { src: 'b9-tb5.jpg', alt: 'A Thunderbolt 5 cable, its plug marked with a bolt and a 5', ar: 1.6, cap: 'Thunderbolt 5 · USB-C' },
            ] },
            { type: 'diagram', gen: 'w5-b9-c-dia-3', form: 'keys', data: {"items": [{"fig": "0.48", "unit": "Gb/s", "label": "Maximum Transfer Speed", "line": "USB 2.0 (480 Mb/s). A drive reads and writes about 40 MB/s over it.", "key": 1}, {"fig": "10", "unit": "Gb/s", "label": "Maximum Transfer Speed", "line": "USB 10Gbps (3.2 Gen 2). A portable SSD reads about 1,050 MB/s and writes about 1,000 MB/s."}, {"fig": "40", "unit": "Gb/s", "label": "Maximum Transfer Speed", "line": "USB4 40Gbps and Thunderbolt 4. An SSD reads and writes about 3,000 MB/s."}, {"fig": "80", "unit": "Gb/s", "label": "Maximum Transfer Speed", "line": "Thunderbolt 5; up to 120 Gb/s in one direction for displays. An SSD reads over 6,000 MB/s; a long write slows to about 1,500 MB/s."}]} },
            { type: 'note', gen: 'w5-b9-note-3', html: 'Gb/s is gigabits per second and MB/s is megabytes per second; one byte is eight bits. A copy runs at the speed of its slowest part, which may be the card, card reader, cable, port or drive. A charging cable is often USB 2.0, whose 480 Mb/s (megabits per second) is 60 MB/s; at that rate 100 GB takes about 28 minutes, and at the 40 MB/s a drive reaches in practice about 42 minutes. Read and write speeds after Samsung (T7) and OWC (Express 1M2, Envoy Ultra).' },
          ],
        },
        {
          id: 's-b10',
          layout: 'stacked',
          title: 'Scratch Disks',
          blocks: [
            { type: 'line', gen: 'w5-b10-say-2', html: 'When Photoshop runs out of memory, it writes temporary data to a scratch disk. Unless you change it, that is your startup disk. If your computer’s internal storage does not have enough space, the scratch disk can fill up, and Photoshop slows down or stops editing. Lightroom Classic has no scratch disk, but it needs free space for its catalogue, previews and cache. Your computer’s photo and video editing performance can be affected by the space left on its internal drive.' },
            { type: 'diagram', gen: 'w5-b10-b-dia-2', form: 'table', data: {"head": "Program", "cols": ["Keeps", "Set in"], "mark": {"row": 0}, "rows": [
              {"name": "Photoshop", "v": ["Scratch disk, for temporary data", "Settings → Scratch Disks"]},
              {"name": "Lightroom Classic", "v": ["Camera Raw cache, so photos open faster in Develop", "Preferences → Performance"]}]} },
            { type: 'note', gen: 'w5-b10-b-note', kind: 'warning', html: 'If your startup disk is full, Photoshop stops with “scratch disks are full”. Choose a fast drive with free space.' },
            { type: 'figure', src: 'b10-scratch-full.jpg', alt: 'Photoshop’s message: Could not initialize Photoshop because the scratch disks are full', caption: 'The message Photoshop shows when the scratch disk is full. Image: MacPaw.' },
          ],
        },
        {
          id: 's-b4',
          layout: 'stacked',
          title: 'Archive and Naming Drives',
          blocks: [
            { type: 'line', gen: 'w5-b4-say', html: 'Name each drive by what it is, its number and which copy it holds. Archive 02A stays at home, and Archive 02B holds the same files somewhere else. Archive 02 and Archive 03’s contents are different because their numbers are different, and it’s important to write down on the drive physically which projects are stored inside for quick browsing.' },
            { type: 'diagram', gen: 'w5-b4-dia', form: 'anat', data: {"parts": [{"t": "Archive", "label": "What", "note": "THE DRIVE"}, {"t": " ", "sep": 1}, {"t": "02", "label": "Number", "note": "IN ORDER BOUGHT"}, {"t": "A", "label": "Copy", "note": "A HOME · B AWAY", "key": 1}]} },
            { type: 'figure', src: 'b4-archive-02a-03a.jpg', alt: 'Two desktop hard drives labelled Archive 02A and Archive 03A, each with a handwritten list of the projects on it', caption: 'Archive 02A and Archive 03A, each labelled with the projects on it. Drive image: coolblue.nl; labels added.' },
          ],
        },
        {
          id: 's-b11',
          layout: 'stacked',
          title: 'Backup and Redundancy',
          blocks: [
            { type: 'line', gen: 'w5-b11-say-2', html: 'Ideal scenario for keeping your files safe: Keep three copies of every file, on two kinds of storage, with one copy in another place. This is the <b>3-2-1</b> rule.' },
            { type: 'diagram', gen: 'w5-b11-dia', form: 'keys', data: {"items":[{"fig":"3","label":"Copies","line":"Your original and two backups."},{"fig":"2","label":"Media","line":"For example a hard drive and a cloud service."},{"fig":"1","label":"Off site","line":"One copy away from home, such as Archive 02B.","key":1}]} },
              { type: 'note', gen: 'w5-b11-raid', kind: 'warning', html: 'A mirrored drive (RAID) and a sync folder repeat every change on all copies, including deletions. They protect you against a failed drive. To recover a deleted file you need a separate backup, or the sync service’s file history if it keeps one.' },
          ],
        },
        {
          id: 's-b7',
          /* 30-09, his note: no picture of a card - everybody knows what one looks like */
          layout: 'stacked',
          title: 'SD Card Cycle',
          blocks: [
            { type: 'line', gen: 'w5-b7-say', html: 'A memory card is temporary storage. Its contents are copied to a drive after every shoot.' },
            /* 01-10: seven steps with Back up; drawn across the page, the list ran over the title at 1440 */
            { type: 'diagram', gen: 'w5-b7-steps', form: 'steps', data: {"orient": "h", "steps": [{"t": "Capture", "line": "Take photos with your camera."}, {"t": "Import", "line": "Transfer your RAW images to your computer."}, {"t": "Convert and Rename", "line": "RAW files to DNG."}, {"t": "Check", "line": "Transfer completed without an issue."}, {"t": "Back up", "line": "A second copy on another drive."}, {"t": "Format", "line": "Delete all the files on the SD card."}, {"t": "Capture Again", "line": "Start the shoot with an empty card."}]} },
          ],
        },
      ],
    },

    /* ================================================== C · Tethered Shooting & Capture One
       His structure, 29-09: one page on tethering and its benefits; Capture One
       download (the free trial); what Capture One is and how the industry uses
       it; the live demo; tutorials for later. Plus, 30-09: a page on mobile
       wireless tethering apps. Facts from notes/RESOURCES.md, checked 29-09. */
    {
      id: 'c-tether',
      title: 'Tethered Shooting',
      part: 'c',
      partTitle: 'Tethered Shooting & Capture One',
      head: { kicker: 'Part C · Tethered Shooting & Capture One' },
      steps: [
        {
          id: 's-c1',
          layout: 'split',
          title: 'Tethered Shooting',
          blocks: [
            { type: 'line', gen: 'w5-c1-say', html: 'In tethered shooting the camera sends each photograph to a computer as it is taken, over a cable or a wireless connection.' },
            { type: 'bul', gen: 'w5-c1-plus', items: [
              'Each frame appears large on screen within seconds.',
              'Focus and light are checked at 100 %.',
              'Files are named and saved on the computer as they arrive.',
              'Adjustments can be applied to the next frames automatically.',
            ] },
            { type: 'text', gen: 'w5-c1-text', paras: ['Over the connection the software receives each file and also sends commands to the camera, so shutter speed, aperture, ISO and the release can be set from the computer. The files are written to the computer’s drive. With no card in the camera, the computer holds the only copy until it is backed up.'] },
            { type: 'note', gen: 'w5-c1-minus', html: 'The cable limits movement and can be pulled out. The camera battery drains faster, and the session depends on the computer. Use dedicated tethering cables for better performance.' },
            { type: 'figure', src: 'c1-tethered-set.jpg', alt: 'A tethered set: camera on a tripod, cable, laptop on a stand', caption: 'A tethered set. Image: Tether Tools.' },
          ],
        },
        {
          id: 's-c2',
          layout: 'split',
          title: 'Capture One',
          blocks: [
            { type: 'line', gen: 'w5-c2-say', html: 'Capture One is raw-processing and tethering software, used for tethered work in commercial studios.' },
            { type: 'bul', gen: 'w5-c2-bul', items: [
              'On set, the photographer, the digital technician, the client and the retoucher work from the same screen.',
              'A session is one folder per shoot, with Capture, Selects, Output and Trash folders inside it.',
              'It tethers cameras from Canon, Nikon, Sony, Fujifilm, Leica and Phase One.',
            ] },
            { type: 'text', gen: 'w5-c2-text', paras: ['Raw processing turns the sensor data into an image. Capture One was first developed by Phase One, a Danish maker of medium-format digital backs.'] },
            { type: 'todo', html: 'Batu: your own words on how Capture One is used in the industry.' },
            { type: 'figure', src: 'c2-capture-one.jpg', alt: 'Capture One tethered to a camera, with the Camera tool and the last capture', caption: 'Capture One · tethered capture. Image: Capture One.' },
          ],
        },
        {
          id: 's-c3',
          /* 01-10, his round: "Click for download Capture One and the link underneath would be better. Also use an online image of Capture One's website" */
          layout: 'stacked',
          title: 'Download Capture One',
          align: 'ml',
          blocks: [
            { type: 'link', href: 'https://www.captureone.com/en/try-for-free?intent=trial-pro', kicker: 'Capture One Pro · 7-day free trial', text: 'Click to download Capture One', note: 'captureone.com/en/try-for-free', away: true, place: { row: 1, col: 1, w: 'full' } },
            { type: 'note', gen: 'w5-c3-warn', kind: 'warning', html: 'The trial lasts 7 days, asks for payment details and continues as a paid subscription unless you cancel it. Start it on the day you will use it and cancel it afterwards.', place: { row: 2, col: 1, w: '1/2' } },
            { type: 'figure', src: 'c3-captureone-site.jpg', alt: 'The Capture One free-trial page', caption: 'captureone.com, the free-trial page.', place: { row: 2, col: 2, w: '1/2' } },
          ],
        },
        {
          id: 's-c4',
          layout: 'stacked',
          title: 'Demo: Tethered Shooting',
          blocks: [
            /* 01-10, his note: "make a logical order yourself" - the session first, then the camera, then the shoot */
            { type: 'bul', gen: 'w5-c4-check-2', marker: 'check', two: true, items: [
              { check: '1 · Capture One: File → New Session, named with the date first' },
              { check: '2 · Check the Capture, Selects, Output and Trash folders' },
              { check: '3 · Connect the cable to a data port on the computer' },
              { check: '4 · Camera on, set to raw, Release without card switched on' },
              { check: '5 · Confirm the camera appears in the Camera tool' },
              { check: '6 · Set capture naming' },
              { check: '7 · Open Live View' },
              { check: '8 · Take a test frame and check it at 100 %' },
              { check: '9 · Adjust, then set Next Capture Adjustments' },
              { check: '10 · Rate the frames and move the selects' },
              { check: '11 · Export to the Output folder' },
            ] },
          ],
        },
        {
          id: 's-c5',
          layout: 'stacked',
          title: 'Tutorials',
          blocks: [
            { type: 'video', url: 'https://www.youtube.com/watch?v=I1ThgivAoB8', title: 'How to Use Tethered Capture in Capture One | Getting Started', caption: 'Capture One, 3:44.' },
          ],
        },
        {
          id: 's-c3b',
          layout: 'stacked',
          title: 'Mobile Wireless Tethering',
          blocks: [
            { type: 'line', gen: 'w5-c3b-say', html: 'Your camera maker publishes a free app that connects a phone or tablet to the camera over Wi-Fi or Bluetooth, for remote control, live view and image transfer.' },
            { type: 'diagram', gen: 'w5-c3b-b-dia', form: 'table', data: {"head": "Maker", "cols": ["App", "Note"], "rows": [
              {"name": "Canon", "v": ["Camera Connect", "Remote Live View Shooting"]},
              {"name": "Nikon", "v": ["SnapBridge", "NX MobileAir for FTP upload from pro bodies"]},
              {"name": "Sony", "v": ["Creators’ App", "Replaced Imaging Edge Mobile in 2023"]},
              {"name": "Fujifilm", "v": ["XApp", "Older bodies: Camera Remote"]},
              {"name": "Panasonic", "v": ["LUMIX Lab", "Older bodies: LUMIX Sync"]},
              {"name": "OM System", "v": ["OM Image Share (OI.Share)", "Live View and Remote Shutter modes"]},
              {"name": "Capture One mobile", "v": ["Capture One", "iPhone, iPad; wired, or wireless with Canon, Nikon, Sony, Fujifilm"]}]} },
            { type: 'note', gen: 'w5-c3b-note', html: 'Support differs by camera model. Check the maker’s list for your camera before the shoot.' },
          ],
        },
      ],
    },

    /* ================================================== D · Assignment #3 */
    {
      id: 'c-a3',
      title: 'Assignment #3',
      part: 'd',
      partTitle: 'Assignment #3',
      head: { kicker: 'Assignment #3 · Anti-Self Portrait' },
      steps: [
        {
          id: 's-d1',
          /* 01-10, his round: "Assignment Briefteki fotoğrafı koy ve brief linkini buraya birleştir." */
          layout: 'stacked',
          align: 'ml',
          title: 'Assignment #3: Anti-Self Portrait',
          blocks: [
            { type: 'figure', src: '../assignments/03-anti-self-portrait/assets/brief-anti-self-portrait.jpg', alt: 'A figure in a tailcoat and sash, a raised hand giving the finger where the head should be', caption: 'Unknown artist.', place: { row: 1, col: 1, w: '1/2', fillH: true, rgrow: true } },
            { type: 'link', href: '../assignments/03-anti-self-portrait/', kicker: 'Assignment #3 · Anti-Self Portrait', text: 'Read the full brief', note: 'Given week 5 · due week 7', away: false, place: { row: 1, col: 2, w: '1/2' } },
          ],
        },
      ],
    },
  ],
};

/* 01-10-2026 02:20: the week as applied after his rounds of 23:48, 01:54 and 02:10. */
