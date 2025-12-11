import { useState } from 'react'
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
  Share2,
  Heart,
  ChevronLeft,
  Calendar,
} from 'lucide-react'
import { IconWhatsapp } from '@/assets/brand-icons/icon-whatsapp'
import { Button } from '@/components/ui/button'
import { getPropertyById, getSimilarProperties } from '../api/site-api'
import { ContactForm } from '../components/contact-form'
import { PropertyCard } from '../components/property-card'
import { PropertyGallery } from '../components/property-gallery'
import { useCompanySettings } from '../context/company-settings-context'
import { propertyTypeLabels, propertyFinalityLabels } from '../types'

const formatPrice = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return 'R$ ---'
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return 'R$ ---'
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function PropertyDetails() {
  const { id } = useParams({ from: '/(site)/imoveis/$id' })
  const { settings } = useCompanySettings()
  const [now] = useState(() => Date.now())

  const whatsappNumber =
    settings?.whatsapp?.replace(/\D/g, '') || '5518999999999'
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
  })

  const { data: similarProperties = [] } = useQuery({
    queryKey: [
      'similar-properties',
      id,
      property?.type,
      property?.finality,
      property,
    ],
    queryFn: () => (property ? getSimilarProperties(property, 4) : []),
    enabled: !!property,
  })

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='animate-pulse'>
            <div className='mb-4 h-8 w-48 rounded bg-gray-200' />
            <div className='mb-8 h-96 rounded-xl bg-gray-200' />
            <div className='grid gap-8 lg:grid-cols-3'>
              <div className='lg:col-span-2'>
                <div className='h-64 rounded-xl bg-gray-200' />
              </div>
              <div className='h-96 rounded-xl bg-gray-200' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
            <Home className='h-8 w-8 text-gray-400' />
          </div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Imóvel não encontrado
          </h1>
          <p className='mt-2 text-gray-600'>
            O imóvel que você procura não existe ou foi removido.
          </p>
          <a
            href='/imoveis'
            className='mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2d4a6f]'
          >
            <ChevronLeft className='h-4 w-4' />
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
    property.bedrooms && {
      icon: Bed,
      label: 'Quartos',
      value: property.bedrooms,
    },
    property.suites && { icon: Bed, label: 'Suítes', value: property.suites },
    property.bathrooms && {
      icon: Bath,
      label: 'Banheiros',
      value: property.bathrooms,
    },
    property.garage_spots && {
      icon: Car,
      label: 'Vagas',
      value: property.garage_spots,
    },
    property.built_area && {
      icon: Home,
      label: 'Área Construída',
      value: `${property.built_area}m²`,
    },
    property.total_area && {
      icon: Maximize,
      label: 'Área Total',
      value: `${property.total_area}m²`,
    },
    property.is_furnished && {
      icon: Armchair,
      label: 'Mobiliado',
      value: 'Sim',
    },
  ].filter(Boolean)

  // Amenities
  const amenities = [
    'Piscina Aquecida',
    'Área Gourmet',
    'Ar Condicionado Central',
    'Portão Eletrônico',
    'Ambiente Planejado',
    'Jardim/Área Verde',
  ]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Confira este imóvel: ${property.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='border-b bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8'>
          <nav className='flex flex-wrap items-center gap-2 text-sm text-gray-500'>
            <Link to='/' className='transition-colors hover:text-[#1e3a5f]'>
              Início
            </Link>
            <span className='text-gray-300'>/</span>
            <a
              href='/imoveis'
              className='transition-colors hover:text-[#1e3a5f]'
            >
              Imóveis
            </a>
            <span className='text-gray-300'>/</span>
            <span className='font-medium text-[#1e3a5f]'>{property.title}</span>
          </nav>
        </div>
      </div>

      {/* Header with improved layout */}
      <div className='border-b bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            <div className='flex-1'>
              <div className='mb-3 flex flex-wrap items-center gap-2'>
                <span className='rounded-full bg-[#1e3a5f] px-3 py-1 text-xs font-semibold text-white'>
                  {propertyTypeLabels[property.type]}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                    isRent ? 'bg-orange-500' : 'bg-green-600'
                  }`}
                >
                  {propertyFinalityLabels[property.finality]}
                </span>
                {property.created_at &&
                  new Date(property.created_at).getTime() >
                    now - 7 * 24 * 60 * 60 * 1000 && (
                    <span className='rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white'>
                      Novo
                    </span>
                  )}
              </div>
              <h1 className='text-2xl font-bold text-gray-900 lg:text-3xl'>
                {property.title}
              </h1>
              <div className='mt-3 flex items-center gap-1 text-gray-600'>
                <MapPin className='h-5 w-5 text-[#3b82f6]' />
                <span className='text-base'>
                  {property.street &&
                    `${property.street}, ${property.number} - `}
                  {property.neighborhood}, {property.city} - {property.state}
                </span>
              </div>

              {/* Quick actions */}
              <div className='mt-4 flex flex-wrap gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleShare}
                  className='gap-2'
                >
                  <Share2 className='h-4 w-4' />
                  Compartilhar
                </Button>
                <Button variant='outline' size='sm' className='gap-2'>
                  <Heart className='h-4 w-4' />
                  Favoritar
                </Button>
              </div>
            </div>

            {/* Price card */}
            <div className='rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] p-6 text-white lg:min-w-[280px]'>
              <p className='text-sm opacity-80'>
                Valor de {isRent ? 'Aluguel' : 'Venda'}
              </p>
              <p className='mt-1 text-3xl font-bold'>
                {formatPrice(price)}
                {isRent && (
                  <span className='text-lg font-normal opacity-80'>/mês</span>
                )}
              </p>
              {property.condominium_value && (
                <p className='mt-2 text-sm opacity-80'>
                  + Condomínio: {formatPrice(property.condominium_value)}
                </p>
              )}
              {property.iptu_value && (
                <p className='text-sm opacity-80'>
                  + IPTU: {formatPrice(property.iptu_value)}/ano
                </p>
              )}
              <a
                href={whatsappUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:bg-green-600'
              >
                <IconWhatsapp className='h-5 w-5' />
                Falar com Corretor
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Gallery */}
        <PropertyGallery photos={photos} title={property.title} />

        {/* Content Grid */}
        <div className='mt-8 grid gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Quick Features Bar */}
            <div className='flex flex-wrap gap-4 rounded-xl bg-white p-4 shadow-sm'>
              {property.bedrooms && (
                <div className='flex items-center gap-2 text-gray-700'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a5f]/10'>
                    <Bed className='h-5 w-5 text-[#1e3a5f]' />
                  </div>
                  <div>
                    <p className='text-lg font-bold'>{property.bedrooms}</p>
                    <p className='text-xs text-gray-500'>Quartos</p>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className='flex items-center gap-2 text-gray-700'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a5f]/10'>
                    <Bath className='h-5 w-5 text-[#1e3a5f]' />
                  </div>
                  <div>
                    <p className='text-lg font-bold'>{property.bathrooms}</p>
                    <p className='text-xs text-gray-500'>Banheiros</p>
                  </div>
                </div>
              )}
              {property.garage_spots && (
                <div className='flex items-center gap-2 text-gray-700'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a5f]/10'>
                    <Car className='h-5 w-5 text-[#1e3a5f]' />
                  </div>
                  <div>
                    <p className='text-lg font-bold'>{property.garage_spots}</p>
                    <p className='text-xs text-gray-500'>Vagas</p>
                  </div>
                </div>
              )}
              {property.total_area && (
                <div className='flex items-center gap-2 text-gray-700'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a5f]/10'>
                    <Maximize className='h-5 w-5 text-[#1e3a5f]' />
                  </div>
                  <div>
                    <p className='text-lg font-bold'>{property.total_area}m²</p>
                    <p className='text-xs text-gray-500'>Área Total</p>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className='rounded-xl bg-white p-6 shadow-sm'>
              <h2 className='mb-6 flex items-center gap-2 text-xl font-bold text-[#1e3a5f]'>
                <Info className='h-5 w-5' />
                Características do Imóvel
              </h2>

              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {features.map((feature, index) => {
                  if (!feature) return null
                  const Icon = feature.icon
                  return (
                    <div
                      key={index}
                      className='flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3'
                    >
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1e3a5f]/10'>
                        <Icon className='h-5 w-5 text-[#1e3a5f]' />
                      </div>
                      <div>
                        <p className='text-lg font-bold text-gray-900'>
                          {feature.value}
                        </p>
                        <p className='text-sm text-gray-500'>{feature.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Amenities */}
              <div className='mt-8 border-t pt-6'>
                <h3 className='mb-4 font-semibold text-gray-900'>
                  Comodidades
                </h3>
                <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className='flex items-center gap-2 text-sm text-gray-600'
                    >
                      <CheckCircle className='h-5 w-5 text-green-500' />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className='rounded-xl bg-white p-6 shadow-sm'>
              <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-[#1e3a5f]'>
                <FileText className='h-5 w-5' />
                Descrição
              </h2>
              <div className='prose prose-gray max-w-none'>
                <p className='leading-relaxed whitespace-pre-line text-gray-600'>
                  {property.legal_notes ||
                    `Espetacular ${propertyTypeLabels[property.type].toLowerCase()} localizado em ${property.neighborhood}, ${property.city}. Este imóvel foi projetado para oferecer o máximo de conforto e sofisticação para sua família. Com um projeto arquitetônico moderno, ele integra perfeitamente as áreas de convívio com o lazer.

