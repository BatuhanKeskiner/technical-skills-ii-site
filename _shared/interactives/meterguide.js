/* ============================================================
   LIGHT METER — THE GUIDE
   ------------------------------------------------------------
   Everything on a simple meter, said by pointing at it. A wall of
   text about a light meter is a wall of text; the same words
   attached to the button they are about are a guide. So the
   meter is drawn large, every part that does something carries a
   numbered dot, and the panel underneath answers whichever one
   you press.

   The positions are body-local, in the 539 x 925 the meter
   occupies inside its artwork, read off a magnified grid rather
   than guessed. `lightmeter.js` uses the same frame, so a dot
   here and a number there cannot drift apart.

   It is Batu's own L-308X, so the ranges quoted are that meter's
   real ones - and the last of them is the useful one: the
   aperture scale stops at f/90.9, which is why a pinhole at
   f/168 cannot be metered directly and has to be worked out.
   ============================================================ */

/* the meter's own frame, shared with lightmeter.js */
const MG_BODY = { x: 228, y: 38, w: 539, h: 925 };

const MG_PARTS = [
  {
    n: 1, x: 262, y: 82, r: 62,
    name: 'The white dome — the Lumisphere',
    lead: 'The most important part, and the most misunderstood.',
    body: [
      'A hemisphere of white plastic that collects light from everything in '
      + 'front of it at once. With it in place the meter reads INCIDENT light: '
      + 'the light falling ON the subject, not the light coming off it.',
      'Which is why a black coat and a white shirt in the same light give the '
      + 'same reading — and should. They are in the same light. A meter that '
      + 'read the subject would try to make both of them mid-grey and get both '
      + 'of them wrong.',
      'To use it: stand where the subject is, point the dome back at the '
      + 'camera, press the button. Not at the light — at the camera.',
    ],
  },
  {
    n: 2, x: 372, y: 108, r: 52,
    name: 'Sliding it across — reflected light, 40°',
    lead: 'The same meter, asking a different question.',
    body: [
      'Slide the dome to the right and it clicks out of the way, leaving a flat '
      + 'window that sees about 40 degrees. Now the meter reads REFLECTED '
      + 'light: what is coming off the subject. Stand at the camera and point '
      + 'it at the thing.',
      'But now the meter is guessing. It has to assume that whatever it is '
      + 'looking at averages to a mid-grey — 18% — because that is the only '
      + 'assumption a reflected reading can make. Point it at snow and it says '
      + 'the snow is grey, and you underexpose by two stops. Point it at a '
      + 'black cat and it says grey, and you overexpose.',
      'That is not a fault in the meter. It is the whole reason the Zone System '
      + 'exists: you read a thing, decide which zone you want it to land on, '
      + 'and move from the reading by that many stops.',
    ],
  },
  {
    n: 3, x: 125, y: 235, r: 42,
    name: 'MODE',
    lead: 'What kind of light it is waiting for.',
    body: [
      'Cycles between ambient — the sun icon — and two flash modes: flash on a '
      + 'sync cord, and cordless flash.',
      'In ambient it reads continuously, and the number changes as you move. In '
      + 'flash it waits, and holds whatever the flash gave it.',
    ],
  },
  {
    n: 4, x: 268, y: 400, r: 78,
    name: 'The screen',
    lead: 'Four things, and one of them almost nobody knows.',
    body: [
      'ISO top right. The shutter large on the left. The aperture large on the '
      + 'right — and the small digit beside the aperture is TENTHS OF A STOP. '
      + 'f/5.6 and a 3 means five point six plus three tenths, which is a '
      + 'third of the way to f/8.',
      'The T in the box at the left means the shutter is what you are setting '
      + 'and the aperture is what the meter is answering with. Press MODE '
      + 'the other way and it swaps: you set the aperture, it gives the '
      + 'shutter.',
    ],
  },
  {
    n: 5, x: 142, y: 556, r: 44,
    name: 'ISO',
    lead: 'The only thing on the meter that is about your material.',
    body: [
      'Hold it and press up or down. Everything else on the screen is worked '
      + 'out from this number, so it is the one to check before anything else — '
      + 'a meter left on yesterday’s film speed is a meter that lies '
      + 'confidently.',
      'This one runs from ISO 3 to 8000. Three matters to us: photographic '
      + 'paper is about ISO 3 to 12, and a paper negative in a pinhole camera '
      + 'lives down there.',
    ],
  },
  {
    n: 6, x: 512, y: 330, r: 40,
    name: 'The measuring button',
    lead: 'On the right-hand edge, under your thumb.',
    body: [
      'Where it is matters: you can hold the meter out at the subject, facing '
      + 'away from you, and still press it without turning the meter round. '
      + 'That is the whole ergonomics of an incident reading.',
    ],
  },
  {
    n: 7, x: 388, y: 866, r: 40,
    name: 'The sync terminal',
    lead: 'A socket for a flash cord.',
    body: [
      'Plug the flash in here and one press does two things: it fires the '
      + 'flash and it measures what the flash gave. Without the cord, the '
      + 'cordless mode waits for the flash to go off on its own.',
    ],
  },
  {
    n: 8, x: 125, y: 78, r: 38,
    name: 'Power',
    lead: 'And it does not forget.',
    body: [
      'The last reading is still there when it comes back on. Useful more often '
      + 'than it sounds: you meter, the meter sleeps, and the number you were '
      + 'about to write down has not gone.',
    ],
  },
];

