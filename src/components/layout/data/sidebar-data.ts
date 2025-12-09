import {
  LayoutDashboard,
  Users,
  Building2,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  modules: [
    {
      name: 'Geral',
      logo: GalleryVerticalEnd,
      plan: 'Dashboard',
      id: 'general'
    },
    {
      name: 'Administrativo',
      logo: Command,
      plan: 'Ferramentas Admin',
      id: 'admin'
    },
  ],
  navGroups: [
    {
      title: 'Geral',
      moduleId: 'general',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Administrativo',
      moduleId: 'admin',
      items: [
        {
          title: 'Usuários',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Configurações da Empresa',
          url: '/?modal=company-settings',
          icon: Building2,
        },
      ],
    },

  ],
}
