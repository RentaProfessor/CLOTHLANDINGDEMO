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

// Parallax effect for hero section (disabled to prevent video conflicts)
// window.addEventListener('scroll', function() {
//     const scrolled = window.pageYOffset;
//     const heroVideo = document.querySelector('.hero-video');
//     
//     if (heroVideo) {
//         const rate = scrolled * -0.5;
//         heroVideo.style.transform = `translateY(${rate}px)`;
//     }
// });

// Simplified and reliable video autoplay
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInIframe = window.self !== window.top;
    
    if (isInIframe) {
        document.body.classList.add('in-iframe');
    }
    
    console.log('Initializing video autoplay...');
    
    // Simplified video setup for each video
    function setupVideo(videoId, canvasId) {
        const video = document.getElementById(videoId);
        const canvas = document.getElementById(canvasId);
        
        if (!video) {
            console.log(`Video ${videoId} not found`);
            return;
        }
        
        console.log(`Setting up video: ${videoId}`);
        console.log(`Video element:`, video);
        console.log(`Video readyState:`, video.readyState);
        console.log(`Video src:`, video.currentSrc || video.src);
        
        // Basic reliable attributes
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.controls = false;
        video.preload = 'auto';
        
        // Ensure video is visible
        video.style.opacity = '1';
        video.style.display = 'block';
        video.style.visibility = 'visible';
        video.style.zIndex = '2';
        
        // Remove any blocking attributes
        video.removeAttribute('controls');
        video.removeAttribute('poster');
        
        // Canvas fallback function
        function useCanvasFallback() {
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth || 1920;
            canvas.height = video.videoHeight || 1080;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.objectFit = 'cover';
            
            function drawFrame() {
                if (video.readyState >= 2) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                }
                requestAnimationFrame(drawFrame);
            }
            
            video.addEventListener('loadeddata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                drawFrame();
                
                // Show canvas instead of video
                canvas.style.display = 'block';
                video.style.display = 'none';
            });
        }
        
        // Simple reliable play function
        function simplePlay() {
            console.log(`Attempting to play ${videoId}`);
            
            // Force muted state
            video.muted = true;
            video.volume = 0;
            video.controls = false;
            video.removeAttribute('controls');
            
            // Force video to be visible
            video.style.opacity = '1';
            video.style.display = 'block';
            video.style.visibility = 'visible';
            video.style.zIndex = '2';
            
            // Simple play attempt
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log(`${videoId} playing successfully`);
                    video.style.opacity = '1';
                    video.style.display = 'block';
                    video.style.visibility = 'visible';
                    video.classList.add('playing');
                    
                }).catch((error) => {
                    console.log(`${videoId} autoplay failed:`, error.name);
                    console.log(`Video error details:`, error);
                    // Try again after user interaction
                    setTimeout(() => {
                        video.play().catch(() => {});
                    }, 1000);
                });
            }
        }
        
        // Event triggers
        video.addEventListener('loadeddata', simplePlay);
        video.addEventListener('canplay', simplePlay);
        
        // Force load and play
        video.load();
        
        // Try playing after a short delay
        setTimeout(simplePlay, 100);
        setTimeout(simplePlay, 500);
        
        // Event handlers
        video.addEventListener('playing', () => {
            video.style.opacity = '1';
            video.style.display = 'block';
            video.classList.add('playing');
            console.log(`${videoId} is now playing`);
        });
        
        video.addEventListener('pause', () => {
            console.log(`${videoId} paused - restarting`);
            if (!video.ended) {
                setTimeout(() => video.play().catch(() => {}), 25);
            }
        });
        
        video.addEventListener('waiting', () => {
            console.log(`${videoId} waiting - forcing play`);
            video.play().catch(() => {});
        });
        
        video.addEventListener('stalled', () => {
            console.log(`${videoId} stalled - reloading`);
            video.load();
            setTimeout(simplePlay, 100);
        });
        
        // Simple maintenance
        const maintenance = setInterval(() => {
            // Remove controls
            if (video.hasAttribute('controls') || video.controls) {
                video.removeAttribute('controls');
                video.controls = false;
            }
            
            // Force muted
            if (!video.muted) {
                video.muted = true;
                video.volume = 0;
            }
            
            // Auto-restart if paused
            if (video.paused && !video.ended && video.readyState >= 2) {
                video.play().catch(() => {});
            }
            
            // Ensure visibility
            video.style.opacity = '1';
            video.style.display = 'block';
        }, 1000);
        
        // Cleanup
        video.addEventListener('emptied', () => clearInterval(maintenance));
    }
    
    // Setup both videos
    setupVideo('hero-video', 'hero-canvas');
    setupVideo('showcase-video', 'showcase-canvas');
    
    // Global fallback handlers
    let interactionTriggered = false;
    
    function triggerAllVideos() {
        if (interactionTriggered) return;
        interactionTriggered = true;
        
        const videos = ['hero-video', 'showcase-video'];
        videos.forEach(id => {
            const video = document.getElementById(id);
            if (video) {
                video.muted = true;
                video.volume = 0;
                video.removeAttribute('controls');
                video.play().then(() => {
                    video.style.opacity = '1';
                    video.classList.add('playing');
                }).catch(() => console.log(`${id} fallback failed`));
            }
        });
    }
    
    // Immediate triggers
    if (isMobile || isiOS) {
        ['touchstart', 'touchmove', 'click', 'scroll', 'keydown'].forEach(event => {
            document.addEventListener(event, triggerAllVideos, { 
                once: true, 
                passive: true,
                capture: true 
            });
        });
    }
    
    // Page visibility handling
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(() => {
                ['hero-video', 'showcase-video'].forEach(id => {
                    const video = document.getElementById(id);
                    if (video && video.paused && !video.ended) {
                        video.muted = true;
                        video.play().catch(() => {});
                    }
                });
            }, 100);
        }
    });
    
    // Orientation change handling
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            ['hero-video', 'showcase-video'].forEach(id => {
                const video = document.getElementById(id);
                if (video) {
                    video.style.objectFit = 'cover';
                    if (video.paused && !video.ended) {
                        video.play().catch(() => {});
                    }
                }
            });
        }, 200);
    });
    
    // Simple user interaction for video play
    let interactionCaptured = false;
    
    function playAllVideos() {
        if (interactionCaptured) return;
        interactionCaptured = true;
        
        ['hero-video', 'showcase-video'].forEach(id => {
            const video = document.getElementById(id);
            if (video) {
                video.muted = true;
                video.play().then(() => {
                    console.log(`${id} playing after interaction`);
                    video.style.opacity = '1';
                }).catch(() => {
                    console.log(`${id} failed to play after interaction`);
                });
            }
        });
    }
    
    // Listen for any user interaction
    ['touchstart', 'click', 'scroll'].forEach(event => {
        document.addEventListener(event, playAllVideos, { 
            once: true, 
            passive: true
        });
    });
    
    // Force immediate execution on iOS
    if (isiOS) {
        setTimeout(() => {
            playAllVideos();
        }, 500);
    }
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

// Typing effect removed - hero title displays normally

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