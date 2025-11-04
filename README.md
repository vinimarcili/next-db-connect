# Next.js PostgreSQL Database Connection

Este é um projeto [Next.js](https://nextjs.org) com integração ao PostgreSQL/Supabase usando TypeORM. O projeto inclui um sistema de inscrições (subscribers) com funcionalidades de criação e exportação de dados em CSV.

## 🚀 Funcionalidades

- ✅ **Formulário de Inscrição**: Interface para coleta de dados de usuários
- ✅ **Integração PostgreSQL/Supabase**: Conexão com Supabase usando TypeORM
- ✅ **Validação de Dados**: Validação completa de nome, email e gênero
- ✅ **Export CSV Protegido**: Download de dados com autenticação Basic Auth
- ✅ **API REST**: Endpoints para criação e consulta de subscribers
- ✅ **Deploy Simples**: Configuração otimizada para Vercel

## 🛠️ Tecnologias

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeORM
- **Database**: PostgreSQL (Supabase)
- **Validação**: Sistema personalizado de validação
- **Autenticação**: Basic Auth para rotas administrativas
- **Deploy**: Vercel

## ⚙️ Configuração do Ambiente

1. **Clone o repositório**

```bash
git clone <repository-url>
cd next-db-connect
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Configure as seguintes variáveis no `.env.local` segundo o `.env.exemple`

4. **Execute o servidor de desenvolvimento**

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📡 API Endpoints

### POST /api/subscribers

Cria um novo subscriber no sistema.

**Payload:**

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "gender": "male"
}
```

**Resposta de Sucesso:**

```json
{
  "success": true,
  "message": "Subscriber salvo com sucesso! (criado ou atualizado)"
}
```

**Validações:**

- **Nome**: Obrigatório, mínimo 2 caracteres
- **Email**: Obrigatório, formato válido
- **Gênero**: Obrigatório, valores: "male", "female", "other"

### GET /api/subscribers (Protegido)

Exporta todos os subscribers em formato CSV.

**Autenticação:** Basic Auth (credenciais definidas nas variáveis de ambiente)

**Headers Obrigatórios:**

```bash
Authorization: Basic <base64(username:password)>
```

**Resposta:** Arquivo CSV para download

### Formato do CSV

O arquivo CSV contém as seguintes colunas:

- **ID**: Identificador único
- **Nome**: Nome completo do subscriber
- **Email**: Endereço de email
- **Gênero**: Gênero selecionado (male/female/other)
- **Data Criação**: Data de criação (YYYY-MM-DD)
- **Data Atualização**: Data da última atualização (YYYY-MM-DD)

## 📁 Estrutura do Projeto

```bash
next-db-connect/
├── 📁 public/                          # Arquivos estáticos públicos
├── 📁 src/
│   ├── 📁 app/                         # App Router do Next.js 16
│   │   ├── 📁 (components)/            # Componentes da página
│   │   ├── 📁 api/                     # API Routes
│   │   │   ├── 📁 (auth)/              # Middleware de autenticação
│   │   │   ├── 📁 subscribers/         # Endpoints dos subscribers
│   │   │   │   ├── 📁 (helpers)/       # Funções auxiliares
│   │   │   │   └── 📁 (use-cases)/     # Casos de uso (business logic)
│   │   │   └── 📁 test-db/             # Endpoint de teste da DB
│   │   │       └── 📁 (use-cases)/
│   │   ├── globals.css                 # Estilos globais
│   │   ├── layout.tsx                  # Layout principal
│   │   └── page.tsx                    # Página inicial
│   ├── 📁 db/                          # Configuração do banco de dados
│   │   ├── data-source.ts              # Configuração TypeORM (PostgreSQL)
│   │   ├── 📁 entities/                # Entidades do banco
│   │   └── 📁 sql/                     # Scripts SQL
│   ├── 📁 interfaces/                  # Definições de tipos/interfaces
│   ├── 📁 types/                       # Tipos globais TypeScript
│   ├── 📁 ui/                          # Componentes de interface
│   │   ├── 📁 components/              # Componentes reutilizáveis
│   │   └── 📁 utils/                   # Utilitários de UI
│   ├── 📁 utils/                       # Utilitários gerais
│   └── 📁 validators/                  # Sistema de validação
│       ├── validator.ts                # Validador principal
│       └── 📁 types/                   # Tipos específicos de validação
├── 📄 .env.example                     # Exemplo de variáveis de ambiente
├── 📄 eslint.config.mjs                # Configuração ESLint
├── 📄 next.config.ts                   # Configuração Next.js
├── 📄 package.json                     # Dependências e scripts
├── 📄 postcss.config.mjs               # Configuração PostCSS
├── 📄 tsconfig.json                    # Configuração TypeScript
├── 📄 README.md                        # Documentação do projeto
```

### 🏗️ **Arquitetura do Projeto**

#### **Frontend (App Router)**

- **Components**: Componentes React reutilizáveis com TypeScript
- **Pages**: Estrutura baseada no App Router do Next.js 16
- **Styling**: Tailwind CSS para estilização

#### **Backend (API Routes)**

- **Clean Architecture**: Separação em use-cases, helpers e routes
- **Authentication**: Basic Auth para endpoints protegidos
- **Database**: PostgreSQL via Supabase com TypeORM

#### **Database Layer**

- **ORM**: TypeORM para mapeamento objeto-relacional
- **Migrations**: Scripts SQL para criação/atualização de tabelas
- **Entities**: Classes que representam as tabelas do banco

#### **Validation System**

- **Custom Validators**: Sistema modular de validação
- **Type Safety**: Validações tipadas com TypeScript
- **Composable**: Validadores podem ser combinados

## � Deploy na Vercel

1. **Configure as variáveis de ambiente na Vercel:**
   - Dashboard Vercel → Settings → Environment Variables
   - Adicione a `DATABASE_URL` e outras variáveis necessárias

2. **Deploy automático:**

   ```bash
   git add .
   git commit -m "feat: update project configuration"
   git push origin main
   ```

3. **Teste em produção:**
   - `https://seu-app.vercel.app/api/test-db`
   - `https://seu-app.vercel.app`

## 🔄 Migração Oracle → PostgreSQL

Este projeto foi migrado do Oracle Cloud para PostgreSQL/Supabase. Consulte o arquivo `POSTGRESQL_MIGRATION.md` para detalhes completos sobre:

- ✅ Vantagens da migração
- ⚙️ Diferenças na configuração  
- 📋 Passos da migração
- 🔧 Troubleshooting

## �🔧 Comandos Úteis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção  
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa linting do código

## 📚 Recursos Adicionais

- [Next.js Documentation](https://nextjs.org/docs) - Framework React
- [TypeORM Documentation](https://typeorm.io/) - ORM para TypeScript
- [Supabase Documentation](https://supabase.com/docs) - Backend-as-a-Service
- [Vercel Documentation](https://vercel.com/docs) - Plataforma de deploy
- [Tailwind CSS](https://tailwindcss.com/docs) - Framework CSS
