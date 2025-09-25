// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.collection-item, .stat, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We\'ll get back to you soon.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        const rate = scrolled * -0.5;
        heroVideo.style.transform = `translateY(${rate}px)`;
    }
});

// Aggressive mobile video autoplay - immediate start without play buttons
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isInIframe = window.self !== window.top;
    
    if (isInIframe) {
        document.body.classList.add('in-iframe');
    }
    
    videos.forEach((video, index) => {
        // Force all mobile-friendly attributes immediately
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.controls = false;
        video.preload = 'auto';
        video.defaultMuted = true;
        
        // Remove all control attributes
        video.removeAttribute('controls');
        video.removeAttribute('poster');
        
        // Add mobile-specific attributes
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('x5-playsinline', 'true');
        video.setAttribute('x5-video-player-type', 'h5');
        video.setAttribute('x5-video-player-fullscreen', 'false');
        video.setAttribute('x5-video-orientation', 'portraint');
        
        // iOS-specific policies
        if (isMobile) {
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');
            video.style.webkitAppearance = 'none';
            video.style.webkitTapHighlightColor = 'transparent';
        }
        
        // Immediate play function
        function forcePlay() {
            video.muted = true;
            video.controls = false;
            video.removeAttribute('controls');
            video.removeAttribute('poster');
            
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log(`Video ${index + 1} playing successfully`);
                    video.style.opacity = '1';
                    video.classList.add('loaded', 'playing');
                    
                    // Remove poster after successful play
                    video.removeAttribute('poster');
                    
                }).catch(() => {
                    console.log(`Video ${index + 1} autoplay blocked - retrying...`);
                    // Retry with user interaction
                    setTimeout(() => forcePlay(), 100);
                });
            }
        }
        
        // Multiple triggers for video start
        video.addEventListener('loadeddata', forcePlay);
        video.addEventListener('canplay', forcePlay);
        video.addEventListener('loadedmetadata', forcePlay);
        
        // Immediate attempt
        forcePlay();
        
        // Additional attempts with delays
        setTimeout(() => forcePlay(), 50);
        setTimeout(() => forcePlay(), 200);
        setTimeout(() => forcePlay(), 500);
        
        // Video maintenance
        video.addEventListener('playing', () => {
            video.style.opacity = '1';
            video.style.display = 'block';
            video.classList.add('loaded', 'playing');
            video.removeAttribute('poster');
            video.removeAttribute('controls');
        });
        
        video.addEventListener('pause', () => {
            if (!video.ended) {
                setTimeout(() => video.play().catch(() => {}), 50);
            }
        });
        
        // Touch overlay handler for mobile
        const touchOverlay = document.querySelector(`[data-video-trigger="${video.classList.contains('hero-video') ? 'hero' : 'showcase'}"]`);
        if (touchOverlay && isMobile) {
            touchOverlay.addEventListener('touchstart', (e) => {
                e.preventDefault();
                forcePlay();
                touchOverlay.style.display = 'none';
            }, { passive: false });
            
            touchOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                forcePlay();
                touchOverlay.style.display = 'none';
            });
        }
        
        // Continuous maintenance
        const maintenance = setInterval(() => {
            // Remove any controls that appear
            if (video.hasAttribute('controls') || video.controls) {
                video.removeAttribute('controls');
                video.controls = false;
            }
            
            // Keep video visible when playing
            if (video.readyState >= 2 && !video.paused && !video.ended) {
                video.style.opacity = '1';
                video.style.display = 'block';
                video.classList.add('playing');
                video.removeAttribute('poster');
            }
            
            // Auto-restart if paused unexpectedly
            if (video.paused && !video.ended && video.readyState >= 2) {
                video.play().catch(() => {});
            }
        }, 100);
        
        // Clean up interval when video is removed
        video.addEventListener('emptied', () => clearInterval(maintenance));
    });
    
    // Global touch handler to start videos on any touch
    if (isMobile) {
        let hasStarted = false;
        function startAllVideos() {
            if (hasStarted) return;
            hasStarted = true;
            
            videos.forEach(video => {
                video.muted = true;
                video.removeAttribute('controls');
                video.removeAttribute('poster');
                video.play().then(() => {
                    video.style.opacity = '1';
                    video.classList.add('loaded', 'playing');
                }).catch(() => {});
            });
        }
        
        document.addEventListener('touchstart', startAllVideos, { once: true, passive: true });
        document.addEventListener('click', startAllVideos, { once: true });
        document.addEventListener('scroll', startAllVideos, { once: true, passive: true });
    }
    
    // Handle visibility and orientation changes
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(() => {
                videos.forEach(video => {
                    if (video.paused && !video.ended) {
                        video.muted = true;
                        video.removeAttribute('controls');
                        video.play().catch(() => {});
                    }
                });
            }, 200);
        }
    });
    
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            videos.forEach(video => {
                if (video.paused && !video.ended) {
                    video.play().catch(() => {});
                }
            });
        }, 300);
    });
});

// Add hover effects for collection items
document.querySelectorAll('.collection-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});

// Add scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ff0000, #cc0000);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
createScrollProgress();

// Add particle effect background (optional enhancement)
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 0, 0, 0.3);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
            animation-delay: ${Math.random() * 6}s;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particleContainer.appendChild(particle);
    }
}

// Add floating animation for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(style);

// Initialize particles
createParticles(); 