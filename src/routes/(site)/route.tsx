import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SiteNavbar } from '@/features/site/components/site-navbar'
import { SiteFooter } from '@/features/site/components/site-footer'

export const Route = createFileRoute('/(site)')({
  component: SiteLayout,
})

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <SiteNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
