# Shadcn Admin Dashboard

Dashboard administrativo moderno construído com React, Shadcn/UI, Vite e TypeScript. O backend é gerenciado via Hono e Better Auth.

## 🚀 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (Versão 20 ou superior recomendada)
- [pnpm](https://pnpm.io/installation) (Gerenciador de pacotes)
- [PostgreSQL](https://www.postgresql.org/) (Banco de dados)

## 🛠️ Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/murilobento/dashboard-modelo.git
    cd dashboard-modelo
    ```

2.  **Instale as dependências:**
    Este projeto utiliza workspaces, então o comando abaixo instalará dependências tanto para o frontend quanto para o backend.

    ```bash
    pnpm install
    ```

## ⚙️ Configuração do Ambiente

Você precisará configurar as variáveis de ambiente para o frontend e para o servidor.

### 1. Frontend (.env)

Na raiz do projeto, crie um arquivo `.env` baseando-se no exemplo:

```bash
cp .env.example .env
```

Certifique-se de que o `VITE_API_URL` está apontando para o seu backend (padrão é localhost:3000):

```env
VITE_API_URL=http://localhost:3000
```

### 2. Backend (server/.env)

Crie um arquivo `.env` dentro da pasta `server/`:

```bash
cd server
touch .env
```

Adicione as seguintes variáveis ao arquivo `server/.env`:

```env
# URL de conexão com o PostgreSQL
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco

# Segredo para autenticação - Gere uma string segura
BETTER_AUTH_SECRET=sua_chave_secreta_super_segura

# URL base do servidor de autenticação
BETTER_AUTH_URL=http://localhost:3000
```

_Dica: Você pode gerar uma chave secreta rodando `openssl rand -base64 32` no terminal._

## 🗄️ Configuração do Banco de Dados (Prisma ORM)

### 1. Inicializar Prisma

Após instalar as dependências, gere o cliente do Prisma:

```bash
cd server
npx prisma generate
```

### 2. Sincronizar Banco de Dados

Para criar as tabelas no banco de dados baseando-se no schema do Prisma:

```bash
cd server
npx prisma db push
```

### 3. Zerar e Popular Banco de Dados (Reset & Seed)

Para **apagar todos os dados**, recriar as tabelas e inserir o usuário administrador padrão:

```bash
cd server
npx prisma db seed
```

⚠️ **Atenção:** Este comando apaga todos os dados do banco!

**Credenciais do Admin Criado:**

- **Email:** `admin@admin.com`
- **Senha:** `admin123`

### 4. Criar e Aplicar Migrações (Desenvolvimento)

Para criar uma nova migração baseada em alterações no `schema.prisma`:

```bash
cd server
npx prisma migrate dev --name nome_da_migracao
```

Isso irá gerar arquivos SQL na pasta `server/prisma/migrations` e aplicá-los ao banco.

## ▶️ Executando o Projeto

Para iniciar tanto o frontend quanto o backend simultaneamente em modo de desenvolvimento:

```bash
pnpm dev:all
```

- **Frontend:** Acessível em `http://localhost:5173`
- **Backend:** Rodando em `http://localhost:3000`

### Outros Comandos Úteis

- **Apenas Frontend:** `pnpm dev`
- **Apenas Backend:** `pnpm dev:server`
- **Build de Produção:** `pnpm build`
- **Linting:** `pnpm lint`
- **Formatação:** `pnpm format`

## 🏗️ Estrutura do Projeto

- `/src` - Código fonte do Frontend (React, Shadcn, TanStack Router)
- `/server` - Backend (Hono, Better Auth, Drizzle/TypeORM/Pg)
- `/public` - Arquivos estáticos

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).
