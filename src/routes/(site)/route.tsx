import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DynamicTitle } from '@/components/shared/dynamic-title'
import { SiteFooter } from '@/features/site/components/site-footer'
import { SiteNavbar } from '@/features/site/components/site-navbar'
import { CompanySettingsProvider } from '@/features/site/context/company-settings-context'

export const Route = createFileRoute('/(site)')({
  component: SiteLayout,
})

function SiteLayout() {
  return (
    <CompanySettingsProvider>
      <DynamicTitle />
      <div className='flex min-h-screen flex-col bg-white font-sans'>
        <SiteNavbar />
        <main className='flex-1'>
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </CompanySettingsProvider>
  )
}
