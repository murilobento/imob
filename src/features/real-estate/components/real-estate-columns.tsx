import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type RealEstate } from '../data/schema'
import { DataTableRowActions } from './real-estate-row-actions'
import { formatCurrency } from '@/lib/masks'

export const columns: ColumnDef<RealEstate>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'code',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Ref/Cód' />
        ),
        cell: ({ row }) => <div className='w-[80px]'>{row.getValue('code') || '-'}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Título' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-[300px] truncate font-medium'>
                        {row.getValue('title')}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Tipo' />
        ),
        cell: ({ row }) => {
            const type = row.getValue('type') as string
            const map: Record<string, string> = {
                'HOUSE': 'Casa',
                'APARTMENT': 'Apto',
                'LAND': 'Terreno',
                'COMMERCIAL': 'Comercial',
                'RURAL': 'Rural'
            }
            return (
                <div className='flex items-center'>
                    <span>{map[type] || type}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'finality',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Finalidade' />
        ),
        cell: ({ row }) => {
            const val = row.getValue('finality') as string
            const map: Record<string, string> = {
                'SALE': 'Venda',
                'RENT': 'Locação',
                'BOTH': 'Ambos'
            }
            return <Badge variant='outline'>{map[val] || val}</Badge>
        },
    },
    {
        accessorKey: 'situation',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Situação' />
        ),
        cell: ({ row }) => {
            const val = row.getValue('situation') as string
            const map: Record<string, string> = {
                'AVAILABLE': 'Disponível',
                'OCCUPIED': 'Ocupado',
                'UNAVAILABLE': 'Indisp.'
            }
            return <span>{map[val] || val}</span>
        }
    },
    {
        accessorKey: 'sale_value',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Venda' />
        ),
        cell: ({ row }) => {
            const val = row.getValue('sale_value') as number
            return val ? <div>{formatCurrency(val)}</div> : <div>-</div>
        }
    },
    {
        accessorKey: 'rental_value',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Locação' />
        ),
        cell: ({ row }) => {
            const val = row.getValue('rental_value') as number
            return val ? <div>{formatCurrency(val)}</div> : <div>-</div>
        }
    },
    {
        accessorKey: 'is_available',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Ativo' />
        ),
        cell: ({ row }) => {
            const active = row.getValue('is_available')
            return active ? <Badge>Sim</Badge> : <Badge variant='destructive'>Não</Badge>
        }
    },
    {
        accessorKey: 'owner_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Proprietário' />
        ),
        cell: ({ row }) => <div className="truncate max-w-[150px]">{row.getValue('owner_name') || '-'}</div>
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
