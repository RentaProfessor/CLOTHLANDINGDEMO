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

// ULTIMATE MOBILE VIDEO AUTOPLAY SOLUTION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎥 Initializing ULTIMATE mobile video autoplay...');
    
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    console.log('Device detection:', { isMobile, isiOS, isSafari });
    
    // Global state tracking
    let hasUserInteracted = false;
    let videosSetup = false;
    
    // RESPONSIVE VIDEO SETUP - Load correct quality based on screen size
    function setupResponsiveVideo(videoId) {
        const video = document.getElementById(videoId);
        if (!video) {
            console.log(`❌ Video ${videoId} not found`);
            return null;
        }
        
        const isDesktop = window.innerWidth >= 769;
        const isHeroVideo = videoId === 'hero-video';
        
        console.log(`🔧 Setting up ${videoId} - Screen: ${window.innerWidth}px, Desktop: ${isDesktop}`);
        
        // Determine video source based on device and video type
        let videoSrc;
        if (isHeroVideo) {
            videoSrc = isDesktop ? 'Videos/MAINHEROUNCOMPRESSEDHIGHQUALITYDESKTOP.mp4?v=11.0' : 'Videos/MAINHERO_mobile.mp4?v=11.0';
        } else {
            videoSrc = isDesktop ? 'Videos/LOWERVIDEO_desktop.mp4?v=11.0' : 'Videos/LOWERVIDEO_mobile.mp4?v=11.0';
        }
        
        console.log(`📹 Loading ${isDesktop ? 'DESKTOP' : 'MOBILE'} version: ${videoSrc}`);
        
        // Clear existing sources and set new one
        video.innerHTML = '';
        const source = document.createElement('source');
        source.src = videoSrc;
        source.type = 'video/mp4';
        video.appendChild(source);
        
        // Force reload with new source
        video.load();
        
        // FORCE all necessary attributes for mobile background behavior
        video.muted = true;
        video.volume = 0;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.controls = false;
        video.preload = 'auto';
        
        // REMOVE problematic attributes and add mobile-specific ones
        video.removeAttribute('controls');
        video.removeAttribute('poster');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('x5-playsinline', '');
        video.setAttribute('disablepictureinpicture', '');
        video.setAttribute('controls', 'false');
        
        // Mobile-specific attributes to prevent controls
        if (isMobile) {
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('playsinline', 'true');
            video.setAttribute('x5-playsinline', 'true');
            video.setAttribute('x5-video-player-type', 'h5');
            video.setAttribute('x5-video-player-fullscreen', 'false');
            video.setAttribute('x5-video-orientation', 'portraint');
        }
        
        // FORCE visibility and remove pointer events - MOBILE BACKGROUND BEHAVIOR
        video.style.pointerEvents = 'none';
        video.style.userSelect = 'none';
        video.style.webkitUserSelect = 'none';
        video.style.touchAction = 'none';
        video.style.webkitTouchCallout = 'none';
        video.style.webkitContextMenu = 'none';
        video.style.contextMenu = 'none';
        
        // Mobile-specific styling to ensure background behavior
        if (isMobile) {
            if (video.id === 'hero-video') {
                video.style.position = 'absolute';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100vh';
                video.style.objectFit = 'cover';
                video.style.zIndex = '1';
                video.style.background = '#000';
            } else if (video.id === 'showcase-video') {
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
                video.style.zIndex = '1';
                video.style.background = '#000';
            }
        }
        
        // AGGRESSIVE play function
        function aggressivePlay() {
            if (video.paused) {
                video.muted = true;
                video.volume = 0;
                video.removeAttribute('controls');
                
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log(`✅ ${videoId} playing successfully`);
                        video.style.opacity = '1';
                        video.classList.add('playing');
                    }).catch((error) => {
                        console.log(`⚠️ ${videoId} play failed (${error.name}) - will retry on interaction`);
                    });
                }
            }
        }
        
        // Event listeners for reliability
        video.addEventListener('loadeddata', aggressivePlay);
        video.addEventListener('canplay', aggressivePlay);
        video.addEventListener('loadedmetadata', () => {
            // Ensure video always starts from the beginning
            video.currentTime = 0;
            console.log(`📹 ${videoId} metadata loaded, duration: ${video.duration}s`);
            aggressivePlay();
        });
        
        // Error handling
        video.addEventListener('error', (e) => {
            console.error(`❌ ${videoId} error:`, e);
            console.error(`Video src: ${video.currentSrc || video.src}`);
        });
        
        // Loading events
        video.addEventListener('loadstart', () => {
            console.log(`🔄 ${videoId} loading started`);
        });
        
        // PREVENT pausing
        video.addEventListener('pause', () => {
            if (!video.ended && hasUserInteracted) {
                setTimeout(aggressivePlay, 10);
            }
        });
        
        // Force immediate play attempts
        video.load();
        setTimeout(aggressivePlay, 50);
        setTimeout(aggressivePlay, 200);
        setTimeout(aggressivePlay, 500);
        
        return video;
    }
    
    // Setup both videos with responsive quality
    const heroVideo = setupResponsiveVideo('hero-video');
    const showcaseVideo = setupResponsiveVideo('showcase-video');
    const allVideos = [heroVideo, showcaseVideo].filter(v => v !== null);
    
    videosSetup = true;
    
    // ULTIMATE USER INTERACTION HANDLER
    function handleUserInteraction(eventType) {
        if (hasUserInteracted) return;
        hasUserInteracted = true;
        
        console.log(`🎯 User interaction detected (${eventType}) - FORCE PLAYING ALL VIDEOS`);
        
        allVideos.forEach(video => {
            if (video && video.paused) {
                video.muted = true;
                video.volume = 0;
                video.removeAttribute('controls');
                video.style.pointerEvents = 'none';
                
                video.play().then(() => {
                    console.log(`✅ ${video.id} FORCE PLAY SUCCESS via ${eventType}`);
                    video.style.opacity = '1';
                }).catch(error => {
                    console.log(`❌ ${video.id} FORCE PLAY FAILED: ${error.name}`);
                });
            }
        });
        
        // Continue monitoring and force play
        setInterval(() => {
            allVideos.forEach(video => {
                if (video && video.paused && !video.ended) {
                    video.muted = true;
                    video.play().catch(() => {});
                }
            });
        }, 2000);
    }
    
    // CAPTURE ALL POSSIBLE USER INTERACTIONS
    const allEvents = [
        'touchstart', 'touchmove', 'touchend', 'touchcancel',
        'click', 'mousedown', 'mouseup', 'mousemove',
        'scroll', 'wheel', 'keydown', 'keyup',
        'pointerdown', 'pointerup', 'pointermove',
        'gesturestart', 'gesturechange', 'gestureend'
    ];
    
    allEvents.forEach(eventType => {
        document.addEventListener(eventType, () => handleUserInteraction(eventType), {
            once: true,
            passive: true,
            capture: true
        });
        window.addEventListener(eventType, () => handleUserInteraction(eventType), {
            once: true,
            passive: true,
            capture: true
        });
    });
    
    // VISIBILITY AND FOCUS HANDLERS
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && videosSetup) {
            console.log('📱 Page visible - FORCE PLAYING');
            setTimeout(() => {
                allVideos.forEach(video => {
                    if (video && video.paused) {
                        video.muted = true;
                        video.play().catch(() => {});
                    }
                });
            }, 100);
        }
    });
    
    window.addEventListener('focus', () => {
        if (videosSetup) {
            console.log('🔍 Window focused - FORCE PLAYING');
            allVideos.forEach(video => {
                if (video && video.paused) {
                    video.muted = true;
                    video.play().catch(() => {});
                }
            });
        }
    });
    
    // ORIENTATION CHANGE HANDLER
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            console.log('🔄 Orientation changed - FORCE PLAYING');
            allVideos.forEach(video => {
                if (video) {
                    video.style.objectFit = 'cover';
                    if (video.paused && hasUserInteracted) {
                        video.muted = true;
                        video.play().catch(() => {});
                    }
                }
            });
        }, 300);
    });
    
    // INTERSECTION OBSERVER FOR IMMEDIATE PLAY
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    console.log(`👁️ ${video.id} is visible - IMMEDIATE PLAY`);
                    
                    if (video.paused) {
                        video.muted = true;
                        video.volume = 0;
                        video.removeAttribute('controls');
                        
                        // Multiple immediate attempts
                        const tryPlay = () => {
                            video.play().then(() => {
                                console.log(`✅ ${video.id} INTERSECTION AUTOPLAY SUCCESS`);
                                video.style.opacity = '1';
                                videoObserver.unobserve(video);
                            }).catch(() => {
                                setTimeout(tryPlay, 50);
                            });
                        };
                        
                        tryPlay();
                        setTimeout(tryPlay, 1);
                        setTimeout(tryPlay, 10);
                        setTimeout(tryPlay, 100);
                    }
                }
            });
        }, {
            threshold: 0.01,
            rootMargin: '100px'
        });
        
        allVideos.forEach(video => {
            if (video) videoObserver.observe(video);
        });
    }
    
    // SAFARI-SPECIFIC AUTOPLAY FIXES
    if (isSafari || isiOS) {
        console.log('🍎 Safari/iOS detected - applying specific fixes');
        
        // Safari often requires a programmatic play() call after load
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.log('🍎 Safari page loaded - FORCE PLAYING');
                allVideos.forEach(video => {
                    if (video && video.paused) {
                        video.muted = true;
                        video.volume = 0;
                        video.play().catch(() => {});
                    }
                });
            }, 100);
        });
        
        // Safari requires this for proper autoplay
        allVideos.forEach(video => {
            if (video) {
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('playsinline', 'true');
                video.webkitEnterFullscreen = undefined;
                video.webkitExitFullscreen = undefined;
            }
        });
    }
    
    // MOBILE-SPECIFIC BACKGROUND VIDEO ENFORCEMENT
    if (isMobile) {
        console.log('📱 Mobile detected - enforcing background video behavior');
        
        allVideos.forEach(video => {
            if (video) {
                // Override any potential control displays
                const originalPlay = video.play;
                video.play = function() {
                    this.muted = true;
                    this.volume = 0;
                    this.controls = false;
                    this.removeAttribute('controls');
                    return originalPlay.call(this);
                };
                
                // Prevent any control interactions
                video.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
                
                video.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
                
                // Force background styling
                video.style.pointerEvents = 'none';
                video.style.userSelect = 'none';
                video.style.webkitUserSelect = 'none';
                video.style.touchAction = 'none';
                video.style.webkitTouchCallout = 'none';
                video.style.webkitContextMenu = 'none';
                video.style.contextMenu = 'none';
            }
        });
    }
    
    // MAINTENANCE LOOP - keeps videos playing
    let maintenanceStarted = false;
    
    function startMaintenance() {
        if (maintenanceStarted) return;
        maintenanceStarted = true;
        
        setInterval(() => {
            allVideos.forEach(video => {
                if (video) {
                    // Force remove controls
                    if (video.hasAttribute('controls') || video.controls) {
                        video.removeAttribute('controls');
                        video.controls = false;
                    }
                    
                    // Force muted
                    if (!video.muted || video.volume > 0) {
                        video.muted = true;
                        video.volume = 0;
                    }
                    
                    // Force visible
                    if (video.style.opacity !== '1') {
                        video.style.opacity = '1';
                    }
                    
                    // Auto-restart if paused (only after user interaction)
                    if (video.paused && !video.ended && hasUserInteracted && video.readyState >= 2) {
                        video.play().catch(() => {});
                    }
                }
            });
        }, 1000);
    }
    
    // Start maintenance after first interaction
    allEvents.slice(0, 5).forEach(eventType => {
        document.addEventListener(eventType, startMaintenance, { 
            once: true, 
            passive: true 
        });
    });
    
    // Handle window resize to switch video quality
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log('🔄 Window resized - checking if video quality should change');
            const newIsDesktop = window.innerWidth >= 769;
            
            // Check if we need to switch video quality
            [heroVideo, showcaseVideo].forEach(video => {
                if (video) {
                    const currentSrc = video.querySelector('source')?.src || '';
                    const shouldBeDesktop = newIsDesktop;
                    const isCurrentlyDesktop = currentSrc.includes('desktop');
                    
                    if (shouldBeDesktop !== isCurrentlyDesktop) {
                        console.log(`🔄 Switching ${video.id} to ${shouldBeDesktop ? 'DESKTOP' : 'MOBILE'} quality`);
                        
                        // Determine new source
                        const isHeroVideo = video.id === 'hero-video';
                        let newSrc;
                        if (isHeroVideo) {
                            newSrc = shouldBeDesktop ? 'Videos/MAINHEROUNCOMPRESSEDHIGHQUALITYDESKTOP.mp4?v=11.0' : 'Videos/MAINHERO_mobile.mp4?v=11.0';
                        } else {
                            newSrc = shouldBeDesktop ? 'Videos/LOWERVIDEO_desktop.mp4?v=11.0' : 'Videos/LOWERVIDEO_mobile.mp4?v=11.0';
                        }
                        
                        // Switch source
                        video.innerHTML = '';
                        const source = document.createElement('source');
                        source.src = newSrc;
                        source.type = 'video/mp4';
                        video.appendChild(source);
                        video.load();
                        
                        // Restart playback
                        setTimeout(() => {
                            video.muted = true;
                            video.play().catch(() => {});
                        }, 100);
                    }
                }
            });
        }, 500); // Debounce resize events
    });
    
    console.log('🎥 RESPONSIVE video system setup complete!');
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