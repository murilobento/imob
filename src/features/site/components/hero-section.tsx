import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
    const [search, setSearch] = useState('')
    const [finality, setFinality] = useState<'SALE' | 'RENT'>('SALE')

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        params.set('finality', finality)
        window.location.href = `/imoveis?${params.toString()}`
    }

    return (
        <section className="relative min-h-[600px] w-full">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&auto=format&fit=crop&q=80)',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f1c2e]/90 via-[#0f1c2e]/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative mx-auto flex min-h-[600px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[#3b82f6]">
                        JR Imóveis • Premium Real Estate
                    </p>
                    <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                        O imóvel dos seus sonhos,
                        <br />
                        <span className="text-[#3b82f6]">com a exclusividade</span>
                        <br />
                        que você merece.
                    </h1>
                    <p className="mb-8 max-w-lg text-lg text-gray-300">
                        Curadoria especializada de imóveis de alto padrão. Segurança,
                        transparência e atendimento premium para você encontrar seu novo lar
                        em Regente Feijó.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="bg-[#3b82f6] px-8 hover:bg-[#2563eb]"
                            onClick={() => (window.location.href = '/imoveis')}
                        >
                            Ver Imóveis
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                            onClick={() =>
                                window.open('https://wa.me/5518999999999', '_blank')
                            }
                        >
                            Fale com Consultor
                        </Button>
                    </div>
                </div>

                {/* Search Box */}
                <div className="mt-12 max-w-4xl rounded-xl bg-white p-4 shadow-xl sm:p-6">
                    <div className="mb-4 flex items-center gap-2 text-[#1e3a5f]">
                        <Search className="h-5 w-5" />
                        <span className="font-semibold">Encontre seu imóvel ideal</span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                        {/* Finality */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                                Finalidade
                            </label>
                            <div className="relative">
                                <select
                                    value={finality}
                                    onChange={(e) =>
                                        setFinality(e.target.value as 'SALE' | 'RENT')
                                    }
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                                >
                                    <option value="SALE">Comprar</option>
                                    <option value="RENT">Alugar</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                                Buscar
                            </label>
                            <input
                                type="text"
                                placeholder="Código, bairro, cidade..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                            />
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end">
                            <Button
                                onClick={handleSearch}
                                className="w-full bg-[#3b82f6] hover:bg-[#2563eb]"
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Buscar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
