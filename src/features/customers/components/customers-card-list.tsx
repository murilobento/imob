import { type Table } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type Customer } from '../data/schema'
import { useCustomers } from './customers-provider'

type CustomersCardListProps = {
    table: Table<Customer>
}

export function CustomersCardList({ table }: CustomersCardListProps) {
    const { setOpen, setCurrentRow } = useCustomers()
    const rows = table.getRowModel().rows

    if (!rows.length) {
        return (
            <div className='text-muted-foreground flex items-center justify-center py-10'>
                Nenhum resultado encontrado.
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-3'>
            {rows.map((row) => {
                const customer = row.original
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
                            <div className='min-w-0 flex-1'>
                                <div className='flex items-center justify-between gap-2'>
                                    <span className='truncate font-medium'>{customer.name}</span>
                                    <div className='flex shrink-0 gap-1'>
                                        <Badge
                                            variant='outline'
                                            className={cn(
                                                'text-xs capitalize',
                                                customer.type === 'FISICA'
                                                    ? 'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200'
                                                    : 'border-purple-200 bg-purple-100/30 text-purple-900 dark:text-purple-200'
                                            )}
                                        >
                                            {customer.type === 'FISICA' ? 'Física' : 'Jurídica'}
                                        </Badge>
                                        <Badge
                                            variant='outline'
                                            className={cn(
                                                'text-xs capitalize',
                                                customer.status === 'active'
                                                    ? 'border-teal-200 bg-teal-100/30 text-teal-900 dark:text-teal-200'
                                                    : 'border-neutral-300 bg-neutral-300/40'
                                            )}
                                        >
                                            {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </div>
                                </div>
                                {customer.phone && (
                                    <p className='text-muted-foreground truncate text-sm'>
                                        {customer.phone}
                                    </p>
                                )}
                                {customer.email && (
                                    <p className='text-muted-foreground truncate text-sm'>
                                        {customer.email}
                                    </p>
                                )}
                            </div>
                            <div className='flex shrink-0 gap-1'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => {
                                        setCurrentRow(customer)
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
                                        setCurrentRow(customer)
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
