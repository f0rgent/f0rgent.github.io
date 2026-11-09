// Snooze, reimagined. Liquid glass lock screen, 10 snooze controls you can actually use.
const c = document.getElementById('c'); const x = c.getContext('2d');
const PHONE = true;
const W = 1080; const H = PHONE ? Math.round(1080 * Math.max(1.9, Math.min(2.3, (innerHeight || 874) / (innerWidth || 402)))) : 1350;
if (PHONE) { c.width = W; c.height = H; }
const OYm = PHONE ? H - 1710 : 0; let OYc = 0;
const MOCK = /mock/.test(location.search); const ISL = MOCK ? { w: 232, h: 92, y: 34, cx: 536 } : { w: 340, h: 100, y: 32, cx: W / 2 };
const mk = (w = W, h = H) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return [cv, cv.getContext('2d')]; };
const [WP, wp] = mk(); const [BLR, blr] = mk(); const [LY, ly] = mk(); const [TM, tm] = mk(); const [BQ, bq] = mk(270, 338); const [SNAP, snap] = mk(); const [BLS, bls] = mk(270, Math.ceil(H / 4)); const [BQ2, bq2] = mk(270, 338); const [WPS, wps] = mk(); const [AU, au] = mk(270, 338);
const FILTER = !/nofilter/.test(location.search) && (() => { try { const [, tc] = mk(12, 12); tc.filter = 'blur(2px)'; tc.fillStyle = '#fff'; tc.fillRect(5, 5, 2, 2); tc.filter = 'none'; return tc.getImageData(3, 5, 1, 1).data[3] > 8; } catch (e) { return false; } })();
const TB1 = document.createElement('canvas');
function downBlur(src, dq, dw, dh, f) { const w = Math.max(2, Math.round(dw / f)), h = Math.max(2, Math.round(dh / f)); if (TB1.width !== w || TB1.height !== h) { TB1.width = w; TB1.height = h; } const t = TB1.getContext('2d'); t.imageSmoothingQuality = 'high'; t.clearRect(0, 0, w, h); t.drawImage(src, 0, 0, w, h); dq.imageSmoothingEnabled = true; dq.imageSmoothingQuality = 'high'; dq.drawImage(TB1, 0, 0, dw, dh); }
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const E = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const EO = (t) => 1 - Math.pow(1 - t, 3);
const EB = (t) => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
function hex(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mixA(a, b, t, al = 1) { const A = hex(a), B = hex(b); return `rgba(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')},${al})`; }
function rr(q, X, Y, w, h, r) { r = Math.min(r, w / 2, h / 2); q.beginPath(); q.moveTo(X + r, Y); q.arcTo(X + w, Y, X + w, Y + h, r); q.arcTo(X + w, Y + h, X, Y + h, r); q.arcTo(X, Y + h, X, Y, r); q.arcTo(X, Y, X + w, Y, r); q.closePath(); }
let sd = 11; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
const ACC = '#ff7a45';
const PX = 100, PY = 70, PW = 880, PR = 120; const SX = PHONE ? 0 : PX + 22, SY = PY + 22, SW = PHONE ? W : PW - 44, SHH = 1500;
const HZ = 1040;
const STARS = Array.from({ length: PHONE ? 200 : 120 }, () => [rnd() * W, 60 - OYm + rnd() * (900 + OYm), 0.6 + rnd() * 1.9, rnd() * 7]);
const DUST = Array.from({ length: 70 }, () => [rnd(), rnd(), 0.6 + rnd() * 2, rnd() * 7, 0.2 + rnd() * 0.8]);

// ---------------- state ----------------
const S = { mode: 0, t: 0, N: 0, Nt: 0, ring: true, snoozeK: 0, until: '', island: '', cur: { x: 2000, y: 2000, down: false, show: false }, fade: 0, overlay: null, ev: [] };
function log(type) { S.ev.push([S.t, type, S.mode]); }

// ---------------- wallpaper ----------------
function wallpaper(q, t, k, full = false) {
  q.setTransform(1, 0, 0, 1, 0, OYm);
  const sky = q.createLinearGradient(0, 80, 0, 1350);
  sky.addColorStop(0, mixA('#2c2a63', '#03061a', k)); sky.addColorStop(0.42, mixA('#b4557a', '#0d1240', k)); sky.addColorStop(0.72, mixA('#ff9a5a', '#1a1d52', k)); sky.addColorStop(1, mixA('#ffc27a', '#20245e', k));
  q.fillStyle = sky; q.fillRect(0, -OYm - 10, W, H + 20);
  for (const [sx, sy, sr, ph] of STARS) { const a = k * (0.35 + 0.65 * Math.abs(Math.sin(t * 1.7 + ph))); if (a < 0.02) continue; q.fillStyle = `rgba(225,232,255,${a})`; q.beginPath(); q.arc(sx, sy, sr, 0, 6.29); q.fill(); }
  if (k > 0.25) { const ak = (k - 0.25) / 0.75; au.setTransform(1, 0, 0, 1, 0, 0); au.clearRect(0, 0, 270, 338); au.setTransform(0.25, 0, 0, 0.25, 0, 0); if (FILTER) au.filter = 'blur(5px)';
    for (let b = 0; b < 3; b++) { au.beginPath(); const y0 = 300 + b * 70; for (let i = 0; i <= 24; i++) { const xx = -60 + i * (W + 120) / 24; const yy = y0 + Math.sin(i * 0.55 + t * (0.5 + b * 0.2) + b) * 40 + Math.sin(i * 0.21 - t * 0.3) * 30; i ? au.lineTo(xx, yy) : au.moveTo(xx, yy); }
      for (let i = 24; i >= 0; i--) { const xx = -60 + i * (W + 120) / 24; const yy = y0 + 150 + b * 20 + Math.sin(i * 0.5 + t * 0.4 + b * 2) * 50; au.lineTo(xx, yy); } au.closePath();
      const ag = au.createLinearGradient(0, y0 - 40, 0, y0 + 220); ag.addColorStop(0, `rgba(80,255,180,${0.32 * ak})`); ag.addColorStop(0.5, `rgba(90,140,255,${0.18 * ak})`); ag.addColorStop(1, 'rgba(170,80,255,0)'); au.fillStyle = ag; au.fill(); }
    au.filter = 'none'; q.save(); q.globalCompositeOperation = 'lighter'; if (FILTER) q.drawImage(AU, 0, 0, W, 1350); else downBlur(AU, q, W, 1350, 12); q.restore(); }
  const base = (S.overlay ? 120 : S.mode === 0 ? 0 : 175); const sunX = W / 2, sunY = lerp(HZ - 170 + base, HZ + 280, k), R = 130;
  const halo = q.createRadialGradient(sunX, sunY, R * 0.5, sunX, sunY, R * 5.2);
  halo.addColorStop(0, mixA('#ffd99a', '#ff7a4a', k, 0.8 * (1 - k * 0.9))); halo.addColorStop(1, 'rgba(255,140,60,0)');
  q.fillStyle = halo; q.fillRect(0, 0, W, H);
  q.save(); q.globalCompositeOperation = 'lighter'; q.translate(sunX, sunY); q.rotate(t * 0.05);
  for (let i = 0; i < 16; i++) { q.rotate(Math.PI * 2 / 16); const a = 0.06 * (1 - k) * (0.6 + 0.4 * Math.sin(t * 1.3 + i)); if (a < 0.003) continue; const rg = q.createLinearGradient(0, 0, 0, -1000); rg.addColorStop(0, `rgba(255,205,130,${a})`); rg.addColorStop(1, 'rgba(255,205,130,0)'); q.fillStyle = rg; q.beginPath(); q.moveTo(-16, 0); q.lineTo(-90, -1000); q.lineTo(90, -1000); q.lineTo(16, 0); q.fill(); }
  q.restore();
  const sg = q.createRadialGradient(sunX - 34, sunY - 38, 10, sunX, sunY, R);
  sg.addColorStop(0, '#fff8e6'); sg.addColorStop(0.45, mixA('#ffd682', '#ffa060', k)); sg.addColorStop(1, mixA('#ffb347', '#ff6a3d', k));
  q.fillStyle = sg; q.beginPath(); q.arc(sunX, sunY, R, 0, 6.29); q.fill();
  const mk2 = E(clamp((k - 0.35) / 0.65)); const mx = 250, my = lerp(HZ + 140, 860, mk2);
  if (mk2 > 0) { q.save(); q.globalAlpha = mk2; const mg = q.createRadialGradient(mx, my, 10, mx, my, 240); mg.addColorStop(0, 'rgba(170,190,255,0.35)'); mg.addColorStop(1, 'rgba(170,190,255,0)'); q.fillStyle = mg; q.fillRect(0, 0, W, H);
    q.beginPath(); q.arc(mx, my, 46, 0, 6.29); q.clip(); q.fillStyle = '#eef1ff'; q.beginPath(); q.rect(mx - 60, my - 60, 120, 120); q.arc(mx + 22, my - 12, 42, 0, 6.29); q.fill('evenodd'); q.restore(); }
  const hill = (o, amp) => { q.beginPath(); q.moveTo(-10, HZ + 30 + o); q.bezierCurveTo(260, HZ - 70 * amp + o, 470, HZ + 80 + o, 620, HZ + 10 + o); q.bezierCurveTo(780, HZ - 50 * amp + o, 900, HZ - 10 + o, W + 10, HZ + 30 + o); q.lineTo(W + 10, H + 10); q.lineTo(-10, H + 10); q.closePath(); };
  hill(0, 1); const hg = q.createLinearGradient(0, HZ - 60, 0, H); hg.addColorStop(0, mixA('#3a1c3e', '#080a1e', k)); hg.addColorStop(1, mixA('#160b1e', '#03040c', k)); q.fillStyle = hg; q.fill();
  hill(0, 1); q.lineWidth = 3; q.strokeStyle = mixA('#ffc070', '#7d8cff', k, 0.8); q.shadowColor = mixA('#ffb050', '#5d70ff', k, 0.9); q.shadowBlur = 20; q.stroke(); q.shadowBlur = 0;
  hill(100, 0.6); q.fillStyle = mixA('#1d0f22', '#05060f', k, 0.92); q.fill();
  q.save(); q.globalCompositeOperation = 'lighter';
  for (const [dx, dy, dr, ph, sp] of DUST) { const a = (1 - k) * 0.55 * (0.5 + 0.5 * Math.sin(t * 2 + ph)); if (a < 0.01) continue; const px = dx * W + Math.sin(t * sp + ph) * 14, py = 300 + ((dy * 700 - t * 12 * sp) % 700 + 700) % 700; q.fillStyle = `rgba(255,220,170,${a})`; q.beginPath(); q.arc(px, py, dr, 0, 6.29); q.fill(); }
  q.restore();
  return { sunX, sunY, R };
}

// ---------------- liquid glass with volume ----------------
// shape(q, mode): mode 'fill' | 'stroke'. bb = [x,y,w,h]
function glass(shape, bb, o = {}) {
  const [bx, by, bw, bh] = bb; const cx = bx + bw / 2, cy = by + bh / 2;
  const pad = 60; const cx0 = Math.floor(bx - pad), cy0 = Math.floor(by - pad), cw = Math.ceil(bw + pad * 2), ch = Math.ceil(bh + pad * 2);
  const thick = o.thick ?? Math.min(26, Math.min(bw, bh) * 0.22);
  const tint = o.tint ?? 0.1, mag = o.mag ?? 1.06, edgeMag = o.edgeMag ?? 1.32;
  // caustic: light the glass throws onto the wallpaper below it (shadow trick, no filter)
  x.save(); x.globalCompositeOperation = 'lighter'; x.globalAlpha = (o.caustic ?? 0.22) * (1 - S.N * 0.6); x.shadowColor = 'rgba(255,214,170,1)'; x.shadowBlur = 40; x.shadowOffsetX = 4000; x.shadowOffsetY = bh * 0.16 + 18;
  x.translate(-4000, 0); shapeFill(x, shape, '#000'); x.restore();
  x.save(); x.globalAlpha = 0.5; x.shadowColor = 'rgba(10,5,25,1)'; x.shadowBlur = 36; x.shadowOffsetX = 4000; x.shadowOffsetY = 18; x.translate(-4000, 0); shapeFill(x, shape, '#000'); x.restore();
  // layer
  ly.setTransform(1, 0, 0, 1, 0, 0); ly.clearRect(cx0, cy0, cw, ch);
  ly.save(); ly.beginPath(); ly.rect(cx0, cy0, cw, ch); ly.clip();
  // body: softly magnified blurred backdrop
  ly.save(); ly.translate(cx, cy); ly.scale(mag, mag); ly.translate(-cx, -cy); ly.drawImage(BLR, 0, -OYc); ly.restore();
  // edge band: stronger lensing near the rim = thickness
  tm.setTransform(1, 0, 0, 1, 0, 0); tm.clearRect(cx0, cy0, cw, ch);
  tm.save(); tm.beginPath(); tm.rect(cx0, cy0, cw, ch); tm.clip(); tm.translate(cx, cy); tm.scale(edgeMag, edgeMag * 1.04); tm.translate(-cx, -cy); tm.drawImage(WPS, 0, -OYc); tm.restore();
  tm.save(); tm.globalCompositeOperation = 'destination-in'; tm.lineWidth = thick * 2; tm.strokeStyle = '#000'; tm.lineJoin = 'round'; shape(tm, 'stroke'); tm.restore();
  ly.drawImage(TM, cx0, cy0, cw, ch, cx0, cy0, cw, ch);
  // tint + top light
  ly.fillStyle = `rgba(255,255,255,${tint})`; ly.fillRect(cx0, cy0, cw, ch);
  const lg = ly.createLinearGradient(0, by, 0, by + bh); lg.addColorStop(0, 'rgba(255,255,255,0.20)'); lg.addColorStop(0.5, 'rgba(255,255,255,0.0)'); lg.addColorStop(1, 'rgba(255,255,255,0.05)'); ly.fillStyle = lg; ly.fillRect(cx0, cy0, cw, ch);
  // inner bevel: light from top-left, shade bottom-right
  softStroke(ly, shape, 'rgba(255,255,255,0.75)', thick * 0.7, Math.max(3, thick * 0.35), -thick * 0.18, -thick * 0.28);
  softStroke(ly, shape, 'rgba(30,10,50,0.45)', thick * 0.8, Math.max(3, thick * 0.4), thick * 0.22, thick * 0.34);
  // specular hotspot
  if (o.spec !== false) { ly.save(); ly.globalCompositeOperation = 'lighter'; const sx = bx + bw * 0.22, sy = by + bh * 0.16; const sr = Math.max(18, Math.min(bw, bh) * 0.32); const sp = ly.createRadialGradient(sx, sy, 0, sx, sy, sr); sp.addColorStop(0, 'rgba(255,255,255,0.55)'); sp.addColorStop(1, 'rgba(255,255,255,0)'); ly.fillStyle = sp; ly.beginPath(); ly.ellipse(sx, sy, sr * 1.6, sr * 0.7, -0.35, 0, 6.29); ly.fill(); ly.restore(); }
  // mask to shape
  ly.restore();
  ly.globalCompositeOperation = 'destination-in'; ly.fillStyle = '#000'; shape(ly, 'fill'); ly.globalCompositeOperation = 'source-over';
  x.drawImage(LY, cx0, cy0, cw, ch, cx0, cy0, cw, ch);
  if (o.dark) { x.save(); const dg = x.createLinearGradient(0, by, 0, by + bh); dg.addColorStop(0, `rgba(18,10,34,${o.dark * 0.7})`); dg.addColorStop(1, `rgba(10,6,24,${o.dark})`); x.fillStyle = dg; shape(x, 'fill'); x.restore(); }
  // rim: crisp specular line + chromatic fringe
  x.save(); x.lineJoin = 'round';
  x.globalCompositeOperation = 'lighter'; x.lineWidth = 1.6;
  x.globalAlpha = 0.55; x.lineWidth = 2.4; x.strokeStyle = 'rgba(255,60,90,1)'; x.save(); x.translate(-2.4, -1.2); shape(x, 'stroke'); x.restore();
  x.strokeStyle = 'rgba(70,140,255,1)'; x.save(); x.translate(2.4, 1.2); shape(x, 'stroke'); x.restore(); x.strokeStyle = 'rgba(120,255,140,0.8)'; x.save(); x.translate(0.6, -1.8); shape(x, 'stroke'); x.restore();
  x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
  const rim = x.createLinearGradient(bx, by, bx + bw, by + bh); rim.addColorStop(0, 'rgba(255,255,255,0.95)'); rim.addColorStop(0.3, 'rgba(255,255,255,0.25)'); rim.addColorStop(0.65, 'rgba(255,255,255,0.08)'); rim.addColorStop(1, 'rgba(255,255,255,0.6)');
  x.strokeStyle = rim; x.lineWidth = o.rim ?? 2; shape(x, 'stroke'); x.restore();
  if (o.edge !== false) edgeLight(shape, bb);
}
function softStroke(q, shape, col, lw, blur, dx, dy) {
  q.save(); q.lineJoin = 'round'; q.lineWidth = lw;
  if (FILTER) { q.filter = `blur(${blur}px)`; q.translate(dx, dy); q.strokeStyle = col; shape(q, 'stroke'); }
  else { q.shadowColor = col; q.shadowBlur = blur * 2; q.shadowOffsetX = 4000; q.shadowOffsetY = 0; q.translate(dx - 4000, dy); q.strokeStyle = '#000'; shape(q, 'stroke'); }
  q.restore();
}
function edgeLight(shape, bb) {
  const [bx, by, bw, bh] = bb; const n = S.N;
  const day = [255, 178, 70], night = [110, 140, 255];
  const col = (a) => `rgba(${day.map((v, i) => Math.round(lerp(v, night[i], n))).join(',')},${a})`;
  const g = x.createLinearGradient(0, by - 2, 0, by + bh + 2);
  g.addColorStop(0, col(1 - n)); g.addColorStop(0.28, col(0)); g.addColorStop(0.72, col(0)); g.addColorStop(1, col(n));
  x.save(); x.globalCompositeOperation = 'lighter'; x.lineJoin = 'round';
  x.shadowColor = col(0.9); x.shadowBlur = 22; x.strokeStyle = g; x.lineWidth = 3.2; shape(x, 'stroke');
  x.shadowBlur = 0; x.lineWidth = 1.4; x.strokeStyle = g; shape(x, 'stroke');
  // spill on the backdrop
  const sy = lerp(by - 10, by + bh + 10, n); const sR = Math.max(bw, bh) * 0.6; const sp = x.createRadialGradient(bx + bw / 2, sy, 0, bx + bw / 2, sy, sR);
  sp.addColorStop(0, col(0.16)); sp.addColorStop(1, col(0)); x.fillStyle = sp; x.fillRect(bx + bw / 2 - sR, sy - sR, sR * 2, sR * 2);
  x.restore();
}
// LED dot-matrix icons
const GRID = 17;
const ICONS = {
  bell: (u, v) => { const yy = v; if (yy > 0.78 && yy < 0.86) return Math.abs(u) < 0.42; if (yy >= 0.86) return Math.abs(u) < 0.1 && yy < 0.97; if (yy < 0.1) return Math.abs(u) < 0.07 && yy > 0.02; const w = 0.12 + 0.24 * Math.pow((yy - 0.1) / 0.68, 0.7); return Math.abs(u) < w; },
  sun: (u, v) => { const r = Math.hypot(u, v - 0.5); if (r < 0.2) return true; const a = Math.atan2(v - 0.5, u); const ray = Math.abs(Math.sin(a * 4)) < 0.22; return ray && r > 0.3 && r < 0.46; },
  cat: (u, v) => { const ear = (k) => v > 0.1 && v < 0.42 && Math.abs(u - k * 0.25) < (v - 0.1) / 0.32 * 0.15; const head = Math.hypot(u / 1.08, v - 0.6) < 0.33; if (!(head || ear(-1) || ear(1))) return false; if (Math.hypot(Math.abs(u) - 0.14, v - 0.56) < 0.065) return false; if (Math.abs(u) < 0.035 && Math.abs(v - 0.7) < 0.03) return false; return true; },
  catz: (u, v) => { const ear = (k) => v > 0.1 && v < 0.42 && Math.abs(u - k * 0.25) < (v - 0.1) / 0.32 * 0.15; const head = Math.hypot(u / 1.08, v - 0.6) < 0.33; if (!(head || ear(-1) || ear(1))) return false; if (Math.abs(v - 0.575 + Math.abs(Math.abs(u) - 0.14) * 0.35) < 0.028 && Math.abs(Math.abs(u) - 0.14) < 0.09) return false; if (Math.abs(u) < 0.035 && Math.abs(v - 0.7) < 0.03) return false; return true; },
  sheep: (u, v) => { if (Math.hypot((u + 0.06) / 0.33, (v - 0.48) / 0.22) < 1) return true; if (Math.hypot((u - 0.32) / 0.12, (v - 0.42) / 0.1) < 1) return true; return v > 0.6 && v < 0.86 && (Math.abs(u + 0.2) < 0.04 || Math.abs(u - 0.1) < 0.04); },
  moon: (u, v) => { const r1 = Math.hypot(u + 0.02, v - 0.52), r2 = Math.hypot(u - 0.17, v - 0.4); const star = (Math.abs(u - 0.33) < 0.035 && Math.abs(v - 0.16) < 0.09) || (Math.abs(u - 0.33) < 0.09 && Math.abs(v - 0.16) < 0.035); return (r1 < 0.36 && r2 > 0.3) || star; },
};
function dotIcon(cx, cy, size, a, b, m, ang = 0, glow = true) {
  const step = size / GRID, dot = step * 0.72; const A = ICONS[a], B = ICONS[b];
  x.save(); x.translate(cx, cy); x.rotate(ang);
  if (glow) { x.shadowColor = mixA('#6a2a12', '#ffffff', S.N, lerp(0.75, 0.8, S.N)); x.shadowBlur = step * lerp(0.9, 1.3, S.N); x.shadowOffsetY = lerp(1.5, 0, S.N); }
  for (let i = 0; i < GRID; i++) for (let j = 0; j < GRID; j++) {
    const u = (i + 0.5) / GRID - 0.5, v = (j + 0.5) / GRID;
    const stg = clamp(m * 1.8 - (j / GRID) * 0.8); const on = lerp(A(u, v) ? 1 : 0, B(u, v) ? 1 : 0, E(stg));
    const px = -size / 2 + i * step + (step - dot) / 2, py = -size / 2 + j * step + (step - dot) / 2;
    x.fillStyle = on > 0.02 ? `rgba(255,255,255,${0.12 + 0.88 * on})` : 'rgba(255,255,255,0.07)';
    if (on > 0.02 || !glow) { rr(x, px, py, dot, dot, dot * 0.3); x.fill(); } else { x.save(); x.shadowBlur = 0; rr(x, px, py, dot, dot, dot * 0.3); x.fill(); x.restore(); }
  }
  x.restore();
}
function shapeFill(q, shape, col) { q.fillStyle = col; shape(q, 'fill'); }
const RR = (X, Y, w, h, r) => (q, m) => { rr(q, X, Y, w, h, r); m === 'fill' ? q.fill() : q.stroke(); };
const CIRC = (X, Y, r) => (q, m) => { q.beginPath(); q.arc(X, Y, r, 0, 6.29); m === 'fill' ? q.fill() : q.stroke(); };
const TXT = (s, X, Y, f) => (q, m) => { q.save(); q.font = f; q.textAlign = 'center'; q.textBaseline = 'alphabetic'; m === 'fill' ? q.fillText(s, X, Y) : q.strokeText(s, X, Y); q.restore(); };
function measure(s, f) { x.save(); x.font = f; const w = x.measureText(s).width; x.restore(); return w; }

// ---------------- UI pieces ----------------
function bell(q, X, Y, s, ang, col = '#fff') { q.save(); q.translate(X, Y); q.rotate(ang); q.scale(s, s); q.fillStyle = col; q.beginPath(); q.moveTo(-17, 11); q.quadraticCurveTo(-15, -18, 0, -20); q.quadraticCurveTo(15, -18, 17, 11); q.lineTo(21, 16); q.lineTo(-21, 16); q.closePath(); q.fill(); q.beginPath(); q.arc(0, 20, 5, 0, 6.29); q.fill(); q.beginPath(); q.arc(0, -22, 3.5, 0, 6.29); q.fill(); q.restore(); }
function label(s, X, Y, f, col = '#fff', al = 1) { x.save(); x.globalAlpha = al; x.fillStyle = col; x.font = f; x.textAlign = 'center'; x.textBaseline = 'middle'; x.shadowColor = 'rgba(0,0,0,0.25)'; x.shadowBlur = 8; x.fillText(s, X, Y); x.restore(); }
function hint(s) { const a = S.ring ? 0.9 * (0.75 + 0.25 * Math.sin(S.t * 3)) : 0; if (a > 0) label(s, W / 2, 1150, '600 34px "Inter"', '#fff', a * (1 - S.snoozeK)); }

// ---------------- modes ----------------
const M = [];
function snooze(mins, until, island) { if (!S.ring) return; S.ring = false; S.until = until; S.island = island; S.Nt = 1; log('snooze'); }
function timeMinus(m) { return m <= 0 ? '7:00' : `6:${String(60 - m).padStart(2, '0')}`; }

// 1 — push the sun back down
M.push({ name: 'Push the sun back down', init() { this.drag = null; }, down(p) { const sy = lerp(HZ - 170, HZ + 280, S.N); if (S.ring && Math.hypot(p.x - W / 2, p.y - sy) < 190) { this.drag = { y0: p.y, n0: S.N }; log('grab'); } },
  move(p) { if (this.drag) { S.N = clamp(this.drag.n0 + (p.y - this.drag.y0) / 430); S.Nt = S.N; } },
  up() { if (!this.drag) return; this.drag = null; if (S.N > 0.55) snooze(9, '7:09', 'Snoozed · 9 min'); else S.Nt = 0; },
  step() {}, draw() { hint('drag the sun down ↓'); }, time() { return S.ring ? '7:00' : '7:09'; } });

// 2 — wind time back
M.push({ name: 'Wind time back', init() { this.rot = 0; this.a = null; this.vis = 0; }, C: { x: W / 2, y: 900, r: 150 },
  down(p) { const C = this.C; if (S.ring && Math.hypot(p.x - C.x, p.y - C.y) < C.r + 30) { this.a = Math.atan2(p.y - C.y, p.x - C.x); log('grab'); } },
  move(p) { if (this.a === null) return; const C = this.C; const a = Math.atan2(p.y - C.y, p.x - C.x); let d = a - this.a; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; const before = this.mins(); this.rot = clamp(this.rot - d, 0, Math.PI * 2); this.a = a; if (this.mins() !== before) log('tick'); if (this.mins() >= 9) { this.a = null; snooze(9, '6:51', 'Snoozed · 9 min'); } },
  up() { this.a = null; }, mins() { return Math.min(9, Math.floor(this.rot / (Math.PI * 2) * 9 + 0.001)); },
  step(dt) { if (this.a === null && S.ring) this.rot = Math.max(0, this.rot - dt * 1.5); },
  draw() { const C = this.C; const m = this.mins();
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 - i * (Math.PI * 2 / 9) - 0.35; const on = i < m; x.save(); x.strokeStyle = on ? '#fff' : 'rgba(255,255,255,0.35)'; x.lineWidth = on ? 6 : 4; x.lineCap = 'round'; x.shadowColor = on ? ACC : 'transparent'; x.shadowBlur = on ? 16 : 0; x.beginPath(); x.moveTo(C.x + Math.cos(a) * (C.r + 26), C.y + Math.sin(a) * (C.r + 26)); x.lineTo(C.x + Math.cos(a) * (C.r + 46), C.y + Math.sin(a) * (C.r + 46)); x.stroke(); x.restore(); }
    glass(CIRC(C.x, C.y, C.r), [C.x - C.r, C.y - C.r, C.r * 2, C.r * 2], { thick: 30, mag: 1.1, edgeMag: 1.4 });
    // grip ridges
    x.save(); x.translate(C.x, C.y); x.rotate(-this.rot); x.strokeStyle = 'rgba(255,255,255,0.22)'; x.lineWidth = 3; for (let i = 0; i < 36; i++) { x.rotate(Math.PI / 18); x.beginPath(); x.moveTo(0, C.r - 10); x.lineTo(0, C.r - 24); x.stroke(); }
    x.fillStyle = '#fff'; x.shadowColor = ACC; x.shadowBlur = 20; x.beginPath(); x.arc(0, -C.r + 48, 14, 0, 6.29); x.fill(); x.restore();
    label(`+${m} min`, C.x, C.y + 6, '700 50px "Inter"');
    hint('turn it back ↺'); }, time() { return timeMinus(this.mins()); } });

