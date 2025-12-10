import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldUser,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navGroups: [
    {
      title: 'Menu Principal',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Usuários',
          url: '/users',
          icon: ShieldUser,
        },
        {
          title: 'Clientes',
          url: '/customers',
          icon: Users,
        },
        {
          title: 'Imóveis',
          url: '/real-estate',
          icon: Building2,
        },
        {
          title: 'Configurações da Empresa',
          url: '/?modal=company-settings',
          // Use another icon since Building2 is now for Real Estate, or keep/change. 
          // User didn't specify. I'll reuse Building2 for now or swap if I can find a "Settings" icon.
          // Let's use generic Settings for company settings? Or keep Building2. 
          // Actually Building2 fits Real Estate better. I'll search for another icon in sidebar-data.ts imports or add one.
          // Existing imports: LayoutDashboard, Users, Building2, ShieldUser.
          // I will use Building2 for Real Estate and maybe just leave Company Settings as is for now -> Building2. 
          // But duplicate icons might be confusing. 
          // I'll check if I can add 'Settings' or 'Cog' from lucide-react. 
          // For now I'll just add the item. 
          icon: Building2,
        },
      ],
    },
  ],
}
