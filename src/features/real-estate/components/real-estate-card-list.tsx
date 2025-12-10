import { type Table } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type RealEstate } from '../data/schema'
import { useRealEstate } from './real-estate-provider'
import { formatCurrency } from '@/lib/masks'

type RealEstateCardListProps = {
    table: Table<RealEstate>
}

export function RealEstateCardList({ table }: RealEstateCardListProps) {
    const { setOpen, setCurrentRow } = useRealEstate()
    const rows = table.getRowModel().rows

    if (!rows.length) {
        return (
            <div className='text-muted-foreground flex items-center justify-center py-10'>
                Nenhum imóvel encontrado.
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-3'>
            {rows.map((row) => {
                const realEstate = row.original

                // Mappings (duplicated from columns to avoid export issues, or simplest way)
                // Ideally we use same map, but for now specific renders
                const typeMap: Record<string, string> = {
                    'HOUSE': 'Casa',
                    'APARTMENT': 'Apto',
                    'LAND': 'Terreno',
                    'COMMERCIAL': 'Coml',
                    'RURAL': 'Rural'
                }
                const finalityMap: Record<string, string> = {
                    'SALE': 'Venda',
                    'RENT': 'Locação',
                    'BOTH': 'Ambos'
                }

                return (
                    <div
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className={cn(
                            'bg-card rounded-lg border p-3 shadow-sm',
                            'data-[state=selected]:bg-muted'
                        )}
                    >
                        <div className='flex items-start gap-3'>
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                                aria-label='Selecionar linha'
                                className='mt-1'
                            />
                            <div className='min-w-0 flex-1 space-y-2'>
                                {/* Header: Code + Title */}
                                <div className='flex items-center justify-between gap-2'>
                                    <div className='flex flex-col overflow-hidden'>
                                        <span className='text-xs text-muted-foreground'>{realEstate.code || '-'}</span>
                                        <span className='truncate font-medium leading-tight'>{realEstate.title}</span>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className='flex flex-wrap gap-1'>
                                    <Badge variant='outline' className='text-xs whitespace-nowrap'>
                                        {typeMap[realEstate.type] || realEstate.type}
                                    </Badge>
                                    <Badge variant='outline' className='text-xs whitespace-nowrap'>
                                        {finalityMap[realEstate.finality] || realEstate.finality}
                                    </Badge>
                                    <Badge
                                        variant='outline'
                                        className={cn(
                                            'text-xs capitalize whitespace-nowrap',
                                            realEstate.is_available
                                                ? 'border-teal-200 bg-teal-100/30 text-teal-900 dark:text-teal-200'
                                                : 'border-neutral-300 bg-neutral-300/40 text-neutral-600'
                                        )}
                                    >
                                        {realEstate.is_available ? 'Disponível' : 'Indisponível'}
                                    </Badge>
                                </div>

                                {/* Values */}
                                <div className='grid grid-cols-2 gap-2 text-sm'>
                                    {(realEstate.finality === 'SALE' || realEstate.finality === 'BOTH') && (
                                        <div className='flex flex-col'>
                                            <span className='text-[10px] text-muted-foreground'>Venda</span>
                                            <span className='font-medium'>{realEstate.sale_value ? formatCurrency(realEstate.sale_value) : '-'}</span>
                                        </div>
                                    )}
                                    {(realEstate.finality === 'RENT' || realEstate.finality === 'BOTH') && (
                                        <div className='flex flex-col'>
                                            <span className='text-[10px] text-muted-foreground'>Locação</span>
                                            <span className='font-medium'>{realEstate.rental_value ? formatCurrency(realEstate.rental_value) : '-'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='flex flex-col gap-1'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => {
                                        setCurrentRow(realEstate)
                                        setOpen('edit')
                                    }}
                                >
                                    <Edit size={16} />
                                    <span className='sr-only'>Editar</span>
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 text-red-500 hover:text-red-600'
                                    onClick={() => {
                                        setCurrentRow(realEstate)
                                        setOpen('delete')
                                    }}
                                >
                                    <Trash2 size={16} />
                                    <span className='sr-only'>Excluir</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
