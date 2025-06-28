// Utility functions

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function generateStars(rating: number): string {
  let stars = ''
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<span class="star filled">★</span>'
    } else {
      stars += '<span class="star">★</span>'
    }
  }
  return stars
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    restaurantes: '<svg viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z"/></svg>',
    moda: '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77z"/></svg>',
    beleza: '<svg viewBox="0 0 24 24"><path d="M9 11H7v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9h-2z"/></svg>',
    fitness: '<svg viewBox="0 0 24 24"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>',
    educacao: '<svg viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>',
    mercados: '<svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2z"/></svg>',
    servicos: '<svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2z"/></svg>'
  }
  return icons[category] || icons.restaurantes
}

export function getCauseName(cause: string): string {
  const causes: Record<string, string> = {
    'lar-idosos': 'Lar dos Idosos',
    'esporte-todos': 'Esporte para Todos',
    'casa-abrigo': 'Casa Abrigo',
    'verde-vida': 'Verde Vida',
    'educacao-todos': 'Educacao para Todos',
    'protecao-animal': 'Protecao Animal'
  }
  return causes[cause] || cause
}

export function getCategoryName(category: string): string {
  const categories: Record<string, string> = {
    'restaurantes': 'Restaurantes',
    'moda': 'Moda',
    'beleza': 'Beleza',
    'fitness': 'Fitness',
    'educacao': 'Educacao',
    'mercados': 'Mercados',
    'servicos': 'Servicos'
  }
  return categories[category] || category
}

export function getLocationName(location: string): string {
  const locations: Record<string, string> = {
    'centro': 'Centro',
    'zona-norte': 'Zona Norte',
    'zona-sul': 'Zona Sul',
    'zona-leste': 'Zona Leste',
    'zona-oeste': 'Zona Oeste'
  }
  return locations[location] || location
} 