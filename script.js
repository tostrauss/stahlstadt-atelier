document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER ---
    const loader = document.querySelector('.loader');
    
    setTimeout(() => {
        loader.classList.add('hidden');
        // Start animations after loader is gone
        initAnimations();
    }, 2000);

    // --- 2. CUSTOM CURSOR LOGIC ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let circleX = 0;
    let circleY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth animation loop
    function animateCursor() {
        // Linear interpolation (Lerp) for smooth lag effect
        dotX += (mouseX - dotX) * 1; // Instant
        dotY += (mouseY - dotY) * 1;
        
        circleX += (mouseX - circleX) * 0.15; // Slow lag
        circleY += (mouseY - circleY) * 0.15;

        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        cursorCircle.style.left = `${circleX}px`;
        cursorCircle.style.top = `${circleY}px`;

        requestAnimationFrame(animateCursor);
    }
    
    // Only run cursor logic on non-touch devices
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
            cursorCircle.style.mixBlendMode = 'normal'; // Reset for view mode
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('viewing');
            cursorCircle.style.mixBlendMode = 'difference';
        });
    });

    // --- 3. SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once active if you don't want it to repeat
                    // observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal-text, .reveal-card');
        revealElements.forEach(el => observer.observe(el));
    }
    
    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});