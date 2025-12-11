import { useEffect, useState } from 'react'

interface DynamicTitleProps {
  suffix?: string
}

export function DynamicTitle({ suffix = '' }: DynamicTitleProps) {
  const [companyName, setCompanyName] = useState<string | null>(null)

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/company-settings`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.nome_fantasia) {
          setCompanyName(data.nome_fantasia)
        }
      })
      .catch(() => {
        // Silently fail - use default from index.html
      })
  }, [])

  useEffect(() => {
    if (companyName) {
      document.title = suffix ? `${companyName} ${suffix}` : companyName
    }
  }, [companyName, suffix])

  return null
}
