/* =====================================================
   GRUPO "OS ANTÓNIOS" — main.js
   ===================================================== */

(function () {
    'use strict';

    /* -------------------------------------------------------
       NAVBAR — scroll e menu mobile
    ------------------------------------------------------- */
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    // Torna navbar sólida ao fazer scroll
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
        toggleBackTop();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Menu mobile (hambúrguer)
    hamburger.addEventListener('click', function () {
        const isOpen = hamburger.classList.toggle('open');
        navLinks.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fechar menu ao clicar num link
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

    // Excluir elementos dentro do hero (já animados por CSS)
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
       FILTRO DE GALERIA
    ------------------------------------------------------- */
    var filterBtns  = document.querySelectorAll('.filter-btn');
    var galleryGrid = document.getElementById('galleryGrid');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.dataset.filter;
            var items  = galleryGrid.querySelectorAll('.gallery-item');

            items.forEach(function (item) {
                var show = filter === 'all' || item.dataset.category === filter;
                item.style.display = show ? '' : 'none';
                if (show) {
                    item.style.animation = 'none';
                    void item.offsetWidth;
                    item.style.animation = '';
                }
            });

            // Mostrar/ocultar cabeçalhos dos álbuns conforme filtro
            var albumHeaders = document.querySelectorAll('.gallery-album-header');
            albumHeaders.forEach(function (h) {
                // Cada cabeçalho precede um grid de items; mostra sempre em "all"
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

    document.querySelectorAll('.gallery-item').forEach(function (item) {
        item.addEventListener('click', function () {
            var img     = item.querySelector('img');
            var caption = item.dataset.caption || '';
            var src     = (img && !item.classList.contains('no-img')) ? img.src : null;
            openLightbox(src, caption);
        });

        // Acessibilidade — permitir activação por teclado
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
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
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

})();
