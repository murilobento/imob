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
          url: '/company-settings',
          icon: Settings,
        },
      ],
    },
  ],
}
