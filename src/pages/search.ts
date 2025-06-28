// Search page functionality
import { Offer, SearchFilters, SortOption, FilterOption } from '../types'
import { debounce, generateStars, getCategoryIcon, getCauseName, getCategoryName, getLocationName } from '../utils/helpers'
import { sampleOffers } from '../data/offers'

// Search state
let currentFilters: SearchFilters = {
  searchTerm: '',
  category: '',
  location: '',
  distance: '',
  discount: 10,
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
  console.log('Search page loaded successfully!')
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
  const filtered = filterOffers(sampleOffers)
  const sorted = sortOffers(filtered)
  const paginated = paginateOffers(sorted)
  
  updateResultsCount(filtered.length)
  renderOffers(paginated)
  updateLoadMoreButton(filtered.length)
}

// Filter offers
function filterOffers(offers: Offer[]): Offer[] {
  return offers.filter(offer => {
    if (currentFilters.searchTerm && 
        !offer.businessName.toLowerCase().includes(currentFilters.searchTerm) &&
        !offer.description.toLowerCase().includes(currentFilters.searchTerm)) {
      return false
    }
    if (currentFilters.category && offer.category !== currentFilters.category) return false
    if (currentFilters.location && offer.location !== currentFilters.location) return false
    if (currentFilters.distance && offer.distance > parseInt(currentFilters.distance)) return false
    if (currentFilters.discount && offer.discount < currentFilters.discount) return false
    if (offer.rating < currentFilters.rating) return false
    if (currentFilters.cause && offer.cause !== currentFilters.cause) return false
    return true
  })
}

// Sort offers
function sortOffers(offers: Offer[]): Offer[] {
  const sorted = [...offers]
  switch(currentSort) {
    case 'discount': return sorted.sort((a, b) => b.discount - a.discount)
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating)
    case 'distance': return sorted.sort((a, b) => a.distance - b.distance)
    case 'newest': return sorted.sort((a, b) => b.id - a.id)
    default: return sorted
  }
}

// Paginate offers
function paginateOffers(offers: Offer[]): Offer[] {
  return offers.slice(0, currentPage * itemsPerPage)
}

