/* ==========================================================
   DADOS DO PORTFÓLIO — edite só este arquivo para atualizar
   textos, contatos, perfis e vídeos.

   Para cada vídeo:
     video: caminho do arquivo .mp4 (ex.: "assets/videos/gastronomia/drink.mp4")
     capa:  imagem que aparece antes do vídeo carregar (ex.: ".../drink.jpg")

   Em "aprovados" (Aprovado e publicado):
     cliente: @ do cliente no Instagram
     link:    link do post do cliente no Instagram
   ========================================================== */

// Atalhos para os vídeos de exemplo (apague quando colocar os seus)
const EX = (n) => ({ video: `assets/exemplos/video-${n}.mp4`, capa: `assets/exemplos/capa-${n}.jpg` });

window.MARINHO = {
  marca: "MARINHO",

  contato: {
    instagram: "https://www.instagram.com/mkt.marinho/",
    whatsapp: "5522997032238", // 55 (Brasil) + 22 (DDD) + número
    email: "mktmarinho.isabella@gmail.com",
  },

  /* Destaque do fundo da tela "Qual o seu negócio?"
     tipo: "video" | "imagem" | "nenhum" (usa o fundo azul de exemplo) */
  telaPerfis: {
    fundo: {
      tipo: "nenhum",
      src: "",  // ex.: "assets/videos/showreel.mp4" ou "assets/img/destaque.jpg"
      capa: "", // imagem exibida enquanto o vídeo carrega
    },
    titulo: "Showreel 2026",
    subtitulo: "Captação e edição mobile para marcas que querem ser vistas",
  },

  /* Página "Conheça meu trabalho" */
  trabalho: {
    titulo: "Conheça meu trabalho",
    subtitulo: "Da captação à entrega: como eu transformo o seu negócio em vídeo.",
    video: "assets/bastidores/making-of.mp4",
    capa: "assets/bastidores/making-of-capa.jpg",
    fotos: [
      { src: "assets/bastidores/foto-1.jpg", legenda: "Captação noturna em gastronomia" },
      { src: "assets/bastidores/foto-2.jpg", legenda: "Gravação na fachada do cliente" },
      { src: "assets/bastidores/foto-3.jpg", legenda: "Entrevista com estabilizador" },
      { src: "assets/bastidores/foto-4.jpg", legenda: "Revisando as cenas com a cliente" },
      { src: "assets/bastidores/foto-5.jpg", legenda: "Captando o cardápio com a cliente" },
      { src: "assets/bastidores/foto-6.jpg", legenda: "Conferindo o take no estabilizador" },
      { src: "assets/bastidores/foto-7.jpg", legenda: "Pausa entre uma cena e outra" },
      { src: "assets/bastidores/foto-8.jpg", legenda: "Montando a cena com tripé e luz" },
      { src: "assets/bastidores/foto-9.jpg", legenda: "Dirigindo a cena do vinho" },
      { src: "assets/bastidores/foto-10.jpg", legenda: "Ajustando os detalhes antes de gravar" },
    ],
    etapas: [
      { titulo: "Briefing", texto: "A gente conversa sobre o seu negócio, o seu público e o objetivo de cada vídeo." },
      { titulo: "Roteiro", texto: "Planejo as cenas, os ganchos e a mensagem para o vídeo prender a atenção desde o primeiro segundo." },
      { titulo: "Captação", texto: "Gravação no seu espaço, com celular profissional, estabilizador e iluminação." },
      { titulo: "Edição", texto: "Cortes dinâmicos, trilha, legendas e tratamento de cor no padrão das redes sociais." },
      { titulo: "Entrega", texto: "Vídeos prontos para postar, no formato certo para cada rede." },
    ],
    whatsappMsg: "Olá, Marinho! Vi seu portfólio e quero solicitar um orçamento.",
  },

  perfis: [
    /* ------------------------------------------------ GASTRONOMIA */
    {
      id: "gastronomia",
      nome: "Gastronomia",
      icone: "gastronomia",
      cores: ["#0086d6", "#4fc3ff"], // degradê do avatar (topo, base)
      whatsappMsg: "Olá, Marinho! Vi seu portfólio e quero um orçamento de vídeo para o meu restaurante/bar.",
      destaque: {
        titulo: "Quatro Atos",
        descricao: "Fogo na mesa e um prato servido em quatro atos: gastronomia que vira espetáculo.",
        video: "assets/videos/gastronomia/destaque.mp4",
        capa: "assets/videos/gastronomia/destaque-capa.jpg",
      },
      top5: [
        { titulo: "Brisa de Setembro", video: "assets/videos/gastronomia/top1.mp4", capa: "assets/videos/gastronomia/top1-capa.jpg" },
        { titulo: "Pappardelle com ragu de short rib", video: "assets/videos/gastronomia/top2.mp4", capa: "assets/videos/gastronomia/top2-capa.jpg" },
        { titulo: "Seu amor merece um jantar", video: "assets/videos/gastronomia/top3.mp4", capa: "assets/videos/gastronomia/top3-capa.jpg" },
        { titulo: "Menu Dia dos Namorados", video: "assets/videos/gastronomia/top4.mp4", capa: "assets/videos/gastronomia/top4-capa.jpg" },
        { titulo: "Camarão da casa", video: "assets/videos/gastronomia/top5.mp4", capa: "assets/videos/gastronomia/top5-capa.jpg" },
      ],
      aprovados: [
        { cliente: "@anexo.gastro", capa: "assets/videos/gastronomia/destaque-capa.jpg", link: "https://www.instagram.com/reel/Dd7gytBzlpb/" },
        { cliente: "@anexo.gastro", capa: "assets/videos/gastronomia/post2-capa.jpg?v=202610311458", link: "https://www.instagram.com/reel/DdJtKZ3RQTa/" },
        { cliente: "@anexo.gastro", capa: "assets/videos/gastronomia/post3-capa.jpg?v=202610311458", link: "https://www.instagram.com/reel/DZLVu_2z01C/" },
        { cliente: "@anexo.gastro", capa: "assets/videos/gastronomia/post4-capa.jpg?v=202610311458", link: "https://www.instagram.com/reel/DXPhzm_E04N/" },
        { cliente: "@anexo.gastro", capa: "assets/videos/gastronomia/post5-capa.jpg?v=202610311458", link: "https://www.instagram.com/reel/DWojZV2DoHU/" },
      ],
    },

    /* ------------------------------------------------ CIRURGIAS */
    {
      id: "cirurgias",
      nome: "Cirurgias",
      icone: "cirurgias",
      cores: ["#008a9e", "#55d3d6"],
      whatsappMsg: "Olá, Marinho! Vi seu portfólio e quero um orçamento de vídeo para a minha clínica/consultório.",
      destaque: {
        titulo: "Mamoplastia de Aumento",
        descricao: "Do consultório ao centro cirúrgico: o procedimento explicado com ética e clareza.",
        video: "assets/videos/cirurgias/destaque.mp4",
        capa: "assets/videos/cirurgias/destaque-capa.jpg",
      },
      top5: [
        { titulo: "Mamoplastia de aumento", video: "assets/videos/cirurgias/destaque.mp4", capa: "assets/videos/cirurgias/top1-capa.jpg" },
        { titulo: "Centro cirúrgico", video: "assets/videos/cirurgias/top2.mp4", capa: "assets/videos/cirurgias/top2-capa.jpg" },
        { titulo: "Pós-operatório imediato", video: "assets/videos/cirurgias/top3.mp4", capa: "assets/videos/cirurgias/top3-capa.jpg" },
        { titulo: "Cirurgião e instrumentadora", video: "assets/videos/cirurgias/top4.mp4", capa: "assets/videos/cirurgias/top4-capa.jpg" },
        { titulo: "Antes e depois", video: "assets/videos/cirurgias/top5.mp4", capa: "assets/videos/cirurgias/top5-capa.jpg" },
      ],
      aprovados: [
        {
          cliente: "@dr.augustopedretti",
          capa: "assets/videos/cirurgias/post1-capa.jpg?v=202610311417",
          link: "https://www.instagram.com/reel/DdoMiPHRSsl/",
        },
        {
          cliente: "@dr.augustopedretti",
          capa: "assets/videos/cirurgias/post2-capa.jpg?v=202610311419",
          link: "https://www.instagram.com/reel/DclecvpOk2I/",
        },
        {
          cliente: "@dr.augustopedretti",
          capa: "assets/videos/cirurgias/post3-capa.jpg?v=202610311420",
          link: "https://www.instagram.com/reel/DcbVA4Bu_V7/",
        },
      ],
    },

    /* ------------------------------------------------ INSTITUCIONAIS */
    {
      id: "institucionais",
      nome: "Institucionais",
      icone: "institucionais",
      cores: ["#1737c9", "#5f80ff"],
      whatsappMsg: "Olá, Marinho! Vi seu portfólio e quero um orçamento de vídeo institucional para a minha empresa.",
      destaque: {
        titulo: "Como Funciona o Presbyond",
        descricao: "Dr. João Vitor Terra, cirurgião oftalmologista, explica a cirurgia a laser para a vista cansada.",
        video: "assets/videos/institucionais/destaque.mp4?v=202610311529",
        capa: "assets/videos/institucionais/destaque-capa.jpg?v=202610311529",
      },
      top5: [
        { titulo: "Como funciona o Presbyond", video: "assets/videos/institucionais/destaque.mp4?v=202610311633", capa: "assets/videos/institucionais/top1-capa.jpg?v=202610311633" },
        { titulo: "Cirurgia de catarata", video: "assets/videos/institucionais/top2.mp4", capa: "assets/videos/institucionais/top2-capa.jpg" },
        { titulo: "Quem refaz essa conta?", video: "assets/videos/institucionais/top3.mp4", capa: "assets/videos/institucionais/top3-capa.jpg" },
        { titulo: "Regime monofásico", video: "assets/videos/institucionais/top4.mp4", capa: "assets/videos/institucionais/top4-capa.jpg" },
        { titulo: "A legislação muda", video: "assets/videos/institucionais/top5.mp4", capa: "assets/videos/institucionais/top5-capa.jpg" },
      ],
      aprovados: [
        { cliente: "@cliente.exemplo", ...EX(2), link: "https://www.instagram.com/mkt.marinho/" },
        { cliente: "@cliente.exemplo", ...EX(5), link: "https://www.instagram.com/mkt.marinho/" },
        { cliente: "@cliente.exemplo", ...EX(1), link: "https://www.instagram.com/mkt.marinho/" },
        { cliente: "@cliente.exemplo", ...EX(4), link: "https://www.instagram.com/mkt.marinho/" },
      ],
    },
  ],
};
