// Type definitions for the application

export interface Offer {
  id: number
  businessName: string
  category: string
  location: string
  distance: number
  discount: number
  rating: number
  cause: string
  description: string
  image: string
  badgeColor: string
}

export interface Gift {
  id: number
  businessName: string
  category: string
  location: string
  distance: number
  requirement: string
  requirementValue: number
  rating: number
  cause: string
  description: string
  image: string
  badgeColor: string
  giftType: string
}

export interface SearchFilters {
  searchTerm: string
  category: string
  location: string
  distance: string
  discount?: number
  requirement?: number
  rating: number
  cause: string
}

export type SortOption = 'relevance' | 'discount' | 'rating' | 'distance' | 'newest' | 'requirement'

export interface FilterOption {
  value: string
  label: string
  icon?: string
} 