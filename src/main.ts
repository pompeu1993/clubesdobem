// Main entry point for the application
import './styles/main.css'

// Import page-specific modules and styles based on current page
const currentPage = window.location.pathname

if (currentPage.includes('search-gifts.html')) {
  import('./styles/search-gifts.css')
  import('./pages/search-gifts')
} else if (currentPage.includes('search.html')) {
  import('./styles/search.css')
  import('./pages/search')
} else {
  import('./pages/home')
}

// Export for global access if needed
export {} 