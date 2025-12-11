import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getRealEstates } from './api/real-estate-api'
import { RealEstateDialogs } from './components/real-estate-dialogs'
import { RealEstatePrimaryButtons } from './components/real-estate-primary-buttons'
import { RealEstateProvider } from './components/real-estate-provider'
import { RealEstateTable } from './components/real-estate-table'
import { type RealEstate } from './data/schema'

const route = getRouteApi('/admin/real-estate/')

export function RealEstate() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [data, setData] = useState<RealEstate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      setIsLoading(true)
      const result = await getRealEstates()
      setData(result)
    } catch {
      toast.error('Falha ao carregar imóveis')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <RealEstateProvider onSuccess={loadData}>
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
            <h2 className='text-2xl font-bold tracking-tight'>Imóveis</h2>
            <p className='text-muted-foreground'>
              Gerencie sua carteira de imóveis.
            </p>
          </div>
          <RealEstatePrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center py-10'>
            <div className='text-muted-foreground'>Carregando imóveis...</div>
          </div>
        ) : (
          <RealEstateTable data={data} search={search} navigate={navigate} />
        )}
      </Main>
      <RealEstateDialogs />
    </RealEstateProvider>
  )
}
