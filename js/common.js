/* ==========================================================
   Partes comuns das páginas internas (perfil e "Conheça meu trabalho"):
   topo, chips, e-mail, orçamento, barra flutuante, player e avisos.
   ========================================================== */
window.MarinhoUI = (function () {
  const data = window.MARINHO;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) =>
    String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const whatsappLink = (msg) => `https://wa.me/${data.contato.whatsapp}?text=${encodeURIComponent(msg)}`;

  /* ---------- Aviso (toast) ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
  }

  /* ---------- Copiar texto ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
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

  /* ---------- Orçamento (WhatsApp) ---------- */
  function setQuote(msg) {
    const href = whatsappLink(msg);
    document.querySelectorAll("[data-quote]").forEach((a) => (a.href = href));
  }

  /* ---------- Chips ---------- */
  // activeId: id do perfil atual, ou "trabalho"
  function updateChips(activeId) {
    const nav = $("#chips");
    nav.querySelectorAll(".chip").forEach((c) => {
      const active = c.dataset.id === activeId;
      c.classList.toggle("is-active", active);
      if (!active) return c.removeAttribute("aria-current");
      c.setAttribute("aria-current", "page");
      // só rola a barra de chips se o ativo estiver fora da tela
      const left = c.offsetLeft - nav.scrollLeft;
      if (left < 0 || left + c.offsetWidth > nav.clientWidth) {
        nav.scrollTo({ left: c.offsetLeft - (nav.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
      }
    });
  }

  /* ---------- Monta topo + barra flutuante ---------- */
  // onSelectProfile(id): se informado, troca de perfil sem recarregar a página
  function setupChrome({ activeId, onSelectProfile } = {}) {
    const nav = $("#chips");
    nav.innerHTML =
      `<a class="chip chip--work" href="trabalho.html" data-id="trabalho">Conheça meu trabalho</a>` +
      data.perfis.map((p) => `<a class="chip" href="perfil.html?area=${p.id}" data-id="${p.id}">${esc(p.nome)}</a>`).join("");

    nav.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip || !onSelectProfile || chip.dataset.id === "trabalho") return;
      e.preventDefault();
      onSelectProfile(chip.dataset.id);
    });

    document.querySelectorAll("[data-instagram]").forEach((a) => (a.href = data.contato.instagram));

    $("#btn-email").addEventListener("click", () => {
      copyText(data.contato.email)
        .then(() => toast("✉️ E-mail copiado! Agora é só colar."))
        .catch(() => toast(data.contato.email));
    });

    // altura real do topo -> espaço do conteúdo
    const topbar = $("#topbar");
    const setTopH = () => document.documentElement.style.setProperty("--top-h", topbar.offsetHeight + "px");
    if (window.ResizeObserver) new ResizeObserver(setTopH).observe(topbar);
    setTopH();
    window.addEventListener("scroll", () => topbar.classList.toggle("is-solid", window.scrollY > 12), { passive: true });

    $("#dock-home").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    updateChips(activeId);
  }

  /* ---------- Player em tela cheia ---------- */
  const listeners = { open: [], close: [] };
  let playerOpen = false;

  function openPlayer(item) {
    if (!item || !item.video) return;
    const player = $("#player");
    const pv = $("#player-video");
    playerOpen = true;
    listeners.open.forEach((fn) => fn());
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
    const player = $("#player");
    const pv = $("#player-video");
    playerOpen = false;
    pv.pause();
    pv.removeAttribute("src");
    pv.load();
    player.classList.remove("is-open");
    player.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    listeners.close.forEach((fn) => fn());
  }

  function setupPlayer() {
    // fechar pelo X, pela tecla Esc ou pelo "voltar" do celular
    $("#player-close").addEventListener("click", () =>
      history.state && history.state.player ? history.back() : closePlayer()
    );
    window.addEventListener("popstate", closePlayer);
    document.addEventListener("keydown", (e) => e.key === "Escape" && playerOpen && history.back());
  }

  /* ---------- Vídeo de fundo que pausa fora da tela ---------- */
  function autoPauseOffscreen(video) {
    if (!window.IntersectionObserver) return;
    new IntersectionObserver(
      ([entry]) => {
        if (playerOpen) return;
        entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
      },
      { threshold: 0.2 }
    ).observe(video);
    listeners.open.push(() => video.pause());
    listeners.close.push(() => video.play().catch(() => {}));
  }

  return { $, esc, toast, setQuote, updateChips, setupChrome, setupPlayer, openPlayer, autoPauseOffscreen };
})();
