(function () {
  const data = window.MARINHO;
  const icons = window.MARINHO_ICONS;
  const $ = (sel) => document.querySelector(sel);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tempos da abertura (segundos) — sincronizados com o CSS
  const T = {
    mIn: 0.1,      // "M" aparece
    expand: 1.05,  // abre para "MARINHO"
    end: 3.7,      // troca para a tela de perfis
  };

  /* ---------- Troca de telas ---------- */
  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => {
      const active = s.id === id;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-hidden", active ? "false" : "true");
    });
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
  }

  /* ---------- Abertura ---------- */
  function buildLogo() {
    const rest = $("#logo-rest");
    data.marca.slice(1).split("").forEach((letter, i) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.setProperty("--i", i);
      rest.appendChild(span);
    });
  }

  function measureLogo() {
    // Mede a largura real do "ARINHO" para a expansão ficar exata
    const rest = $("#logo-rest");
    rest.style.maxWidth = "none";
    const w = rest.scrollWidth;
    rest.style.maxWidth = "";
    rest.style.setProperty("--rest-w", Math.ceil(w) + 2 + "px");
  }

  async function startIntro() {
    IntroSound.unlock();
    // garante que a fonte da logo já carregou antes de medir
    if (document.fonts && document.fonts.ready) {
      const fontLoad = document.fonts.load('400 1em "Bebas Neue"').then(() => document.fonts.ready);
      await Promise.race([fontLoad, new Promise((r) => setTimeout(r, 1500))]);
    }
    show("intro");
    measureLogo();

    if (reduceMotion) {
      $("#intro").classList.add("play", "reduced");
      setTimeout(showProfiles, 1200);
      return;
    }

    // força reflow para a animação sempre recomeçar
    void $("#intro").offsetWidth;
    $("#intro").classList.add("play");
    IntroSound.play(T.mIn, T.expand);
    setTimeout(showProfiles, T.end * 1000);
  }

  /* ---------- Tela de perfis ---------- */
  function buildProfilesHero() {
    const fundo = data.telaPerfis.fundo;
    const bg = $("#profiles-bg");

    if (fundo.tipo === "video" && fundo.src) {
      const v = document.createElement("video");
      Object.assign(v, { src: fundo.src, muted: true, loop: true, autoplay: true, playsInline: true });
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      if (fundo.capa) v.poster = fundo.capa;
      bg.appendChild(v);
    } else if (fundo.tipo === "imagem" && fundo.src) {
      const img = document.createElement("img");
      img.src = fundo.src;
      img.alt = "";
      bg.appendChild(img);
    } else {
      bg.classList.add("is-placeholder");
    }

    $("#feature-title").textContent = data.telaPerfis.titulo;
    $("#feature-sub").textContent = data.telaPerfis.subtitulo;
  }

  function buildProfilesGrid() {
    const grid = $("#profiles-grid");
    data.perfis.forEach((p, i) => {
      const li = document.createElement("li");
      li.style.setProperty("--i", i);
      li.innerHTML = `
        <button class="profile" type="button" data-id="${p.id}">
          <span class="profile__tile">
            <svg viewBox="0 0 24 24" aria-hidden="true">${icons[p.icone] || ""}</svg>
          </span>
          <span class="profile__name">${p.nome}</span>
        </button>`;
      grid.appendChild(li);
    });

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".profile");
      if (!btn) return;
      const perfil = data.perfis.find((p) => p.id === btn.dataset.id);
      btn.classList.add("is-picked");
      setTimeout(() => btn.classList.remove("is-picked"), 400);
      // Próxima etapa: abrir a página do perfil (perfil.html?area=...)
      toast(`Área ${perfil.nome}: em construção 🎬`);
    });
  }

  function showProfiles() {
    show("profiles");
    $("#profiles").classList.add("is-entering");
    const v = $("#profiles-bg video");
    if (v) v.play().catch(() => {});
  }

  /* ---------- Início ---------- */
  buildLogo();
  buildProfilesHero();
  buildProfilesGrid();

  $("#gate-btn").addEventListener("click", startIntro, { once: true });
})();
