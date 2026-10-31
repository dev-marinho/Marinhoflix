/* Página de cada perfil: destaque, Top 5 e "Aprovado e publicado" */
(function () {
  const data = window.MARINHO;
  const { $, esc, setQuote, updateChips, setupChrome, setupPlayer, openPlayer, autoPauseOffscreen } = window.MarinhoUI;

  const params = new URLSearchParams(location.search);
  let current = data.perfis.find((p) => p.id === params.get("area")) || data.perfis[0];

  const PLAY_ICON = '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg>';
  const IG_ICON =
    '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1.1" class="fill"/></svg>';

  /* ---------- Destaque ---------- */
  const heroVideo = $("#hero-video");
  function renderHero() {
    const d = current.destaque;
    $("#hero .hero__card").style.backgroundImage = d.capa ? `url("${d.capa}")` : "";
    heroVideo.poster = d.capa || "";
    heroVideo.src = d.video;
    heroVideo.play().catch(() => {});
    $("#hero-badge").textContent = "M";
    $("#hero-title").textContent = d.titulo;
    $("#hero-desc").textContent = d.descricao || "";
  }
  $("#hero-play").addEventListener("click", () => openPlayer(current.destaque));

  /* ---------- Top 5 ---------- */
  function renderTop5() {
    $("#top5-title").textContent = `Top 5 em ${current.nome}`;
    $("#top5").innerHTML = current.top5
      .slice(0, 5)
      .map(
        (v, i) => `
        <div class="top-item">
          <span class="top-item__num" data-n="${i + 1}" aria-hidden="true">${i + 1}</span>
          <button class="card" type="button" data-i="${i}" style="background-image:url('${esc(v.capa)}')" aria-label="Assistir ${esc(v.titulo)}">
            <span class="card__play">${PLAY_ICON}</span>
            <span class="card__label">${esc(v.titulo)}</span>
          </button>
        </div>`
      )
      .join("");
  }
  $("#top5").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) openPlayer(current.top5[+card.dataset.i]);
  });

  /* ---------- Aprovado e publicado ---------- */
  function renderAprovados() {
    $("#aprovados").innerHTML = (current.aprovados || [])
      .map(
        (v) => `
        <a class="card card--post" href="${esc(v.link)}" target="_blank" rel="noopener"
           style="background-image:url('${esc(v.capa)}')" aria-label="Ver post de ${esc(v.cliente)} no Instagram">
          <span class="card__handle">${IG_ICON}${esc(v.cliente)}</span>
          <span class="card__tag">PUBLICADO ✓</span>
        </a>`
      )
      .join("");
  }

  /* ---------- Troca de perfil (sem recarregar) ---------- */
  function render() {
    document.title = `Marinho | ${current.nome}`;
    renderHero();
    renderTop5();
    renderAprovados();
    updateChips(current.id);
    setQuote(current.whatsappMsg);
  }

  function switchTo(id) {
    if (id === current.id) return;
    const next = data.perfis.find((p) => p.id === id);
    if (!next) return;
    const content = $("#content");
    content.classList.add("is-switching");
    setTimeout(() => {
      current = next;
      history.replaceState(null, "", `?area=${id}`);
      window.scrollTo(0, 0);
      render();
      content.classList.remove("is-switching");
    }, 220);
  }

  setupChrome({ activeId: current.id, onSelectProfile: switchTo });
  setupPlayer();
  autoPauseOffscreen(heroVideo);
  render();
})();
