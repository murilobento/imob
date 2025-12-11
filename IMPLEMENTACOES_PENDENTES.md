# Implementações Pendentes

Este documento lista as funcionalidades que ainda precisam ser implementadas no sistema.

---

## 1. Filtros e Ordenação em /imoveis

**Status:** 🔴 Não funcional

**Descrição:**
Os filtros e a ordenação na página de listagem de imóveis (`/imoveis`) não estão funcionando corretamente.

**O que precisa ser feito:**
- Revisar a lógica de filtragem no frontend (provavelmente em query params ou estado local)
- Garantir que os filtros (tipo, preço, quartos, etc.) sejam enviados corretamente para a API
- Implementar ordenação (preço crescente/decrescente, mais recentes, etc.)
- Sincronizar estado dos filtros com a URL para permitir compartilhamento de links filtrados

---

## 2. Buscador da Hero não Filtra

**Status:** 🔴 Não funcional

**Descrição:**
O componente de busca na seção Hero da página inicial não está redirecionando/filtrando os resultados em `/imoveis`.

**O que precisa ser feito:**
- Capturar os valores do formulário de busca da Hero
- Redirecionar para `/imoveis` com os parâmetros de busca na URL (query strings)
- Garantir que a página `/imoveis` leia esses parâmetros e aplique os filtros automaticamente

---

## 3. Entidade de Depoimentos (Testimonials)

**Status:** 🟡 Nova funcionalidade

**Descrição:**
Criar uma entidade para gerenciar depoimentos de clientes que serão exibidos na seção de depoimentos do site.

