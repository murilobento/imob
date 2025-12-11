import { RealEstateActionDialog } from './real-estate-action-dialog'
import { RealEstateDeleteDialog } from './real-estate-delete-dialog'
import { useRealEstate } from './real-estate-provider'

export function RealEstateDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRealEstate()

  return (
    <>
      <RealEstateActionDialog
        open={open === 'add' || open === 'edit'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null)
            setTimeout(() => setCurrentRow(null), 200)
          }
        }}
        currentRow={currentRow || undefined}
      />
      {currentRow && (
        <RealEstateDeleteDialog
          open={open === 'delete'}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setOpen(null)
              setTimeout(() => setCurrentRow(null), 200)
            }
          }}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
