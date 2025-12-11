import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Clock,
    Facebook,
    Instagram,
} from 'lucide-react'

export function SiteFooter() {
    return (
        <footer className="bg-[#0f1c2e] text-white">
            {/* CTA Section */}
            <div className="bg-[#1e3a5f] py-12">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                        Pronto para encontrar seu novo lar?
                    </h2>
                    <p className="mb-6 text-gray-300">
                        Entre em contato agora mesmo e agende uma visita com um de nossos
                        corretores especialistas.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://wa.me/5518999999999"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
                        >
                            <Phone className="h-5 w-5" />
                            Fale no WhatsApp
                        </a>
                        <a
                            href="mailto:contato@jrimoveis.com.br"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
                        >
                            <Mail className="h-5 w-5" />
                            Enviar E-mail
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a5f] text-white">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <span className="text-lg font-bold">JR Imóveis</span>
                        </div>
                        <p className="mb-4 text-sm text-gray-400">
                            Sua imobiliária de confiança em Regente Feijó. Comprometidos em
                            realizar sonhos com transparência, ética e sofisticação.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 font-semibold">Menu Rápido</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a href="/" className="hover:text-white">
                                    Início
                                </a>
                            </li>
                            <li>
                                <a href="/imoveis?finality=SALE" className="hover:text-white">
                                    Imóveis para Comprar
                                </a>
                            </li>
                            <li>
                                <a href="/imoveis?finality=RENT" className="hover:text-white">
                                    Imóveis para Alugar
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Cadastre seu Imóvel
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="mb-4 font-semibold">Contato</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#3b82f6]" />
                                <span>
                                    Av. Regente Feijó, 1234 - Centro
                                    <br />
                                    Regente Feijó - SP
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 shrink-0 text-[#3b82f6]" />
                                <span>(18) 3222-0000</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0 text-[#3b82f6]" />
                                <span>contato@jrimoveis.com.br</span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="mb-4 font-semibold">Horário de Atendimento</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex justify-between">
                                <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-[#3b82f6]" />
                                    Seg - Sex
                                </span>
                                <span className="text-white">08:00 - 18:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="ml-6">Sábado</span>
                                <span className="text-white">09:00 - 13:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="ml-6">Domingo</span>
                                <span className="text-red-400">Fechado</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
                    <p>© 2024 JR Imóveis. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">
                            Termos de Uso
                        </a>
                        <a href="#" className="hover:text-white">
                            Privacidade
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
