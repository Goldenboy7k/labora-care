# Changelog - LaboraCare

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Sistema completo de gestão de laboratórios
- Dashboard com KPIs e visualização de laboratórios
- Páginas detalhadas de laboratórios com equipamentos
- Sistema de autenticação com roles (Usuário, Técnico, Admin)
- Controle de permissões baseado em roles
- Modal para adicionar equipamentos (com validação de permissões)
- Design responsivo com Tailwind CSS
- Componentes UI modernos com Radix UI
- Integração com Supabase para banco e auth
- API REST backend com Express.js
- Migrações de banco de dados
- Documentação completa do projeto
- Sistema de manutenções preventivas e corretivas

### Technical
- Arquitetura full-stack (React + Express + Supabase)
- TypeScript em todo o projeto
- React Query para gerenciamento de estado
- Row Level Security (RLS) no banco
- Autenticação JWT
- Build otimizado com Vite
- Testes automatizados
- Linting e formatação de código

## [1.0.0] - 2026-04-23

### Added
- ✅ **Dashboard Interativo**
  - Cards de laboratórios clicáveis
  - KPIs principais (equipamentos, manutenções)
  - Lista de próximas manutenções

- ✅ **Sistema de Laboratórios**
  - Página de detalhes por laboratório
  - Lista de equipamentos com status
  - Informações de manutenção

- ✅ **Controle de Acesso**
  - 3 tipos de usuário: Usuário, Técnico, Admin
  - Permissões granulares
  - Autenticação via Supabase

- ✅ **Gestão de Equipamentos**
  - Cadastro completo (nome, marca, modelo, série)
  - Status de operação
  - Histórico de manutenções

- ✅ **Interface Moderna**
  - Design responsivo
  - Tema dark/light
  - Componentes acessíveis
  - Animações suaves

### Technical
- ✅ **Frontend**: React 19 + TypeScript + Vite
- ✅ **Backend**: Node.js + Express + TypeScript
- ✅ **Database**: Supabase (PostgreSQL + Auth)
- ✅ **UI**: Tailwind CSS + Radix UI
- ✅ **State**: React Query + Context API
- ✅ **Build**: Vite + Hot Reload

### Security
- ✅ Autenticação segura
- ✅ Autorização baseada em roles
- ✅ Row Level Security
- ✅ Sanitização de inputs

---

## Tipos de Mudanças

- `Added` - Novos recursos
- `Changed` - Mudanças em recursos existentes
- `Deprecated` - Recursos marcados para remoção
- `Removed` - Recursos removidos
- `Fixed` - Correções de bugs
- `Security` - Correções de segurança

## Versionamento

Este projeto usa [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novos recursos compatíveis
- **PATCH**: Correções de bugs

---

**Mantido por**: Equipe SENAI Alagoinhas