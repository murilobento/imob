import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteRealEstate } from '../api/real-estate-api'
import { type RealEstate } from '../data/schema'
import { useRealEstate } from './real-estate-provider'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: RealEstate
}

export function RealEstateDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { onSuccess } = useRealEstate()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.title) return

    setIsLoading(true)
    try {
      await deleteRealEstate(currentRow.id)
      toast.success('Imóvel excluído com sucesso')
      onOpenChange(false)
      setValue('')
      onSuccess()
    } catch {
      toast.error('Falha ao excluir imóvel')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.title || isLoading}
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
          Excluir Imóvel
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Tem certeza que deseja excluir{' '}
            <span className='font-bold'>{currentRow.title}</span>?
            <br />
            Esta ação removerá permanentemente o imóvel do sistema.
          </p>

          <Label className='my-2'>
            Digite o título do imóvel para confirmar:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Digite o título'
              className='mt-2'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              Esta operação não pode ser revertida.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Excluir'
      destructive
    />
  )
}
