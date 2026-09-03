/* ============================================================
   Week #1 · Introduction — content source
   ------------------------------------------------------------
   Ported from the original hand-written lecture page
   (`uploads/index.html`, draft v2.5) into the Week #0 format.
   Structure, wording, images and running order are unchanged.

   Every layout choice is explicit, so it can be argued with:
   see the `layout:` values on steps and on image blocks.
   The written spec is lectures/CONTRACT.md.
   ============================================================ */

window.TS2_WEEK = {
  course: 'Technical Skills II',
  institution: 'KABK · BA Photography',
  year: '2026–27',
  number: '1',
  title: 'Introduction',
  standfirst: 'Who is teaching, what the course is, and what you are assessed on.',
  revision: 'v3.0',
  next: { label: 'Composition & Format', href: '../week-02/index.html' },

  chapters: [
    /* ================================================== 0 · Schedule */
    {
      id: 'c-today',
      title: 'Schedule',
      n: '',
      head: { standfirst: 'Week #1 · Introduction' },
      steps: [
        {
          id: 's-0',
          cls: 'title',
          title: 'Schedule',
          blocks: [
            {
              type: 'schedule',
              plan: [
                'Introduction',
                'Break*',
                'Assessment Criteria',
                'Quiz',
                'Exercise: Class Portrait',
                'Questionnaire',
                'End',
              ],
              classes: [
                { name: 'PHft2A', group: 'Full time', when: 'Thursday 03.09 · morning',
                  times: ['09:30', '10:30', '10:40', '11:10', '11:20', '12:15', '12:30'] },
                { name: 'PHft2B', group: 'Full time', when: 'Thursday 03.09 · afternoon',
                  times: ['13:30', '14:30', '14:40', '15:10', '15:20', '16:15', '16:30'] },
                { name: 'PHptc2', group: 'Part time', when: 'Monday 07.09 · afternoon',
                  times: ['13:30', '14:30', '14:40', '15:10', '15:20', '16:15', '16:30'] },
              ],
            },
          ],
        },
      ],
    },

    /* ================================================== A1 · Introduction */
    {
      id: 'c-who',
      title: 'Introduction',
      n: 'A1',
      part: 'a',
      partTitle: 'The course',
      head: { kicker: 'Part A · The course', standfirst: 'Batuhan Keskiner (he/him) — photographer, filmmaker, tutor.' },
      steps: [
        {
          id: 's-1a',
          layout: 'list',
          title: 'Hello!',
          blocks: [
            { type: 'lineBig', html: 'I\u2019m Batuhan Keskiner <span class="dim">(he/him)</span>' },
            { type: 'line', html: 'Photographer<br>Filmmaker<br>Tutor<br><span class="dim">Maker</span><br><span class="dim">Creative Technologist</span>' },
          ],
        },
        {
          id: 's-1b',
          title: 'The work',
          blocks: [
            { type: 'stack', rows: [
              { title: 'Commercial', caption: 'Commercial — Carlsberg · Piyalepaşa · Uludağ · Hilton', images: [
                { src: 'keskiner-02-carlsberg.jpg', alt: 'Carlsberg: bottle and glass on green' },
                { src: 'keskiner-08-piyalepasa.jpg', alt: 'Piyalepaşa: a forklift, a couple, an orange balloon on a construction site' },
                { src: 'keskiner-09-uludag.jpg', alt: 'Uludağ: a man with a bottle in a desert landscape' },
                { src: 'keskiner-10-hilton.jpg', alt: 'Hilton: a roof terrace at dusk' },
              ] },
              { title: 'Mimar Sinan, Photography BA', caption: 'Mimar Sinan Fine Arts University, BA — City Sculptures · Wonderland', images: [
                { src: 'keskiner-06-misir.jpg', alt: 'Mısır: a corn sculpture in a fountain' },
                { src: 'keskiner-04-halkjelsgata.jpg', alt: 'Halkjelsgata, Norway: a shop front at night' },
                { src: 'keskiner-05-madonna.jpg', alt: 'Madonna: a gilded figure on a lift inside a cathedral' },
              ] },
              { title: 'KABK, Photography &amp; Society MA', caption: 'KABK, Photography &amp; Society MA — Toros · My Turkey My Turkey My Heaven · The Others', images: [
                { src: 'keskiner-03-toros.jpg', alt: 'A white Toros on red' },
                { src: 'keskiner-07-my-turkey-poster.jpg', alt: 'Poster: My Turkey My Turkey My Heaven' },
                { src: 'keskiner-01-the-others.jpg', alt: 'Installation of the video work The Others' },
              ] },
            ] },
          ],
        },
      ],
    },

    /* ================================================== A2 · Technical Skills */
    {
      id: 'c-what',
      title: 'Technical Skills',
      n: 'A2',
      part: 'a',
      partTitle: 'The course',
      head: { kicker: 'Part A · The course', standfirst: 'What it is, what it is not.' },
      steps: [
        {
          id: 's-2a',
          layout: 'argument',
          title: 'Technical Skills',
          layout: 'question',
          blocks: [
            { type: 'lineBig', html: 'What is it? What is it <em class="term">not</em>?' },
          ],
        },
        {
          id: 's-2b',
          /* One sentence, alone, in the middle of the page. `plate` centres what
             it holds both ways, which is what the request asked for, and it does
             it as a rule of the format rather than as a placement typed onto
             this one page. */
          layout: 'plate',
          centred: true,
          title: 'Technique is the vocabulary',
          blocks: [
            { type: 'quote', sz: 1.15, html: 'typewriter → words → story' },
                      ],
        },
        {
          id: 's-2c',
          title: 'Den Haag → Paris',
          blocks: [
            { type: 'scen', reveal: true, font: 'mono', sz: 0.8, head: ['Scenario', 'Vehicle'], rows: [
              ['The quickest way, but with a low-budget', 'Overnight bus'],
              ['The quickest way, with no budget limit', 'Helicopter'],
              ['The least environment-friendly way', 'Private jet'],
              /* the two ends of the same axis, read in the order the room meets
                 them: the cheapest is not the greenest, and putting them side by
                 side is the point of the pair */
              ['The most environment-friendly way', 'Bicycle'],
              ['The cheapest way', 'Hitchhiking'],
              ['The most common way', 'Train'],
              ['The fastest way', 'Fighter jet'],
              ['An unconventional way', 'Unicycle'],
              ['in 19th century', 'Steam train'],
              ['in 14th century', 'Horse'],
              ['An impossible way', 'Teleport'],
            ] },
            { type: 'verdict',
              /* Proofread, as asked. Three things: the casing was half-shouted
                 ("yOUR posıtıon, optıons AND CONDITIONS"); the dotless Turkish ı
                 had come through in position and options; and three subjects
                 take a plural verb - position, options and conditions DECIDE.
                 The sentence is otherwise Batu's, including the shift from
                 "the scenario" to the three things it is made of. */
              gen: { what: 'the proofread of this sentence' },
              html: 'The technique is the vehicle. Your position, options and conditions decide which vessel makes sense.' },
          ],
        },
      ],
    },

    /* ================================================== A3 · The Course */
    {
      id: 'c-course',
      title: 'The Course',
      n: 'A3',
      part: 'a',
      partTitle: 'The course',
      head: { kicker: 'Part A · The course', standfirst: 'Five modules, one semester at a time.' },
      steps: [
        {
          id: 's-4a',
          title: 'Five modules',
          blocks: [
            /* `mono` set the NAMES in the monospace face, which is the
                 opposite of what the page wants: the name is the one thing on
                 it that is a title. The layout owns the type now - see the
                 five-modules block in lecture.css - so the flag comes off. */
            { type: 'five', items: [
              { n: '01', name: 'Format', when: 'Week #2', desc: 'the frame: ratio, size, resolution' },
              { n: '02', name: 'Camera', when: 'Week #3–4', desc: 'exposure, lenses, workflow' },
              { n: '03', name: 'Light', when: 'Week #5–6, 8', desc: 'quality, direction, power' },
              { n: '04', name: 'Colour', when: 'Week #9–11', desc: 'theory, management, grading' },
              { n: '05', name: 'Production', when: 'Week #12', desc: 'planning and executing a shoot' },
            ] },
          ],
        },
        {
          id: 's-4b',
          title: 'First semester',
          blocks: [
            { type: 'sem', head: ['Wk', 'Date', 'Subject', 'Assignment'], rows: [
              { cells: ['W1', '03.09', 'Introduction', '#0 Survey'], cls: 'on' },
              ['W2', '10.09', 'Format', '#1 Photogram'],
              ['W3', '17.09', 'Camera I', '#2 Pinhole'],
              ['W4', '24.09', 'Camera II', '#3 Anti-Self Portrait'],
              ['W5', '01.10', 'Light I', '#4 reMAKE'],
              ['W6', '08.10', 'Light II', ''],
              ['W7', '15.10', 'MTR · Individual feedback', 'Group #1: Copycat'],
              { cells: ['—', '19–25.10', 'Fall week', ''], cls: 'brk' },
              ['W8', '29.10', 'Workshop: Flash', '#5 Flash'],
              ['W9', '05.11', 'Colour I', ''],
              ['W10', '12.11', 'Colour II', '#6 Colour Accurate Reproduction'],
              ['W11', '19.11', 'Colour III', "#7 Sweet Child O' Mine"],
              ['W12', '26.11', 'Workshop: Exactitudes', 'Group: Exactitudes'],
            ] },
          ],
        },
        {
          id: 's-4c',
          title: 'Building blocks',
          blocks: [
            { type: 'bul', marker: 'number', sz: 1.95, items: [
              'Presentation', 'Demonstration', 'Exercise',
              'Assignment', 'Workshop', 'Individual Feedback',
            ] },
          ],
        },
        {
          id: 's-4d',
          layout: 'argument',
          title: 'Workbook',
          blocks: [
            { type: 'lineBig', html: 'The document where you keep track of your process.' },
            { type: 'bul', two: true, marker: 'dot', font: 'ui', sz: 1.15, items: [
              '<b>Assignments</b>', 'Visual Research',
              '<b>Personal Notes &amp; Reflections</b>', 'Moodboards',
              '<b>Contact Sheets</b>', 'Planning',
              'Light Diagrams', 'Screenshots of PS, LR',
              'Backstage Images',
            ] },
            { type: 'note', kind: 'tip', html: '<b>Start from the beginning of the semester and update it on a regular basis.</b> It is how you prepare for the collective assessment. Your workbook can be digital or physical. If yours is physical you need to scan it before the Mid-Term and Collective Assessment submissions.' },
          ],
        },
      ],
    },

    /* ================================================== A4 · Learning Goals */
    {
      id: 'c-goals',
      title: 'Learning Goals',
      n: 'A4',
      part: 'a',
      partTitle: 'The course',
      head: { kicker: 'Part A · The course', standfirst: 'Four things you will improve.' },
      steps: [
        {
          id: 's-6a',
          layout: 'list',
          title: 'Four things you will improve',
          blocks: [
            { type: 'bulBig', items: [
              { label: 'Improving Visual Literacy', goto: 's-6b' },
              { label: 'Expanding the Photographic Toolkit', goto: 's-6c' },
              { label: 'Developing a Unique Visual Language', goto: 's-6d' },
              { label: 'Planning and Executing Photography Projects', goto: 's-6e' },
            ] },
          ],
        },
        {
          id: 's-6b',
          layout: 'plate',
          title: 'Visual Literacy',
          blocks: [

            { type: 'bul', items: [
              'Analyse an image from a technical photographic perspective — format, lighting, focal length, technique.',
              'Read how composition, light, exposure and gear decisions contributes to the visual grammar.',
              'Recognise a photographer&rsquo;s work and position it in a wider visual historical context.',
            ] },
            { type: 'figure', src: 'edgerton-01.jpg', alt: 'A bullet passing through an apple', caption: 'Harold Edgerton, <i>Bullet through Apple</i>, 1964' },
          ],
        },
        {
          id: 's-6c',
          layout: 'plate',
          title: 'Photographic Toolkit',
          blocks: [

            { type: 'bul', items: [
              'Broaden the technical and creative abilities — camera settings, lighting, post-processing.',
              'Experiment with and acquire new techniques.',
              'Replicate an artistic reference in style, lighting, colour and tone.',
            ] },
            { type: 'figure', src: 'soth-01.jpg', alt: 'A man in overalls holding two model aeroplanes', caption: 'Alec Soth, <i>Charles, Vasa, Minnesota</i>, 2002' },
          ],
        },
        {
          id: 's-6d',
          layout: 'plate',
          title: 'Visual Language',
          blocks: [

            { type: 'bul', items: [
              'Apply techniques, styles and compositions aligned with the subject matter.',
              'Build a distinctive photographic voice.',
              'Express ideas and perspectives in a way that is authentically yours.',
            ] },
            { type: 'figure', src: 'dijkstra-01.jpg', alt: 'A girl in a green swimsuit on a beach', caption: 'Rineke Dijkstra, <i>Kolobrzeg, Poland, July 26, 1992</i>' },
          ],
        },
        {
          id: 's-6e',
          layout: 'plate',
          title: 'Planning and Execution',
          blocks: [

            { type: 'bul', items: [
              'Plan a shoot in detail — references, ideation, concept, logistics.',
              'Scout locations, choose equipment, communicate with a team.',
              'Solve problems on the day to reach the creative and technical goal.',
            ] },
            { type: 'figure', src: 'olaf-01.jpg', alt: 'A woman in a yellow dress and a man in a coat in a hotel corridor', caption: 'Erwin Olaf, <i>Hope — The Hallway</i>, 2005' },
          ],
        },
      ],
    },

    /* ================================================== B1 · Assessment Criteria */
    {
      id: 'c-comp',
      title: 'Assessment Criteria',
      n: 'B1',
      part: 'b',
      partTitle: 'What is assessed',
      head: { kicker: 'Part B · What is assessed', standfirst: 'The five domains you are assessed on.' },
      steps: [
        {
          id: 's-5doc',
          layout: 'docfull',
          title: 'Assessment Criteria',
          blocks: [
            { type: 'doc', src: 'b-assessment-criteria.png', alt: 'Assessment criteria table, BA Photography, KABK', mark: 'year2', caption: 'Assessment criteria · BA Photography · KABK — second year highlighted' },
          ],
        },
        {
          id: 's-5a',
          layout: 'criteria',
          title: 'To research',
          blocks: [
            { type: 'card', cc: 'var(--domain-research)', html: 'You are able to research topics and visual strategies in a methodical and organized way. You understand why producing work is part of doing research and leads to a better understanding of your role as a photographer.' },
            { type: 'bul', colBreak: true, items: [
              'Finding relevant visual resources &amp; references to expand your artistic family.',
              'Making visual diaries, moodboards, workbooks',
              'Collecting, documenting and organising references.',
              'Learning how to find sources of information via other online platforms like Google, YouTube, Reddit and learning platforms.',
            ] },
          ],
        },
        {
          id: 's-5b',
          layout: 'criteria',
          title: 'To create',
          blocks: [
            { type: 'card', cc: 'var(--domain-create)', html: 'You show an urge and desire to experiment and produce visual works in all stages of the process. By raising your photographic skills to a professional standard, you prove to be able to articulate yourself more precisely.' },
            { type: 'bul', colBreak: true, items: [
              'Trusting the process',
              'Embracing the errors and failures',
              'Learning by doing it — learning from mistakes',
              'Being open to experiment',
              'Shooting, showing, bringing <em class="term">enough</em> images',
            ] },
          ],
        },
        {
          id: 's-5c',
          layout: 'criteria',
          title: 'To reflect and position',
          blocks: [
            { type: 'card', cc: 'var(--domain-reflect)', html: 'You can evaluate your own work and the work of others based on content, visual strategy and communicative qualities. You show an open attitude and are able to process external feedback to deepen your projects.' },
            { type: 'bul', colBreak: true, items: [
              'Analysing images',
              'Recognition of techniques',
              'Making technical and creative decisions',
              'Developing your own style',
              'Understanding your artistic family',
              'Peer learning — giving and receiving feedback',
            ] },
          ],
        },
        {
          id: 's-5d',
          layout: 'criteria',
          title: 'To present',
          blocks: [
            { type: 'card', cc: 'var(--domain-present)', html: 'You are able to visualize your process in convincing presentations. There is a connection between the presentation of visual work and the identity of the maker.' },
            { type: 'bul', colBreak: true, items: [
              'Documenting your process — the workbook',
              'Keeping track of your progress',
              'Involving peers and teachers in your thought and creative process',
            ] },
          ],
        },
        {
          id: 's-5e',
          layout: 'criteria',
          title: 'To professionalize',
          blocks: [
            { type: 'card', cc: 'var(--domain-professionalize)', html: 'You are able to prioritise and time-effectively manage your work process. You learn to take control of setbacks and turn them into challenges. You understand your role in collaborations and how to benefit from it.' },
            { type: 'bul', colBreak: true, items: [
              'Showing up on time',
              'Attending and participating in the class',
              'Sticking to deadlines · fulfilling the requirements',
              'Being a reliable group member, classmate, teammate, peer',
              'Clear communication · consistent workflow',
              'Planning the shoots ahead — being prepared for the potential issues',
            ] },
          ],
        },
        {
          id: 's-5f',
          layout: 'docfull',
          title: 'Mid Term Review',
          blocks: [
            { type: 'doc', src: 'b-mtr-chart.png', alt: 'Mid-term review chart', caption: 'Mid-term review chart · BA Photography · KABK' },
          ],
        },
      ],
    },

    /* ================================================== B2 · The Test */
    {
      id: 'c-test',
      title: 'The Test',
      n: 'B2',
      part: 'b',
      partTitle: 'What is assessed',
      head: { kicker: 'Part B · What is assessed', standfirst: 'Short. On your phone.' },
      steps: [
        {
          id: 's-t1',
          layout: 'poster',
          title: 'Scan the QR',
          blocks: [
            { type: 'qr', src: 'menti-qr.png', alt: 'Mentimeter QR code for the quiz' },
            { type: 'biglink', big: true, before: 'or type', href: 'https://menti.com', label: 'menti.com · code 7525 6830' },
          ],
        },
      ],
    },

    /* ================================================== B3 · Questionnaire */
    {
      id: 'c-ass',
      title: 'Questionnaire',
      n: 'B3',
      part: 'b',
      partTitle: 'What is assessed',
      head: { kicker: 'Part B · What is assessed', standfirst: 'Assignment #0.' },
      steps: [
        {
          id: 's-7a',
          layout: 'argument',
          centred: true,
          title: 'Questions',
          blocks: [
            { type: 'bulBig', items: [
              'Who are you?',
              'What excites you about photography?',
              'What subjects are you interested in?',
              'What challenges did you have in the first year?',
              'What do you want to learn in this course?',
            ] },
          ],
        },
        {
          id: 's-7b',
          layout: 'question',
          title: 'Questionnaire',
          blocks: [
            { type: 'biglink', big: true, href: 'https://forms.gle/kkMdD2VUDdXXgr1RA', label: 'forms.gle/kkMdD2VUDdXXgr1RA' },
            { type: 'line', html: 'Deadline: <em class="term">Thursday 10 September</em>, before class time.' },
          ],
        },
      ],
    },

    /* ================================================== B4 · Next Week
       Every week ends on this chapter: what to bring, and what it is for. */
    {
      id: 'c-next',
      title: 'Next Week',
      n: 'B4',
      part: 'b',
      partTitle: 'What is assessed',
      head: { kicker: 'Part B · Next week', standfirst: 'What to bring on 10 September.' },
      steps: [
        {
          id: 's-7c',
          layout: 'question',
          title: 'Composition &amp; Format',
          blocks: [
            { type: 'line', html: 'Submit the questionnaire before class, and bring these for the exercise next week:' },
            { type: 'bul', marker: 'dot', items: [
              '5 photographs by other photographers',
              '5 paintings you like',
              '5 photographs of your own with a good composition',
              '15 total printed in black and white on plain A4 — cheap prints',
              'Marker, Scissors',
            ] },
          ],
        },
      ],
    },
  ],
};
