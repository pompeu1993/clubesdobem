// Home page functionality

// interface HeroSlide {
//   title: string
//   subtitle: string
//   description: string
//   bgImage: string
// }

// Future implementation for hero carousel
// const heroSlides: HeroSlide[] = [
//   {
//     title: "Economize com",
//     subtitle: "Propósito",
//     description: "Ofertas exclusivas que apoiam causas sociais da sua comunidade",
//     bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
//   },
//   {
//     title: "Transforme consumo em",
//     subtitle: "Impacto Social",
//     description: "Cada compra ajuda projetos sociais locais",
//     bgImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
//   },
//   {
//     title: "Brindes que fazem",
//     subtitle: "a Diferença",
//     description: "Ganhe recompensas enquanto apoia sua comunidade",
//     bgImage: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
//   }
// ]

let currentSlide = 0
let slideInterval: number | null = null

function initializeHeroSlider(): void {
  const slides = document.querySelectorAll('.hero-slide')
  const dots = document.querySelectorAll('.slide-dot')
  
  if (slides.length === 0) return
  
  function showSlide(index: number): void {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index)
    })
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index)
    })
    
    currentSlide = index
  }
  
  function nextSlide(): void {
    showSlide((currentSlide + 1) % slides.length)
  }
  
  function startSlideShow(): void {
    slideInterval = window.setInterval(nextSlide, 5000)
  }
  
  function stopSlideShow(): void {
    if (slideInterval) {
      clearInterval(slideInterval)
      slideInterval = null
    }
  }
  
  // Initialize dots click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopSlideShow()
      showSlide(index)
      startSlideShow()
    })
  })
  
  // Start automatic slideshow
  startSlideShow()
  
  // Pause on hover
  const heroSection = document.querySelector('.hero')
  heroSection?.addEventListener('mouseenter', stopSlideShow)
  heroSection?.addEventListener('mouseleave', startSlideShow)
}

function initializeCounters(): void {
  const counters = document.querySelectorAll('.counter-number')
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target as HTMLElement
        const target = parseInt(counter.getAttribute('data-target') || '0')
        const duration = 2000
        const increment = target / (duration / 16)
        let current = 0
        
        const updateCounter = (): void => {
          current += increment
          if (current < target) {
            counter.textContent = Math.floor(current).toString()
            requestAnimationFrame(updateCounter)
          } else {
            counter.textContent = target.toString()
          }
        }
        
        updateCounter()
        observer.unobserve(counter)
      }
    })
  }, observerOptions)
  
  counters.forEach(counter => observer.observe(counter))
}

function initializeHeaderSearch(): void {
  const headerSearch = document.getElementById('headerSearch') as HTMLInputElement
  const searchIcon = document.querySelector('.search-container .search-icon')
  
  searchIcon?.addEventListener('click', () => {
    const query = headerSearch?.value.trim()
    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`
    }
  })
  
  headerSearch?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = (e.target as HTMLInputElement).value.trim()
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`
      }
    }
  })
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
  initializeHeroSlider()
  initializeCounters()
  initializeHeaderSearch()
  console.log('Home page initialized')
})

export {} 