import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { IconWhatsapp } from '@/assets/brand-icons/icon-whatsapp'

interface ContactFormProps {
    propertyTitle?: string
    agentName?: string
    agentCreci?: string
    agentImage?: string
}

export function ContactForm({
    propertyTitle,
    agentName = 'João Rodrigues',
    agentCreci = '12345-F',
    agentImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
}: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: propertyTitle
            ? `Olá! Tenho interesse no imóvel "${propertyTitle}". Gostaria de mais informações.`
            : '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.')
        setFormData({ name: '', phone: '', email: '', message: '' })
        setIsSubmitting(false)
    }

    const handleWhatsApp = () => {
        const message = encodeURIComponent(
            propertyTitle
                ? `Olá! Tenho interesse no imóvel "${propertyTitle}". Gostaria de mais informações.`
                : 'Olá! Gostaria de mais informações sobre os imóveis disponíveis.'
        )
        window.open(`https://wa.me/5518999999999?text=${message}`, '_blank')
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1e3a5f]">
                <MessageSquare className="h-5 w-5" />
                Tenho Interesse
            </h3>
            <p className="mb-6 text-sm text-gray-600">
                Preencha para falar com um especialista.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        required
                    />
                </div>
                <div>
                    <Input
                        type="tel"
                        placeholder="Telefone / WhatsApp"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        required
                    />
                </div>
                <div>
                    <Input
                        type="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        required
                    />
                </div>
                <div>
                    <Textarea
                        placeholder="Mensagem"
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, message: e.target.value }))
                        }
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#1e3a5f] hover:bg-[#152a45]"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        'Enviando...'
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Mensagem
                        </>
                    )}
                </Button>
            </form>

            <div className="my-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">ou</span>
                <div className="h-px flex-1 bg-gray-200" />
            </div>

            <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
                onClick={handleWhatsApp}
            >
                <IconWhatsapp className="mr-2 h-4 w-4" />
                Falar no WhatsApp
            </Button>

            {/* Agent Card */}
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Corretor Responsável
                </p>
                <div className="flex items-center gap-3">
                    <img
                        src={agentImage}
                        alt={agentName}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-gray-900">{agentName}</p>
                        <p className="text-sm text-gray-500">CRECI {agentCreci}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
