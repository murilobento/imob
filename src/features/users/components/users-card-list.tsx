import { format } from 'date-fns'
import { type Table } from '@tanstack/react-table'
import { ptBR } from 'date-fns/locale'
import { Trash2, UserPen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

type UsersCardListProps = {
  table: Table<User>
}

export function UsersCardList({ table }: UsersCardListProps) {
  const { setOpen, setCurrentRow } = useUsers()
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
        const user = row.original
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
                  <span className='truncate font-medium'>{user.name}</span>
                  <Badge
                    variant='outline'
                    className={cn(
                      'shrink-0 text-xs capitalize',
                      user.status === 'active'
                        ? 'border-teal-200 bg-teal-100/30 text-teal-900 dark:text-teal-200'
                        : 'border-neutral-300 bg-neutral-300/40'
                    )}
                  >
                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <p className='text-muted-foreground truncate text-sm'>
                  {user.email}
                </p>
                <p className='text-muted-foreground mt-1 text-xs'>
                  {format(user.createdAt, 'PPP', { locale: ptBR })}
                </p>
              </div>
              <div className='flex shrink-0 gap-1'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => {
                    setCurrentRow(user)
                    setOpen('edit')
                  }}
                >
                  <UserPen size={16} />
                  <span className='sr-only'>Editar</span>
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-red-500 hover:text-red-600'
                  onClick={() => {
                    setCurrentRow(user)
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
