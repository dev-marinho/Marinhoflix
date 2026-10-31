/* ==========================================================
   Som da abertura — gerado pelo próprio navegador (Web Audio).
   Não usa nenhum arquivo de áudio: 100% livre de direitos.
   1º impacto grave quando o "M" aparece,
   2º impacto + acorde cinematográfico quando abre "MARINHO".
   ========================================================== */
window.IntroSound = (function () {
  let ctx = null;

  function unlock() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function noiseBuffer(c, seconds) {
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  // Impacto grave (kick cinematográfico + "clique" de ataque)
  function hit(c, out, t, strength) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.45);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(strength, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 1.2);

    const n = c.createBufferSource();
    n.buffer = noiseBuffer(c, 0.08);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1800;
    const ng = c.createGain();
    ng.gain.setValueAtTime(strength * 0.35, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    n.connect(lp).connect(ng).connect(out);
    n.start(t);
  }

  // Acorde que "abre" junto com o nome
  function swell(c, out, t) {
    const notes = [55, 82.41, 110, 164.81, 220]; // Lá (quinta + oitavas)
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 6;
    filter.frequency.setValueAtTime(180, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.35);
    filter.frequency.exponentialRampToValueAtTime(260, t + 2.4);

    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    filter.connect(g).connect(out);

    notes.forEach((f, i) => {
      [-6, 6].forEach((detune) => {
        const o = c.createOscillator();
        o.type = i < 2 ? "sawtooth" : "triangle";
        o.frequency.value = f;
        o.detune.value = detune;
        o.connect(filter);
        o.start(t);
        o.stop(t + 2.7);
      });
    });
  }

  function play(hitAt, swellAt) {
    const c = ctx;
    if (!c) return;
    const now = c.currentTime;
    const comp = c.createDynamicsCompressor();
    const master = c.createGain();
    master.gain.value = 0.9;
    master.connect(comp).connect(c.destination);

    hit(c, master, now + hitAt, 0.8);
    hit(c, master, now + swellAt, 1);
    swell(c, master, now + swellAt);
  }

  return { unlock, play };
})();
