// Search gifts page functionality
import { Gift, SearchFilters, SortOption } from '../types'
import { debounce, generateStars, getCategoryIcon, getCauseName } from '../utils/helpers'
import { sampleGifts } from '../data/gifts'

// Search state
let currentFilters: SearchFilters = {
  searchTerm: '',
  category: '',
  location: '',
  distance: '',
  requirement: 10,
  rating: 0,
  cause: ''
}

let currentSort: SortOption = 'relevance'
let currentPage = 1
const itemsPerPage = 6

// Initialize search page
document.addEventListener('DOMContentLoaded', () => {
  initializeSearchPage()
})

function initializeSearchPage(): void {
  initializeFilters()
  initializeSearch()
  initializeSort()
  loadURLParameters()
  loadInitialResults()
  initializeHeaderSearch()
  console.log('Search gifts page loaded successfully!')
}

// Load search parameters from URL
function loadURLParameters(): void {
  const urlParams = new URLSearchParams(window.location.search)
  const searchQuery = urlParams.get('q')
  
  if (searchQuery) {
    const mainSearch = document.getElementById('mainSearch') as HTMLInputElement
    const headerSearch = document.getElementById('headerSearch') as HTMLInputElement
    
    if (mainSearch) {
      mainSearch.value = searchQuery
      currentFilters.searchTerm = searchQuery.toLowerCase()
    }
    
    if (headerSearch) {
      headerSearch.value = searchQuery
    }
  }
}

// Initialize modern filters
function initializeFilters(): void {
  const addFilterBtn = document.getElementById('addFilterBtn')
  const filterDropdown = document.getElementById('filterDropdown')
  const commandInput = document.getElementById('commandInput') as HTMLInputElement
  const clearAllBtn = document.getElementById('clearAllBtn')
  
  let isDropdownOpen = false
  
  // Toggle dropdown
  addFilterBtn?.addEventListener('click', (e) => {
    e.stopPropagation()
    toggleFilterDropdown()
  })
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!document.getElementById('filterPopover')?.contains(e.target as Node)) {
      closeFilterDropdown()
    }
  })
  
  // Command input search
  commandInput?.addEventListener('input', (e) => {
    filterCommandItems((e.target as HTMLInputElement).value)
  })
  
  // Clear all filters
  clearAllBtn?.addEventListener('click', clearAllFilters)
  
  // Initialize filter type selection
  initializeFilterTypeSelection()
  
  function toggleFilterDropdown(): void {
    if (isDropdownOpen) {
      closeFilterDropdown()
    } else {
      openFilterDropdown()
    }
  }
  
  function openFilterDropdown(): void {
    isDropdownOpen = true
    filterDropdown?.classList.add('open')
    addFilterBtn?.classList.add('active')
    commandInput?.focus()
    resetToFilterTypeSelection()
  }
  
  function closeFilterDropdown(): void {
    isDropdownOpen = false
    filterDropdown?.classList.remove('open')
    addFilterBtn?.classList.remove('active')
    if (commandInput) commandInput.value = ''
    resetToFilterTypeSelection()
  }
  
  function resetToFilterTypeSelection(): void {
    const filterTypeGroup = document.getElementById('filterTypeGroup')
    const filterValueGroup = document.getElementById('filterValueGroup')
    
    if (filterTypeGroup) filterTypeGroup.style.display = 'block'
    if (filterValueGroup) filterValueGroup.style.display = 'none'
    if (commandInput) commandInput.placeholder = 'Buscar filtros...'
  }
  
  function filterCommandItems(searchTerm: string): void {
    const items = document.querySelectorAll('.command-item')
    const lowerSearch = searchTerm.toLowerCase()
    
    items.forEach(item => {
      const text = item.textContent?.toLowerCase() || ''
      if (text.includes(lowerSearch)) {
        (item as HTMLElement).style.display = 'flex'
      } else {
        (item as HTMLElement).style.display = 'none'
      }
    })
  }
}

// Initialize search
function initializeSearch(): void {
  const mainSearch = document.getElementById('mainSearch') as HTMLInputElement
  const searchBtn = document.querySelector('.search-btn')
  
  mainSearch?.addEventListener('input', debounce((e: Event) => {
    currentFilters.searchTerm = (e.target as HTMLInputElement).value.toLowerCase()
    applyFilters()
  }, 300))
  
  searchBtn?.addEventListener('click', applyFilters)
  
  mainSearch?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyFilters()
  })
}

// Initialize sort
function initializeSort(): void {
  const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement
  sortSelect?.addEventListener('change', (e) => {
    currentSort = (e.target as HTMLSelectElement).value as SortOption
    applyFilters()
  })
}

// Apply filters
function applyFilters(): void {
  const filtered = filterGifts(sampleGifts)
  const sorted = sortGifts(filtered)
  const paginated = paginateGifts(sorted)
  
  updateResultsCount(filtered.length)
  renderGifts(paginated)
  updateLoadMoreButton(filtered.length)
}

// Filter gifts
function filterGifts(gifts: Gift[]): Gift[] {
  return gifts.filter(gift => {
    if (currentFilters.searchTerm && 
        !gift.businessName.toLowerCase().includes(currentFilters.searchTerm) &&
        !gift.description.toLowerCase().includes(currentFilters.searchTerm) &&
        !gift.giftType.toLowerCase().includes(currentFilters.searchTerm)) {
      return false
    }
    if (currentFilters.category && gift.category !== currentFilters.category) return false
    if (currentFilters.location && gift.location !== currentFilters.location) return false
    if (currentFilters.distance && gift.distance > parseInt(currentFilters.distance)) return false
    if (currentFilters.requirement && gift.requirementValue > currentFilters.requirement * 10) return false
    if (gift.rating < currentFilters.rating) return false
    if (currentFilters.cause && gift.cause !== currentFilters.cause) return false
    return true
  })
}

