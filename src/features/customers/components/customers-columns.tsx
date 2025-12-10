import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Customer } from '../data/schema'
import { DataTableRowActions } from './customers-row-actions'

export const customersColumns: ColumnDef<Customer>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Selecionar todos'
                className='translate-y-[2px]'
            />
        ),
        meta: {
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
        },
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Selecionar linha'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nome' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36 ps-3'>{row.getValue('name')}</LongText>
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Tipo' />
        ),
        cell: ({ row }) => {
            const type = row.getValue('type') as string
            return (
                <Badge variant='outline'>
                    {type === 'FISICA' ? 'PF' : 'PJ'}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return (
                <Badge
                    variant='outline'
                    className={cn(
                        'capitalize',
                        status === 'active'
                            ? 'border-teal-200 bg-teal-100/30 text-teal-900 dark:text-teal-200'
                            : 'border-neutral-300 bg-neutral-300/40 text-neutral-600'
                    )}
                >
                    {status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Email' />
        ),
        cell: ({ row }) => (
            <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
        ),
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Telefone' />
        ),
        cell: ({ row }) => (
            <div className='w-fit ps-2 text-nowrap'>{row.getValue('phone')}</div>
        ),
    },
    {
        accessorKey: 'city',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Cidade' />
        ),
        cell: ({ row }) => (
            <div className='w-fit ps-2 text-nowrap'>{row.getValue('city')}</div>
        )
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
