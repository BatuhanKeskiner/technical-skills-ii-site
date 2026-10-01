/* ============================================================
   LIGHT DIAGRAM — a plan of the studio, to scale
   ------------------------------------------------------------
   A grid seen from above. A subject, a camera, lights and the
   things that shape them are placed on it, moved, turned, and
   the set-up is read off the drawing: how far each light stands
   from the subject, and at what angle to the camera's axis.

   IT IS TO SCALE, AND THAT IS THE WHOLE INSTRUMENT. Every item
   carries its real footprint in metres (gear.js) and is drawn
   at that size on a grid of half-metre squares. Nothing can be
   stretched by hand: a 90 x 120 softbox is 1.2 m across because
   that is what a 90 x 120 softbox is, and wanting a bigger one
   means adding a bigger one from the bench. The moment a
   softbox can be resized the diagram stops meaning anything.

   IT DOES NOT RENDER THE PHOTOGRAPH. No exposure, no ratio, no
   picture of the result - a diagram that predicted a picture
   would teach that a diagram predicts a picture, which is the
   mistake. Specification: _notes/light-diagram/SPEC.md.

   THE BENCH IS ON THE STAGE, as the photogram's is. kit.js has
   no list or picker control and the strip holds four cells, so
   the forty-nine items wait in drawers down the left of the
   picture, one drawer per group, and a click lifts one onto the
   grid. That is a finding about the kit and it is reported in
   PROGRESS.md; it is not a control invented here.

   WHAT IS READ OFF IT, AND FROM WHERE. The camera axis runs from
   the first camera on the grid through the first subject. Every
   light says its distance to that subject in metres and its
   angle to that axis in degrees - 0 on the axis, 90 at the
   side, 180 behind the subject - which is the vocabulary the
   course teaches. A second camera or a second subject is drawn
   and moves like anything else; the readings follow the first.

   THE DIAGRAM IS ONE STRING. That is how a student hands a
   set-up in and how one goes into a brief:

     LD1;room=8x8;person-standing@4,4,180;cam-dslr@4,7,0,f50;
     softbox-90x120@2,6,45

   id, then centre x and y in metres from the room's top-left,
   then degrees, then a camera's focal length (f50) or a light's
   noted stop (s5.6), a camera's noted settings (a8 e1/125 i400)
   and its format (m2, an index into the body's formats), then `t`
   if it follows the subject. The same string
   is what the browser keeps across a reload, and a string that
   is not one of these is refused out loud and changes nothing.
   ============================================================ */

const LD_KEY = 'ts2:lightdiagram';       /* browser storage, nothing else */
const LD_TAG = 'LD1';

/* One place that knows the catalogue, so a missing gear.js is one
   message rather than forty-nine errors. */
function ldGear() {
  return (typeof LD_GEAR !== 'undefined' && LD_GEAR && LD_GEAR.groups) ? LD_GEAR : null;
}
function ldFind(gear, id) {
  if (!gear) return null;
  for (const g of gear.groups) for (const it of g.items) if (it.id === id) return { ...it, group: g.id };
  return null;
}

/* Where the item's edges reach when it is turned: the half-extents of the
   rotated footprint's bounding box, in metres. Used to keep it in the room. */
function ldExtent(it, r) {
  const a = r * Math.PI / 180, c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a));
  return { hx: it.w / 2 * c + it.d / 2 * s, hy: it.w / 2 * s + it.d / 2 * c };
}

/* The way an item faces, as a unit vector on the plan: r is degrees
   clockwise from the top of the drawing, so 0 faces up the page. */
function ldDir(r) {
  const a = r * Math.PI / 180;
  return [Math.sin(a), -Math.cos(a)];
}

/* A CAMERA'S ANGLE OF VIEW, from its focal length AND ITS FRAME. The same
   80 mm is a short telephoto on 35 mm and a normal lens on 6 x 4.5; 150 mm
   is normal on 4 x 5. So the catalogue carries each camera's frame - the
   long side of the image area in mm - and the horizontal angle is
   2·atan(frame/2 ÷ focal). A camera without a frame is taken as 36 mm.
   Batu's note, 08-09-2026. */
function ldFov(f, frame) {
  return 2 * Math.atan((frame || 36) / 2 / Math.max(1, f)) * 180 / Math.PI;
}
/* WHICH FORMAT THE CAMERA IS SET TO. A body that takes several backs or
   film sizes carries `formats`; the placed camera says which with `m`. The
   frame, the word beside the cone and the focal range all come from that. */
function ldFormat(def, it) {
  if (def && def.formats && def.formats.length) return def.formats[Math.min(def.formats.length - 1, Math.max(0, (it && it.m) || 0))];
  return def || {};
}
/* the focal lengths a format is used with; the slider and the parser both keep to it */
function ldRange(fmt) {
  return (fmt && fmt.range) ? fmt.range : [14, 200];
}

/* THE STOPS A LIGHT CAN BE NOTED AT, in thirds, f/1 to f/64. A note, not a
   model: the instrument still computes no exposure. A student meters the
   light at the subject and writes the reading on the light, the way a
   set-up is documented - key f/11, fill f/5.6. Batu's ask, 08-09-2026. */
const LD_STOPS = [1, 1.1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1,
                  8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32, 36, 40, 45, 51, 57, 64];
/* AND A CAMERA'S THREE SETTINGS, the same way: notes of what was set, in
   the order a camera prints them - aperture, shutter, ISO (IG-02 P3). The
   aperture ladder is LD_STOPS above; shutter in thirds from 30 s to 1/8000;
   ISO in thirds from 50 to 12800. */
const LD_SHUTTER = ['30', '25', '20', '15', '13', '10', '8', '6', '5', '4', '3.2', '2.5', '2', '1.6', '1.3', '1',
  '0.8', '0.6', '0.5', '0.4', '0.3', '1/4', '1/5', '1/6', '1/8', '1/10', '1/13', '1/15', '1/20', '1/25', '1/30',
  '1/40', '1/50', '1/60', '1/80', '1/100', '1/125', '1/160', '1/200', '1/250', '1/320', '1/400', '1/500', '1/640',
  '1/800', '1/1000', '1/1250', '1/1600', '1/2000', '1/2500', '1/3200', '1/4000', '1/8000'];
const LD_ISO = [50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500,
  3200, 4000, 5000, 6400, 8000, 10000, 12800];
/* WHAT A LIGHT IS FOR. The first thing written on a real diagram, and the
   vocabulary of the week: a note, stepped like the stop. */
const LD_ROLES = ['key', 'fill', 'rim', 'hair', 'background', 'kicker'];
/* A POST-IT: a note stuck on the plan itself, moved like anything else,
   with its own words. Not gear, so not in GEAR.json - a drawer the
   instrument adds to the bench. Different from the extra-notes field under
   the set-up sheet, which is about the whole set-up. Batu, 08-09. */
/* COLOUR: a gel on a light, or the tone of a curtain, a wall, a roll, a
   cove. Presets to start from, then R, G and B by steps. Stored as six hex
   digits (`c`) - a colour, not a tone from the icon table, because here the
   colour IS the information. Batu, 08-09. */
/* A PALETTE, NOT A CODE (Batu, 08-09): twenty-four swatches to press - the
   gels a studio has, the neutrals, the seamless colours that get bought. */
/* GELS, for lights - the ones a studio has; no light takes a black gel
   (Batu, 08-09). And PAPERS, for the surfaces a studio paints or buys. */
const LD_GELS = [
  ['none', null], ['CTO', 'ffb066'], ['½ CTO', 'ffd0a0'], ['CTB', '9cc4ff'], ['½ CTB', 'c8ddff'],
  ['red', 'e0201c'], ['orange', 'f07a1a'], ['amber', 'f0b323'], ['yellow', 'f2e21c'],
  ['green', '27a844'], ['cyan', '22b7c8'], ['blue', '2456d6'], ['magenta', 'd02c9a'],
];
const LD_PAPERS = [
  ['none', null], ['white', 'ffffff'], ['light grey', 'c8c8c8'], ['grey', '808080'], ['dark grey', '3a3a3a'], ['black', '0a0a0a'],
  ['cream', 'f5ecd7'], ['beige', 'd9c7a5'], ['sand', 'e3d3a3'], ['rust', 'b4462a'], ['olive', '6b7a3a'], ['teal', '1f6f73'],
  ['red', 'e0201c'], ['orange', 'f07a1a'], ['yellow', 'f2e21c'], ['green', '27a844'], ['cyan', '22b7c8'], ['blue', '2456d6'],
  ['navy', '1f2a5a'], ['magenta', 'd02c9a'], ['pink', 'f2a7c3'], ['lilac', 'b39ddb'], ['brown', '6b4a2b'], ['forest', '2f5d3a'],
];
const LD_ALL_COLOURS = LD_GELS.concat(LD_PAPERS);
function ldHex(rgb) { return rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function ldRgb(hex) { return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)); }
const LD_NOTES = { id: 'note', name: 'Notes', items: [{ id: 'postit', name: 'Post-it', w: 1.0, d: 1.0, stretch: true, about: 'A post-it. Type on it; it may sit outside the room; drag its ends to size it.' }] };
/* A LENGTH SET BY HAND, for the few things whose length is not a catalogue
   fact: a wall, a curtain, a post-it. `wl` on the item; the catalogue's own
   width is the default. Everything else keeps the rule: no resizing. */
function ldDef(gear, it) {
  const def = ldFind(gear, it.id);
  if (!def || !def.stretch || !it.wl) return def;
  return { ...def, w: it.wl, d: def.group === 'note' ? it.wl : def.d };
}
/* HOW BRIGHT, in whichever unit the light is set in: a metered f-stop, a
   guide number, the head's decimal power, or a fraction of full. Notes, all
   four; the instrument computes nothing between them. Batu, 08-09. */
