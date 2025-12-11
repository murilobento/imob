import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { authClient } from '@/lib/auth-client'
import { DynamicTitle } from '@/components/shared/dynamic-title'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const session = await authClient.getSession()
    if (!session.data) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

function RouteComponent() {
  return (
    <>
      <DynamicTitle suffix="Admin" />
      <AuthenticatedLayout />
    </>
  )
}
