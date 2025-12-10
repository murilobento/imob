import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type RealEstate } from '../data/schema'

type RealEstateDialogType = 'add' | 'edit' | 'delete' | 'view'

type RealEstateContextType = {
    open: RealEstateDialogType | null
    setOpen: (str: RealEstateDialogType | null) => void
    currentRow: RealEstate | null
    setCurrentRow: React.Dispatch<React.SetStateAction<RealEstate | null>>
    onSuccess: () => void
}

const RealEstateContext = React.createContext<RealEstateContextType | null>(null)

interface RealEstateProviderProps {
    children: React.ReactNode
    onSuccess: () => void
}

export function RealEstateProvider({ children, onSuccess }: RealEstateProviderProps) {
    const [open, setOpen] = useDialogState<RealEstateDialogType>(null)
    const [currentRow, setCurrentRow] = useState<RealEstate | null>(null)

    return (
        <RealEstateContext
            value={{ open, setOpen, currentRow, setCurrentRow, onSuccess }}
        >
            {children}
        </RealEstateContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRealEstate = () => {
    const context = React.useContext(RealEstateContext)

    if (!context) {
        throw new Error('useRealEstate has to be used within <RealEstateContext>')
    }

    return context
}
