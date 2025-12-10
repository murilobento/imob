import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RealEstate } from '@/features/real-estate'

const realEstateSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  title: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/real-estate/')({
  validateSearch: realEstateSearchSchema,
  component: RealEstate,
})
