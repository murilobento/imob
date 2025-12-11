import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRealEstate } from './real-estate-provider'

export function RealEstatePrimaryButtons() {
  const { setOpen } = useRealEstate()

  return (
    <div className='flex gap-2'>
      <Button onClick={() => setOpen('add')} className='space-x-1'>
        <span>Novo Imóvel</span>
        <Plus className='h-4 w-4' />
      </Button>
    </div>
  )
}