// 3 — hold until it hushes
M.push({ name: 'Hold it until it hushes', init() { this.h = 0; this.on = false; }, C: { x: W / 2, y: 900, r: 125 },
  down(p) { const C = this.C; if (S.ring && Math.hypot(p.x - C.x, p.y - C.y) < C.r + 20) { this.on = true; log('hold'); } }, move() {}, up() { if (this.on) log('release'); this.on = false; },
  step(dt) { if (!S.ring) return; this.h = clamp(this.h + (this.on ? dt / 1.6 : -dt * 1.2)); if (this.h >= 1) { this.on = false; snooze(9, '7:09', 'Snoozed · 9 min'); } },
  shake() { return 1 - E(this.h); },
  draw() { const C = this.C; const h = S.ring ? this.h : 1;
    // sound waves
    x.save(); x.strokeStyle = '#fff'; x.lineWidth = 4; for (let i = 0; i < 3; i++) { const ph = (S.t * 1.4 + i / 3) % 1; x.globalAlpha = (1 - h) * (1 - ph) * 0.5 * (S.ring ? 1 : 0); x.beginPath(); x.arc(C.x, C.y, C.r + 30 + ph * 140, 0, 6.29); x.stroke(); } x.restore();
    x.save(); x.lineCap = 'round'; x.lineWidth = 12; x.strokeStyle = 'rgba(255,255,255,0.18)'; x.beginPath(); x.arc(C.x, C.y, C.r + 34, 0, 6.29); x.stroke();
    if (h > 0) { x.strokeStyle = '#fff'; x.shadowColor = ACC; x.shadowBlur = 24; x.beginPath(); x.arc(C.x, C.y, C.r + 34, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * h); x.stroke(); } x.restore();
    const s = this.on ? 0.94 : 1;
    glass(CIRC(C.x, C.y, C.r * s), [C.x - C.r * s, C.y - C.r * s, C.r * 2 * s, C.r * 2 * s], { thick: 30, mag: 1.12, edgeMag: 1.42 });
    dotIcon(C.x, C.y + 4, 150 * s, 'bell', 'moon', S.snoozeK, Math.sin(S.t * 38) * 0.25 * (1 - h) * (S.ring ? 1 : 0));
    hint(h > 0.05 && S.ring ? 'shhh… keep holding' : 'press and hold'); }, time() { return S.ring ? '7:00' : '7:09'; } });

