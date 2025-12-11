import { createFileRoute } from '@tanstack/react-router'
import { Search } from '@/features/site/pages/search'

export const Route = createFileRoute('/(site)/imoveis/')({
  component: Search,
})
