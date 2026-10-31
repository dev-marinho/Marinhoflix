/* ==========================================================
   Avatares dos perfis — rostinho simples + um elemento da área
   (viewBox 100 x 100, desenhados em branco sobre o degradê do card)
   ========================================================== */
(function () {
  const W = "#fff";
  const eye = (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="${W}"/>`;
  const smile = (d) => `<path d="${d}" fill="none" stroke="${W}" stroke-width="6" stroke-linecap="round"/>`;

  window.MARINHO_ICONS = {
    /* Chef: toque blanche + bigode */
    gastronomia: `
      <g fill="${W}">
        <circle cx="34" cy="25" r="11"/><circle cx="50" cy="18" r="13"/><circle cx="66" cy="25" r="11"/>
        <rect x="31" y="25" width="38" height="15" rx="3"/>
      </g>
      <rect x="31" y="34" width="38" height="6" rx="2" fill="rgba(0,50,100,.16)"/>
      ${eye(35, 55)}${eye(65, 55)}
      <path d="M50 67 C45 62 37 62 33 68 C39 67 45 70 50 68 C55 70 61 67 67 68 C63 62 55 62 50 67Z" fill="${W}"/>
      ${smile("M39 77 Q50 85 61 77")}`,

    /* Cirurgião: touca + máscara cirúrgica */
    cirurgias: `
      <path d="M18 40 C14 22 30 11 50 11 C70 11 86 22 82 40 Z" fill="${W}"/>
      <path d="M34 16 Q31 27 33 38 M50 12 L50 38 M66 16 Q69 27 67 38" fill="none" stroke="rgba(0,110,130,.22)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M82 36 Q90 38 92 46 M82 36 Q88 44 86 50" fill="none" stroke="${W}" stroke-width="3" stroke-linecap="round"/>
      ${eye(35, 52)}${eye(65, 52)}
      <path d="M24 64 L8 58 M26 80 L8 85 M76 64 L92 58 M74 80 L92 85" stroke="${W}" stroke-width="3" stroke-linecap="round"/>
      <path d="M24 62 Q50 57 76 62 L74 81 Q50 92 26 81 Z" fill="${W}"/>
      <path d="M31 69 Q50 66 69 69 M31 76 Q50 74 69 76" fill="none" stroke="rgba(0,110,130,.3)" stroke-width="2.5" stroke-linecap="round"/>`,

    /* Executivo: terno, camisa e gravata */
    institucionais: `
      ${eye(35, 35)}${eye(65, 35)}
      ${smile("M37 50 Q50 59 63 50")}
      <path d="M6 100 Q10 74 39 67 L50 80 L61 67 Q90 74 94 100Z" fill="rgba(0,12,60,.42)"/>
      <path d="M40 67 L60 67 L50 92 Z" fill="${W}"/>
      <path d="M46 69 L54 69 L52.5 75 L47.5 75Z" fill="#0b1f5c"/>
      <path d="M47.5 75 L52.5 75 L55.5 91 L50 99 L44.5 91Z" fill="#0b1f5c"/>`,

    /* Criativo de agência: boina, piscadinha e brilho */
    agencias: `
      <g transform="rotate(-8 50 24)">
        <path d="M20 30 C22 14 46 8 66 12 C82 15 87 24 80 30 Z" fill="${W}"/>
        <rect x="20" y="27" width="60" height="7" rx="3.5" fill="${W}"/>
        <path d="M50 11 L52 4" stroke="${W}" stroke-width="3.5" stroke-linecap="round"/>
      </g>
      ${eye(35, 54)}
      <path d="M58 55 Q65 48 72 55" fill="none" stroke="${W}" stroke-width="5" stroke-linecap="round"/>
      ${smile("M33 69 Q50 85 67 69")}
      <path d="M86 62 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="${W}" opacity=".9"/>`,
  };
})();