// Render offers
function renderOffers(offers: Offer[]): void {
  const grid = document.getElementById('resultsGrid')
  if (!grid) return
  
  if (offers.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 64px 32px; color: #6B7280;">
        <h3>Nenhuma oferta encontrada</h3>
        <p>Tente ajustar seus filtros de busca.</p>
      </div>
    `
    return
  }
  
  grid.innerHTML = offers.map(offer => `
    <div class="offer-card">
      <div class="offer-image">
        <img src="${offer.image}" alt="${offer.businessName}" />
        <div class="discount-badge ${offer.badgeColor}">${offer.discount}% OFF</div>
      </div>
      <div class="offer-content">
        <div class="offer-header">
          <div class="business-icon icon">${getCategoryIcon(offer.category)}</div>
          <div class="business-info">
            <h3 class="business-name">${offer.businessName}</h3>
            <div class="business-location">
              <span class="location-icon icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </span>
              <span>${offer.location}, ${offer.distance}km</span>
            </div>
          </div>
        </div>
        <p class="offer-description">${offer.description}</p>
        <div class="offer-rating">
          <div class="stars">
            ${generateStars(offer.rating)}
            <span class="rating-value">${offer.rating}</span>
          </div>
          <div class="cause-supported">
            <span class="heart-icon icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            <span>Apoia: ${getCauseName(offer.cause)}</span>
          </div>
        </div>
        <button class="coupon-btn" onclick="handleCouponClick(this)">
          <span class="coupon-icon icon">
            <svg viewBox="0 0 24 24">
              <path d="M4 4c-1.11 0-2 .89-2 2v3c1.11 0 2 .89 2 2s-.89 2-2 2v3c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2v-3c-1.11 0-2-.89-2-2s.89-2 2-2V6c0-1.11-.89-2-2-2H4z"/>
            </svg>
          </span>
          <span>Obter Cupom</span>
        </button>
      </div>
    </div>
  `).join('')
}

// Handle coupon click
(window as any).handleCouponClick = function(button: HTMLButtonElement): void {
  const original = button.innerHTML
  button.innerHTML = '<span>Gerando...</span>'
  button.disabled = true
  
  setTimeout(() => {
    button.innerHTML = '<span>Cupom Gerado!</span>'
    button.style.background = '#22C55E'
    
    setTimeout(() => {
      button.innerHTML = original
      button.style.background = '#2563EB'
      button.disabled = false
    }, 2000)
  }, 1000)
}

// Update results count
function updateResultsCount(count: number): void {
  const element = document.getElementById('resultsCount')
  if (element) {
    element.innerHTML = `Encontramos <strong>${count} oferta${count !== 1 ? 's' : ''}</strong> para voce`
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

// Show filter value options
function showFilterValueOptions(filterType: string): void {
  const filterTypeGroup = document.getElementById('filterTypeGroup')
  const filterValueGroup = document.getElementById('filterValueGroup')
  const valueGroupLabel = document.getElementById('valueGroupLabel')
  const filterValueOptions = document.getElementById('filterValueOptions')
  const commandInput = document.getElementById('commandInput') as HTMLInputElement
  
  if (!filterTypeGroup || !filterValueGroup || !valueGroupLabel || !filterValueOptions) return
  
  filterTypeGroup.style.display = 'none'
  filterValueGroup.style.display = 'block'
  
  // Set label and placeholder
  const filterLabels: Record<string, string> = {
    category: 'Selecionar Categoria',
    location: 'Selecionar Localizacao',
    distance: 'Selecionar Distancia',
    discount: 'Selecionar Desconto',
    rating: 'Selecionar Avaliacao',
    cause: 'Selecionar Causa Social'
  }
  
  valueGroupLabel.textContent = filterLabels[filterType]
  if (commandInput) commandInput.placeholder = `Buscar ${filterLabels[filterType].toLowerCase()}...`
  
  // Generate options based on filter type
  const options = getFilterOptions(filterType)
  filterValueOptions.innerHTML = ''
  
  // Add back button
  const backButton = document.createElement('div')
  backButton.className = 'command-back'
  backButton.innerHTML = `
    <svg class="command-back-icon" viewBox="0 0 24 24">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
    <span>Voltar</span>
  `
  backButton.addEventListener('click', resetToFilterTypeSelection)
  filterValueOptions.appendChild(backButton)
  
  // Add options
  if (filterType === 'discount') {
    addDiscountRangeOption(filterValueOptions)
  } else if (filterType === 'rating') {
    addRatingOptions(filterValueOptions)
  } else {
    options.forEach(option => {
      const item = document.createElement('div')
      item.className = 'command-item'
      item.innerHTML = `
        <span class="command-icon">${option.icon || ''}</span>
        <span>${option.label}</span>
      `
      item.addEventListener('click', () => {
        addFilter(filterType, option.value, option.label)
        closeFilterDropdown()
      })
      filterValueOptions.appendChild(item)
    })
  }
  
  function resetToFilterTypeSelection(): void {
    if (filterTypeGroup) filterTypeGroup.style.display = 'block'
    if (filterValueGroup) filterValueGroup.style.display = 'none'
    if (commandInput) {
      commandInput.placeholder = 'Buscar filtros...'
      commandInput.value = ''
    }
  }
  
  function closeFilterDropdown(): void {
    const dropdown = document.getElementById('filterDropdown')
    const addBtn = document.getElementById('addFilterBtn')
    dropdown?.classList.remove('open')
    addBtn?.classList.remove('active')
    resetToFilterTypeSelection()
  }
}

// Get filter options for each type
function getFilterOptions(filterType: string): FilterOption[] {
  const options: Record<string, FilterOption[]> = {
    category: [
      { value: 'restaurantes', label: 'Restaurantes', icon: '<svg viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z"/></svg>' },
      { value: 'moda', label: 'Moda', icon: '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77z"/></svg>' },
      { value: 'beleza', label: 'Beleza', icon: '<svg viewBox="0 0 24 24"><path d="M9 11H7v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9h-2z"/></svg>' },
      { value: 'fitness', label: 'Fitness', icon: '<svg viewBox="0 0 24 24"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>' },
      { value: 'educacao', label: 'Educacao', icon: '<svg viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>' },
      { value: 'mercados', label: 'Mercados', icon: '<svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2z"/></svg>' }
    ],
    location: [
      { value: 'centro', label: 'Centro' },
      { value: 'zona-norte', label: 'Zona Norte' },
      { value: 'zona-sul', label: 'Zona Sul' },
      { value: 'zona-leste', label: 'Zona Leste' },
      { value: 'zona-oeste', label: 'Zona Oeste' }
    ],
    distance: [
      { value: '1', label: 'Ate 1 km' },
      { value: '3', label: 'Ate 3 km' },
      { value: '5', label: 'Ate 5 km' },
      { value: '10', label: 'Ate 10 km' }
    ],
    cause: [
      { value: 'lar-idosos', label: 'Lar dos Idosos' },
      { value: 'esporte-todos', label: 'Esporte para Todos' },
      { value: 'casa-abrigo', label: 'Casa Abrigo' },
      { value: 'verde-vida', label: 'Verde Vida' }
    ]
  }
  
  return options[filterType] || []
}

// Add discount range option
function addDiscountRangeOption(container: HTMLElement): void {
  const rangeContainer = document.createElement('div')
  rangeContainer.className = 'command-range'
  rangeContainer.innerHTML = `
    <div class="range-input-container">
      <div class="range-labels-inline">
        <span>Desconto minimo</span>
        <span>70%+</span>
      </div>
      <input type="range" min="5" max="70" value="${currentFilters.discount}" class="range-input" id="discountRange">
      <div class="range-value">${currentFilters.discount}%</div>
    </div>
  `
  
  container.appendChild(rangeContainer)
  
  const rangeInput = rangeContainer.querySelector('#discountRange') as HTMLInputElement
  const rangeValue = rangeContainer.querySelector('.range-value') as HTMLElement
  
  rangeInput?.addEventListener('input', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value)
    rangeValue.textContent = `${value}%`
    currentFilters.discount = value
    applyFilters()
  })
}

// Add rating options
function addRatingOptions(container: HTMLElement): void {
  for (let i = 1; i <= 5; i++) {
    const item = document.createElement('div')
    item.className = 'command-item'
    item.innerHTML = `
      <span class="command-icon">
        <svg viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </span>
      <span>${i}+ estrela${i > 1 ? 's' : ''}</span>
    `
    item.addEventListener('click', () => {
      addFilter('rating', i.toString(), `${i}+ estrela${i > 1 ? 's' : ''}`)
      closeFilterDropdown()
    })
    container.appendChild(item)
  }
  
  function closeFilterDropdown(): void {
    const dropdown = document.getElementById('filterDropdown')
    const addBtn = document.getElementById('addFilterBtn')
    dropdown?.classList.remove('open')
    addBtn?.classList.remove('active')
  }
}

// Add filter
function addFilter(type: string, value: string, _label: string): void {
  if (type === 'rating') {
    currentFilters.rating = parseInt(value)
  } else {
    (currentFilters as any)[type] = value
  }
  updateActiveFiltersDisplay()
  applyFilters()
}

// Update active filters display
function updateActiveFiltersDisplay(): void {
  const container = document.getElementById('activeFiltersChips')
  const clearAllBtn = document.getElementById('clearAllBtn')
  const addFilterBtn = document.getElementById('addFilterBtn')
  const activeFiltersRow = document.querySelector('.active-filters-row')
  
  if (!container) return
  
  // Clear existing chips
  container.innerHTML = ''
  
  // Check if there are any active filters
  const hasActiveFilters = Object.entries(currentFilters).some(([key, value]) => {
    if (key === 'searchTerm') return value.length > 0
    if (key === 'discount') return value > 10
    if (key === 'rating') return value > 0
    return value !== ''
  })
  
  if (!hasActiveFilters) {
    if (clearAllBtn) clearAllBtn.style.display = 'none'
    addFilterBtn?.classList.remove('has-filters')
    activeFiltersRow?.classList.remove('has-filters')
    return
  }
  
  // Show clear all button and update filter button
  if (clearAllBtn) clearAllBtn.style.display = 'inline-flex'
  addFilterBtn?.classList.add('has-filters')
  activeFiltersRow?.classList.add('has-filters')
  
  // Create filter chips
  Object.entries(currentFilters).forEach(([key, value]) => {
    if (key === 'searchTerm' && value.length > 0) {
      createFilterChip('Busca', `"${value}"`, 'searchTerm')
    } else if (key === 'category' && value) {
      createFilterChip('Categoria', getCategoryName(value), 'category')
    } else if (key === 'location' && value) {
      createFilterChip('Local', getLocationName(value), 'location')
    } else if (key === 'distance' && value) {
      createFilterChip('Distancia', `Ate ${value}km`, 'distance')
    } else if (key === 'discount' && value > 10) {
      createFilterChip('Desconto', `${value}%+`, 'discount')
    } else if (key === 'rating' && value > 0) {
      createFilterChip('Avaliacao', `${value}+ estrelas`, 'rating')
    } else if (key === 'cause' && value) {
      createFilterChip('Causa', getCauseName(value), 'cause')
    }
  })
  
  function createFilterChip(type: string, value: string, key: string): void {
    const chip = document.createElement('div')
    chip.className = 'filter-chip'
    chip.innerHTML = `
      <span>${type}: ${value}</span>
      <span class="filter-chip-remove" onclick="removeFilter('${key}')">
        <svg viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </span>
    `
    if (container) container.appendChild(chip)
  }
}

// Remove filter
(window as any).removeFilter = function(key: string): void {
  if (key === 'discount') {
    currentFilters.discount = 10
  } else if (key === 'rating') {
    currentFilters.rating = 0
  } else {
    (currentFilters as any)[key] = ''
  }
  updateActiveFiltersDisplay()
  applyFilters()
}

// Clear all filters
function clearAllFilters(): void {
  currentFilters = {
    searchTerm: '',
    category: '',
    location: '',
    distance: '',
    discount: 10,
    rating: 0,
    cause: ''
  }
  
  // Clear search inputs
  const mainSearch = document.getElementById('mainSearch') as HTMLInputElement
  if (mainSearch) mainSearch.value = ''
  
  updateActiveFiltersDisplay()
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

export {} 