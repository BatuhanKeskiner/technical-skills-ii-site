/* ============================================================
   THE STUDIO, DRAWN
   ------------------------------------------------------------
   Batu's own procedural scene, ported verbatim from the module
   he built on 26-08 (`_notes/parked/format-module/`). A studio
   set in world metres, rendered by honest pinhole projection
   onto a sensor of sw x sh mm behind a lens of focal length f -
   so every instrument that shows "what the camera sees" is
   showing the same optically true picture, and a format or a
   crop changes it the way it would really change it.

   It is here rather than inside one instrument because four of
   them need it: aspect ratio, delivery, crop factor and depth
   of field. His own note on it stands: swap it for a photograph
   by replacing renderScene() with a drawImage.
   ============================================================ */

/* ============ procedural scene ============
   A studio set in world metres. Camera at the origin, 1.5 m above the floor,
   looking down +Z. Rendered by pinhole projection onto a sensor of sw × sh mm
   behind a lens of focal length f, so every figure in this module shares one
   optically honest picture. Swap for a photograph later by replacing
   renderScene() with a drawImage of an embedded base64 JPEG if preferred. */
/* the one orange thing in the room, taken from the site's own signal rather
   than from the module's own accent variable */
const SCENE_ACCENT = (typeof css === 'function')
  ? css('--signal-500', '#FF3B00') : '#FF3B00';

