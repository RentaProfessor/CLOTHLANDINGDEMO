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

// Enhanced video autoplay for mobile and iframe support
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');
    let hasUserInteracted = false;
    
    // Detect if running in iframe
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
        document.body.classList.add('in-iframe');
        console.log('Running in iframe - applying iframe optimizations');
    }
    
    // Detect user interaction for mobile autoplay
    const userInteractionEvents = ['touchstart', 'touchend', 'click', 'scroll'];
    
    function markUserInteraction() {
        hasUserInteracted = true;
        userInteractionEvents.forEach(event => {
            document.removeEventListener(event, markUserInteraction);
        });
    }
    
    userInteractionEvents.forEach(event => {
        document.addEventListener(event, markUserInteraction, { passive: true });
    });
    
    videos.forEach((video, index) => {
        // Set all required attributes for mobile autoplay
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.controls = false;
        video.preload = 'metadata';
        
        // Remove any controls attributes
        video.removeAttribute('controls');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('x5-playsinline', '');
        
        // Mobile-specific attributes
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.setAttribute('x5-video-player-type', 'h5');
            video.setAttribute('x5-video-player-fullscreen', 'false');
        }
        
        let playAttempts = 0;
        const maxPlayAttempts = 5;
        
        function attemptPlay() {
            if (playAttempts >= maxPlayAttempts) return;
            playAttempts++;
            
            // Ensure video is properly configured
            video.muted = true;
            video.controls = false;
            video.removeAttribute('controls');
            
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log(`Video ${index + 1} autoplay successful`);
                    video.style.opacity = '1';
                    video.classList.add('loaded');
                    
                    // Ensure video stays visible and playing
                    setTimeout(() => {
                        if (video.paused) {
                            video.play().catch(() => {});
                        }
                    }, 500);
                    
                }).catch(error => {
                    console.log(`Video ${index + 1} autoplay failed:`, error.message);
                    
                    // For mobile devices, try again after user interaction
                    if (!hasUserInteracted) {
                        const playOnInteraction = () => {
                            video.muted = true;
                            video.controls = false;
                            video.removeAttribute('controls');
                            
                            video.play().then(() => {
                                video.style.opacity = '1';
                                video.classList.add('loaded');
                            }).catch(() => {
                                // Last resort - show a very brief play button
                                setTimeout(() => {
                                    video.play().catch(() => {});
                                }, 100);
                            });
                        };
                        
                        userInteractionEvents.forEach(event => {
                            document.addEventListener(event, playOnInteraction, { once: true, passive: true });
                        });
                    } else {
                        // Retry after a short delay
                        setTimeout(() => attemptPlay(), 200);
                    }
                });
            }
        }
        
        // Try to play when video is ready
        function onVideoReady() {
            if (video.readyState >= 2) {
                attemptPlay();
            }
        }
        
        // Multiple event listeners to catch video readiness
        video.addEventListener('loadeddata', onVideoReady);
        video.addEventListener('canplay', onVideoReady);
        video.addEventListener('loadedmetadata', onVideoReady);
        
        // Start loading the video
        video.load();
        
        // Immediate play attempt for desktop/iframe scenarios
        setTimeout(() => {
            if (video.readyState >= 2) {
                attemptPlay();
            }
        }, 100);
        
        // Video event handlers for debugging and maintenance
        video.addEventListener('playing', () => {
            video.style.opacity = '1';
            video.style.display = 'block';
            video.classList.add('loaded');
        });
        
        video.addEventListener('pause', () => {
            // Auto-resume if paused unexpectedly
            if (!video.ended) {
                setTimeout(() => {
                    if (video.paused && !video.ended) {
                        video.play().catch(() => {});
                    }
                }, 100);
            }
        });
        
        video.addEventListener('stalled', () => {
            setTimeout(() => {
                if (video.networkState === 3) { // NETWORK_NO_SOURCE
                    video.load();
                }
            }, 1000);
        });
        
        video.addEventListener('waiting', () => {
            // Video is waiting for data, ensure it's still visible
            video.style.opacity = '1';
        });
        
        video.addEventListener('error', (e) => {
            console.error(`Video ${index + 1} error:`, e);
            // Try to reload after error
            setTimeout(() => {
                video.load();
            }, 2000);
        });
        
        // Continuous maintenance to prevent controls and black screen
        setInterval(() => {
            // Remove controls that might appear
            if (video.hasAttribute('controls') || video.controls) {
                video.removeAttribute('controls');
                video.controls = false;
            }
            
            // Prevent black screen when video is playing
            if (video.readyState >= 2 && !video.paused && !video.ended) {
                video.style.opacity = '1';
                video.style.display = 'block';
            }
        }, 50);
    });
    
    // Handle orientation change and resize for mobile
    function handleOrientationChange() {
        setTimeout(() => {
            videos.forEach(video => {
                video.style.objectFit = 'cover';
                // Force a repaint to prevent black screen
                video.style.transform = 'translateZ(0)';
                setTimeout(() => {
                    video.style.transform = '';
                }, 50);
                
                // Ensure video is still playing after orientation change
                if (video.paused && !video.ended) {
                    video.play().catch(() => {});
                }
            });
        }, 300);
    }
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Handle visibility change (when iframe comes into/out of view)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(() => {
                videos.forEach(video => {
                    if (video.paused && !video.ended) {
                        video.play().catch(() => {});
                    }
                });
            }, 500);
        }
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