import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroSection } from '../components/hero-section'
import { FeaturesSection } from '../components/features-section'
import { TestimonialsSection } from '../components/testimonials-section'
import { PropertyCard } from '../components/property-card'
import { ScrollToTopButton } from '../components/scroll-to-top-button'
import { getFeaturedProperties } from '../api/site-api'

export function Home() {
    const { data: featuredProperties = [], isLoading } = useQuery({
        queryKey: ['featured-properties'],
        queryFn: () => getFeaturedProperties(3),
    })

    return (
        <>
            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* Featured Properties Section */}
            <section id="destaques" className="scroll-mt-20 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-[#1e3a5f]">
                                Destaques Recentes
                            </h2>
                        </div>
                        <a
                            href="/imoveis"
                            className="hidden items-center gap-1 text-sm font-medium text-[#3b82f6] hover:underline sm:flex"
                        >
                            Ver todos
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>

                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-96 animate-pulse rounded-xl bg-gray-100"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    )}

                    <div className="mt-8 text-center sm:hidden">
                        <Button asChild variant="outline">
                            <a href="/imoveis">
                                Ver todos os imóveis
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Scroll to Top Button */}
            <ScrollToTopButton />
        </>
    )
}
