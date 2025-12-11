import { Shield, Building, Headphones } from 'lucide-react'

const features = [
    {
        icon: Shield,
        title: 'Segurança Jurídica',
        description:
            'Assessoria completa em toda documentação para garantir um negócio seguro, ético e transparente para todas as partes.',
    },
    {
        icon: Building,
        title: 'Imóveis Exclusivos',
        description:
            'Uma seleção criteriosa das melhores oportunidades de alto padrão da região, pensada para quem não abre mão de qualidade.',
    },
    {
        icon: Headphones,
        title: 'Atendimento Premium',
        description:
            'Suporte dedicado e personalizado via WhatsApp e presencialmente em nosso escritório, com corretores especialistas.',
    },
]

export function FeaturesSection() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-[#1e3a5f]">
                        Excelência em cada detalhe
                    </h2>
                    <p className="mx-auto max-w-2xl text-gray-600">
                        Mais do que uma imobiliária, somos parceiros na realização do seu
                        sonho. Transparência e segurança são nossos pilares.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#1e3a5f]/10">
                                <feature.icon className="h-7 w-7 text-[#1e3a5f]" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