// 4 — shrinks every time
M.push({ name: 'It shrinks every time', init() { this.n = 0; this.s = 1; this.pk = 0; this.gone = 0; },
  L: ['Snooze · 9 min', 'Snooze · 5 min', '1 min', 'no.'], SC: [1, 0.66, 0.44, 0.24],
  down(p) { if (!S.ring) return; const w = 440 * this.s, h = 130 * this.s; if (Math.abs(p.x - W / 2) < w / 2 + 10 && Math.abs(p.y - 900) < h / 2 + 10) { this.pk = 1; log('tap'); this.n++; if (this.n >= 4) { this.goneT = 0.001; snooze(0.5, '7:00:30', 'Snoozed · 30 sec'); } } }, move() {}, up() {},
  step(dt) { const tgt = this.SC[Math.min(3, this.n)]; this.s += (tgt - this.s) * Math.min(1, dt * 14); this.pk = Math.max(0, this.pk - dt * 6); if (this.goneT) this.gone = Math.min(1, this.gone + dt * 4); },
  draw() { const sc = this.s * (1 - 0.06 * this.pk) * (1 - this.gone); if (sc > 0.02) { const w = 440 * sc, h = 130 * sc;
      glass(RR(W / 2 - w / 2, 900 - h / 2, w, h, h / 2), [W / 2 - w / 2, 900 - h / 2, w, h], { thick: Math.max(8, 26 * sc), tint: 0.12 });
      label(this.L[Math.min(3, this.n)], W / 2, 902, `700 ${Math.round(46 * Math.max(sc, 0.5))}px "Inter"`); }
    if (this.gone > 0 && this.gone < 1) { x.save(); x.globalAlpha = 1 - this.gone; x.strokeStyle = '#fff'; x.lineWidth = 4; x.beginPath(); x.arc(W / 2, 900, 30 + this.gone * 120, 0, 6.29); x.stroke(); x.restore(); }
    hint(this.n === 0 ? 'tap snooze' : this.n === 1 ? 'getting smaller…' : 'last chance'); }, time() { return S.ring ? '7:00' : '7:00'; } });

