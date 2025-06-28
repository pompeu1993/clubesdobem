// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Here you could add filtering logic for offers
            // For now, we'll just update the UI
            const filterText = button.querySelector('span:last-child').textContent;
            console.log(`Filtering by: ${filterText}`);
        });
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 69; // Account for fixed header
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm.length > 2) {
                // Here you could implement actual search functionality
                console.log(`Searching for: ${searchTerm}`);
                
                // Example: Filter offers and gifts based on search term
                filterOffers(searchTerm);
                filterGifts(searchTerm);
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = e.target.value.trim();
                if (searchTerm) {
                    // Redirect to search page with query parameter
                    window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
                } else {
                    window.location.href = 'search.html';
                }
            }
        });
    }
    
    // Search icon click functionality
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            if (searchInput && searchInput.value.trim()) {
                window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
            } else {
                window.location.href = 'search.html';
            }
        });
        
        // Add cursor pointer to search icon
        searchIcon.style.cursor = 'pointer';
    }
}

// Filter offers based on search term
function filterOffers(searchTerm) {
    const offerCards = document.querySelectorAll('.offer-card');
    
    offerCards.forEach(card => {
        const businessName = card.querySelector('.business-name')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.offer-description')?.textContent.toLowerCase() || '';
        
        const matches = businessName.includes(searchTerm) || description.includes(searchTerm);
        
        if (matches) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.opacity = '0.3';
        }
    });
}

// Filter gifts based on search term
function filterGifts(searchTerm) {
    const giftCards = document.querySelectorAll('.gift-card');
    
    giftCards.forEach(card => {
        const businessName = card.querySelector('.business-name')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.gift-description')?.textContent.toLowerCase() || '';
        
        const matches = businessName.includes(searchTerm) || description.includes(searchTerm);
        
        if (matches) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.opacity = '0.3';
        }
    });
}

// Button interactions
function initializeButtons() {
    // Coupon buttons
    const couponButtons = document.querySelectorAll('.coupon-btn');
    couponButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Simulate coupon generation
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="coupon-icon"></span><span>Gerando...</span>';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = '<span class="coupon-icon"></span><span>Cupom Gerado!</span>';
                button.style.background = '#22C55E';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '#2563EB';
                    button.disabled = false;
                }, 2000);
            }, 1000);
        });
    });
    
    // Gift buttons
    const giftButtons = document.querySelectorAll('.gift-btn');
    giftButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Simulate gift reservation
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="gift-icon"></span><span>Reservando...</span>';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = '<span class="gift-icon"></span><span>Brinde Reservado!</span>';
                button.style.background = '#059669';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '#10B981';
                    button.disabled = false;
                }, 2000);
            }, 1000);
        });
    });
    
    // CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
}

// Header scroll effect
function initializeHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.backdropFilter = 'blur(10px)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.backdropFilter = 'none';
            header.style.background = 'white';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Intersection Observer for animations
function initializeScrollAnimations() {
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
    
    // Observe cards and sections
    const elementsToAnimate = document.querySelectorAll('.offer-card, .gift-card, .step-card, .cause-card, .testimonial-card');
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Progress bar animations
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                // Reset width and animate
                progressBar.style.width = '0%';
                progressBar.style.transition = 'width 1s ease-in-out';
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Form validation (if needed)
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#EF4444';
                    input.style.background = '#FEF2F2';
                } else {
                    input.style.borderColor = '#D1D5DB';
                    input.style.background = 'white';
                }
            });
            
            if (isValid) {
                console.log('Form is valid, submitting...');
                // Here you would handle form submission
            }
        });
    });
}

// Mobile menu toggle (if implementing mobile menu)
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.navigation');
    
    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', () => {
            navigation.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

// Floating app button functionality
function initializeFloatingButton() {
    const floatingBtn = document.querySelector('.floating-app-btn');
    
    if (floatingBtn) {
        floatingBtn.addEventListener('click', () => {
            // Simulate app download
            const originalText = floatingBtn.innerHTML;
            floatingBtn.innerHTML = '<span class="download-icon"></span><span>Baixando...</span>';
            
            setTimeout(() => {
                floatingBtn.innerHTML = '<span class="download-icon"></span><span>Download iniciado!</span>';
                
                setTimeout(() => {
                    floatingBtn.innerHTML = originalText;
                }, 2000);
            }, 1000);
        });
        
        // Hide/show on scroll
        let isVisible = true;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 200 && !isVisible) {
                floatingBtn.style.transform = 'translateY(0)';
                floatingBtn.style.opacity = '1';
                isVisible = true;
            } else if (scrollY <= 200 && isVisible) {
                floatingBtn.style.transform = 'translateY(100px)';
                floatingBtn.style.opacity = '0';
                isVisible = false;
            }
        });
    }
}

// Loading animations
function initializeLoadingAnimations() {
    // Add loading class to images
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Clubes do Bem website loaded successfully!');
    
    // Initialize all modules
    initializeFilters();
    initializeSmoothScrolling();
    initializeSearch();
    initializeButtons();
    initializeHeaderScrollEffect();
    initializeScrollAnimations();
    initializeProgressBars();
    initializeFormValidation();
    initializeMobileMenu();
    initializeFloatingButton();
    initializeLoadingAnimations();
    
    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
});

// Export functions for potential use in other scripts
  window.ClubesDB = {
    initializeFilters,
    initializeSearch,
    filterOffers,
    filterGifts,
    debounce,
    throttle
}; 