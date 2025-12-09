'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteUsers } from '../api/users-api'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { onSuccess } = useUsers()

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Por favor digite "${CONFIRM_WORD}" para confirmar.`)
      return
    }

    setIsLoading(true)
    try {
      const ids = selectedRows.map((row) => (row.original as User).id)
      await deleteUsers(ids)
      toast.success(`Excluído(s) ${selectedRows.length} ${selectedRows.length > 1 ? 'usuários' : 'usuário'}`)
      table.resetRowSelection()
      setValue('')
      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error('Falha ao excluir usuários')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || isLoading}
      title={
        <span className='text-destructive'>
          {isLoading ? (
            <Loader2 className='me-1 inline-block animate-spin' size={18} />
          ) : (
            <AlertTriangle className='stroke-destructive me-1 inline-block' size={18} />
          )}
          Excluir {selectedRows.length} {selectedRows.length > 1 ? 'usuários' : 'usuário'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Tem certeza que deseja excluir os usuários selecionados? <br />
            Esta ação não pode ser desfeita.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>Confirme digitando "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Digite "${CONFIRM_WORD}" para confirmar.`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              Por favor, tenha cuidado, esta operação não pode ser revertida.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Excluir'
      destructive
    />
  )
}
