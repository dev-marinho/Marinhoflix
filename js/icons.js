/* ==========================================================
   Ícones dos perfis — traço fino em Areia, no estilo da marca
   (viewBox 100 x 100, sobre o degradê azul do card)
   ========================================================== */
(function () {
  const A = "#F2EEE6";
  const g = (inner) =>
    `<g fill="none" stroke="${A}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;

  window.MARINHO_ICONS = {
    /* Cloche (prato coberto) */
    gastronomia: g(`
      <path d="M24 64 h52"/>
      <path d="M29 64 a21 21 0 0 1 42 0"/>
      <path d="M50 43 v-5"/><path d="M45 38 h10"/>
      <path d="M36 72 h28" opacity=".55"/>`),

    /* Cruz de saúde dentro de um quadrado arredondado */
    cirurgias: g(`
      <rect x="27" y="27" width="46" height="46" rx="12"/>
      <path d="M50 39 v22 M39 50 h22"/>`),

    /* Prédio (empresa) */
    institucionais: g(`
      <path d="M32 74 V30 h24 v44"/>
      <path d="M56 44 h14 v30"/>
      <path d="M26 74 h50"/>
      <path d="M39 38 h3 M46 38 h3 M39 47 h3 M46 47 h3 M39 56 h3 M46 56 h3 M62 52 h2 M62 60 h2"/>`),
  };
})();
