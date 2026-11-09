// glass.js: liquid glass for <canvas>, no WebGL, no dependencies. MIT, by @f0rgent.
// Works in Chrome, Firefox and Safari (falls back to shadow tricks where ctx.filter is missing).
//
//   const g = createGlass(ctx);          // ctx = your visible 2d context
//   g.setBackdrop(myWallpaperCanvas);    // whatever is behind the glass; call again when it changes
//   g.glass(g.rect(100, 100, 400, 140, 40), { tint: 0.12 });
//   g.glass(g.text('7:00', 540, 600, '700 300px Inter'));
//   g.glass(g.circle(200, 900, 70), { dark: 0.35 });
//
// Options: thick (rim lens width), tint (white wash), mag (body zoom), edgeMag (rim zoom),
// caustic (light thrown below), spec (hotspot on/off), rim (rim line width), dark (smoked glass 0..1).
(function (root) {
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
  const FILTER = (() => { try { const [, t] = mk(12, 12); t.filter = 'blur(2px)'; t.fillStyle = '#fff'; t.fillRect(5, 5, 2, 2); return t.getImageData(3, 5, 1, 1).data[3] > 8; } catch (e) { return false; } })();
  function rr(q, X, Y, w, h, r) { r = Math.min(r, w / 2, h / 2); q.beginPath(); q.moveTo(X + r, Y); q.arcTo(X + w, Y, X + w, Y + h, r); q.arcTo(X + w, Y + h, X, Y + h, r); q.arcTo(X, Y + h, X, Y, r); q.arcTo(X, Y, X + w, Y, r); q.closePath(); }

  function createGlass(x) {
    const W = x.canvas.width, H = x.canvas.height;
    const [BLR, blr] = mk(W, H), [WPS, wps] = mk(W, H), [LY, ly] = mk(W, H), [TM, tm] = mk(W, H), [SM, sm] = mk(Math.ceil(W / 4), Math.ceil(H / 4)), [TB, tb] = mk(2, 2);
    function downBlur(src, dq, dw, dh, f) { const w = Math.max(2, Math.round(dw / f)), h = Math.max(2, Math.round(dh / f)); TB.width = w; TB.height = h; tb.imageSmoothingQuality = 'high'; tb.drawImage(src, 0, 0, w, h); dq.imageSmoothingQuality = 'high'; dq.drawImage(TB, 0, 0, dw, dh); }
    function softStroke(q, shape, col, lw, blur, dx, dy) { q.save(); q.lineJoin = 'round'; q.lineWidth = lw;
      if (FILTER) { q.filter = `blur(${blur}px)`; q.translate(dx, dy); q.strokeStyle = col; shape(q, 'stroke'); }
      else { q.shadowColor = col; q.shadowBlur = blur * 2; q.shadowOffsetX = 4000; q.translate(dx - 4000, dy); q.strokeStyle = '#000'; shape(q, 'stroke'); }
      q.restore(); }
    // measure a shape's box by drawing it once into a scratch context
    function box(shape) { return shape.bb; }

    const api = {
      FILTER,
      setBackdrop(src) {
        sm.clearRect(0, 0, SM.width, SM.height);
        if (FILTER) { sm.filter = 'blur(3.5px) saturate(1.5) brightness(1.08)'; sm.drawImage(src, 0, 0, SM.width, SM.height); sm.filter = 'none'; } else downBlur(src, sm, SM.width, SM.height, 3);
        blr.clearRect(0, 0, W, H); blr.imageSmoothingQuality = 'high'; blr.drawImage(SM, 0, 0, W, H);
        wps.clearRect(0, 0, W, H); if (FILTER) wps.filter = 'saturate(1.6) brightness(1.15)'; wps.drawImage(src, 0, 0, W, H); wps.filter = 'none';
      },
      rect(X, Y, w, h, r) { const s = (q, m) => { rr(q, X, Y, w, h, r); m === 'fill' ? q.fill() : q.stroke(); }; s.bb = [X, Y, w, h]; return s; },
      circle(X, Y, r) { const s = (q, m) => { q.beginPath(); q.arc(X, Y, r, 0, 6.2832); m === 'fill' ? q.fill() : q.stroke(); }; s.bb = [X - r, Y - r, r * 2, r * 2]; return s; },
      text(str, X, Y, font) { const s = (q, m) => { q.save(); q.font = font; q.textAlign = 'center'; q.textBaseline = 'alphabetic'; m === 'fill' ? q.fillText(str, X, Y) : q.strokeText(str, X, Y); q.restore(); };
        x.save(); x.font = font; const mt = x.measureText(str); x.restore(); const asc = mt.actualBoundingBoxAscent || parseFloat(font.match(/(\d+)px/)[1]) * 0.72, des = mt.actualBoundingBoxDescent || 0;
        s.bb = [X - mt.width / 2, Y - asc, mt.width, asc + des]; return s; },
      glass(shape, o = {}) {
        const [bx, by, bw, bh] = box(shape); const cx = bx + bw / 2, cy = by + bh / 2;
        const pad = 60, cx0 = Math.floor(bx - pad), cy0 = Math.floor(by - pad), cw = Math.ceil(bw + pad * 2), ch = Math.ceil(bh + pad * 2);
        const thick = o.thick ?? Math.min(26, Math.min(bw, bh) * 0.22), tint = o.tint ?? 0.1, mag = o.mag ?? 1.06, edgeMag = o.edgeMag ?? 1.32;
        const fillShape = (q) => { q.fillStyle = '#000'; shape(q, 'fill'); };
        // caustic + soft drop shadow (shadow-offset trick, works without ctx.filter)
        x.save(); x.globalCompositeOperation = 'lighter'; x.globalAlpha = o.caustic ?? 0.22; x.shadowColor = 'rgba(255,214,170,1)'; x.shadowBlur = 40; x.shadowOffsetX = 4000; x.shadowOffsetY = bh * 0.16 + 18; x.translate(-4000, 0); fillShape(x); x.restore();
        x.save(); x.globalAlpha = 0.5; x.shadowColor = 'rgba(10,5,25,1)'; x.shadowBlur = 36; x.shadowOffsetX = 4000; x.shadowOffsetY = 18; x.translate(-4000, 0); fillShape(x); x.restore();
        ly.setTransform(1, 0, 0, 1, 0, 0); ly.clearRect(cx0, cy0, cw, ch); ly.save(); ly.beginPath(); ly.rect(cx0, cy0, cw, ch); ly.clip();
        // body: magnified blurred backdrop
        ly.save(); ly.translate(cx, cy); ly.scale(mag, mag); ly.translate(-cx, -cy); ly.drawImage(BLR, 0, 0); ly.restore();
        // rim band: stronger lensing of the sharp, saturated backdrop
        tm.setTransform(1, 0, 0, 1, 0, 0); tm.clearRect(cx0, cy0, cw, ch);
        tm.save(); tm.beginPath(); tm.rect(cx0, cy0, cw, ch); tm.clip(); tm.translate(cx, cy); tm.scale(edgeMag, edgeMag * 1.04); tm.translate(-cx, -cy); tm.drawImage(WPS, 0, 0); tm.restore();
        tm.save(); tm.globalCompositeOperation = 'destination-in'; tm.lineWidth = thick * 2; tm.strokeStyle = '#000'; tm.lineJoin = 'round'; shape(tm, 'stroke'); tm.restore();
        ly.drawImage(TM, cx0, cy0, cw, ch, cx0, cy0, cw, ch);
        // tint + top light
        ly.fillStyle = `rgba(255,255,255,${tint})`; ly.fillRect(cx0, cy0, cw, ch);
        const lg = ly.createLinearGradient(0, by, 0, by + bh); lg.addColorStop(0, 'rgba(255,255,255,0.20)'); lg.addColorStop(0.5, 'rgba(255,255,255,0)'); lg.addColorStop(1, 'rgba(255,255,255,0.05)'); ly.fillStyle = lg; ly.fillRect(cx0, cy0, cw, ch);
        // inner bevel
        softStroke(ly, shape, 'rgba(255,255,255,0.75)', thick * 0.7, Math.max(3, thick * 0.35), -thick * 0.18, -thick * 0.28);
        softStroke(ly, shape, 'rgba(30,10,50,0.45)', thick * 0.8, Math.max(3, thick * 0.4), thick * 0.22, thick * 0.34);
        // specular hotspot
        if (o.spec !== false) { ly.save(); ly.globalCompositeOperation = 'lighter'; const sx = bx + bw * 0.22, sy = by + bh * 0.16, sr = Math.max(18, Math.min(bw, bh) * 0.32); const sp = ly.createRadialGradient(sx, sy, 0, sx, sy, sr); sp.addColorStop(0, 'rgba(255,255,255,0.55)'); sp.addColorStop(1, 'rgba(255,255,255,0)'); ly.fillStyle = sp; ly.beginPath(); ly.ellipse(sx, sy, sr * 1.6, sr * 0.7, -0.35, 0, 6.2832); ly.fill(); ly.restore(); }
        ly.restore();
        ly.globalCompositeOperation = 'destination-in'; fillShape(ly); ly.globalCompositeOperation = 'source-over';
        x.drawImage(LY, cx0, cy0, cw, ch, cx0, cy0, cw, ch);
        if (o.dark) { x.save(); const dg = x.createLinearGradient(0, by, 0, by + bh); dg.addColorStop(0, `rgba(18,10,34,${o.dark * 0.7})`); dg.addColorStop(1, `rgba(10,6,24,${o.dark})`); x.fillStyle = dg; shape(x, 'fill'); x.restore(); }
        // rim: chromatic fringe + specular line
        x.save(); x.lineJoin = 'round'; x.globalCompositeOperation = 'lighter'; x.globalAlpha = 0.55; x.lineWidth = 2.4;
        for (const [col, dx, dy] of [['rgba(255,60,90,1)', -2.4, -1.2], ['rgba(70,140,255,1)', 2.4, 1.2], ['rgba(120,255,140,0.8)', 0.6, -1.8]]) { x.strokeStyle = col; x.save(); x.translate(dx, dy); shape(x, 'stroke'); x.restore(); }
        x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
        const rim = x.createLinearGradient(bx, by, bx + bw, by + bh); rim.addColorStop(0, 'rgba(255,255,255,0.95)'); rim.addColorStop(0.3, 'rgba(255,255,255,0.25)'); rim.addColorStop(0.65, 'rgba(255,255,255,0.08)'); rim.addColorStop(1, 'rgba(255,255,255,0.6)');
        x.strokeStyle = rim; x.lineWidth = o.rim ?? 2; shape(x, 'stroke'); x.restore();
      },
    };
    return api;
  }
  root.createGlass = createGlass;
  if (typeof module !== 'undefined') module.exports = { createGlass };
})(typeof window !== 'undefined' ? window : globalThis);
