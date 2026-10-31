# Marinho — Portfólio de Videomaker

Portfólio em estilo de plataforma de streaming, feito em HTML, CSS e JavaScript puros (sem instalar nada).

**Site:** https://dev-marinho.github.io/Marinhoflix/

## Páginas
- **Abertura** — logo animada **M → MARINHO** com som sincronizado.
- **Escolha o seu perfil** — vídeo de bastidores no fundo, 3 perfis e convite "Não achou o seu perfil aqui?".
- **Perfis** (Gastronomia, Cirurgias, Institucionais) — vídeo em destaque, Top 5 com player em tela cheia e "Aprovado e publicado" com links dos posts dos clientes.
- **Conheça meu trabalho** — making of, fotos de bastidores e o passo a passo do serviço.

Em todas as páginas internas: Instagram, e-mail (copia com um toque), **Orçamento** no WhatsApp com mensagem pronta por área e barra flutuante.

## Onde editar
Todos os textos, contatos, perfis, vídeos e links ficam em **`js/data.js`**.

| Pasta | Conteúdo |
|---|---|
| `assets/videos/<perfil>/` | Vídeos e capas de cada perfil |
| `assets/bastidores/` | Fotos, making of e vídeo de fundo da tela de perfis |
| `assets/audio/intro.mp3` | Som da abertura |
| `assets/brand/` | Ícone do site e imagem de prévia ao compartilhar |

Para adicionar um vídeo novo: converta para MP4 (H.264, 720×1280), coloque na pasta do perfil e acrescente uma linha no `js/data.js`.
Depois de mudar arquivos, atualize o número `?v=` nos arquivos `.html` para o navegador não mostrar a versão antiga.
