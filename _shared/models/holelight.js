/* ============================================================
   The hole, and the distance to the film — week 3.

   ONE THING: the two measurements a pinhole camera has do four
   things between them.

     the hole   wider -> brighter, and softer
     the film   further -> less of the room, bigger subject,
                and darker

   HIS KEYNOTE OF 14-09-2026, slide 13, with the eight frames he
   sent: on the left the room as a thing - a chequered floor, two
   balls, the little box camera hanging in front of them; on the
   right the square photograph it takes. Two hands: the hole, and
   the distance to the film. A big hole is bright and soft; a
   small one dark and sharp. Film close in is a wide, bright
   picture; far back it is a narrow, dark one. On a light ground,
   like the frames.
   ============================================================ */

function modelHoleLight(fig) {
  const p = palette(fig);
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  const controls = el('div', 'controls');
  fig.insertBefore(controls, fig.querySelector('figcaption'));

  const state = { hole: 0.35, dist: 0.35 };
  const fHole = slider(controls, {
    label: 'Size of the hole', min: 0, max: 1, step: 0.01, value: state.hole,
    format: () => '',
  });
  const fDist = slider(controls, {
    label: 'Distance to the film', min: 0, max: 1, step: 0.01, value: state.dist,
    format: () => '',
  });
  const view = canvas(stage, draw);
  [fHole, fDist].forEach((i) => i.addEventListener('input', () => {
    state.hole = +fHole.value;
    state.dist = +fDist.value;
    view.render();
  }));

  /* HIS SECOND ROUND, slide 12: "Move this to here and make it bigger." The
     room was a small drawing in the left half with the photograph beside it;
     both now take the height they have, so the scene and what the camera makes
     of it are read at the same size. */
  /* the room as the camera sees it, drawn once at a size, then cropped,
     blurred and dimmed into the photograph */
  const off = document.createElement('canvas');
  function scene(S) {
    off.width = S; off.height = S;
    const c = off.getContext('2d');
    const sky = c.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0, '#d9d9d9'); sky.addColorStop(0.62, '#f2f2f2'); sky.addColorStop(1, '#c9c9c9');
    c.fillStyle = sky; c.fillRect(0, 0, S, S);
    /* the floor in perspective: chequers converging on the horizon */
    const hz = S * 0.6;
    for (let j = 0; j < 9; j += 1) {
      const t0 = j / 9, t1 = (j + 1) / 9;
      const y0 = hz + (S - hz) * t0 * t0, y1 = hz + (S - hz) * t1 * t1;
      const n = 10;
      for (let i = 0; i < n; i += 1) {
        if ((i + j) % 2) continue;
        const sc0 = 0.35 + 0.65 * t0, sc1 = 0.35 + 0.65 * t1;
        const xa0 = S / 2 + (i / n - 0.5) * S * sc0 * 1.6, xb0 = S / 2 + ((i + 1) / n - 0.5) * S * sc0 * 1.6;
        const xa1 = S / 2 + (i / n - 0.5) * S * sc1 * 1.6, xb1 = S / 2 + ((i + 1) / n - 0.5) * S * sc1 * 1.6;
        c.fillStyle = '#b4b4b4';
        c.beginPath(); c.moveTo(xa0, y0); c.lineTo(xb0, y0); c.lineTo(xb1, y1); c.lineTo(xa1, y1); c.closePath(); c.fill();
      }
    }
    const ball = (x, y, r, col, hi) => {
      const g = c.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      g.addColorStop(0, hi); g.addColorStop(1, col);
      c.fillStyle = 'rgba(0,0,0,0.18)';
      c.beginPath(); c.ellipse(x + r * 0.2, y + r * 0.92, r * 1.05, r * 0.28, 0, 0, Math.PI * 2); c.fill();
      c.fillStyle = g;
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    };
    /* WHAT THE CAMERA ACTUALLY SEES FROM WHERE IT STANDS. His word, 16-09-2026:
       "kamera o açıdan bu görüntüyü mü görür? Perspektif kuralları ne
       gerektiriyorsa onu yap. Kırmızı top solda ve önde, görüntü nerede?"
       The box hangs at the right and BEHIND the balls, looking back at them: so
       the red one, which stands at that side, is the NEAR ball - bigger, lower
       in the frame - and because the camera looks the other way the two swap
       sides, which puts red on the left. The photograph had them the way the
       isometric drawing reads to us, not the way the lens reads them. */
    ball(S * 0.60, hz - S * 0.02, S * 0.09, '#5aa82c', '#b6ee7a');   /* green: far, right, back */
    ball(S * 0.42, hz + S * 0.10, S * 0.15, '#c85a2e', '#f2a27e');   /* red: near, left, in front */
    return off;
  }

  /* the room as a thing, seen from above and to the side */
  function drawRoom(ctx, x, y, w, h) {
    /* THE SPACE LEFT OVER IS PART OF THE DECISION (his rule, and his note on
       this very page: "Move this to here and make it bigger", "Make the camera
       bigger"). The floor was placed at four tenths of a half-width panel and
       the camera at three quarters of it, so the left quarter of the panel was
       empty and the box was a thumbnail. The floor and the box are ONE block
       now - floor, gap, box - and the block is centred in the panel, so what
       is over is margin on both sides and the two things are drawn as large as
       the panel allows. */
    const s = Math.min(h * 0.44, w * 0.30);
    const bs = s * 0.62;                              /* the camera, bigger */
    const floorW = s * 1.8, camW = bs * 1.7, gap = s * 0.4;
    const x0 = x + Math.max(0, (w - (floorW + gap + camW)) / 2);
    const cx = x0 + floorW / 2, cy = y + h * 0.62;
    const camX = x0 + floorW + gap;
    const P = (u, v, z) => [cx + (u - v) * s * 0.9, cy + (u + v) * s * 0.42 - z * s];
    /* the floor */
    for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) {
      const a = P(i / 8 - 0.5, j / 8 - 0.5, 0), b = P((i + 1) / 8 - 0.5, j / 8 - 0.5, 0),
            c = P((i + 1) / 8 - 0.5, (j + 1) / 8 - 0.5, 0), d = P(i / 8 - 0.5, (j + 1) / 8 - 0.5, 0);
      ctx.fillStyle = (i + j) % 2 ? '#c8c8c8' : '#e2e2e2';
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); ctx.fill();
    }
    const ball = (u, v, r, col, hi) => {
      const q = P(u, v, 0);
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.beginPath(); ctx.ellipse(q[0] + r * 0.3, q[1] + r * 0.15, r * 1.1, r * 0.4, 0, 0, Math.PI * 2); ctx.fill();
      const g = ctx.createRadialGradient(q[0] - r * 0.35, q[1] - r - r * 0.4, r * 0.1, q[0], q[1] - r, r);
      g.addColorStop(0, hi); g.addColorStop(1, col);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(q[0], q[1] - r, r, 0, Math.PI * 2); ctx.fill();
    };
    /* HIS SECOND ROUND, 16-09-2026, slide 12: "Arrange items so that would look
       like the image. The camera is on the right back. So the red sphere has to
       be in the back if the photo is taken from that angle." The photograph beside
       this drawing shows the green ball in front and the red one behind it, to the
       right - so that is where they stand here. */
    /* the two balls are the same size - his word, 16-09-2026: "kırmızı topun
       boyutunu yeşille aynı yap". Same size in the room is what lets the
       photograph beside it say something: what differs there is distance. */
    ball(0.30, -0.26, s * 0.2, '#c85a2e', '#f2a27e');     /* behind, to the right */
    ball(0.0, 0.05, s * 0.2, '#5aa82c', '#b6ee7a');       /* in front */
    /* the camera: a box hanging in front of the room, its hole toward the balls
       and its film at the back; it gets deeper with the hand. "Make the camera
       bigger" - same round. */
    const bx = camX, by = y + h * 0.46;
    const dpt = 0.45 + state.dist * 0.9;
    /* front face square, depth receding up and to the right */
    const Q = (u, v, z) => [bx + u * bs + z * bs * 0.62, by - v * bs - z * bs * 0.34];
    const seg = (a, b, col, lw) => {
      ctx.strokeStyle = col; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    };
    ctx.save();
    const f = [Q(0, 0, 0), Q(1, 0, 0), Q(1, 1, 0), Q(0, 1, 0)];
    const b = [Q(0, 0, dpt), Q(1, 0, dpt), Q(1, 1, dpt), Q(0, 1, dpt)];
    /* the faces, translucent, back first */
    const face = (pts, fill) => {
      ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      pts.slice(1).forEach((q) => ctx.lineTo(q[0], q[1])); ctx.closePath(); ctx.fill();
    };
    face(b, 'rgba(0,0,0,0.05)');
    /* the film on the back wall */
    const fm = 0.15;
    face([Q(fm, fm, dpt), Q(1 - fm, fm, dpt), Q(1 - fm, 1 - fm, dpt), Q(fm, 1 - fm, dpt)], 'rgba(90,140,110,0.8)');
    face([f[0], f[1], b[1], b[0]], 'rgba(0,0,0,0.04)');
    face([f[1], f[2], b[2], b[1]], 'rgba(0,0,0,0.06)');
    for (let k = 0; k < 4; k += 1) { seg(b[k], b[(k + 1) % 4], 'rgba(0,0,0,0.3)', 1); seg(f[k], b[k], 'rgba(0,0,0,0.3)', 1); }
    face(f, 'rgba(255,255,255,0.35)');
    for (let k = 0; k < 4; k += 1) seg(f[k], f[(k + 1) % 4], '#c9a23a', 1.6);
    seg(b[1], b[2], '#c9a23a', 1.6); seg(f[1], b[1], '#c9a23a', 1.6); seg(f[2], b[2], '#c9a23a', 1.6);
    /* the hole, facing the room */
    const hc = Q(0.5, 0.5, 0);
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(hc[0], hc[1], 1.2 + state.hole * 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#111'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(hc[0], hc[1], 1.2 + state.hole * 3.5 + 3, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  function draw(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = p.stage;
    ctx.fillRect(0, 0, w, h);

    const pad = 14;
    const S = Math.min(h - pad * 2 - 16, (w - pad * 2) * 0.5);
    const rx = w - pad - S, ry = pad + (h - pad * 2 - S) / 2 + 8;
    drawRoom(ctx, pad, pad, rx - pad - 20, h - pad * 2);
    /* NO NAME ON THIS PANEL, AND NEVER IN THAT PLACE AGAIN. His word,
       16-09-2026: "bu yazı bilgisi hem gereksiz hem de kötü konumlandırılmış.
       Bu senaryo için sil, ileriki zamanlar için de pozisyonunun bu olmayacağını
       not al." It sat above the stage, on the rule, outside the picture it was
       naming - a caption in the page's margin. The drawing says what it is. */

    /* the photograph.
       distance: the film sees a narrower cone, so the picture is a smaller
       piece of the room, magnified; and the light is spread thinner.
       hole: the blur on the film is the hole's own width; the light it lets
       in goes with its area. */
    /* KEYNOTE 16-09, slide 13: "Distance slider is not linear in the
       beginning, it has to be constant." It was: the crop was 1/distance and
       capped at the whole room, so the first quarter of the hand did nothing.
       Now the hand moves the crop evenly, whole room to a quarter of it, and
       the distance is what that crop implies. */
    const crop = 1 - state.dist * 0.75;                  /* 1 .. 0.25 */
    const dist = 0.9 / crop;                             /* 0.9 .. 3.6 */
    const hole = 0.15 + state.hole * 1.85;               /* 0.15 .. 2 */
    const blurPx = (hole * hole * 0.9 + 0.3) * (S / 90) * (0.7 + dist * 0.3);
    /* the light goes with the hole's area over the square of the distance;
       shown in stops, not raw, or the range is a hundredfold and most of the
       slider would be black */
    const ev = Math.log2(((hole / 2) * (hole / 2)) / ((dist / 0.5) * (dist / 0.5)));
    const bright = 1.5 * Math.pow(2, ev * 0.3);

    const src = scene(Math.round(S * 1.5));
    const sw = src.width * Math.min(1, crop), sx0 = (src.width - sw) / 2, sy0 = (src.height - sw) / 2;
    /* the print: a white border round the picture, as in his frames */
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 12;
    ctx.fillRect(rx - 12, ry - 12, S + 24, S + 24);
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.rect(rx, ry, S, S); ctx.clip();
    ctx.fillStyle = '#000'; ctx.fillRect(rx, ry, S, S);
    ctx.filter = 'blur(' + blurPx.toFixed(1) + 'px) brightness(' + bright.toFixed(2) + ')';
    ctx.drawImage(src, sx0, sy0, sw, sw, rx - blurPx, ry - blurPx, S + blurPx * 2, S + blurPx * 2);
    ctx.restore();
    label(ctx, 'WHAT THE CAMERA TAKES', rx, ry - 20, p.muted, 9, 'left');
  }

  return { render: view.render };
}

window.modelHoleLight = modelHoleLight;
