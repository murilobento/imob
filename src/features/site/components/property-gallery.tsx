import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'

interface PropertyGalleryProps {
  photos: string[]
  title: string
}

export function PropertyGallery({ photos, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use placeholder if no photos
  const images =
    photos.length > 0
      ? photos
      : [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
        ]

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className='grid gap-2 md:grid-cols-3 md:grid-rows-2'>
        {/* Main Image */}
        <button
          onClick={() => openLightbox(0)}
          className='relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden rounded-lg md:aspect-auto'
        >
          <img
            src={images[0]}
            alt={title}
            className='h-full w-full object-cover transition-transform hover:scale-105'
          />
          <div className='absolute top-3 left-3 flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-xs text-white'>
            <Camera className='h-3 w-3' />
            <span>Ver fotos</span>
          </div>
        </button>

        {/* Secondary Images */}
        {images.slice(1, 3).map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index + 1)}
            className='relative aspect-[4/3] overflow-hidden rounded-lg'
          >
            <img
              src={image}
              alt={`${title} - Foto ${index + 2}`}
              className='h-full w-full object-cover transition-transform hover:scale-105'
            />
          </button>
        ))}

        {/* Show More Button */}
        {images.length > 3 && (
          <button
            onClick={() => openLightbox(3)}
            className='relative hidden aspect-[4/3] overflow-hidden rounded-lg md:block'
          >
            <img
              src={images[3]}
              alt={`${title} - Foto 4`}
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
              <span className='font-semibold text-white'>
                +{images.length - 3} fotos
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/95'>
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className='absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20'
          >
            <X className='h-6 w-6' />
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              className='absolute left-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20'
            >
              <ChevronLeft className='h-8 w-8' />
            </button>
          )}

          {/* Image */}
          <img
            src={images[currentIndex]}
            alt={`${title} - Foto ${currentIndex + 1}`}
            className='max-h-[85vh] max-w-[90vw] object-contain'
          />

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className='absolute right-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20'
            >
              <ChevronRight className='h-8 w-8' />
            </button>
          )}

          {/* Counter */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white'>
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
