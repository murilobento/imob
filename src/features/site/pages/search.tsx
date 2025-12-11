import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '../components/property-card'
import { SearchFilters } from '../components/search-filters'
import { getPublicProperties } from '../api/site-api'
import type { PropertyFilters } from '../types'

type PropertyType = 'HOUSE' | 'APARTMENT' | 'LAND' | 'COMMERCIAL' | 'RURAL'
type Finality = 'SALE' | 'RENT'

export function Search() {
    // Parse search params from browser URL
    const searchParams = useMemo(() => {
        if (typeof window === 'undefined') return {}
        const params = new URLSearchParams(window.location.search)
        const typeParam = params.get('type')
        const finalityParam = params.get('finality')

        return {
            finality: (finalityParam === 'SALE' || finalityParam === 'RENT') ? finalityParam as Finality : undefined,
            type: (['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'RURAL'].includes(typeParam || ''))
                ? typeParam as PropertyType
                : undefined,
            bedrooms: params.get('bedrooms') ? Number(params.get('bedrooms')) : undefined,
            minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
            maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
            search: params.get('search') || undefined,
            page: params.get('page') ? Number(params.get('page')) : undefined,
        }
    }, [])

    const [filters, setFilters] = useState<PropertyFilters>({
        finality: searchParams.finality,
        type: searchParams.type,
        bedrooms: searchParams.bedrooms,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        search: searchParams.search,
    })
    const [page, setPage] = useState(searchParams.page || 1)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [sortBy, setSortBy] = useState('relevant')

    const { data, isLoading } = useQuery({
        queryKey: ['public-properties', filters, page],
        queryFn: () => getPublicProperties(filters, page, 12),
    })

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams()
        if (filters.finality) params.set('finality', filters.finality)
        if (filters.type) params.set('type', filters.type)
        if (filters.bedrooms) params.set('bedrooms', String(filters.bedrooms))
        if (filters.minPrice) params.set('minPrice', String(filters.minPrice))
        if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice))
        if (filters.search) params.set('search', filters.search)
        if (page > 1) params.set('page', String(page))

        const searchStr = params.toString()
        const newUrl = searchStr ? `/imoveis?${searchStr}` : '/imoveis'
        window.history.replaceState({}, '', newUrl)
    }, [filters, page])

    const handleFiltersChange = (newFilters: PropertyFilters) => {
        setFilters(newFilters)
        setPage(1)
    }

    const properties = data?.data || []
    const totalPages = data?.totalPages || 1
    const total = data?.total || 0

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-gray-700">
                            Início
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900">Busca de Imóveis</span>
                    </nav>
                </div>
            </div>

            {/* Header */}
            <div className="bg-white border-b">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-[#1e3a5f]">
                        Imóveis em <span className="text-[#3b82f6]">Regente Feijó</span>
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Encontramos <span className="font-semibold">{total} imóveis</span>{' '}
                        exclusivos para você.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Filters - Desktop */}
                    <aside className="hidden w-72 shrink-0 lg:block">
                        <SearchFilters
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="mb-6 flex items-center justify-between">
                            {/* Mobile Filter Button */}
                            <Button
                                variant="outline"
                                className="lg:hidden"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Filtros
                            </Button>

                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <span className="hidden text-sm text-gray-500 sm:inline">
                                    Ordenar:
                                </span>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="relevant">Mais Relevantes</SelectItem>
                                        <SelectItem value="price_asc">Menor Preço</SelectItem>
                                        <SelectItem value="price_desc">Maior Preço</SelectItem>
                                        <SelectItem value="recent">Mais Recentes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Properties Grid */}
                        {isLoading ? (
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-96 animate-pulse rounded-xl bg-gray-200"
                                    />
                                ))}
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                                <p className="text-lg font-medium text-gray-900">
                                    Nenhum imóvel encontrado
                                </p>
                                <p className="mt-2 text-gray-500">
                                    Tente ajustar seus filtros de busca.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => handleFiltersChange({})}
                                >
                                    Limpar filtros
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {properties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                    const pageNum = i + 1
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={page === pageNum ? 'default' : 'outline'}
                                            size="icon"
                                            onClick={() => setPage(pageNum)}
                                            className={page === pageNum ? 'bg-[#1e3a5f]' : ''}
                                        >
                                            {pageNum}
                                        </Button>
                                    )
                                })}

                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
                    <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white p-4 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Filtros</h2>
                            <button onClick={() => setShowMobileFilters(false)}>✕</button>
                        </div>
                        <SearchFilters
                            filters={filters}
                            onFiltersChange={(newFilters) => {
                                handleFiltersChange(newFilters)
                                setShowMobileFilters(false)
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
