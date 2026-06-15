/* =====================================================
   GRUPO "OS ANTÓNIOS" — main.js
   ===================================================== */
(function () {
    'use strict';

    /* =======================================================
       CONFIGURAÇÃO DO MOTOR GOOGLE DRIVE
       ======================================================= */
    var API_KEY = 'AIzaSyBgz2LSC0Md-cOGlOvCS7AoB6JyffvVOjQ'; 
    var MAIN_FOLDER_ID = '1h-ZYtgnP6kJIHBrMV_l2TDsu159Nvkkm'; // ID limpo e correto retirado do teu link

    /* -------------------------------------------------------
       NAVBAR — scroll e menu mobile
    ------------------------------------------------------- */
    var navbar    = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var navLinks  = document.getElementById('navLinks');

    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
        toggleBackTop();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    hamburger.addEventListener('click', function () {
        var isOpen = hamburger.classList.toggle('open');
        navLinks.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    function closeMenu() {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /* -------------------------------------------------------
       SCROLL-REVEAL (IntersectionObserver)
    ------------------------------------------------------- */
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(function (el) {
        if (!el.closest('.hero')) {
            revealObserver.observe(el);
        }
    });

    /* -------------------------------------------------------
       LINK ACTIVO NA NAVBAR conforme secção visível
    ------------------------------------------------------- */
    var navItems = navLinks.querySelectorAll('a');

    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.id;
                navItems.forEach(function (a) {
                    a.classList.toggle('active-link', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.35 });

    document.querySelectorAll('section[id]').forEach(function (sec) {
        sectionObserver.observe(sec);
    });

    /* -------------------------------------------------------
       FILTRO DE GALERIA (Atualizado para ler Fotos Locais + Drive)
    ------------------------------------------------------- */
    var filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.dataset.filter;
            // Procura global por .gallery-item para afetar tanto o histórico como o Drive
            var items = document.querySelectorAll('.gallery-item');

            items.forEach(function (item) {
                var show = filter === 'all' || item.dataset.category === filter;
                item.style.display = show ? '' : 'none';
                if (show) {
                    item.style.animation = 'none';
                    void item.offsetWidth;
                    item.style.animation = '';
                }
            });

            var albumHeaders = document.querySelectorAll('.gallery-album-header');
            albumHeaders.forEach(function (h) {
                h.style.display = (filter === 'all') ? '' : 'none';
            });
        });
    });

    /* -------------------------------------------------------
       LIGHTBOX
    ------------------------------------------------------- */
    var lightbox   = document.getElementById('lightbox');
    var lbImg      = document.getElementById('lbImg');
    var lbCaption  = document.getElementById('lbCaption');
    var lbClose    = document.getElementById('lbClose');

    function openLightbox(src, caption) {
        if (src) {
            lbImg.src = src;
            lbImg.alt = caption || '';
            lbImg.style.display = 'block';
        } else {
            lbImg.style.display = 'none';
        }
        lbCaption.textContent = caption || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    // Ativação do Lightbox para os elementos estáticos iniciais (Histórico)
    document.querySelectorAll('.gallery-item').forEach(function (item) {
        item.addEventListener('click', function () {
            var img     = item.querySelector('img');
            var caption = item.dataset.caption || '';
            var src     = (img && !item.classList.contains('no-img')) ? img.src : null;
            openLightbox(src, caption);
        });

        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('click', function (e) {
    // Procura se o elemento clicado (ou um pai dele) é um .gallery-item
    var item = e.target.closest('.gallery-item');
    
    if (item) {
        var img = item.querySelector('img');
        var caption = item.dataset.caption || '';
        
        // Se a imagem existir e não estiver marcada como 'no-img'
        if (img && !item.classList.contains('no-img')) {
            openLightbox(img.src, caption);
        }
    }
});

    /* -------------------------------------------------------
       BOTÃO VOLTAR AO TOPO
    ------------------------------------------------------- */
    var backTop = document.getElementById('backTop');

    function toggleBackTop() {
        backTop.classList.toggle('show', window.scrollY > 420);
    }

    backTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* -------------------------------------------------------
       SMOOTH SCROLL para links internos (fallback)
    ------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            var offset = navbar.offsetHeight + 8;
            var top    = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    /* =======================================================
        MOTOR GOOGLE DRIVE (Escrito no estilo clássico do ficheiro)
        ======================================================= */
    /* =======================================================
       MOTOR GOOGLE DRIVE (CORRIGIDO COM FILTROS)
       ======================================================= */
/* =======================================================
       MOTOR GOOGLE DRIVE (CORRIGIDO)
       ======================================================= */
async function carregarGaleriaDrive() {
    var container = document.getElementById('driveGaleria');
    if (!container) return; 

    try {
        var urlPastas = 'https://www.googleapis.com/drive/v3/files?q=\'' + MAIN_FOLDER_ID + '\'+in+parents+and+mimeType=\'application/vnd.google-apps.folder\'+and+trashed=false&fields=files(id,name)&orderBy=name+desc&key=' + API_KEY;
        var resPastas = await fetch(urlPastas);
        var dataPastas = await resPastas.json();

        if (!dataPastas.files || dataPastas.files.length === 0) return;

        // Limpa o container antes de carregar
        container.innerHTML = '';

        for (var i = 0; i < dataPastas.files.length; i++) {
            var pastaAno = dataPastas.files[i];

            // Criar o wrapper do álbum
            var albumDiv = document.createElement('div');
            albumDiv.className = "gallery-album-wrapper";
            albumDiv.style.marginTop = "56px";
            albumDiv.innerHTML = `
                <div class="gallery-album-header album-header-clickable closed" onclick="toggleAlbum(this)">
                    <div class="gallery-album-badge"><i class="fas fa-birthday-cake"></i> ${pastaAno.name}</div>
                    <h3>Momentos e Celebrações</h3>
                </div>
                <div class="album-content-collapse">
                    <div class="gallery-controls" style="text-align: center; margin: 15px 0;">
                        <button class="filter-btn active" data-filter="all" onclick="filtrarGaleria(this)">Todos</button>
                        <button class="filter-btn" data-filter="aniversario" onclick="filtrarGaleria(this)">Aniversário</button>
                        <button class="filter-btn" data-filter="piquenique" onclick="filtrarGaleria(this)">Piquenique</button>
                    </div>
                    <div class="gallery-grid" id="grid-${pastaAno.id}"></div>
                </div>`;
            container.appendChild(albumDiv);

            // Carregar imagens desta pasta específica
            var grid = albumDiv.querySelector('.gallery-grid');
            var urlEventos = 'https://www.googleapis.com/drive/v3/files?q=\'' + pastaAno.id + '\'+in+parents+and+mimeType=\'application/vnd.google-apps.folder\'+and+trashed=false&fields=files(id,name)&key=' + API_KEY;
            var resEventos = await fetch(urlEventos);
            var dataEventos = await resEventos.json();

            if (dataEventos.files) {
                for (var j = 0; j < dataEventos.files.length; j++) {
                    var pEvento = dataEventos.files[j];
                    var nome = pEvento.name.toLowerCase();
                    var cat = nome.includes("aniversario") || nome.includes("aniversário") ? "aniversario" : (nome.includes("piquenique") ? "piquenique" : "outros");

                    var urlImg = 'https://www.googleapis.com/drive/v3/files?q=\'' + pEvento.id + '\'+in+parents+and+mimeType+contains+\'image/\'+and+trashed=false&fields=files(id,name,thumbnailLink)&key=' + API_KEY;
                    var resImg = await fetch(urlImg);
                    var dataImg = await resImg.json();

                    if (dataImg.files) {
                        dataImg.files.forEach(img => {
                            // 1. Usa o thumbnailLink se existir, senão usa uma imagem de "carregamento" ou nada
                            var urlVis = img.thumbnailLink ? img.thumbnailLink.replace(/=s\d+/, '=s1200') : '';
                            
                            var item = document.createElement('div');
                            item.className = "gallery-item";
                            item.dataset.category = cat;
                            // Nota: Adicionei o título do ficheiro no dataset para o caption, se quiseres
                            item.dataset.caption = img.name; 

                            // AQUI ESTÁ A CORREÇÃO:
                            // Insere o HTML necessário para o efeito de "hover" que tens no teu CSS
                            item.innerHTML = `
                                <img src="${urlVis}" alt="${img.name}" 
                                    onload="this.style.opacity=1" 
                                    onerror="this.style.display='none'">
                                <div class="gallery-hover">
                                    <i class="fas fa-expand-arrows-alt"></i>
                                    <span>${img.name}</span>
                                </div>
                            `;
                            
                            // 3. Só adiciona ao grid se o link existir
                            if (urlVis !== '') {
                                grid.appendChild(item);
                            }
                        });
                    }
                }
            }
        }
    } catch (e) {
        console.error("Erro ao carregar:", e);
    }
}

    // Função de filtro que deve ficar fora do carregarGaleriaDrive para ser chamada pelo onclick
    window.filtrarGaleria = function(btn) {
        var wrapper = btn.closest('.gallery-album-wrapper');
        var grid = wrapper.querySelector('.gallery-grid');
        var filter = btn.dataset.filter;

        wrapper.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Forçamos a renderização de todos os itens
        grid.querySelectorAll('.gallery-item').forEach(item => {
            var show = (filter === 'all' || item.dataset.category === filter);
            item.style.display = show ? 'block' : 'none';
            
            // Se a imagem não estiver a renderizar, forçamos o refresh do src
            if (show) {
                var img = item.querySelector('img');
                if (img && !img.src) {
                    img.src = img.dataset.src; // Garante que carrega
                }
            }
        });
    };

    window.toggleAlbum = function(headerElement) {
    var content = headerElement.nextElementSibling;
    var isClosed = headerElement.classList.contains('closed');

    if (isClosed) {
        content.style.display = 'block'; // Abre
        headerElement.classList.remove('closed');
    } else {
        content.style.display = 'none'; // Fecha
        headerElement.classList.add('closed');
    }
};

// Inicialização
carregarGaleriaDrive();

})();