import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getCompanySettings } from '../api/site-api'
import type { CompanySettings } from '../types'

interface CompanySettingsContextType {
    settings: CompanySettings | null
    isLoading: boolean
}

const CompanySettingsContext = createContext<CompanySettingsContextType>({
    settings: null,
    isLoading: true,
})

export function CompanySettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<CompanySettings | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getCompanySettings()
            .then(setSettings)
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <CompanySettingsContext.Provider value={{ settings, isLoading }}>
            {children}
        </CompanySettingsContext.Provider>
    )
}

export function useCompanySettings() {
    return useContext(CompanySettingsContext)
}
