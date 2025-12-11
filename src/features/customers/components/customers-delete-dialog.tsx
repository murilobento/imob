'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteCustomer } from '../api/customers-api'
import { type Customer } from '../data/schema'
import { useCustomers } from './customers-provider'

type CustomerDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Customer
}

export function CustomersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CustomerDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { onSuccess } = useCustomers()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) return

    setIsLoading(true)
    try {
      await deleteCustomer(currentRow.id)
      toast.success('Cliente excluído com sucesso')
      onOpenChange(false)
      setValue('')
      onSuccess()
    } catch {
      toast.error('Falha ao excluir cliente')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isLoading}
      title={
        <span className='text-destructive'>
          {isLoading ? (
            <Loader2 className='me-1 inline-block animate-spin' size={18} />
          ) : (
            <AlertTriangle
              className='stroke-destructive me-1 inline-block'
              size={18}
            />
          )}
          Excluir Cliente
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Tem certeza que deseja excluir{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            Esta ação removerá permanentemente o cliente do sistema. Isso não
            pode ser desfeito.
          </p>

          <Label className='my-2'>
            Nome do cliente:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Digite o nome para confirmar a exclusão.'
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
