// Search Gifts Page JavaScript

// Sample gifts data
const sampleGifts = [
  {
    id: 1,
    businessName: "Restaurante Sabor Local",
    category: "restaurantes",
    location: "Centro",
    distance: 2.5,
    requirement: "Compra mínima R$ 50",
    requirementValue: 50,
    rating: 4.5,
    cause: "lar-idosos",
    description: "Brinde especial: Sobremesa grátis em compras acima de R$ 50.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
    badgeColor: "green",
    giftType: "Sobremesa grátis"
  },
  {
    id: 2,
    businessName: "Academia Vida Ativa",
    category: "fitness",
    location: "Zona Norte",
    distance: 1.8,
    requirement: "Matrícula anual",
    requirementValue: 500,
    rating: 4.0,
    cause: "esporte-todos",
    description: "Brinde: Kit academia completo na matrícula anual.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
    badgeColor: "blue",
    giftType: "Kit academia"
  },
  {
    id: 3,
    businessName: "Beleza Natural Spa",
    category: "beleza",
    location: "Zona Sul",
    distance: 3.2,
    requirement: "Pacote de 3 sessões",
    requirementValue: 150,
    rating: 4.8,
    cause: "casa-abrigo",
    description: "Brinde: Tratamento facial grátis no pacote de 3 sessões.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
    badgeColor: "purple",
    giftType: "Tratamento facial"
  },
  {
    id: 4,
    businessName: "Moda & Estilo",
    category: "moda",
    location: "Centro",
    distance: 0.8,
    requirement: "Compra acima R$ 200",
    requirementValue: 200,
    rating: 4.7,
    cause: "esporte-todos",
    description: "Brinde: Acessório exclusivo em compras acima de R$ 200.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
    badgeColor: "pink",
    giftType: "Acessório exclusivo"
  },
  {
    id: 5,
    businessName: "Supermercado Economia",
    category: "mercados",
    location: "Zona Norte",
    distance: 1.2,
    requirement: "Compra mínima R$ 100",
    requirementValue: 100,
    rating: 4.2,
    cause: "verde-vida",
    description: "Brinde: Sacola ecológica personalizada em compras acima de R$ 100.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
    badgeColor: "green",
    giftType: "Sacola ecológica"
  },
  {
    id: 6,
    businessName: "Livraria Conhecimento",
    category: "educacao",
    location: "Centro",
    distance: 1.5,
    requirement: "Compra de 2 livros",
    requirementValue: 80,
    rating: 4.6,
    cause: "educacao-todos",
    description: "Brinde: Marcador de livro exclusivo na compra de 2 livros.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
    badgeColor: "blue",
    giftType: "Marcador exclusivo"
  },
  {
    id: 7,
    businessName: "Café Aroma",
    category: "restaurantes",
    location: "Zona Sul",
    distance: 2.1,
    requirement: "Fidelidade: 10 cafés",
    requirementValue: 50,
    rating: 4.4,
    cause: "lar-idosos",
    description: "Brinde: 11º café grátis no cartão fidelidade.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
    badgeColor: "orange",
    giftType: "Café grátis"
  },
  {
    id: 8,
    businessName: "Petshop Amigos",
    category: "servicos",
    location: "Zona Leste",
    distance: 3.5,
    requirement: "Banho e tosa",
    requirementValue: 60,
    rating: 4.3,
    cause: "protecao-animal",
    description: "Brinde: Brinquedo para pet no serviço de banho e tosa.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
    badgeColor: "green",
    giftType: "Brinquedo pet"
  }
];

// Search state
let currentFilters = {
  searchTerm: '',
  category: '',
  location: '',
  distance: '',
  requirement: 10,
  rating: 0,
  cause: ''
};

let currentSort = 'relevance';
let currentPage = 1;
let itemsPerPage = 6;

// Initialize search page
document.addEventListener('DOMContentLoaded', () => {
  initializeSearchPage();
});

function initializeSearchPage() {
  initializeFilters();
  initializeSearch();
  initializeSort();
  loadURLParameters();
  loadInitialResults();
  console.log('Search gifts page loaded successfully!');
}

// Load search parameters from URL
function loadURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('q');
  
  if (searchQuery) {
    const mainSearch = document.getElementById('mainSearch');
    const headerSearch = document.getElementById('headerSearch');
    
    if (mainSearch) {
      mainSearch.value = searchQuery;
      currentFilters.searchTerm = searchQuery.toLowerCase();
    }
    
    if (headerSearch) {
      headerSearch.value = searchQuery;
    }
  }
}

