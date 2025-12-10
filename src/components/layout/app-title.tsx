import { Link } from '@tanstack/react-router'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { CompanyLogo } from '@/components/shared/company-logo'

export function AppTitle() {
  const { setOpenMobile, state } = useSidebar()

  const isCollapsed = state === 'collapsed'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-0 py-0 group-data-[collapsible=icon]:!p-0 hover:bg-transparent active:bg-transparent'
          asChild
        >
          <Link
            to='/'
            onClick={() => setOpenMobile(false)}
            className='grid flex-1 place-items-center text-center text-sm leading-tight'
          >
            {isCollapsed ? (
              <CompanyLogo showName={false} size="sm" />
            ) : (
              <CompanyLogo showName={true} size="md" />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
