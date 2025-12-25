"use client"

import { Search, Download, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  icon: string
  type: 'INCOME' | 'EXPENSE'
}

interface TransactionFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  filterType: 'ALL' | 'INCOME' | 'EXPENSE'
  onFilterTypeChange: (value: 'ALL' | 'INCOME' | 'EXPENSE') => void
  filterCategory: string
  onFilterCategoryChange: (value: string) => void
  categories: Category[]
  sortBy: 'date' | 'amount' | 'category'
  onSortChange: (value: 'date' | 'amount' | 'category') => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: () => void
  onExport: () => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterCategory,
  onFilterCategoryChange,
  categories,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  onExport,
  onClearFilters,
  hasActiveFilters,
}: TransactionFiltersProps) {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={onExport}
          className="h-10 px-4"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        {/* Type Filter */}
        <Select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as 'ALL' | 'INCOME' | 'EXPENSE')}
          className="h-10 w-36"
        >
          <option value="ALL">All Types</option>
          <option value="INCOME">Income Only</option>
          <option value="EXPENSE">Expense Only</option>
        </Select>

        {/* Category Filter */}
        <Select
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value)}
          className="h-10 flex-1 min-w-[150px]"
        >
          <option value="ALL">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </Select>

        {/* Sort By */}
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'date' | 'amount' | 'category')}
          className="h-10 w-36"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="category">Sort by Category</option>
        </Select>

        {/* Sort Order */}
        <Button
          variant="outline"
          onClick={onSortOrderChange}
          className="h-10 px-4"
        >
          {sortOrder === 'desc' ? '↓ Desc' : '↑ Asc'}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="h-10 px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

