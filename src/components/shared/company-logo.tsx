import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CompanyLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  showName?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'light' | 'dark'
}

export function CompanyLogo({
  className,
  showName = true,
  size = 'md',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant = 'default',
  ...props
}: CompanyLogoProps) {
  const [company, setCompany] = useState<{
    nome_fantasia?: string
    logo?: string
  } | null>(null)

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/company-settings`
    )
      .then((res) => res.json())
      .then((data) => setCompany(data))
      .catch(() => {
        // Silently fail - use default
      })
  }, [])

  // Extract initials from company name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const companyName = company?.nome_fantasia || 'Shadcn Admin'
  const initials = getInitials(companyName)

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <Avatar className={cn('rounded-lg', sizeClasses[size])}>
        {company?.logo ? (
          <AvatarImage
            src={company.logo}
            alt={companyName}
            className='object-cover'
          />
        ) : null}
        <AvatarFallback className='bg-primary text-primary-foreground rounded-lg font-bold'>
          {initials}
        </AvatarFallback>
      </Avatar>

      {showName && (
        <span className={cn('truncate font-bold', textSizeClasses[size])}>
          {companyName}
        </span>
      )}
    </div>
  )
}
