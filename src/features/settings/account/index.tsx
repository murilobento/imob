import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Minha Conta'
      desc='Atualize as configurações da sua conta.'
    >
      <AccountForm />
    </ContentSection>
  )
}
