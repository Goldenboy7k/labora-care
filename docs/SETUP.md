# Guia de Configuração - LaboraCare

Este documento explica como configurar o ambiente de desenvolvimento e produção do LaboraCare.

## Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Conta no [Supabase](https://supabase.com)

## 1. Configuração do Supabase

### 1.1 Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: `labora-care`
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a região mais próxima (ex: São Paulo)

### 1.2 Configurar Autenticação

No painel do Supabase, vá para **Authentication > Settings**:

1. **Site URL**: `http://localhost:8080` (desenvolvimento)
2. **Redirect URLs**: Adicione `http://localhost:8080`
3. **JWT Expiry**: 3600 segundos (1 hora)

### 1.3 Executar Migrações

No painel do Supabase, vá para **SQL Editor** e execute o conteúdo do arquivo `supabase/migrations/20260404030512_3863ae16-3f10-4597-94a8-daf0736c21b3.sql`

### 1.4 Configurar Row Level Security (RLS)

Execute as seguintes políticas no SQL Editor:

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_requests ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- Políticas para technician_requests
CREATE POLICY "Users can view own requests" ON public.technician_requests
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests" ON public.technician_requests
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 2. Configuração do Projeto

### 2.1 Clonar e Instalar

```bash
git clone <URL_DO_REPOSITORIO>
cd labora-care-main

# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd backend
npm install
cd ..
```

### 2.2 Variáveis de Ambiente

#### Frontend (.env)

Crie o arquivo `.env` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=mvoniespmppsizyntwpw
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12b25pZXNwbXBwc2l6eW50d3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjU1NzAsImV4cCI6MjA5MDg0MTU3MH0.yTLbnu75IorojLhvdTYX_CKKItRVHJfvFAa5rktF5C8
VITE_SUPABASE_URL=https://mvoniespmppsizyntwpw.supabase.co
```

#### Backend (backend/.env)

Crie o arquivo `backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://mvoniespmppsizyntwpw.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12b25pZXNwbXBwc2l6eW50d3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjU1NzAsImV4cCI6MjA5MDg0MTU3MH0.yTLbnu75IorojLhvdTYX_CKKItRVHJfvFAa5rktF5C8
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# CORS Configuration
CORS_ORIGIN=http://localhost:8080
```

> **Nota**: Para obter a `SUPABASE_SERVICE_ROLE_KEY`, vá no painel do Supabase > Settings > API > service_role key

## 3. Executar o Projeto

### Desenvolvimento

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

Acesse `http://localhost:8080` no navegador.

### Usuário de Teste

- **Email**: admin2k26@gmail.com
- **Senha**: Teste12345
- **Tipo**: Usuário (permissões limitadas)

## 4. Configuração de Produção

### 4.1 Build do Frontend

```bash
npm run build
```

### 4.2 Deploy

#### Opção 1: Vercel (Recomendado)

1. Conecte o repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático

#### Opção 2: Netlify

1. Conecte o repositório no [Netlify](https://netlify.com)
2. Configure o build command: `npm run build`
3. Configure o publish directory: `dist`
4. Adicione as variáveis de ambiente

### 4.3 Backend

#### Opção 1: Railway

1. Conecte o repositório no [Railway](https://railway.app)
2. Configure o root directory: `backend`
3. Configure as variáveis de ambiente
4. Deploy automático

#### Opção 2: Render

1. Crie um novo Web Service no [Render](https://render.com)
2. Conecte o repositório
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

## 5. Troubleshooting

### Erro: "Missing SUPABASE_URL"

- Verifique se o arquivo `.env` existe
- Confirme se as variáveis estão corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Invalid login credentials"

- Verifique se o usuário existe no Supabase
- Confirme se a senha está correta
- Verifique se o email foi confirmado (se necessário)

### Erro: "CORS error"

- Verifique a configuração do `CORS_ORIGIN` no backend
- Adicione a URL de produção nas configurações do Supabase

### Erro: "RLS policy violation"

- Verifique se as políticas RLS estão configuradas
- Confirme se o usuário tem as permissões necessárias
- Verifique os logs do Supabase

## 6. Desenvolvimento Avançado

### Adicionando Novos Campos

1. **Database**: Adicione coluna na migração SQL
2. **Types**: Atualize `src/integrations/supabase/types.ts`
3. **Frontend**: Atualize interfaces em `src/data/mockData.ts`
4. **API**: Adicione endpoints no backend se necessário

### Testes

```bash
# Frontend
npm run test

# Backend
cd backend
npm run test
```

### Linting

```bash
# Frontend
npm run lint

# Backend
cd backend
npm run lint
```

## 7. Suporte

Para dúvidas ou problemas:

1. Verifique os logs da aplicação
2. Consulte a documentação técnica em `docs/TECHNICAL.md`
3. Abra uma issue no repositório
4. Entre em contato com a equipe de desenvolvimento

---

**Última atualização**: Abril 2026