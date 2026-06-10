"use client"
import { SearchIcon } from "lucide-react"

interface SearchFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filters?: Array<{
    key: string
    label: string
    active: boolean
    onClick: () => void
  }>
  placeholder?: string
  className?: string
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  filters = [],
  placeholder = "Search...",
  className = "",
}: SearchFilterProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
          />
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={filter.onClick}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter.active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
