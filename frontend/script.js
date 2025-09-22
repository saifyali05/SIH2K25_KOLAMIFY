// Welcome Animation Control with Smooth Transitions
document.addEventListener('DOMContentLoaded', function() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    
    // Enhanced timing for smoother animation sequence
    setTimeout(() => {
        welcomeOverlay.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        welcomeOverlay.style.display = 'none';
    }, 6500); // Extended timing for smoother experience
    
    // Add entrance animations for main content with improved timing
    setTimeout(() => {
        document.body.classList.add('content-loaded');
        // Add smooth transition for main content
        document.body.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 5500);
});

// Enhanced skip welcome animation with smoother transitions
function skipWelcomeAnimation() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    
    // Add smooth exit transition
    welcomeOverlay.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    welcomeOverlay.style.animation = 'overlayFadeOut 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    
    setTimeout(() => {
        welcomeOverlay.style.display = 'none';
        document.body.classList.add('content-loaded');
        document.body.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 800);
}

// Enhanced click and keyboard events for smooth interaction
document.addEventListener('DOMContentLoaded', function() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    
    // Add smooth click interaction
    welcomeOverlay.addEventListener('click', function(e) {
        // Add ripple effect at click position
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.left = e.clientX - 25 + 'px';
        ripple.style.top = e.clientY - 25 + 'px';
        ripple.style.width = '50px';
        ripple.style.height = '50px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 107, 107, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '10000';
        
        welcomeOverlay.appendChild(ripple);
        
        // Animate ripple
        setTimeout(() => {
            ripple.style.transform = 'scale(20)';
            ripple.style.opacity = '0';
        }, 10);
        
        // Remove ripple and skip animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
            skipWelcomeAnimation();
        }, 300);
    });
    
    // Enhanced keyboard shortcuts with smooth feedback
    document.addEventListener('keydown', function(e) {
        if ((e.code === 'Space' || e.code === 'Enter') && welcomeOverlay.style.display !== 'none') {
            e.preventDefault();
            
            // Add visual feedback for keyboard interaction
            welcomeOverlay.style.transform = 'scale(0.98)';
            welcomeOverlay.style.transition = 'transform 0.1s ease-out';
            
            setTimeout(() => {
                welcomeOverlay.style.transform = 'scale(1)';
                skipWelcomeAnimation();
            }, 100);
        }
    });
});

// Color palette functionality
const colorDots = document.querySelectorAll('.color-dot');
const rangoliSvg = document.querySelector('.rangoli-svg');

colorDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        // Remove active class from all dots
        colorDots.forEach(d => d.classList.remove('active'));
        
        // Add active class to clicked dot
        dot.classList.add('active');
        
        // Change rangoli colors based on selection
        changeRangoliColors(index);
    });
});

function changeRangoliColors(colorIndex) {
    const colorSchemes = [
        // Red scheme
        {
            center: '#ff6b6b',
            secondary: '#ffd93d',
            petals1: '#ff9ff3',
            petals2: '#54a0ff',
            ring: '#5f27cd',
            dots: '#00d2d3'
        },
        // Blue scheme
        {
            center: '#54a0ff',
            secondary: '#00d2d3',
            petals1: '#5f27cd',
            petals2: '#ff9ff3',
            ring: '#ff6b6b',
            dots: '#ffd93d'
        },
        // Purple scheme
        {
            center: '#5f27cd',
            secondary: '#ff9ff3',
            petals1: '#54a0ff',
            petals2: '#00d2d3',
            ring: '#ffd93d',
            dots: '#ff6b6b'
        },
        // Cyan scheme
        {
            center: '#00d2d3',
            secondary: '#5f27cd',
            petals1: '#ffd93d',
            petals2: '#ff6b6b',
            ring: '#54a0ff',
            dots: '#ff9ff3'
        },
        // Yellow scheme
        {
            center: '#ffd93d',
            secondary: '#ff6b6b',
            petals1: '#00d2d3',
            petals2: '#5f27cd',
            ring: '#ff9ff3',
            dots: '#54a0ff'
        }
    ];
    
    const scheme = colorSchemes[colorIndex];
    
    // Update SVG colors
    const centerCircles = rangoliSvg.querySelectorAll('.lotus-center circle');
    const petals1 = rangoliSvg.querySelectorAll('.petals-layer1 ellipse');
    const petals2 = rangoliSvg.querySelectorAll('.petals-layer2 ellipse');
    const ringStroke = rangoliSvg.querySelector('.outer-ring circle:first-child');
    const ringDots = rangoliSvg.querySelectorAll('.outer-ring circle:not(:first-child)');
    
    if (centerCircles[0]) centerCircles[0].setAttribute('fill', scheme.center);
    if (centerCircles[1]) centerCircles[1].setAttribute('fill', scheme.secondary);
    
    petals1.forEach(petal => petal.setAttribute('fill', scheme.petals1));
    petals2.forEach(petal => petal.setAttribute('fill', scheme.petals2));
    
    if (ringStroke) ringStroke.setAttribute('stroke', scheme.ring);
    ringDots.forEach(dot => dot.setAttribute('fill', scheme.dots));
}

// Rangoli animation controls
let rangoliSpeed = 1;
const rangoliContainer = document.querySelector('.rangoli-svg');

function adjustRangoliSpeed(speed) {
    rangoliSpeed = speed;
    rangoliContainer.style.animationDuration = `${20 / speed}s`;
}

// Interactive floating dots
const floatingDots = document.querySelectorAll('.floating-dot');

floatingDots.forEach((dot, index) => {
    dot.addEventListener('mouseenter', () => {
        dot.style.transform = 'scale(2) translateY(-10px)';
        dot.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.5)';
    });
    
    dot.addEventListener('mouseleave', () => {
        dot.style.transform = '';
        dot.style.boxShadow = '';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-dot');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// CTA Button functionality
function startCreating() {
    // Add click animation
    const button = document.querySelector('.cta-button');
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = '';
        
        // Redirect to login page
        window.location.href = 'login.html';
        
    }, 150);
}

// Add sparkle animation to outer ring dots
document.addEventListener('DOMContentLoaded', () => {
    const ringDots = document.querySelectorAll('.outer-ring circle:not(:first-child)');
    
    ringDots.forEach((dot, index) => {
        dot.style.setProperty('--i', index);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'C' to change colors randomly
    if (e.key.toLowerCase() === 'c') {
        const randomIndex = Math.floor(Math.random() * colorDots.length);
        colorDots[randomIndex].click();
    }
    
    // Press 'Space' to start creating
    if (e.code === 'Space' && !e.target.matches('input')) {
        e.preventDefault();
        startCreating();
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe hero elements
document.querySelectorAll('.hero-content, .hero-visual').forEach(el => {
    observer.observe(el);
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    setTimeout(() => {
        document.querySelector('.hero-title').style.opacity = '1';
        document.querySelector('.hero-title').style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
        document.querySelector('.hero-subtitle').style.opacity = '1';
        document.querySelector('.hero-subtitle').style.transform = 'translateY(0)';
    }, 500);
    
    setTimeout(() => {
        document.querySelector('.hero-description').style.opacity = '1';
        document.querySelector('.hero-description').style.transform = 'translateY(0)';
    }, 700);
    
    setTimeout(() => {
        document.querySelector('.cta-button').style.opacity = '1';
        document.querySelector('.cta-button').style.transform = 'translateY(0)';
    }, 900);
});

// Add CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    .hero-title,
    .hero-subtitle,
    .hero-description,
    .cta-button {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    body.loaded .hero-title,
    body.loaded .hero-subtitle,
    body.loaded .hero-description,
    body.loaded .cta-button {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);