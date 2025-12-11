import {
  Home,
  Building2,
  Store,
  Tractor,
  DollarSign,
  Key,
  CheckCircle2,
  XCircle,
  CircleDashed,
} from 'lucide-react'

export const realEstateTypes = [
  {
    value: 'HOUSE',
    label: 'Casa',
    icon: Home,
  },
  {
    value: 'APARTMENT',
    label: 'Apartamento',
    icon: Building2,
  },
  {
    value: 'LAND',
    label: 'Terreno',
    icon: CircleDashed,
  },
  {
    value: 'COMMERCIAL',
    label: 'Comercial',
    icon: Store,
  },
  {
    value: 'RURAL',
    label: 'Rural',
    icon: Tractor,
  },
]

export const realEstateFinalities = [
  {
    value: 'SALE',
    label: 'Venda',
    icon: DollarSign,
  },
  {
    value: 'RENT',
    label: 'Locação',
    icon: Key,
  },
  {
    value: 'BOTH',
    label: 'Ambos',
    icon: Home,
  },
]

export const realEstateStatuses = [
  {
    value: 'true',
    label: 'Disponível',
    icon: CheckCircle2,
  },
  {
    value: 'false',
    label: 'Indisponível',
    icon: XCircle,
  },
]
