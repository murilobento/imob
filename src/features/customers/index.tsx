import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getCustomers } from './api/customers-api'
import { CustomersDialogs } from './components/customers-dialogs'
import { CustomersPrimaryButtons } from './components/customers-primary-buttons'
import { CustomersProvider } from './components/customers-provider'
import { CustomersTable } from './components/customers-table'
import { type Customer } from './data/schema'

const route = getRouteApi('/_authenticated/customers/')

export function Customers() {
    const search = route.useSearch()
    const navigate = route.useNavigate()
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const loadCustomers = async () => {
        try {
            setIsLoading(true)
            const data = await getCustomers()
            setCustomers(data)
        } catch {
            toast.error('Falha ao carregar clientes')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadCustomers()
    }, [])

    return (
        <CustomersProvider onSuccess={loadCustomers}>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            Lista de Clientes
                        </h2>
                        <p className='text-muted-foreground'>
                            Gerencie seus clientes aqui.
                        </p>
                    </div>
                    <CustomersPrimaryButtons />
                </div>
                {isLoading ? (
                    <div className='flex items-center justify-center py-10'>
                        <div className='text-muted-foreground'>Carregando clientes...</div>
                    </div>
                ) : (
                    <CustomersTable data={customers} search={search} navigate={navigate} />
                )}
            </Main>

            <CustomersDialogs />
        </CustomersProvider>
    )
}