// Sort gifts
function sortGifts(gifts: Gift[]): Gift[] {
  const sorted = [...gifts]
  switch(currentSort) {
    case 'requirement': return sorted.sort((a, b) => a.requirementValue - b.requirementValue)
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating)
    case 'distance': return sorted.sort((a, b) => a.distance - b.distance)
    case 'newest': return sorted.sort((a, b) => b.id - a.id)
    default: return sorted
  }
}

// Paginate gifts
function paginateGifts(gifts: Gift[]): Gift[] {
  return gifts.slice(0, currentPage * itemsPerPage)
}

// Render gifts
function renderGifts(gifts: Gift[]): void {
  const grid = document.getElementById('resultsGrid')
  if (!grid) return
  
  if (gifts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 64px 32px; color: #6B7280;">
        <h3>Nenhum brinde encontrado</h3>
        <p>Tente ajustar seus filtros de busca.</p>
      </div>
    `
    return
  }
  
  grid.innerHTML = gifts.map(gift => `
    <div class="offer-card">
      <div class="offer-image">
        <img src="${gift.image}" alt="${gift.businessName}" />
        <div class="discount-badge ${gift.badgeColor}">BRINDE</div>
      </div>
      <div class="offer-content">
        <div class="offer-header">
          <div class="business-icon icon">${getCategoryIcon(gift.category)}</div>
          <div class="business-info">
            <h3 class="business-name">${gift.businessName}</h3>
            <div class="business-location">
              <span class="location-icon icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </span>
              <span>${gift.location}, ${gift.distance}km</span>
            </div>
          </div>
        </div>
        <p class="offer-description">${gift.description}</p>
        <div class="gift-requirement">
          <span class="requirement-icon icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </span>
          <span>Requisito: ${gift.requirement}</span>
        </div>
        <div class="offer-rating">
          <div class="stars">
            ${generateStars(gift.rating)}
            <span class="rating-value">${gift.rating}</span>
          </div>
          <div class="cause-supported">
            <span class="heart-icon icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            <span>Apoia: ${getCauseName(gift.cause)}</span>
          </div>
        </div>
        <button class="coupon-btn" onclick="handleGiftClaim(this)">
          <span class="coupon-icon icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </span>
          <span>Resgatar Brinde</span>
        </button>
      </div>
    </div>
  `).join('')
}

// Handle gift claim
(window as any).handleGiftClaim = function(button: HTMLButtonElement): void {
  const original = button.innerHTML
  button.innerHTML = '<span>Processando...</span>'
  button.disabled = true
  
  setTimeout(() => {
    button.innerHTML = '<span>Brinde Resgatado!</span>'
    button.style.background = '#22C55E'
    
    setTimeout(() => {
      button.innerHTML = original
      button.style.background = '#10B981'
      button.disabled = false
    }, 2000)
  }, 1000)
}

// Update results count
function updateResultsCount(count: number): void {
  const element = document.getElementById('resultsCount')
  if (element) {
    element.innerHTML = `Encontramos <strong>${count} brinde${count !== 1 ? 's' : ''}</strong> para voce`
  }
}

// Update load more button
function updateLoadMoreButton(total: number): void {
  const btn = document.getElementById('loadMoreBtn') as HTMLButtonElement
  const showing = currentPage * itemsPerPage
  
  if (!btn) return
  
  if (showing >= total) {
    btn.style.display = 'none'
  } else {
    btn.style.display = 'inline-flex'
    btn.onclick = () => {
      currentPage++
      applyFilters()
    }
  }
}

// Initialize filter type selection
function initializeFilterTypeSelection(): void {
  const filterTypeItems = document.querySelectorAll('[data-filter-type]')
  
  filterTypeItems.forEach(item => {
    item.addEventListener('click', () => {
      const filterType = (item as HTMLElement).dataset.filterType
      if (filterType) showFilterValueOptions(filterType)
    })
  })
}

// Show filter value options (simplified for brevity)
function showFilterValueOptions(filterType: string): void {
  // Implementation similar to search.ts but adapted for gifts
  console.log('Filter type:', filterType)
}

// Clear all filters
function clearAllFilters(): void {
  currentFilters = {
    searchTerm: '',
    category: '',
    location: '',
    distance: '',
    requirement: 10,
    rating: 0,
    cause: ''
  }
  
  const mainSearch = document.getElementById('mainSearch') as HTMLInputElement
  if (mainSearch) mainSearch.value = ''
  
  applyFilters()
}

// Load initial results
function loadInitialResults(): void {
  applyFilters()
}

// Header search functionality
function initializeHeaderSearch(): void {
  const headerSearch = document.getElementById('headerSearch') as HTMLInputElement
  const searchIcon = document.querySelector('.search-container .search-icon')
  
  searchIcon?.addEventListener('click', () => {
    const query = headerSearch?.value.trim()
    if (query) {
      window.location.href = `search-gifts.html?q=${encodeURIComponent(query)}`
    }
  })
  
  headerSearch?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = (e.target as HTMLInputElement).value.trim()
      if (query) {
        window.location.href = `search-gifts.html?q=${encodeURIComponent(query)}`
      }
    }
  })
}

export {} 