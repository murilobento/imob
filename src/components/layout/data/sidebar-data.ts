import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldUser,
  Settings,
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
          url: '/admin',
          icon: LayoutDashboard,
        },
        {
          title: 'Usuários',
          url: '/admin/users',
          icon: ShieldUser,
        },
        {
          title: 'Clientes',
          url: '/admin/customers',
          icon: Users,
        },
        {
          title: 'Imóveis',
          url: '/admin/real-estate',
          icon: Building2,
        },
        {
          title: 'Configurações da Empresa',
          url: '/admin/company-settings',
          icon: Settings,
        },
      ],
    },
  ],
}