// 5 — bargain with it
M.push({ name: 'Bargain with it', init() { this.v = 0; this.drag = false; this.settle = 0; this.deal = 0; this.ask = 0; }, X0: 250, X1: 830, Y: 920,
  down(p) { const kx = lerp(this.X0, this.X1, this.v); if (S.ring && Math.hypot(p.x - kx, p.y - this.Y) < 80) { this.drag = true; log('grab'); } },
  move(p) { if (!this.drag) return; const v = clamp((p.x - this.X0) / (this.X1 - this.X0)); if (Math.round(v * 5) !== Math.round(this.v * 5)) log('tick'); this.v = v; },
  up() { if (!this.drag) return; this.drag = false; if (this.v < 0.05) return; this.ask = this.mins(); this.deal = Math.min(15, this.ask); this.tv = (this.deal - 5) / 25; this.settle = 0.001; log('settle'); },
  step(dt) { if (this.settle > 0 && this.settle < 1) { this.settle = Math.min(1, this.settle + dt * 2.2); this.v = lerp(this.v, this.tv, Math.min(1, dt * 8)); if (this.settle >= 1) { this.v = this.tv; snooze(this.deal, `7:${String(this.deal).padStart(2, '0')}`, `Snoozed · ${this.deal} min`); } } },
  mins() { return Math.round((5 + this.v * 25) / 5) * 5; },
  draw() { const m = this.mins(); const kx = lerp(this.X0, this.X1, this.v);
    const say = this.settle > 0 ? (this.ask > 15 ? `${this.ask}? no. 15, final offer.` : `${this.deal}? deal.`) : !this.drag && this.v < 0.05 ? 'how long?' : m <= 10 ? `${m} min? fine` : m <= 20 ? `${m}?? hmm.` : `${m}?! absolutely not`;
    const f = '700 40px "Inter"'; const w = measure(say, f) + 90;
    glass(RR(W / 2 - w / 2, 760, w, 96, 48), [W / 2 - w / 2, 760, w, 96], { thick: 18 });
    label(say, W / 2, 810, f, m > 20 && this.settle === 0 ? '#ffd0c4' : '#fff');
    glass(RR(this.X0 - 70, this.Y - 46, this.X1 - this.X0 + 140, 92, 46), [this.X0 - 70, this.Y - 46, this.X1 - this.X0 + 140, 92], { thick: 16, tint: 0.06, spec: false });
    x.save(); x.fillStyle = mixA('#ffffff', '#ff6a4a', clamp((this.v - 0.4) / 0.6), 0.35); rr(x, this.X0 - 56, this.Y - 32, kx - this.X0 + 112, 64, 32); x.fill(); x.restore();
    const ks = this.drag ? 1.12 : 1;
    glass(CIRC(kx, this.Y, 58 * ks), [kx - 58 * ks, this.Y - 58 * ks, 116 * ks, 116 * ks], { thick: 20, mag: 1.2, edgeMag: 1.5 });
    label(String(m), kx, this.Y + 3, '800 34px "Inter"');
    hint('slide to bargain →'); }, time() { return S.ring ? '7:00' : `7:${String(this.deal).padStart(2, '0')}`; } });

