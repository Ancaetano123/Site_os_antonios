# Site do Grupo «Os Antónios» de Celorico da Beira

**Site publicado:** <https://ancaetano123.github.io/Site_os_antonios/>

Site estático (HTML, CSS e JavaScript, sem compilação). Basta abrir `index.html` ou publicar a pasta num serviço como o GitHub Pages.

```
index.html                 página
css/style.css              estilos
js/main.js                 vídeo do topo, contagem, encontros, galeria e visualizador
images/                    fotografias originais
images/miniaturas/         versões leves para a galeria (geradas)
media/                     vídeos e cartazes (gerados com Remotion)
remotion/                  projecto Remotion que faz os vídeos
ferramentas/               script das miniaturas
```

Para mudar encontros ou acrescentar fotografias: ver [COMO-ACTUALIZAR-EVENTOS.md](COMO-ACTUALIZAR-EVENTOS.md).

## Vídeos (Remotion)

A pasta `remotion/` gera, a partir das fotografias de `images/`:

| Ficheiro | O que é | Código |
|---|---|---|
| `media/hero-loop.mp4`, `media/hero-loop-movel.mp4` | fundo animado do topo (24 s em loop; a versão móvel é ao alto, 9:16) | `src/HeroLoop.tsx` |
| `media/hero-cartaz.jpg` | imagem que aparece enquanto o vídeo carrega | `src/HeroLoop.tsx` |
| `media/filme-os-antonios.mp4` | filme «De 1980 até hoje» (cerca de 1 min 13 s, sem som; com fotos da Sueca fica mais longo) | `src/Filme.tsx` |
| `media/filme-cartaz.jpg` | cartaz do filme | `src/Stills.tsx` |
| `images/partilha.jpg` | imagem que aparece ao partilhar o site no Facebook ou WhatsApp | `src/Stills.tsx` |

Precisa de Node.js e de ffmpeg.

```
cd remotion
npm install
npm run studio            # pré-visualizar e editar no navegador
npm run render            # gerar tudo
npm run render -- filme   # gerar só o filme (ou: hero, imagens)
```

Para pôr música no filme, coloque o ficheiro em `images/` e acrescente um `<Audio src={staticFile('musica.mp3')} />` em `src/Filme.tsx` (e retire `--muted` do script `scripts/render-all.mjs`). Use só música com autorização.

## Antes de publicar

A imagem de partilha (`og:image` no `index.html`) precisa do endereço completo do site para aparecer no Facebook e no WhatsApp, por exemplo `https://exemplo.pt/images/partilha.jpg`.
