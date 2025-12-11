import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
} from 'lucide-react'
import { IconWhatsapp } from '@/assets/brand-icons/icon-whatsapp'
import { useCompanySettings } from '../context/company-settings-context'

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox='0 0 32 32'
    xmlns='http://www.w3.org/2000/svg'
    fill='currentColor'
  >
    <path d='M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z' />
  </svg>
)

export function SiteFooter() {
  const { settings } = useCompanySettings()

  const companyName = settings?.nome_fantasia || 'JR Imóveis'
  const whatsappNumber =
    settings?.whatsapp?.replace(/\D/g, '') || '5518999999999'
  const whatsappUrl = `https://wa.me/${whatsappNumber}`
  const email = settings?.email || 'contato@jrimoveis.com.br'
  const telefone = settings?.telefone || '(18) 3222-0000'
  const cidade = settings?.cidade || 'Regente Feijó'
  const uf = settings?.uf || 'SP'

  // Build address
  const endereco = settings?.logradouro
    ? `${settings.logradouro}, ${settings.numero || 's/n'}${settings.complemento ? ` - ${settings.complemento}` : ''} - ${settings.bairro || 'Centro'}`
    : 'Av. Regente Feijó, 1234 - Centro'

  return (
    <footer className='bg-[#0f1c2e] text-white'>
      {/* CTA Section */}
      <div className='bg-[#1e3a5f] py-12'>
        <div className='mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-4 text-2xl font-bold md:text-3xl'>
            Pronto para encontrar seu novo lar?
          </h2>
          <p className='mb-6 text-gray-300'>
            Entre em contato agora mesmo e agende uma visita com um de nossos
            corretores especialistas.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <a
              href={whatsappUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700'
            >
              <IconWhatsapp className='h-5 w-5' />
              Fale no WhatsApp
            </a>
            <a
              href={`mailto:${email}`}
              className='inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10'
            >
              <Mail className='h-5 w-5' />
              Enviar E-mail
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {/* Company Info */}
          <div>
            <div className='mb-4 flex items-center gap-2'>
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={companyName}
                  className='h-10 w-auto max-w-[180px] object-contain brightness-0 invert'
                />
              ) : (
                <>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e3a5f] text-white'>
                    <Building2 className='h-6 w-6' />
                  </div>
                  <span className='text-lg font-bold'>{companyName}</span>
                </>
              )}
            </div>
            <p className='mb-4 text-sm text-gray-400'>
              Sua imobiliária de confiança em {cidade}. Comprometidos em
              realizar sonhos com transparência, ética e sofisticação.
            </p>
            {settings?.creci && (
              <p className='mb-4 text-xs text-gray-500'>
                CRECI: {settings.creci}
              </p>
            )}
            <div className='flex gap-3'>
              {settings?.facebook && (
                <a
                  href={
                    settings.facebook.startsWith('http')
                      ? settings.facebook
                      : `https://facebook.com/${settings.facebook}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20'
                >
                  <Facebook className='h-4 w-4' />
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={
                    settings.instagram.startsWith('http')
                      ? settings.instagram
                      : `https://instagram.com/${settings.instagram}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20'
                >
                  <Instagram className='h-4 w-4' />
                </a>
              )}
              {settings?.tiktok && (
                <a
                  href={
                    settings.tiktok.startsWith('http')
                      ? settings.tiktok
                      : `https://tiktok.com/@${settings.tiktok}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20'
                >
                  <TikTokIcon className='h-4 w-4' />
                </a>
              )}
              {!settings?.facebook &&
                !settings?.instagram &&
                !settings?.tiktok && (
                  <>
                    <a
                      href='#'
                      className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20'
                    >
                      <Facebook className='h-4 w-4' />
                    </a>
                    <a
                      href='#'
                      className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20'
                    >
                      <Instagram className='h-4 w-4' />
                    </a>
                  </>
                )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='mb-4 font-semibold'>Menu Rápido</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li>
                <a href='/' className='hover:text-white'>
                  Início
                </a>
              </li>
              <li>
                <a href='/imoveis?finality=SALE' className='hover:text-white'>
                  Imóveis para Comprar
                </a>
              </li>
              <li>
                <a href='/imoveis?finality=RENT' className='hover:text-white'>
                  Imóveis para Alugar
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-white'
                >
                  Cadastre seu Imóvel
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='mb-4 font-semibold'>Contato</h4>
            <ul className='space-y-3 text-sm text-gray-400'>
              <li className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-[#3b82f6]' />
                <span>
                  {endereco}
                  <br />
                  {cidade} - {uf}
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <Phone className='h-4 w-4 shrink-0 text-[#3b82f6]' />
                <span>{telefone}</span>
              </li>
              <li className='flex items-center gap-2'>
                <Mail className='h-4 w-4 shrink-0 text-[#3b82f6]' />
                <span>{email}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className='mb-4 font-semibold'>Horário de Atendimento</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li className='flex justify-between'>
                <span className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-[#3b82f6]' />
                  Seg - Sex
                </span>
                <span className='text-white'>08:00 - 18:00</span>
              </li>
              <li className='flex justify-between'>
                <span className='ml-6'>Sábado</span>
                <span className='text-white'>09:00 - 13:00</span>
              </li>
              <li className='flex justify-between'>
                <span className='ml-6'>Domingo</span>
                <span className='text-red-400'>Fechado</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className='border-t border-white/10'>
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8'>
          <p>© 2025 {companyName}. Todos os direitos reservados.</p>
          <div className='flex gap-6'>
            <a href='/termos-de-uso' className='hover:text-white'>
              Termos de Uso
            </a>
            <a href='/privacidade' className='hover:text-white'>
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