const LD_GN = [8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32, 36, 40, 45, 51, 57, 64, 72, 80, 90, 100, 115, 128, 145, 160, 180, 200];
const LD_DEC = []; for (let v = 1; v <= 100; v++) LD_DEC.push(+(v / 10).toFixed(1));
const LD_FRAC = ['1/128', '1/64', '1/32', '1/16', '1/8', '1/4', '1/2', '1/1'];   /* 1/128 up to 1/1: + is more light, as on every ladder (Batu, 12-09: "fractionda bug var") */
const LD_UNITS = [
  { k: 's', name: 'f-stop', ladder: LD_STOPS, start: 8, text: (v) => 'f/' + v },
  { k: 'g', name: 'GN', ladder: LD_GN, start: 45, text: (v) => 'GN ' + v },
  { k: 'd', name: 'power', ladder: LD_DEC, start: 5, text: (v) => (+v).toFixed(1) },
  { k: 'q', name: 'fraction', ladder: LD_FRAC, start: '1/4', text: (v) => v },
];
function ldNearest(ladder, v) {
  let b = 0;
  ladder.forEach((q, i) => { if (Math.abs(Math.log(q / v)) < Math.abs(Math.log(ladder[b] / v))) b = i; });
  return ladder[b];
}
function ldShutterText(v) { return /^1\//.test(v) ? v : v + ' s'; }
function ldStopIndex(v) {
  let best = 0;
  LD_STOPS.forEach((q, i) => { if (Math.abs(Math.log(q / v)) < Math.abs(Math.log(LD_STOPS[best] / v))) best = i; });
  return best;
}

/* A SUBJECT'S ANGLE IS SAID FROM THE CAMERA'S SIDE. A subject usually faces
   down the plan, toward the camera, and that is its 0°; turned to the
   viewer's right it is "45° right", to the left "45° left", 180° is its back.
   Everything else says its plan angle, 0 up the page. The stored value is
   the plan angle either way. Batu, 08-09. */
function ldAngleText(def, r) {
  if (!def || def.group !== 'subject') return Math.round(r) + '°';
  if (!def.aim) return '';                       /* a table faces no way */
  const v = ((180 - Math.round(r)) % 360 + 540) % 360 - 180;
  if (v === 0) return '0° · facing the camera';
  if (Math.abs(v) === 180) return '180° · back to the camera';
  return Math.abs(v) + '° ' + (v > 0 ? 'right' : 'left');
}

function ldFmt(v) {
  return v.toFixed(2).replace(/\.?0+$/, '');
}

/* The diagram as one string, and back. Parsing is strict on purpose: the
   tag has to be there, every id has to be in the catalogue, every number has
   to be a number. Anything else returns null, and the caller says so. */
/* ONE ITEM CAN TRAVEL ALONE. With `single` the string carries the word
   `item` after the room, and a paste of it adds to the diagram instead of
   replacing it. Batu, 08-09: copy an object with ⌘C ⌘V. */
function ldSerialise(room, items, memo, single) {
  return [LD_TAG, 'room=' + room[0] + 'x' + room[1]].concat(single ? ['item'] : []).concat(memo ? ['note=' + encodeURIComponent(memo)] : []).concat(items.map((it) =>
    it.id + '@' + ldFmt(it.x) + ',' + ldFmt(it.y) + ',' + Math.round(it.r)
    + (it.f != null ? ',f' + Math.round(it.f) : '')
    + (it.s != null ? ',s' + it.s : '')
    + (it.g != null ? ',g' + it.g : '')
    + (it.d != null ? ',d' + it.d : '')
    + (it.q != null ? ',q' + it.q : '')
    + (it.k != null ? ',k' + it.k : '')
    + (it.a != null ? ',a' + it.a : '')
    + (it.e != null ? ',e' + it.e : '')
    + (it.i != null ? ',i' + it.i : '')
    + (it.m ? ',m' + it.m : '')
    + (it.v === false ? ',v0' : '')
    + (it.c ? ',c' + it.c : '')
    + (it.l ? ',l' + it.l : '')
    + (it.wl ? ',w' + it.wl : '')
    + (it.b ? ',b' + it.b : '')
    + (it.kd != null ? ',y' + it.kd : '')
    + (it.n != null ? ',n' + encodeURIComponent(it.n) : '')
    + (it.p === false ? ',p0' : '')
    + (it.gr ? ',h1' : '')
    + (it.no ? ',j' + it.no : '')
    + (it.t ? ',t' : ''))).join(';');
}
function ldParse(gear, room0, str) {
  if (typeof str !== 'string') return null;
  const parts = str.trim().split(';').map((s) => s.trim());
  if (parts[0] !== LD_TAG) return null;
  const items = [];
  let room = room0;
  const rmTok = parts.find((t) => /^room=/.test(t));
  if (rmTok) { const rm = /^room=(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/.exec(rmTok); if (rm) room = [Math.min(20, Math.max(2, +rm[1])), Math.min(20, Math.max(2, +rm[2]))]; }
  items.memo = '';
  ldParse.bad = null;
  for (const tok of parts.slice(1)) {
    if (!tok) continue;
    if (/^room=/.test(tok)) {
      const rm = /^room=(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/.exec(tok);
      if (rm) items.room = [Math.min(20, Math.max(2, +rm[1])), Math.min(20, Math.max(2, +rm[2]))];
      continue;
    }
    if (tok === 'item') { items.single = true; continue; }
    if (/^note=/.test(tok)) { try { items.memo = decodeURIComponent(tok.slice(5)); } catch (e) { return null; } continue; }
    /* THE HEAD IS FIXED, THE TAIL IS FREE. id@x,y,r first; after that the
       fields come in any order, each a letter and its value, and a hex may
       be typed in capitals. The one long regex read them in one order only,
       so a string edited by hand was "not a diagram" for a swapped pair
       (08-09, found while testing the export). */
    const head = /^(?<id>[a-z0-9-]+)@(?<x>-?\d+(?:\.\d+)?),(?<y>-?\d+(?:\.\d+)?),(?<r>-?\d+)(?<tail>(?:,[^,;]*)*)$/.exec(tok);
    if (!head) { ldParse.bad = tok; return null; }
    const G = { id: head.groups.id, x: head.groups.x, y: head.groups.y, r: head.groups.r };
    const FIELDS = { f: /^\d+$/, s: /^\d+(?:\.\d+)?$/, g: /^\d+$/, d: /^\d+(?:\.\d+)?$/, q: /^1\/\d+$/, k: /^\d+$/,
                     a: /^\d+(?:\.\d+)?$/, e: /^[\d./]+$/, i: /^\d+$/, m: /^\d+$/, v: /^\d$/, c: /^[0-9a-fA-F]{6}$/,
                     p: /^\d$/, h: /^[01]$/, j: /^\d+$/, l: /^\d+(?:\.\d+)?$/, w: /^\d+(?:\.\d+)?$/, b: /^\d+$/, y: /^[01]$/, n: /^[^,;]*$/ };
    for (const fld of head.groups.tail.split(',').slice(1)) {
      if (fld === '') continue;                       /* a stray comma is forgiven */
      if (fld === 't') { G.t = true; continue; }
      const key = fld[0], val = fld.slice(1);
      if (!FIELDS[key] || !FIELDS[key].test(val)) { ldParse.bad = tok; return null; }
      G[key === 'w' ? 'wl' : key === 'y' ? 'kind' : key] = key === 'c' ? val.toLowerCase() : val;
    }
    const def = ldFind(gear, G.id);
    if (!def) { ldParse.bad = tok; return null; }
    const it = { id: G.id, x: +G.x, y: +G.y, r: ((+G.r % 360) + 360) % 360 };
    if (def.fov && G.m && def.formats && +G.m < def.formats.length) it.m = +G.m;
    if (def.fov) { const fm = ldFormat(def, it); const R = ldRange(fm); it.f = G.f ? Math.min(R[1], Math.max(R[0], +G.f)) : (fm.focal || 50); }
    if (def.beam) {
      if (G.s && +G.s > 0) it.s = ldNearest(LD_STOPS, +G.s);
      if (G.g && +G.g > 0) it.g = ldNearest(LD_GN, +G.g);
      if (G.d && +G.d > 0) it.d = ldNearest(LD_DEC, +G.d);
      if (G.q && LD_FRAC.indexOf(G.q) >= 0) it.q = G.q;
      /* one unit at a time: the first given wins, the rest are dropped */
      let seen = false; ['s', 'g', 'd', 'q'].forEach((u) => { if (it[u] != null) { if (seen) delete it[u]; seen = true; } });
      if (G.j && +G.j > 0) it.no = +G.j;                    /* its number for life */
      if (G.k && +G.k < LD_ROLES.length) it.k = +G.k;
    }
    if (def.fov) {
      if (G.a && +G.a > 0) it.a = ldNearest(LD_STOPS, +G.a);
      if (G.e && LD_SHUTTER.indexOf(G.e) >= 0) it.e = G.e;
      if (G.i && +G.i > 0) it.i = ldNearest(LD_ISO, +G.i);
    }
    if (def.fov && G.v === '0') it.v = false;
    if (def.beam && G.p === '0') it.p = false;      /* its preview is off */
    if (def.grids && G.h === '1') it.gr = true;      /* a grid on the modifier */
    if (def.group === 'note') { try { it.n = G.n != null ? decodeURIComponent(G.n) : ''; } catch (e) { it.n = ''; } }
    if ((def.beam || def.tint) && G.c) it.c = G.c;
    if (def.sweep && G.l) it.l = Math.min(8, Math.max(0, +G.l));
    if (def.stretch && G.wl) it.wl = Math.min(8, Math.max(0.5, Math.round(+G.wl * 2) / 2));
    if (def.beam && G.kind) it.kd = +G.kind;
    if (def.id === 'barn-doors' && G.b) it.b = Math.min(120, Math.max(10, +G.b));
    if (G.t && def.aim && def.group !== 'subject') it.t = true;
    const e = ldExtent(ldDef(gear, it), it.r);
    if (def.group !== 'note') {             /* a post-it may sit outside the room */
      it.x = Math.min(room[0] - e.hx, Math.max(e.hx, it.x));
      it.y = Math.min(room[1] - e.hy, Math.max(e.hy, it.y));
    }
    items.push(it);
  }
  return items;
}

/* ============================================================
   THE ICONS - style C, illustrative, to ICONS.md
   ------------------------------------------------------------
   Every one of the forty-nine is an arrangement of the nine
   primitives and nothing else: face, taper, body, dish, ribs,
   blade, mesh, figure, beam (the beam is drawn by the diagram,
   not here). Flat tones from the token table, one stroke weight
   of 1.5 px whatever the zoom, sharp corners, no emoji.

   Drawn in the item's own frame: the origin at its centre, x
   across its width, y down its depth, and THE FRONT AT -y - the
   edge light leaves from, the way it faces. W and D are the
   footprint in pixels, so the drawing is at true size on the
   grid and fitted into a box on the bench; `detail` false drops
   the marks that would be under 4 px there (ICONS.md §6).
   ============================================================ */
const LD_ICON_DARK  = { body: '#C9CBC6', face: '#F4F5F0', back: '#7C807B', line: '#0A0C0B' };
const LD_ICON_PAPER = { body: '#3A3C39', face: '#FFFFFF', back: '#8A8D88', line: '#1A1C1B' };

function ldIcon(ctx, def, W, D, T, detail) {
  const id = def.id;
  const fam = (s) => id.indexOf(s) === 0;
  const lw = 1.5;
  ctx.save();
  ctx.lineWidth = lw; ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';
  const fs = (fill, stroke) => {
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  };
  const rect = (x, y, w, h, fill, stroke) => { ctx.beginPath(); ctx.rect(x, y, w, h); fs(fill, stroke); };
  const poly = (pts, fill, stroke) => {
    ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    ctx.closePath(); fs(fill, stroke);
  };
  const circle = (x, y, r, fill, stroke) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2); fs(fill, stroke); };
  const ellipse = (x, y, rx, ry, fill, stroke) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), 0, 0, Math.PI * 2); fs(fill, stroke); };
  const seg = (x1, y1, x2, y2, stroke, w) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = stroke; ctx.lineWidth = w || lw; ctx.stroke(); ctx.lineWidth = lw;
  };
  /* the nine, as helpers */
  const ft = Math.max(2, Math.min(6, D * 0.22));                 /* face thickness */
  const face = (w, y) => rect(-(w == null ? W : w) / 2, y == null ? -D / 2 : y, w == null ? W : w, ft, T.face, T.line);
  const taper = (back) => poly([[-W / 2, -D / 2 + ft], [W / 2, -D / 2 + ft], [W * back / 2, D / 2], [-W * back / 2, D / 2]], T.back, T.line);
  const blade = (tone, aimed) => {
    const h = Math.max(3, D);
    rect(-W / 2, -h / 2, W, h, tone, T.line);
    /* which side is the working side: a stripe along the front, in the
       other light tone, so a reflector turned away can be seen to be */
    if (aimed) rect(-W / 2, -h / 2, W, Math.max(1.5, h * 0.35), tone === T.face ? T.body : T.face, null);
  };
  const mesh = (tone) => {
    const h = Math.max(3, D);
    rect(-W / 2, -h / 2, W, h, tone, T.line);
    if (detail) for (let i = 1; i <= 4; i++) { const x = -W / 2 + W * i / 5; seg(x, -h / 2 - 2, x, h / 2 + 2, T.line); }
  };
  const figure = (bodyTone, headTone, nose) => {
    ellipse(0, 0, W / 2, D / 2, bodyTone, T.line);
    const hr = Math.min(W, D) * 0.3;
    circle(0, 0, hr, headTone, T.line);
    if (nose && detail) poly([[-hr * 0.4, -hr * 0.8], [hr * 0.4, -hr * 0.8], [0, -hr * 1.4]], headTone, T.line);
  };
  const legs = (n, r, stagger) => {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + Math.PI / n + i * 2 * Math.PI / n;
      const k = stagger ? 1 - 0.22 * i : 1;
      seg(0, 0, Math.cos(a) * r * k, Math.sin(a) * r * k, T.body, 2);
    }
  };
  const canopy = (chordY, apexY, fill) => {
    ctx.beginPath(); ctx.moveTo(-W / 2, chordY);
    ctx.quadraticCurveTo(0, 2 * apexY - chordY, W / 2, chordY);
    ctx.closePath(); fs(fill, T.line);
    /* the ribs: three chords from the pole to the canopy */
    if (detail) [-0.5, 0, 0.5].forEach((u) => {
      const x = u * W / 2, t = (x / (W / 2) + 1) / 2;
      const y = (1 - t) * (1 - t) * chordY + 2 * (1 - t) * t * (2 * apexY - chordY) + t * t * chordY;
      seg(0, apexY > chordY ? apexY : chordY, x, y, T.line);
    });
  };

  /* ---- subject ---- */
  if (id === 'person-standing' || id === 'head-shoulders') figure(T.body, T.face, true);
  else if (id === 'mannequin') figure(T.back, T.body, true);
  else if (id === 'person-seated') {
    rect(-W * 0.36, -D / 2, W * 0.72, D * 0.58, T.back, T.line);        /* knees, forward */
    ellipse(0, D * 0.24, W / 2, D * 0.24, T.body, T.line);              /* shoulders */
    circle(0, D * 0.24, Math.min(W, D * 0.48) * 0.3, T.face, T.line);   /* head */
  } else if (id === 'still-life-table') {
    rect(-W / 2, -D / 2, W, D, T.body, T.line);
    if (detail) rect(-W / 2 + 4, -D / 2 + 4, W - 8, D - 8, null, T.line);
  }
  /* ---- camera: a body and the lens bump that says where it looks ---- */
  else if (id === 'cam-view') {
    const st = Math.max(3, D * 0.12);
    seg(0, -D / 2 + st, 0, D / 2 - st, T.body, 2);                       /* the rail */
    if (detail) { seg(-W / 2 + 1, -D / 2 + st, -W * 0.3, D / 2 - st, T.body); seg(W / 2 - 1, -D / 2 + st, W * 0.3, D / 2 - st, T.body); }
    rect(-W / 2, -D / 2, W, st, T.body, T.line);                          /* front standard */
    rect(-W * 0.6 / 2, D / 2 - st, W * 0.6, st, T.body, T.line);          /* rear standard */
    rect(-W * 0.14, -D / 2 - ft * 0.6, W * 0.28, ft * 0.6 + 1, T.back, T.line);  /* the lens */
  } else if (id === 'cam-phone') {
    rect(-W / 2, -D / 2, W, D, T.body, T.line);
    if (detail) circle(-W / 2 + W * 0.15, 0, Math.max(1.2, D * 0.28), T.line, null);
  } else if (fam('cam-')) {
    const ld = Math.max(2, D * 0.3);
    rect(-W / 2, -D / 2 + ld, W, D - ld, T.body, T.line);
    if (id === 'cam-dslr') rect(W / 2 - W * 0.2, -D / 2 + ld, W * 0.2, D - ld, T.back, T.line);   /* grip */
    if (id === 'cam-medium' && detail) rect(-W * 0.22, D * 0.05, W * 0.44, D * 0.35, T.back, T.line);  /* hood */
    rect(-W * 0.28, -D / 2, W * 0.56, ld + 1, T.back, T.line);           /* lens */
  }
  /* ---- light ---- */
  else if (id === 'strobe-bare') { poly([[-W / 2, -D / 2 + ft], [W / 2, -D / 2 + ft], [W * 0.3, D / 2], [-W * 0.3, D / 2]], T.body, T.line); face(); }
  else if (fam('softbox-')) { taper(0.35); face(); }
  else if (fam('octabox-')) { taper(0.1); face(); }
  else if (fam('stripbox-')) { taper(0.65); face(); }
  else if (fam('beauty-dish-')) {
    circle(0, 0, Math.min(W, D) / 2, T.body, T.line);
    if (detail) circle(0, -D * 0.12, Math.min(W, D) * 0.16, T.back, T.line);   /* the deflector */
    face(W * 0.9);
  } else if (fam('ring-light')) {
    circle(0, 0, Math.min(W, D) / 2, T.body, T.line);
    circle(0, 0, Math.min(W, D) * 0.32, T.back, T.line);
    face(W * 0.9);
  } else if (fam('umbrella-shoot')) {
    /* the canopy bulges toward the subject; the flash fires through it */
    seg(0, 0, 0, D / 2, T.body, 2);
    rect(-W * 0.06, D / 2 - Math.max(3, D * 0.22), W * 0.12, Math.max(3, D * 0.22), T.body, T.line);
    canopy(D * 0.05, -D / 2, T.face);
  } else if (fam('umbrella-reflect') || fam('umbrella-deep')) {
    /* the bowl opens toward the subject; the flash stands in front, firing back into it */
    const chord = fam('umbrella-deep') ? -D / 2 + ft : -D * 0.3;
    canopy(chord, D / 2, T.body);
    seg(0, chord, 0, -D / 2, T.body, 2);
    rect(-W * 0.06, -D / 2, W * 0.12, Math.max(3, D * 0.2), T.body, T.line);
    rect(-W * 0.45, chord - ft / 2, W * 0.9, ft, T.face, T.line);
  } else if (fam('led-panel')) {
    const t = Math.max(3, D * 0.2);
    rect(-W * 0.3, -D / 2 + t, W * 0.6, D - t, T.body, T.line);           /* the yoke */
    rect(-W / 2, -D / 2, W, t, T.face, T.line);                            /* the panel */
  } else if (id === 'speedlight') { rect(-W / 2, -D / 2, W, D, T.body, T.line); face(); }
  else if (id === 'tungsten-fresnel') {
    rect(-W / 2, -D / 2, W, D, T.body, T.line); face();
    if (detail) [0, 1, 2].forEach((i) => seg(-W * 0.32, -D / 2 + ft + 3 + i * 3, W * 0.32, -D / 2 + ft + 3 + i * 3, T.line));
  }
  /* ---- shaping ---- */
  else if (id === 'barn-doors') {
    rect(-W * 0.35, -D * 0.1, W * 0.7, D * 0.6, T.body, T.line);          /* the ring */
    /* two leaves, opened to the spread: each stands at half the spread off
       the axis, hinged at the ring's front corners */
    const sp = (def.spread || 45) / 2 * Math.PI / 180, ll = Math.max(D * 0.55, 4);
    seg(-W * 0.35, -D * 0.1, -W * 0.35 - Math.sin(sp) * ll, -D * 0.1 - Math.cos(sp) * ll, T.back, 3);
    seg(W * 0.35, -D * 0.1, W * 0.35 + Math.sin(sp) * ll, -D * 0.1 - Math.cos(sp) * ll, T.back, 3);
    face(W * 0.7, -D * 0.1);
  } else if (id === 'grid') mesh(T.back);
  else if (id === 'snoot') { poly([[-W / 2, D / 2], [W / 2, D / 2], [W * 0.18, -D / 2 + ft], [-W * 0.18, -D / 2 + ft]], T.body, T.line); face(W * 0.36); }
  else if (id === 'gobo') {
    blade(T.back, false);
    if (detail) { const h = Math.max(3, D); seg(-W * 0.15, -h / 2 - 2, -W * 0.15, h / 2 + 2, T.face); seg(W * 0.15, -h / 2 - 2, W * 0.15, h / 2 + 2, T.face); }
  }
  else if (fam('flag-')) blade(T.back, true);
  else if (fam('scrim-')) mesh(T.body);
  else if (fam('diffusion-')) mesh(T.face);
  /* ---- bounce ---- */
  else if (fam('reflector-')) {
    /* A SHALLOW BOWL, its inside showing (Batu, 11-09): the rim along the
       front, the back bulging behind, the inside in the real colour so
       white, silver and gold are read off the plan */
    const tone = /white$/.test(id) ? '#F4F5F0' : /silver$/.test(id) ? '#C9CBC6' : '#C9A24A';
    const h = Math.max(4, W * 0.16);
    ctx.beginPath(); ctx.moveTo(-W / 2, -h / 2); ctx.quadraticCurveTo(0, h * 1.8, W / 2, -h / 2); ctx.closePath(); fs(T.back, T.line);
    ctx.beginPath(); ctx.moveTo(-W / 2 + 2, -h / 2 + 1.5); ctx.quadraticCurveTo(0, h * 1.25, W / 2 - 2, -h / 2 + 1.5); ctx.closePath(); fs(tone, null);
  }
  else if (id === 'v-flat') {
    const t = Math.max(3, W * 0.025);
    seg(0, D / 2, -W / 2, -D / 2, T.line, t + 2); seg(0, D / 2, W / 2, -D / 2, T.line, t + 2);
    seg(0, D / 2, -W / 2, -D / 2, T.face, t); seg(0, D / 2, W / 2, -D / 2, T.face, t);
  } else if (id === 'bounce-board') blade(T.face, true);
  else if (id === 'bounce-board-black') blade('#141615', true);   /* black on either ground: it is the one thing that is */
  /* ---- room ---- */
  else if (id === 'wall') rect(-W / 2, -D / 2, W, D, T.back, T.line);
  else if (id === 'curtain') mesh(T.back);
  else if (id === 'window') { rect(-W / 2, -D / 2, W, D, T.back, T.line); face(); if (detail) seg(0, -D / 2, 0, D / 2, T.line); }
  else if (id === 'doorway') {
    const s = W * 0.12;
    rect(-W / 2, -D / 2, s, D, T.back, T.line); rect(W / 2 - s, -D / 2, s, D, T.back, T.line);
    if (detail) { ctx.save(); ctx.setLineDash([3, 3]); seg(-W / 2 + s, 0, W / 2 - s, 0, T.body); ctx.restore(); }
  } else if (fam('backdrop-')) {
    rect(-W / 2, -D / 2 + ft, W, D - ft, T.back, T.line);                   /* the roll */
    rect(-W / 2, -D / 2, W, ft, T.face, T.line);                           /* the paper, dropped in front */
  } else if (id === 'cyclorama') {
    const t = Math.max(3, W * 0.05);
    rect(-W / 2, -D / 2, W, t, T.back, T.line); rect(-W / 2, -D / 2, t, D, T.back, T.line);
    if (detail) { ctx.beginPath(); ctx.arc(-W / 2 + t + W * 0.18, -D / 2 + t + D * 0.18, W * 0.18, Math.PI, Math.PI * 1.5); ctx.strokeStyle = T.body; ctx.stroke(); }
  }
  /* ---- support ---- */
  else if (id === 'light-stand') { legs(3, Math.min(W, D) / 2, false); circle(0, 0, Math.max(2, W * 0.05), T.body, T.line); }
  else if (id === 'c-stand') {
    legs(3, Math.min(W, D) / 2, true); circle(0, 0, Math.max(2, W * 0.05), T.body, T.line);
    if (detail) seg(0, 0, W * 0.45, -D * 0.25, T.back, 2);               /* the arm */
  } else if (id === 'boom') {
    /* the arm runs across the footprint; the head at one end, the weight at the other */
    rect(-W / 2, -D / 2, W, Math.max(3, D), T.body, T.line);
    rect(-W / 2, -Math.max(3, D) * 1.6, W * 0.06, Math.max(3, D) * 3.2, T.back, T.line);
    circle(W / 2 - W * 0.03, 0, Math.max(2.5, D * 1.4), T.body, T.line);
  } else if (id === 'tripod') {
    /* fat legs and a plate the size of a camera's foot: a photo tripod is
       tubes, not a light stand's rods (Batu, 11-09: "çok çok ince") */
    const t = Math.max(3, W * 0.055);
    for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + Math.PI / 3 + i * 2 * Math.PI / 3; seg(0, 0, Math.cos(a) * W / 2, Math.sin(a) * W / 2, T.body, t); }
    const pl = Math.max(6, W * 0.14);
    rect(-pl / 2, -pl / 2, pl, pl, T.body, T.line);
  } else if (id === 'studio-stand') {
    /* a column on a wheeled base: three spokes with a wheel at each end,
       the column at the centre, an arm out to the front */
    const t = Math.max(3, W * 0.06);
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + Math.PI / 3 + i * 2 * Math.PI / 3;
      seg(0, 0, Math.cos(a) * W * 0.44, Math.sin(a) * W * 0.44, T.body, t);
      circle(Math.cos(a) * W * 0.46, Math.sin(a) * W * 0.46, Math.max(2.5, W * 0.045), T.back, T.line);
    }
    circle(0, 0, Math.max(3, W * 0.08), T.body, T.line);
    if (detail) seg(0, 0, 0, -D * 0.3, T.back, Math.max(2, W * 0.04));
  }
  /* ---- a post-it: a square of paper with one corner turned ---- */
  else if (id === 'postit') {
    /* a post-it is paper, not gear: the one fixed colour on the plan, a
       very light yellow, with a small, pale turned corner (Batu, 08-09) */
    rect(-W / 2, -D / 2, W, D, '#FFF9CF', T.line);
    if (detail) { poly([[W / 2 - W * 0.13, D / 2], [W / 2, D / 2 - D * 0.13], [W / 2, D / 2]], '#F3E9A8', T.line); }
  }
  /* ---- anything the catalogue grows that has no drawing yet ---- */
  else { rect(-W / 2, -D / 2, W, D, T.body, T.line); if (def.aim) face(); }
  ctx.restore();
}

