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
const birdsContainer = document.getElementById('birdsContainer');
const petalsOverlay = document.getElementById('petalsOverlay');
const sparklesOverlay = document.getElementById('sparklesOverlay');

// Background music
const backgroundMusic = new Audio('music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

openBtn.addEventListener('click', () => {
    pageReveal.classList.add('opened');

    // Start music
    backgroundMusic.play().catch(err => {
        console.log('Audio playback failed:', err);
    });

    // Activate sparkles
    setTimeout(() => {
        sparklesOverlay.classList.add('active');
        createSparkles();
    }, 900);

    // Activate petals
    setTimeout(() => {
        petalsOverlay.classList.add('active');
        createPetals();
    }, 1000);

    setTimeout(() => {
        mainSite.classList.add('visible');
        initAnimations();
        initParallax();
    }, 1500);
});

// CREATE CONFETTI
function createPetals() {
    const confettiTypes = ['rect', 'circle', 'triangle', 'square', 'ribbon'];

    // Initial burst from center
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        const type = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];

        confetti.className = `confetti confetti-${type} confetti-burst`;

        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 100 + Math.random() * 150;
        const burstX = Math.cos(angle) * velocity;
        const burstY = Math.sin(angle) * velocity - 200; // Upward bias

        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.setProperty('--burst-x', burstX + 'px');
        confetti.style.setProperty('--burst-y', burstY + 'px');

        const duration = 3 + Math.random() * 2;
        confetti.style.animation = `confettiBurst ${duration}s ease-out forwards`;

        petalsOverlay.appendChild(confetti);
    }

    // Continuous falling confetti
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        const type = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];

        confetti.className = `confetti confetti-${type}`;

        const startX = Math.random() * 100;
        const delay = 0.5 + Math.random() * 2;
        const duration = 4 + Math.random() * 3;
        const drift = (Math.random() - 0.5) * 200;

        confetti.style.left = startX + '%';
        confetti.style.setProperty('--confetti-drift', drift + 'px');
        confetti.style.animation = `confettiFall ${duration}s ${delay}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

        petalsOverlay.appendChild(confetti);
    }
}

// CREATE SPARKLES
function createSparkles() {
    const sparkleCount = 20;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        // Random positioning
        const startX = 20 + Math.random() * 60; // Center area
        const startY = 30 + Math.random() * 40; // Middle area
        const delay = Math.random() * 2;
        const duration = 3 + Math.random() * 2;

        sparkle.style.left = startX + '%';
        sparkle.style.top = startY + '%';
        sparkle.style.animation = `sparkleFloat ${duration}s ${delay}s ease-out`;

        sparklesOverlay.appendChild(sparkle);

        // Remove sparkle after animation
        setTimeout(() => {
            sparkle.remove();
        }, (duration + delay) * 1000);
    }
}

// Removed cheap-looking lotus flowers - premium invitations focus on elegant typography and refined details

// SMOOTH REVEAL ANIMATIONS
function initAnimations() {
    // Hero text reveal - elegant cascade
    gsap.from('.giant-line', {
        yPercent: 100,
        duration: 1.6,
        stagger: 0.18,
        ease: 'power4.out',
        delay: 0.3
    });

    gsap.from('.hero-meta > *', {
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 1.4
    });

    // Event sections - simple fade reveal
    gsap.utils.toArray('.event-reveal').forEach((section, index) => {
        const bg = section.querySelector('.section-background');
        const heading = section.querySelector('.event-heading-fixed');
        const card = section.querySelector('.event-info-card');
        const infoItems = card ? card.querySelectorAll('.info-item') : [];

        // Background image reveal
        if (bg) {
            gsap.from(bg, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    once: true
                },
                opacity: 0,
                duration: 1.4,
                ease: 'power3.out'
            });
        }

        // Heading card reveal
        if (heading) {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    once: true
                },
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.3
            });
        }

        // Info card reveal
        if (card) {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 65%',
                    once: true
                },
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.5
            });

            // Info items cascade
            if (infoItems.length > 0) {
                gsap.from(infoItems, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 60%',
                        once: true
                    },
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: 'power2.out',
                    delay: 0.8
                });
            }
        }
    });

    // Gallery - simple fade reveal
    ScrollTrigger.create({
        trigger: '.gallery-showcase',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            gsap.from('.gallery-heading', {
                opacity: 0,
                duration: 1.4,
                ease: 'power3.out'
            });

            gsap.from('.journey-box', {
                opacity: 0,
                duration: 1,
                stagger: {
                    amount: 0.5,
                    from: 'start'
                },
                ease: 'power3.out',
                delay: 0.3
            });
        }
    });

    // Footer - gentle fade
    ScrollTrigger.create({
        trigger: '.finale',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            gsap.from('.finale-message', {
                opacity: 0,
                duration: 1.4,
                ease: 'power3.out'
            });
        }
    });
}

// SMOOTH PARALLAX EFFECTS
function initParallax() {
    // Only run parallax on desktop
    if (window.innerWidth < 768) {
        return;
    }

    // HERO SECTION - Subtle fade only
    gsap.to('.hero-giant', {
        opacity: 0.5,
        scrollTrigger: {
            trigger: '.hero-full',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        }
    });

    gsap.to('.hero-meta', {
        opacity: 0.3,
        scrollTrigger: {
            trigger: '.hero-full',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        }
    });

    // EVENT SECTIONS - Minimal parallax
    gsap.utils.toArray('.event-reveal').forEach((section, index) => {
        const bgImg = section.querySelector('.section-background img');

        // Background image subtle movement only
        if (bgImg) {
            gsap.fromTo(bgImg,
                {
                    y: -30
                },
                {
                    y: 30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5
                    }
                }
            );
        }
    });
}

console.log('🎉 Wedding site - optimized');