/* THE RANGES, which are this meter's real ones and end in the useful fact */
const MG_RANGE = [
  ['Light', '0 to 19.9 EV at ISO 100'],
  ['Shutter', '1/8000 s to 60 s'],
  ['Aperture', 'f/1.0 to f/90.9'],
  ['Film speed', 'ISO 3 to 8000'],
];

/* IT IS PART OF THE LIGHT METER NOW, not a second instrument.
   IG-01 10, Q1: the same object on the stage - Batu's own L-308X, drawn from
   the same 539 x 925 frame - so the answer is extend, and the older listing
   retires. `embedded` mounts it inside lightmeter.js: no head of its own,
   because the instrument already has one, and its stage handed back so the
   host can put it away. Mounted alone it still works, which is how the pages
   that already carry it keep working. */
function mountMeterGuide(fig, opts) {
  const o = opts || {};
  const embedded = !!o.embedded;
  const p = palette(fig);
  const stage = el('div', 'stage wide mg-stage');
  /* embedded, the host says where it goes and owns the head and the full
     screen button; alone, it is the whole figure and owns both itself */
  if (embedded) (o.host || fig).append(stage);
  else {
    fig.prepend(stage);
    const head = el('div', 'ts-head');
    head.append(el('span', 'ts-name', 'The Meter, Part by Part'),
                el('span', 'ts-sub', 'sekonic l-308x · press a number'));
    fig.prepend(head);
  }

  const row = el('div', 'mg-row');
  const left = el('div', 'mg-pic');
  const view = canvas(left, draw);
  const cv = view.canvas;
  cv.tabIndex = 0;
  cv.setAttribute('role', 'application');
  cv.setAttribute('aria-label',
    'A light meter with eight numbered parts. Press a number to read what it does.');
  const panel = el('div', 'mg-panel');
  row.append(left, panel);
  stage.append(row);

  const art = new Image();
  art.onload = () => view.render();
  art.src = '../_shared/interactives/art/meter-ambient.png';

  let sel = 1, hot = null, box = null;

  function say() {
    panel.textContent = '';
    const part = MG_PARTS.find((q) => q.n === sel);
    const t = el('div', 'mg-t');
    t.append(el('span', 'mg-n', String(part.n)), el('span', null, part.name));
    panel.append(t);
    panel.append(el('p', 'mg-lead', part.lead));
    part.body.forEach((b) => panel.append(el('p', 'mg-b', b)));

    /* the ranges live under every part, because they are the thing you
       reach for when a reading looks wrong */
    const r = el('div', 'mg-range');
    MG_RANGE.forEach(([k, v]) => {
      const c = el('div', 'mg-rr');
      c.append(el('span', 'mg-rk', k), el('span', 'mg-rv', v));
      r.append(c);
    });
    panel.append(r);
    panel.append(el('p', 'mg-note',
      'The aperture scale stopping at f/90.9 is not a limitation to work '
      + 'around, it is the reason the pinhole calculator exists: a pinhole at '
      + 'f/168 is off the end of every meter made. You meter at an aperture '
      + 'the meter can say, and convert.'));
    view.render();
  }

  function hit(ev) {
    if (!box) return null;
    const r = cv.getBoundingClientRect();
    const x = (ev.clientX - r.left - box.x) / box.k;
    const y = (ev.clientY - r.top - box.y) / box.k;
    let best = null, bd = 1e9;
    MG_PARTS.forEach((q) => {
      const d = Math.hypot(x - q.x, y - q.y);
      if (d < q.r + 12 && d < bd) { bd = d; best = q.n; }
    });
    return best;
  }
  cv.addEventListener('pointermove', (e) => {
    const k = hit(e);
    cv.style.cursor = k ? 'pointer' : '';
    if (k !== hot) { hot = k; view.render(); }
  });
  cv.addEventListener('pointerleave', () => { hot = null; view.render(); });
  cv.addEventListener('pointerdown', (e) => {
    const k = hit(e);
    if (!k) return;
    e.preventDefault(); cv.focus();
    sel = k; say();
  });
  cv.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      sel = sel % MG_PARTS.length + 1; say(); e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      sel = (sel - 2 + MG_PARTS.length) % MG_PARTS.length + 1; say(); e.preventDefault();
    } else if (/^[1-8]$/.test(e.key)) { sel = +e.key; say(); e.preventDefault(); }
  });

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    if (!art.complete || !art.naturalWidth) return;
    const k = Math.min(w / MG_BODY.w, (h - 8) / MG_BODY.h);
    const bw = MG_BODY.w * k, bh = MG_BODY.h * k;
    const x = (w - bw) / 2, y = (h - bh) / 2;
    box = { x: x, y: y, k: k };
    ctx.drawImage(art, MG_BODY.x, MG_BODY.y, MG_BODY.w, MG_BODY.h, x, y, bw, bh);

    MG_PARTS.forEach((q) => {
      const cx = x + q.x * k, cy = y + q.y * k;
      const on = q.n === sel, near = q.n === hot;
      /* THE RING ROUND THE PART, so you can see there is something there
         before you have touched anything */
      ctx.save();
      ctx.strokeStyle = on ? 'rgba(255,214,0,0.95)'
                      : near ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.34)';
      ctx.lineWidth = on ? 2.4 : 1.4;
      ctx.beginPath(); ctx.arc(cx, cy, q.r * k, 0, Math.PI * 2); ctx.stroke();

      /* and the number, on a disc so it reads over the black body */
      const rr = Math.max(11, 15 * k);
      const nx = cx + q.r * k * 0.72, ny = cy - q.r * k * 0.72;
      ctx.beginPath(); ctx.arc(nx, ny, rr, 0, Math.PI * 2);
      ctx.fillStyle = on ? '#FFD600' : 'rgba(18,18,18,0.92)';
      ctx.fill();
      ctx.strokeStyle = on ? '#FFD600' : 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = on ? '#141414' : '#F2F2F0';
      ctx.font = Math.round(rr * 1.15) + 'px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(q.n), nx, ny + 0.5);
      ctx.restore();
    });
  }

  /* full screen from either view: the host's button lives on the host's
     stage, and that stage is put away while this one is up */
  fsButton(stage, fig);
  say();
  return { stage: stage, render: view.render, focus: () => cv.focus() };
}