// 6 — the honest one
M.push({ name: 'The honest one', init() { this.run = 0; this.on = false; this.n = 0; },
  down(p) { if (S.ring && !this.on && Math.abs(p.x - W / 2) < 200 && Math.abs(p.y - 960) < 70) { this.on = true; this.run = 0.0001; log('tap'); } }, move() {}, up() {},
  step(dt) { if (this.on && this.run < 1) { const before = this.count(); this.run = Math.min(1, this.run + dt / 1.6); if (this.count() !== before) log('tick'); if (this.run >= 1) { S.ring = false; S.until = '7:36'; S.island = "You're late"; log('late'); } } },
  count() { return Math.min(4, Math.floor(this.run * 4.0001)); },
  shake() { return this.on && this.run < 1 ? 0.5 : S.ring ? 1 : 0; },
  draw() { const late = this.run >= 1; const n = this.count();
    const cy = 760; glass(RR(SX + 45, cy, SW - 90, 110, 38), [SX + 45, cy, SW - 90, 110], { thick: 18, tint: late ? 0.0 : 0.1 });
    if (late) { x.save(); x.globalAlpha = 0.55; x.fillStyle = '#ff3b3b'; rr(x, SX + 45, cy, SW - 90, 110, 38); x.fill(); x.restore(); }
    x.save(); x.textAlign = 'left'; x.fillStyle = '#fff'; x.font = '700 34px "Inter"'; x.fillText('Standup · 7:30', SX + 95, cy + 48); x.globalAlpha = 0.85; x.font = '500 28px "Inter"'; x.fillText(late ? 'Started 6 min ago' : 'Calendar', SX + 95, cy + 86); x.restore();
    const pw = 380, ph = 120; glass(RR(W / 2 - pw / 2, 960 - ph / 2, pw, ph, 60), [W / 2 - pw / 2, 960 - ph / 2, pw, ph], { thick: 24, tint: 0.12 });
    label(this.on ? `snooze ×${n || 1}` : 'Snooze', W / 2, 962, '700 44px "Inter"');
    hint('tap snooze'); }, time() { const m = this.on ? Math.min(36, (this.count()) * 9) : 0; return `7:${String(m).padStart(2, '0')}`; } });

