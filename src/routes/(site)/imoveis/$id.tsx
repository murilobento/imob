import { createFileRoute } from '@tanstack/react-router'
import { PropertyDetails } from '@/features/site/pages/property-details'

export const Route = createFileRoute('/(site)/imoveis/$id')({
  component: PropertyDetails,
})
