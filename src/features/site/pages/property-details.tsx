import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import {
    MapPin,
    Bed,
    Bath,
    Car,
    Maximize,
    Home,
    Armchair,
    CheckCircle,
    Info,
    FileText,
    Map,
} from 'lucide-react'
import { PropertyGallery } from '../components/property-gallery'
import { ContactForm } from '../components/contact-form'
import { PropertyCard } from '../components/property-card'
import { getPropertyById, getSimilarProperties } from '../api/site-api'
import { propertyTypeLabels, propertyFinalityLabels } from '../types'

export function PropertyDetails() {
    const { id } = useParams({ from: '/(site)/imoveis/$id' })

    const { data: property, isLoading } = useQuery({
        queryKey: ['property', id],
        queryFn: () => getPropertyById(id),
        enabled: !!id,
    })

    const { data: similarProperties = [] } = useQuery({
        queryKey: ['similar-properties', id, property?.type, property?.finality],
        queryFn: () => (property ? getSimilarProperties(property, 4) : []),
        enabled: !!property,
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="mb-4 h-8 w-48 rounded bg-gray-200" />
                        <div className="mb-8 h-96 rounded-xl bg-gray-200" />
                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <div className="h-64 rounded-xl bg-gray-200" />
                            </div>
                            <div className="h-96 rounded-xl bg-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!property) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Imóvel não encontrado
                    </h1>
                    <p className="mt-2 text-gray-600">
                        O imóvel que você procura não existe ou foi removido.
                    </p>
                    <a
                        href="/imoveis"
                        className="mt-4 inline-block text-[#3b82f6] hover:underline"
                    >
                        Voltar para busca
                    </a>
                </div>
            </div>
        )
    }

    const isRent = property.finality === 'RENT'
    const price = isRent ? property.rental_value : property.sale_value

    // Parse photos
    let photos: string[] = []
    try {
        if (property.photos) {
            photos = JSON.parse(property.photos)
        }
    } catch {
        photos = []
    }

    // Property features
    const features = [
        property.bedrooms && { icon: Bed, label: 'Quartos', value: property.bedrooms },
        property.suites && { icon: Bed, label: 'Suítes', value: property.suites },
        property.bathrooms && { icon: Bath, label: 'Banheiros', value: property.bathrooms },
        property.garage_spots && { icon: Car, label: 'Vagas', value: property.garage_spots },
        property.built_area && { icon: Home, label: 'Área Construída', value: `${property.built_area}m²` },
        property.total_area && { icon: Maximize, label: 'Área Total', value: `${property.total_area}m²` },
        property.is_furnished && { icon: Armchair, label: 'Mobiliado', value: 'Sim' },
    ].filter(Boolean)

    // Amenities (mock for now)
    const amenities = [
        'Piscina Aquecida',
        'Área Gourmet',
        'Ar Condicionado Central',
        'Portão Eletrônico',
        'Ambiente Planejado',
        'Jardim/Área Verde',
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-gray-700">
                            Início
                        </Link>
                        <span>/</span>
                        <a href="/imoveis" className="hover:text-gray-700">
                            Imóveis
                        </a>
                        <span>/</span>
                        <span className="text-gray-900">{property.title}</span>
                    </nav>
                </div>
            </div>

            {/* Header */}
            <div className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="rounded bg-[#1e3a5f] px-2 py-1 text-xs font-semibold text-white">
                                    {propertyTypeLabels[property.type]}
                                </span>
                                <span
                                    className={`rounded px-2 py-1 text-xs font-semibold text-white ${isRent ? 'bg-orange-500' : 'bg-green-600'
                                        }`}
                                >
                                    {propertyFinalityLabels[property.finality]}
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                                {property.title}
                            </h1>
                            <div className="mt-2 flex items-center gap-1 text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>
                                    {property.street && `${property.street}, ${property.number} - `}
                                    {property.neighborhood}, {property.city} - {property.state}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">
                                Valor de {isRent ? 'Aluguel' : 'Venda'}
                            </p>
                            <p className="text-3xl font-bold text-[#1e3a5f]">
                                R$ {price?.toLocaleString('pt-BR') || '---'}
                                {isRent && <span className="text-lg font-normal">/mês</span>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Gallery */}
                <PropertyGallery photos={photos} title={property.title} />

                {/* Content Grid */}
                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Features */}
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#1e3a5f]">
                                <Info className="h-5 w-5" />
                                Características do Imóvel
                            </h2>

                            <div className="grid gap-6 sm:grid-cols-3">
                                {features.map((feature, index) => {
                                    if (!feature) return null
                                    const Icon = feature.icon
                                    return (
                                        <div key={index} className="text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1e3a5f]/10">
                                                <Icon className="h-6 w-6 text-[#1e3a5f]" />
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {feature.value}
                                            </p>
                                            <p className="text-sm text-gray-500">{feature.label}</p>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Amenities */}
                            <div className="mt-8 border-t pt-6">
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {amenities.map((amenity) => (
                                        <div
                                            key={amenity}
                                            className="flex items-center gap-2 text-sm text-gray-600"
                                        >
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1e3a5f]">
                                <FileText className="h-5 w-5" />
                                Descrição
                            </h2>
                            <div className="prose prose-gray max-w-none">
                                <p className="whitespace-pre-line text-gray-600">
                                    {property.legal_notes ||
                                        `Espetacular ${propertyTypeLabels[property.type].toLowerCase()} localizado em ${property.neighborhood}, ${property.city}. Este imóvel foi projetado para oferecer o máximo de conforto e sofisticação para sua família. Com um projeto arquitetônico moderno, ele integra perfeitamente as áreas de convívio com o lazer.

A casa conta com acabamento de alto padrão, proporcionando um ambiente elegante e acolhedor. A iluminação natural é abundante, graças às amplas janelas que conectam os ambientes internos ao amplo jardim.

Os quartos são espaçosos, sendo a suíte master com closet e banheira de hidromassagem. Toda a estrutura elétrica, hidráulica e de Internet está em LED. Aguardo seu contato para aendardar.`}
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1e3a5f]">
                                <Map className="h-5 w-5" />
                                Localização
                            </h2>
                            <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                                <div className="flex h-full items-center justify-center text-gray-400">
                                    <p>Mapa não disponível</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <ContactForm
                                propertyTitle={property.title}
                            />
                        </div>
                    </div>
                </div>

                {/* Similar Properties */}
                {similarProperties.length > 0 && (
                    <div className="mt-16">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#1e3a5f]">
                                    Imóveis Similares
                                </h2>
                                <p className="text-gray-600">
                                    Outras opções selecionadas para você
                                </p>
                            </div>
                            <a
                                href="/imoveis"
                                className="text-sm font-medium text-[#3b82f6] hover:underline"
                            >
                                Ver todos →
                            </a>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {similarProperties.map((p) => (
                                <PropertyCard key={p.id} property={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