// 7 — pet the cat
M.push({ name: 'Pet the cat', init() { this.d = 0; this.lx = null; this.on = false; this.pk = 0; }, C: { x: W / 2, y: 930, s: 330 },
  down(p) { const C = this.C; if (S.ring && Math.abs(p.x - C.x) < C.s / 2 + 20 && Math.abs(p.y - C.y) < C.s / 2 + 20) { this.on = true; this.lx = p.x; log('grab'); } },
  move(p) { if (!this.on || !S.ring) return; const before = Math.floor(this.d / 260); this.d += Math.abs(p.x - this.lx); this.lx = p.x; if (Math.floor(this.d / 260) !== before) { log('purr'); this.pk = 1; } if (this.d >= 1500) { this.on = false; snooze(9, '7:09', 'Snoozed · 9 min'); } },
  up() { this.on = false; },
  step(dt) { this.pk = Math.max(0, this.pk - dt * 2); if (!this.on && S.ring) this.d = Math.max(0, this.d - dt * 120); },
  shake() { return 1 - clamp(this.d / 1500); },
  draw() { const C = this.C; const k = S.ring ? clamp(this.d / 1500) : 1; const s = C.s * (this.on ? 0.95 : 1) * (1 + 0.025 * this.pk); const X = C.x - s / 2, Y = C.y - s / 2;
    glass(RR(X, Y, s, s, s * 0.28), [X, Y, s, s], { thick: 30, mag: 1.1, edgeMag: 1.42, dark: 0.5 });
    dotIcon(C.x, C.y + 4, s * 0.66, 'cat', 'catz', k);
    if (this.pk > 0) label('prrr', C.x + s * 0.42, Y - 10 - (1 - this.pk) * 40, '700 36px "Inter"', '#fff', this.pk);
    hint(this.d > 40 && S.ring ? 'keep petting…' : 'pet the cat ↔'); }, time() { return S.ring ? '7:00' : '7:09'; } });

// 8 — pull the blanket up
M.push({ name: 'Pull the blanket up', init() { this.top = 1120; this.drag = null; }, TOP: 1120, END: SY + 500,
  down(p) { if (S.ring && Math.abs(p.y - this.top - 30) < 90 && Math.abs(p.x - W / 2) < 380) { this.drag = { y0: p.y, t0: this.top }; log('grab'); } },
  move(p) { if (this.drag) this.top = clamp(this.drag.t0 + (p.y - this.drag.y0), 560, this.TOP); },
  up() { if (!this.drag) return; this.drag = null; if (this.top < 720) { log('cover'); snooze(10, '7:10', 'Snoozed · 10 min'); } },
  step(dt) { if (!this.drag && S.ring) this.top += (this.TOP - this.top) * Math.min(1, dt * 5); if (!S.ring) this.top += (this.END - this.top) * Math.min(1, dt * 6); },
  shake() { return clamp((this.top - 600) / 520); },
  draw() { const X = SX + 30, w = SW - 60, Y = this.top, h = 1290 - Y;
    glass(RR(X, Y, w, h, 56), [X, Y, w, h], { thick: 30, tint: 0.2, mag: 1.04, edgeMag: 1.3 });
    x.save(); rr(x, X + 8, Y + 8, w - 16, h - 16, 50); x.clip(); x.setLineDash([12, 14]); x.strokeStyle = 'rgba(255,255,255,0.3)'; x.lineWidth = 3;
    for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(X + w * i / 4, Y + 60); x.lineTo(X + w * i / 4, Y + h); x.stroke(); }
    for (let j = 1; j < 7; j++) { const yy = Y + 60 + j * 105; x.beginPath(); x.moveTo(X, yy); x.lineTo(X + w, yy); x.stroke(); } x.restore();
    x.save(); x.fillStyle = 'rgba(255,255,255,0.75)'; rr(x, W / 2 - 60, Y + 22, 120, 12, 6); x.fill(); x.restore();
    const k = S.ring ? clamp((this.TOP - Y) / 420) : 1; dotIcon(W / 2, Y + 160, 140, 'sun', 'moon', k);
    if (S.ring) label('pull the blanket up ↑', W / 2, Math.min(1150, Y - 40), '600 34px "Inter"', '#fff', 0.9 * (0.75 + 0.25 * Math.sin(S.t * 3)) * clamp((Y - 760) / 200)); }, time() { return S.ring ? '7:00' : '7:10'; } });

// 9 — count three sheep
M.push({ name: 'Count three sheep', init() { this.n = 0; this.j = -1; this.jt = 0; },
  down(p) { if (S.ring && this.j < 0 && this.n < 3 && p.y > 760 && p.y < 1120) { this.j = this.n; this.jt = 0.0001; log('jump'); } }, move() {}, up() {},
  step(dt) { if (this.j >= 0) { this.jt += dt / 0.75; if (this.jt >= 1) { this.n++; this.j = -1; this.jt = 0; log('land'); if (this.n >= 3) snooze(3, '7:03', 'Snoozed · 3 min'); } } },
  shake() { return 1 - this.n / 3; },
  draw() { const fy = 1040;
    for (const dx of [-95, 95]) glass(RR(W / 2 + dx - 18, fy - 130, 36, 160, 14), [W / 2 + dx - 18, fy - 130, 36, 160], { thick: 10, spec: false, edge: false, caustic: 0.1 });
    for (const yy of [fy - 100, fy - 45]) glass(RR(W / 2 - 150, yy, 300, 28, 14), [W / 2 - 150, yy, 300, 28], { thick: 9, spec: false, caustic: 0.1 });
    const words = ['', 'one…', 'two…', 'three. zzz']; if (this.n > 0) label(words[this.n], W / 2, 800, '700 58px "Inter"', '#fff');
    if (this.n > 0) dotIcon(830, 960, 175, 'sheep', 'sheep', 0, Math.sin(S.t * 2) * 0.04);
    if (this.j >= 0) { const k = this.jt; dotIcon(lerp(250, 830, E(k)), 960 - Math.sin(Math.PI * k) * 190, 175, 'sheep', 'sheep', 0, lerp(-0.35, 0.35, k), true); }
    else if (this.n < 3) dotIcon(250, 960, 175, 'sheep', 'sheep', 0, Math.sin(S.t * 6) * 0.05);
    hint(this.n === 0 ? 'tap to send a sheep' : 'another one'); }, time() { return S.ring ? '7:00' : '7:03'; } });

// 10 — flip it face down
M.push({ name: 'Flip it face down', init() { this.f = 0; this.on = false; this.press = 0; }, C: { x: W / 2, y: 925, s: 300 },
  down(p) { const C = this.C; if (S.ring && !this.on && Math.abs(p.x - C.x) < C.s / 2 + 20 && Math.abs(p.y - C.y) < C.s / 2 + 20) { this.press = 1; this.on = true; log('flip'); } }, move() {}, up() {},
  step(dt) { if (this.on && this.f < 1) { this.f = Math.min(1, this.f + dt / 1.1); if (this.f >= 1) snooze(9, '7:09', 'Face down · 9 min'); } this.press = Math.max(0, this.press - dt * 3); },
  shake() { return this.on ? 0 : 1; },
  draw() { const C = this.C; const f = E(this.f); const sx = Math.abs(Math.cos(Math.PI * f)); const back = f > 0.5; const s = C.s * (1 - 0.08 * this.press) * (1 + 0.08 * Math.sin(Math.PI * f));
    const w = Math.max(10, s * sx), h = s; const X = C.x - w / 2, Y = C.y - h / 2;
    glass(RR(X, Y, w, h, Math.min(w / 2, s * 0.26)), [X, Y, w, h], { thick: Math.max(5, 32 * sx), mag: 1.12, edgeMag: 1.45, tint: back ? 0.05 : 0.12, dark: 0.45 });
    if (sx > 0.1) { x.save(); x.translate(C.x, 0); x.scale(sx, 1); x.translate(-C.x, 0); dotIcon(C.x, C.y + 4, s * 0.6, 'bell', 'moon', back ? clamp((this.f - 0.5) * 2.4) : 0, back ? 0 : Math.sin(S.t * 40) * 0.25); x.restore(); }
    hint('tap to flip it over'); }, time() { return S.ring ? '7:00' : '7:09'; } });

{ const ORDER = [0, 1, 2, 6, 3, 7, 8, 4, 9, 5]; const M2 = ORDER.map((i) => M[i]); M.length = 0; M.push(...M2); }