function renderScene(ctx, x, y, w, h, f, sw, sh, ox, oy){
  ox = ox || 0; oy = oy || 0;                       // sensor-plane offset in mm (for crops)
  const CAM_H = 1.5;
  const kx = w / sw, ky = h / sh, cx = x + w/2, cy = y + h/2;
  const P = (X, Y, Z) => [cx + (f*X/Z - ox)*kx, cy + (-f*Y/Z - oy)*ky];
  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath(); pts.forEach((p,i) => { const q = P(p[0],p[1],p[2]); i ? ctx.lineTo(q[0],q[1]) : ctx.moveTo(q[0],q[1]); });
    ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  };
  const rectAt = (X0, X1, Y0, Y1, Z, fill, stroke) => poly([[X0,Y0,Z],[X1,Y0,Z],[X1,Y1,Z],[X0,Y1,Z]], fill, stroke);
  const circ = (X, Y, Z, r, fill) => { const q = P(X,Y,Z); ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(q[0], q[1], f*r/Z*kx, f*r/Z*ky, 0, 0, 7); ctx.fill(); };

  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();

  // backdrop (far wall / sky) — warm studio grey
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#d9d2c6"); g.addColorStop(1, "#c4bcaf");
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);

  // floor: everything below the horizon
  const hy = P(0, -CAM_H, 1e6)[1];
  ctx.fillStyle = "#8a8378"; ctx.fillRect(x, hy, w, y + h - hy);
  const fg = ctx.createLinearGradient(0, hy, 0, y + h);
  fg.addColorStop(0, "rgba(0,0,0,.18)"); fg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = fg; ctx.fillRect(x, hy, w, y + h - hy);

  // back wall panel with window and door, at Z = 16
  rectAt(-14, 14, -CAM_H, 4.6, 16, "#cfc7ba");
  rectAt(-14, 14, -CAM_H, -CAM_H + 0.12, 16, "#7d7669");            // skirting
  rectAt(3.2, 9.4, 0.1, 3.6, 16, "#ebe6dc", "#9a9285");             // window
  for (const X of [5.27, 7.33]) rectAt(X - 0.04, X + 0.04, 0.1, 3.6, 16, "#9a9285");
  rectAt(3.2, 9.4, 1.8, 1.88, 16, "#9a9285");
  rectAt(-9.2, -7.6, -CAM_H, 0.95, 16, "#a89f90", "#7d7669");       // door
  // floor grid
  ctx.strokeStyle = "rgba(255,255,255,.16)"; ctx.lineWidth = 1;
  for (let X = -12; X <= 12; X += 1){ const a = P(X, -CAM_H, 1.2), b = P(X, -CAM_H, 16); ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke(); }
  for (const Z of [1.5,2,2.5,3,3.5,4,5,6,7,8,10,12,14,16]){ const a = P(-14, -CAM_H, Z), b = P(14, -CAM_H, Z); ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke(); }

  // far figure (Z 9.5)
  const person = (X, Z, hgt, col) => {
    const s = hgt / 1.75, y0 = -CAM_H;
    rectAt(X - 0.19*s, X - 0.04*s, y0, y0 + 0.85*s, Z, col);        // legs
    rectAt(X + 0.04*s, X + 0.19*s, y0, y0 + 0.85*s, Z, col);
    poly([[X-0.24*s,y0+0.82*s,Z],[X+0.24*s,y0+0.82*s,Z],[X+0.21*s,y0+1.45*s,Z],[X-0.21*s,y0+1.45*s,Z]], col);  // torso
    rectAt(X - 0.33*s, X - 0.23*s, y0 + 0.85*s, y0 + 1.42*s, Z, col); // arms
    rectAt(X + 0.23*s, X + 0.33*s, y0 + 0.85*s, y0 + 1.42*s, Z, col);
    rectAt(X - 0.06*s, X + 0.06*s, y0 + 1.42*s, y0 + 1.52*s, Z, col); // neck
    circ(X, y0 + 1.63*s, Z, 0.115*s, col);                            // head
  };
  person(2.6, 9.5, 1.7, "#5b554c");

  // light stands
  const stand = (X, Z, top, boxW, boxH, round) => {
    rectAt(X - 0.02, X + 0.02, -CAM_H, top, Z, "#3a3733");
    poly([[X-0.45,-CAM_H,Z-0.3],[X+0.45,-CAM_H,Z-0.3],[X+0.02,-CAM_H+0.5,Z],[X-0.02,-CAM_H+0.5,Z]], "#3a3733");
    if (round){ circ(X, top + boxH/2, Z, boxW/2, "#3a3733"); circ(X, top + boxH/2, Z, boxW/2 - 0.03, "#f4efe6"); }
    else { rectAt(X - boxW/2 - 0.03, X + boxW/2 + 0.03, top - 0.03, top + boxH + 0.03, Z, "#3a3733"); rectAt(X - boxW/2, X + boxW/2, top, top + boxH, Z, "#f4efe6"); }
  };
  stand(-3.3, 6.2, 1.35, 0.95, 0.65, false);
  stand(3.6, 7.4, 1.5, 0.7, 0.7, true);

  // plinths
  const box = (X, Z, s, col, top) => {
    rectAt(X - s/2, X + s/2, -CAM_H, -CAM_H + s, Z - s/2, col);
    poly([[X-s/2,-CAM_H+s,Z-s/2],[X+s/2,-CAM_H+s,Z-s/2],[X+s/2,-CAM_H+s,Z+s/2],[X-s/2,-CAM_H+s,Z+s/2]], top);
  };
  box(-1.7, 5.6, 0.5, "#b3a999", "#cbc2b3");
  box(1.45, 4.3, 0.62, "#b3a999", "#cbc2b3");
  circ(1.45, -CAM_H + 0.62 + 0.14, 4.3 - 0.31, 0.14, SCENE_ACCENT);     // a small orange sphere on the plinth

  // main figure at 5 m
  person(0, 5, 1.76, "#2b2825");

  // near-left chair edge for foreground depth
  rectAt(-2.3, -1.85, -CAM_H, -CAM_H + 0.46, 2.6, "#4b4640");
  rectAt(-2.3, -2.24, -CAM_H + 0.46, -CAM_H + 0.9, 2.6, "#4b4640");

  ctx.restore();
}

/* fit a w:h aspect into a box, centred; returns [x,y,w,h] */
function fitBox(bx, by, bw, bh, aw, ah){
  let w = bw, h = bw * ah / aw;
  if (h > bh){ h = bh; w = bh * aw / ah; }
  return [bx + (bw - w)/2, by + (bh - h)/2, w, h];
}
function hatch(ctx, x, y, w, h, inner){
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h);
  if (inner) ctx.rect(inner[0], inner[1], inner[2], inner[3]);
  ctx.clip("evenodd");
  /* darker on his note of 09-09-2026 - "maske disarida kalan goruntuyu biraz
     daha koyulastirsin" - because at .62 the part that is being thrown away
     still read as part of the picture */
  ctx.fillStyle = "rgba(10,12,14,.82)"; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 1;
  for (let d = -h; d < w + h; d += 14){ ctx.beginPath(); ctx.moveTo(x + d, y); ctx.lineTo(x + d + h, y + h); ctx.stroke(); }
  ctx.restore();
}
