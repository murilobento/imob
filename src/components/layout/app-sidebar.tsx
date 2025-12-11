import { useSession } from '@/lib/auth-client'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { data: session } = useSession()

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image || sidebarData.user.avatar,
      }
    : sidebarData.user

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader className='gap-4'>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