// ---------------- frame ----------------
function setMode(i, withFade = true) {
  if (withFade) { snap.setTransform(1, 0, 0, 1, 0, 0); snap.clearRect(0, 0, W, H); snap.drawImage(c, 0, 0); S.fade = 1; }
  S.mode = (i + M.length) % M.length; S.N = 0; S.Nt = 0; S.ring = true; S.snoozeK = 0; S.until = ''; S.island = ''; M[S.mode].init(); log('mode');
}
function step(dt) {
  S.t += dt; const m = M[S.mode]; m.step(dt);
  if (!(S.mode === 0 && m.drag)) S.N += (S.Nt - S.N) * Math.min(1, dt * 1.6);
  if (!S.ring) S.snoozeK = Math.min(1, S.snoozeK + dt * 2.5);
  S.fade = Math.max(0, S.fade - dt * 3);
}
function blurPrep() {
  bls.setTransform(1, 0, 0, 1, 0, 0); bls.clearRect(0, 0, BLS.width, BLS.height);
  if (FILTER) { bls.filter = 'blur(3.5px) saturate(1.5) brightness(1.08)'; bls.drawImage(WP, 0, 0, BLS.width, BLS.height); bls.filter = 'none'; } else downBlur(WP, bls, BLS.width, BLS.height, 3);
  blr.setTransform(1, 0, 0, 1, 0, 0); blr.imageSmoothingQuality = 'high'; blr.drawImage(BLS, 0, 0, W, H);
  wps.setTransform(1, 0, 0, 1, 0, 0); if (FILTER) wps.filter = 'saturate(1.6) brightness(1.15)'; wps.drawImage(WP, 0, 0); wps.filter = 'none';
}
function bloom(sun, a1 = 0.8, two = true) {
  bq.setTransform(0.25, 0, 0, 0.25, 0, 0); bq.clearRect(0, 0, W, 1350);
  bq.fillStyle = mixA('#ffcf80', '#ff7a4a', S.N, Math.pow(1 - S.N, 1.2)); bq.beginPath(); bq.arc(sun.sunX, sun.sunY, sun.R, 0, 6.29); bq.fill(); bq.clearRect(0, HZ + 40, W, 1350);
  bq2.setTransform(1, 0, 0, 1, 0, 0); bq2.clearRect(0, 0, 270, 338);
  if (FILTER) { bq2.filter = 'blur(15px)'; bq2.globalAlpha = a1; bq2.drawImage(BQ, 0, 0); if (two) { bq2.filter = 'blur(37px)'; bq2.globalAlpha = 0.45; bq2.drawImage(BQ, 0, 0); } bq2.filter = 'none'; bq2.globalAlpha = 1; }
  else { bq2.globalAlpha = a1; downBlur(BQ, bq2, 270, 338, 10); if (two) { bq2.globalAlpha = 0.45; downBlur(BQ, bq2, 270, 338, 24); } bq2.globalAlpha = 1; }
  x.save(); x.globalCompositeOperation = 'lighter'; x.drawImage(BQ2, 0, 0, W, 1350); x.restore();
}
function draw() {
  const t = S.t; const m = M[S.mode];
  const sun = wallpaper(wp, t, S.N);
  blurPrep();
  x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#040406'; x.fillRect(0, 0, W, H);
  if (S.overlay) { drawOverlay(sun); return; }
  if (!PHONE) {
    const amb = x.createRadialGradient(W / 2, 820, 100, W / 2, 820, 1000); amb.addColorStop(0, mixA('#ff8a3d', '#3d5bff', S.N, 0.35)); amb.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = amb; x.fillRect(0, 0, W, H);
    rr(x, PX, PY, PW, 1700, PR); const body = x.createLinearGradient(PX, 0, PX + PW, 0); body.addColorStop(0, '#2e2e33'); body.addColorStop(0.5, '#0e0e11'); body.addColorStop(1, '#2e2e33'); x.fillStyle = body; x.fill();
    rr(x, PX + 3, PY + 3, PW - 6, 1694, PR - 3); x.strokeStyle = 'rgba(255,255,255,0.2)'; x.lineWidth = 2; x.stroke();
    x.fillStyle = '#1c1c20'; x.fillRect(PX - 7, PY + 260, 9, 90); x.fillRect(PX - 7, PY + 380, 9, 150); x.fillRect(PX + PW - 2, PY + 330, 9, 190);
  }
  x.save(); if (!PHONE) { rr(x, SX, SY, SW, SHH, PR - 22); x.clip(); }
  x.drawImage(WP, 0, 0);
  x.save(); x.translate(0, OYm); bloom(sun); x.restore();
  // top band: date + glass time
  const dY = PHONE ? 250 : SY + 175, tB = PHONE ? 600 : SY + 455;
  label('Monday, November 9', W / 2, dY, PHONE ? '600 50px "Inter"' : '600 40px "Inter"', 'rgba(255,255,255,0.92)');
  const tstr = m.time(); const tf = PHONE ? '700 300px "Inter"' : '700 290px "Inter"'; const tw = measure(tstr, tf);
  glass(TXT(tstr, W / 2, tB, tf), [W / 2 - tw / 2, tB - 210, tw, 215], { thick: 14, mag: 1.08, edgeMag: 1.3, tint: 0.14, caustic: 0.18, spec: false, rim: 1.6, edge: false });
  // mid band
  x.save(); x.translate(0, OYm); OYc = OYm;
  const ring = S.ring ? (m.shake ? m.shake() : 1) : 0;
  const sh = Math.sin(t * 46) * 6 * ring; const cy = SY + 525, cw = SW - 90, ch = 122;
  glass(RR(W / 2 - cw / 2 + sh, cy, cw, ch, 40), [W / 2 - cw / 2 + sh, cy, cw, ch], { thick: 20 });
  dotIcon(SX + 112 + sh, cy + 61, 58, 'bell', 'moon', S.snoozeK, Math.sin(t * 40) * 0.3 * ring);
  x.save(); x.textAlign = 'left'; x.fillStyle = '#fff'; x.font = '700 36px "Inter"'; x.fillText('Alarm', SX + 160 + sh, cy + 53); x.globalAlpha = 0.85; x.font = '500 30px "Inter"'; x.fillText(S.ring ? 'Wake up' : S.until === '7:36' ? 'Snoozed 4 times' : `Snoozed until ${S.until === '7:00:30' ? '7:00:30' : S.until}`, SX + 160 + sh, cy + 92); x.restore();
  x.textAlign = 'right'; x.fillStyle = 'rgba(255,255,255,0.7)'; x.font = '500 26px "Inter"'; x.fillText('now', SX + SW - 75 + sh, cy + 50); x.textAlign = 'left';
  m.draw();
  x.restore(); OYc = 0;
  // dynamic island (expands with status)
  const k = EB(S.snoozeK);
  if (!PHONE || MOCK || S.snoozeK > 0) { const iw = PHONE ? lerp(ISL.w, 640, k) : lerp(220, 560, k), ih = PHONE ? lerp(ISL.h, 112, k) : lerp(64, 84, k), iy = PHONE ? ISL.y : SY + 26, icx = PHONE ? lerp(ISL.cx, W / 2, Math.min(1, k)) : W / 2;
    rr(x, icx - iw / 2, iy, iw, ih, ih / 2); x.fillStyle = '#000'; x.fill();
    if (S.snoozeK > 0.3) { x.save(); x.globalAlpha = (S.snoozeK - 0.3) / 0.7; x.fillStyle = S.island === "You're late" ? '#ff5a5a' : ACC; x.beginPath(); x.arc(icx - iw / 2 + 50, iy + ih / 2, 12, 0, 6.29); x.fill(); x.fillStyle = S.island === "You're late" ? '#ff8a8a' : '#fff'; x.font = '700 34px "Inter"'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(S.island, icx + 16, iy + ih / 2 + 1); x.restore(); } }
  x.restore();
  // caption pill (mode switcher)
  x.save(); x.translate(0, OYm); OYc = OYm;
  const cap = `${String(S.mode + 1).padStart(2, '0')}  ${m.name}`; const cf = '700 36px "Inter"'; const cwid = measure(cap, cf) + 150;
  glass(RR(W / 2 - cwid / 2, 1232, cwid, 84, 42), [W / 2 - cwid / 2, 1232, cwid, 84], { thick: 16, tint: 0.16 });
  label('‹', W / 2 - cwid / 2 + 38, 1272, '600 44px "Inter"', '#fff', 0.7); label('›', W / 2 + cwid / 2 - 38, 1272, '600 44px "Inter"', '#fff', 0.7);
  label(cap, W / 2, 1275, cf);
  x.restore(); OYc = 0;
  if (PHONE) phoneChrome();
  // fade from previous scene
  if (S.fade > 0) { x.save(); x.globalAlpha = E(S.fade); x.drawImage(SNAP, 0, 0); x.restore(); }
  if (S.cur.show) cursor(S.cur.x, S.cur.y, S.cur.down);
  if (!PHONE) { const vg = x.createRadialGradient(W / 2, H * 0.45, 460, W / 2, H * 0.45, 1000); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.45)'); x.fillStyle = vg; x.fillRect(0, 0, W, H); }
}
// lock screen corners: flashlight + camera, home indicator
function phoneChrome() {
  const by = H - 215, r = 70;
  for (const [cx, kind] of [[175, 'torch'], [W - 175, 'cam']]) {
    glass(CIRC(cx, by, r), [cx - r, by - r, r * 2, r * 2], { thick: 18, tint: 0.1, mag: 1.1, edgeMag: 1.4, edge: false, caustic: 0.1, dark: 0.35 });
    x.save(); x.translate(cx, by); x.strokeStyle = '#fff'; x.fillStyle = '#fff'; x.lineWidth = 5; x.lineJoin = 'round'; x.lineCap = 'round';
    if (kind === 'torch') { x.beginPath(); x.moveTo(-16, -26); x.lineTo(16, -26); x.lineTo(16, -14); x.lineTo(9, -2); x.lineTo(9, 28); x.lineTo(-9, 28); x.lineTo(-9, -2); x.lineTo(-16, -14); x.closePath(); x.stroke(); x.beginPath(); x.moveTo(-16, -14); x.lineTo(16, -14); x.stroke(); x.beginPath(); x.arc(0, 8, 3.5, 0, 6.29); x.fill(); }
    else { rr(x, -30, -18, 60, 44, 10); x.stroke(); x.beginPath(); x.moveTo(-12, -18); x.lineTo(-7, -27); x.lineTo(7, -27); x.lineTo(12, -18); x.stroke(); x.beginPath(); x.arc(0, 4, 11, 0, 6.29); x.stroke(); }
    x.restore();
  }
  x.save(); x.fillStyle = 'rgba(255,255,255,0.9)'; rr(x, W / 2 - 185, H - 30, 370, 14, 7); x.fill(); x.restore();
}
function cursor(X, Y, d) {
  if (PHONE) { if (!d) return; x.save(); x.fillStyle = 'rgba(255,255,255,0.32)'; x.strokeStyle = 'rgba(255,255,255,0.75)'; x.lineWidth = 3; x.shadowColor = 'rgba(0,0,0,0.35)'; x.shadowBlur = 18; x.beginPath(); x.arc(X, Y, 46, 0, 6.29); x.fill(); x.shadowBlur = 0; x.stroke(); x.restore(); return; }
  x.save(); x.translate(X, Y); const s = d ? 1.5 : 1.7; x.scale(s, s);
  x.shadowColor = 'rgba(0,0,0,0.6)'; x.shadowBlur = 14; x.shadowOffsetY = 4;
  x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 30); x.lineTo(7.5, 23); x.lineTo(12.5, 34); x.lineTo(17, 32); x.lineTo(12, 21); x.lineTo(22, 21); x.closePath();
  x.fillStyle = '#fff'; x.fill(); x.shadowColor = 'transparent'; x.lineWidth = 1.6; x.strokeStyle = '#111'; x.stroke(); x.restore();
}
function drawOverlay(sun) {
  const o = S.overlay; x.drawImage(WP, 0, 0); x.save(); x.translate(0, OYm); OYc = OYm;
  bloom(sun, 0.8, false);
  const k1 = EO(clamp(o.p * 3)), k2 = EO(clamp(o.p * 3 - 0.6)), k3 = EO(clamp(o.p * 3 - 1.1));
  const L = o.type === 'intro' ? ['Everyone', 'hits snooze.'] : ['Which one', 'would you hit?'];
  const f = '800 150px "Inter"';
  x.save(); x.globalAlpha = k1; x.translate(0, (1 - k1) * 40);
  for (let i = 0; i < 2; i++) { const w = measure(L[i], f); glass(TXT(L[i], W / 2, 400 + i * 165, f), [W / 2 - w / 2, 290 + i * 165, w, 130], { thick: 12, mag: 1.08, edgeMag: 1.3, tint: 0.16, spec: false, rim: 1.6, caustic: 0.25, edge: false }); }
  x.restore();
  if (o.type === 'intro') { label('Nobody designed it.', W / 2, 690, '700 56px "Inter"', '#ffd8b8', k2); label('So Opus 5.5 made 10 you can actually use.', W / 2, 760, '500 38px "Inter"', '#fff', k3); }
  else { label('All 10 are live. Try them: link below.', W / 2, 700, '600 42px "Inter"', '#fff', k2); label('@f0rgent', W / 2, 790, '700 46px "JetBrains Mono"', ACC, k3); }
  x.restore(); OYc = 0;
  if (MOCK) { rr(x, ISL.cx - ISL.w / 2, ISL.y, ISL.w, ISL.h, ISL.h / 2); x.fillStyle = '#000'; x.fill(); }
  if (PHONE) { if (S.fade > 0) { x.save(); x.globalAlpha = E(S.fade); x.drawImage(SNAP, 0, 0); x.restore(); } return; }
  const vg = x.createRadialGradient(W / 2, H * 0.45, 460, W / 2, H * 0.45, 1000); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.45)'); x.fillStyle = vg; x.fillRect(0, 0, W, H);
  if (S.fade > 0) { x.save(); x.globalAlpha = E(S.fade); x.drawImage(SNAP, 0, 0); x.restore(); }
}