// Initialize modern filters
function initializeFilters() {
  const addFilterBtn = document.getElementById('addFilterBtn');
  const filterDropdown = document.getElementById('filterDropdown');
  const commandInput = document.getElementById('commandInput');
  const clearAllBtn = document.getElementById('clearAllBtn');
  
  let isDropdownOpen = false;
  let selectedFilterType = null;
  
  // Toggle dropdown
  addFilterBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFilterDropdown();
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!document.getElementById('filterPopover').contains(e.target)) {
      closeFilterDropdown();
    }
  });
  
  // Command input search
  commandInput?.addEventListener('input', (e) => {
    filterCommandItems(e.target.value);
  });
  
  // Clear all filters
  clearAllBtn?.addEventListener('click', clearAllFilters);
  
  // Initialize filter type selection
  initializeFilterTypeSelection();
  
  function toggleFilterDropdown() {
    if (isDropdownOpen) {
      closeFilterDropdown();
    } else {
      openFilterDropdown();
    }
  }
  
  function openFilterDropdown() {
    isDropdownOpen = true;
    filterDropdown.classList.add('open');
    addFilterBtn.classList.add('active');
    commandInput.focus();
    resetToFilterTypeSelection();
  }
  
  function closeFilterDropdown() {
    isDropdownOpen = false;
    filterDropdown.classList.remove('open');
    addFilterBtn.classList.remove('active');
    selectedFilterType = null;
    commandInput.value = '';
    resetToFilterTypeSelection();
  }
  
  function resetToFilterTypeSelection() {
    selectedFilterType = null;
    document.getElementById('filterTypeGroup').style.display = 'block';
    document.getElementById('filterValueGroup').style.display = 'none';
    commandInput.placeholder = 'Buscar filtros...';
  }
  
  function filterCommandItems(searchTerm) {
    const items = document.querySelectorAll('.command-item');
    const lowerSearch = searchTerm.toLowerCase();
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(lowerSearch)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }
}

// Initialize search
function initializeSearch() {
  const mainSearch = document.getElementById('mainSearch');
  const searchBtn = document.querySelector('.search-btn');
  
  mainSearch?.addEventListener('input', debounce((e) => {
    currentFilters.searchTerm = e.target.value.toLowerCase();
    applyFilters();
  }, 300));
  
  searchBtn?.addEventListener('click', applyFilters);
  
  mainSearch?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyFilters();
  });
}

// Initialize sort
function initializeSort() {
  const sortSelect = document.getElementById('sortSelect');
  sortSelect?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFilters();
  });
}

// Apply filters
function applyFilters() {
  const filtered = filterGifts(sampleGifts);
  const sorted = sortGifts(filtered);
  const paginated = paginateGifts(sorted);
  
  updateResultsCount(filtered.length);
  renderGifts(paginated);
  updateLoadMoreButton(filtered.length);
}

// Filter gifts
function filterGifts(gifts) {
  return gifts.filter(gift => {
    if (currentFilters.searchTerm && 
        !gift.businessName.toLowerCase().includes(currentFilters.searchTerm) &&
        !gift.description.toLowerCase().includes(currentFilters.searchTerm) &&
        !gift.giftType.toLowerCase().includes(currentFilters.searchTerm)) {
      return false;
    }
    if (currentFilters.category && gift.category !== currentFilters.category) return false;
    if (currentFilters.location && gift.location !== currentFilters.location) return false;
    if (currentFilters.distance && gift.distance > parseInt(currentFilters.distance)) return false;
    if (gift.requirementValue > currentFilters.requirement * 10) return false; // Requirement filter logic
    if (gift.rating < currentFilters.rating) return false;
    if (currentFilters.cause && gift.cause !== currentFilters.cause) return false;
    return true;
  });
}

// Sort gifts
function sortGifts(gifts) {
  const sorted = [...gifts];
  switch(currentSort) {
    case 'requirement': return sorted.sort((a, b) => a.requirementValue - b.requirementValue);
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
    case 'distance': return sorted.sort((a, b) => a.distance - b.distance);
    case 'newest': return sorted.sort((a, b) => b.id - a.id);
    default: return sorted;
  }
}

// Paginate gifts
function paginateGifts(gifts) {
  return gifts.slice(0, currentPage * itemsPerPage);
}

