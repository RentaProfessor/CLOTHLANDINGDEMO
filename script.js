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

// Enhanced video loading and autoplay for all devices
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');
    
    console.log('Found', videos.length, 'videos to load');
    
    videos.forEach((video, index) => {
        console.log(`Video ${index + 1}:`, video.currentSrc || video.src || 'No src');
        
        // Set video attributes immediately
        video.setAttribute('preload', 'auto');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.muted = true; // Ensure muted property is set
        video.autoplay = true;
        video.loop = true;
        
        // Multiple event listeners for reliable autoplay
        const attemptPlay = () => {
            if (video.readyState >= 3) { // HAVE_FUTURE_DATA
                video.play().then(() => {
                    console.log('Video autoplay successful:', video.currentSrc);
                    video.classList.add('loaded');
                }).catch(e => {
                    console.log('Autoplay failed:', e);
                    // Try again with user interaction
                    const playOnInteraction = () => {
                        video.play().then(() => {
                            console.log('Manual play successful');
                        }).catch(err => console.log('Manual play failed:', err));
                        
                        document.removeEventListener('click', playOnInteraction);
                        document.removeEventListener('touchstart', playOnInteraction);
                        document.removeEventListener('scroll', playOnInteraction);
                    };
                    
                    document.addEventListener('click', playOnInteraction, { once: true });
                    document.addEventListener('touchstart', playOnInteraction, { once: true });
                    document.addEventListener('scroll', playOnInteraction, { once: true });
                });
            }
        };
        
        // Try to play when video data is loaded
        video.addEventListener('loadeddata', function() {
            console.log('Video data loaded:', this.currentSrc);
            this.classList.add('loaded');
            attemptPlay();
        });
        
        // Also try when enough data is available
        video.addEventListener('canplay', function() {
            console.log('Video can play:', this.currentSrc);
            if (this.paused) {
                attemptPlay();
            }
        });
        
        // Try when metadata is loaded
        video.addEventListener('loadedmetadata', function() {
            console.log('Video metadata loaded:', this.currentSrc);
            if (this.paused && this.readyState >= 1) {
                attemptPlay();
            }
        });
        
        // Handle video load errors
        video.addEventListener('error', function() {
            console.error('Video failed to load:', this.currentSrc || this.src);
        });
        
        // Log when video starts playing
        video.addEventListener('play', function() {
            console.log('Video started playing:', this.currentSrc);
        });
        
        // Force load the video
        video.load();
        
        // Fallback: try to play after a delay
        setTimeout(() => {
            if (video.paused && video.readyState >= 1) {
                attemptPlay();
            }
        }, 1000);
    });
    
    // Handle orientation change on mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            videos.forEach(video => {
                video.style.objectFit = 'cover';
            });
        }, 100);
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