A casa conta com acabamento de alto padrão, proporcionando um ambiente elegante e acolhedor. A iluminação natural é abundante, graças às amplas janelas que conectam os ambientes internos ao amplo jardim.

Os quartos são espaçosos, sendo a suíte master com closet e banheira de hidromassagem. Toda a estrutura elétrica, hidráulica e de Internet está em LED. Aguardo seu contato para agendar uma visita.`}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className='rounded-xl bg-white p-6 shadow-sm'>
              <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-[#1e3a5f]'>
                <Map className='h-5 w-5' />
                Localização
              </h2>
              <div className='mb-4 flex items-center gap-2 text-gray-600'>
                <MapPin className='h-4 w-4 text-[#3b82f6]' />
                <span>
                  {property.street &&
                    `${property.street}, ${property.number} - `}
                  {property.neighborhood}, {property.city} - {property.state}
                </span>
              </div>
              <div className='aspect-video overflow-hidden rounded-lg bg-gray-100'>
                <iframe
                  title='Localização do imóvel'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  loading='lazy'
                  allowFullScreen
                  referrerPolicy='no-referrer-when-downgrade'
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                    [
                      property.street &&
                        `${property.street}, ${property.number}`,
                      property.neighborhood,
                      property.city,
                      property.state,
                      'Brasil',
                    ]
                      .filter(Boolean)
                      .join(', ')
                  )}`}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-24 space-y-6'>
              {/* Contact Form */}
              <ContactForm propertyTitle={property.title} />

              {/* Schedule Visit Card */}
              <div className='rounded-xl bg-white p-6 shadow-sm'>
                <h3 className='mb-4 flex items-center gap-2 font-semibold text-gray-900'>
                  <Calendar className='h-5 w-5 text-[#1e3a5f]' />
                  Agende uma Visita
                </h3>
                <p className='mb-4 text-sm text-gray-600'>
                  Quer conhecer este imóvel pessoalmente? Agende uma visita com
                  um de nossos corretores.
                </p>
                <a
                  href={whatsappUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1e3a5f] px-4 py-3 font-medium text-[#1e3a5f] transition-colors hover:bg-[#1e3a5f] hover:text-white'
                >
                  <Calendar className='h-5 w-5' />
                  Agendar Visita
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className='mt-16'>
            <div className='mb-8 flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold text-[#1e3a5f]'>
                  Imóveis Similares
                </h2>
                <p className='mt-1 text-gray-600'>
                  Outras opções que podem te interessar
                </p>
              </div>
              <a
                href='/imoveis'
                className='hidden items-center gap-1 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm font-medium text-[#1e3a5f] transition-colors hover:bg-[#1e3a5f] hover:text-white sm:flex'
              >
                Ver todos os imóveis
              </a>
            </div>

            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>

            <div className='mt-6 text-center sm:hidden'>
              <a
                href='/imoveis'
                className='inline-flex items-center gap-1 rounded-lg border border-[#1e3a5f] px-6 py-3 font-medium text-[#1e3a5f] transition-colors hover:bg-[#1e3a5f] hover:text-white'
              >
                Ver todos os imóveis
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
