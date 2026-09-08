/* ============================================================
   PHOTOCHEMISTRY — the light, the paper, and the zone it lands on
   ------------------------------------------------------------
   Written once because more than one instrument needs it. The
   enlarger's timer and its aperture are two ways of setting ONE
   number, and the paper turns that number into a tone; the test
   strip and the photogram are the same machine pointed at
   different questions, and this is the part they share.

   What does NOT belong here: anything about film. A paper is a
   positive - more light, darker. A negative is the other way
   round, and giving it this curve would teach the opposite of
   the truth.
   ============================================================ */

const TS_STOPS = [4, 5.6, 8, 11];
/* Round numbers off a timer's own dial. It went 5, 7 - the six was simply
   missing, and a dial that skips a number is a dial nobody made. */
const TS_TIMES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/* Twelve seconds at f/8 is maximum black: the reference everything is measured
   against, so the numbers on screen are the ones a darkroom actually uses. */
const TS_REF_T = 12, TS_REF_F = 8;

/* Illuminance falls with the square of the f-number, so closing one stop halves
   it and the time must double to stand still. One line, and the whole of
   reciprocity is in it. */
function tsDose(seconds, fnum) {
  return (seconds / (fnum * fnum)) / (TS_REF_T / (TS_REF_F * TS_REF_F));
}

/* THE PAPER'S OWN CURVE. Nothing below a threshold, density through the middle,
   then the silver runs out. Written against LOG exposure because that is how
   paper behaves and how stops are counted; four and a half stops of useful
   range, which is a normal grade.

   THE FLOOR IS D 2.10, WHICH IS sRGB 22, and it is that number for two
   reasons that agree. It is the middle of the range a real glossy fibre
   baryta measures - 2.05 to 2.15 - and it is the density this file's own
   zone table already calls Zone 0. Those two had drifted apart: the floor
   was sRGB 20, D 2.16, which is deeper than any paper and 0.055 deeper than
   the Zone 0 we print underneath the band. A paper and the table that reads
   it have to agree about where black is.

   IT MUST NOT REACH 0,0,0, and it must reach ZONE 0. A print's maximum black
   reflects about one per cent of the light falling on it - sRGB 20, density
   2.15 - and paper that went to pure black would be teaching a black no
   darkroom can hand you. But that black has to be REACHABLE, and it was not:
   a creep added past the shoulder to stop the ladder going flat stretched
   maximum black out to 94 seconds at f/8, when a darkroom finds it in ten or
   twenty. So the creep is gone and the shoulder closes where it should - h = 2,
   which is 24 seconds at f/8. Six bands at four-second intervals now end on
   Zone 0 exactly. Beyond it the paper IS flat, because it is at its maximum,
   and that is not a defect but the thing the strip is looking for. */
function tsTone(h) {
  if (h <= 0) return 1;
  const x = Math.log2(h);
  const t = Math.min(1, Math.max(0, (x + 3.6) / 4.6));
  const s = t * t * (3 - 2 * t);
  return 1 - s * 0.933;
}

/* WHICH ZONE A BAND LANDED ON. Read off the print the way a print is read -
   by its reflection density - against the print values the Zone System names.
   Nothing here is about paper types or contrast grades; it is one paper, and
   this says where on it a given exposure put you. */
const TS_ZONE_D = [2.10, 1.75, 1.35, 1.05, 0.87, 0.72, 0.54, 0.37, 0.22, 0.11, 0.05];
const TS_ZONE_N = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function tsZone(v) {
  const c = (6 + v * (243 - 6)) / 255;
  const lin = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const d = -Math.log10(Math.max(lin, 1e-9));

  /* THE NEAREST NAMED VALUE, and nothing finer. Half zones were tried and
     taken out at Batu's word. Adams sanctions them - The Negative p.68 says
     half zones and thirds may be used where precision is wanted, and his own
     captions are full of Zone VI½ and Zone VIII½ - but the same page settles
     why whole zones are honest on their own: a zone IS a range of greys, and
     the value the name stands for is that range's midpoint. So the name is a
     neighbourhood, deliberately. The exact number is already under the band,
     in seconds. */
  let best = 0, gap = Infinity;
  for (let i = 0; i < TS_ZONE_D.length; i++) {
    const g = Math.abs(d - TS_ZONE_D[i]);
    if (g < gap) { gap = g; best = i; }
  }
  return TS_ZONE_N[best];
}

function tsGrey(v) {
  const n = Math.round(6 + v * (243 - 6));
  return 'rgb(' + n + ',' + n + ',' + n + ')';
}

/* THE PAPER UNDER THE SAFELIGHT IS NOT WHITE. A sheet of bromide paper in a
   darkroom is the dull dark red the safelight makes of it, and it stays that
   red on the bench, in the tray, all through developing — the greys only
   arrive when somebody puts the room light on. So the tone the paper earned is
   mixed INTO a red ramp while the safelight is on, and crosses to true grey as
   `light` comes up at the end. */
function tsPaper(v, light) {
  const g = 6 + v * (243 - 6);
  const r = 20 + v * 86, gr = v * 10, b = v * 8;
  const m = (a, t) => Math.round(a + (g - a) * light);
  return 'rgb(' + m(r) + ',' + m(gr) + ',' + m(b) + ')';
}

/* SECONDS AS THEY ARE. This used to round anything over ten to a whole number,
   so a band stopped early at 13.7 s was printed as 14 and the equivalent
   exposure f/11 at 45.4 s was printed as 45. The tone was never rounded - it is
   a continuous function of the light - and the number under the band had no
   business being rounded either. A tenth of a second is where it stops, because
   that is where the timer stops. */
function tsSecs(t) {
  const r = Math.round(t * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}
