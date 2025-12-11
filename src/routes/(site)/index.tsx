import { createFileRoute } from '@tanstack/react-router'
import { Home } from '@/features/site/pages/home'

export const Route = createFileRoute('/(site)/')({
  component: Home,
})
