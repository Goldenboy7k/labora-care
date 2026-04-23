# LaboraCare - Sistema de Gestão de Laboratórios SENAI

Sistema completo para gestão de laboratórios do SENAI Alagoinhas, desenvolvido com tecnologias modernas para controle de equipamentos, manutenções e usuários.

## 🚀 Funcionalidades

### 📊 Dashboard
- **Visão Geral**: KPIs principais (total de equipamentos, manutenções pendentes/atrasadas)
- **Laboratórios Interativos**: Cards clicáveis para acessar detalhes de cada laboratório
- **Manutenções Recentes**: Lista das próximas manutenções por laboratório

### 🏭 Gestão de Laboratórios
- **Visualização Detalhada**: Equipamentos, manutenções e estatísticas por laboratório
- **Controle de Acesso**: Diferentes permissões por tipo de usuário
- **Navegação Intuitiva**: Interface responsiva e moderna

### 🔧 Gestão de Equipamentos
- **Cadastro Completo**: Nome, marca, modelo, número de série, status
- **Controle de Manutenções**: Histórico e agendamento
- **Status em Tempo Real**: Operacional, em manutenção, inativo

### 👥 Sistema de Usuários
- **Perfis de Acesso**:
  - **Usuário**: Acesso básico para visualização
  - **Técnico**: Pode adicionar/editar equipamentos e manutenções
  - **Administrador**: Controle total do sistema
- **Autenticação Segura**: Login com email e senha via Supabase

### 📋 Manutenções
- **Tipos**: Preventiva e corretiva
- **Status**: Pendente, em andamento, concluída, atrasada
- **Agendamento**: Controle de datas e responsáveis

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **React Router** - Roteamento
- **React Query** - Gerenciamento de estado server
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **TypeScript** - Tipagem
- **Supabase** - Banco de dados e autenticação
- **PostgreSQL** - Banco de dados

### Infraestrutura
- **Supabase** - BaaS (Backend as a Service)
- **Vercel/Netlify** - Deploy (opcional)

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ e npm
- Conta no Supabase

### 1. Clone o Repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd labora-care-main
```

### 2. Instale as Dependências

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Configure o Supabase

#### 3.1 Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e as chaves da API

#### 3.2 Configure as variáveis de ambiente

**Frontend (.env):**
```env
VITE_SUPABASE_PROJECT_ID=seu_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
VITE_SUPABASE_URL=https://seu-project.supabase.co
```

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://seu-project.supabase.co
SUPABASE_KEY=sua_chave_de_servico
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
CORS_ORIGIN=http://localhost:8080
```

#### 3.3 Execute as migrações do banco
```bash
cd backend
# Execute as migrações no painel do Supabase ou via CLI
```

### 4. Execute o Projeto

#### Desenvolvimento
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

#### Build para produção
```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
```

## 🗂️ Estrutura do Projeto

```
labora-care-main/
├── src/                    # Código fonte frontend
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes base (shadcn/ui)
│   │   └── ...
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Hooks customizados
│   ├── lib/               # Utilitários
│   ├── data/              # Dados mock
│   └── integrations/      # Integrações externas
├── backend/               # API backend
│   ├── src/
│   │   ├── routes/        # Rotas da API
│   │   ├── middleware/    # Middlewares
│   │   ├── config/        # Configurações
│   │   └── models/        # Modelos de dados
│   └── migrations/        # Migrações do banco
├── supabase/              # Configurações Supabase
└── public/                # Assets estáticos
```

## 🔐 Sistema de Permissões

### Usuário (user)
- ✅ Visualizar dashboard
- ✅ Visualizar laboratórios
- ✅ Visualizar equipamentos
- ❌ Adicionar/editar equipamentos
- ❌ Gerenciar manutenções

### Técnico (tecnico)
- ✅ Todas as permissões de usuário
- ✅ Adicionar equipamentos
- ✅ Editar equipamentos próprios
- ✅ Registrar manutenções
- ❌ Aprovar cadastros de técnicos
- ❌ Gerenciar usuários

### Administrador (admin)
- ✅ Todas as permissões
- ✅ Gerenciar usuários
- ✅ Aprovar cadastros
- ✅ Acesso completo ao sistema

## 📊 Dados Iniciais

O sistema inclui dados mock para demonstração:

### Laboratórios
- Eletrotécnica (24 equipamentos)
- Automação (18 equipamentos)
- Pneumática (15 equipamentos)
- Logística (12 equipamentos)
- Usinagem (20 equipamentos)
- Química (30 equipamentos)
- Predial Elétrica (16 equipamentos)

### Usuário de Teste
- **Email**: admin2k26@gmail.com
- **Senha**: Teste12345
- **Tipo**: Usuário (para testar permissões limitadas)

## 🚀 Scripts Disponíveis

### Frontend
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run test         # Executa testes
```

### Backend
```bash
npm run dev          # Inicia servidor com hot reload
npm run build        # Compila TypeScript
npm run start        # Inicia servidor de produção
```

## 🔧 Desenvolvimento

### Adicionando Novos Componentes
1. Use os componentes base do shadcn/ui
2. Siga o padrão de nomenclatura PascalCase
3. Implemente TypeScript strict
4. Adicione PropTypes quando necessário

### Trabalhando com Dados
- Dados mock estão em `src/data/mockData.ts`
- Para produção, substitua por chamadas da API
- Use React Query para cache e sincronização

### Estilização
- Use Tailwind CSS para classes utilitárias
- Componentes customizados em `src/components/ui/`
- Variáveis CSS para temas em `src/index.css`

## � Documentação

- **[Documentação Técnica](docs/TECHNICAL.md)** - Arquitetura, APIs e detalhes técnicos
- **[Guia de Configuração](docs/SETUP.md)** - Instalação e configuração completa
- **[Guia de Contribuição](CONTRIBUTING.md)** - Como contribuir com o projeto
- **[Changelog](CHANGELOG.md)** - Histórico de mudanças e versões

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade do SENAI Alagoinhas e é destinado para uso educacional e institucional.

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato com a equipe de desenvolvimento do SENAI Alagoinhas.

---

**Desenvolvido com ❤️ pelo SENAI Alagoinhas**
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
