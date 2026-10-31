(function () {
  const data = window.MARINHO;
  const $ = (sel) => document.querySelector(sel);

  const params = new URLSearchParams(location.search);
  let current = data.perfis.find((p) => p.id === params.get("area")) || data.perfis[0];

  const PLAY_ICON = '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg>';
  const IG_ICON =
    '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1.1" class="fill"/></svg>';

  const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const whatsappLink = (p) => `https://wa.me/${data.contato.whatsapp}?text=${encodeURIComponent(p.whatsappMsg)}`;

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
  }

  /* ---------- Topo ---------- */
  function buildChips() {
    const nav = $("#chips");
    nav.innerHTML =
      `<button class="chip chip--work" type="button" data-work>Conheça meu trabalho</button>` +
      data.perfis.map((p) => `<button class="chip" type="button" data-id="${p.id}">${esc(p.nome)}</button>`).join("");

    nav.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      if (chip.hasAttribute("data-work")) {
        toast("Página “Conheça meu trabalho”: em breve 🎬");
        return;
      }
      switchTo(chip.dataset.id);
    });
  }

  function updateChips() {
    document.querySelectorAll(".chip[data-id]").forEach((c) => {
      const active = c.dataset.id === current.id;
      c.classList.toggle("is-active", active);
      if (active) {
        c.setAttribute("aria-current", "page");
        // só rola a barra de chips se o perfil ativo estiver fora da tela
        const nav = $("#chips");
        const left = c.offsetLeft - nav.scrollLeft;
        if (left < 0 || left + c.offsetWidth > nav.clientWidth) {
          nav.scrollTo({ left: c.offsetLeft - (nav.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
        }
      } else {
        c.removeAttribute("aria-current");
      }
    });
  }

  function setLinks() {
    const wa = whatsappLink(current);
    $("#btn-orcamento").href = wa;
    $("#dock-orcamento").href = wa;
    $("#btn-instagram").href = data.contato.instagram;
    $("#dock-instagram").href = data.contato.instagram;
  }

  // altura real do topo -> espaço do conteúdo
  const topbar = $("#topbar");
  const setTopH = () => document.documentElement.style.setProperty("--top-h", topbar.offsetHeight + "px");
  if (window.ResizeObserver) new ResizeObserver(setTopH).observe(topbar);
  setTopH();

  window.addEventListener("scroll", () => topbar.classList.toggle("is-solid", window.scrollY > 12), { passive: true });

  /* ---------- E-mail: copia com um toque ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-100px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand("copy");
      ta.remove();
      ok ? resolve() : reject();
    });
  }
  $("#btn-email").addEventListener("click", () => {
    copyText(data.contato.email)
      .then(() => toast("✉️ E-mail copiado! Agora é só colar."))
      .catch(() => toast(data.contato.email));
  });

  /* ---------- Destaque ---------- */
  const heroVideo = $("#hero-video");
  function renderHero() {
    const d = current.destaque;
    $("#hero").querySelector(".hero__card").style.backgroundImage = d.capa ? `url("${d.capa}")` : "";
    heroVideo.poster = d.capa || "";
    heroVideo.src = d.video;
    heroVideo.play().catch(() => {});
    $("#hero-badge").textContent = "M";
    $("#hero-title").textContent = d.titulo;
    $("#hero-desc").textContent = d.descricao || "";
  }
  $("#hero-play").addEventListener("click", () => openPlayer(current.destaque));

  // pausa o vídeo do destaque quando sai da tela (economiza bateria)
  if (window.IntersectionObserver) {
    new IntersectionObserver(([entry]) => {
      if (playerOpen) return;
      entry.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause();
    }, { threshold: 0.2 }).observe(heroVideo);
  }

  /* ---------- Top 5 ---------- */
  function renderTop5() {
    $("#top5-title").textContent = `Top 5 em ${current.nome}`;
    $("#top5").innerHTML = current.top5
      .slice(0, 5)
      .map(
        (v, i) => `
        <div class="top-item">
          <span class="top-item__num" aria-hidden="true">${i + 1}</span>
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

  /* ---------- Player em tela cheia ---------- */
  const player = $("#player");
  const pv = $("#player-video");
  let playerOpen = false;

  function openPlayer(item) {
    if (!item) return;
    playerOpen = true;
    heroVideo.pause();
    pv.poster = item.capa || "";
    pv.src = item.video;
    pv.muted = false;
    $("#player-title").textContent = item.titulo || "";
    player.classList.add("is-open");
    player.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    pv.play().catch(() => {});
    history.pushState({ player: true }, "");
  }

  function closePlayer() {
    if (!playerOpen) return;
    playerOpen = false;
    pv.pause();
    pv.removeAttribute("src");
    pv.load();
    player.classList.remove("is-open");
    player.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    heroVideo.play().catch(() => {});
  }

  // fechar pelo X, pela tecla Esc ou pelo "voltar" do celular
  $("#player-close").addEventListener("click", () => (history.state && history.state.player ? history.back() : closePlayer()));
  window.addEventListener("popstate", closePlayer);
  document.addEventListener("keydown", (e) => e.key === "Escape" && playerOpen && history.back());

  /* ---------- Barra flutuante ---------- */
  $("#dock-home").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Troca de perfil ---------- */
  function render() {
    document.title = `Marinho | ${current.nome}`;
    renderHero();
    renderTop5();
    renderAprovados();
    updateChips();
    setLinks();
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

  buildChips();
  render();
})();
