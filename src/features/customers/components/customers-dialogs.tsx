import { CustomersActionDialog } from './customers-action-dialog'
import { CustomersDeleteDialog } from './customers-delete-dialog'
import { useCustomers } from './customers-provider'

export function CustomersDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useCustomers()
    return (
        <>
            <CustomersActionDialog
                key='customer-add'
                open={open === 'add'}
                onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
            />

            {currentRow && (
                <>
                    <CustomersActionDialog
                        key={`customer-edit-${currentRow.id}`}
                        open={open === 'edit' || open === 'view'}
                        onOpenChange={(isOpen) => {
                            if (isOpen) setOpen(open)
                            else {
                                setOpen(null)
                                setTimeout(() => {
                                    setCurrentRow(null)
                                }, 500)
                            }
                        }}
                        currentRow={currentRow}
                        readOnly={open === 'view'}
                    />

                    <CustomersDeleteDialog
                        key={`customer-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={(isOpen) => {
                            if (isOpen) setOpen('delete')
                            else {
                                setOpen(null)
                                setTimeout(() => {
                                    setCurrentRow(null)
                                }, 500)
                            }
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
