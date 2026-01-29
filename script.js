gsap.registerPlugin(ScrollTrigger);

// CUSTOM CURSOR
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

// Only initialize cursor on desktop
if (window.innerWidth >= 1024) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, [data-magnetic], .journey-box');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
    });
}

// MAGNETIC EFFECT FOR JOURNEY BOXES
const magneticElements = document.querySelectorAll('[data-magnetic]');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1024) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.6,
            ease: 'power2.out'
        });
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});

// PAGE OPENING ANIMATION
const openBtn = document.getElementById('openBtn');
const pageReveal = document.getElementById('pageReveal');
const mainSite = document.getElementById('mainSite');

openBtn.addEventListener('click', () => {
    pageReveal.classList.add('opened');

    setTimeout(() => {
        mainSite.classList.add('visible');
        initAnimations();
        initParallax();
    }, 1500);
});

// INITIAL REVEAL ANIMATIONS - Optimized
function initAnimations() {
    // Hero text reveal
    gsap.from('.giant-line', {
        yPercent: 100,
        duration: 1.6,
        stagger: 0.12,
        ease: 'expo.out',
        delay: 0.2
    });

    gsap.from('.hero-meta > *', {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 1
    });

    // Event sections - simple fade in
    gsap.utils.toArray('.event-reveal').forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(section, {
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Gallery - staggered reveal
    ScrollTrigger.create({
        trigger: '.gallery-showcase',
        start: 'top 95%',
        once: true,
        onEnter: () => {
            gsap.from('.gallery-heading', {
                opacity: 0,
                y: 60,
                duration: 1.4,
                ease: 'power3.out'
            });

            gsap.from('.journey-box', {
                scale: 0.95,
                y: 20,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            });
        }
    });

    // Footer
    ScrollTrigger.create({
        trigger: '.finale',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            gsap.from('.finale-message', {
                opacity: 0,
                y: 40,
                duration: 1.4,
                ease: 'power3.out'
            });
        }
    });
}

// OPTIMIZED PARALLAX - Reduced triggers for better performance
function initParallax() {
    // Only run parallax on desktop to avoid mobile performance issues
    if (window.innerWidth < 768) {
        return;
    }

    // HERO SECTION - Single parallax group
    const heroTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.hero-full',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    heroTL
        .to('.giant-line', { y: -60, stagger: 0.1 }, 0)
        .to('.couple-names', { y: -40, opacity: 0.5 }, 0)
        .to('.wedding-year', { y: -70, opacity: 0.3 }, 0);

    // EVENT SECTIONS - Combined animations
    gsap.utils.toArray('.event-reveal').forEach((section) => {
        const bgImg = section.querySelector('.event-bg-img');
        const eventName = section.querySelector('.event-name');

        gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
                invalidateOnRefresh: true
            }
        })
        .fromTo(bgImg,
            { scale: 1.2, y: -30 },
            { scale: 1, y: 50 }, 0
        )
        .to(eventName, { y: -30 }, 0);
    });

    // GALLERY - Minimal parallax
    gsap.to('.gallery-heading', {
        y: -40,
        scrollTrigger: {
            trigger: '.gallery-showcase',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
            invalidateOnRefresh: true
        }
    });

    // FOOTER
    gsap.to('.finale-message', {
        scale: 1.1,
        scrollTrigger: {
            trigger: '.finale',
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
            invalidateOnRefresh: true
        }
    });
}

console.log('🎉 Wedding site - optimized');
