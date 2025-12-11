import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { User, Building2 } from 'lucide-react'

export const customerStatuses = [
  {
    value: 'active',
    label: 'Ativo',
    icon: CheckCircledIcon,
  },
  {
    value: 'inactive',
    label: 'Inativo',
    icon: CrossCircledIcon,
  },
]

export const customerTypes = [
  {
    value: 'FISICA',
    label: 'Física',
    icon: User,
  },
  {
    value: 'JURIDICA',
    label: 'Jurídica',
    icon: Building2,
  },
]
