import { createFileRoute } from '@tanstack/react-router'
import { CompanySettings } from '@/features/company-settings'

export const Route = createFileRoute('/admin/company-settings/')({
  component: CompanySettings,
})
