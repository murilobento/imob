import { useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Building2, Menu, X } from 'lucide-react'
import { IconWhatsapp } from '@/assets/brand-icons/icon-whatsapp'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useCompanySettings } from '../context/company-settings-context'

const navLinks = [
  { href: '/', label: 'Início', anchor: 'top' },
  { href: '/imoveis', label: 'Imóveis', anchor: null },
  { href: '/', label: 'Sobre Nós', anchor: 'sobre' },
  { href: '/', label: 'Destaques', anchor: 'destaques' },
  { href: '/', label: 'Depoimentos', anchor: 'depoimentos' },
]

export function SiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { settings } = useCompanySettings()
  const location = useLocation()
  const navigate = useNavigate()

  const scrollToSection = useCallback((anchor: string) => {
    if (anchor === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const element = document.getElementById(anchor)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleNavClick = useCallback(
    (anchor: string) => {
      if (location.pathname === '/') {
        // Já está na home, apenas scroll
        scrollToSection(anchor)
      } else {
        // Navega para home e depois faz scroll
        navigate({ to: '/' }).then(() => {
          setTimeout(() => scrollToSection(anchor), 100)
        })
      }
    },
    [location.pathname, navigate, scrollToSection]
  )

  const whatsappNumber =
    settings?.whatsapp?.replace(/\D/g, '') || '5518999999999'
  const whatsappUrl = `https://wa.me/${whatsappNumber}`
  const companyName = settings?.nome_fantasia || 'JR Imóveis'

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80'>
      <nav className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <button
          onClick={() => handleNavClick('top')}
          className='flex items-center gap-2'
        >
          {settings?.logo ? (
            <img
              src={settings.logo}
              alt={companyName}
              className='h-10 w-auto max-w-[180px] object-contain'
            />
          ) : (
            <>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a5f] text-white'>
                <Building2 className='h-6 w-6' />
              </div>
              <div className='flex flex-col'>
                <span className='text-lg font-bold text-[#1e3a5f]'>
                  {companyName}
                </span>
                <span className='text-[10px] tracking-wider text-gray-500 uppercase'>
                  Premium Real Estate
                </span>
              </div>
            </>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className='hidden items-center gap-8 md:flex'>
          {navLinks.map((link) =>
            link.anchor ? (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.anchor!)}
                className='text-sm font-medium text-gray-700 transition-colors hover:text-[#1e3a5f]'
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className='text-sm font-medium text-gray-700 transition-colors hover:text-[#1e3a5f]'
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* WhatsApp Button */}
        <div className='hidden md:flex'>
          <Button
            className='bg-[#1e3a5f] hover:bg-[#152a45]'
            onClick={() => window.open(whatsappUrl, '_blank')}
          >
            <IconWhatsapp className='mr-2 h-4 w-4' />
            Fale no WhatsApp
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label='Toggle menu'
        >
          {mobileMenuOpen ? (
            <X className='h-6 w-6 text-gray-700' />
          ) : (
            <Menu className='h-6 w-6 text-gray-700' />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'absolute right-0 left-0 border-b bg-white px-4 py-4 shadow-lg transition-all duration-300 md:hidden',
          mobileMenuOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-4 opacity-0'
        )}
      >
        <div className='flex flex-col gap-4'>
          {navLinks.map((link) =>
            link.anchor ? (
              <button
                key={link.label}
                onClick={() => {
                  handleNavClick(link.anchor!)
                  setMobileMenuOpen(false)
                }}
                className='text-left text-sm font-medium text-gray-700 transition-colors hover:text-[#1e3a5f]'
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className='text-sm font-medium text-gray-700 transition-colors hover:text-[#1e3a5f]'
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <Button
            className='mt-2 w-full bg-[#1e3a5f] hover:bg-[#152a45]'
            onClick={() => window.open(whatsappUrl, '_blank')}
          >
            <IconWhatsapp className='mr-2 h-4 w-4' />
            Fale no WhatsApp
          </Button>
        </div>
      </div>
    </header>
  )
}
