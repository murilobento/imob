import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Building2, Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/imoveis', label: 'Imóveis' },
    { href: '/#sobre', label: 'Sobre Nós' },
    { href: '/#depoimentos', label: 'Depoimentos' },
]

export function SiteNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a5f] text-white">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-[#1e3a5f]">JR Imóveis</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500">
                            Premium Real Estate
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className="text-sm font-medium text-gray-700 transition-colors hover:text-[#1e3a5f]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* WhatsApp Button */}
                <div className="hidden md:flex">
                    <Button
                        className="bg-[#1e3a5f] hover:bg-[#152a45]"
                        onClick={() => window.open('https://wa.me/5518999999999', '_blank')}
                    >
                        <Phone className="mr-2 h-4 w-4" />
                        Fale no WhatsApp
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6 text-gray-700" />
                    ) : (
                        <Menu className="h-6 w-6 text-gray-700" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={cn(
                    'absolute left-0 right-0 border-b bg-white px-4 py-4 shadow-lg transition-all duration-300 md:hidden',
                    mobileMenuOpen
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-4 opacity-0'
                )}
            >
                <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className="text-sm font-medium text-gray-700 transition-colors hover:text-[#1e3a5f]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Button
                        className="mt-2 w-full bg-[#1e3a5f] hover:bg-[#152a45]"
                        onClick={() => window.open('https://wa.me/5518999999999', '_blank')}
                    >
                        <Phone className="mr-2 h-4 w-4" />
                        Fale no WhatsApp
                    </Button>
                </div>
            </div>
        </header>
    )
}
