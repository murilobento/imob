import { MapPin, Bed, Bath, Car, Maximize } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RealEstate } from '@/features/real-estate/data/schema'
import { propertyTypeLabels, propertyFinalityLabels } from '../types'

interface PropertyCardProps {
    property: RealEstate
    className?: string
}

const formatPrice = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return 'R$ ---'
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return 'R$ ---'
    return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

import { useState } from 'react'

export function PropertyCard({ property, className }: PropertyCardProps) {
    const [now] = useState(() => Date.now())
    const isRent = property.finality === 'RENT'
    const price = isRent ? property.rental_value : property.sale_value
    const priceSuffix = isRent ? '/mês' : ''

    // Parse photos JSON
    let photos: string[] = []
    try {
        if (property.photos) {
            photos = JSON.parse(property.photos)
        }
    } catch {
        photos = []
    }

    const mainImage =
        photos[0] ||
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80'

    return (
        <a
            href={`/imoveis/${property.id}`}
            className={cn(
                'group block overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg',
                className
            )}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={mainImage}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <span
                        className={cn(
                            'rounded-md px-2.5 py-1 text-xs font-semibold text-white',
                            isRent ? 'bg-orange-500' : 'bg-[#1e3a5f]'
                        )}
                    >
                        {propertyFinalityLabels[property.finality]}
                    </span>
                    {property.created_at &&
                        new Date(property.created_at).getTime() >
                        now - 7 * 24 * 60 * 60 * 1000 && (
                            <span className="rounded-md bg-green-500 px-2.5 py-1 text-xs font-semibold text-white">
                                Novo
                            </span>
                        )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                <span className="text-xs font-semibold uppercase tracking-wide text-[#3b82f6]">
                    {propertyTypeLabels[property.type]}
                </span>

                {/* Title */}
                <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-gray-900 group-hover:text-[#1e3a5f]">
                    {property.title}
                </h3>

                {/* Location */}
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">
                        {property.neighborhood}
                        {property.city && `, ${property.city}`}
                    </span>
                </div>

                {/* Price */}
                <div className="mt-3">
                    <span className="text-xl font-bold text-[#1e3a5f]">
                        {formatPrice(price)}
                    </span>
                    {priceSuffix && (
                        <span className="text-sm text-gray-500">{priceSuffix}</span>
                    )}
                </div>

                {/* Features */}
                <div className="mt-4 flex items-center gap-4 border-t pt-4 text-sm text-gray-500">
                    {property.bedrooms !== null && property.bedrooms !== undefined && (
                        <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{property.bedrooms}</span>
                        </div>
                    )}
                    {property.bathrooms !== null && property.bathrooms !== undefined && (
                        <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{property.bathrooms}</span>
                        </div>
                    )}
                    {property.garage_spots !== null &&
                        property.garage_spots !== undefined && (
                            <div className="flex items-center gap-1">
                                <Car className="h-4 w-4" />
                                <span>{property.garage_spots}</span>
                            </div>
                        )}
                    {property.total_area !== null && property.total_area !== undefined && (
                        <div className="flex items-center gap-1">
                            <Maximize className="h-4 w-4" />
                            <span>{property.total_area}m²</span>
                        </div>
                    )}
                </div>

                {/* Ver Detalhes Button */}
                <div className="mt-4">
                    <span className="block w-full rounded-lg bg-[#1e3a5f] py-2 text-center text-sm font-medium text-white transition-colors group-hover:bg-[#2d4a6f]">
                        Ver Detalhes
                    </span>
                </div>
            </div>
        </a>
    )
}
