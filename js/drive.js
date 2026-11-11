/* =====================================================
   GRUPO "OS ANTÓNIOS" — drive.js
   Galeria ligada ao Google Drive.

   Sempre que alguém abre o site, este ficheiro pede à API do Google Drive
   a lista de fotografias da pasta partilhada e mostra-as na galeria.
   Para acrescentar fotografias basta pô-las no Drive: não é preciso mexer no site.

   Como a pasta está organizada (cada subpasta é um álbum):

       Os Antónios (pasta partilhada)
       ├── 46-aniversario      -> secção «Aniversário», álbum «46.º aniversário»
       ├── 47-aniversario      -> secção «Aniversário», álbum «47.º aniversário»
       ├── piquenique          -> secção «Piquenique»
       ├── sueca               -> secção «Torneio de Sueca» (e destaque na secção «Hoje»)
       └── Magusto 2026        -> secção nova «Magusto 2026», com botão próprio

   As subpastas dentro de um álbum também contam (as fotos juntam-se ao álbum).
   Se o Drive não responder (sem internet, sem chave...), fica a galeria que
   está escrita no index.html.
   ===================================================== */

(function () {
    'use strict';

    var CONFIG = {
        // Chave da API do Google (ver COMO-ACTUALIZAR-EVENTOS.md, «Galeria no Google Drive»).
        chave: 'AIzaSyBgz2LSC0Md-cOGlOvCS7AoB6JyffvVOjQ',
        // Pasta partilhada («Qualquer pessoa com o link»).
        pasta: '1h-ZYtgnP6kJIHBrMV_l2TDsu159Nvkkm',
        // Durante quanto tempo o navegador guarda a lista antes de perguntar outra vez (minutos).
        cacheMinutos: 10
    };

    // Nome da pasta -> secção da galeria
    var EVENTOS = [
        { procura: /sueca/, evento: 'sueca', legenda: 'Torneio de Sueca' },
        { procura: /piquenique|picnic|merenda/, evento: 'piquenique', legenda: 'Piquenique no Santo António do Rio' },
        { procura: /aniversario/, evento: 'aniversario', legenda: 'Aniversário' },
        { procura: /outros|arquivo|antig/, evento: 'outros-anos', legenda: 'Outros anos' }
    ];

    var API = 'https://www.googleapis.com/drive/v3/files';
    var PASTA = 'application/vnd.google-apps.folder';

    function semAcentos(t) {
        return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    }
    function ordenarPorNome(a, b) {
        return a.name.localeCompare(b.name, 'pt', { numeric: true, sensitivity: 'base' });
    }

    /* ---------- Pedidos à API ---------- */
    function listar(pastaId) {
        var ficheiros = [];
        function pagina(token) {
            var q = "'" + pastaId + "' in parents and trashed = false";
            var url = API + '?q=' + encodeURIComponent(q) +
                '&fields=' + encodeURIComponent('nextPageToken,files(id,name,mimeType,imageMediaMetadata(width,height,rotation))') +
                '&pageSize=1000&key=' + encodeURIComponent(CONFIG.chave) +
                (token ? '&pageToken=' + encodeURIComponent(token) : '');
            return fetch(url).then(function (r) {
                if (!r.ok) throw new Error('Drive respondeu ' + r.status);
                return r.json();
            }).then(function (d) {
                ficheiros = ficheiros.concat(d.files || []);
                return d.nextPageToken ? pagina(d.nextPageToken) : ficheiros;
            });
        }
        return pagina();
    }

    // Todas as fotografias de uma pasta e das subpastas (até 3 níveis)
    function fotosDe(pastaId, nivel) {
        return listar(pastaId).then(function (itens) {
            itens.sort(ordenarPorNome);
            var fotos = itens.filter(function (f) { return f.mimeType.indexOf('image/') === 0; });
            var subpastas = itens.filter(function (f) { return f.mimeType === PASTA; });
            if (nivel >= 3 || subpastas.length === 0) return fotos;
            return Promise.all(subpastas.map(function (p) { return fotosDe(p.id, nivel + 1); }))
                .then(function (listas) { return fotos.concat.apply(fotos, listas); });
        });
    }

    function lerDrive() {
        var chaveCache = 'antonios-drive-' + CONFIG.pasta;
        try {
            var guardado = JSON.parse(sessionStorage.getItem(chaveCache) || 'null');
            if (guardado && Date.now() - guardado.quando < CONFIG.cacheMinutos * 60000) return Promise.resolve(guardado.albuns);
        } catch (e) { /* sem sessionStorage: pede sempre */ }

        return listar(CONFIG.pasta).then(function (itens) {
            var pastas = itens.filter(function (f) { return f.mimeType === PASTA; }).sort(ordenarPorNome);
            var soltas = itens.filter(function (f) { return f.mimeType.indexOf('image/') === 0; });
            return Promise.all(pastas.map(function (p) {
                return fotosDe(p.id, 1).then(function (fotos) { return { nome: p.name, fotos: fotos }; });
            })).then(function (albuns) {
                // Fotografias soltas na pasta principal: vão para «Outros anos»
                if (soltas.length) albuns.push({ nome: 'Outros anos', fotos: soltas.sort(ordenarPorNome) });
                albuns = albuns.filter(function (a) { return a.fotos.length > 0; });
                try { sessionStorage.setItem(chaveCache, JSON.stringify({ quando: Date.now(), albuns: albuns })); } catch (e) { /* cheio ou bloqueado */ }
                return albuns;
            });
        });
    }

    /* ---------- Da pasta do Drive à galeria ---------- */
    function eventoDe(nome) {
        var n = semAcentos(nome);
        for (var i = 0; i < EVENTOS.length; i++) if (EVENTOS[i].procura.test(n)) return EVENTOS[i];
        var slug = n.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'evento';
        return { evento: slug, legenda: nome, novo: true };
    }

    // "46-aniversario" -> "46.º aniversário"; "sueca_2026" -> "Sueca 2026"
    function tituloDe(nome) {
        var n = nome.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
        var m = semAcentos(n).match(/^(\d+)\s*(o|º)?\s*aniversario\b(.*)$/);
        if (m) return m[1] + '.º aniversário' + n.slice(n.length - m[3].length);
        return n.charAt(0).toUpperCase() + n.slice(1);
    }

    // Legendas que já estão escritas no site, pelo nome do ficheiro (ex.: altar-ermida.jpeg)
    var legendasDoSite = {};
    Array.prototype.forEach.call(document.querySelectorAll('.galeria a[data-legenda]'), function (a) {
        var nome = a.getAttribute('href').split('/').pop().toLowerCase();
        legendasDoSite[nome] = a.dataset.legenda;
    });

    function figura(foto, legendaBase, n) {
        var id = encodeURIComponent(foto.id);
        var meta = foto.imageMediaMetadata || {};
        var w = meta.width, h = meta.height;
        if (meta.rotation === 1 || meta.rotation === 3) { var t = w; w = h; h = t; }
        var legenda = legendasDoSite[foto.name.toLowerCase()] || (legendaBase + ' (' + n + ')');

        var fig = document.createElement('figure');
        fig.className = 'foto';
        var a = document.createElement('a');
        a.href = foto.grande || 'https://lh3.googleusercontent.com/d/' + id + '=w2000';
        a.dataset.legenda = legenda;
        var img = document.createElement('img');
        img.src = foto.mini || 'https://lh3.googleusercontent.com/d/' + id + '=w800';
        img.dataset.alternativa = 'https://drive.google.com/thumbnail?id=' + id + '&sz=w800';
        img.alt = legenda;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';
        if (w && h) { img.width = w; img.height = h; }
        a.appendChild(img);
        fig.appendChild(a);
        return fig;
    }

    function albumHTML(album, info, mostrarTitulo) {
        var div = document.createElement('div');
        div.className = 'album';
        div.dataset.drive = '';
        if (album.fotos.length > 12) div.dataset.recolher = '12';
        var titulo = tituloDe(album.nome);
        if (mostrarTitulo) {
            var cab = document.createElement('div');
            cab.className = 'album-cabecalho';
            var h4 = document.createElement('h4');
            h4.textContent = titulo;
            cab.appendChild(h4);
            div.appendChild(cab);
        }
        var mosaico = document.createElement('div');
        mosaico.className = 'mosaico';
        var base = mostrarTitulo ? titulo : info.legenda;
        album.fotos.forEach(function (f, i) { mosaico.appendChild(figura(f, base, i + 1)); });
        div.appendChild(mosaico);
        return div;
    }

    function blocoNovo(info) {
        var bloco = document.createElement('div');
        bloco.className = 'evento-galeria';
        bloco.dataset.evento = info.evento;
        bloco.id = 'galeria-' + info.evento;
        var h3 = document.createElement('h3');
        h3.className = 'evento-titulo';
        h3.textContent = info.legenda;
        bloco.appendChild(h3);
        var antesDe = document.getElementById('galeria-outros-anos');
        antesDe.parentNode.insertBefore(bloco, antesDe);

        var botao = document.createElement('button');
        botao.className = 'filtro';
        botao.dataset.filtro = info.evento;
        botao.setAttribute('aria-pressed', 'false');
        botao.textContent = info.legenda;
        var arquivo = document.querySelector('.filtro-arquivo');
        arquivo.parentNode.insertBefore(botao, arquivo);
        return bloco;
    }

    function mostrar(albuns) {
        // Junta os álbuns por secção
        var porEvento = {};
        albuns.forEach(function (a) {
            var info = eventoDe(a.nome);
            (porEvento[info.evento] = porEvento[info.evento] || { info: info, albuns: [] }).albuns.push(a);
        });

        Object.keys(porEvento).forEach(function (chave) {
            var grupo = porEvento[chave];
            var bloco = document.querySelector('.evento-galeria[data-evento="' + chave + '"]') || blocoNovo(grupo.info);

            // As fotografias do Drive substituem os álbuns escritos no index.html desta secção
            Array.prototype.forEach.call(bloco.querySelectorAll('.album'), function (velho) { velho.remove(); });

            // Mais recente primeiro (47.º antes do 46.º); um álbum só com o nome da secção não leva título
            grupo.albuns.sort(function (a, b) { return -ordenarPorNome(a, b); });
            grupo.albuns.forEach(function (album) {
                // Pastas com número ou ano (46-aniversario, Sueca 2027) levam sempre título
                var soNome = !/\d/.test(album.nome) && (grupo.albuns.length === 1 ||
                    semAcentos(album.nome).replace(/[^a-z]/g, '') === semAcentos(grupo.info.legenda).replace(/[^a-z]/g, ''));
                var novo = albumHTML(album, grupo.info, !soNome);
                bloco.appendChild(novo);
            });
            window.Antonios.novasFotos(bloco);
        });
        document.documentElement.classList.add('drive-ligado');
    }

    // Para testar sem a API (consola do navegador): AntoniosDrive.mostrar([{nome:'sueca', fotos:[...]}])
    window.AntoniosDrive = { mostrar: mostrar, tituloDe: tituloDe, eventoDe: eventoDe };

    if (!CONFIG.chave || !CONFIG.pasta || !window.fetch || !window.Antonios) {
        console.info('[drive] Sem chave da API: a galeria usa só as fotografias do site.');
        return;
    }
    lerDrive().then(mostrar).catch(function (erro) {
        console.warn('[drive] Não foi possível ler o Google Drive; fica a galeria do site.', erro);
    });
})();
