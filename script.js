/* Ambient spectrum strip — a resting analyser under the masthead.
   Drifting vertical bins in low-opacity amber/steel. Static if the
   viewer prefers reduced motion. Purely decorative; no interaction. */
(function () {
  var c = document.querySelector(".spectrum");
  if (!c) return;
  var ctx = c.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var bins = [], BIN_W = 3, GAP = 3, t = 0;

  function seed(w) {
    var n = Math.floor(w / (BIN_W + GAP)) + 2, i;
    bins = [];
    for (i = 0; i < n; i++) {
      bins.push({ base: Math.random() * 0.5 + 0.06, ph: Math.random() * 6.28, sp: Math.random() * 0.6 + 0.25 });
    }
  }
  function size() {
    var w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed(w);
    if (reduce) draw();
  }
  function draw() {
    var w = c.clientWidth, h = c.clientHeight, i, x = 0, mag, bh;
    ctx.clearRect(0, 0, w, h);
    for (i = 0; i < bins.length; i++) {
      var b = bins[i];
      mag = reduce ? b.base : b.base + Math.sin(t * b.sp + b.ph) * 0.14 + Math.sin(t * 0.11 + i * 0.2) * 0.06;
      mag = Math.max(0.03, Math.min(0.95, mag));
      bh = mag * h;
      var amber = mag > 0.55;
      ctx.fillStyle = amber ? "rgba(232,161,60," + (0.12 + mag * 0.5) + ")"
                            : "rgba(125,151,168," + (0.10 + mag * 0.28) + ")";
      ctx.fillRect(x, h - bh, BIN_W, bh);
      x += BIN_W + GAP;
    }
  }
  function loop() { t += 0.03; draw(); requestAnimationFrame(loop); }

  size();
  window.addEventListener("resize", size);
  if (!reduce) requestAnimationFrame(loop);
})();