// Render gifts
function renderGifts(gifts) {
  const grid = document.getElementById('resultsGrid');
  if (!grid) return;
  
  if (gifts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 64px 32px; color: #6B7280;">
        <h3>Nenhum brinde encontrado</h3>
        <p>Tente ajustar seus filtros de busca.</p>
      </div>
    `;
    return;
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
  `).join('');
}

// Handle gift claim
function handleGiftClaim(button) {
  const original = button.innerHTML;
  button.innerHTML = '<span>Processando...</span>';
  button.disabled = true;
  
  setTimeout(() => {
    button.innerHTML = '<span>Brinde Resgatado!</span>';
    button.style.background = '#22C55E';
    
    setTimeout(() => {
      button.innerHTML = original;
      button.style.background = '#10B981';
      button.disabled = false;
    }, 2000);
  }, 1000);
}

// Update results count
function updateResultsCount(count) {
  const element = document.getElementById('resultsCount');
  if (element) {
    element.innerHTML = `Encontramos <strong>${count} brinde${count !== 1 ? 's' : ''}</strong> para você`;
  }
}

// Update load more button
function updateLoadMoreButton(total) {
  const btn = document.getElementById('loadMoreBtn');
  const showing = currentPage * itemsPerPage;
  
  if (showing >= total) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'inline-flex';
    btn.onclick = () => {
      currentPage++;
      applyFilters();
    };
  }
}

// Initialize filter type selection
function initializeFilterTypeSelection() {
  const filterTypeItems = document.querySelectorAll('[data-filter-type]');
  
  filterTypeItems.forEach(item => {
    item.addEventListener('click', () => {
      const filterType = item.dataset.filterType;
      showFilterValueOptions(filterType);
    });
  });
}

// Show filter value options
function showFilterValueOptions(filterType) {
  const filterTypeGroup = document.getElementById('filterTypeGroup');
  const filterValueGroup = document.getElementById('filterValueGroup');
  const valueGroupLabel = document.getElementById('valueGroupLabel');
  const filterValueOptions = document.getElementById('filterValueOptions');
  const commandInput = document.getElementById('commandInput');
  
  filterTypeGroup.style.display = 'none';
  filterValueGroup.style.display = 'block';
  
  // Set label and placeholder
  const filterLabels = {
    category: 'Selecionar Categoria',
    location: 'Selecionar Localização',
    distance: 'Selecionar Distância',
    requirement: 'Selecionar Requisito',
    rating: 'Selecionar Avaliação',
    cause: 'Selecionar Causa Social'
  };
  
  valueGroupLabel.textContent = filterLabels[filterType];
  commandInput.placeholder = `Buscar ${filterLabels[filterType].toLowerCase()}...`;
  
  // Generate options based on filter type
  const options = getFilterOptions(filterType);
  filterValueOptions.innerHTML = '';
  
  // Add back button
  const backButton = document.createElement('div');
  backButton.className = 'command-back';
  backButton.innerHTML = `
    <svg class="command-back-icon" viewBox="0 0 24 24">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
    <span>Voltar</span>
  `;
  backButton.addEventListener('click', resetToFilterTypeSelection);
  filterValueOptions.appendChild(backButton);
  
  // Add options
  if (filterType === 'requirement') {
    addRequirementRangeOption(filterValueOptions);
  } else if (filterType === 'rating') {
    addRatingOptions(filterValueOptions);
  } else {
    options.forEach(option => {
      const item = document.createElement('div');
      item.className = 'command-item';
      item.innerHTML = `
        <span class="command-icon">${option.icon || ''}</span>
        <span>${option.label}</span>
      `;
      item.addEventListener('click', () => {
        addFilter(filterType, option.value, option.label);
        closeFilterDropdown();
      });
      filterValueOptions.appendChild(item);
    });
  }
  
  function resetToFilterTypeSelection() {
    filterTypeGroup.style.display = 'block';
    filterValueGroup.style.display = 'none';
    commandInput.placeholder = 'Buscar filtros...';
    commandInput.value = '';
  }
  
  function closeFilterDropdown() {
    const dropdown = document.getElementById('filterDropdown');
    const addBtn = document.getElementById('addFilterBtn');
    dropdown.classList.remove('open');
    addBtn.classList.remove('active');
    resetToFilterTypeSelection();
  }
}

