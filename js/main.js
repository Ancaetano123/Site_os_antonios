/* =====================================================
   GRUPO "OS ANTÓNIOS" — main.js
   ===================================================== */

(function () {
    'use strict';

    var reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function hojeSemHoras() {
        var d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    function cada(seletor, fn, raiz) {
        Array.prototype.forEach.call((raiz || document).querySelectorAll(seletor), fn);
    }

    /* -------------------------------------------------------
       NAVEGAÇÃO — fundo ao descer, barra de leitura e menu no telemóvel
    ------------------------------------------------------- */
    var nav = document.getElementById('nav');
    var navMenu = document.getElementById('navMenu');
    var navLinks = document.getElementById('navLinks');
    var navProgresso = document.getElementById('navProgresso');
    var heroMedia = document.querySelector('.hero-media');
    var heroConteudo = document.querySelector('.hero-conteudo');
    var pedido = false;

    function aoDescer() {
        pedido = false;
        var y = window.scrollY;
        nav.classList.toggle('solida', y > 40 || navLinks.classList.contains('aberto'));
        var total = document.documentElement.scrollHeight - window.innerHeight;
        navProgresso.style.setProperty('--lido', total > 0 ? Math.min(1, y / total) : 0);

        // Paralaxe suave no topo: a imagem desce mais devagar e o texto desvanece.
        if (!reduzirMovimento && y < window.innerHeight * 1.2) {
            heroMedia.style.transform = 'translate3d(0,' + (y * 0.35) + 'px,0) scale(' + (1 + y / 6000) + ')';
            heroConteudo.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.75)));
        }
    }
    window.addEventListener('scroll', function () {
        if (!pedido) { pedido = true; requestAnimationFrame(aoDescer); }
    }, { passive: true });
    aoDescer();

    function abrirMenu(abrir) {
        navLinks.classList.toggle('aberto', abrir);
        navMenu.setAttribute('aria-expanded', String(abrir));
        navMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
        document.body.style.overflow = abrir ? 'hidden' : '';
        aoDescer();
    }
    navMenu.addEventListener('click', function () {
        abrirMenu(navMenu.getAttribute('aria-expanded') !== 'true');
    });
    navLinks.addEventListener('click', function (e) {
        if (e.target.closest('a')) abrirMenu(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('aberto')) {
            abrirMenu(false);
            navMenu.focus();
        }
    });

    // Assinala na navegação a secção que está à vista
    var ligacoes = navLinks.querySelectorAll('a');
    var observadorSeccoes = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (!entrada.isIntersecting) return;
            ligacoes.forEach(function (a) {
                if (a.getAttribute('href') === '#' + entrada.target.id) a.setAttribute('aria-current', 'true');
                else a.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    cada('main section[id]', function (s) { observadorSeccoes.observe(s); });

    /* -------------------------------------------------------
       VÍDEO DO TOPO (feito com Remotion)
       Não carrega se a pessoa pediu menos movimento ou poupança de dados.
    ------------------------------------------------------- */
    var heroVideo = document.getElementById('heroVideo');
    var heroPausa = document.getElementById('heroPausa');
    var poupaDados = navigator.connection && navigator.connection.saveData;

    if (heroVideo && !reduzirMovimento && !poupaDados) {
        var movel = window.matchMedia('(max-width: 900px)').matches;
        heroVideo.src = movel ? heroVideo.dataset.srcMovel : heroVideo.dataset.srcGrande;
        heroVideo.addEventListener('playing', function () {
            heroVideo.classList.add('pronto');
            heroPausa.hidden = false;
        }, { once: true });

        var pausadoPelaPessoa = false;
        var tocar = function () {
            var p = heroVideo.play();
            if (p && p.catch) p.catch(function () { /* autoplay bloqueado: fica o cartaz */ });
        };
        var mostrarEstadoPausa = function () {
            var pausado = heroVideo.paused;
            heroPausa.setAttribute('aria-label', pausado ? 'Retomar vídeo de fundo' : 'Pausar vídeo de fundo');
            heroPausa.querySelector('use').setAttribute('href', pausado ? '#i-play' : '#i-pausa');
        };
        heroPausa.addEventListener('click', function () {
            pausadoPelaPessoa = !heroVideo.paused;
            if (pausadoPelaPessoa) heroVideo.pause(); else tocar();
        });
        heroVideo.addEventListener('play', mostrarEstadoPausa);
        heroVideo.addEventListener('pause', mostrarEstadoPausa);

        // Pára quando sai do ecrã, para poupar bateria
        new IntersectionObserver(function (entradas) {
            if (entradas[0].isIntersecting) { if (!pausadoPelaPessoa) tocar(); }
            else heroVideo.pause();
        }).observe(heroVideo);
    }

    /* -------------------------------------------------------
       CONTAGEM PARA O PRÓXIMO 13 DE JUNHO
    ------------------------------------------------------- */
    (function () {
        var hoje = hojeSemHoras();
        var ano = hoje.getFullYear();
        var alvo = new Date(ano, 5, 13);
        if (hoje > alvo) { ano += 1; alvo = new Date(ano, 5, 13); }
        var dias = Math.round((alvo - hoje) / 86400000);
        var aniversario = ano - 1980;

        document.getElementById('contagemTitulo').textContent = aniversario + '.º aniversário';
        document.getElementById('contagemData').textContent = '13 de junho de ' + ano;
        var el = document.getElementById('contagemDias');
        if (dias === 0) el.innerHTML = '<strong>É hoje.</strong> Viva Santo António!';
        else if (dias === 1) el.innerHTML = '<strong>Amanhã.</strong>';
        else el.innerHTML = 'Faltam <strong>' + dias + '</strong> dias.';
    })();

    /* -------------------------------------------------------
       ENCONTROS — esconde sozinho os que já passaram
    ------------------------------------------------------- */
    (function () {
        var hoje = hojeSemHoras();
        var visiveis = 0;
        cada('#agenda .evento', function (ev) {
            var p = (ev.dataset.data || '').split('-');
            var data = new Date(+p[0], +p[1] - 1, +p[2]);
            var passou = !isNaN(data) && data < hoje;
            ev.hidden = passou;
            if (!passou) visiveis++;
        });
        document.getElementById('agendaVazia').hidden = visiveis > 0;
    })();

    /* -------------------------------------------------------
       ENTRADAS SUAVES — os blocos sobem e aparecem ao chegar ao ecrã
    ------------------------------------------------------- */
    var BLOCOS = '.seccao h2, .cabecalho, .historia .prosa, .cronologia li, .citacao, .santo-imagem, .santo .prosa,' +
        ' .evento, .tradicoes dl > div, .bandeira .prosa, .bandeira-duo figure, .documentos li, .media li, .evento-titulo, .album-cabecalho';

    var observadorEntradas = null;
    if ('IntersectionObserver' in window && !reduzirMovimento) {
        observadorEntradas = new IntersectionObserver(function (entradas) {
            // As que entram juntas aparecem em cascata
            var juntas = entradas.filter(function (e) { return e.isIntersecting; });
            juntas.forEach(function (e, i) {
                e.target.style.setProperty('--atraso', Math.min(i * 0.07, 0.5) + 's');
                e.target.classList.add('visivel');
                observadorEntradas.unobserve(e.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    function observarFoto(el) {
        if (observadorEntradas) observadorEntradas.observe(el);
        else el.classList.add('visivel');
    }
    function prepararEntradas(raiz) {
        cada(BLOCOS, function (el) { if (!el.closest('.revelar')) el.classList.add('revelar'); }, raiz);
        cada('.revelar, .foto', observarFoto, raiz);
    }

    /* Cada fotografia aparece com um fundido suave quando acaba de carregar */
    var IMAGENS = '.foto img, .fita img, .sueca-colagem img, .bandeira-duo img, .santo-imagem img, .documentos img';
    function prepararImagens(raiz) {
        cada(IMAGENS, function (img) {
            if (img.dataset.preparada) return;
            img.dataset.preparada = '1';
            function pronta() { img.classList.add('carregada'); img.classList.remove('a-carregar'); }
            if (img.complete && img.naturalWidth > 0) { pronta(); return; }
            img.classList.add('a-carregar');
            img.addEventListener('load', pronta);
            img.addEventListener('error', function () {
                // Miniatura em falta: mostra a fotografia original (ou o endereço alternativo do Drive)
                var a = img.closest('a[data-legenda]');
                if (img.dataset.alternativa) { img.src = img.dataset.alternativa; img.removeAttribute('data-alternativa'); }
                else if (a && img.src.indexOf('/miniaturas/') !== -1) img.src = a.getAttribute('href');
                else pronta();
            });
        }, raiz);
    }

    /* -------------------------------------------------------
       GALERIA — forma de cada fotografia, álbuns vazios e "ver mais"
    ------------------------------------------------------- */
    // Fotografias ao alto ocupam duas linhas; as muito largas, duas colunas.
    function formaDasFotos(raiz) {
        cada('.foto img', function (img) {
            var w = +img.getAttribute('width'), h = +img.getAttribute('height');
            if (!w || !h) return;
            var foto = img.closest('.foto');
            foto.classList.toggle('alta', h / w > 1.25);
            foto.classList.toggle('larga', w / h > 1.9);
        }, raiz);
    }

    function prepararAlbum(album) {
        var fotos = album.querySelectorAll('.foto');
        album.classList.toggle('sem-fotos', fotos.length === 0);

        var limite = +album.dataset.recolher;
        if (!limite || fotos.length <= limite || album.querySelector('.ver-mais')) return;
        Array.prototype.slice.call(fotos, limite).forEach(function (f) { f.classList.add('extra'); });
        album.classList.add('recolhido');
        var botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'ver-mais';
        var textoFechado = 'Ver mais ' + (fotos.length - limite) + ' fotografias';
        botao.innerHTML = '<span>' + textoFechado + '</span><svg aria-hidden="true"><use href="#i-baixo"/></svg>';
        botao.setAttribute('aria-expanded', 'false');
        botao.addEventListener('click', function () {
            var abrir = album.classList.contains('recolhido');
            album.classList.toggle('recolhido', !abrir);
            botao.setAttribute('aria-expanded', String(abrir));
            botao.querySelector('span').textContent = abrir ? 'Mostrar menos' : textoFechado;
            if (abrir) cada('.foto.extra', function (f) { observarFoto(f); }, album);
            else album.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth', block: 'start' });
        });
        album.appendChild(botao);
    }

    /* Filtros por evento: Aniversário, Piquenique, Sueca e Outros anos
       (e os eventos novos que venham do Google Drive).
       Os blocos com data-so-filtro (Outros anos) não aparecem em «Todos»:
       só quando se carrega no botão deles. */
    var caixaFiltros = document.querySelector('.filtros');
    cada('.evento-galeria[data-so-filtro]', function (bloco) { bloco.hidden = true; });
    function escolherFiltro(filtro) {
        cada('.filtro', function (b) {
            var activo = b.dataset.filtro === filtro;
            b.classList.toggle('activo', activo);
            b.setAttribute('aria-pressed', String(activo));
        });
        cada('.evento-galeria', function (bloco) {
            var soFiltro = bloco.hasAttribute('data-so-filtro');
            bloco.hidden = !((filtro === 'todas' && !soFiltro) || bloco.dataset.evento === filtro);
            if (!bloco.hidden) {
                // Volta a animar a entrada das fotografias que agora aparecem
                cada('.foto', function (f) { f.classList.remove('visivel'); observarFoto(f); }, bloco);
            }
        });
    }
    caixaFiltros.addEventListener('click', function (e) {
        var b = e.target.closest('.filtro');
        if (b) escolherFiltro(b.dataset.filtro);
    });

    /* -------------------------------------------------------
       GALERIA FECHADA — só abre com o botão «Ver a galeria»
       (ou ao seguir uma ligação para dentro dela, como «Ver as fotografias» da Sueca)
    ------------------------------------------------------- */
    var galeriaConteudo = document.getElementById('galeriaConteudo');
    var abrirGaleria = document.getElementById('abrirGaleria');
    var montra = document.getElementById('galeriaMontra');
    function textoAbrir() {
        return 'Ver a galeria (' + galeriaConteudo.querySelectorAll('.foto').length + ' fotografias)';
    }
    abrirGaleria.querySelector('span').textContent = textoAbrir();
    abrirGaleria.hidden = false;
    galeriaConteudo.hidden = true;

    function mostrarGaleria(abrir, evento) {
        galeriaConteudo.hidden = !abrir;
        galeriaConteudo.classList.toggle('a-abrir', abrir && !reduzirMovimento);
        abrirGaleria.setAttribute('aria-expanded', String(abrir));
        abrirGaleria.querySelector('span').textContent = abrir ? 'Fechar a galeria' : textoAbrir();
        montra.classList.toggle('aberta', abrir);
        if (abrir) {
            // Volta a observar as fotografias, agora que estão visíveis, para entrarem com animação
            cada('.foto, .revelar', function (f) {
                if (observadorEntradas) observadorEntradas.unobserve(f);
                if (!f.classList.contains('visivel')) observarFoto(f);
            }, galeriaConteudo);
        }
        if (abrir && evento) escolherFiltro(evento);
    }
    abrirGaleria.addEventListener('click', function () {
        var abrir = galeriaConteudo.hidden;
        mostrarGaleria(abrir);
        if (!abrir) document.getElementById('galeria').scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth' });
    });

    /* Montra: mosaico ao lado do título, com fotografias da galeria que vão
       trocando sozinhas, uma de cada vez, com fundido. Clicar abre a galeria. */
    var montraFila = [];
    var montraPecas = [];
    var montraProxima = 9, montraUltima = -1, montraIntervalo = null;
    function baralhar(l) { for (var i = l.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = l[i]; l[i] = l[j]; l[j] = t; } return l; }
    function fontesDe(seletor) {
        return Array.prototype.map.call(galeriaConteudo.querySelectorAll(seletor), function (img) { return img.getAttribute('src'); });
    }
    function porNaPeca(peca, src) {
        var nova = new Image();
        nova.alt = '';
        nova.decoding = 'async';
        nova.onload = function () {
            peca.appendChild(nova);
            void nova.offsetWidth;
            nova.classList.add('activa');
            Array.prototype.forEach.call(peca.querySelectorAll('img'), function (antiga) {
                if (antiga === nova) return;
                antiga.classList.remove('activa');
                setTimeout(function () { antiga.remove(); }, 1300);
            });
        };
        nova.src = src;
    }
    // Fotografias de grupo, com os Antónios todos juntos. A primeira fica no
    // quadrado grande ao abrir a página; depois o quadrado grande só mostra estas.
    // No Google Drive, uma fotografia com «grupo» no nome também entra aqui.
    var FOTOS_DE_GRUPO = [
        'images/miniaturas/historia/bandeira-tres-membros.webp',
        'images/miniaturas/galeria/aniversarios/46-aniversario/jantar-brinde-bandeira.webp',
        'images/miniaturas/historia/jantar-mesa-redonda-01.webp',
        'images/miniaturas/galeria/aniversarios/46-aniversario/chegada-ermida.webp',
        'images/miniaturas/historia/jantar-mesa-comprida-04.webp',
        'images/miniaturas/historia/jantar-selfie-02.webp',
        'images/miniaturas/historia/jantar-mesa-comprida-07.webp',
        'images/miniaturas/historia/jantar-tres-antonios.webp'
    ];
    var grupoFila = [], grupoProxima = 1, trocas = 0;
    function semRepetidas(l) { return l.filter(function (x, i) { return x && l.indexOf(x) === i; }); }

    function actualizarMontra() {
        var grupo = semRepetidas(FOTOS_DE_GRUPO.concat(fontesDe('.foto[data-grupo] img')));
        grupoFila = [grupo[0]].concat(baralhar(grupo.slice(1)));
        grupoProxima = 1;
        // Quadrados pequenos: primeiro mais fotografias de grupo, depois as recentes, por fim as antigas
        var recentes = fontesDe('.evento-galeria:not([data-so-filtro]) .foto img');
        var antigas = fontesDe('.evento-galeria[data-so-filtro] .foto img');
        montraFila = semRepetidas(baralhar(grupo.slice(1)).concat(baralhar(recentes), baralhar(antigas)));
        if (montraFila.length < 9) return;
        if (montraPecas.length === 0) {
            for (var i = 0; i < 9; i++) {
                var peca = document.createElement('div');
                peca.className = 'montra-peca revelar';
                peca.style.setProperty('--atraso', (i * 0.06) + 's');
                montra.appendChild(peca);
                montraPecas.push(peca);
                observarFoto(peca);
            }
            montra.hidden = false;
        }
        // Mostra já as primeiras nove da fila nova (ex.: quando chegam as fotos do Drive)
        porNaPeca(montraPecas[0], grupoFila[0]);
        for (var p = 1; p < 9; p++) porNaPeca(montraPecas[p], montraFila[p - 1]);
        montraProxima = 8;
    }
    function trocarNaMontra() {
        if (montraFila.length <= 9) return;
        trocas++;
        // De quatro em quatro trocas, o quadrado grande passa à fotografia de grupo seguinte
        if (trocas % 4 === 0 && grupoFila.length > 1) {
            porNaPeca(montraPecas[0], grupoFila[grupoProxima % grupoFila.length]);
            grupoProxima++;
            return;
        }
        var n;
        do { n = 1 + Math.floor(Math.random() * 8); } while (n === montraUltima);
        montraUltima = n;
        porNaPeca(montraPecas[n], montraFila[montraProxima % montraFila.length]);
        montraProxima++;
    }
    montra.addEventListener('click', function () { abrirGaleria.click(); });
    if (!reduzirMovimento) {
        // Só troca enquanto a montra está à vista
        new IntersectionObserver(function (e) {
            if (e[0].isIntersecting && !montraIntervalo) montraIntervalo = setInterval(trocarNaMontra, 2200);
            else if (!e[0].isIntersecting) { clearInterval(montraIntervalo); montraIntervalo = null; }
        }).observe(montra);
    }

    // Ligações para dentro da galeria (ex.: #album-sueca) abrem-na primeiro
    function abrirSeDentro(id) {
        var alvo = id && document.getElementById(id);
        if (!alvo || !galeriaConteudo.contains(alvo)) return null;
        var bloco = alvo.closest('.evento-galeria');
        mostrarGaleria(true, bloco ? bloco.dataset.evento : null);
        return alvo;
    }
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a) return;
        var alvo = abrirSeDentro(a.getAttribute('href').slice(1));
        if (!alvo) return;
        e.preventDefault();
        requestAnimationFrame(function () {
            alvo.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth' });
        });
    });

    /* -------------------------------------------------------
       TORNEIO DE SUECA — colagem feita a partir do álbum da galeria
    ------------------------------------------------------- */
    function fazerColagemSueca() {
        var colagem = document.getElementById('suecaColagem');
        var fotos = document.querySelectorAll('#album-sueca .foto a');
        if (!colagem || fotos.length === 0) return;
        colagem.innerHTML = '';
        colagem.removeAttribute('aria-hidden');
        colagem.classList.remove('uma', 'duas', 'tres');
        var n = Math.min(3, fotos.length);
        colagem.classList.add(n === 1 ? 'uma' : n === 2 ? 'duas' : 'tres');
        for (var i = 0; i < n; i++) {
            var copia = fotos[i].cloneNode(true);
            copia.setAttribute('data-colagem', '');
            var img = copia.querySelector('img');
            img.classList.remove('a-carregar', 'carregada');
            img.removeAttribute('data-preparada');
            img.loading = 'eager';
            colagem.appendChild(copia);
        }
        prepararImagens(colagem);
    }

    /* -------------------------------------------------------
       FITA DE FOTOGRAFIAS RECENTES — corre sozinha, em loop
    ------------------------------------------------------- */
    (function () {
        var pista = document.querySelector('.fita-pista');
        if (!pista || reduzirMovimento) return;
        // Duplica as fotografias para o loop não ter salto. As cópias ficam
        // escondidas dos leitores de ecrã e fora da ordem do Tab.
        Array.prototype.slice.call(pista.children).forEach(function (li) {
            var c = li.cloneNode(true);
            c.setAttribute('aria-hidden', 'true');
            c.setAttribute('data-copia', '');
            c.querySelector('a').tabIndex = -1;
            pista.appendChild(c);
        });
        pista.style.setProperty('--duracao-fita', (pista.children.length * 5) + 's');
        pista.classList.add('a-correr');
    })();

    /* -------------------------------------------------------
       Arranque: prepara tudo o que já está na página
    ------------------------------------------------------- */
    formaDasFotos(document);
    cada('.album', prepararAlbum);
    fazerColagemSueca();
    prepararEntradas(document);
    prepararImagens(document);
    actualizarMontra();
    if (location.hash) {
        var alvoInicial = abrirSeDentro(location.hash.slice(1));
        if (alvoInicial) setTimeout(function () { alvoInicial.scrollIntoView(); }, 50);
    }

    /* Para o js/drive.js: depois de pôr fotografias novas numa parte da
       galeria, chama Antonios.novasFotos(parte) e tudo fica como as outras. */
    window.Antonios = {
        novasFotos: function (raiz) {
            formaDasFotos(raiz);
            cada('.album', prepararAlbum, raiz);
            prepararEntradas(raiz);
            prepararImagens(raiz);
            fazerColagemSueca();
            actualizarMontra();
            if (galeriaConteudo.hidden) abrirGaleria.querySelector('span').textContent = textoAbrir();
            else cada('.foto', observarFoto, raiz);
        }
    };

    /* «Continuar a ler» no telemóvel: textos longos mostram só o início */
    (function () {
        var telemovel = window.matchMedia('(max-width: 600px)');
        cada('.historia .prosa, .santo .prosa', function (prosa) {
            var paragrafos = prosa.querySelectorAll('p:not(.lede)');
            if (paragrafos.length < 2) return;
            var botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'continuar';
            botao.innerHTML = 'Continuar a ler <svg aria-hidden="true"><use href="#i-baixo"/></svg>';
            botao.addEventListener('click', function () {
                prosa.classList.remove('resumida');
                paragrafos[1].setAttribute('tabindex', '-1');
                paragrafos[1].focus({ preventScroll: true });
            });
            paragrafos[0].insertAdjacentElement('afterend', botao);
            function aplicar() { prosa.classList.toggle('resumida', telemovel.matches); }
            aplicar();
            if (telemovel.addEventListener) telemovel.addEventListener('change', aplicar);
        });
    })();

    /* Contagem dos números (85, 46, 1) quando aparecem */
    cada('[data-contar]', function (el) {
        var fim = +el.dataset.contar;
        if (reduzirMovimento || fim < 5) return;
        el.textContent = '0';
        new IntersectionObserver(function (entradas, obs) {
            if (!entradas[0].isIntersecting) return;
            obs.disconnect();
            var inicio = performance.now(), dur = 1400;
            (function passo(t) {
                var p = Math.min(1, (t - inicio) / dur);
                el.textContent = Math.round(fim * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(passo);
            })(inicio);
        }, { threshold: 0.6 }).observe(el);
    });

    /* -------------------------------------------------------
       FILME (feito com Remotion)
    ------------------------------------------------------- */
    var filmeLeitor = document.getElementById('filmeLeitor');
    var filmeVideo = document.getElementById('filmeVideo');
    var filmePlay = document.getElementById('filmePlay');

    // Os controlos só aparecem depois de começar, para não taparem o cartaz.
    // Sem JavaScript, o vídeo fica com os controlos normais do navegador.
    filmeVideo.controls = false;
    filmePlay.addEventListener('click', function () {
        filmeVideo.play();
        filmeVideo.focus();
    });
    filmeVideo.addEventListener('play', function () {
        filmeVideo.controls = true;
        filmeLeitor.classList.add('a-tocar');
    });
    filmeVideo.addEventListener('ended', function () {
        filmeVideo.controls = false;
        filmeVideo.load(); // volta ao cartaz
        filmeLeitor.classList.remove('a-tocar');
    });

    // O botão "Ver o filme" do topo leva ao filme e começa a reproduzi-lo
    cada('.hero-acoes a[href="#filme"]', function (a) {
        a.addEventListener('click', function () {
            setTimeout(function () { filmeVideo.play(); }, reduzirMovimento ? 0 : 700);
        });
    });

    /* -------------------------------------------------------
       VISUALIZADOR DE FOTOGRAFIAS
       Funciona com qualquer <a data-legenda> que aponte para uma imagem.
    ------------------------------------------------------- */
    var lightbox = document.getElementById('lightbox');
    var lbFigura = lightbox.querySelector('.lb-figura');
    var lbImg = document.getElementById('lbImg');
    var lbLegenda = document.getElementById('lbLegenda');
    var lbContador = document.getElementById('lbContador');
    var lbFechar = document.getElementById('lbFechar');
    var lbAnterior = document.getElementById('lbAnterior');
    var lbSeguinte = document.getElementById('lbSeguinte');
    var lista = [];
    var indice = 0;
    var origemFoco = null;
    var pedidoActual = 0;

    function visivel(el) { return el.offsetParent !== null && !el.closest('[data-copia]'); }

    function mostrar(i, dir) {
        indice = (i + lista.length) % lista.length;
        var a = lista[indice];
        var src = a.getAttribute('href');
        var este = ++pedidoActual;
        lbLegenda.textContent = a.dataset.legenda || '';
        lbContador.textContent = lista.length > 1 ? (indice + 1) + ' de ' + lista.length : '';
        lbAnterior.hidden = lbSeguinte.hidden = lista.length < 2;

        var animar = dir && !reduzirMovimento && lbImg.getAttribute('src');
        lightbox.style.setProperty('--dir', dir || 1);
        if (animar) lbImg.classList.add('a-sair');

        var nova = new Image();
        var carregou = false;
        var espera = setTimeout(function () { if (!carregou) lbFigura.classList.add('a-carregar'); }, 150);
        nova.onload = nova.onerror = function () {
            carregou = true;
            clearTimeout(espera);
            if (este !== pedidoActual) return; // a pessoa já passou para outra
            var trocar = function () {
                lbFigura.classList.remove('a-carregar');
                lbImg.src = src;
                lbImg.alt = a.dataset.legenda || '';
                if (animar) {
                    // Entra do lado oposto àquele por onde a anterior saiu
                    lbImg.classList.add('a-arrastar');
                    lbImg.style.transform = 'translateX(' + (dir * 48) + 'px) scale(.98)';
                    lbImg.style.opacity = '0';
                    void lbImg.offsetWidth;
                    lbImg.classList.remove('a-arrastar', 'a-sair');
                    lbImg.style.transform = '';
                    lbImg.style.opacity = '';
                }
            };
            if (animar) setTimeout(trocar, 180); else trocar();
        };
        nova.src = src;

        // Pré-carrega a seguinte e a anterior
        if (lista.length > 1) {
            new Image().src = lista[(indice + 1) % lista.length].getAttribute('href');
            new Image().src = lista[(indice - 1 + lista.length) % lista.length].getAttribute('href');
        }
    }

    function abrir(a) {
        // Navega pelas fotografias do mesmo grupo
        var grupo = a.closest('.evento-galeria, .fita, .sueca-colagem, .bandeira-duo, .documentos') || document;
        if (grupo.classList && grupo.classList.contains('sueca-colagem')) {
            grupo = document.getElementById('album-sueca');
            a = grupo.querySelector('a[href="' + a.getAttribute('href') + '"]') || a;
        }
        lista = Array.prototype.filter.call(grupo.querySelectorAll('a[data-legenda]'), function (el) {
            // Inclui as fotografias ainda recolhidas («Ver mais…») do mesmo álbum
            var recolhida = el.closest('.album.recolhido .foto.extra') && el.closest('.album') === a.closest('.album');
            return visivel(el) || recolhida || el === a;
        });
        if (lista.indexOf(a) === -1) lista.unshift(a);
        origemFoco = a;
        lbImg.removeAttribute('src');
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        void lightbox.offsetWidth;
        lightbox.classList.add('aberta');
        mostrar(lista.indexOf(a), 0);
        lbFechar.focus();
    }

    function fechar() {
        lightbox.classList.remove('aberta');
        document.body.style.overflow = '';
        setTimeout(function () {
            lightbox.hidden = true;
            lbImg.removeAttribute('src');
        }, reduzirMovimento ? 0 : 350);
        if (origemFoco && origemFoco.isConnected && !origemFoco.closest('[aria-hidden="true"]')) origemFoco.focus({ preventScroll: true });
    }

    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[data-legenda]');
        if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
        e.preventDefault();
        abrir(a);
    });

    lbFechar.addEventListener('click', fechar);
    lbAnterior.addEventListener('click', function () { mostrar(indice - 1, -1); });
    lbSeguinte.addEventListener('click', function () { mostrar(indice + 1, 1); });
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target === lbFigura) fechar();
    });

    document.addEventListener('keydown', function (e) {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') fechar();
        else if (e.key === 'ArrowLeft') mostrar(indice - 1, -1);
        else if (e.key === 'ArrowRight') mostrar(indice + 1, 1);
        else if (e.key === 'Tab') {
            // Mantém o foco dentro do visualizador
            var botoes = [lbFechar, lbAnterior, lbSeguinte].filter(function (b) { return !b.hidden; });
            var pos = botoes.indexOf(document.activeElement);
            e.preventDefault();
            botoes[(pos + (e.shiftKey ? -1 : 1) + botoes.length) % botoes.length].focus();
        }
    });

    // Arrastar o dedo: a fotografia acompanha o dedo e muda ao largar
    var toqueX = null;
    lightbox.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;
        toqueX = e.touches[0].clientX;
        lbImg.classList.add('a-arrastar');
    }, { passive: true });
    lightbox.addEventListener('touchmove', function (e) {
        if (toqueX === null || lista.length < 2) return;
        var dx = e.touches[0].clientX - toqueX;
        lbImg.style.transform = 'translateX(' + dx + 'px)';
        lbImg.style.opacity = String(1 - Math.min(Math.abs(dx) / 400, 0.5));
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
        if (toqueX === null) return;
        var dx = e.changedTouches[0].clientX - toqueX;
        toqueX = null;
        lbImg.classList.remove('a-arrastar');
        lbImg.style.transform = '';
        lbImg.style.opacity = '';
        if (Math.abs(dx) > 50 && lista.length > 1) {
            var dir = dx < 0 ? 1 : -1;
            mostrar(indice + dir, dir);
        }
    });

    /* -------------------------------------------------------
       Ano no rodapé
    ------------------------------------------------------- */
    document.getElementById('ano').textContent = new Date().getFullYear();
})();
