document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INTRO ANIMATION (only on index) ---
    const introOverlay = document.getElementById('intro-overlay');
    
    if (introOverlay) {
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            introOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
            initGallery();
        }, 2500);
    } else {
        initAnimations();
    }

    // --- 2. CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let circleX = 0;
    let circleY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        dotX += (mouseX - dotX) * 1;
        dotY += (mouseY - dotY) * 1;
        
        circleX += (mouseX - circleX) * 0.10;
        circleY += (mouseY - circleY) * 0.10;

        if (cursorDot && cursorCircle) {
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
            cursorCircle.style.left = `${circleX}px`;
            cursorCircle.style.top = `${circleY}px`;
        }

        requestAnimationFrame(animateCursor);
    }
    
    if (matchMedia('(hover: hover)').matches) {
        animateCursor();
    }

    // Hover Effects
    const hoverElements = document.querySelectorAll('[data-cursor="hover"]');
    const viewElements = document.querySelectorAll('[data-cursor="view"]');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    viewElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('viewing');
            if (cursorCircle) cursorCircle.style.mixBlendMode = 'normal';
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('viewing');
            if (cursorCircle) cursorCircle.style.mixBlendMode = 'difference';
        });
    });

    // --- 3. GALLERY SLIDER (Index only) ---
    function initGallery() {
        const track = document.getElementById('gallery-track');
        const slides = document.querySelectorAll('.gallery-slide');
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        const currentSlideEl = document.querySelector('.current-slide');
        const totalSlidesEl = document.querySelector('.total-slides');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoplayInterval;
        const autoplayDelay = 5000;
        
        if (totalSlidesEl) {
            totalSlidesEl.textContent = String(totalSlides).padStart(2, '0');
        }
        
        function updateSlide(index) {
            track.style.transform = `translateX(-${index * 100}%)`;
            
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            if (currentSlideEl) {
                currentSlideEl.textContent = String(index + 1).padStart(2, '0');
            }
            
            currentIndex = index;
        }
        
        function nextSlide() {
            const next = (currentIndex + 1) % totalSlides;
            updateSlide(next);
        }
        
        function prevSlide() {
            const prev = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlide(prev);
        }
        
        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, autoplayDelay);
        }
        
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        }
        
        updateSlide(0);
        startAutoplay();
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoplay();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoplay();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                nextSlide();
                startAutoplay();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
                startAutoplay();
            }
        });
        
        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoplay();
        }, { passive: true });
        
        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);
    }

    // --- 4. SCROLL REVEAL ---
    function initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        document.querySelectorAll('.reveal-text, .reveal-card').forEach(el => {
            observer.observe(el);
        });
    }
});