function mountLightDiagram(fig) {
  /* THE STAGE IS WHITE. A plan is a drawing on paper, and Batu asked for it
     on paper (08-09-2026): the figure takes the site's light palette, which
     lecture.css defines once for every instrument that wants it, and every
     tone below is read from it rather than fixed here. */
  /* AND IT CAN GO DARK AGAIN. The ground is a choice, kept in this browser:
     D swaps it, the palette is read again, and every tone follows. */
  let light = false;                 /* dark first (Batu, 08-09); a viewer's choice is kept */
  try { if (localStorage.getItem(LD_KEY + ':ground') === 'light') light = true; } catch (e) { /* private */ }
  fig.classList.add('ld');
  fig.classList.toggle('light', light);
  let p = palette(fig);
  const gear0 = ldGear();
  const gear = gear0 ? { ...gear0, groups: gear0.groups.concat([LD_NOTES]) } : null;
  /* SAID OUT LOUD, so the page check fails rather than a grid drawing
     quietly with an empty bench - which is exactly how a broken gear.js
     went unnoticed once on 08-09. */
  if (!gear) console.error('lightdiagram: gear.js did not load - the catalogue is empty');
  const room = gear ? gear.grid.room.slice() : [8, 8];   /* mutated in place when its edges are pulled */
  function setRoom(w, d) {
    room[0] = Math.min(20, Math.max(2, Math.round(w * 2) / 2));
    room[1] = Math.min(20, Math.max(2, Math.round(d * 2) / 2));
  }
  /* THE GRID HAS THREE SIZES AND CAN BE PUT AWAY. The catalogue's square is
     the default; the choice is the viewer's and is kept in this browser. It
     changes nothing about the diagram - a 1.2 m softbox is 1.2 m on any grid
     and on none - only what is counted against. Batu, 08-09. */
  const LD_GRIDS = [0.25, 0.5, 1, 0];
  let sq = 0.25;                       /* the finest, by default - Batu, 08-09 */
  try { const v = localStorage.getItem(LD_KEY + ':grid'); if (v !== null && LD_GRIDS.indexOf(+v) >= 0) sq = +v; } catch (e) { /* private */ }
  const nudgeStep = () => sq || 0.5;
  /* AND HOW STRONG IT IS DRAWN. A grid can be counted against or it can be
     a whisper under the set-up; the slider says which. Kept in this browser.
     Batu, 08-09. */
  let gridA = 0.2;                     /* a whisper by default - Batu, 08-09 */
  try { const v = parseFloat(localStorage.getItem(LD_KEY + ':gridalpha')); if (v >= 0 && v <= 1) gridA = v; } catch (e) { /* private */ }

  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  const caption = fig.querySelector('figcaption');
  fig.insertBefore(controls, caption);

  const head = el('div', 'ts-head');
  /* THE NAME IS "Light Diagram Creator" - Batu, 08-09-2026 05:13. It was
     shortened once by a Title Case pass; the rule is about case, not words. */
  head.append(el('span', 'ts-name', 'Light Diagram Creator'),
              el('span', 'ts-sub', 'plan view · to scale'));
  fig.prepend(head);

  /* ---- state ------------------------------------------------------------ */

  /* An item is {id, x, y, r} - centre in metres from the room's top-left
     corner, r in degrees clockwise from the top of the plan, 0 facing up.
     Cameras carry f, their focal length in millimetres. Nothing else: the
     size is the catalogue's and is looked up, never stored. */
  const state = {
    items: [],
    sel: -1,
    zoom: 1,
    pan: [room[0] / 2, room[1] / 2],  /* the room point at the view's centre */
    cones: false,                     /* every beam cone, on or off together */
    open: 'light',                    /* which drawer of the bench is open */
    hot: null,                        /* what the pointer is over */
    drag: null,
    rackScroll: 0,
    benchView: (() => { try { return localStorage.getItem(LD_KEY + ':bench') === 'list' ? 'list' : 'grid'; } catch (e) { return 'grid'; } })(),
    note: null,                       /* one line on the stage, briefly */
    memo: '',                         /* the student's own note, free text */
  };

  /* THE SUBJECT IS ALREADY THERE. A diagram starts with the thing being lit
     in the middle of the room, facing down the page - where the camera will
     usually stand - and everything else is placed around it. */
  function fresh() {
    state.items = [];
    if (ldFind(gear, 'person-standing')) {
      state.items.push({ id: 'person-standing', x: room[0] / 2, y: room[1] / 2, r: 180 });
    }
    state.sel = -1;
  }

  /* THE DIAGRAM SURVIVES A RELOAD, in this browser and nowhere else. */
  function load() {
    let s = null;
    try { s = localStorage.getItem(LD_KEY); } catch (e) { /* private window */ }
    const items = s ? ldParse(gear, room, s) : null;
    if (items) { if (items.room) setRoom(items.room[0], items.room[1]); state.items = items; state.memo = items.memo || ''; state.sel = -1; } else fresh();
  }
  function save() {
    try { localStorage.setItem(LD_KEY, ldSerialise(room, state.items, state.memo)); } catch (e) { /* private window */ }
  }
  load();

  const view = canvas(stage, draw);
  const cv = view.canvas;
  cv.tabIndex = 0;
  cv.setAttribute('role', 'application');
  cv.setAttribute('aria-label',
    'A plan of a studio on a half-metre grid. Pick gear from the bench on the '
    + 'left to add it, drag it to move it, and turn it by its handle.');
  /* THE VIEW BAR, top right of the stage: everything about how the room is
     looked at, and nothing about what is in it - zoom, grid opacity, grid
     size, the beams, the ground, full screen. Batu, 08-09: the panel below
     is for the selected object only. */
  const viewBar = el('div', 'viewbar');
  stage.append(viewBar);
  const fsBtn = fsButton(stage, fig);
  /* THE STAGE ENDS WHERE THE STRIP CAN STILL BE SEEN (audit F11): the
     stylesheet's height assumed 250 px of page above the stage; on its own
     page there are 336, and the strip sat below the fold at every size.
     The height is set from the stage's actual place, the strip's height
     and a margin; never under 560; the stylesheet's rule when full screen. */
  const fitStage = () => {
    if (document.fullscreenElement || fig.classList.contains('fs-on')) { stage.style.height = ''; return; }
    const top = stage.getBoundingClientRect().top + window.scrollY;
    const strip = fig.querySelector('.controls');
    const below = (strip ? strip.offsetHeight : 110) + 24;
    stage.style.height = Math.max(560, window.innerHeight - top - below) + 'px';
  };
  window.addEventListener('resize', fitStage);
  document.addEventListener('fullscreenchange', () => setTimeout(fitStage, 50));
  setTimeout(fitStage, 0);
  const gndBtn = groundButton(stage, fig, { key: LD_KEY + ':ground', onChange: () => {
    light = fig.classList.contains('light');
    p = palette(fig);
    retint();
    refresh();
  } });
  const conesBtn = el('button', 'fs cones');
  conesBtn.type = 'button';
  conesBtn.addEventListener('click', () => { if (hasBeams()) setCones(!state.cones); });
  const gridSizeBtn = el('button', 'fs gridsize');
  gridSizeBtn.type = 'button';
  gridSizeBtn.addEventListener('click', () => cycleGrid());
  /* THE ROOM IS EDITED ON PURPOSE. Its handles were always out and the walls
     moved under a stray drag; now a button on the view bar opens the room
     for editing and closes it again, and says which it will do next.
     Batu, 08-09. */
  state.roomEdit = false;
  const roomBtn = el('button', 'fs roomedit');
  roomBtn.type = 'button';
  roomBtn.addEventListener('click', () => { state.roomEdit = !state.roomEdit; refresh(); });

  /* ---- the strip ------------------------------------------------------- */

  /* ZOOM CHANGES HOW MUCH OF THE ROOM YOU SEE. It never changes the scale
     relationship between two things on it: at any zoom a 1.2 m softbox is
     still 2.4 squares wide. */
  /* ZOOM LIVES IN THE TOP ROW, beside Dark and Full screen - it is how the
     room is looked at, like they are, not a setting of the diagram. The
     strip keeps its three cells. Batu, 08-09. The slider is the kit's; it
     is built in a holder and carried up onto the stage. */
  const zoomHold = el('div');
  const zoomIn = slider(zoomHold, {
    label: 'Zoom', min: 1, max: 3, step: 0.1, value: 1,
    format: (v) => '×' + v.toFixed(1),
  });
  zoomIn.addEventListener('input', () => { state.zoom = +zoomIn.value; keep('zoom', state.zoom); view.render(); });
  const zoomBox = el('div', 'zoom top');
  zoomBox.append(zoomHold.querySelector('label'), zoomIn);
  function placeZoom() { /* the bar lays its children out; nothing to place */ }
  /* the grid's strength, in the view bar beside zoom */
  const gridHold = el('div');
  const gridIn = slider(gridHold, {
    label: 'Grid opacity', min: 0, max: 100, step: 5, value: Math.round(gridA * 100), unit: ' %',
  });
  const gridBox = el('div', 'zoom top');
  gridBox.append(gridHold.querySelector('label'), gridIn);
  viewBar.append(zoomBox, gridBox, gridSizeBtn, roomBtn, conesBtn, gndBtn, fsBtn);
  gridIn.addEventListener('input', () => {
    gridA = +gridIn.value / 100;
    try { localStorage.setItem(LD_KEY + ':gridalpha', String(gridA)); } catch (e) { /* private */ }
    view.render();
  });
  /* THE GRID IS A KEY. It was a row of four under Zoom and it made the strip
     tall; G steps 0.25 m, 0.5 m, 1 m, none, and the scale label in the
     corner says which. */
  function cycleGrid() {
    sq = LD_GRIDS[(LD_GRIDS.indexOf(sq) + 1) % LD_GRIDS.length];
    try { localStorage.setItem(LD_KEY + ':grid', String(sq)); } catch (e) { /* private */ }
    refresh();
  }

  /* THE FOCAL LENGTH OF THE SELECTED CAMERA, and dead when the selection is
     not a camera: a slider that moves nothing is not a control. */
  const focalIn = slider(controls, {
    label: 'Focal length', min: 14, max: 200, step: 1, value: 50, unit: ' mm',
  });
  const focalCtl = focalIn.parentElement;
  const focalLab = focalCtl.querySelector('label');
  focalIn.addEventListener('input', () => {
    const it = state.items[state.sel];
    if (it && it.f != null) { it.f = +focalIn.value; save(); view.render(); }
  });
  /* THE CELL IS THE SELECTED THING'S. Two columns wide, one fixed height,
     one block per kind of thing shown at a time: chips for choices,
     steppers for ladders, the palette in a single row. Rebuilt on 08-09
     after the stack of arrow rows it had grown into was called a
     nightmare, fairly. */
  focalCtl.classList.add('span2', 'ld-cell');
  const slot = el('div', 'ld-slot');
  focalIn.replaceWith(slot);
  const selected = () => state.items[state.sel];

  /* a row of named choices, one pressed */
  function chipRow(label, names, onPick) {
    const row = el('div', 'ld-row');
    if (label) row.append(el('span', 'ld-k', label));
    const box = el('div', 'chips');
    row.append(box);
    const api = { row: row, chips: [], box: box };
    api.build = (list) => {
      box.innerHTML = '';
      api.chips = list.map((n, i) => {
        const c = el('button', 'chip', n); c.type = 'button';
        c.addEventListener('click', () => onPick(i));
        box.append(c); return c;
      });
    };
    api.set = (i) => api.chips.forEach((c, k) => c.setAttribute('aria-pressed', String(k === i)));
    api.build(names);
    return api;
  }
  /* ◀ value ▶, with a small label or none */
  function stepper(label, onStep, big) {
    const row = el('div', 'ld-row ld-stepper' + (big ? ' big' : ''));
    if (label) row.append(el('span', 'ld-k', label));
    /* − and +: a stop, a shutter, an ISO is a quantity (kit C21; Batu, 11-09) */
    const down = el('button', 'st', '−'), val = el('span', big ? 'ts-big' : 'ld-v'), up = el('button', 'st', '+');
    [down, up].forEach((x) => { x.type = 'button'; });
    down.addEventListener('click', () => onStep(-1)); up.addEventListener('click', () => onStep(1));
    row.append(down, val, up);
    return { row: row, val: val, dead: (d, u) => { down.disabled = d; up.disabled = u; down.classList.toggle('off', d); up.classList.toggle('off', u); } };
  }

  /* ---- a light: intensity in a unit, role, kind ---- */
  state.unit = 0;
  function stepStop(d) {
    const it = selected();
    const def = it && ldFind(gear, it.id);
    if (it && it.f != null) { stepCam(CAM[0], d); return; }   /* − + on a camera step its aperture */
    if (!def || !def.beam) return;
    const u = LD_UNITS[state.unit];
    const cur = it[u.k];
    /* ONE UNIT AT A TIME (Batu, 11-09): a light's strength is an f-stop OR
       a guide number OR a power OR a fraction, never a stack of all four */
    const only = () => LD_UNITS.forEach((o) => { if (o !== u) delete it[o.k]; });
    if (cur == null) { it[u.k] = u.start; only(); refresh(); return; }
    const i = u.ladder.indexOf(cur) + d;
    if (i < 0) return;                                    /* the foot: nothing, not a clear */
    it[u.k] = u.ladder[Math.min(u.ladder.length - 1, i)]; only();
    refresh();
  }
  const lightTop = el('div', 'ld-line');
  const stopSt = stepper(null, (d) => stepStop(d), true);
  const unitCh = chipRow(null, LD_UNITS.map((u) => u.name), (i) => {
    const it = selected(), def = it && ldFind(gear, it.id);
    const u = LD_UNITS[i];
    if (!def || !def.beam) { state.unit = i; refresh(); return; }
    /* the pressed chip pressed again clears the light's value (audit F14) */
    if (i === state.unit && it[u.k] != null) { delete it[u.k]; refresh(); return; }
    /* ANOTHER UNIT RESTATES THE LIGHT IN IT, at that unit's start, and the
       old unit goes: nothing is computed between them (Batu, 08-09). It used
       to set the tool's unit only, and refresh() put the chip back on the
       light's own unit with "—" beside it, so GN, power and fraction looked
       dead on the site (Batu, 28-09: "power seçme ve fraction gibi
       özelliklerin tam çalışmadığını fark ettim"). */
    LD_UNITS.forEach((o) => { if (o !== u) delete it[o.k]; });
    if (it[u.k] == null) it[u.k] = u.start;
    state.unit = i; refresh();
  });
  lightTop.append(stopSt.row, unitCh.row);
  slot.append(focalIn, lightTop);
  const lightBlk = el('div', 'ld-blk');
  const roleCh = chipRow('ROLE', LD_ROLES, (i) => { const it = selected(); if (!it) return; if (it.k === i) delete it.k; else it.k = i; refresh(); });
  /* flash / continuous went on 11-09 ("ışıklardan continuous'ı kaldır");
     in its place the light's own preview switch, like the camera's angle */
  const prevCh = chipRow('PREVIEW', ['shown', 'hidden'], (i) => {
    const it = selected(), def = it && ldFind(gear, it.id);
    if (!def || !def.beam) return;
    if (i === 1) it.p = false; else delete it.p;
    refresh();
  });
  /* THREE ROWS AND NO MORE (S2, 11-09): the label beside the stepper, role
     with kind, the palette with the stand. One height in every state (C9)
     and under the strip's ceiling, both. */
  roleCh.row.append(prevCh.row.querySelector('.ld-k'), prevCh.box);
  lightBlk.append(roleCh.row);
  /* ---- on a stand: who carries whom, and the way apart ---- */
  const mateRow = el('div', 'ld-row ld-mate');
  const mateK = el('span', 'ld-k', 'ON'), mateName = el('span', 'ld-name', '');
  const mateBtn = el('button', 'chip', 'Detach'); mateBtn.type = 'button';
  mateBtn.addEventListener('click', () => { const it = selected(); if (it) detach(it); });
  mateRow.append(mateK, mateName, mateBtn);

  /* ---- a camera: format, angle of view, the triad ---- */
  const CAM = [
    { k: 'a', name: 'STOP', ladder: LD_STOPS, start: 8, text: (v) => 'f/' + v },
    { k: 'e', name: 'SHUTTER', ladder: LD_SHUTTER, start: '1/125', text: ldShutterText },
    { k: 'i', name: 'ISO', ladder: LD_ISO, start: 100, text: (v) => 'ISO ' + v },
  ];
  function stepCam(c, d) {
    const it = selected();
    if (!it || it.f == null) return;
    const cur = it[c.k];
    if (cur == null) { if (d > 0) { it[c.k] = c.start; refresh(); } return; }   /* − on nothing is nothing */
    const i = c.ladder.indexOf(cur) + d;
    if (i < 0) return;
    it[c.k] = c.ladder[Math.min(c.ladder.length - 1, i)];
    refresh();
  }
  const camBlk = el('div', 'ld-blk');
  const fmtCh = chipRow('FORMAT', [], (i) => {
    const it = selected(), def = it && ldFind(gear, it.id);
    if (!def || !def.formats || i === (it.m || 0)) return;
    /* THE LENS STAYS ON THE CAMERA. Changing the sensor with the same lens is
       the crop factor: the cone narrows from FF to APS-C to MFT. It used to
       swap in each format's normal lens, so nothing seemed to change and
       Batu read it as a rounding error. The focal is only clamped to the
       new format's range. */
    it.m = i;
    const R = ldRange(ldFormat(def, it));
    it.f = Math.min(R[1], Math.max(R[0], it.f));
    refresh();
  });
  const aovCh = chipRow('ANGLE', ['shown', 'hidden'], (i) => { const it = selected(); if (!it || it.f == null) return; if (i === 1) it.v = false; else delete it.v; refresh(); });
  const triad = el('div', 'ld-line');
  CAM.forEach((c) => { c.st = stepper(c.name, (d) => stepCam(c, d), false); triad.append(c.st.row); });
  fmtCh.row.append(aovCh.row.querySelector('.ld-k'), aovCh.box);
  camBlk.append(fmtCh.row, triad);

  /* ---- colour: gels for a light, papers for a surface ---- */
  const colourable = (it, def) => it && def && (def.beam || def.tint);
  const palBlk = el('div', 'ld-blk');
  const makePal = (list) => {
    const row = el('div', 'ld-pal');
    const sw = list.map((gl) => {
      const b = el('button', 'sw'); b.type = 'button'; b.title = gl[0]; b.setAttribute('aria-label', gl[0]);
      if (gl[1]) b.style.background = '#' + gl[1]; else b.classList.add('none');
      b.addEventListener('click', () => {
        const it = selected(), def = it && ldFind(gear, it.id);
        if (!colourable(it, def)) return;
        if (gl[1]) it.c = gl[1]; else delete it.c;
        refresh();
      });
      row.append(b); return b;
    });
    palBlk.append(row);
    return { row: row, sw: sw, set: (c) => sw.forEach((b, i) => b.setAttribute('aria-pressed', String(list[i][1] === (c || null)))) };
  };
  const gelPal = makePal(LD_GELS), paperPal = makePal(LD_PAPERS);
  palBlk.classList.add('ld-palrow');
  const gridCh = chipRow('GRID', ['none', 'grid'], (i) => {
    const it = selected(), def = it && ldFind(gear, it.id);
    if (!def || !def.grids) return;
    if (i === 1) it.gr = true; else delete it.gr;
    refresh();
  });
  gridCh.row.classList.add('ld-grid');
  palBlk.append(gridCh.row, mateRow);
  focalCtl.append(lightBlk, camBlk, palBlk);

  /* what the cell shows, for the thing selected */
  function updateCell(it, selDef, k) {
    const show = (node, on) => { node.style.display = on ? '' : 'none'; };
    show(focalIn, !!k.cam); show(lightTop, !!k.lit);
    const mate = it && mateOf(it);
    const grids = !!(it && selDef && selDef.grids);
    show(lightBlk, !!k.lit); show(camBlk, !!k.cam); show(palBlk, !!(k.colour || mate || grids));
    show(mateRow, !!mate); show(gridCh.row, grids);
    if (grids) gridCh.set(it.gr ? 1 : 0);
    if (mate) { mateK.textContent = selDef.group === 'support' ? 'CARRIES' : 'ON'; mateName.textContent = ldDef(gear, mate).name; }
    show(gelPal.row, !!k.lit); show(paperPal.row, !!(k.colour && !k.lit));
    if (k.lit) {
      const u = LD_UNITS[state.unit], has = it[u.k] != null;
      stopSt.val.textContent = has ? u.text(it[u.k]) : '—';
      stopSt.dead(!has || u.ladder.indexOf(it[u.k]) === 0, has && u.ladder.indexOf(it[u.k]) === u.ladder.length - 1);
      /* the pressed chip is the light's own unit, not the tool's last (audit F8) */
      const own = LD_UNITS.findIndex((o) => it[o.k] != null);
      if (own >= 0) state.unit = own;
      unitCh.set(state.unit);
      roleCh.set(it.k != null ? it.k : -1);
      prevCh.set(it.p === false ? 1 : 0);
      gelPal.set(it.c);
    }
    if (k.cam) {
      const fm = ldFormat(selDef, it);
      const names = selDef.formats ? selDef.formats.map((q) => q.name) : [fm.format || '35 mm'];
      if (fmtCh.chips.length !== names.length || fmtCh.chips.some((c, i) => c.textContent !== names[i])) fmtCh.build(names);
      fmtCh.set(selDef.formats ? (it.m || 0) : 0);
      fmtCh.chips.forEach((c) => c.classList.toggle('off', !selDef.formats));
      aovCh.set(it.v === false ? 1 : 0);
      CAM.forEach((c) => {
        const has = it[c.k] != null;
        c.st.val.textContent = has ? c.text(it[c.k]) : '—';
        c.st.dead(has && c.ladder.indexOf(it[c.k]) === 0, has && c.ladder.indexOf(it[c.k]) === c.ladder.length - 1);
      });
    }
    if (k.colour && !k.lit) paperPal.set(it.c);
  }

  /* WHAT LEAVES THE ROOM. Copy puts the diagram on the clipboard as one
     string; Paste takes one back; PNG draws it on paper for a brief or a
     printed sheet; Clear empties the grid. Each is dead when it has nothing
     to act on. */
  const acts = el('div', 'ctl ld-acts span2');   /* two columns: four words need the room (Batu: sıkışık) */
  acts.append(el('label', null, 'Diagram'));
  const actRow = el('div', 'states');
  /* SAVE AND LOAD, a file each way (Batu, 11-09: copy and paste meant
     nothing to him). ⌘C and ⌘V on the canvas still work and are printed. */
  const bTxt = el('button', 'st', 'Save');
  const bLoad = el('button', 'st', 'Load');
  const loadIn = document.createElement('input');
  loadIn.type = 'file'; loadIn.accept = '.txt,text/plain'; loadIn.hidden = true;
  loadIn.addEventListener('change', () => {
    const fl = loadIn.files && loadIn.files[0];
    if (!fl) return;
    fl.text().then((txt) => { pasteIn(txt.trim()); loadIn.value = ''; });
  });
  bLoad.addEventListener('click', () => loadIn.click());
  const bPng = el('button', 'st', 'Export PNG');
  const bClear = el('button', 'st', 'Clear');
  /* FOUR COMMANDS, WHICH IS THE CEILING (IG-01 06). Clear was the fifth, and
     it does not belong with the four that put the diagram somewhere else: it
     empties the grid, which is what Edit room does, so it goes to the bar on
     the stage where the things that act on the room already are. */
  [bTxt, bLoad, bPng].forEach((b) => { b.type = 'button'; actRow.append(b); });
  actRow.append(loadIn);
  bClear.classList.add('clear');          /* its own width in the bar (audit F2) */
  /* Clear stands beside Edit room in the bar on the stage, because both act on
     the room rather than on where the diagram goes. It is made here with the
     other four and seated there, after the bar exists. */
  bClear.type = 'button';
  bClear.className = 'fs';
  roomBtn.after(bClear);
  acts.append(actRow);
  controls.append(acts);


  /* THE NOTE. Free text in a box under the strip - what the numbers do not
     say: the gel, the reason, the thing to try next time. Kept in the string
     and printed on the sheet. Batu's ask, 08-09-2026. */
  /* UNDER THE SET-UP SHEET, on the stage: extra notes, where the list of
     the set-up ends. Under the strip it was below the fold; in the bench it
     was gone in full screen. It is placed after every draw, from where the
     sheet stopped. Batu, 08-09. */
  const MEMO_H = 0;
  const memoIn = noteRow(fig, {
    label: 'Extra notes', rows: 2, grow: true, value: state.memo, host: stage, cls: 'sheet',
    onChange: (v) => { state.memo = v; save(); view.render(); },
  });
  const memoBox = memoIn.closest('.readout');
  /* THE POST-IT'S WORDS ARE TYPED ON THE PAPER. A box laid over the selected
     post-it, turned as it is turned, in the size its words are drawn at;
     it takes the pointer only while it is being written in, so the paper
     can still be dragged. Click a selected post-it to write. Batu, 08-09. */
  const postEdit = el('textarea', 'ld-postedit');
  postEdit.spellcheck = false;
  postEdit.style.display = 'none';
  stage.append(postEdit);
  let postWriting = false;
  postEdit.addEventListener('input', () => { const it = state.items[state.sel]; if (it && it.n != null) { it.n = postEdit.value; save(); view.render(); } });
  postEdit.addEventListener('focus', () => { postWriting = true; postEdit.style.pointerEvents = 'auto'; view.render(); });
  postEdit.addEventListener('blur', () => { postWriting = false; postEdit.style.pointerEvents = 'none'; view.render(); });
  postEdit.addEventListener('keydown', (e) => { if (e.key === 'Escape') { postEdit.blur(); cv.focus({ preventScroll: true }); } e.stopPropagation(); });
  function placePost(w) {
    const it = state.items[state.sel], def = it && ldDef(gear, it);
    if (!def || def.group !== 'note' || !geo) { postEdit.style.display = 'none'; return; }
    const cr = cv.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    const k = cr.width / w;
    const [X, Y] = toPx(it.x, it.y);
    const pw = def.w * geo.S, pd = def.d * geo.S;
    const size = Math.max(8, pw / 7);
    postEdit.style.display = '';
    postEdit.style.left = (cr.left - sr.left + (X - pw / 2) * k) + 'px';
    postEdit.style.top = (cr.top - sr.top + (Y - pd / 2) * k) + 'px';
    postEdit.style.width = (pw * k) + 'px';
    postEdit.style.height = (pd * k) + 'px';
    postEdit.style.fontSize = (size * k) + 'px';
    postEdit.style.padding = (5 * k) + 'px';
    postEdit.style.transform = 'rotate(' + it.r + 'deg)';
    postEdit.style.color = T.line;
    if (postEdit.value !== (it.n || '')) postEdit.value = it.n || '';
  }
  function placeMemo(w, h) {
    if (!sheetEnd) { memoBox.style.display = 'none'; return; }
    /* stage pixels from canvas pixels: the canvas can be letterboxed and
       scaled in full screen */
    const cr = cv.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    const k = cr.width / w;
    memoBox.style.display = '';
    memoBox.style.left = (cr.left - sr.left + sheetEnd.x * k) + 'px';
    memoBox.style.width = (sheetEnd.w * k) + 'px';
    /* under the sheet, but never off the stage or over the key band: with a
       long sheet it stood 950 px down a 650 px stage (audit F4) */
    const boxH = memoBox.offsetHeight / k || 60;
    memoH = boxH;
    const top = Math.min(sheetEnd.y + 6, h - KEY_BAND - boxH - 8);
    memoBox.style.top = (cr.top - sr.top + Math.max(BAR_H + 30, top) * k) + 'px';
  }

  /* ---- geometry ---------------------------------------------------------- */

  let RACK_W = 232;                    /* the bench down the left; a thin strip when folded */
  const BENCH_W = 232, FOLD_W = 26;
  let sheetFold = false;               /* the sheet's bar folds too */
  let geo = null;                      /* how metres map to pixels, this frame */

  /* THE ROOM IS FITTED FIRST AND THE ZOOM MULTIPLIES IT. At zoom 1 the whole
     room stands in the picture with a margin; above that the view holds a
     window on the room, centred on `pan`, and the window is kept inside the
     walls so there is never a view of nothing. */
  /* THE KEYS OWN A BAND AT THE BOTTOM. The room was fitted to the whole
     stage and the two lines of keys sat on its bottom wall - Batu saw it. The
     diagram's area stops above that band. */
  const KEY_BAND = 44, BAR_H = 30;     /* the keys below, the view bar above */
  function fit(w, h) {
    /* WHILE THE ROOM IS BEING PULLED THE VIEW STANDS STILL. Refitting on
       every move slid the handle out from under the hand and the room ran
       away to its limit (Batu, 08-09). The frozen view is the one from the
       start of the pull, shifted so the world stays where it is. */
    const rd = state.drag && (state.drag.kind === 'roomW' || state.drag.kind === 'roomD') ? state.drag : null;
    if (rd && rd.geo0) return { ...rd.geo0, ox: rd.geo0.ox - rd.shiftX * rd.geo0.S, oy: rd.geo0.oy - rd.shiftY * rd.geo0.S };
    const area = { x: RACK_W, y: BAR_H, w: w - RACK_W, h: h - KEY_BAND - BAR_H };
    const pad = 30;                    /* room for the legend above the room */
    const S0 = Math.min((area.w - 2 * pad) / room[0], (area.h - 2 * pad) / room[1]);
    const S = S0 * state.zoom;
    const visW = area.w / S, visH = area.h / S;
    const cx = visW >= room[0] ? room[0] / 2
      : Math.min(room[0] - visW / 2, Math.max(visW / 2, state.pan[0]));
    const cy = visH >= room[1] ? room[1] / 2
      : Math.min(room[1] - visH / 2, Math.max(visH / 2, state.pan[1]));
    state.pan = [cx, cy];
    /* THE ROOM AND ITS SHEET ARE ONE BLOCK, CENTRED. When the whole room
       fits, the set-up sheet takes a band beside it and the two are centred
       together, so a full screen does not stand the room hard against the
       bench with half the wall empty (Batu, 08-09). When there is no room
       for a sheet, the room alone is centred. */
    /* THE SHEET IS A BAR OF ITS OWN WIDTH, pinned to the right edge, and the
       room is centred in what is left between the bench and the bar. A bar
       that took the whole remainder stood empty on a wide screen and looked
       like a panel with no job (Batu, 08-09, in capitals). */
    /* AND THE BAR STAYS AT ANY ZOOM (audit F5): a view choice does not
       remove a pinned bar. The room's view is centred in what is left. */
    const roomW0 = room[0] * S0;
    const sheetW = sheetFold ? FOLD_W : (area.w - 2 * pad - roomW0 >= 300 + 28 ? 300 : 0);
    const mid = area.x + (area.w - sheetW) / 2;
    let ox = mid - cx * S;
    if (visW >= room[0]) ox = mid - room[0] * S / 2;
    return {
      area: area, S: S, sheetW: sheetW,
      ox: ox,
      oy: area.y + area.h / 2 - cy * S,
    };
  }
  const toPx = (x, y) => [geo.ox + x * geo.S, geo.oy + y * geo.S];
  const toM = (X, Y) => [(X - geo.ox) / geo.S, (Y - geo.oy) / geo.S];

  function clampIn(it, def) {
    const e = ldExtent(def, it.r);
    if (def.group === 'note') {             /* a post-it goes where it is put, room or not */
      it.x = Math.min(room[0] + 6, Math.max(-6, it.x)); it.y = Math.min(room[1] + 6, Math.max(-6, it.y));
      /* but not under the bench or the sheet's bar, nor off the stage
         (audit F17): what the hand cannot reach is lost */
      if (geo && geo.S) {
        const S = geo.S;
        const x0 = (RACK_W + 8 - geo.ox) / S + e.hx, x1 = (geo.area.x + geo.area.w - (geo.sheetW || 0) - 8 - geo.ox) / S - e.hx;
        const y0 = (BAR_H + 8 - geo.oy) / S + e.hy, y1 = (geo.area.y + geo.area.h - 8 - geo.oy) / S - e.hy;
        if (x1 > x0) it.x = Math.min(x1, Math.max(x0, it.x));
        if (y1 > y0) it.y = Math.min(y1, Math.max(y0, it.y));
      }
      return;
    }
    it.x = Math.min(room[0] - e.hx, Math.max(e.hx, it.x));
    it.y = Math.min(room[1] - e.hy, Math.max(e.hy, it.y));
    /* a thing wider than the room can only stand in its middle */
    if (e.hx * 2 > room[0]) it.x = room[0] / 2;
    if (e.hy * 2 > room[1]) it.y = room[1] / 2;
  }

  /* the ends of a stretch item and the paper's edge of a roll, in pixels */
  const axisOf = (r) => { const a = r * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; };
  function endHandles(it, def) {
    if (!def.stretch) return null;
    const [X, Y] = toPx(it.x, it.y), u = axisOf(it.r), half = def.w / 2 * geo.S;
    return [[X - u[0] * half, Y - u[1] * half, -1], [X + u[0] * half, Y + u[1] * half, 1]];
  }
  function sweepHandle(it, def) {
    if (!def.sweep) return null;
    const [X, Y] = toPx(it.x, it.y), d = ldDir(it.r);
    const reach = (def.d / 2 + (it.l || 0)) * geo.S;
    return [X + d[0] * reach, Y + d[1] * reach];
  }
  /* THE ROOM'S EDGES ARE PULLED TOO. With nothing selected, a square on the
     right wall and one on the bottom wall set the room's width and depth;
     it need not be square. Batu, 08-09. */
  function roomHandles() {
    const [X1, Ym] = toPx(room[0], room[1] / 2), [Xm, Y1] = toPx(room[0] / 2, room[1]);
    return [[X1, Ym, 'roomW'], [Xm, Y1, 'roomD']];
  }
  function onRoomHandle(pt) {
    if (!state.roomEdit || !geo) return null;
    for (const h of roomHandles()) if (Math.hypot(pt.x - h[0], pt.y - h[1]) <= 9) return h[2];
    return null;
  }
  /* THE LEAF HANDLE on barn doors: at the left leaf's tip, on the ring's
     front corner, swung out by half the spread. Drag it and both leaves
     open or close together; the beam follows. Batu, 08-09. */
  function leafHandle(it, def) {
    if (def.id !== 'barn-doors') return null;
    const [X, Y] = toPx(it.x, it.y);
    const sp = (it.b || def.beam) / 2 * Math.PI / 180, a = it.r * Math.PI / 180;
    const hx0 = -def.w * 0.35 * geo.S, hy0 = -def.d * 0.1 * geo.S, ll = def.d * 0.55 * geo.S + 18;
    const lx = hx0 - Math.sin(sp) * ll, ly = hy0 - Math.cos(sp) * ll;
    return [X + lx * Math.cos(a) - ly * Math.sin(a), Y + lx * Math.sin(a) + ly * Math.cos(a)];
  }
  function onLeaf(pt) {
    const it = state.items[state.sel];
    if (!it || !geo) return false;
    const def = ldDef(gear, it);
    const h = def && leafHandle(it, def);
    return !!(h && Math.hypot(pt.x - h[0], pt.y - h[1]) <= 10);
  }
  function onEnd(pt) {
    const it = state.items[state.sel];
    if (!it || !geo) return null;
    const def = ldDef(gear, it);
    const ends = def && endHandles(it, def);
    if (ends) for (const e of ends) if (Math.hypot(pt.x - e[0], pt.y - e[1]) <= 9) return { kind: 'stretch', end: e[2] };
    const sh = def && sweepHandle(it, def);
    if (sh && Math.hypot(pt.x - sh[0], pt.y - sh[1]) <= 9) return { kind: 'sweep' };
    return null;
  }
  /* WHAT TURNS BY A HANDLE: anything that faces (aim), and a roll, a wall
     or a curtain too - a backdrop has a front, its paper, and had no handle
     at all because it was never marked aim. Batu, 08-09: "fon dönmüyor". */
  const turns = (def) => !!(def.aim || def.sweep || def.stretch);
  /* where the rotation handle sits, in pixels: past the front of the item */
  function handleAt(it, def) {
    const [X, Y] = toPx(it.x, it.y);
    const dir = ldDir(it.r);
    const reach = def.d / 2 * geo.S + 24;
    /* A ROLL TURNS FROM ITS BACK. In front of a backdrop lies its paper and
       the paper's own handle, and the turning handle sat under both - the
       roll "would not turn" (Batu, 08-09, twice). */
    const side = def.sweep ? -1 : 1;
    return [X + dir[0] * reach * side, Y + dir[1] * reach * side];
  }

  /* A LIGHT ON A STAND. Nothing is stored for it: a light and a stand
     whose centres coincide are one thing and move as one, a camera and a
     tripod the same. Dropped within 35 cm of a free stand, a light snaps
     onto it; Detach in the cell sets it half a metre aside. Batu, 08-09:
     "ışıkları ayaklara sabitlemenin bir yolu olmalı". */
  /* A GRID ON THE MODIFIER (Batu, 11-09): every modifier that takes a
     honeycomb or egg crate has it as a setting of its own; with it on, the
     spread is halved, forty degrees at most, and the name reads w/ GRID. */
  const spreadOf = (it, def) => it.b || (it.gr ? Math.min(def.beam * 0.5, 40) : def.beam);
  const nameOf = (it, def) => def.name + (it.gr ? ' w/ GRID' : '');
  /* and a boom sits on a stand: a rig of three - stand, boom, light - that
     moves as one (P 6, S §4, 12-09) */
  const CARRY = { light: ['light-stand', 'c-stand', 'boom'], camera: ['tripod', 'studio-stand'], boom: ['light-stand', 'c-stand'] };
  const carrierFor = (def) => def.id === 'boom' ? CARRY.boom : def.group === 'light' ? CARRY.light : def.group === 'camera' ? CARRY.camera : null;
  const carries = (standDef, def) => { const c = carrierFor(def); return !!(c && c.indexOf(standDef.id) >= 0); };
  /* WHERE A SUPPORT CARRIES ITS THING: its centre, unless the catalogue
     says otherwise - the studio stand mounts at the tip of its arm (Batu,
     11-09: "tripodun ucuna attach olur"). In metres, turned with it. */
  function attachOf(stand, def) {
    const a = (def && def.attach) || [0, 0];
    const t = stand.r * Math.PI / 180;
    return [stand.x + a[0] * Math.cos(t) - a[1] * Math.sin(t), stand.y + a[0] * Math.sin(t) + a[1] * Math.cos(t)];
  }
  function mateOf(it) {
    const def = ldDef(gear, it); if (!def) return null;
    return state.items.find((o) => {
      const d2 = ldDef(gear, o); if (!d2 || o === it) return false;
      if (def.group === 'support') {
        if (!carries(def, d2)) return false;
        const q = attachOf(it, def); return Math.hypot(o.x - q[0], o.y - q[1]) < 0.05;
      }
      if (!carries(d2, def)) return false;
      const q = attachOf(o, d2); return Math.hypot(it.x - q[0], it.y - q[1]) < 0.05;
    }) || null;
  }
  /* THE RIG: everything joined to an item by carrying, walked outward from
     it - a light on a boom on a stand is three things and one move. Each
     link says which way it goes, so a stand moved takes its boom and the
     boom its light, and a light moved drags the boom and the stand along. */
  function rigOf(it) {
    const seen = new Set([it]), edges = [], queue = [it];
    while (queue.length) {
      const a = queue.shift(), ad = ldDef(gear, a); if (!ad) continue;
      state.items.forEach((b) => {
        if (seen.has(b)) return;
        const bd = ldDef(gear, b); if (!bd) return;
        let role = null;
        if (carries(ad, bd)) { const q = attachOf(a, ad); if (Math.hypot(b.x - q[0], b.y - q[1]) < 0.05) role = 'carrier'; }
        if (!role && carries(bd, ad)) { const q = attachOf(b, bd); if (Math.hypot(a.x - q[0], a.y - q[1]) < 0.05) role = 'carried'; }
        if (role) { seen.add(b); edges.push([a, b, role]); queue.push(b); }
      });
    }
    return edges;
  }
  /* after one of a pair moved or turned, the other goes where it belongs */
  function settle(it, m) {
    const def = ldDef(gear, it), md = ldDef(gear, m);
    if (carries(def, md)) { const q = attachOf(it, def); m.x = q[0]; m.y = q[1]; }
    else { const q = attachOf(m, md); m.x += it.x - q[0]; m.y += it.y - q[1]; }
  }
  function settleRig(edges) { edges.forEach((e) => settle(e[0], e[1])); }
  function perch(it) {                 /* at a drop: onto the nearest free partner in reach */
    const def = ldDef(gear, it); if (!def) return false;
    let best = null, bd = 0.35;
    state.items.forEach((o) => {
      const d2 = ldDef(gear, o); if (!d2 || o === it || rigOf(it).some((e) => e[1] === o)) return;
      /* a mount already taken is no mount; a thing already carried is not free */
      if (carries(def, d2) && state.items.some((z) => z !== it && z !== o && carries(def, ldDef(gear, z) || {}) && Math.hypot(z.x - attachOf(it, def)[0], z.y - attachOf(it, def)[1]) < 0.05)) return;
      if (carries(d2, def) && state.items.some((z) => z !== it && z !== o && carries(d2, ldDef(gear, z) || {}) && Math.hypot(z.x - attachOf(o, d2)[0], z.y - attachOf(o, d2)[1]) < 0.05)) return;
      /* a mount of mine to a thing, or a thing of mine to a mount - a boom is both */
      let dd = Infinity;
      if (carries(def, d2)) { const q = attachOf(it, def); dd = Math.hypot(o.x - q[0], o.y - q[1]); }
      else if (carries(d2, def)) { const q = attachOf(o, d2); dd = Math.hypot(q[0] - it.x, q[1] - it.y); }
      if (dd < bd) { best = o; bd = dd; }
    });
    if (!best) return false;
    const bestDef = ldDef(gear, best);
    if (carries(def, bestDef)) { const q = attachOf(it, def); it.x += best.x - q[0]; it.y += best.y - q[1]; }
    else { const q = attachOf(best, bestDef); it.x = q[0]; it.y = q[1]; }
    const stand = carries(def, bestDef) ? def : bestDef;
    const thing = carries(def, bestDef) ? bestDef : def;
    say(thing.name + ' on the ' + stand.name.toLowerCase());
    return true;
  }
  function detach(it) {
    const m = mateOf(it); if (!m) return;
    const def = ldDef(gear, it);
    const carried = def.group === 'support' ? m : it;      /* the light steps aside; the stand stays */
    carried.x += 0.5; clampIn(carried, ldDef(gear, carried));
    if (mateOf(carried)) { carried.x -= 1; clampIn(carried, ldDef(gear, carried)); }
    say('detached'); refresh();
  }

  /* WHAT LIES ON WHAT. A stand is under its light and the room is under
     everything, whatever order they were added in. */
  const Z = { room: 0, support: 1, subject: 2, bounce: 3, shaping: 4, light: 5, camera: 6, note: 7 };
  /* a table or a desk is a surface: under every other subject, so a laptop
     put on it is drawn on it and picked before it (Batu, 12-09) */
  const zOf = (it) => { const d = ldDef(gear, it) || {}; return (d.id === 'still-life-table' || d.id === 'desk') ? 1.5 : (Z[d.group] || 0); };
  function ordered() {
    return state.items.map((it, i) => ({ i: i, z: zOf(it) }))
      .sort((a, b) => a.z - b.z || a.i - b.i).map((q) => q.i);
  }
  /* THE READING: metres to the subject, degrees off the camera axis, and
     which side - the camera's left or right - because 47° alone does not
     say where the light stood. */
  function ldReading(it, sub, cam) {
    const dist = Math.hypot(it.x - sub.it.x, it.y - sub.it.y);
    let text = dist.toFixed(1) + ' m';
    if (cam && cam.it !== it) {
      const a1 = Math.atan2(cam.it.y - sub.it.y, cam.it.x - sub.it.x);
      const a2 = Math.atan2(it.y - sub.it.y, it.x - sub.it.x);
      let ang = Math.abs((a2 - a1) * 180 / Math.PI) % 360;
      if (ang > 180) ang = 360 - ang;
      const fx = sub.it.x - cam.it.x, fy = sub.it.y - cam.it.y;   /* the camera looks this way */
      const dot = (it.x - sub.it.x) * fy - (it.y - sub.it.y) * fx; /* against the camera's left */
      const side = ang < 3 || ang > 177 ? '' : (dot > 0 ? ' left' : ' right');
      text += ' · ' + Math.round(ang) + '°' + side;
    }
    return text;
  }
  /* the first of a group on the grid, which is the one the readings follow */
  /* THE SUBJECT THE READINGS ARE TAKEN TO is a person before a surface: a
     desk put down first made every light measure to the desk (Batu, 12-09:
     "ışığın neden masayla mesafesi ölçülüyor?"). A table or a desk is the
     subject only when nothing else is. */
  const isSurface = (def) => def.id === 'still-life-table' || def.id === 'desk';
  function first(group) {
    let fallback = null;
    for (let i = 0; i < state.items.length; i++) {
      const def = ldDef(gear, state.items[i]);
      if (!def || def.group !== group) continue;
      const hit = { it: state.items[i], def: def, i: i };
      if (group === 'subject' && isSurface(def)) { if (!fallback) fallback = hit; continue; }
      return hit;
    }
    return fallback;
  }

  /* ---- adding, removing, moving ---------------------------------------- */

  /* Clicking a bench item adds one to the middle of the view, selected. If
     that spot is already taken it steps down and right a square at a time,
     so ten strobes added in a row are ten strobes and not one. Anything
     with a direction is turned to face the subject as it lands, because
     that is where a light is pointed before anything else is decided. */
  /* TURN A THING TO FACE THE SUBJECT. Used once when it lands, and every
     time anything moves for an item that follows. */
  function aimAt(it, def, sub) {
    if (!def || !def.aim || def.group === 'subject' || !sub || sub.it === it) return false;
    if (Math.hypot(sub.it.x - it.x, sub.it.y - it.y) < 0.05) return false;
    it.r = (Math.round(Math.atan2(sub.it.x - it.x, -(sub.it.y - it.y)) * 180 / Math.PI) + 360) % 360;
    clampIn(it, def);
    return true;
  }
  /* A LIGHT CAN FOLLOW THE SUBJECT. With `t` set it is re-aimed whenever
     it or the subject moves - drag the subject across the room and every
     light that follows swings with it. Turning it by hand releases it,
     because a hand on the handle is a decision. Batu's ask, 08-09-2026. */
  function follow() {
    const sub = first('subject');
    state.items.forEach((it) => { if (it.t) { if (!aimAt(it, ldDef(gear, it), sub)) it.t = false; } });
  }

  function add(id) {
    const def = ldFind(gear, id);
    if (!def) return;
    /* a subject comes in facing down the page - toward where the camera
       stands (Batu, 11-09) */
    const it = { id: id, x: state.pan[0], y: state.pan[1], r: def.group === 'subject' ? 180 : 0 };
    if (def.fov) it.f = def.focal || 50;
    if (def.group === 'note') it.n = '';
    for (let n = 0; n < 12; n++) {
      const taken = state.items.some((o) => Math.hypot(o.x - it.x, o.y - it.y) < 0.3);
      if (!taken) break;
      it.x += 0.5; it.y += 0.5;
    }
    clampIn(it, def);
    aimAt(it, def, first('subject'));
    state.items.push(it);
    state.sel = state.items.length - 1;
    refresh();
  }

  function remove(i) {
    if (i < 0 || i >= state.items.length) return;
    state.items.splice(i, 1);
    state.sel = -1;
    refresh();
  }

  function nudge(dx, dy) {
    const it = state.items[state.sel];
    if (!it) return;
    const rig = rigOf(it);
    it.x += dx; it.y += dy;
    clampIn(it, ldDef(gear, it));
    settleRig(rig);
    refresh();
  }

  function turn(by) {
    const it = state.items[state.sel];
    if (!it) return;
    it.t = false;
    const rig = rigOf(it);
    it.r = ((Math.round(it.r / 15) * 15 + by) % 360 + 360) % 360;
    clampIn(it, ldDef(gear, it));
    settleRig(rig);                       /* a stand or a boom turned takes its things round with it */
    refresh();
  }

  /* ---- out and back ------------------------------------------------------ */

  let noteTimer = null;
  /* what the viewer set, kept in this browser (audit GAP 5) */
  function keep(k, v) { try { localStorage.setItem(LD_KEY + ':' + k, String(v)); } catch (e) { /* private */ } }
  function kept(k) { try { return localStorage.getItem(LD_KEY + ':' + k); } catch (e) { return null; } }
  function say(text, bad) {
    state.note = { text: text, bad: !!bad };
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => { state.note = null; view.render(); }, bad ? 3200 : 2200);
    view.render();
  }

  /* the selected item alone, or the whole diagram when nothing is selected */
  function copyText() {
    const it = state.items[state.sel];
    return it ? ldSerialise(room, [it], '', true) : ldSerialise(room, state.items, state.memo);
  }
  function copyNote() {
    const it = state.items[state.sel];
    const n = state.items.length;
    return it ? 'copied · ' + ldDef(gear, it).name : 'copied · the diagram, ' + n + (n === 1 ? ' item' : ' items');
  }
  function copyOut() {
    const s = copyText();
    const done = () => say(copyNote());
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s).then(done, () => say('the browser would not copy — press ⌘C on the diagram', true));
    } else say('the browser would not copy — press ⌘C on the diagram', true);
  }
  /* A BAD PASTE FAILS OUT LOUD AND CHANGES NOTHING. */
  function pasteIn(s) {
    const items = ldParse(gear, room, s);
    if (!items) { say('that is not a diagram — nothing changed' + (ldParse.bad ? ' · "' + String(ldParse.bad).slice(0, 32) + '"' : ''), true); return; }
    if (items.single && items.length) {
      /* an item comes in beside where it was, and is the selection */
      items.forEach((it) => { it.x += 0.5; it.y += 0.5; clampIn(it, ldDef(gear, it)); state.items.push(it); });
      state.sel = state.items.length - 1;
      refresh();
      say('pasted · ' + ldDef(gear, items[items.length - 1]).name);
      return;
    }
    if (items.room) setRoom(items.room[0], items.room[1]);
    state.items = items; state.memo = items.memo || ''; state.sel = -1;
    refresh();
    say('pasted · ' + items.length + (items.length === 1 ? ' item' : ' items'));
  }
  function pasteFromClipboard() {
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(pasteIn, () => say('the browser would not read the clipboard — press ⌘V on the diagram', true));
    } else say('the browser would not read the clipboard — press ⌘V on the diagram', true);
  }
  bClear.addEventListener('click', () => { if (state.items.length || state.memo) { state.items = []; state.memo = ''; state.sel = -1; refresh(); } });
  bPng.addEventListener('click', () => exportPng());
  /* THE STRING AS A FILE, for a brief or a hand-in that is not a clipboard */
  bTxt.addEventListener('click', () => {
    if (!state.items.length) return;
    const a = document.createElement('a');
    a.download = 'light-diagram.txt';
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(ldSerialise(room, state.items, state.memo));
    document.body.append(a); a.click(); a.remove();
    say('saved · light-diagram.txt');
  });
  /* ⌘C and ⌘V on the canvas itself, which needs no permission from anybody */
  cv.addEventListener('copy', (e) => {
    if (!e.clipboardData) return;
    e.clipboardData.setData('text/plain', copyText());
    e.preventDefault();
    say(copyNote());
  });
  cv.addEventListener('paste', (e) => {
    if (!e.clipboardData) return;
    e.preventDefault();
    pasteIn(e.clipboardData.getData('text/plain'));
  });

  /* ---- pointer ----------------------------------------------------------- */

  let rows = [];                       /* what the bench drew, for hit-testing */
  function at(ev) {
    const r = cv.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  }
  function rowAt(pt) {
    if (pt.x > RACK_W) return null;
    for (const q of rows) if (pt.y >= q.y && pt.y < q.y + q.h && (q.x == null || (pt.x >= q.x && pt.x < q.x + q.w))) return q;
    return null;
  }
  function onHandle(pt) {
    const it = state.items[state.sel];
    if (!it || !geo) return false;
    const def = ldDef(gear, it);
    if (!def || !turns(def) || it.t) return false;
    const [hx, hy] = handleAt(it, def);
    return Math.hypot(pt.x - hx, pt.y - hy) <= 11;
  }
  /* WHAT IS UNDER THE POINTER ON THE GRID. The selected item first, then
     from the top of the stack down so the thing drawn last is the thing you
     grab, and with a floor on the hit box so a phone - 8 by 2 centimetres -
     can be picked up. */
  function itemAt(pt) {
    if (!geo || pt.x < RACK_W) return -1;
    const m = toM(pt.x, pt.y);
    const order = ordered().reverse().filter((k) => k !== state.sel);
    /* the selected thing first - unless it is a stand, which would then
       swallow every click on the light or camera it carries (Batu, 11-09) */
    if (state.sel >= 0 && (ldDef(gear, state.items[state.sel]) || {}).group !== 'support') order.unshift(state.sel);
    for (const k of order) {
      const it = state.items[k], def = ldDef(gear, it);
      if (!def) continue;
      const a = -it.r * Math.PI / 180;
      const dx = m[0] - it.x, dy = m[1] - it.y;
      const lx = dx * Math.cos(a) - dy * Math.sin(a);
      const ly = dx * Math.sin(a) + dy * Math.cos(a);
      const hx = Math.max(def.w / 2, 7 / geo.S), hy = Math.max(def.d / 2, 7 / geo.S);
      if (Math.abs(lx) <= hx && Math.abs(ly) <= hy) return k;
      if (def.sweep && it.l && Math.abs(lx) <= hx && ly < -def.d / 2 && ly >= -def.d / 2 - it.l) return k;
    }
    return -1;
  }

  cv.addEventListener('pointerdown', (e) => {
    if (document.body.classList.contains('design')) return;
    const pt = at(e);
    e.preventDefault(); cv.focus({ preventScroll: true });
    if (barRow && pt.x >= barRow.x && pt.x <= barRow.x + barRow.w && pt.y >= barRow.y && pt.y < barRow.y + barRow.h) {
      sheetFold = !sheetFold; keep('sheet', sheetFold ? 1 : 0); state.hot = null; view.render(); return;
    }
    const row = rowAt(pt);
    if (row) {
      if (row.kind === 'view') { state.benchView = state.benchView === 'list' ? 'grid' : 'list'; state.rackScroll = 0; try { localStorage.setItem(LD_KEY + ':bench', state.benchView); } catch (e2) { /* private */ } view.render(); }
      else if (row.kind === 'fold') { RACK_W = RACK_W === FOLD_W ? BENCH_W : FOLD_W; keep('bench-fold', RACK_W === FOLD_W ? 1 : 0); state.hot = null; view.render(); }
      else if (row.kind === 'group') { state.open = state.open === row.id ? null : row.id; state.rackScroll = 0; view.render(); }
      else add(row.id);
      return;
    }
    const rh = onRoomHandle(pt);
    if (rh) {
      state.drag = { kind: rh, geo0: { ...geo, area: { ...geo.area } }, room0: room.slice(), shiftX: 0, shiftY: 0,
                     pos0: state.items.map((it) => [it.x, it.y]),
                     pairs: state.items.map((it) => [it, mateOf(it)]).filter((q) => q[1] && (ldDef(gear, q[0]) || {}).group === 'support') };
      cv.setPointerCapture(e.pointerId);
      cv.style.cursor = 'grabbing';
      view.render();
      return;
    }
    if (onLeaf(pt)) {
      state.drag = { kind: 'leaf', i: state.sel };
      cv.setPointerCapture(e.pointerId);
      cv.style.cursor = 'grabbing';
      view.render();
      return;
    }
    const eh = onEnd(pt);
    if (eh) {
      const it = state.items[state.sel], def = ldDef(gear, it), u = axisOf(it.r);
      state.drag = eh.kind === 'stretch'
        ? { kind: 'stretch', i: state.sel, end: eh.end, far: [it.x - eh.end * u[0] * def.w / 2, it.y - eh.end * u[1] * def.w / 2] }
        : { kind: 'sweep', i: state.sel };
      cv.setPointerCapture(e.pointerId);
      cv.style.cursor = 'grabbing';
      view.render();
      return;
    }
    if (onHandle(pt)) {
      state.drag = { kind: 'turn', i: state.sel };
      cv.setPointerCapture(e.pointerId);
      cv.style.cursor = 'grabbing';
      view.render();
      return;
    }
    let k = itemAt(pt);
    if (k >= 0 && e.altKey) {
      /* ⌥ AND DRAG: the hand takes a copy and leaves the original where it
         was - notes, role and all. Batu, 08-09. */
      const copy = JSON.parse(JSON.stringify(state.items[k]));
      state.items.push(copy);
      k = state.items.length - 1;
    }
    if (k >= 0) {
      const it = state.items[k];
      state.sel = k;
      const m = toM(pt.x, pt.y);
      state.drag = { kind: 'move', i: k, dx: it.x - m[0], dy: it.y - m[1], moved: false, copy: !!e.altKey,
                     rig: e.altKey ? [] : rigOf(it) };   /* a copy leaves the stand with the original */
      cv.setPointerCapture(e.pointerId);
      cv.style.cursor = 'grabbing';
      refresh();
      return;
    }
    /* empty grid: a click deselects, a drag pans the view */
    state.drag = { kind: 'pan', from: pt, pan0: state.pan.slice(), moved: false };
    cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener('pointermove', (e) => {
    const pt = at(e);
    const d = state.drag;
    if (d) {
      if (d.kind === 'move') {
        const it = state.items[d.i];
        const m = toM(pt.x, pt.y);
        it.x = m[0] + d.dx; it.y = m[1] + d.dy;
        /* A FOLLOWER ON A LEASH. With Shift held, a light that follows the
           subject moves round it in steps of 15° off the camera axis, at the
           distance it is being dragged at - so 45° is 45° and not 43°. */
        /* SHIFT SNAPS TO THE GRID while a thing is dragged - its centre to the
           nearest line crossing. A follower snaps its angle instead. */
        const sub = it.t ? first('subject') : null;
        if (e.shiftKey && !(sub && sub.it !== it)) {
          const g = sq || 0.5;
          it.x = Math.round(it.x / g) * g; it.y = Math.round(it.y / g) * g;
        }
        if (sub && e.shiftKey && sub.it !== it) {
          const cam = first('camera');
          const dist = Math.hypot(it.x - sub.it.x, it.y - sub.it.y);
          const base = cam ? Math.atan2(cam.it.y - sub.it.y, cam.it.x - sub.it.x) : Math.PI / 2;
          const rel = Math.atan2(it.y - sub.it.y, it.x - sub.it.x) - base;
          const snapped = base + Math.round(rel / (Math.PI / 12)) * (Math.PI / 12);
          it.x = sub.it.x + Math.cos(snapped) * dist;
          it.y = sub.it.y + Math.sin(snapped) * dist;
        }
        clampIn(it, ldDef(gear, it));
        if (d.rig.length) settleRig(d.rig);
        d.moved = true;
        follow();
        view.render();
      } else if (d.kind === 'roomW' || d.kind === 'roomD') {
        /* THE ROOM OPENS FROM ITS CENTRE, both ways at once, and everything
           in it keeps its place in the world: the far wall moves out by as
           much as the near one, so the room's coordinates shift by half and
           every item's coordinates shift with them. Batu, 08-09. */
        /* THE HAND IS READ IN THE FRAME OF THE START. Reading it in the
           shifted frame fed the last growth back into the next, and the
           room ran to its limit at a touch (Batu, 08-09: "çok yanlış").
           The wall goes to the hand; the far wall goes out by as much. */
        const g0 = d.geo0;
        const m = [(pt.x - g0.ox) / g0.S, (pt.y - g0.oy) / g0.S];
        if (d.kind === 'roomW') {
          const grow = 2 * (m[0] - d.room0[0]);
          const W = Math.min(20, Math.max(2, Math.round((d.room0[0] + grow) * 2) / 2));
          d.shiftX = (W - d.room0[0]) / 2;
          setRoom(W, room[1]);
        } else {
          const grow = 2 * (m[1] - d.room0[1]);
          const D = Math.min(20, Math.max(2, Math.round((d.room0[1] + grow) * 2) / 2));
          d.shiftY = (D - d.room0[1]) / 2;
          setRoom(room[0], D);
        }
        state.items.forEach((it, i) => { it.x = d.pos0[i][0] + d.shiftX; it.y = d.pos0[i][1] + d.shiftY; });
        view.render();
      } else if (d.kind === 'leaf') {
        /* the spread is twice the angle between the hand and the axis, from
           the hinge on the ring's left corner */
        const it = state.items[d.i], def = ldDef(gear, it);
        const a = it.r * Math.PI / 180;
        const [X, Y] = toPx(it.x, it.y);
        const hx0 = -def.w * 0.35 * geo.S, hy0 = -def.d * 0.1 * geo.S;
        const HX = X + hx0 * Math.cos(a) - hy0 * Math.sin(a), HY = Y + hx0 * Math.sin(a) + hy0 * Math.cos(a);
        const vx = pt.x - HX, vy = pt.y - HY;
        const lx = vx * Math.cos(a) + vy * Math.sin(a), ly = -vx * Math.sin(a) + vy * Math.cos(a);
        let half = Math.atan2(-lx, -ly) * 180 / Math.PI;      /* 0 straight ahead, positive outward */
        half = Math.max(5, Math.min(60, half));
        it.b = Math.round(half * 2 / 5) * 5;
        view.render();
      } else if (d.kind === 'stretch') {
        /* the far end stays; the near end follows the hand along the axis,
           in half-metre steps */
        const it = state.items[d.i], def0 = ldFind(gear, it.id), u = axisOf(it.r);
        const m = toM(pt.x, pt.y);
        const along = ((m[0] - d.far[0]) * u[0] + (m[1] - d.far[1]) * u[1]) * d.end;
        /* the near end stops at the room's wall; the far end never moves (G6) */
        let Lmax = 8;
        const ux = d.end * u[0], uy = d.end * u[1];
        if (Math.abs(ux) > 1e-6) Lmax = Math.min(Lmax, ((ux > 0 ? room[0] : 0) - d.far[0]) / ux);
        if (Math.abs(uy) > 1e-6) Lmax = Math.min(Lmax, ((uy > 0 ? room[1] : 0) - d.far[1]) / uy);
        const L = Math.max(0.5, Math.min(Math.floor(Lmax * 2) / 2, Math.round(along * 2) / 2));
        if (L === def0.w) delete it.wl; else it.wl = L;
        it.x = d.far[0] + d.end * u[0] * L / 2; it.y = d.far[1] + d.end * u[1] * L / 2;
        clampIn(it, ldDef(gear, it));
        view.render();
      } else if (d.kind === 'sweep') {
        const it = state.items[d.i], def = ldDef(gear, it), dir = ldDir(it.r);
        const m = toM(pt.x, pt.y);
        const along = (m[0] - it.x) * dir[0] + (m[1] - it.y) * dir[1] - def.d / 2;
        /* the paper stops at the wall (audit F16) */
        let Lmax = 8;
        const fx = it.x + dir[0] * def.d / 2, fy = it.y + dir[1] * def.d / 2;
        if (Math.abs(dir[0]) > 1e-6) Lmax = Math.min(Lmax, ((dir[0] > 0 ? room[0] : 0) - fx) / dir[0]);
        if (Math.abs(dir[1]) > 1e-6) Lmax = Math.min(Lmax, ((dir[1] > 0 ? room[1] : 0) - fy) / dir[1]);
        const L = Math.max(0, Math.min(Math.floor(Lmax * 2) / 2, Math.round(along * 2) / 2));
        if (L) it.l = L; else delete it.l;
        view.render();
      } else if (d.kind === 'turn') {
        /* the item turns about its own centre to face the pointer; Shift
           snaps to fifteen degrees */
        const it = state.items[d.i];
        it.t = false;
        const [X, Y] = toPx(it.x, it.y);
        let r = Math.atan2(pt.x - X, -(pt.y - Y)) * 180 / Math.PI;
        r = (r + 360) % 360;
        if (e.shiftKey) r = (Math.round(r / 15) * 15) % 360;
        const rig = rigOf(it);
        it.r = Math.round(r);
        clampIn(it, ldDef(gear, it));
        settleRig(rig);
        view.render();
      } else if (d.kind === 'pan') {
        if (Math.hypot(pt.x - d.from.x, pt.y - d.from.y) > 4) d.moved = true;
        if (d.moved) {
          state.pan = [d.pan0[0] - (pt.x - d.from.x) / geo.S, d.pan0[1] - (pt.y - d.from.y) / geo.S];
          cv.style.cursor = 'grabbing';
          view.render();
        }
      }
      return;
    }
    const onBar = barRow && pt.x >= barRow.x && pt.x <= barRow.x + barRow.w && pt.y >= barRow.y && pt.y < barRow.y + barRow.h;
    const row = onBar ? null : rowAt(pt);
    const roomH = !row && !onBar && onRoomHandle(pt);
    const leafH = !row && !onBar && !roomH && onLeaf(pt);
    const endH = !row && !onBar && !roomH && !leafH && onEnd(pt);
    const handle = !row && !onBar && !endH && !roomH && onHandle(pt);
    const k = (row || handle || onBar || endH || roomH) ? -1 : itemAt(pt);
    const hot = onBar ? 'sheetfold' : (row ? row.key : (roomH ? roomH : (leafH ? 'leaf' : (endH ? 'end' : (handle ? 'handle' : (k >= 0 ? 'item:' + k : null))))));
    cv.style.cursor = (row || onBar) ? 'pointer' : (roomH ? (roomH === 'roomW' ? 'ew-resize' : 'ns-resize') : ((endH || leafH) ? 'crosshair' : (handle ? 'crosshair' : (k >= 0 ? 'grab' : ''))));
    if (hot !== state.hot) { state.hot = hot; view.render(); }
  });
  const release = () => {
    const d = state.drag;
    if (!d) return;
    if (d.kind === 'roomW' || d.kind === 'roomD') { state.items.forEach((it) => clampIn(it, ldDef(gear, it))); (d.pairs || []).forEach((q) => settle(q[0], q[1])); (d.pairs || []).forEach((q) => settle(q[0], q[1])); }
    if (d.kind === 'pan' && !d.moved) { state.sel = -1; }
    if (d.kind === 'move' && d.moved && !d.rig.length) perch(state.items[d.i]);
    if (d.kind === 'move' && d.copy && !d.moved) { state.items.splice(d.i, 1); state.sel = -1; }   /* a copy that went nowhere is no copy */
    if (d.kind === 'move' && !d.moved && d.i === state.sel) {
      const def = ldDef(gear, state.items[d.i]);
      if (def && def.group === 'note') requestAnimationFrame(() => postEdit.focus());
    }
    state.drag = null;
    cv.style.cursor = '';
    refresh();
  };
  cv.addEventListener('pointerup', release);
  cv.addEventListener('pointercancel', release);
  cv.addEventListener('pointerleave', () => { if (state.hot) { state.hot = null; view.render(); } });
  /* the bench scrolls when a drawer is taller than the stage */
  cv.addEventListener('wheel', (e) => {
    const pt = at(e);
    if (pt.x > RACK_W) return;
    e.preventDefault();
    state.rackScroll = Math.max(0, state.rackScroll + e.deltaY);
    view.render();
  }, { passive: false });

  /* ---- keys -------------------------------------------------------------- */

  function toggleFollow() {
    const it = state.items[state.sel];
    const def = it && ldDef(gear, it);
    if (!def || !def.aim || def.group === 'subject') return;
    if (it.t) { it.t = false; refresh(); return; }
    if (!first('subject')) { say('nothing to track — add a subject first', true); return; }
    it.t = true;
    refresh();
  }

  function setCones(on) {
    state.cones = !!on;
    keep('cones', state.cones ? 1 : 0);
    refresh();
  }

  /* THE HAND DOES NOT TAKE THE KEYS AWAY (audit F1, 11-09): a click on any
     button in the figure - a chip, a swatch, a bar button - left the focus
     on it and every printed key dead until the canvas was clicked. The
     canvas takes the focus back after such a click; sliders and text
     fields keep it, they need their own keys. */
  fig.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('button');
    if (b && fig.contains(b)) cv.focus({ preventScroll: true });
  });
  cv.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) { undo(); e.preventDefault(); return; }
    if (e.metaKey || e.ctrlKey) return;          /* ⌘C and ⌘V arrive as events of their own */
    const step = e.shiftKey ? nudgeStep() * 10 : nudgeStep();
    if (e.key === 'ArrowLeft') { nudge(-step, 0); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { nudge(step, 0); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { nudge(0, -step); e.preventDefault(); }
    else if (e.key === 'ArrowDown') { nudge(0, step); e.preventDefault(); }
    else if (e.key === 'Delete' || e.key === 'Backspace') { remove(state.sel); e.preventDefault(); }
    else if (e.key === '[') { turn(-15); e.preventDefault(); }
    else if (e.key === ']') { turn(15); e.preventDefault(); }
    else if (e.key === 'c' || e.key === 'C') { if (hasBeams()) setCones(!state.cones); e.preventDefault(); }
    /* F IS FULL SCREEN, as it is in every player (Batu, 08-09); a light
       follows on T, which is also 'takip' */
    else if (e.key === 'f' || e.key === 'F') { fsBtn.click(); e.preventDefault(); }
    else if (e.key === 't' || e.key === 'T') { toggleFollow(); e.preventDefault(); }
    else if (e.key === 'g' || e.key === 'G') { cycleGrid(); e.preventDefault(); }
    else if (e.key === '-' || e.key === '_') { stepStop(e.shiftKey ? -10 : -1); e.preventDefault(); }
    else if (e.key === '+' || e.key === '=') { stepStop(e.shiftKey ? 10 : 1); e.preventDefault(); }
    else if (e.key === 'Escape') { if (state.roomEdit) { state.roomEdit = false; } state.sel = -1; refresh(); }   /* and leaves Edit room (audit GAP 6) */
  });

  /* ---- refresh ----------------------------------------------------------- */

  function hasBeams() {
    return state.items.some((it) => { const d = ldDef(gear, it); return d && d.beam; });
  }

  /* A LIGHT KEEPS ITS NUMBER (P 19: "kill 3" means the same head all day):
     given when it first appears, never re-issued after a delete. */
  function number() {
    const taken = new Set(state.items.map((o) => o.no).filter(Boolean));
    let next = 1;
    state.items.forEach((o) => {
      const d = ldDef(gear, o);
      if (!d || d.group !== 'light' || o.no) return;
      while (taken.has(next)) next++;
      o.no = next; taken.add(next);
    });
  }
  /* ⌘Z: the diagram as it was before the last change (audit GAP 1) */
  const hist = [];
  let lastState = null;
  function undo() {
    if (!hist.length) { say('nothing to undo', true); return; }
    const prev = hist.pop();
    const items = ldParse(gear, room, prev);
    if (!items) return;
    lastState = prev;
    if (items.room) setRoom(items.room[0], items.room[1]);
    state.items = items; state.memo = items.memo || ''; state.sel = -1;
    refresh();
    say('undone');
  }
  function refresh() {
    if (state.sel >= state.items.length) state.sel = -1;
    number();
    /* a pasted post-it comes into reach too (audit F17) */
    if (geo && geo.S) state.items.forEach((o) => { const d = ldDef(gear, o); if (d && d.group === 'note') clampIn(o, d); });
    const cur = ldSerialise(room, state.items, state.memo);
    if (lastState !== null && cur !== lastState) { hist.push(lastState); if (hist.length > 60) hist.shift(); }
    lastState = cur;
    follow();
    const it = state.items[state.sel];
    const cam = it && it.f != null;
    const selDef = it && ldDef(gear, it);
    const lit = !!(selDef && selDef.beam);
    const post = !!(selDef && selDef.group === 'note');
    const tint = !!(selDef && selDef.tint);
    const colour = !!(selDef && (selDef.beam || selDef.tint));
    const sweep = !!(selDef && selDef.sweep);
    const stretch = !!(selDef && selDef.stretch);
    const none = !it;
    const plain = !!(it && !cam && !lit && !post && !tint && !stretch);
    /* C8 said hide the row rather than grey it, and S18 says a control keeps
       its place - his rule of 09-09-2026, which is the stronger of the two:
       hiding this row resized the panel under the hand. It goes off instead,
       in place. The label stays, because the panel still has to say what is
       selected. */
    /* ctlOff(focalIn, ...) took every chip and swatch in the cell down with
       the slider - the slider shares the cell with them (Batu, 11-09:
       "butonlar çalışmıyor"). The slider alone: hidden in its slot, which
       keeps its height, so nothing moves (S18) and nothing is greyed (C8). */
    focalIn.disabled = !cam;
    focalCtl.classList.toggle('off', none || plain);
    focalLab.firstChild.textContent = lit ? 'Light ' : (cam ? 'Camera ' : (post ? 'Post-it ' : ((tint || stretch) ? selDef.name + ' ' : (plain ? selDef.name + ' ' : 'Nothing selected '))));
    focalCtl.querySelector('.val').textContent = '';
    /* THE PANEL IS FOR THE SELECTED THING. With nothing selected it says so
       and shows no control; with a thing that has no settings, its name. */
    updateCell(it, selDef, { cam: cam, lit: lit, colour: colour });
    if (cam) {
      /* the slider's range is the format's, so a 4 x 5 cannot be given a 14 mm */
      const R = ldRange(ldFormat(selDef, it));
      focalIn.min = R[0]; focalIn.max = R[1];
      it.f = Math.min(R[1], Math.max(R[0], it.f));
      focalIn.value = it.f; focalIn._sync();
    }
    /* NOTHING IS LIVE THAT CANNOT BE USED. With nothing on the grid that
       throws light, the cones switch would switch nothing; with nothing on
       the grid at all there is nothing to copy, draw or clear. */
    const beams = hasBeams();
    conesBtn.textContent = state.cones ? 'Hide preview' : 'Show preview';   /* his word, 11-09: not beams */
    conesBtn.disabled = !beams; conesBtn.classList.toggle('off', !beams);
    gridSizeBtn.textContent = sq ? 'Grid ' + sq + ' m' : 'No grid';
    roomBtn.textContent = state.roomEdit ? 'Room ' + room[0] + ' × ' + room[1] + ' m · done' : 'Edit room';
    roomBtn.setAttribute('aria-pressed', String(state.roomEdit));
    const empty = !state.items.length;
    [bPng, bTxt].forEach((b) => { b.disabled = empty; b.classList.toggle('off', empty); });
    bClear.disabled = empty && !state.memo; bClear.classList.toggle('off', bClear.disabled);
    if (memoIn.value !== state.memo) { memoIn.value = state.memo; memoIn.fit(); }
    placeZoom();
    save();
    view.render();
  }

  /* ---- drawing ------------------------------------------------------------ */

  /* TWO GROUNDS, ONE DRAWING. The stage is dark and the PNG is paper, so
     every tone is a token (ICONS.md §2) and the diagram is drawn once, with
     whichever set is current. */
  let DARK, PAPER, STAGE, T;
  let exporting = false;               /* true while the PNG is drawn; drawItem reads it (a post-it once threw on 'ex', 08-09) */
  const rgbOf = (hex) => {
    const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
    return m ? parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) : '128,128,128';
  };
  const alpha = (hex, a) => {
    const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
    return m ? 'rgba(' + parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) + ',' + a + ')' : hex;
  };
  /* the stage's tones, on whichever ground the figure has been given -
     built again whenever the ground changes */
  function retint() {
  DARK = {
    ...LD_ICON_DARK,
    /* an ungelled light is white (Batu, 11-09) */
    /* a warm white, not a flat one (Batu, 11-09: "düz beyaz çok sıkıcı") */
    beam: 'rgba(255,241,204,0.14)', beamKey: 'rgba(255,241,204,0.8)', beamRGB: '255,241,204', beamA: 0.2,
    fov: alpha(p.digital, 0.06), fovLine: alpha(p.digital, 0.4),   /* half what it was - Batu, 08-09: the blue was loud */
    ink: p.fg, muted: p.muted, rule: p.rule, rule2: p.rule2, floor: p.inset,
    wall: p.muted, thread: alpha(p.muted, 0.55), plate: alpha(p.stage, 0.82),
    hover: alpha(p.fg, 0.55), signal: p.signal,
  };
  PAPER = {
    ...LD_ICON_PAPER,
    /* white on paper is nothing, so on paper white light is a grey wash */
    beam: 'rgba(150,132,90,0.18)', beamKey: '#96845A', beamRGB: '150,132,90', beamA: 0.2,   /* and warm on paper too */
    fov: alpha('#0E7C8A', 0.07), fovLine: alpha('#0E7C8A', 0.6),
    ink: '#0B0C0C', muted: '#5C605E', rule: '#C9CAC4', rule2: '#9EA19D', floor: '#FFFFFF',
    wall: '#0B0C0C', thread: alpha('#5C605E', 0.6), plate: 'rgba(247,246,242,0.88)',
    hover: 'rgba(11,12,12,0.45)', signal: '#C42D00',
  };
  /* on the light ground the stage draws with the paper tones, so what is on
     the screen and what the PNG saves are one picture */
  STAGE = light ? {
    ...PAPER,
    beam: 'rgba(150,132,90,0.18)', beamKey: '#96845A', beamRGB: '150,132,90', beamA: 0.2,   /* and warm on paper too */
    fov: alpha(p.digital, 0.07), fovLine: alpha(p.digital, 0.6),
    ink: p.fg, muted: p.muted, rule: p.rule, rule2: p.rule2, floor: p.inset,
    wall: p.fg, thread: alpha(p.muted, 0.6), plate: alpha(p.stage, 0.88),
    hover: alpha(p.fg, 0.45), signal: p.signal,
  } : DARK;
  T = STAGE;
  }
  retint();
  function toggleGround() { gndBtn.click(); }

  /* AN ITEM ON THE GRID, at its real footprint, turned the way it faces.
     The drawing is ldIcon's; this only places it, and marks it when it is
     the selected one or under the pointer. */
  /* WHAT PAPER AN ITEM STANDS ON: the colour of a roll's sweep under its
     centre, or null for the floor. A light figure on a white sweep on the
     dark ground vanished (Batu, 11-09: "beyaz fon üstünde kayboluyorlar"),
     so an item takes the tones of the ground it actually stands on. */
  function paperUnder(it) {
    for (const o of state.items) {
      if (o === it || !o.l) continue;
      const od = ldDef(gear, o);
      if (!od || !od.sweep) continue;
      const a = -o.r * Math.PI / 180, dx = it.x - o.x, dy = it.y - o.y;
      const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
      if (Math.abs(lx) <= od.w / 2 && ly < -od.d / 2 && ly >= -od.d / 2 - o.l) return o.c || 'ffffff';
    }
    return null;
  }
  const lumOf = (hex) => { const [r, g, b] = ldRgb(hex); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
  function drawItem(ctx, it, def, S, sel, hot) {
    const w = def.w * S, d = def.d * S;
    const paper = def.sweep ? null : paperUnder(it);
    /* the light stage draws with STAGE, a copy of PAPER, so the test is
       'not the dark tones' (11-09: the white lines vanished on white) */
    const onLight = paper != null ? lumOf(paper) > 0.55 : (T !== DARK);
    const base = onLight ? PAPER : DARK;
    ctx.save();
    ctx.translate(...toPx(it.x, it.y));
    ctx.rotate(it.r * Math.PI / 180);
    /* THE PAPER ON THE FLOOR, ahead of the roll, in its own colour */
    if (def.sweep && it.l) {
      ctx.fillStyle = it.c ? '#' + it.c : T.face;
      ctx.strokeStyle = T.line; ctx.lineWidth = 1;
      ctx.fillRect(-w / 2, -d / 2 - it.l * S, w, it.l * S);
      ctx.strokeRect(-w / 2 + 0.5, -d / 2 - it.l * S + 0.5, w - 1, it.l * S);
    }
    /* A TINTED THING IS DRAWN IN ITS COLOUR: every tone of the icon */
    const TT = (def.tint && it.c) ? { ...base, body: '#' + it.c, back: '#' + it.c, face: '#' + it.c } : base;
    /* A THIN THING KEEPS ITS PLAN DRAWING. The delivered art is a side
       view; on a softbox or a stand it reads, on a roll of paper it stood
       a metre tall over a 30 cm footprint, hid the paper on the floor and
       the handles with it (Batu, 08-09: "fon çalışmıyor ve dönmüyor").
       Room pieces, solid blades and anything 10 cm deep or less are drawn
       as the plan draws them; the art stays in the bench. */
    /* and a stand or a tripod too (11-09): its side view put a latched
       camera on its legs; the plan's legs meet at the plate. */
    /* the studio stand is the one support drawn from its art - Batu's own,
       from the icon set - a column at the centre of a wheeled base */
    const planOnly = def.group === 'room' || (def.group === 'support' && def.id !== 'studio-stand') || def.solid || def.d <= 0.1;
    const art = planOnly ? null : gridArt(def.id, def.tint ? it.c : null, onLight);
    if (art) {
      /* fitted to the footprint's width; the drawing's own height */
      const ah = w * art.height / art.width;
      /* THE SILHOUETTE UNDER THE LINES (Batu, 11-09: "tam maskelemek"): the
         art is strokes with nothing inside, so the grid and the preview
         showed through it. Its hull, in the floor's colour, goes under it. */
      /* the hull is read from the image once it has loaded; a browser that
         will not give the pixels back (a tainted canvas) gets the drawing's
         box instead, so there is always a mask. Its colour is the floor it
         stands on: the room's, or the paper's. */
      /* THE SILHOUETTE, NOT THE HULL (Batu, 12-09: a hull round a stand was a
         black blob in a beam). The drawing's own outline, closed from the
         outside, in the floor's colour; the hull only if the pixels cannot
         be read at all. */
      const floorTone = paper != null ? base.floor : T.floor;
      const sil = silhouetteCanvas(art, floorTone);
      if (sil) ctx.drawImage(sil, -w / 2, -ah / 2, w, ah);
      else {
        if (art.hull === undefined) { try { art.hull = hullOf(art); } catch (e) { art.hull = null; } }
        const mask = art.hull || [[0, 0], [1, 0], [1, 1], [0, 1]];
        ctx.beginPath();
        mask.forEach((q, i) => { const X = -w / 2 + q[0] * w, Y = -ah / 2 + q[1] * ah; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
        ctx.closePath(); ctx.fillStyle = floorTone; ctx.fill();
      }
      ctx.drawImage(art, -w / 2, -ah / 2, w, ah);
      /* THE LIGHT LEAVES FROM THE FRONT OF THE DRAWING (Batu, 11-09: "ışığın
         çıktığı yerden gitmesinde fayda var"): a side view is taller than
         its footprint, and the cone started inside it */
      /* and a reflective umbrella throws from its bowl, behind the head:
         `emit` in the catalogue says how far up the drawing (11-09) */
      it._emit = ah / 2 / S * (def.emit != null ? def.emit : 1);
    } else {
      delete it._emit;
      ldIcon(ctx, it.b ? { ...def, spread: it.b } : def, w, d, TT, true);
    }
    /* a gel on a light: its swatch on the face */
    if (def.beam && it.c) {
      ctx.fillStyle = '#' + it.c; ctx.strokeStyle = T.line; ctx.lineWidth = 1;
      const q = Math.max(6, Math.min(12, w * 0.18));
      ctx.fillRect(-q / 2, -d / 2 - 1, q, q); ctx.strokeRect(-q / 2 + 0.5, -d / 2 - 0.5, q - 1, q - 1);
    }
    if (def.group === 'note' && !(!exporting && it === state.items[state.sel])) {   /* the box over it shows the words */
      /* its words, wrapped inside the square, sized with the paper */
      const size = Math.max(8, w / 7);
      const lines = wrapLines(ctx, it.n || '', w - 10, size);
      const lh = size * 1.25;
      const max = Math.floor((d - 8) / lh);
      ctx.save();
      lines.slice(0, max).forEach((l, i) => label(ctx, l, -w / 2 + 5, -d / 2 + 5 + lh * (i + 0.85), T.line, size));
      ctx.restore();
    }
    if (sel || hot) {
      ctx.strokeStyle = sel ? T.signal : T.hover;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-w / 2 - 4.5, -d / 2 - 4.5, w + 9, d + 9);
    }
    ctx.restore();
  }

  /* THE BENCH ICON. Claude Design's line art arrived on 08-09 - side views,
     drawn to be recognised, not plan views drawn to be measured - so it
     stands in the bench, where a silhouette is the job, and the plan keeps
     its own drawings at their footprints. One SVG per gear id under
     art/gear/, its tokens filled in for the ground it stands on; without
     one, the plan drawing shrunk. */
  const artCache = {};
  /* the ids with no file under art/gear/ - asking would be a 404 in the
     console, and G10 counts those. The curtain is the plan drawing's. */
  const NO_ART = ['curtain', 'postit'];
  function benchArt(id) {
    const key = id + (light ? ':light' : ':dark');
    if (artCache[key] !== undefined) return artCache[key];
    artCache[key] = NO_ART.indexOf(id) >= 0 ? false : null;
    if (artCache[key] === false) return false;
    fetch('../_shared/interactives/art/gear/' + id + '.svg').then((r) => (r.ok ? r.text() : null)).then((txt) => {
      if (!txt) { artCache[key] = false; return; }
      const tones = light
        ? { line: '#1A1C1B', body: '#3A3C39', face: '#FFFFFF', back: '#8A8D88' }
        : { line: '#F2F2EE', body: '#C9CBC6', face: '#F4F5F0', back: '#7C807B' };
      /* ICONS.md §6: in the panel the detail goes; and a hairline at 24 px
         is nothing, so the stroke is thickened for the bench */
      /* and the file has a viewBox but no width or height, which leaves the
         image with no size of its own - give it the viewBox's */
      const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(txt);
      const filled = txt.replace(/<g class="detail">[\s\S]*?<\/g>/g, '')
        .replace(/stroke-width="1"/g, 'stroke-width="1.6"')
        .replace(/var\(--icon-surface[^)]*\)/g, tones.back)
        .replace(/var\(--icon-(line|body|face|back)\)/g, (m, t) => tones[t])
        .replace('<svg ', vb ? '<svg width="' + vb[1] + '" height="' + vb[2] + '" ' : '<svg ');
      const im = new Image();
      im.onload = () => { artCache[key] = im; view.render(); };
      im.onerror = () => { artCache[key] = false; };
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(filled);
    }).catch(() => { artCache[key] = false; });
    return null;
  }
  /* THE SAME ART ON THE GRID, at the item's width (Batu, 08-09: "hala bunu
     görüyorum" - the plan drawings had stayed). With its detail, its
     stroke as drawn, and a tint's colour in place of the tones. It is a
     side view on a plan; the footprint's width is honoured and the height
     follows the drawing. Cached per id, ground and colour. */
  /* THE SILHOUETTE OF A DRAWING: its strokes thickened by two pixels, the
     outside flooded from the border, and everything the flood did not
     reach is the thing - the interior of a stand's column as much as its
     outline. Computed once per image at 320 px, kept with it; painted in
     a colour into a small canvas, one per colour, kept too. */
  function silhouetteOf(im) {
    const W = 320, H = Math.max(2, Math.round(320 * im.height / im.width));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H).data;
    const ink = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) if (d[i * 4 + 3] > 40) ink[i] = 1;
    const fat = new Uint8Array(W * H);                 /* dilated by 2: a dash's gap closes */
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (!ink[y * W + x]) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < W && yy < H) fat[yy * W + xx] = 1;
      }
    }
    const out = new Uint8Array(W * H);                 /* what the flood from the border reaches */
    const stack = [];
    for (let x = 0; x < W; x++) { stack.push(x); stack.push((H - 1) * W + x); }
    for (let y = 0; y < H; y++) { stack.push(y * W); stack.push(y * W + W - 1); }
    while (stack.length) {
      const i = stack.pop();
      if (out[i] || fat[i]) continue;
      out[i] = 1;
      const x = i % W, y = (i - x) / W;
      if (x > 0) stack.push(i - 1);
      if (x < W - 1) stack.push(i + 1);
      if (y > 0) stack.push(i - W);
      if (y < H - 1) stack.push(i + W);
    }
    const mask = new Uint8Array(W * H);
    let n = 0;
    for (let i = 0; i < W * H; i++) if (!out[i]) { mask[i] = 1; n++; }
    return n ? { w: W, h: H, mask: mask } : null;
  }
  function silhouetteCanvas(im, colour) {
    if (im.sil === undefined) { try { im.sil = silhouetteOf(im); } catch (e) { im.sil = null; } }
    if (!im.sil) return null;
    im.silBy = im.silBy || {};
    if (im.silBy[colour]) return im.silBy[colour];
    const { w, h, mask } = im.sil;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    const id = g.createImageData(w, h);
    const [r, gg, b] = ldRgb(colour.replace('#', '').length === 6 ? colour.replace('#', '') : '0E1110');
    for (let i = 0; i < w * h; i++) if (mask[i]) { id.data[i * 4] = r; id.data[i * 4 + 1] = gg; id.data[i * 4 + 2] = b; id.data[i * 4 + 3] = 255; }
    g.putImageData(id, 0, 0);
    im.silBy[colour] = c;
    return c;
  }
  /* the convex hull of a drawing's opaque pixels, in 0..1 of its box */
  function hullOf(im) {
    const W = 160, H = Math.max(2, Math.round(160 * im.height / im.width));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H).data;
    const pts = [];
    for (let y = 0; y < H; y++) {
      let lo = -1, hi = -1;
      for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 40) { if (lo < 0) lo = x; hi = x; }
      if (lo >= 0) { pts.push([lo, y]); pts.push([hi + 1, y + 1]); }
    }
    if (pts.length < 3) return null;
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [], upper = [];
    for (const q of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
    for (let k = pts.length - 1; k >= 0; k--) { const q = pts[k]; while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
    return lower.slice(0, -1).concat(upper.slice(0, -1)).map((q) => [q[0] / W, q[1] / H]);
  }
  function gridArt(id, tint, onLight) {
    const key = id + (onLight ? ':L' : ':D') + ':' + (tint || '') + ':full';
    if (artCache[key] !== undefined) return artCache[key];
    artCache[key] = NO_ART.indexOf(id) >= 0 ? false : null;
    if (artCache[key] === false) return false;
    fetch('../_shared/interactives/art/gear/' + id + '.svg').then((r) => (r.ok ? r.text() : null)).then((txt) => {
      if (!txt) { artCache[key] = false; return; }
      const tones = onLight
        ? { line: '#1A1C1B', body: '#3A3C39', face: '#FFFFFF', back: '#8A8D88' }
        : { line: '#F2F2EE', body: '#C9CBC6', face: '#F4F5F0', back: '#7C807B' };
      /* THE SIXTH TOKEN. The wall, window, doorway and rolls carry a
         --icon-surface with an orange fallback that the prompt never named;
         left alone it painted every wall orange and the palette did
         nothing (Batu, 08-09: "duvar rengini değiştiremiyoruz"). It is the
         colour the viewer chose, or the back tone. */
      tones.surface = tint ? '#' + tint : tones.back;
      if (tint) { tones.body = '#' + tint; tones.face = '#' + tint; tones.back = '#' + tint; }
      const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(txt);
      const filled = txt.replace(/stroke-width="1"/g, 'stroke-width="1.2"')
        .replace(/var\(--icon-surface[^)]*\)/g, tones.surface)
        .replace(/var\(--icon-(line|body|face|back)\)/g, (m, t) => tones[t])
        .replace('<svg ', vb ? '<svg width="' + vb[1] + '" height="' + vb[2] + '" ' : '<svg ');
      const im = new Image();
      im.onload = () => { try { im.hull = hullOf(im); } catch (e) { im.hull = null; } artCache[key] = im; view.render(); };
      im.onerror = () => { artCache[key] = false; };
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(filled);
    }).catch(() => { artCache[key] = false; });
    return null;
  }
  function drawIconSmall(ctx, def, x, y, box) {
    const im = benchArt(def.id);
    if (im) {
      const k = Math.min(box / im.width, box / im.height);
      const w = im.width * k, h = im.height * k;
      ctx.drawImage(im, x + (box - w) / 2, y + (box - h) / 2, w, h);
      return;
    }
    const k = box / Math.max(def.w, def.d);
    ctx.save();
    ctx.translate(x + box / 2, y + box / 2);
    ldIcon(ctx, def, def.w * k, def.d * k, T, false);
    ctx.restore();
  }

  /* A CONE OF LIGHT, from the whole face and not from a point: a softbox
     throws from its full width and the spread opens from its two ends. */
  /* A BEAM FADES; AN ANGLE OF VIEW DOES NOT. A beam at one flat tone to the
     far wall was a fog at three lights. It thins out over five metres now,
     with a hairline along its two sides, so eight of them still say where
     each goes. The camera's cone is the frame, and the frame does not fade. */
  function drawBeam(ctx, it, def, S, spread, kind) {
    const [X, Y] = toPx(it.x, it.y);
    const a = it.r * Math.PI / 180;
    const half = spread / 2 * Math.PI / 180;
    const fade = kind === 'beam';
    const L = fade ? 8 * S : (room[0] + room[1]) * S;
    const w = def.w * S / 2, d = (it._emit || def.d / 2) * S;
    if (fade) { drawBeamCast(ctx, it, def, S, spread); return; }   /* one geometry, blocked or not */
    ctx.save();
    ctx.translate(X, Y); ctx.rotate(a);
    let fill = T.fov, edge = T.fovLine;
    if (fade) {
      /* a gelled light throws its gel's colour */
      const rgb = it.c ? ldRgb(it.c).join(',') : T.beamRGB;
      const a0 = it.c ? Math.min(0.5, T.beamA + 0.12) : T.beamA;
      const gr = ctx.createLinearGradient(0, -d, 0, -d - L);
      gr.addColorStop(0, 'rgba(' + rgb + ',' + a0 + ')');
      gr.addColorStop(1, 'rgba(' + rgb + ',0)');
      fill = gr;
      const ge = ctx.createLinearGradient(0, -d, 0, -d - L);
      ge.addColorStop(0, 'rgba(' + rgb + ',0.6)');
      ge.addColorStop(1, 'rgba(' + rgb + ',0)');
      edge = ge;
    }
    const L1 = [-w - Math.sin(half) * L, -d - Math.cos(half) * L];
    const R1 = [w + Math.sin(half) * L, -d - Math.cos(half) * L];
    ctx.beginPath();
    ctx.moveTo(-w, -d); ctx.lineTo(L1[0], L1[1]); ctx.lineTo(R1[0], R1[1]); ctx.lineTo(w, -d);
    ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = edge; ctx.lineWidth = 1;
    if (fade) {
      ctx.beginPath(); ctx.moveTo(-w, -d); ctx.lineTo(L1[0], L1[1]); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w, -d); ctx.lineTo(R1[0], R1[1]); ctx.stroke();
    } else ctx.stroke();
    ctx.restore();
  }

  /* A BEAM THAT STOPS AT WALLS. The cone is always the same trapezoid - the
     spread never changes - and every solid edge cuts a shadow out of it: a
     quad from the edge's two ends away from the light, erased from the cone
     on a scratch canvas before the cone is laid on the stage. The shadow's
     sides are straight lines through the edge's ends, so nothing bends where
     a curtain catches a corner of the beam (Batu, 08-09, twice). */
  const scratchFor = new WeakMap();
  function scratch(ctx) {
    const c = ctx.canvas;
    let sc = scratchFor.get(c);
    if (!sc) { sc = document.createElement('canvas'); scratchFor.set(c, sc); }
    if (sc.width !== c.width || sc.height !== c.height) { sc.width = c.width; sc.height = c.height; }
    return sc;
  }
  function drawBeamCast(ctx, it, def, S, spread) {
    const sc = scratch(ctx);
    const o = sc.getContext('2d');
    /* ONLY THE BEAM'S OWN BOX is cleared and copied, not the whole stage
       (audit F19: 54 items took 84 ms a frame, two full-canvas passes per
       light). The box is the cone's corners in device pixels, with room. */
    const [X, Y] = toPx(it.x, it.y);
    const a = it.r * Math.PI / 180;
    const tf = ctx.getTransform();
    const reach0 = (it.reach || 8) * S, half0 = spread / 2 * Math.PI / 180;
    const w0 = def.w * S / 2, d0 = (it._emit || def.d / 2) * S;
    const corners = [[-w0, -d0], [w0, -d0], [-w0 - Math.sin(half0) * reach0, -d0 - Math.cos(half0) * reach0], [w0 + Math.sin(half0) * reach0, -d0 - Math.cos(half0) * reach0]]
      .map((c) => { const ux = X + c[0] * Math.cos(a) - c[1] * Math.sin(a), uy = Y + c[0] * Math.sin(a) + c[1] * Math.cos(a); return [tf.a * ux + tf.c * uy + tf.e, tf.b * ux + tf.d * uy + tf.f]; });
    const bx0 = Math.max(0, Math.floor(Math.min(...corners.map((c) => c[0])) - 4)), by0 = Math.max(0, Math.floor(Math.min(...corners.map((c) => c[1])) - 4));
    const bx1 = Math.min(sc.width, Math.ceil(Math.max(...corners.map((c) => c[0])) + 4)), by1 = Math.min(sc.height, Math.ceil(Math.max(...corners.map((c) => c[1])) + 4));
    if (bx1 <= bx0 || by1 <= by0) return;
    o.setTransform(1, 0, 0, 1, 0, 0);
    o.clearRect(bx0, by0, bx1 - bx0, by1 - by0);
    /* and every fill - the cone, the shadow quads projected sixty times
       past the room - is clipped to that box, which is where the time went */
    o.save();
    o.beginPath(); o.rect(bx0, by0, bx1 - bx0, by1 - by0); o.clip();
    o.setTransform(tf);
    /* the plain cone, as ever, into the scratch */
    const half = spread / 2 * Math.PI / 180;
    const reach = it.reach || 8;         /* eight metres: the far wall of most rooms */
    const L = reach * S;
    const w = def.w * S / 2, d = (it._emit || def.d / 2) * S;
    const rgb = it.c ? ldRgb(it.c).join(',') : T.beamRGB;
    const a0 = (it.c ? Math.min(0.5, T.beamA + 0.12) : T.beamA) * (it.dim || 1);
    o.save();
    o.translate(X, Y); o.rotate(a);
    /* INVERSE SQUARE (Batu, 11-09), FROM A SOURCE THE SIZE OF THE FACE
       (12-09: "mesafeye göre olan ışık dağılımı"): a small head is a point
       and falls fast; a 150 octa is a broad source and falls slowly near
       it. The distance at which the strength is a quarter is the face's
       width and a half, never under 1.2 m; so at six metres a speedlight
       is at a thirtieth and the octa still at a twelfth. The edges fade
       with it. */
    const near = Math.max(1.2, def.w * 1.5);
    const fall = (t) => { const dm = t * reach; return (near / (near + dm)) ** 2; };
    const gr = o.createLinearGradient(0, -d, 0, -d - L);
    const ge = o.createLinearGradient(0, -d, 0, -d - L);
    for (let i = 0; i <= 10; i++) {
      gr.addColorStop(i / 10, 'rgba(' + rgb + ',' + (a0 * fall(i / 10)).toFixed(3) + ')');
      ge.addColorStop(i / 10, 'rgba(' + rgb + ',' + (0.6 * fall(i / 10)).toFixed(3) + ')');
    }
    const L1 = [-w - Math.sin(half) * L, -d - Math.cos(half) * L];
    const R1 = [w + Math.sin(half) * L, -d - Math.cos(half) * L];
    o.beginPath(); o.moveTo(-w, -d); o.lineTo(L1[0], L1[1]); o.lineTo(R1[0], R1[1]); o.lineTo(w, -d); o.closePath();
    o.fillStyle = gr; o.fill();
    o.strokeStyle = ge; o.lineWidth = 1;
    o.beginPath(); o.moveTo(-w, -d); o.lineTo(L1[0], L1[1]); o.stroke();
    o.beginPath(); o.moveTo(w, -d); o.lineTo(R1[0], R1[1]); o.stroke();
    o.restore();
    /* the shadows, cut out: each solid edge and its projection away from the
       face's centre, well past the beam's reach */
    if (blockers.length) {
      const dir = ldDir(it.r);
      const src = [it.x + dir[0] * (it._emit || def.d / 2), it.y + dir[1] * (it._emit || def.d / 2)];
      const K = 60;
      o.save();
      o.globalCompositeOperation = 'destination-out';
      o.fillStyle = '#000';
      blockers.forEach(([p1, p2]) => {
        /* an edge past the beam's reach cannot shadow what is drawn */
        if (Math.hypot((p1[0] + p2[0]) / 2 - src[0], (p1[1] + p2[1]) / 2 - src[1]) > reach + def.w + 0.5) return;
        /* a reflector's own edges do not shadow what it throws back */
        if (it.skipNear && Math.hypot((p1[0] + p2[0]) / 2 - it.x, (p1[1] + p2[1]) / 2 - it.y) < it.skipNear) return;
        /* only edges in front of the face throw a shadow into the beam */
        const ahead = ((p1[0] - src[0]) * dir[0] + (p1[1] - src[1]) * dir[1] > 0.01)
                   || ((p2[0] - src[0]) * dir[0] + (p2[1] - src[1]) * dir[1] > 0.01);
        if (!ahead) return;
        const q1 = [p1[0] + (p1[0] - src[0]) * K, p1[1] + (p1[1] - src[1]) * K];
        const q2 = [p2[0] + (p2[0] - src[0]) * K, p2[1] + (p2[1] - src[1]) * K];
        o.beginPath();
        [p1, p2, q2, q1].forEach((q, i) => { const [px, py] = toPx(q[0], q[1]); if (i) o.lineTo(px, py); else o.moveTo(px, py); });
        o.closePath(); o.fill();
      });
      o.restore();
    }
    o.restore();
    /* onto the stage, inside whatever clip is in force */
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(sc, bx0, by0, bx1 - bx0, by1 - by0, bx0, by0, bx1 - bx0, by1 - by0);
    ctx.restore();
  }

  /* THE BOUNCE LEAVES FROM THE BOARD ITSELF (Batu, 12-09: "bu yansıma halen
     doğru değil"): its base is the board's own line, end to end, and each
     end throws along the mirrored direction, opened by half the spread
     outward. A base drawn square to the direction, as a light's is, put a
     wedge out sideways whenever the light came in at an angle. */
  function drawBounce(ctx, rf, rd, dir, colour, dim, reach) {
    const u = axisOf(rf.r);
    const w = (rf.wl || rd.w) / 2;
    const A = [rf.x - u[0] * w, rf.y - u[1] * w], B = [rf.x + u[0] * w, rf.y + u[1] * w];
    const half = 35 * Math.PI / 180;
    const rot = (v, t) => [v[0] * Math.cos(t) - v[1] * Math.sin(t), v[0] * Math.sin(t) + v[1] * Math.cos(t)];
    const cross = u[0] * dir[1] - u[1] * dir[0];
    const tA = cross > 0 ? half : -half;
    const dA = rot(dir, tA), dB = rot(dir, -tA);
    const A2 = [A[0] + dA[0] * reach, A[1] + dA[1] * reach], B2 = [B[0] + dB[0] * reach, B[1] + dB[1] * reach];
    const rgb = colour ? ldRgb(colour).join(',') : T.beamRGB;
    const a0 = T.beamA * dim;
    const [X0, Y0] = toPx(rf.x, rf.y), [X1, Y1] = toPx(rf.x + dir[0] * reach, rf.y + dir[1] * reach);
    const gr = ctx.createLinearGradient(X0, Y0, X1, Y1);
    for (let i = 0; i <= 10; i++) { const dm = i / 10 * reach; gr.addColorStop(i / 10, 'rgba(' + rgb + ',' + (a0 * (1.2 / (1.2 + dm)) ** 2).toFixed(3) + ')'); }
    ctx.save();
    ctx.beginPath();
    [A, B, B2, A2].forEach((q, i) => { const [px, py] = toPx(q[0], q[1]); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
    ctx.closePath();
    ctx.fillStyle = gr; ctx.fill();
    ctx.restore();
  }

  /* a small plate behind a label so it reads over the grid */
  function plate(ctx, text, x, y, color, size, align) {
    ctx.save();
    ctx.font = '500 ' + size + 'px "JetBrains Mono", ui-monospace, monospace';
    const tw = ctx.measureText(text).width;
    const x0 = align === 'center' ? x - tw / 2 : (align === 'right' ? x - tw : x);
    ctx.fillStyle = T.plate;
    ctx.fillRect(x0 - 4, y - size - 1, tw + 8, size + 6);
    ctx.restore();
    label(ctx, text, x, y, color, size, align);
  }

  function fitName(ctx, text, maxW) {
    ctx.save();
    ctx.font = '500 10px "JetBrains Mono", ui-monospace, monospace';
    let t = text;
    while (t.length > 3 && ctx.measureText(t).width > maxW) t = t.slice(0, -2).replace(/\s+$/, '') + '…';
    ctx.restore();
    return t;
  }

  function drawBench(ctx, w, h) {
    rows = [];
    ctx.save();
    if (RACK_W === FOLD_W) {
      /* folded: a strip with the one button that brings it back */
      ctx.fillStyle = p.inset; ctx.fillRect(0, 0, FOLD_W, h);
      line(ctx, FOLD_W, 0, FOLD_W, h, p.rule);
      rows.push({ kind: 'fold', key: 'fold', y: 0, h: 26 });
      label(ctx, '+', FOLD_W / 2, 18, state.hot === 'fold' ? p.fg : p.muted, 13, 'center');
      ctx.restore(); return;
    }
    ctx.fillStyle = p.inset;
    ctx.fillRect(0, 0, RACK_W, h);
    line(ctx, RACK_W, 0, RACK_W, h, p.rule);
    rows = [];
    if (!gear) {
      label(ctx, 'gear.js did not load', 14, 24, p.signal, 10);
      ctx.restore(); return;
    }
    /* A GRID OF ICONS, BY CATEGORY (Batu, 11-09): no drawers to open, the
       categories only headed; the name and what the thing is for come up
       beside the icon under the hand. */
    const GH = 22, CELL = 40, BOX = 30, COLS = 5, PADX = 16;
    const hh = h - MEMO_H;                 /* the note box has the foot */
    /* the bench's own head: its name, and the button that folds it away */
    /* LIST OR GRID (Batu, 11-09): the two words at the head switch the view;
       the one in force is in the foreground colour. Kept in the browser. */
    const grid = state.benchView !== 'list';
    rows.push({ kind: 'view', key: 'view', x: RACK_W - 92, y: 0, w: 66, h: 26 });
    rows.push({ kind: 'fold', key: 'fold', y: 0, h: 26 });
    label(ctx, 'BENCH', 14, 17, p.muted, 9);
    label(ctx, 'LIST', RACK_W - 60, 17, grid ? (state.hot === 'view' ? p.fg : p.muted) : p.fg, 9, 'right');
    label(ctx, '·', RACK_W - 53, 17, p.muted, 9, 'center');
    label(ctx, 'GRID', RACK_W - 30, 17, grid ? p.fg : (state.hot === 'view' ? p.fg : p.muted), 9, 'right');
    label(ctx, '−', RACK_W - 14, 18, state.hot === 'fold' ? p.fg : p.muted, 13, 'right');
    line(ctx, 0, 26, RACK_W, 26, p.rule);
    let y = 36 - state.rackScroll;
    let total = 0;
    const IH = 36;
    gear.groups.forEach((g) => { total += GH + (grid ? Math.ceil(g.items.length / COLS) * CELL : g.items.length * IH) + 8; });
    const maxScroll = Math.max(0, total + 20 - hh);
    if (state.rackScroll > maxScroll) { state.rackScroll = maxScroll; y = 10 - maxScroll; }
    ctx.beginPath(); ctx.rect(0, 0, RACK_W, hh); ctx.clip();
    let hotTip = null;
    gear.groups.forEach((g) => {
      label(ctx, g.name.toUpperCase(), 14, y + 14, p.muted, 9);
      y += GH;
      if (!grid) {
        g.items.forEach((it) => {
          const k2 = 'add:' + it.id;
          rows.push({ kind: 'item', id: it.id, key: k2, y: y, h: IH });
          if (state.hot === k2) { ctx.fillStyle = p.wash; ctx.fillRect(0, y, RACK_W, IH); hotTip = { it: it, y: y }; }
          drawIconSmall(ctx, it, 16, y + (IH - BOX) / 2, BOX);
          label(ctx, fitName(ctx, it.name, RACK_W - 48 - 12), 48, y + 21, state.hot === k2 ? p.fg : alpha(p.fg, 0.8), 10);
          y += IH;
        });
        y += 8;
        return;
      }
      g.items.forEach((it, i) => {
        const cx = PADX + (i % COLS) * CELL, cy = y + Math.floor(i / COLS) * CELL;
        const k2 = 'add:' + it.id;
        rows.push({ kind: 'item', id: it.id, key: k2, x: cx, y: cy, w: CELL, h: CELL });
        if (state.hot === k2) { ctx.fillStyle = p.wash; ctx.fillRect(cx, cy, CELL, CELL); hotTip = { it: it, y: cy }; }
        /* each icon in a cell of the grid, boxed (Batu, 11-09) */
        ctx.strokeStyle = p.rule; ctx.lineWidth = 1; ctx.strokeRect(cx + 0.5, cy + 0.5, CELL - 1, CELL - 1);
        drawIconSmall(ctx, it, cx + (CELL - BOX) / 2, cy + (CELL - BOX) / 2, BOX);
      });
      y += Math.ceil(g.items.length / COLS) * CELL + 8;
    });
    ctx.restore();
    /* the name and the one line about it, on a plate beside the bench */
    if (hotTip && hotTip.y > 26 && hotTip.y < hh) {
      const tw = 250, size = 9;
      const lines = wrapLines(ctx, hotTip.it.about || '', tw - 20, size);
      const th = 22 + lines.length * 13 + 8;
      const ty = Math.min(hotTip.y, h - th - 4);
      ctx.save();
      ctx.fillStyle = p.inset; ctx.fillRect(RACK_W + 6, ty, tw, th);
      ctx.strokeStyle = p.rule; ctx.lineWidth = 1; ctx.strokeRect(RACK_W + 6.5, ty + 0.5, tw - 1, th - 1);
      label(ctx, hotTip.it.name, RACK_W + 16, ty + 16, p.fg, 10);
      lines.forEach((l, i) => label(ctx, l, RACK_W + 16, ty + 31 + i * 13, p.muted, size));
      ctx.restore();
    }
  }

  /* THE DIAGRAM ITSELF - the room, what is in it, and what it says. Drawn
     into whatever `geo` maps metres to, on whichever ground `T` names, so
     the stage and the PNG are one drawing. `ex` drops the working marks: the
     selection, the handle, the hover. */
  function drawDiagram(ctx, ex) {
    exporting = !!ex;
    const S = geo.S;
    const cam = first('camera'), sub = first('subject');

    ctx.save();
    ctx.beginPath(); ctx.rect(geo.area.x, geo.area.y, geo.area.w, geo.area.h); ctx.clip();

    /* THE GRID, AND ONLY INSIDE THE ROOM. Half-metre lines faint, metre lines
       a shade brighter, so a distance can be counted off the picture without
       a ruler. */
    const [rx, ry] = toPx(0, 0);
    const rw = room[0] * S, rh = room[1] * S;
    ctx.fillStyle = T.floor; ctx.fillRect(rx, ry, rw, rh);
    /* THE GRID COVERS THE WHOLE STAGE, on the room's own lines; the room is
       the frame drawn over it, and the bench and the sheet are bars laid on
       top. Batu, 08-09. On the PNG it stays inside the room. */
    if (sq && gridA > 0) {
      const c1 = alpha(T.rule, gridA), c2 = alpha(T.rule2, gridA);
      const A = geo.area;
      const x0 = ex ? 0 : Math.floor((A.x - geo.ox) / S / sq) * sq, x1 = ex ? room[0] : Math.ceil((A.x + A.w - geo.ox) / S / sq) * sq;
      const y0 = ex ? 0 : Math.floor((A.y - geo.oy) / S / sq) * sq, y1 = ex ? room[1] : Math.ceil((A.y + A.h - geo.oy) / S / sq) * sq;
      const top = ex ? ry : A.y, bottom = ex ? ry + rh : A.y + A.h, left = ex ? rx : A.x, right = ex ? rx + rw : A.x + A.w;
      for (let x = x0; x <= x1 + 1e-6; x += sq) {
        const X = geo.ox + x * S;
        const whole = Math.abs(x - Math.round(x)) < 1e-6;
        line(ctx, X, top, X, bottom, whole ? c2 : c1);
      }
      for (let y = y0; y <= y1 + 1e-6; y += sq) {
        const Y = geo.oy + y * S;
        const whole = Math.abs(y - Math.round(y)) < 1e-6;
        line(ctx, left, Y, right, Y, whole ? c2 : c1);
      }
    }

    /* WHAT STOPS LIGHT: the edges of every solid thing, as segments in
       metres. A V-flat is its two panels; everything else its four sides. */
    blockers = [];
    state.items.forEach((it) => {
      const def = ldDef(gear, it);
      if (!def || !def.solid) return;
      const u = axisOf(it.r), v = [-u[1], u[0]];          /* across, and down the depth */
      const c = [it.x, it.y], hw = def.w / 2, hd = def.d / 2;
      const P = (a, b) => [c[0] + u[0] * a + v[0] * b, c[1] + u[1] * a + v[1] * b];
      if (it.id === 'v-flat') {
        blockers.push([P(0, hd), P(-hw, -hd)], [P(0, hd), P(hw, -hd)]);
      } else {
        const q = [P(-hw, -hd), P(hw, -hd), P(hw, hd), P(-hw, hd)];
        for (let i = 0; i < 4; i++) blockers.push([q[i], q[(i + 1) % 4]]);
      }
    });
    /* LIGHT STAYS IN THE ROOM. Cones and the angle of view are clipped at
       the walls, so a 24 mm lens does not paint the whole stage. */
    ctx.save();
    ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.clip();
    state.items.forEach((it) => {
      const def = ldDef(gear, it);
      if (!def) return;
      if (def.fov && it.f != null && it.v !== false) drawBeam(ctx, it, def, S, ldFov(it.f, ldFormat(def, it).frame), 'fov');
      else if (state.cones && def.beam && it.p !== false) drawBeam(ctx, it, def, S, spreadOf(it, def), 'beam');
    });
    /* A REFLECTOR THROWS BACK WHAT FALLS ON IT (Batu, 11-09): the light's
       direction mirrored about the reflector's face, from the whole face, at
       a part of the strength and over a shorter reach; gold sends it back
       yellow. Only a light whose cone reaches the reflector, on its working
       side. */
    if (state.cones) state.items.forEach((rf) => {
      const rd = ldDef(gear, rf);
      if (!rd || !/^reflector-|^bounce-board$/.test(rf.id)) return;
      const n = ldDir(rf.r);
      state.items.forEach((lt) => {
        const ld = ldDef(gear, lt);
        if (!ld || !ld.beam || lt.p === false || lt === rf) return;
        const v = [rf.x - lt.x, rf.y - lt.y], dist = Math.hypot(v[0], v[1]);
        if (dist < 0.2 || dist > 8) return;
        const u = [v[0] / dist, v[1] / dist], dl = ldDir(lt.r);
        const off = Math.acos(Math.max(-1, Math.min(1, u[0] * dl[0] + u[1] * dl[1]))) * 180 / Math.PI;
        if (off > spreadOf(lt, ld) / 2) return;                  /* outside the cone */
        const k = u[0] * n[0] + u[1] * n[1];
        /* IN PROPORTION TO THE ANGLE IT ARRIVES AT (Batu, 11-09: "açısı
           ölçüsünde yansıtmalı"): -k is the cosine of the angle of
           incidence - 1 head on, 0 along the face. Under a tenth is nothing. */
        const cosI = -k;
        if (cosI < 0.1) return;                                   /* turned away, or a graze */
        const r = [u[0] - 2 * k * n[0], u[1] - 2 * k * n[1]];
        const gold = /gold$/.test(rf.id);
        drawBounce(ctx, rf, rd, r, gold ? 'E2B94A' : lt.c, (gold ? 0.85 : 0.75) * cosI, 3.5);
      });
    });
    /* THE CAMERA AXIS, from the camera through the subject and on, is what
       every angle is measured from. */
    if (cam && sub) {
      const [cx, cy] = toPx(cam.it.x, cam.it.y), [sx, sy] = toPx(sub.it.x, sub.it.y);
      const dx = sx - cx, dy = sy - cy, L = Math.hypot(dx, dy) || 1;
      const far = (room[0] + room[1]) * S;
      line(ctx, cx, cy, sx + dx / L * far, sy + dy / L * far, T.rule2, [4, 4]);
    }
    ctx.restore();

    ctx.strokeStyle = (!ex && state.roomEdit) ? T.signal : T.wall; ctx.lineWidth = 1.5;
    ctx.strokeRect(rx, ry, rw, rh);

    /* DISTANCE AND ANGLE, ON THE DIAGRAM. A hairline from each light to the
       subject carries the metres, and beside them the degrees off the camera
       axis: 0 on the axis, 90 at the side, 180 behind. The number that makes
       a set-up reproducible, and the number a student should not have to
       compute in their head. */
    const readings = [];
    const lights = state.items.filter((it) => (ldDef(gear, it) || {}).group === 'light').sort((a, b) => (a.no || 0) - (b.no || 0));
    /* ON THE STAGE, THE SELECTED LIGHT'S READING AND NO OTHER - the sheet
       has them all, and six plates over the room were noise (Batu, 08-09).
       The PNG has no selection, so it carries every reading. */
    if (sub) {
      const [sx, sy] = toPx(sub.it.x, sub.it.y);
      lights.forEach((it) => {
        if (!ex && it !== state.items[state.sel]) return;
        const [X, Y] = toPx(it.x, it.y);
        line(ctx, X, Y, sx, sy, T.thread, [2, 4]);
        readings.push({ X: X, Y: Y, sx: sx, sy: sy, x: X + (sx - X) * 0.55, y: Y + (sy - Y) * 0.55, text: ldReading(it, sub, cam) });
      });
    }

    /* the gear, selected one last so it sits on top */
    ordered().forEach((i) => {
      const it = state.items[i];
      if (!ex && i === state.sel) return;
      const def = ldDef(gear, it);
      if (def) drawItem(ctx, it, def, S, false, !ex && state.hot === 'item:' + i);
    });
    /* the camera says its focal length beside it - the cone is the answer,
       this is the question - and a light says the stop it was metered at */
    state.items.forEach((it) => {
      const def = ldDef(gear, it);
      if (!def) return;
      if (def.group === 'light') {
        const [X, Y] = toPx(it.x, it.y);
        const e = ldExtent(def, it.r);
        /* ITS NUMBER, matching the set-up sheet, at its top-left corner; in
           signal when it follows the subject */
        const n = it.no || lights.indexOf(it) + 1;
        const bx = X - e.hx * S - 8, by = Y - e.hy * S - 8;
        ctx.fillStyle = it.t ? T.signal : T.ink;
        ctx.fillRect(bx - 8, by - 8, 16, 16);
        label(ctx, String(n), bx, by + 4, T.floor, 10, 'center');
        /* THE ROLE OVER THE STOP, to its right, at the size the room reads */
        const col = [];
        if (it.k != null) col.push([LD_ROLES[it.k].toUpperCase(), 9, T.muted]);
        LD_UNITS.forEach((u) => { if (it[u.k] != null) col.push([u.text(it[u.k]), 14, T.ink]); });
        const lh = (sz) => (sz > 12 ? 19 : 13);
        let ly = Y - col.reduce((a, l) => a + lh(l[1]), 0) / 2;
        col.forEach((l) => { ly += lh(l[1]); plate(ctx, l[0], X + e.hx * S + 12, ly - 4, l[2], l[1], 'left'); });
        return;
      }
      if (it.f == null) return;
      const [X, Y] = toPx(it.x, it.y);
      const e = ldExtent(def, it.r);
      /* the focal length alone is ambiguous, so the format stands beside it */
      /* A COLUMN TO THE RIGHT OF THE CAMERA, centred on it: the format and
         the lens on one small line, then each setting on a line of its own
         at the size the room reads. Nothing the picture already shows - the
         cone is the angle of view, so no degrees. Batu, 08-09: values on
         top of each other, and nothing useless. */
      const fm = ldFormat(def, it);
      const lines = [[(fm.name || fm.format || '35 mm') + ' · ' + it.f + ' mm', 9, T.fovLine]];
      if (it.a != null) lines.push(['f/' + it.a, 14, T.ink]);
      if (it.e != null) lines.push([ldShutterText(it.e), 14, T.ink]);
      if (it.i != null) lines.push(['ISO ' + it.i, 14, T.ink]);
      const lh = (sz) => (sz > 12 ? 19 : 14);
      const total = lines.reduce((a, l) => a + lh(l[1]), 0);
      let ly = Y - total / 2;
      lines.forEach((l) => { ly += lh(l[1]); plate(ctx, l[0], X + e.hx * S + 12, ly - 5, l[2], l[1], 'left'); });
    });
    /* AT THE SIZE THE ROOM READS. They are the point of the diagram. */
    /* A READING STEPS ASIDE FROM ANOTHER (audit F13): its plate tries five
       places along its own thread, then above and below, and takes the
       first that touches no plate already placed. */
    const placed = [];
    ctx.save(); ctx.font = '500 14px "JetBrains Mono", ui-monospace, monospace';
    readings.forEach((q) => {
      const tw = ctx.measureText(q.text).width + 10, th = 22;
      const cands = [0.55, 0.42, 0.68, 0.3, 0.8].map((t) => [q.X + (q.sx - q.X) * t, q.Y + (q.sy - q.Y) * t]);
      [-24, 24, -48, 48].forEach((dy) => cands.push([q.x, q.y + dy]));
      const free = (c) => !placed.some((r) => Math.abs(c[0] - r[0]) < (tw + r[2]) / 2 && Math.abs(c[1] - r[1]) < (th + r[3]) / 2);
      const c = cands.find(free) || cands[0];
      q.x = c[0]; q.y = c[1]; placed.push([c[0], c[1], tw, th]);
    });
    ctx.restore();
    readings.forEach((q) => plate(ctx, q.text, q.x, q.y + 5, T.ink, 14, 'center'));

    if (!ex && state.roomEdit) {
      const pulling = state.drag && (state.drag.kind === 'roomW' || state.drag.kind === 'roomD');
      roomHandles().forEach((h) => {
        ctx.fillStyle = (pulling && state.drag.kind === h[2]) || state.hot === h[2] ? T.signal : p.stage;
        ctx.strokeStyle = T.signal; ctx.lineWidth = 1.5;
        ctx.fillRect(h[0] - 6, h[1] - 6, 12, 12); ctx.strokeRect(h[0] - 6, h[1] - 6, 12, 12);
      });
      if (pulling) plate(ctx, 'ROOM ' + room[0] + ' × ' + room[1] + ' M', rx + rw / 2, ry - 10, T.signal, 11, 'center');
    }
    const sel = ex ? null : state.items[state.sel];
    if (sel) {
      const def = ldDef(gear, sel);
      if (def) {
        drawItem(ctx, sel, def, S, true, false);
        const [X, Y] = toPx(sel.x, sel.y);
        const e = ldExtent(def, sel.r);
        const turning = state.drag && state.drag.kind === 'turn';
        /* THE ENDS, for anything whose length is pulled: a square at each
           end; the paper's edge for a roll. The length is written while it
           is being pulled. */
        const stretching = state.drag && (state.drag.kind === 'stretch' || state.drag.kind === 'sweep');
        const ends = endHandles(sel, def);
        if (ends) ends.forEach((q) => {
          ctx.fillStyle = (stretching || state.hot === 'end') ? T.signal : p.stage;
          ctx.strokeStyle = T.signal; ctx.lineWidth = 1.5;
          ctx.fillRect(q[0] - 6, q[1] - 6, 12, 12); ctx.strokeRect(q[0] - 6, q[1] - 6, 12, 12);
        });
        const sh = sweepHandle(sel, def);
        if (sh) {
          ctx.fillStyle = (stretching || state.hot === 'end') ? T.signal : p.stage;
          ctx.strokeStyle = T.signal; ctx.lineWidth = 1.5;
          ctx.fillRect(sh[0] - 6, sh[1] - 6, 12, 12); ctx.strokeRect(sh[0] - 6, sh[1] - 6, 12, 12);
        }
        const lh = leafHandle(sel, def);
        if (lh) {
          const opening = state.drag && state.drag.kind === 'leaf';
          ctx.fillStyle = (opening || state.hot === 'leaf') ? T.signal : p.stage;
          ctx.strokeStyle = T.signal; ctx.lineWidth = 1.5;
          ctx.fillRect(lh[0] - 6, lh[1] - 6, 12, 12); ctx.strokeRect(lh[0] - 6, lh[1] - 6, 12, 12);
          if (opening) plate(ctx, (sel.b || def.beam) + '°', lh[0], lh[1] - 12, T.signal, 11, 'center');
        }
        if (stretching && def.group !== 'note') {
          const txt = state.drag.kind === 'sweep' ? (sel.l ? sel.l.toFixed(1) + ' m on the floor' : 'roll only') : def.w.toFixed(1) + ' m';
          plate(ctx, txt, X, Y - e.hy * S - 14, T.signal, 11, 'center');
        }
        if (turns(def) && !sel.t && !stretching) {
          /* ONE HANDLE, past the front of the item. Drag it and the item turns
             about its own centre; while it turns, the degrees are written.
             No handle while it follows the subject: the subject holds it. */
          const [hx, hy] = handleAt(sel, def);
          const dir = ldDir(sel.r);
          line(ctx, X + dir[0] * (def.d / 2 * S), Y + dir[1] * (def.d / 2 * S), hx, hy, T.signal);
          ctx.fillStyle = (turning || state.hot === 'handle') ? T.signal : p.stage;
          ctx.strokeStyle = T.signal; ctx.lineWidth = 1.5;
          /* a hand's target on a projector: 14 px, not 10 */
          ctx.fillRect(hx - 7, hy - 7, 14, 14);
          ctx.strokeRect(hx - 7, hy - 7, 14, 14);
          if (turning) plate(ctx, ldAngleText(def, sel.r) || Math.round(sel.r) + '°', hx + dir[0] * 18, hy + dir[1] * 18 + 4, T.signal, 11, 'center');
        }
        /* THE NAME, and only the name. The footprint is what the drawing IS
           and the degrees are written while turning; a camera's column
           already names it, so it gets no label at all. */
        if (!turning && sel.f == null && def.group !== 'note') {
          plate(ctx, nameOf(sel, def) + (sel.t ? ' · tracks the subject' : ''),
                X, Y + e.hy * S + 18, T.ink, 10, 'center');
        }
      }
    }
    ctx.restore();

    /* THE SCALE, STATED, ABOVE THE ROOM: the grid and the room in words, and
       one metre drawn beside them, along the room's top edge. */
    {
      const rx0 = geo.ox, ry0 = geo.oy;
      const by = ry0 - 10;
      const text = (sq ? 'GRID ' + sq + ' M' : 'NO GRID') + ' · ROOM ' + room[0] + ' × ' + room[1] + ' M';
      plate(ctx, text, rx0, by, T.muted, 9, 'left');
      ctx.save(); ctx.font = '500 9px "JetBrains Mono", ui-monospace, monospace';
      const tw = ctx.measureText(text).width; ctx.restore();
      const bx = rx0 + tw + 18, len = 1 * S;
      line(ctx, bx, by - 2, bx + len, by - 2, T.ink);
      line(ctx, bx, by - 7, bx, by - 2, T.ink);
      line(ctx, bx + len, by - 7, bx + len, by - 2, T.ink);
      line(ctx, bx + len / 2, by - 5, bx + len / 2, by - 2, T.ink);
      label(ctx, '1 m', bx + len + 8, by, T.ink, 10);
    }

    /* THE LEGEND, the moment the picture uses two kinds of mark. Top right,
       under the full-screen button, so it never shares a line with the keys. */
    {
      /* clear of the sheet's bar, folded or open, which covers the right edge */
      const ly = geo.area.y + 46;
      let x = geo.area.x + geo.area.w - (ex ? 0 : geo.sheetW || 0) - 16;
      const item = (text, color) => {
        ctx.save();
        ctx.font = '500 9px "JetBrains Mono", ui-monospace, monospace';
        const tw = ctx.measureText(text).width;
        x -= tw; label(ctx, text, x, ly + 3, T.muted, 9);
        x -= 14; ctx.fillStyle = color; ctx.fillRect(x, ly - 6, 9, 9);
        x -= 16;
        ctx.restore();
      };
      if (state.cones && hasBeams()) item('PREVIEW', T.beamKey);
      if (state.items.some((it) => it.f != null && it.v !== false)) item('ANGLE OF VIEW', T.fovLine);
    }

    /* THE SET-UP SHEET, in the band beside the room when there is one: one
       entry per light, numbered as on the drawing, with what it is, where it
       stands and what it read. The thing a student rebuilds a set-up from. */
    const roomRight = geo.ox + room[0] * S;
    const bandX = ex ? roomRight + 28 : geo.area.x + geo.area.w - geo.sheetW + 16;
    const bandW = ex ? geo.area.x + geo.area.w - 16 - bandX : Math.max(0, geo.sheetW - 32);
    /* below the legend's line, so the two never share a row in a narrow band */
    sheetEnd = null;
    if (!ex && geo.sheetW === FOLD_W) {
      /* folded: a strip at the right with the button that opens it */
      const bx = geo.area.x + geo.area.w - FOLD_W;
      ctx.fillStyle = p.inset; ctx.fillRect(bx, geo.area.y, FOLD_W, geo.area.h + KEY_BAND);
      line(ctx, bx, geo.area.y, bx, geo.area.y + geo.area.h + KEY_BAND, p.rule);
      barRow = { x: bx, y: geo.area.y, w: FOLD_W, h: 26 };
      label(ctx, '+', bx + FOLD_W / 2, geo.area.y + 18, state.hot === 'sheetfold' ? p.fg : p.muted, 13, 'center');
    } else if (bandW >= 170) {
      sheetEnd = { x: bandX, y: drawSheet(ctx, bandX, geo.area.y + 64, bandW, geo.area.h - 80 - (ex ? 0 : memoH + 10), sub, cam, lights, ex ? 1.5 : 1), w: bandW };
    } else barRow = null;
  }
  let sheetEnd = null;
  let pngBg = '#F7F6F2';               /* the PNG's ground */
  let memoH = 60;                      /* the notes box's height, as last placed; the sheet leaves it room */
  let blockers = [];                   /* segments that stop light, this frame */
  /* how far a ray from o in direction d runs before it meets a blocker */
  function rayReach(o, d, L, skip) {
    let best = L;
    for (const seg of blockers) {
      const [a, b] = seg;
      const ex = b[0] - a[0], ey = b[1] - a[1];
      const den = d[0] * ey - d[1] * ex;
      if (Math.abs(den) < 1e-9) continue;
      const t = ((a[0] - o[0]) * ey - (a[1] - o[1]) * ex) / den;
      const u = ((a[0] - o[0]) * d[1] - (a[1] - o[1]) * d[0]) / den;
      if (t > 0.02 && t < best && u >= 0 && u <= 1) best = t;
    }
    return best;
  }
  let barRow = null;                   /* where the sheet's fold button is */

  function drawSheet(ctx, x, y, w, h, sub, cam, lights, k) {
    ctx.save();
    if (k === 1) {
      /* the bar the sheet stands on, over the grid, like the bench's, with
         its own head and the button that folds it */
      ctx.fillStyle = p.inset;
      ctx.fillRect(x - 16, geo.area.y, geo.area.x + geo.area.w - (x - 16), geo.area.h + KEY_BAND);
      line(ctx, x - 16, geo.area.y, x - 16, geo.area.y + geo.area.h + KEY_BAND, p.rule);
      barRow = { x: x - 16, y: geo.area.y, w: w + 32, h: 26 };
      label(ctx, 'SHEET', x, geo.area.y + 17, p.muted, 9);
      label(ctx, '−', x + w, geo.area.y + 18, state.hot === 'sheetfold' ? p.fg : p.muted, 13, 'right');
      line(ctx, x - 16, geo.area.y + 26, geo.area.x + geo.area.w, geo.area.y + 26, p.rule);
    }
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    let ly = y + 12 * k;
    /* A LINE WRAPS, IT IS NOT CUT (audit F10): "on c-stand" and "on the
       floor" were what an ellipsis took. What will not fit the band's
       height is counted and said (F3). */
    let hidden = 0;
    const put = (text, size, tone, dy, avail) => {
      const lines = wrapLines(ctx, text, avail || w, size * k);
      lines.forEach((l, i) => {
        if (ly > y + h - 14 * k) { hidden++; return; }
        label(ctx, l, x, ly, tone, size * k);
        if (i < lines.length - 1) ly += size * 1.35 * k;
      });
      ly += dy * k;
    };
    put('SET-UP', 9, T.muted, 20);
    if (!lights.length) put('no lights yet', 10, T.muted, 16);
    lights.forEach((it, n) => {
      const def = ldDef(gear, it);
      if (ly > y + h - 14 * k) { hidden += 2; return; }        /* no room: counted, not half drawn */
      ctx.fillStyle = it.t ? T.signal : T.ink; ctx.fillRect(x, ly - 11 * k, 14 * k, 14 * k);
      label(ctx, String(it.no || n + 1), x + 7 * k, ly, T.floor, 9 * k, 'center');
      ctx.save(); ctx.translate(20 * k, 0);
      put((it.k != null ? LD_ROLES[it.k].toUpperCase() + ' · ' : '') + nameOf(it, def), 10, T.ink, 15, w - 20 * k);
      const bits = [];
      if (sub) bits.push(ldReading(it, sub, cam));
      LD_UNITS.forEach((u) => { if (it[u.k] != null) bits.push(u.text(it[u.k])); });
      if (it.c) { const gl = LD_ALL_COLOURS.find((q) => q[1] === it.c); bits.push('gel ' + (gl ? gl[0] : '#' + it.c)); }
      if (it.b) bits.push('doors ' + it.b + '°');
      const mt = mateOf(it); if (mt) bits.push('on ' + ldDef(gear, mt).name.toLowerCase());
      put(bits.length ? bits.join(' · ') : '—', 11, T.ink, 22, w - 20 * k);
      ctx.restore();
    });
    if (cam) {
      const fm = ldFormat(cam.def, cam.it);
      ly += 4 * k;
      put('CAMERA', 9, T.muted, 15);
      put(cam.def.name + ' · ' + (fm.name || fm.format || '35 mm') + ' · ' + cam.it.f + ' mm', 10, T.ink, 15);
      const set = [cam.it.a != null ? 'f/' + cam.it.a : null, cam.it.e != null ? ldShutterText(cam.it.e) : null,
                   cam.it.i != null ? 'ISO ' + cam.it.i : null].filter(Boolean);
      if (set.length) put(set.join(' · '), 11, T.ink, 22); else ly += 7 * k;
    }
    if (sub) { const at = ldAngleText(sub.def, sub.it.r); put('SUBJECT', 9, T.muted, 15); put(sub.def.name + (at ? ' · ' + at : ''), 10, T.ink, 22); }
    const rest = state.items.filter((it) => { const g = (ldDef(gear, it) || {}).group; return g && g !== 'light' && g !== 'camera' && g !== 'subject' && g !== 'note'; });
    if (rest.length) {
      put('ALSO', 9, T.muted, 15);
      rest.forEach((it) => {
        const d2 = ldDef(gear, it);
        const extra = [];
        if (it.c) { const gl = LD_ALL_COLOURS.find((q) => q[1] === it.c); extra.push(gl ? gl[0] : '#' + it.c); }
        if (it.l) extra.push(it.l.toFixed(1) + ' m on the floor');
        if (it.b) extra.push('doors ' + it.b + '°');
        put(d2.name + (extra.length ? ' · ' + extra.join(' · ') : ''), 10, T.ink, 14);
      });
    }
    const posts = state.items.filter((it) => (ldDef(gear, it) || {}).group === 'note' && it.n);
    if (posts.length) {
      put('POST-ITS', 9, T.muted, 15);
      posts.forEach((it) => put(it.n.replace(/\s+/g, ' '), 10, T.ink, 14));
    }
    /* the note is printed on the PNG; on the stage it is the box below */
    if (state.memo && k !== 1) {
      ly += 8 * k;
      put('NOTE', 9, T.muted, 15);
      wrapLines(ctx, state.memo, w, 10 * k).forEach((l) => put(l, 10, T.ink, 14));
    }
    if (hidden) {
      ctx.restore(); ctx.save();
      label(ctx, '… ' + hidden + ' more line' + (hidden > 1 ? 's' : '') + (k === 1 ? ' · on the PNG' : ''), x, y + h - 4 * k, T.signal, 9 * k);
    }
    ctx.restore();
    return ly;
  }
  function wrapLines(ctx, text, maxW, size) {
    ctx.save();
    ctx.font = '500 ' + size + 'px "JetBrains Mono", ui-monospace, monospace';
    const out = [];
    text.split(/\r?\n/).forEach((para) => {
      let line = '';
      para.split(/\s+/).forEach((word) => {
        const t = line ? line + ' ' + word : word;
        if (ctx.measureText(t).width <= maxW || !line) line = t; else { out.push(line); line = word; }
      });
      out.push(line);
    });
    ctx.restore();
    return out;
  }
  function fitTo(ctx, text, maxW, size) {
    ctx.save();
    ctx.font = '500 ' + size + 'px "JetBrains Mono", ui-monospace, monospace';
    let t = text;
    while (t.length > 3 && ctx.measureText(t).width > maxW) t = t.slice(0, -2).replace(/\s+$/, '') + '…';
    ctx.restore();
    return t;
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    /* the whole stage is paper-white on the light ground, not an off-white
       margin round a white room - Batu, 08-09 */
    ctx.fillStyle = light ? p.inset : p.stage; ctx.fillRect(0, 0, w, h);
    geo = fit(w, h);
    T = STAGE;
    drawDiagram(ctx, false);
    placeMemo(w, h);
    placePost(w);
    drawBench(ctx, w, h);

    /* EVERY KEY THAT DOES SOMETHING, printed under the room. */
    /* AND IT FITS UNDER THE ROOM. keyRow keeps a row on the canvas, not off
       the bench, so the words are short and the row is measured against the
       diagram's own width; if it would still run under the bench it drops
       the wordiest pair to a second line. */
    const keys = [[['◀', '▶', '▲', '▼'], 'move'],
                  [['⇧'], '×10 · snap'],
                  [['[', ']'], 'turn'],
                  [['C'], 'preview'],
                  [['−', '+'], 'stop'],
                  [['T'], 'track'],
                  [['F'], 'full screen'],
                  [['⌫'], 'delete'],
                  [['G'], 'grid'],
                  [['esc'], 'deselect'],
                  [['⌥'], 'drag copies'],
                  [['⌘C', '⌘V'], 'copy · paste'],
                  [['⌘Z'], 'undo']];
    const rowW = (gs) => {
      let t = 0;
      ctx.save();
      gs.forEach((g, i) => {
        ctx.font = '600 10px "IBM Plex Mono", ui-monospace, monospace';
        g[0].forEach((k) => { t += Math.max(16, ctx.measureText(k).width + 10) + 3; });
        ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
        t += 5 + ctx.measureText(g[1]).width + (i < gs.length - 1 ? 20 : 0);
      });
      ctx.restore();
      return t;
    };
    /* the scale bar owns the bottom-left corner; the keys take the room to
       its right, centred there, and never over it */
    const scaleW = 0;
    const avail = geo.area.w - geo.sheetW - 32;   /* the sheet's column is not the keys' (audit F7) */
    const cx0 = geo.area.x + avail / 2 + 16;
    if (rowW(keys) <= avail) {
      keyRow(ctx, cx0, h - 16, keys, p.fg, p.muted);
    } else {
      const half = Math.ceil(keys.length / 2);
      keyRow(ctx, cx0, h - 34, keys.slice(0, half), p.fg, p.muted);
      keyRow(ctx, cx0, h - 14, keys.slice(half), p.fg, p.muted);
    }

    if (state.note) {
      plate(ctx, state.note.text, geo.area.x + (geo.area.w - geo.sheetW) / 2, BAR_H + 22,   /* below the bar, over the room (audit F6) */
            state.note.bad ? p.signal : p.fg, 11, 'center');
    }
  }

  /* THE PNG IS THE DIAGRAM ON PAPER - the whole room, whatever the zoom, with
     its scale and its readings, and none of the interface. It goes into
     briefs and onto printed sheets, so the ground is paper and not dark. */
  function exportPng() {
    if (!state.items.length) return;
    /* the room on the left, the set-up sheet in a band on the right */
    /* THE PNG STANDS ON THE GROUND THE STAGE STANDS ON: dark stage, dark
       PNG; light stage, paper (Batu, 08-09: "dark ve light mode export
       olmalı"). And the sheet's band is wide enough for its lines - at 1500
       the last words ran off the right edge. */
    const W = 1600, dpr = 2, RW = 1100;
    const keep = geo;
    const pad = 70;
    /* AND IT GROWS TO ITS SHEET (audit F3): twenty lights need a taller
       page, not a cut list. Drawn once at 1100; if the sheet ran past the
       foot, drawn again at the height it needs, the room sized by 1100. */
    const paint = (H) => {
      const off = document.createElement('canvas');
      off.width = W * dpr; off.height = H * dpr;
      const ctx = off.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pngBg = light ? '#F7F6F2' : p.stage;
      ctx.fillStyle = pngBg; ctx.fillRect(0, 0, W, H);
      const S = Math.min((RW - 2 * pad) / room[0], (1100 - 2 * pad) / room[1]);
      geo = { area: { x: 0, y: 0, w: W, h: H }, S: S,
              ox: (RW - room[0] * S) / 2, oy: (1100 - room[1] * S) / 2 - 10 };
      T = light ? PAPER : DARK;
      /* a post-it outside the room stays left of the sheet's band on the
         page (S §5): moved for the drawing, put back after */
      const moved = [];
      state.items.forEach((o) => {
        const d = ldDef(gear, o); if (!d || d.group !== 'note') return;
        const e2 = ldExtent(d, o.r), xmax = (RW - 12 - geo.ox) / S - e2.hx, xmin = (12 - geo.ox) / S + e2.hx;
        const nx = Math.min(xmax, Math.max(xmin, o.x));
        if (nx !== o.x) { moved.push([o, o.x]); o.x = nx; }
      });
      try {
        drawDiagram(ctx, true);
        label(ctx, 'LIGHT DIAGRAM · TECHNICAL SKILLS II', 16, 22, T.muted, 9);
      } finally {
        moved.forEach((q) => { q[0].x = q[1]; });
        geo = keep; T = STAGE;
      }
      return off;
    };
    let off = paint(1100);
    if (sheetEnd && sheetEnd.y > 1100 - 40) off = paint(Math.ceil(sheetEnd.y + 60));
    const a = document.createElement('a');
    a.download = 'light-diagram.png';
    a.href = off.toDataURL('image/png');
    document.body.append(a); a.click(); a.remove();
    say('PNG saved · light-diagram.png');
  }

  /* the viewer's last zoom, preview and folds (audit GAP 5) */
  { const z = parseFloat(kept('zoom')); if (z >= 1 && z <= 3) { state.zoom = z; zoomIn.value = String(z); zoomIn.dispatchEvent(new Event('input')); } }
  if (kept('cones') === '1') state.cones = true;
  if (kept('bench-fold') === '1') RACK_W = FOLD_W;
  if (kept('sheet') === '1') sheetFold = true;
  refresh();
  return { render: view.render, state: state, refresh: refresh,
           serialise: () => ldSerialise(room, state.items, state.memo), paste: pasteIn, png: exportPng,
           room: () => room.slice(), bench: () => RACK_W, sheetFold: () => sheetFold,   /* the scenario reads its geometry from here */
           art: () => artCache, tones: () => ({ floor: T.floor, dark: DARK.floor, paper: PAPER.floor, inset: p.inset, stage: p.stage }) };
}
