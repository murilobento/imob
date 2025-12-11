import { useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Filter } from 'lucide-react'
import { formatCurrency } from '@/lib/masks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import {
  realEstateFinalities,
  realEstateStatuses,
  realEstateTypes,
} from '../data/data'

interface RealEstateTableToolbarProps<TData> {
  table: Table<TData>
}

export function RealEstateTableToolbar<TData>({
  table,
}: RealEstateTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  // Price Filter State
  // We'll manage local state for the slider and apply it to the table on change
  // Default range 0 to 5M maybe? Or dynamic? Let's go static 0-2M for now or 0-10M.
  const [priceRange, setPriceRange] = useState([0, 20000000])

  // Apply price filter to 'sale_value' column
  // NOTE: This requires a custom filter function on the column or handling it here.
  // For simplicity, we'll try to set a filter value on 'sale_value'.
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    table.getColumn('sale_value')?.setFilterValue(value)
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filtrar imóveis...'
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className='h-8 w-full sm:w-[150px] lg:w-[250px]'
        />

        <div className='flex w-full flex-wrap gap-2 sm:w-auto'>
          {table.getColumn('type') && (
            <DataTableFacetedFilter
              column={table.getColumn('type')}
              title='Tipo'
              options={realEstateTypes}
            />
          )}
          {table.getColumn('finality') && (
            <DataTableFacetedFilter
              column={table.getColumn('finality')}
              title='Finalidade'
              options={realEstateFinalities}
            />
          )}
          {table.getColumn('is_available') && (
            <DataTableFacetedFilter
              column={table.getColumn('is_available')}
              title='Status'
              options={realEstateStatuses}
            />
          )}

          {/* Price Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 border-dashed'>
                <Filter className='mr-2 h-4 w-4' />
                Faixa de Valor
                {isFiltered && (
                  <Badge
                    variant='secondary'
                    className='ml-2 rounded-sm px-1 font-normal lg:hidden'
                  >
                    1
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[300px] max-w-[90vw] p-4' align='end'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <h4 className='leading-none font-medium'>
                    Faixa de Preço (Venda)
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    Filtrar por valor de venda.
                  </p>
                </div>
                <div className='pt-2'>
                  <Slider
                    defaultValue={[0, 20000000]}
                    max={20000000}
                    step={10000}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className='py-4'
                  />
                  <div className='mt-2 flex items-center justify-between'>
                    <span className='rounded border px-2 py-1 text-xs'>
                      {formatCurrency(priceRange[0])}
                    </span>
                    <span className='rounded border px-2 py-1 text-xs'>
                      {formatCurrency(priceRange[1])}
                    </span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {isFiltered && (
            <Button
              variant='ghost'
              onClick={() => {
                table.resetColumnFilters()
                table.setGlobalFilter('')
                setPriceRange([0, 2000000])
              }}
              className='h-8 px-2 lg:px-3'
            >
              Limpar
              <Cross2Icon className='ms-2 h-4 w-4' />
            </Button>
          )}
        </div>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
