/* ============================================================
   Week #6 · Camera III — content source

   Made 07-10-2026 at his word: week 5 was not finished in the
   lecture, so its pages from 45 on (Lightroom Classic, Storage,
   Tethered Shooting & Capture One) moved here unchanged. The
   generated ids keep their w5- names so his ticks travel with
   them. Assignment #3 stays in week 5. Week 6 is to be widened
   next.
   ============================================================ */

window.TS2_WEEK = {
  course: 'Technical Skills II',
  institution: 'KABK · BA Photography',
  year: '2026–27',
  number: '6',
  title: 'Camera III',
  standfirst: '',
  revision: 'draft v0.1',
  next: { label: 'Mid-Term Review', href: '#' },

  chapters: [
    /* ================================================== 0 · Schedule — his request, round 08-10 00:15: "Şu sayfadan
       önceki sayfaya Schedule'u ekle." Times drafted from the week's parts and page counts; orange until he ticks. */
    {
      id: 'c-today',
      title: 'Schedule',
      n: '',
      head: { standfirst: 'Week #6 · Camera III' },
      steps: [
        {
          id: 's-0',
          cls: 'title',
          layout: 'stacked',
          title: 'Schedule',
          blocks: [
            {
              type: 'schedule', gen: 'w6c-schedule',
              plan: [
                'Digital Workflow',
                'RAW Editing',
                'Break',
                'Negative Lab Pro',
                'Tethered Shooting',
                'Demo: Capture One',
                'End',
              ],
              classes: [
                { name: 'PHft2A', group: 'Full time', when: 'Thursday 08.10 · morning',
                  times: ['09:30', '10:05', '11:00', '11:15', '11:45', '12:00', '12:30'] },
                { name: 'PHft2B', group: 'Full time', when: 'Thursday 08.10 · afternoon',
                  times: ['13:30', '14:05', '15:00', '15:15', '15:45', '16:00', '16:30'] },
                { name: 'PHptc2', group: 'Part time', when: 'Monday 26.10 · afternoon',
                  times: ['13:30', '14:05', '15:00', '15:15', '15:45', '16:00', '16:30'] },
              ],
            },
          ],
        },
      ],
    },

    /* ================================================== Manuals — his word 07-10-2026: three manuals
       João Henrique Viegas made for the KABK Photography Rental, as downloads at the very start of the
       lecture, each with what it is for written under it and his credit on it. The PDFs are his files
       from _sources/documents, renamed; the first pages are drawn from them. */
    {
      id: 'c-manuals',
      title: 'Manuals',
      steps: [
        {
          id: 's-manuals',
          layout: 'stacked',
          title: 'Manuals',
          blocks: [
            { type: 'pdf', variant: 'b', name: '35mm Scanner Manual', file: 'assets/manual-35mm-scanner.pdf', preview: 'manual-35mm-scanner-p1.jpg', alt: 'First page: the 35 mm scanner, its socket, screen, light source and button', pages: '3', size: '240 KB', caption: 'Author: João Henrique Viegas · KABK Photography Rental.', place: { row: 1, col: 1, w: '1/3' } },
            { type: 'pdf', variant: 'b', name: 'Camera Scanning Manual', file: 'assets/manual-camera-scanning.pdf', preview: 'manual-camera-scanning-p1.jpg', alt: 'First page: the camera on its copy stand, the light source remote and the film holder', pages: '8', size: '1.9 MB', caption: 'Author: João Henrique Viegas · KABK Photography Rental.', place: { row: 1, col: 2, w: '1/3' } },
            { type: 'pdf', variant: 'b', name: 'B&W Film Development', file: 'assets/manual-bw-film-development.pdf', preview: 'manual-bw-film-development-p1.jpg', alt: 'First page: the parts of a film developing tank, lid, light trap, post, reel and tank', pages: '5', size: '1 MB', caption: 'Author: João Henrique Viegas · KABK Photography Rental.', place: { row: 1, col: 3, w: '1/3' } },
            { type: 'text', gen: 'w6-man-35', paras: ['The steps for scanning 35 mm film on the rental scanner. It covers switching the scanner on, starting a tethered session in Lightroom Classic, sampling the film border for white balance, converting the negatives with Negative Lab Pro and exporting TIFF or JPEG files.'], place: { row: 2, col: 1, w: '1/3' } },
            { type: 'text', gen: 'w6-man-cam', paras: ['The steps for scanning 35 mm and medium-format film with a camera on a copy stand. It covers the film holder and mask, aligning the camera with the mirror, and setting height, focus and aperture, followed by conversion and export in Lightroom Classic.'], place: { row: 2, col: 2, w: '1/3' } },
            { type: 'text', gen: 'w6-man-bw', paras: ['The steps for developing black-and-white film by hand. It covers the parts of the tank, loading 35 mm and 120 film onto the reel in the dark, diluting developer, stop bath and fixer at 20 °C, and the time and agitation for each bath.'], place: { row: 2, col: 3, w: '1/3' } },
          ],
        },
      ],
    },

    /* ================================================== A · Storage — first since 07-10: where the files live comes before the catalogue that points at them */
    {
      id: 'c-storage',
      title: 'Storage',
      part: 'a',
      partTitle: 'Digital Workflow',
      head: { kicker: 'Part A · Digital Workflow' },
      steps: [
        {
          id: 's-b8',
          /* his request, round 08-10 00:15: a carousel, each type named under it, on a white ground, its advantages
             and drawbacks as green + and red − lines with the scenario it is chosen for; SD card and flash drive
             added, and the other kinds still in use. Title: Storage Types (a unit is a byte, a kilobyte...). */
          layout: 'stacked',
          title: 'Storage Types',
          blocks: [
            { type: 'tabs', gen: 'w6-b8-tabs', items: [
              {"tab": "SD Card", "cap": "SD Card", "src": "b8-sd-card.jpg", "alt": "An SD memory card", "use": "recording in the camera", "pros": ["Used by most cameras", "Small and cheap"], "cons": ["Easy to lose", "Wears out with use", "Counterfeit cards are common"]},
              {"tab": "microSD Card", "cap": "microSD Card", "src": "b8-microsd.jpg", "alt": "A microSD memory card", "use": "phones, drones and action cameras", "pros": ["The smallest card"], "cons": ["Very easy to lose", "Slower than a full-size card"]},
              {"tab": "CFexpress Card", "cap": "CFexpress Card", "src": "b8-cfexpress.jpg", "alt": "A CFexpress Type B memory card", "use": "fast bursts and high-resolution video", "pros": ["Up to about 1,700 MB/s"], "cons": ["Expensive", "Needs a camera and a reader that take it"]},
              {"tab": "USB Flash Drive", "cap": "USB Flash Drive", "src": "b8-usb-flash.jpg", "alt": "A USB flash drive", "use": "moving or handing in a few files", "pros": ["Cheap", "Plugs straight into a computer"], "cons": ["Slow", "Unreliable for keeping files", "Easy to lose"]},
              {"tab": "Hard Drive, Desktop", "cap": "Hard Drive, Desktop", "src": "b8-hdd-35-desktop.jpg", "alt": "A desktop external hard drive", "use": "the archive and backups at home", "pros": ["Cheapest per terabyte", "Large capacities, 20 TB and more"], "cons": ["Slow, about 100–250 MB/s", "Needs mains power", "Damaged by a knock while it spins"]},
              {"tab": "Hard Drive, Portable", "cap": "Hard Drive, Portable", "src": "b8-hdd-25-portable.jpg", "alt": "A rugged portable hard drive", "use": "a backup that travels", "pros": ["Cheap per terabyte", "Powered by the USB cable"], "cons": ["Slow, about 100–130 MB/s", "Damaged when dropped"]},
              {"tab": "SSD, SATA", "cap": "SSD, SATA", "src": "b8-ssd-sata.jpg", "alt": "A 2.5-inch SATA solid-state drive", "use": "a working drive in an older computer", "pros": ["About 550 MB/s", "No moving parts"], "cons": ["Costs more per terabyte than a hard drive", "Slower than NVMe"]},
              {"tab": "SSD, NVMe", "cap": "SSD, NVMe", "src": "b8-ssd-nvme.jpg", "alt": "An NVMe M.2 solid-state drive", "use": "the internal drive, catalogues and video editing", "pros": ["About 3,000–7,000 MB/s", "Small"], "cons": ["Needs an M.2 slot or an enclosure", "Gets hot during long copies"]},
              {"tab": "SSD, Portable", "cap": "SSD, Portable", "src": "b8-ssd-portable.jpg", "alt": "A portable solid-state drive", "use": "current projects on the move", "pros": ["About 1,000 MB/s on USB 10Gbps", "Light, and withstands knocks"], "cons": ["Costs more per terabyte than a hard drive"]},
              {"tab": "LTO Tape", "cap": "LTO Tape", "src": "b8-lto-tape.jpg", "alt": "An LTO tape cartridge", "use": "large archives in studios, agencies and museums", "pros": ["Lowest cost per terabyte for large archives", "About 30 years when stored well"], "cons": ["Needs an expensive tape drive", "Slow to find a single file"]},
              {"tab": "NAS", "cap": "NAS", "src": "b8-nas.jpg", "alt": "A two-bay network-attached storage box", "use": "an archive shared in a studio", "pros": ["Shared by several computers", "Two mirrored drives survive one failure"], "cons": ["Speed set by the network", "The box and the drives are bought separately"]},
              {"tab": "Cloud", "cap": "Cloud", "src": "b8-cloud.jpg", "alt": "A cloud storage service", "use": "the copy away from home", "pros": ["Off site, and synced to every device"], "cons": ["A cost every month or year", "Speed set by the internet connection"]},
            ] },
          ],
        },
        {
          id: 's-b6',
          layout: 'stacked',
          title: 'Storage - Pricing per Capacity',
          blocks: [
            { type: 'line', gen: 'w5-b6-say', html: 'Storage types differ in capacity, speed and cost per terabyte. Hard drives cost the least per terabyte, which is why archives are kept on them; however, they are slow for transferring data, unsuited to working files and vulnerable to physical impact.' },
            /* his request, round 08-10 00:15: small representative pictures for each kind */
            { type: 'gallery', layout: 'grid', images: [
              { src: 'th-hdd.jpg', alt: 'A desktop hard drive', ar: 3.46 },
              { src: 'th-nas.jpg', alt: 'A two-bay NAS box', ar: 3.46 },
              { src: 'th-ssd-sata.jpg', alt: 'A SATA SSD', ar: 3.46 },
              { src: 'th-ssd-nvme.jpg', alt: 'An NVMe SSD', ar: 3.46 },
              { src: 'th-cloud.jpg', alt: 'The Dropbox logo', ar: 3.46 },
            ] },
            { type: 'diagram', gen: 'w6-b6-dia', form: 'keys', data: {"items": [{"fig": "€32", "unit": "/TB", "label": "HDD", "line": "Archive and backups."}, {"fig": "€108", "unit": "/TB", "label": "NAS", "line": "A box and two hard drives, mirrored."}, {"fig": "€265", "unit": "/TB", "label": "SSD, SATA", "line": "Current projects."}, {"fig": "€145", "unit": "/TB", "label": "SSD, NVMe", "line": "Large files, catalogues."}, {"fig": "€60", "unit": "/TB a year", "label": "Cloud", "line": "A copy away from home."}]} },
            /* his request, round 07-10 19:24: "Dropbox Cloud üyeliği opsiyonu da eklenmeli. Bir de alta bir örnek model ve güncel
               fiyat ekle. O rationun kanıtı olarak." Prices seen 07-10-2026 at Coolblue, Alternate and dropbox.com (single shops;
               Tweakers could not be read). The figures above are these prices divided by the capacity. */
            { type: 'diagram', gen: 'w6-b6-table', form: 'table', data: {"head": "Example, 7 October 2026", "cols": ["Capacity", "Price", "Per TB"], "rows": [
              {"name": "Seagate Expansion Desktop (HDD)", "v": ["20 TB", "€646", "€32"]},
              {"name": "Synology DS225+ (box) with 2 × Seagate IronWolf Pro (hard drives)", "v": ["20 TB, mirrored", "€388 + 2 × €889", "€108"]},
              {"name": "Samsung 870 EVO (SATA SSD)", "v": ["2 TB", "€529", "€265"]},
              {"name": "Samsung 990 EVO Plus (NVMe SSD)", "v": ["4 TB", "€578", "€145"]},
              {"name": "Dropbox Plus", "v": ["2 TB", "€119.88 a year", "€60 a year"]}]} },
          ],
        },
        {
          id: 's-b10w',
          /* his request, round 07-10 19:24: "Bundan sonraya bir slide ekle adı Workfiles olsun ... bir dosyayı çalışırken
             hdd bağlı ya da ssd bağlı ya da anabilgisayarda çalışmanın faydalarını ve zararlarını ... Video editing'i hdd de yapıyorlarsa" */
          layout: 'stacked',
          title: 'Workfiles and Drive Types',
          blocks: [
            { type: 'line', gen: 'w6-b10w-say-2', html: 'Keep the files you are working on on a fast drive and the files you have finished on a cheap one. A hard drive is fast enough to copy and archive, but too slow to edit video or a large catalogue from.' },
            /* his note, round 08-10 00:15: each type's speed on a bar, so they can be compared */
            { type: 'diagram', gen: 'w6-b10w-bars', form: 'ladder', data: {"scale": "linear", "unit": "Typical speed", "ticks": [{"v": 0, "label": "0"}, {"v": 2000, "label": "2,000 MB/s"}, {"v": 4000, "label": "4,000 MB/s"}, {"v": 6000, "label": "6,000 MB/s"}], "items": [{"name": "Internal SSD", "v": 5000, "label": "3,000–7,000 MB/s"}, {"name": "External SSD", "v": 2000, "label": "1,000–3,000 MB/s"}, {"name": "External HDD", "v": 175, "label": "100–250 MB/s"}, {"name": "NAS, wired", "v": 110, "label": "110 MB/s"}, {"name": "Cloud drive", "v": 12, "label": "Set by the internet"}]} },
            { type: 'plan', gen: 'w6-b10w-table-3',
              head: ["Working from", "Good for", "Risk"],
              rows: [
                ["Internal SSD", "Current edits, the catalogue and cache", "Fills up, and the system slows down"],
                ["External SSD", "Projects that travel; video editing", "Unplugging during a copy damages files"],
                ["External HDD", "Archive, backups, finished projects", "Too slow for video; a knock can damage it"],
                ["NAS or network drive", "A shared archive", "Too slow to edit from"],
                ["Cloud drive", "Sharing; the copy away from home", "Set the project folder to Make available offline"],
              ] },
          ],
        },
        {
          id: 's-b10',
          layout: 'stacked',
          title: 'Scratch Disks',
          blocks: [
            { type: 'figure', src: 'b10-scratch-full.jpg', alt: 'Photoshop’s message: Could not initialize Photoshop because the scratch disks are full', place: { row: 1, col: 2, w: '1/2', v: 'middle', h: 'right' } },
            { type: 'line', gen: 'w5-b10-say-2', html: 'When Photoshop runs out of memory, it writes temporary data to a scratch disk. Unless you change it, that is your startup disk. If your computer’s internal storage does not have enough space, the scratch disk can fill up, and Photoshop slows down or stops editing. Lightroom Classic has no scratch disk, but it needs free space for its catalogue, previews and cache. Your computer’s photo and video editing performance can be affected by the space left on its internal drive.', sz: 'small', place: { row: 1, col: 1, w: '1/2', v: 'middle' } },
            { type: 'plan', gen: 'w6-b10-table',
              head: ["Program", "Keeps", "Set in"],
              rows: [
                ["Photoshop", "Scratch disk, for temporary data", "Settings → Scratch Disks"],
                ["Lightroom Classic", "Camera Raw cache, so photos open faster in Develop", "Preferences → Performance"],
                ["Premiere Pro", "Media cache and preview files", "Settings → Media Cache; Project Settings → Scratch Disks"],
                ["DaVinci Resolve", "Render cache and optimised media", "Project Settings → Working Folders"]
              ], place: { row: 2, col: 1, w: 'full' } },
          ],
        },
        {
          id: 's-b9u',
          /* his requests, round 07-10 19:24 and 08-10 00:15: what USB is; a picture of each connector, side by side
             at the top; bytes beside bits */
          layout: 'stacked',
          title: 'USB',
          blocks: [
            { type: 'line', gen: 'w6-b9u-say', html: 'USB (Universal Serial Bus) is the standard that connects drives, card readers and cameras to a computer and powers them. The connector is the shape of the plug, and the standard decides the speed. A USB-C plug can carry any standard, so its shape does not tell the speed.', place: { row: 1, col: 1, w: 'full' } },
            /* his request, round 08-10 02:38: tabs like Storage Types, so each plug is large enough to tell apart */
            { type: 'tabs', gen: 'w6-b9u-tabs', items: [
              {"tab": "USB-A", "src": "b9u-usb-a-43.jpg", "alt": "A USB-A plug", "rows": [["Found on", "Computers, chargers and flash drives"], ["Carries", "USB 2.0 to USB 10Gbps; a blue insert marks USB 3"]]},
              {"tab": "USB-B", "src": "b9u-usb-b-43.jpg", "alt": "A USB-B plug", "rows": [["Found on", "Printers, scanners and desktop drives"], ["Carries", "USB 2.0; a taller USB 3 version exists"]]},
              {"tab": "Mini-B", "src": "b9u-mini-b-43.jpg", "alt": "A Mini-B plug", "rows": [["Found on", "Older cameras, card readers and portable drives"], ["Carries", "USB 2.0"]]},
              {"tab": "Micro-B", "src": "b9u-micro-b-43.jpg", "alt": "A Micro-B plug", "rows": [["Found on", "Older phones, cameras and small devices"], ["Carries", "USB 2.0; a wider USB 3 version is on portable drives"]]},
              {"tab": "USB-C", "src": "b9u-usb-c-43.jpg", "alt": "A USB-C plug", "rows": [["Found on", "Current computers, phones, cameras and SSDs"], ["Carries", "Any standard from USB 2.0 to USB4 and Thunderbolt; reversible"]]}
            ], place: { row: 2, col: 1, w: '1/2', rgrow: true } },
            { type: 'plan', gen: 'w6-b9u-table', head: ["Standard", "Bits per second", "Bytes per second", "Marked as"], rows: [
              ["USB 2.0", "480 Mb/s", "60 MB/s", "Hi-Speed"],
              ["USB 3.2 Gen 1 (USB 3.0)", "5 Gb/s", "625 MB/s", "USB 5Gbps"],
              ["USB 3.2 Gen 2 (USB 3.1)", "10 Gb/s", "1,250 MB/s", "USB 10Gbps"],
              ["USB 3.2 Gen 2×2", "20 Gb/s", "2,500 MB/s", "USB 20Gbps"],
              ["USB4", "40 Gb/s", "5,000 MB/s", "USB 40Gbps"],
              ["USB4 Version 2.0", "80 Gb/s", "10,000 MB/s", "USB 80Gbps"]
            ], place: { row: 2, col: 2, w: '1/2' } },
          ],
        },
        {
          id: 's-b9',
          layout: 'stacked',
          title: 'Cable Types & Transfer Speeds',
          blocks: [
            { type: 'line', gen: 'w5-b9-say', html: 'A copy runs as fast as the cable and the port allow. Thunderbolt uses the USB-C plug and carries the fastest standards, up to 80 Gb/s.' },
            { type: 'gallery', layout: 'grid', images: [
              { src: 'b9-usb2.jpg', alt: 'A USB 2.0 cable, USB-A to mini-B', ar: 1.6, cap: 'USB 2.0 · USB-A to mini-B' },
              { src: 'b9-usb10.jpg', alt: 'A USB-C 10Gbps cable', ar: 1.6, cap: 'USB 10Gbps · USB-C' },
              { src: 'b9-tb4.jpg', alt: 'A Thunderbolt 4 cable, its plug marked with a bolt and a 4', ar: 1.6, cap: 'Thunderbolt 4 · USB-C' },
              { src: 'b9-tb5.jpg', alt: 'A Thunderbolt 5 cable, its plug marked with a bolt and a 5', ar: 1.6, cap: 'Thunderbolt 5 · USB-C' },
            ] },
            { type: 'diagram', gen: 'w6-b9-bars', form: 'ladder', data: {"scale": "linear", "unit": "Maximum transfer speed", "ticks": [{"v": 0, "label": "0"}, {"v": 40, "label": "40 Gb/s"}, {"v": 80, "label": "80 Gb/s"}, {"v": 120, "label": "120 Gb/s"}], "items": [{"name": "USB 2.0", "v": 0.48, "label": "0.48 Gb/s"}, {"name": "USB 10Gbps", "v": 10, "label": "10 Gb/s"}, {"name": "USB4 40Gbps · Thunderbolt 4", "v": 40, "label": "40 Gb/s"}, {"name": "Thunderbolt 5", "v": 80, "boost": 120, "label": "80 (120) Gb/s"}]} },
            { type: 'note', gen: 'w6-b9-note', html: 'A copy runs at the speed of its slowest part, which may be the card, card reader, cable, port or drive. A charging cable is often USB 2.0, on which 100 GB takes about 28 minutes at 60 MB/s and about 42 minutes at the 40 MB/s it reaches in practice.' },
          ],
        },
        {
          id: 's-b9p',
          /* his request, round 07-10 20:08: "add another slide for explaining power delivery and data transfer speed
             differences. Watt and GBPS is two different factor when buying a USBC or Thunderbolt cables" */
          layout: 'stacked',
          title: 'USB-C: Power Delivery & Data Transfer',
          blocks: [
            { type: 'line', gen: 'w6-b9p-say', html: 'A USB-C cable carries power and data, and it is rated for each separately. Watts (W) give the power it can charge with, and gigabits per second (Gb/s) give the speed it moves data at. A 240 W charging cable can still move data at USB 2.0 speed, 480 Mb/s.', place: { row: 1, col: 1, w: 'full' } },
            /* his note, round 08-10 00:15: the table's values read too high and the list confused; a general range instead */
            { type: 'diagram', gen: 'w6-b9p-keys', form: 'keys', data: {"items": [{"fig": "60–240", "unit": "W", "label": "Power", "line": "How much a cable can charge with. 60 W for phones and small laptops; 240 W is the most a USB-C cable carries.", "key": 1}, {"fig": "0.48–80", "unit": "Gb/s", "label": "Data", "line": "How fast it moves files. 480 Mb/s on a USB 2.0 charging cable, up to 80 Gb/s on USB4 and Thunderbolt 5."}]}, place: { row: 2, col: 1, w: '1/2' } },
            /* his request, round 08-10 03:32: a picture of a cable's PD ratings */
            { type: 'figure', src: 'b9p-usbif-logos.jpg', alt: 'The USB-IF Certified USB Logo Program: packaging and cable logos for 40Gbps, 240W and both together', caption: 'The ratings printed on certified cables and their packaging. Image: USB Implementers Forum.', place: { row: 2, col: 2, w: '1/2', fillH: true } },
            { type: 'note', gen: 'w6-b9p-note', html: 'A certified cable prints both ratings on its packaging, such as 240W and USB 40Gbps.', place: { row: 3, col: 1, w: 'full' } },
          ],
        },
        {
          id: 's-b11w',
          /* his request, round 07-10 19:24: "Neden Backup almalıyız'ı anlatan bir slide ... her drive tipine özgü bozulma,
             açılmama nedenlerini açıkladığımız bir slide" */
          layout: 'stacked',
          title: 'Why Is Backup Important?',
          blocks: [
            { type: 'line', gen: 'w6-b11w-say', html: 'Every drive fails in time, and each type fails in its own way. A backup on a second type of storage covers the potential faults of the first.' },
            { type: 'plan', gen: 'w6-b11w-table',
              head: ["Storage", "How it fails"],
              rows: [
                ["Hard Drive", "The motor and bearings wear out; a drop or knock while it spins drives the head into the platter; bad sectors spread with age, and the drive stops mounting or clicks."],
                ["SSD", "Each write wears the flash cells; the controller can fail without warning, taking every file at once; data can fade when the drive is left unpowered for years."],
                ["Memory Card", "Pulled out or powered off during a write, its file system corrupts; cheap and counterfeit cards fail early."],
                ["Cloud", "A sync passes a deletion or a damaged file to every device; an account can be closed or a subscription can lapse."],
                ["Every type", "Theft, fire, water, accidents or a file deleted by mistake."]
              ] },
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
          id: 's-b7',
          /* 30-09, his note: no picture of a card - everybody knows what one looks like */
          layout: 'stacked',
          title: 'SD Card Cycle',
          blocks: [
            { type: 'line', gen: 'w5-b7-say', html: 'A memory card is temporary storage. Its contents are copied to a drive after every shoot.', place: { row: 1, col: 1, w: '3/4' } },
            { type: 'figure', src: 'b8-sd-card.jpg', alt: 'An SD memory card', place: { row: 1, col: 2, w: '1/4' } },
            /* 01-10: seven steps with Back up; drawn across the page, the list ran over the title at 1440 */
            { type: 'diagram', gen: 'w5-b7-steps', form: 'steps', data: {"orient": "h", "arrows": true, "steps": [{"t": "Capture", "line": "Take photos with your camera."}, {"t": "Import", "line": "Copy the RAW files to the computer, converted to DNG and renamed."}, {"t": "Check", "line": "Transfer completed without an issue."}, {"t": "Back up", "line": "A second copy on another drive."}, {"t": "Format", "line": "Delete all the files on the SD card."}, {"t": "Capture Again", "line": "Start the shoot with an empty card."}]}, place: { row: 2, col: 1, w: 'full' } },
          ],
        },
      ],
    },


    /* ================================================== B4 · Lightroom */
    {
      id: 'c-lightroom',
      title: 'Lightroom Classic',
      part: 'a',
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
      ],
    },


    /* ================================================== B · RAW Editing Workflow — his word 07-10-2026:
       "RAW Editing Workflow - Lightroom & Adobe Camera Raw. burası genel olarak Lightroom'un RAW editing
       panelini ve bazı işlevsel LR toollarını incelediğimiz yer olacak. Tutorial - yap göster bazlı
       olacak ama bazı noktaları da sunuma başlık ve görsel olarak açalım ki ben stepleri görebileyim."
       One page per Develop panel or tool, in the panel order of Lightroom Classic, each titled with
       the panel's own name. Every screenshot is a placeholder that says which screen it waits for. */
    {
      id: 'c-raw',
      title: 'RAW Editing',
      part: 'b',
      partTitle: 'RAW Editing Workflow',
      head: { kicker: 'Part B · RAW Editing Workflow · Lightroom & Adobe Camera Raw' },
      steps: [
        {
          id: 's-rc',
          /* his word 07-10: "Raw editing workflow'un en başına Lightroom Classic, PS Adobe Camera Raw, Bridge
             farklarını ve neyi nerelerde yapıp yapamadığını bir özellikler listesi olarak kıyasla" and
             "Lightroom'un bu daha lite versiyonunu da ekle" - the cloud-based Lightroom. Title provisional. */
          layout: 'stacked',
          title: 'Lightroom, Camera Raw and Bridge',
          blocks: [
            { type: 'line', gen: 'w6-rc-say', sz: 0.8, html: 'Lightroom Classic, Lightroom and Camera Raw share same RAW processing engine, so adjustments gives the same result in each visually. However they differ in capabilities, where and how the photographs are kept and in what else they do.' },
            { type: 'plan', gen: 'w6-rc-table-3', dense: false, sz: 0.78,
              head: ['', 'Lightroom Classic', 'Lightroom', 'Camera Raw', 'Bridge'],
              rows: [
                ['What it is', 'Desktop app to organise and edit', 'Cloud app for desktop, mobile and web', 'RAW editor in Photoshop and Bridge', 'File browser for Adobe files'],
                ['Where the photos are', 'Your own drives, in a catalogue', 'Adobe cloud, Synced to each device', 'Your own drives, without a catalogue.', 'Your own drives, in folders'],
                ['Where edits are stored', 'LR Catalogue', 'Cloud', 'XMP sidecar; inside a DNG', 'Reads and writes XMP'],
                ['RAW editing', 'Develop module, with masking and AI tools', 'Edit panel, with masking and AI tools, more limited', 'Yes, with masking and AI tools', 'Through Camera Raw'],
                ['Library', 'Collections, smart collections, keywords', 'Albums and keywords', '—', 'Collections and keywords'],
                ['Copies and history', 'Virtual copies, History, Snapshots', 'Versions', 'Snapshots', '—'],
                ['Edit many photos at once', 'Sync and Auto Sync', 'Copy and paste edits', 'Sync across open files', 'Through Camera Raw'],
                ['Smart Previews', 'Edit with the drive unplugged', 'Through the cloud', '—', '—'],
                ['Renaming presets', 'Filename templates', 'On export', '—', 'Batch Rename presets'],
                ['Plug-ins', 'Yes, such as Negative Lab Pro', '—', '—', '—'],
                ['Tethered Capture', 'Yes, but very limited. Not industry level.', '—', '—', '—'],
                ['Print, Map and Book', 'Print, Map and Book modules', '—', '—', 'PDF contact sheet'],
                ['Comes with', 'Photography Plan', 'Photography Plan, or its own plan', 'Photoshop', 'Free with an Adobe account'],
              ] },
          ],
        },
        {
          id: 's-r1',
          layout: 'stacked',
          title: 'Lightroom Classic and Camera Raw: Panels',
          blocks: [
            { type: 'line', gen: 'w6-r1-say-2', html: 'The same RAW file in Lightroom Classic and in Camera Raw. The panels hold the similar controls, in a different order.', place: { row: 1, col: 1, w: 'full' } },
            { type: 'figure', src: 'r1-lrc-2.png', alt: 'The Develop module of Lightroom Classic', caption: 'Lightroom Classic · Develop.', place: { row: 2, col: 1, w: '1/2', fillH: true } },
            { type: 'figure', src: 'r1-acr-2.png', alt: 'The Camera Raw window in Photoshop', caption: 'Photoshop · Camera Raw.', place: { row: 2, col: 2, w: '1/2', fillH: true } },
          ],
        },
        {
          id: 's-r0',
          layout: 'stacked',
          title: 'Adobe RAW Editing Panel',
          blocks: [
            { type: 'line', gen: 'w6-r0-say', html: 'In Lightroom Classic the tool strip under the histogram holds the <i><em>local</em></i> corrections, and the panels below it hold the <i><em>global</em></i> settings, from Basic to Calibration. Working down the panels means each step starts from the result of the one before it.', place: { row: 1, col: 1, w: '2/3' } },
            { type: 'figure', src: 'r0-develop-panels.png', alt: 'The Develop panels of Lightroom Classic', place: { row: 1, col: 2, w: '1/3', rgrow: true } },
            { type: 'diagram', gen: 'w6-r0-dia', form: 'steps', data: {"orient": "h", "steps": [{"t": "Profile and White Balance", "line": "The rendering of colour and contrast."}, {"t": "Tone and Presence", "line": "Brightness and contrast across the frame."}, {"t": "Color", "line": "Tone Curve, Color Mixer, Color Grading and Calibration."}, {"t": "Detail", "line": "Sharpening and noise reduction."}, {"t": "Geometry", "line": "Lens Corrections, Transform and Crop."}, {"t": "Effects", "line": "Vignette and grain."}, {"t": "Local Corrections", "line": "Masking, Lens Blur and Remove."}]}, place: { row: 2, col: 1, w: 'full' } },
          ],
        },
        {
          id: 's-r2',
          layout: 'stacked',
          title: 'Histogram',
          blocks: [
            { type: 'line', gen: 'w6-r2-say', html: 'The histogram counts the pixels at each brightness, from black at the left edge to white at the right, for the red, green and blue channels. A peak pressed against either edge marks clipped shadows or highlights. Press J to show the clipped areas on the image, blue for shadows and red for highlights.', place: { row: 1, col: 1, w: 'full' } },
            { type: 'figure', src: 'r2-histogram-clipped.png', alt: 'The Histogram panel with clipping shown on the image', caption: 'Lightroom Classic · Develop › Histogram.', place: { row: 2, col: 2, w: '1/3', fillH: true } },
            { type: 'figure', src: 'r2-clipping.png', alt: 'Lightroom Classic with highlight clipping shown in red on a gallery wall', caption: 'Clipped highlights in red (J).', place: { row: 2, col: 1, w: '2/3', fillH: true } },
          ],
        },
        {
          id: 's-r3',
          layout: 'plate',
          title: 'Profile',
          blocks: [
            { type: 'figure', src: 'r3-profile.png', alt: 'The Profile Browser of Lightroom Classic', caption: 'Lightroom Classic · Develop › Basic › Profile.' },
            { type: 'line', gen: 'w6-r3-say', html: 'The profile decides how the RAW data is rendered into colour and contrast before any slider is moved.' },
            { type: 'bul', gen: 'w6-r3-bul', items: [
              'Adobe Raw · Adobe’s own renderings, such as Adobe Color, Adobe Standard and Adobe Neutral',
              'Camera Matching · the picture styles of the camera maker',
              'Artistic, B&W, Modern and Vintage · creative looks with an Amount slider',
            ] },
          ],
        },
        {
          id: 's-r4',
          layout: 'stacked',
          title: 'White Balance',
          blocks: [
            { type: 'line', gen: 'w6-r4-say', html: 'White balance corrects the colour of the light in the scene. On a RAW scan of a negative, the eyedropper is set on the film border, as in the scanning manuals.', place: { row: 1, col: 1, w: 'full' } },
            { type: 'bul', gen: 'w6-r4-bul', items: [
              'Temp · blue to yellow, in kelvin for a RAW file',
              'Tint · green to magenta',
              'Eyedropper (W) · sets both from a neutral grey or white area',
            ], place: { row: 2, col: 1, w: '1/2' } },
            { type: 'figure', src: 'r4-wb.png', alt: 'The White Balance section of the Basic panel', caption: 'Lightroom Classic · Develop › Basic › White Balance.', place: { row: 2, col: 2, w: '1/2' } },
          ],
        },
        {
          id: 's-r5',
          layout: 'stacked',
          title: 'Tone',
          blocks: [
            { type: 'line', gen: 'w6-r5-say', html: 'The Tone sliders set brightness and contrast for the whole frame. Hold Option (Alt) while dragging Whites or Blacks to see which areas clip.', place: { row: 1, col: 1, w: 'full' } },
            { type: 'bul', gen: 'w6-r5-bul', items: [
              'Exposure · overall brightness, in stops',
              'Contrast · the distance between dark and light tones',
              'Highlights · the bright areas',
              'Shadows · the dark areas',
              'Whites · the white point',
              'Blacks · the black point',
            ], place: { row: 2, col: 1, w: '1/2' } },
            { type: 'figure', src: 'r5-tone.png', alt: 'The Tone section of the Basic panel', caption: 'Lightroom Classic · Develop › Basic › Tone.', place: { row: 2, col: 2, w: '1/2' } },
          ],
        },
        {
          id: 's-r6',
          layout: 'stacked',
          title: 'Presence',
          blocks: [
            { type: 'line', gen: 'w6-r6-say', html: 'The Presence sliders change local contrast and the intensity of colour across the frame.', place: { row: 1, col: 1, w: 'full' } },
            { type: 'bul', gen: 'w6-r6-bul', items: [
              'Texture · medium-sized detail such as skin and bark',
              'Clarity · contrast in the midtones',
              'Dehaze · haze in the atmosphere, removed or added',
              'Vibrance · the muted colours, with skin tones held back',
              'Saturation · every colour by the same amount',
            ], place: { row: 2, col: 1, w: '1/2' } },
            { type: 'figure', src: 'r6-presence.png', alt: 'The Presence section of the Basic panel', caption: 'Lightroom Classic · Develop › Basic › Presence.', place: { row: 2, col: 2, w: '1/2' } },
          ],
        },
        {
          id: 's-r7',
          layout: 'plate',
          title: 'Tone Curve',
          blocks: [
            { type: 'figure', src: 'r7-curve.png', alt: 'The Tone Curve panel with an S-shaped curve', caption: 'Lightroom Classic · Develop › Tone Curve.' },
            { type: 'line', gen: 'w6-r7-say', html: 'The tone curve maps the brightness of each input tone to an output brightness. Raising a point brightens that tone, and an S-shaped curve adds contrast. The parametric curve works in four regions, Highlights, Lights, Darks and Shadows. The point curve and the red, green and blue channels take any shape.' },
          ],
        },
        {
          id: 's-r8',
          layout: 'plate',
          title: 'Color Mixer',
          blocks: [
            { type: 'figure', src: 'r8-mixer.png', alt: 'The Colour Mixer panel, HSL view', caption: 'Lightroom Classic · Develop › Color Mixer.' },
            { type: 'line', gen: 'w6-r8-say', html: 'The Color Mixer changes eight colour ranges separately, from red to magenta. The targeted adjustment tool changes the range under the cursor when dragged on the image.' },
            { type: 'bul', gen: 'w6-r8-bul', items: [
              'Hue · shifts a range towards its neighbour',
              'Saturation · the intensity of a range',
              'Luminance · the brightness of a range',
            ] },
          ],
        },
        {
          id: 's-r9',
          layout: 'plate',
          title: 'Color Grading',
          blocks: [
            { type: 'figure', src: 'r9-grading.png', alt: 'The Colour Grading panel with three colour wheels', caption: 'Lightroom Classic · Develop › Color Grading.' },
            { type: 'line', gen: 'w6-r9-say', html: 'Color Grading adds a hue to the shadows, midtones and highlights, each on its own wheel, with a global wheel for the whole frame. Blending sets how far the three ranges overlap, and Balance moves the boundary between shadows and highlights.' },
          ],
        },
        {
          id: 's-r12d',
          layout: 'plate',
          title: 'Calibration',
          blocks: [
            { type: 'figure', src: 'r12d-calibration.png', alt: 'The Calibration panel of Lightroom Classic: Process, Shadows Tint and the red, green and blue primaries', caption: 'Lightroom Classic · Develop › Calibration.' },
            { type: 'line', gen: 'w6-r12d-say', html: 'Calibration changes how the camera’s red, green and blue are rendered. It shifts every colour in the frame at once, to build a look or to match two cameras.' },
            { type: 'bul', gen: 'w6-r12d-bul', items: [
              'Process · the version of the processing engine',
              'Shadows Tint · green to magenta in the shadows',
              'Red, Green and Blue Primary · the hue and saturation of each',
            ] },
          ],
        },
        {
          id: 's-r10',
          layout: 'plate',
          title: 'Detail',
          blocks: [
            { type: 'figure', src: 'r10-detail.png', alt: 'The Detail panel with the sharpening mask shown', caption: 'Lightroom Classic · Develop › Detail.' },
            { type: 'line', gen: 'w6-r10-say', html: 'Sharpening raises contrast along edges. Noise reduction smooths the variation in brightness and colour that a high ISO adds. Hold Option (Alt) while dragging Masking to see which edges are sharpened.' },
            { type: 'bul', gen: 'w6-r10-bul', items: [
              'Amount · how much edge contrast is added',
              'Radius · how wide an edge is taken to be',
              'Detail · how much fine texture is sharpened',
              'Masking · limits sharpening to the edges',
              'Noise Reduction · Luminance for brightness noise, Color for coloured speckles',
            ] },
          ],
        },
        {
          id: 's-r11',
          layout: 'plate',
          title: 'Lens Corrections',
          blocks: [
            { type: 'figure', src: 'r11-lens.png', alt: 'The Lens Corrections panel', caption: 'Lightroom Classic · Develop › Lens Corrections.' },
            { type: 'line', gen: 'w6-r11-say', html: 'Lens Corrections removes the faults of a lens. Enable Profile Corrections reads the lens from the metadata of the file and corrects its distortion and vignetting. Remove Chromatic Aberration takes out the colour fringes along high-contrast edges.' },
          ],
        },
        {
          id: 's-r12',
          layout: 'plate',
          title: 'Transform',
          blocks: [
            { type: 'figure', src: 'r12-transform.png', alt: 'The Transform panel with Upright set to Vertical', caption: 'Lightroom Classic · Develop › Transform.' },
            { type: 'line', gen: 'w6-r12-say', html: 'Transform corrects converging lines and a tilted horizon. Upright does it automatically, in the modes Auto, Guided, Level, Vertical and Full. The sliders set vertical and horizontal perspective, rotation, aspect and scale by hand.' },
          ],
        },
        {
          id: 's-r13',
          layout: 'plate',
          title: 'Crop',
          blocks: [
            { type: 'figure', src: 'r13-crop.png', alt: 'The Crop tool with an overlay grid', caption: 'Lightroom Classic · Develop › Crop.' },
            { type: 'line', gen: 'w6-r13-say', html: 'The Crop tool (R) sets the frame and its aspect ratio. Press X to turn the crop between landscape and portrait, and O to change the overlay grid. The Straighten tool levels the horizon when it is dragged along it.' },
          ],
        },
        {
          id: 's-r12c',
          layout: 'plate',
          title: 'Effects',
          blocks: [
            { type: 'figure', src: 'r12c-effects.png', alt: 'The Effects panel of Lightroom Classic: Post-Crop Vignetting and Grain', caption: 'Lightroom Classic · Develop › Effects.' },
            { type: 'line', gen: 'w6-r12c-say', html: 'Effects adds a vignette to the cropped frame and a film-like grain.' },
            { type: 'bul', gen: 'w6-r12c-bul', items: [
              'Post-Crop Vignetting · darkens or lightens the corners of the cropped frame',
              'Grain · Amount, Size and Roughness of the texture',
            ] },
          ],
        },
        {
          id: 's-r14',
          layout: 'plate',
          title: 'Masking',
          blocks: [
            { type: 'figure', src: 'r14-mask-panel.png', alt: 'The Masking panel: Subject, Sky, Background, Landscape, Objects, Brush, Linear and Radial Gradient, Range, People', caption: 'Lightroom Classic · Develop › Masking › Add New Mask.' },
            { type: 'line', gen: 'w6-r14-say', html: 'Masking applies Develop settings to part of the frame. A mask is drawn with a brush or a linear or radial gradient, or selected automatically as the subject, the sky, the background, objects or people. Masks can be added to, subtracted from and intersected with each other.' },
          ],
        },
        {
          id: 's-r12b',
          /* his screenshot of 08-10 01:04: the panel after Transform */
          layout: 'plate',
          title: 'Lens Blur',
          blocks: [
            { type: 'figure', src: 'r12b-lens-blur.png', alt: 'The Lens Blur panel of Lightroom Classic', caption: 'Lightroom Classic · Develop › Lens Blur.' },
            { type: 'line', gen: 'w6-r12b-say', html: 'Lens Blur adds the out-of-focus blur of a wide aperture after the shot. It builds a depth map of the scene with AI, keeps the chosen depths sharp and blurs the rest.' },
            { type: 'bul', gen: 'w6-r12b-bul', items: [
              'Blur Amount · how strong the blur is',
              'Bokeh · the shape of the out-of-focus highlights',
              'Focal Range · the depths that stay sharp',
              'Visualize Depth · shows the depth map in colour',
            ] },
          ],
        },
        {
          id: 's-r15',
          layout: 'plate',
          title: 'Remove',
          blocks: [
            { type: 'figure', src: 'r15-remove.png', alt: 'Visualize Spots on a scanned negative', caption: 'Lightroom Classic · Develop › Remove.' },
            { type: 'line', gen: 'w6-r15-say', html: 'The Remove tool (Q) takes out dust, spots and unwanted objects. Heal blends the repair into its surroundings, Clone copies the source area as it is, and Remove fills the area from its surroundings, with generative AI as an option. Visualize Spots shows the dust on a scanned negative or a sensor as white specks.' },
          ],
        },
        {
          id: 's-r16',
          layout: 'stacked',
          title: 'Sync Settings',
          blocks: [
            { type: 'line', gen: 'w6-r16-say', html: 'Settings made on one frame are copied to others in three ways. Copy and Paste (Cmd/Ctrl + Shift + C, then V) moves the chosen settings to the selected frames. Sync applies them to every selected frame at once, and Auto Sync changes all selected frames while one is edited. A preset saves a set of settings for later shoots.' },
            { type: 'figure', src: 'r16-sync.png', alt: 'The Synchronize Settings dialog', caption: 'Lightroom Classic · Develop › Sync.' },
          ],
        },
      ],
    },

    /* ================================================== B · Export — Export Settings, Contact Sheets and
       Batch Processing were the end of the Lightroom chapter; since 07-10 they close RAW Editing, after the
       editing they write out. */
    {
      id: 'c-export',
      title: 'Export',
      part: 'b',
      steps: [
        {
          id: 's-b22',
          layout: 'stacked',
          title: 'Batch Processing',
          blocks: [
            { type: 'line', gen: 'w5-b22-say', html: 'Batch processing applies one set of settings to many files in a single operation, such as the same edit, name pattern or export size for a whole shoot.', place: { row: 1, col: 1, w: 'full' } },
            { type: 'plan', gen: 'w6-b22-table',
              head: ["Task", "Program", "Command"],
              rows: [
                ["Export many at once", "Lightroom Classic", "Select all → File → Export"],
                ["Convert and resize a folder", "Photoshop", "File → Scripts → Image Processor"],
                ["Repeat a recorded Action", "Photoshop", "File → Automate → Batch"]
              ], place: { row: 2, col: 1, w: '1/2' } },
            { type: 'text', gen: 'w5-b22-b-text', paras: ['Rename Photos, Export and Image Processor write every file with the same settings, and Batch plays a recorded Action (a saved sequence of Photoshop steps) on every file in a folder. An error in the settings is repeated on every file, so the settings are tested on one photograph before the batch runs.'] , place: { row: 3, col: 1, w: 'full' } },
            { type: 'figure', src: 'b22-image-processor.jpg', alt: 'The Photoshop Image Processor dialog, sections 1 to 4', caption: 'Photoshop · File → Scripts → Image Processor.', place: { row: 2, col: 2, w: '1/2', fillH: true, rgrow: true } },
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
          layout: 'stacked',
          title: 'Contact Sheets',
          blocks: [
            { type: 'line', gen: 'w5-b21-say', html: 'A contact sheet shows a whole shoot on one page. You can quickly make them on Lightroom, Photoshop or many other photography software.', place: { row: 1, col: 1, w: 'full' } },
            { type: 'figure', src: 'b21-lr-contact.jpg', alt: 'The Lightroom Classic Print module laying out a contact sheet', caption: 'Lightroom Classic · Print module.', place: { row: 3, col: 1, w: '1/2', fillH: true } },
            { type: 'figure', src: 'b21-ps-contact.jpg', alt: 'The Photoshop Contact Sheet II dialog', caption: 'Photoshop · Contact Sheet II.', place: { row: 3, col: 2, w: '1/2', fillH: true } },
            { type: 'text', gen: 'w5-b21-text', paras: ['The name comes from the darkroom, where strips of negatives were laid on photographic paper and printed at their own size. The sheet is used to compare frames, choose selects and find a picture later.'], place: { row: 2, col: 1, w: 'full' } },
          ],
        },
      ],
    },

    /* ================================================== B · Negative Lab Pro — his word 07-10-2026: "also add
       section for negative lab pro. I also included a document from NLP. Use it as a resource for that part
       of the presentation." Source: _sources/documents/Negative Lab Pro - Quick Start Guide.pdf (8 pp); the
       pictures are cut from it. The batch step comes from João Henrique Viegas's scanning manuals. */
    {
      id: 'c-nlp',
      title: 'Negative Lab Pro',
      part: 'b',
      steps: [
        {
          id: 's-n0',
          layout: 'plate',
          title: 'Negative Lab Pro',
          blocks: [
            { type: 'figure', src: 'n3-edit.jpg', alt: 'A converted colour negative of a kiosk at night, first conversion above and edited version below, with the Negative Lab Pro panel beside each', caption: 'Negative Lab Pro · the first conversion (top) and the edit (bottom). Image: Negative Lab Pro, Quick Start Guide.' },
            { type: 'line', gen: 'w6-n0-say', html: 'Negative Lab Pro is a plug-in for Lightroom Classic that converts a scanned negative into a positive. It works on camera RAW, DNG and TIFF scans. The trial converts 24 frames; after that it needs a paid licence.' },
            { type: 'link', href: 'https://www.negativelabpro.com/guide/', kicker: 'Negative Lab Pro · Guides', text: 'Online guides', away: true },
          ],
        },
        {
          id: 's-n1',
          layout: 'stacked',
          title: 'Negative Lab Pro: Converting a Negative',
          blocks: [
            { type: 'diagram', gen: 'w6-n1-dia', form: 'steps', data: {"orient": "h", "steps": [{"t": "Select", "line": "The negative in the Develop module, as a camera RAW, DNG or TIFF file."}, {"t": "White Balance", "line": "The eyedropper on the film border, for RAW scans only."}, {"t": "Open", "line": "Control + N opens Negative Lab Pro."}, {"t": "Preview", "line": "Border Buffer is raised until only the exposed film shows."}, {"t": "Convert", "line": "Convert Negative(s) analyses the frame and inverts it."}]}, place: { row: 1, col: 1, w: 'full' } },
            { type: 'figure', src: 'n1-wb-border.jpg', alt: 'Lightroom Classic Develop module, a negative on screen and the White Balance eyedropper marked', caption: 'White balance from the film border. Image: Negative Lab Pro, Quick Start Guide.', place: { row: 2, col: 1, w: '1/2' } },
            { type: 'figure', src: 'n1-preview.jpg', alt: 'Negative Lab Pro Preview, the area to be analysed outlined in red inside the film border', caption: 'Preview: no sprocket holes, film holder or border inside the red frame. Image: Negative Lab Pro, Quick Start Guide.', place: { row: 2, col: 2, w: '1/2' } },
            { type: 'note', gen: 'w6-n1-batch', html: 'Several frames are converted together by selecting them all before Control + N. Frames of different film types, such as black-and-white and colour negative, are converted in separate selections.', place: { row: 3, col: 1, w: 'full' } },
          ],
        },
        {
          id: 's-n2',
          layout: 'plate',
          title: 'Negative Lab Pro: Convert Settings',
          blocks: [
            { type: 'figure', src: 'n2-convert.jpg', alt: 'The Convert tab of Negative Lab Pro with Source, Color Model, Pre-Saturation and Border Buffer', caption: 'Negative Lab Pro · Convert. Image: Negative Lab Pro, Quick Start Guide.' },
            { type: 'line', gen: 'w6-n2-say', html: 'The Convert tab sets how the scan is read before it is inverted.' },
            { type: 'bul', gen: 'w6-n2-bul', items: [
              'Source · how the negative was digitised, such as Digital Camera',
              'Color Model · the colour rendering, such as Basic, Frontier, Noritsu or B+W',
              'Pre-Saturation · the saturation applied before conversion',
              'Border Buffer · the share of the edge left out of the analysis',
            ] },
          ],
        },
        {
          id: 's-n5',
          layout: 'stacked',
          title: 'Negative Lab Pro: Editing Settings',
          blocks: [
            { type: 'line', gen: 'w6-n5-say', html: 'The Edit tab changes tone and colour after the conversion.' },
            { type: 'bul', gen: 'w6-n5-bul', items: [
              'Tones · the tone profile',
              'Brightness · a gamma adjustment that Lightroom does not have',
              'WhiteClip and BlackClip · where the white and black points fall',
              'WB, Temp and Tint · the colour balance',
              'LUT · the look of a lab scanner or a paper type',
              'LabGlow and LabFade · the highlight and shadow compression of a lab scanner',
            ] },
          ],
        },
        {
          id: 's-n4',
          layout: 'stacked',
          title: 'Negative Lab Pro: Tone Profiles',
          blocks: [
            { type: 'line', gen: 'w6-n4-say', html: 'The default tone profile, LAB – Standard, gives the contrast of a lab scan, with some tones close to clipping. Linear and Cinematic give a flatter start for further editing. A conversion that looks washed out gains richer tones when Brightness is lowered and Contrast raised.', place: { row: 1, col: 1, w: 'full' } },
            { type: 'figure', src: 'n5-tones.jpg', alt: 'A beach scene converted with LAB – Standard on the left and with Linear on the right', caption: 'Tones: LAB – Standard and Linear. Image: Negative Lab Pro, Quick Start Guide.', place: { row: 2, col: 1, w: '2/3', fillH: true } },
            { type: 'figure', src: 'n5-brightness.jpg', alt: 'A garden scene before and after Brightness −10 and Contrast +10', caption: 'Brightness −10, Contrast +10. Image: Negative Lab Pro, Quick Start Guide.', place: { row: 2, col: 2, w: '1/3', fillH: true } },
          ],
        },
        {
          id: 's-n3',
          layout: 'stacked',
          title: 'Negative Lab Pro: Colour Casts',
          blocks: [
            { type: 'line', gen: 'w6-n3-say', html: 'Inverting the orange mask of a colour negative leaves a blue cast. Negative Lab Pro corrects it during conversion, less reliably under very warm or very cold light. Set WB to Auto-Warm or Auto-Mix, then adjust Temp and Tint by hand; large changes are normal on some frames.', place: { row: 1, col: 1, w: 'full' } },
            { type: 'figure', src: 'n4-auto-warm.jpg', alt: 'A portrait from a colour negative, blue after conversion on the left and neutral with WB set to Auto-Warm on the right', caption: 'WB set to Auto-Warm. Image: Negative Lab Pro, Quick Start Guide.', place: { row: 2, col: 1, w: '1/3', fillH: true } },
            { type: 'figure', src: 'n4-temp-tint.jpg', alt: 'A beach at sunset, cool with Temp and Tint at 0 on the left and warm with Temp 55 and Tint 15 on the right', caption: 'Temp 0 → 55, Tint 0 → 15. Image: Negative Lab Pro, Quick Start Guide.', place: { row: 2, col: 2, w: '2/3', fillH: true } },
          ],
        },
        {
          id: 's-n6',
          layout: 'stacked',
          title: 'Negative Lab Pro: Positive Copy',
          blocks: [
            { type: 'line', gen: 'w6-n6-say', html: 'After a conversion, the file in Lightroom is still the negative, so the sliders of Lightroom do not respond as they do on a positive. To edit in Lightroom, choose Make Copy in Negative Lab Pro; Apply then writes a positive copy. The edits of Negative Lab Pro are made on the original RAW negative, so a conversion can be edited again at any time without loss.' },
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
              'It tethers from almost all camera models from Canon, Nikon, Sony, Fujifilm, Leica and Phase One.',
            ] },
            { type: 'text', gen: 'w5-c2-text', paras: ['Raw processing turns the sensor data into an image. Capture One was first developed by Phase One, a Danish maker of medium-format digital backs.'] },
            { type: 'figure', src: 'c2-capture-one.jpg', alt: 'Capture One tethered to a camera, with the Camera tool and the last capture', caption: 'Capture One · tethered capture. Image: Capture One.' },
            { type: 'link', href: 'https://www.youtube.com/watch?v=I1ThgivAoB8', kicker: 'Tutorial · Capture One, 3:44', text: 'How to Use Tethered Capture', away: true },
          ],
        },
        {
          id: 's-c3',
          /* 01-10, his round: "Click for download Capture One and the link underneath would be better. Also use an online image of Capture One's website" */
          layout: 'stacked',
          title: 'Download Capture One',
          blocks: [
            { type: 'figure', src: 'c3-captureone-site.jpg', alt: 'The Capture One free-trial page', place: { row: 1, col: 1, w: 'full', fillH: true, rgrow: true } },
            { type: 'link', href: 'https://www.captureone.com/en/try-for-free?intent=trial-pro', kicker: 'Capture One Pro · 7-day free trial', text: 'Click to download Capture One', away: true, place: { row: 2, col: 1, w: 'full' } },
          ],
        },
        {
          id: 's-c3b',
          layout: 'stacked',
          title: 'Wireless Tethering: Mobile Apps',
          blocks: [
            { type: 'line', gen: 'w5-c3b-say', html: 'Your camera maker publishes a free app that connects a phone or tablet to the camera over Wi-Fi or Bluetooth, for remote control, live view and image transfer.', place: { row: 1, col: 1, w: 'full' } },
            /* his request, round 08-10 01:54: an online picture, at the left, in the middle */
            { type: 'figure', src: 'c3b-creators-app.jpg', alt: 'A Sony camera on a tripod and a phone showing its live view in Creators’ App', caption: 'Sony Creators’ App, remote shooting. Image: Sony.', place: { row: 2, col: 1, w: '1/3', v: 'middle' } },
            { type: 'plan', gen: 'w6-c3b-table',
              head: ["Maker", "App", "Note"],
              rows: [
                ["Canon", "Camera Connect", "Remote Live View Shooting"],
                ["Nikon", "SnapBridge", "NX MobileAir for FTP upload from pro bodies"],
                ["Sony", "Creators’ App", "Replaced Imaging Edge Mobile in 2023"],
                ["Fujifilm", "XApp", "Older bodies: Camera Remote"],
                ["Panasonic", "LUMIX Lab", "Older bodies: LUMIX Sync"],
                ["OM System", "OM Image Share (OI.Share)", "Live View and Remote Shutter modes"],
                ["Capture One mobile", "Capture One", "iPhone, iPad; wired, or wireless with Canon, Nikon, Sony, Fujifilm"]
              ], place: { row: 2, col: 2, w: '2/3' } },
          ],
        },
        {
          id: 's-c4',
          layout: 'stacked',
          title: 'Demo: Tethered Shooting',
          blocks: [
            /* 01-10, his note: "make a logical order yourself" - the session first, then the camera, then the shoot */
            { type: 'bul', gen: 'w6-c4-check-2', marker: 'check', big: true, items: [
              { check: '<span class="ck-n">Step 1</span>Capture One: File → New Session, named with the date first' },
              { check: '<span class="ck-n">Step 2</span>Check the Capture, Selects, Output and Trash folders' },
              { check: '<span class="ck-n">Step 3</span>Connect the cable to a data port on the computer' },
              { check: '<span class="ck-n">Step 4</span>Camera on, set to raw, Release without card switched on' },
              { check: '<span class="ck-n">Step 5</span>Confirm the camera appears in the Camera tool' },
              { check: '<span class="ck-n">Step 6</span>Set capture naming' },
              { check: '<span class="ck-n">Step 7</span>Open Live View' },
              { check: '<span class="ck-n">Step 8</span>Take a test frame and check it at 100 %' },
              { check: '<span class="ck-n">Step 9</span>Adjust, then set Next Capture Adjustments' },
              { check: '<span class="ck-n">Step 10</span>Rate the frames and move the selects' },
              { check: '<span class="ck-n">Step 11</span>Export to the Output folder' },
            ] },
          ],
        },
      ],
    },
  ],
};