**Estrutura sugerida:**
```prisma
model Testimonial {
  id        String   @id @default(cuid())
  name      String   // Nome do cliente
  content   String   // Texto do depoimento
  rating    Int      // Avaliação (1-5 estrelas)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**O que precisa ser feito:**
- Criar migration no Prisma
- Criar endpoints CRUD no backend
- Criar página de gerenciamento no admin
- Atualizar a seção de depoimentos no site para consumir dados do banco

---

## 4. Horário de Atendimento em Company Settings

**Status:** 🟡 Nova funcionalidade

**Descrição:**
Adicionar campos para configurar o horário de atendimento da imobiliária/corretor.

**Campos sugeridos:**
```prisma
// Adicionar em CompanySettings
businessHoursStart    String?  // Ex: "08:00"
businessHoursEnd      String?  // Ex: "18:00"
businessDays          String?  // Ex: "Segunda a Sexta" ou JSON com dias
weekendHoursStart     String?  // Horário aos sábados (opcional)
weekendHoursEnd       String?
```

**O que precisa ser feito:**
- Adicionar campos na tabela `CompanySettings`
- Atualizar formulário de configurações no admin
- Exibir horário de atendimento no site (footer, contato, etc.)

---

## 5. Páginas de Termos de Uso e Privacidade

**Status:** 🟡 Nova funcionalidade

**Descrição:**
Criar páginas estáticas de Termos de Uso e Política de Privacidade adequadas para corretores autônomos.

**O que precisa ser feito:**
- Criar rota `/termos-de-uso`
- Criar rota `/politica-de-privacidade`
- Redigir conteúdo baseado em:
  - LGPD (Lei Geral de Proteção de Dados)
  - Coleta de dados de leads
  - Uso de cookies
  - Direitos do usuário
  - Responsabilidades do corretor
- Adicionar links no footer do site

---

## 6. Dados do Corretor em Company Settings

**Status:** 🟡 Nova funcionalidade

**Descrição:**
Adicionar campos para informações do corretor autônomo, que serão exibidos nos detalhes dos imóveis.

**Campos sugeridos:**
```prisma
// Adicionar em CompanySettings
agentName       String?  // Nome do corretor
agentPhoto      String?  // URL da foto do corretor
```

**O que precisa ser feito:**
- Adicionar campos na tabela `CompanySettings`
- Implementar upload de foto do corretor
- Atualizar formulário de configurações no admin
- Exibir card do corretor na página de detalhes do imóvel

---

## 7. Campo "Em Destaque" (isFeatured)

**Status:** 🟡 Nova funcionalidade

**Descrição:**
Permitir marcar imóveis como "em destaque" para exibição especial na home, com limite de 4 imóveis.

**Campos sugeridos:**
```prisma
// Adicionar em Property/Imovel
isFeatured Boolean @default(false)
```

**O que precisa ser feito:**
- Adicionar campo `isFeatured` na entidade de imóveis
- Implementar validação no backend: máximo de 4 imóveis com `isFeatured = true`
- Adicionar toggle no formulário de edição do imóvel
- Alimentar seção de "Imóveis em Destaque" na home
- Exibir badge/selo nos imóveis destacados

**Regra de negócio:**
- Ao tentar marcar um 5º imóvel como destaque, exibir erro ou solicitar que o usuário remova um dos atuais

---

## 8. Controle de Exibição do Mapa

**Status:** 🟡 Nova funcionalidade

**Descrição:**
Permitir que o corretor escolha se o mapa será exibido ou não na página de detalhes de cada imóvel.

**Campos sugeridos:**
```prisma
// Adicionar em Property/Imovel
showMap Boolean @default(true)
```

**O que precisa ser feito:**
- Adicionar campo `showMap` na entidade de imóveis
- Adicionar checkbox no formulário de cadastro/edição
- Condicionar a renderização do mapa no site: só exibir se `showMap === true`

**Caso de uso:**
- Alguns proprietários não querem divulgar a localização exata antes do contato

---

## 9. Upload de Imagens dos Imóveis

**Status:** 🔴 Não implementado

**Descrição:**
Implementar sistema de upload de imagens para os imóveis, com uma imagem principal e imagens secundárias para o carrossel.

**Estrutura sugerida:**
```prisma
model PropertyImage {
  id         String   @id @default(cuid())
  url        String
  isPrimary  Boolean  @default(false)
  order      Int      @default(0)
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
}
```

**O que precisa ser feito:**
- Criar tabela de imagens relacionada aos imóveis
- Implementar upload de arquivos (considerar Cloudinary, S3, ou storage local)
- Permitir definir qual imagem é a principal
- Permitir reordenar imagens do carrossel
- Implementar preview e exclusão de imagens
- Exibir carrossel na página de detalhes do imóvel

---

## 10. Entidade de Leads

**Status:** 🟡 Nova funcionalidade

**Descrição:**
Criar entidade para armazenar leads gerados através do formulário de contato na página de detalhes do imóvel.

**Estrutura sugerida:**
```prisma
model Lead {
  id          String    @id @default(cuid())
  name        String
  email       String
  phone       String?
  message     String?
  propertyId  String?
  property    Property? @relation(fields: [propertyId], references: [id])
  status      String    @default("new") // new, contacted, negotiating, converted, lost
  source      String?   // website, whatsapp, etc.
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**O que precisa ser feito:**
- Criar migration no Prisma
- Criar endpoint para receber dados do formulário
- Salvar lead vinculado ao imóvel de interesse
- Criar página de listagem de leads no admin
- Implementar notificação (email/push) ao receber novo lead

---

## 11. Kanban para Gerenciamento de Leads

**Status:** 🟡 Nova funcionalidade

**Descrição:**
Criar um quadro Kanban para gerenciar o funil de leads, permitindo arrastar cards entre colunas e converter leads em clientes.

**Colunas sugeridas:**
1. **Novo** - Leads recém-chegados
2. **Contatado** - Já houve primeiro contato
3. **Em Negociação** - Interesse confirmado, negociando
4. **Convertido** - Fechou negócio ✅
5. **Perdido** - Não converteu ❌

**O que precisa ser feito:**
- Implementar interface de Kanban (usar biblioteca como `@hello-pangea/dnd` ou `react-beautiful-dnd`)
- Permitir drag-and-drop entre colunas
- Atualizar status do lead ao mover
- Na coluna "Convertido": adicionar botão para cadastrar lead como Customer
- Preencher automaticamente dados do lead no formulário de Customer
- Adicionar filtros por período, imóvel, etc.

**Fluxo de conversão:**
```
Lead (Convertido) → Botão "Cadastrar como Cliente" → Formulário de Customer pré-preenchido → Salvar
```

---

## Priorização Sugerida

| Prioridade | Item | Justificativa |
|------------|------|---------------|
| 🔴 Alta | Filtros e ordenação | Funcionalidade básica quebrada |
| 🔴 Alta | Buscador da Hero | Funcionalidade básica quebrada |
| 🔴 Alta | Upload de imagens | Essencial para cadastro de imóveis |
| 🟠 Média | Leads + Kanban | Core do negócio - captação de clientes |
| 🟠 Média | Campo isFeatured | Melhora a apresentação da home |
| 🟡 Normal | Dados do corretor | Personalização importante |
| 🟡 Normal | Depoimentos | Social proof |
| 🟡 Normal | Horário de atendimento | Informação útil |
| 🟢 Baixa | Controle do mapa | Nice to have |
| 🟢 Baixa | Termos e Privacidade | Compliance (importante, mas pode ser texto estático inicial) |

---

## Observações Técnicas

- **Stack identificada:** React + TanStack Router + Prisma + Node.js
- **Banco de dados:** Provavelmente PostgreSQL (verificar em `server/prisma`)
- **Upload de arquivos:** Avaliar melhor solução (Cloudinary recomendado para simplicidade)
- **Kanban:** Considerar estado local + persistência no banco para performance
