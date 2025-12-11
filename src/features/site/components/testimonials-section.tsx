import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Carlos Mendes',
    text: 'A equipe da JR Imóveis foi excepcional. Encontraram a casa perfeita para minha família em Regente Feijó em tempo recorde. Recomendo muito!',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: 'Ana Paula Silva',
    text: 'Profissionalismo do início ao fim. Me ajudaram com toda a burocracia do financiamento. O atendimento personalizado faz toda a diferença.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: 3,
    name: 'Roberto Campos',
    text: 'Excelente opção para quem quer investir em imóveis. A curadoria da JR é impecável, só imóveis de qualidade.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
]

export function TestimonialsSection() {
  return (
    <section id='depoimentos' className='scroll-mt-20 bg-[#1e3a5f] py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-white'>
            O que dizem nossos clientes
          </h2>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className='rounded-xl bg-white p-6 shadow-lg'
            >
              {/* Stars */}
              <div className='mb-4 flex gap-1'>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className='h-5 w-5 fill-yellow-400 text-yellow-400'
                  />
                ))}
              </div>

              {/* Text */}
              <p className='mb-6 text-gray-600'>"{testimonial.text}"</p>

              {/* Author */}
              <div className='flex items-center gap-3'>
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className='h-12 w-12 rounded-full object-cover'
                />
                <div>
                  <p className='font-semibold text-gray-900'>
                    {testimonial.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