// Get filter options for each type
function getFilterOptions(filterType) {
  const options = {
    category: [
      { value: 'restaurantes', label: 'Restaurantes', icon: '<svg viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z"/></svg>' },
      { value: 'moda', label: 'Moda', icon: '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77z"/></svg>' },
      { value: 'beleza', label: 'Beleza', icon: '<svg viewBox="0 0 24 24"><path d="M9 11H7v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9h-2z"/></svg>' },
      { value: 'fitness', label: 'Fitness', icon: '<svg viewBox="0 0 24 24"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>' },
      { value: 'educacao', label: 'Educação', icon: '<svg viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>' },
      { value: 'mercados', label: 'Mercados', icon: '<svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2z"/></svg>' },
      { value: 'servicos', label: 'Serviços', icon: '<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2z"/></svg>' }
    ],
    location: [
      { value: 'centro', label: 'Centro' },
      { value: 'zona-norte', label: 'Zona Norte' },
      { value: 'zona-sul', label: 'Zona Sul' },
      { value: 'zona-leste', label: 'Zona Leste' },
      { value: 'zona-oeste', label: 'Zona Oeste' }
    ],
    distance: [
      { value: '1', label: 'Até 1 km' },
      { value: '3', label: 'Até 3 km' },
      { value: '5', label: 'Até 5 km' },
      { value: '10', label: 'Até 10 km' }
    ],
    cause: [
      { value: 'lar-idosos', label: 'Lar dos Idosos' },
      { value: 'esporte-todos', label: 'Esporte para Todos' },
      { value: 'casa-abrigo', label: 'Casa Abrigo' },
      { value: 'verde-vida', label: 'Verde Vida' },
      { value: 'educacao-todos', label: 'Educação para Todos' },
      { value: 'protecao-animal', label: 'Proteção Animal' }
    ]
  };
  
  return options[filterType] || [];
}

// Add requirement range option
function addRequirementRangeOption(container) {
  const rangeContainer = document.createElement('div');
  rangeContainer.className = 'command-range';
  rangeContainer.innerHTML = `
    <div class="range-input-container">
      <div class="range-labels-inline">
        <span>Valor mínimo</span>
        <span>R$ 500+</span>
      </div>
      <input type="range" min="10" max="50" value="${currentFilters.requirement}" class="range-input" id="requirementRange">
      <div class="range-value">R$ ${currentFilters.requirement * 10}</div>
    </div>
  `;
  
  container.appendChild(rangeContainer);
  
  const rangeInput = rangeContainer.querySelector('#requirementRange');
  const rangeValue = rangeContainer.querySelector('.range-value');
  
  rangeInput.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    rangeValue.textContent = `R$ ${value * 10}`;
    currentFilters.requirement = value;
    applyFilters();
  });
}

// Add rating options
function addRatingOptions(container) {
  for (let i = 1; i <= 5; i++) {
    const item = document.createElement('div');
    item.className = 'command-item';
    item.innerHTML = `
      <span class="command-icon">
        <svg viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </span>
      <span>${i}+ estrela${i > 1 ? 's' : ''}</span>
    `;
    item.addEventListener('click', () => {
      addFilter('rating', i, `${i}+ estrela${i > 1 ? 's' : ''}`);
      closeFilterDropdown();
    });
    container.appendChild(item);
  }
}

// Add filter
function addFilter(type, value, label) {
  currentFilters[type] = value;
  updateActiveFiltersDisplay();
  applyFilters();
}

