import { Shield, Building, Headphones } from 'lucide-react'
import { useCompanySettings } from '../context/company-settings-context'

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
    const { settings } = useCompanySettings()
    const cidade = settings?.cidade || 'Regente Feijó'

    return (
        <section id="sobre" className="scroll-mt-20 bg-gray-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Excelência em cada detalhe + Sobre Nós */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-[#1e3a5f]">
                        Excelência em cada detalhe
                    </h2>
                    <p className="mx-auto max-w-3xl text-gray-600">
                        Somos uma imobiliária comprometida em transformar sonhos em realidade. 
                        Com anos de experiência no mercado imobiliário de {cidade} e região, 
                        oferecemos um atendimento personalizado e transparente, guiando nossos 
                        clientes em cada etapa da jornada de compra, venda ou locação de imóveis. 
                        Mais do que uma imobiliária, somos parceiros na realização do seu sonho.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex flex-col items-center rounded-xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#1e3a5f]/10">
                                <feature.icon className="h-7 w-7 text-[#1e3a5f]" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="text-justify text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
