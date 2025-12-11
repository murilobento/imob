import { Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { propertyTypeLabels, type PropertyFilters } from '../types'

interface SearchFiltersProps {
  filters: PropertyFilters
  onFiltersChange: (filters: PropertyFilters) => void
  className?: string
}

const propertyTypes = [
  'HOUSE',
  'APARTMENT',
  'LAND',
  'COMMERCIAL',
  'RURAL',
] as const
const bedroomOptions = [1, 2, 3, 4] as const

export function SearchFilters({
  filters,
  onFiltersChange,
  className,
}: SearchFiltersProps) {
  const updateFilter = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ''
  )

  return (
    <div className={cn('rounded-xl bg-white p-6 shadow-sm', className)}>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-2 text-[#1e3a5f]'>
          <SlidersHorizontal className='h-5 w-5' />
          <span className='font-semibold'>Filtros</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='text-sm text-gray-500 hover:text-gray-700'
          >
            Limpar
          </button>
        )}
      </div>

      {/* Search */}
      <div className='relative mb-6'>
        <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
        <input
          type='text'
          placeholder='Código ou palavra-chave'
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value || undefined)}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] focus:outline-none'
        />
      </div>

      {/* Finality */}
      <div className='mb-6'>
        <label className='mb-2 block text-xs font-semibold tracking-wide text-gray-500 uppercase'>
          Finalidade
        </label>
        <div className='flex gap-2'>
          <button
            onClick={() =>
              updateFilter(
                'finality',
                filters.finality === 'SALE' ? undefined : 'SALE'
              )
            }
            className={cn(
              'flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              filters.finality === 'SALE'
                ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            )}
          >
            Comprar
          </button>
          <button
            onClick={() =>
              updateFilter(
                'finality',
                filters.finality === 'RENT' ? undefined : 'RENT'
              )
            }
            className={cn(
              'flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              filters.finality === 'RENT'
                ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            )}
          >
            Alugar
          </button>
        </div>
      </div>

      {/* Property Type */}
      <div className='mb-6'>
        <label className='mb-2 block text-xs font-semibold tracking-wide text-gray-500 uppercase'>
          Tipo de imóvel
        </label>
        <div className='space-y-2'>
          {propertyTypes.map((type) => (
            <label
              key={type}
              className='flex cursor-pointer items-center gap-3'
            >
              <input
                type='checkbox'
                checked={filters.type === type}
                onChange={() =>
                  updateFilter('type', filters.type === type ? undefined : type)
                }
                className='h-4 w-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#3b82f6]'
              />
              <span className='text-sm text-gray-700'>
                {propertyTypeLabels[type]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className='mb-6'>
        <label className='mb-2 block text-xs font-semibold tracking-wide text-gray-500 uppercase'>
          Quartos
        </label>
        <div className='flex gap-2'>
          {bedroomOptions.map((num) => (
            <button
              key={num}
              onClick={() =>
                updateFilter(
                  'bedrooms',
                  filters.bedrooms === num ? undefined : num
                )
              }
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
                filters.bedrooms === num
                  ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              )}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className='mb-6'>
        <label className='mb-2 block text-xs font-semibold tracking-wide text-gray-500 uppercase'>
          Valor (R$)
        </label>
        <div className='flex gap-2'>
          <input
            type='number'
            placeholder='Mínimo'
            value={filters.minPrice || ''}
            onChange={(e) =>
              updateFilter(
                'minPrice',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className='w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] focus:outline-none'
          />
          <input
            type='number'
            placeholder='Máximo'
            value={filters.maxPrice || ''}
            onChange={(e) =>
              updateFilter(
                'maxPrice',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className='w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] focus:outline-none'
          />
        </div>
      </div>

      {/* Apply Button */}
      <Button className='w-full bg-[#1e3a5f] hover:bg-[#152a45]'>
        Aplicar Filtros
      </Button>
    </div>
  )
}
