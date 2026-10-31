/* Página "Conheça meu trabalho": bastidores + passo a passo */
(function () {
  const t = window.MARINHO.trabalho;
  const { $, esc, setQuote, setupChrome, setupPlayer, openPlayer, autoPauseOffscreen } = window.MarinhoUI;

  /* ---------- Vídeo de bastidores ---------- */
  const heroVideo = $("#hero-video");
  $("#hero .hero__card").style.backgroundImage = t.capa ? `url("${t.capa}")` : "";
  heroVideo.poster = t.capa || "";
  heroVideo.src = t.video;
  heroVideo.play().catch(() => {});
  $("#hero-title").textContent = t.titulo;
  $("#hero-desc").textContent = t.subtitulo;
  $("#hero-play").addEventListener("click", () => openPlayer({ video: t.video, capa: t.capa, titulo: "Bastidores" }));

  /* ---------- Fotos (carrossel) ---------- */
  const gallery = $("#gallery");
  gallery.innerHTML = t.fotos
    .map(
      (f, i) => `
      <figure class="shot">
        <img src="${esc(f.src)}" alt="${esc(f.legenda)}" ${i > 0 ? 'loading="lazy"' : ""} decoding="async" />
        ${f.legenda ? `<figcaption>${esc(f.legenda)}</figcaption>` : ""}
      </figure>`
    )
    .join("");

  // bolinhas indicando a foto atual
  const dots = $("#gallery-dots");
  dots.innerHTML = t.fotos.map(() => "<span></span>").join("");
  const setDot = () => {
    const shots = gallery.querySelectorAll(".shot");
    if (!shots.length) return;
    const step = shots[0].offsetWidth + parseFloat(getComputedStyle(gallery).columnGap || 12);
    const i = Math.min(shots.length - 1, Math.round(gallery.scrollLeft / step));
    dots.querySelectorAll("span").forEach((d, j) => d.classList.toggle("is-active", j === i));
  };
  gallery.addEventListener("scroll", () => requestAnimationFrame(setDot), { passive: true });
  setDot();

  /* ---------- Como funciona ---------- */
  $("#steps").innerHTML = t.etapas
    .map(
      (e, i) => `
      <li class="step">
        <span class="step__num">${String(i + 1).padStart(2, "0")}</span>
        <div class="step__body">
          <h3 class="step__title">${esc(e.titulo)}</h3>
          <p class="step__text">${esc(e.texto)}</p>
        </div>
      </li>`
    )
    .join("");

  setupChrome({ activeId: "trabalho" });
  setQuote(t.whatsappMsg);
  setupPlayer();
  autoPauseOffscreen(heroVideo);
})();