// ---------------- input ----------------
function toCanvas(e) { const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
window.PHONEINFO = { PHONE, H, OYm, FILTER };
function ptr(type, sp) {
  S.cur.x = sp.x; S.cur.y = sp.y; const p = { x: sp.x, y: sp.y - OYm };
  if (type === 'down') {
    S.cur.down = true;
    if (p.y > 1220 && p.y < 1330) { const cap = `${String(S.mode + 1).padStart(2, '0')}  ${M[S.mode].name}`; const cw = measure(cap, '700 36px "Inter"') + 150; if (p.x < W / 2 - cw / 2 + 80) return setMode(S.mode - 1); if (p.x > W / 2 + cw / 2 - 80) return setMode(S.mode + 1); return setMode(S.mode); }
    if (!S.ring && p.y < 1220) return setMode(S.mode, true);
    M[S.mode].down(p);
  } else if (type === 'move') M[S.mode].move(p); else { S.cur.down = false; M[S.mode].up(p); }
}
c.addEventListener('pointerdown', (e) => { c.setPointerCapture(e.pointerId); ptr('down', toCanvas(e)); });
c.addEventListener('pointermove', (e) => ptr('move', toCanvas(e)));
c.addEventListener('pointerup', (e) => ptr('up', toCanvas(e)));
addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') setMode(S.mode + 1); if (e.key === 'ArrowLeft') setMode(S.mode - 1); if (e.key === ' ') setMode(S.mode); });

window.api = { S, M, step, draw, setMode, ptr, overlay(o) { S.overlay = o; }, snapNow() { snap.setTransform(1, 0, 0, 1, 0, 0); snap.clearRect(0, 0, W, H); snap.drawImage(c, 0, 0); S.fade = 1; } };
const REC = new URLSearchParams(location.search).has('rec');
Promise.race([Promise.all([document.fonts.load('700 60px "Inter"'), document.fonts.load('600 20px "Inter"'), document.fonts.load('700 20px "JetBrains Mono"')]).catch(() => {}), new Promise((r) => setTimeout(r, 2500))]).then(() => {
  setMode(0, false); draw(); window.ready = true;
  if (!REC) { let last = performance.now(); const loop = (now) => { step(Math.min(0.05, (now - last) / 1000)); last = now; draw(); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
});