// Update active filters display
function updateActiveFiltersDisplay() {
  const container = document.getElementById('activeFiltersChips');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const addFilterBtn = document.getElementById('addFilterBtn');
  const activeFiltersRow = document.querySelector('.active-filters-row');
  
  if (!container) return;
  
  // Clear existing chips
  container.innerHTML = '';
  
  // Check if there are any active filters
  const hasActiveFilters = Object.entries(currentFilters).some(([key, value]) => {
    if (key === 'searchTerm') return value.length > 0;
    if (key === 'requirement') return value > 10;
    if (key === 'rating') return value > 0;
    return value !== '';
  });
  
  if (!hasActiveFilters) {
    clearAllBtn.style.display = 'none';
    addFilterBtn.classList.remove('has-filters');
    activeFiltersRow.classList.remove('has-filters');
    return;
  }
  
  // Show clear all button and update filter button
  clearAllBtn.style.display = 'inline-flex';
  addFilterBtn.classList.add('has-filters');
  activeFiltersRow.classList.add('has-filters');
  
  // Create filter chips
  Object.entries(currentFilters).forEach(([key, value]) => {
    if (key === 'searchTerm' && value.length > 0) {
      createFilterChip('Busca', `"${value}"`, 'searchTerm');
    } else if (key === 'category' && value) {
      createFilterChip('Categoria', getCategoryName(value), 'category');
    } else if (key === 'location' && value) {
      createFilterChip('Local', getLocationName(value), 'location');
    } else if (key === 'distance' && value) {
      createFilterChip('Distância', `Até ${value}km`, 'distance');
    } else if (key === 'requirement' && value > 10) {
      createFilterChip('Requisito', `Até R$ ${value * 10}`, 'requirement');
    } else if (key === 'rating' && value > 0) {
      createFilterChip('Avaliação', `${value}+ estrelas`, 'rating');
    } else if (key === 'cause' && value) {
      createFilterChip('Causa', getCauseName(value), 'cause');
    }
  });
  
  function createFilterChip(type, value, key) {
    const chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.innerHTML = `
      <span>${type}: ${value}</span>
      <span class="filter-chip-remove" onclick="removeFilter('${key}')">
        <svg viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </span>
    `;
    container.appendChild(chip);
  }
}

// Remove filter
function removeFilter(key) {
  if (key === 'requirement') {
    currentFilters[key] = 10;
  } else if (key === 'rating') {
    currentFilters[key] = 0;
  } else {
    currentFilters[key] = '';
  }
  updateActiveFiltersDisplay();
  applyFilters();
}

// Clear all filters
function clearAllFilters() {
  currentFilters = {
    searchTerm: '',
    category: '',
    location: '',
    distance: '',
    requirement: 10,
    rating: 0,
    cause: ''
  };
  
  // Clear search inputs
  const mainSearch = document.getElementById('mainSearch');
  if (mainSearch) mainSearch.value = '';
  
  updateActiveFiltersDisplay();
  applyFilters();
}

// Load initial results
function loadInitialResults() {
  applyFilters();
}

// Get category icon
function getCategoryIcon(category) {
  const icons = {
    restaurantes: '<svg viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z"/></svg>',
    moda: '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77z"/></svg>',
    beleza: '<svg viewBox="0 0 24 24"><path d="M9 11H7v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9h-2z"/></svg>',
    fitness: '<svg viewBox="0 0 24 24"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>',
    educacao: '<svg viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>',
    mercados: '<svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2z"/></svg>',
    servicos: '<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2z"/></svg>'
  };
  return icons[category] || icons.restaurantes;
}

// Get cause name
function getCauseName(cause) {
  const causes = {
    'lar-idosos': 'Lar dos Idosos',
    'esporte-todos': 'Esporte para Todos',
    'casa-abrigo': 'Casa Abrigo',
    'verde-vida': 'Verde Vida',
    'educacao-todos': 'Educação para Todos',
    'protecao-animal': 'Proteção Animal'
  };
  return causes[cause] || cause;
}

// Get category name
function getCategoryName(category) {
  const categories = {
    'restaurantes': 'Restaurantes',
    'moda': 'Moda',
    'beleza': 'Beleza',
    'fitness': 'Fitness',
    'educacao': 'Educação',
    'mercados': 'Mercados',
    'servicos': 'Serviços'
  };
  return categories[category] || category;
}

// Get location name
function getLocationName(location) {
  const locations = {
    'centro': 'Centro',
    'zona-norte': 'Zona Norte',
    'zona-sul': 'Zona Sul',
    'zona-leste': 'Zona Leste',
    'zona-oeste': 'Zona Oeste'
  };
  return locations[location] || location;
}

// Generate stars
function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<span class="star filled">★</span>';
    } else {
      stars += '<span class="star">★</span>';
    }
  }
  return stars;
}

// Debounce function
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

// Header search functionality
document.addEventListener('DOMContentLoaded', () => {
  const headerSearch = document.getElementById('headerSearch');
  const searchIcon = document.querySelector('.search-container .search-icon');
  
  // Handle search icon click
  searchIcon?.addEventListener('click', () => {
    const query = headerSearch?.value.trim();
    if (query) {
      window.location.href = `search-gifts.html?q=${encodeURIComponent(query)}`;
    }
  });
  
  // Handle enter key in header search
  headerSearch?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query) {
        window.location.href = `search-gifts.html?q=${encodeURIComponent(query)}`;
      }
    }
  });
}); 