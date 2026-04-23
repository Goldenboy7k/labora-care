# Documentação Técnica - LaboraCare

## Visão Geral da Arquitetura

O LaboraCare é uma aplicação full-stack para gestão de laboratórios, seguindo uma arquitetura moderna com separação clara entre frontend e backend.

## Arquitetura Geral

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Supabase      │
│   (React)       │◄──►│   (Express)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - Dashboard     │    │ - REST API      │    │ - Auth          │
│ - Laboratórios  │    │ - Auth          │    │ - Database      │
│ - Equipamentos  │    │ - Validation    │    │ - RLS Policies  │
│ - Manutenções   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Componentes Principais

#### App.tsx
- **Responsabilidade**: Configuração de rotas e providers globais
- **Providers**:
  - `QueryClientProvider`: Cache de dados
  - `TooltipProvider`: Tooltips globais
  - `AuthProvider`: Autenticação
  - `BrowserRouter`: Roteamento

#### Páginas

##### Dashboard (`/`)
- **Funcionalidade**: Visão geral do sistema
- **Componentes**:
  - `KpiCard`: Métricas principais
  - Cards de laboratórios (clicáveis)
  - Lista de manutenções recentes

##### LaboratoryDetails (`/laboratorio/:id`)
- **Funcionalidade**: Detalhes específicos de um laboratório
- **Features**:
  - Lista de equipamentos
  - Modal de adição de equipamentos
  - Controle de permissões

##### Login/Cadastro
- **Autenticação**: Via Supabase Auth
- **Validação**: Formulários com feedback

### Hooks Customizados

#### useAuth
```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  isTecnico: boolean;
  signOut: () => Promise<void>;
}
```

**Funcionalidades**:
- Gerenciamento de sessão
- Controle de roles
- Métodos de autenticação

### Gerenciamento de Estado

#### React Query
- **Cache**: Dados da API
- **Sincronização**: Estado server/client
- **Mutations**: Atualizações otimizadas

#### Estado Local
- **Formulários**: Controlled components
- **UI State**: Modais, loading, etc.

## Backend Architecture

### Estrutura de Diretórios

```
backend/
├── src/
│   ├── index.ts          # Ponto de entrada
│   ├── config/           # Configurações
│   │   └── supabase.ts   # Cliente Supabase
│   ├── middleware/       # Middlewares
│   │   └── auth.ts       # Autenticação JWT
│   ├── routes/           # Rotas da API
│   │   ├── auth.ts       # Autenticação
│   │   ├── equipment.ts  # Equipamentos
│   │   ├── laboratories.ts # Laboratórios
│   │   └── maintenance.ts  # Manutenções
│   └── models/           # Tipos/Modelos
│       └── types.ts      # Definições TypeScript
├── migrations/           # Migrações DB
└── package.json
```

### API Routes

#### Autenticação (`/auth`)
```typescript
POST /auth/signup
POST /auth/login
GET /auth/profile
```

#### Equipamentos (`/equipment`)
```typescript
GET /equipment           # Lista com filtros
GET /equipment/:id       # Detalhes
POST /equipment          # Criar
PUT /equipment/:id       # Atualizar
DELETE /equipment/:id    # Remover
```

#### Laboratórios (`/laboratories`)
```typescript
GET /laboratories        # Lista
GET /laboratories/:id    # Detalhes com equipamentos
```

#### Manutenções (`/maintenance`)
```typescript
GET /maintenance         # Lista com filtros
POST /maintenance        # Criar
PUT /maintenance/:id     # Atualizar status
```

### Middlewares

#### Autenticação (`auth.ts`)
```typescript
export function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
}
```

#### Autorização por Roles
```typescript
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user.roles.includes(role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

## Banco de Dados

### Schema Principal

#### users (via Supabase Auth)
- `id`: UUID (PK)
- `email`: TEXT
- `full_name`: TEXT
- `created_at`: TIMESTAMP

#### user_roles
- `id`: UUID (PK)
- `user_id`: UUID (FK → auth.users)
- `role`: app_role ENUM

#### profiles
- `id`: UUID (PK)
- `user_id`: UUID (FK → auth.users)
- `full_name`: TEXT
- `phone`: TEXT
- `position`: TEXT
- `lab_id`: TEXT

#### equipment
- `id`: UUID (PK)
- `name`: TEXT
- `brand`: TEXT
- `model`: TEXT
- `serial_number`: TEXT
- `lab_id`: TEXT
- `status`: equipment_status
- `acquisition_date`: DATE
- `last_maintenance`: DATE

#### maintenance
- `id`: UUID (PK)
- `equipment_id`: UUID (FK → equipment)
- `type`: maintenance_type
- `status`: maintenance_status
- `scheduled_date`: DATE
- `completed_date`: DATE
- `description`: TEXT
- `responsible`: TEXT

### Row Level Security (RLS)

#### Policies de Segurança

```sql
-- Usuários só veem seus próprios perfis
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = user_id);

-- Técnicos podem ver equipamentos de seus laboratórios
CREATE POLICY "Technicians can view lab equipment" ON equipment
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('tecnico', 'admin')
  )
);
```

## Segurança

### Autenticação
- **Supabase Auth**: JWT tokens
- **Refresh Tokens**: Automático
- **Session Management**: Persistência local

### Autorização
- **Role-Based Access Control**: 3 níveis (user, tecnico, admin)
- **API Guards**: Middleware de validação
- **Database RLS**: Segurança a nível de linha

### Validação
- **Input Sanitization**: Prevenção XSS
- **Type Validation**: TypeScript + Joi/Zod
- **SQL Injection**: Prepared statements (Supabase)

## Performance

### Otimizações Frontend
- **Code Splitting**: Lazy loading de rotas
- **Image Optimization**: Next.js Image component (futuro)
- **Bundle Analysis**: Webpack Bundle Analyzer
- **Caching**: React Query + Service Worker

### Otimizações Backend
- **Database Indexing**: Índices em campos de busca
- **Query Optimization**: N+1 queries prevention
- **Caching**: Redis (futuro)
- **Rate Limiting**: Express rate limit

## Testes

### Estratégia de Testes
- **Unit Tests**: Componentes e funções puras
- **Integration Tests**: API endpoints
- **E2E Tests**: Fluxos completos (Playwright)

### Cobertura
- **Frontend**: 80%+ coverage
- **Backend**: 90%+ coverage
- **Critical Paths**: 100% coverage

## Deploy

### Ambiente de Desenvolvimento
```bash
# Frontend
npm run dev

# Backend
npm run dev

# Database
supabase start
```

### Produção
- **Frontend**: Vercel/Netlify
- **Backend**: Railway/Render
- **Database**: Supabase Production
- **CDN**: Cloudflare

### CI/CD
- **GitHub Actions**: Automated testing
- **Preview Deployments**: Pull requests
- **Environment Secrets**: Secure credentials

## Monitoramento

### Métricas
- **Performance**: Core Web Vitals
- **Errors**: Sentry
- **Analytics**: Plausible/PostHog
- **Uptime**: UptimeRobot

### Logs
- **Application Logs**: Winston
- **Database Logs**: Supabase dashboard
- **Error Tracking**: Centralized logging

## Manutenção

### Rotinas
- **Database Backups**: Diários
- **Dependency Updates**: Dependabot
- **Security Audits**: Mensal
- **Performance Reviews**: Trimestral

### Documentação
- **API Docs**: OpenAPI/Swagger
- **Code Comments**: JSDoc
- **Architecture Docs**: ADRs
- **User Guides**: Markdown

---

Esta documentação deve ser atualizada conforme o projeto evolui.