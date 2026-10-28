export interface PageResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  searchTerm?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
