# Guia de Contribuição - LaboraCare

Bem-vindo! Este documento explica como contribuir para o projeto LaboraCare.

## 📋 Código de Conduta

Este projeto adere ao [Código de Conduta do Contributor Covenant](https://www.contributor-covenant.org/version/2/0/code_of_conduct/).
Ao participar, você concorda em manter este código.

## 🚀 Como Contribuir

### 1. Preparação do Ambiente

Siga o [Guia de Configuração](docs/SETUP.md) para configurar o ambiente de desenvolvimento.

### 2. Processo de Contribuição

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/SEU_USERNAME/labora-care.git`
3. **Crie uma branch** para sua feature: `git checkout -b feature/nome-da-feature`
4. **Faça suas mudanças** seguindo os padrões do projeto
5. **Teste suas mudanças** localmente
6. **Commit** suas mudanças: `git commit -m "feat: adiciona nova funcionalidade"`
7. **Push** para seu fork: `git push origin feature/nome-da-feature`
8. **Abra um Pull Request** no repositório original

### 3. Pull Requests

#### Título do PR
Use o formato: `tipo: descrição breve`

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação/código
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

#### Descrição do PR
```markdown
## Descrição
Explica o que foi implementado

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Testes foram adicionados
- [ ] Documentação foi atualizada
- [ ] Código segue os padrões do projeto
- [ ] Commit messages seguem convenção
```

## 📝 Padrões de Código

### TypeScript
- Use tipos explícitos sempre que possível
- Evite `any` - use tipos específicos
- Interfaces para objetos complexos
- Enums para valores fixos

### React
- Functional components com hooks
- Custom hooks para lógica reutilizável
- Props interfaces bem definidas
- Error boundaries para tratamento de erros

### Estilização
- Tailwind CSS para utilitários
- Componentes base do shadcn/ui
- CSS modules para estilos específicos
- Variáveis CSS para temas

### Commits
Siga [Conventional Commits](https://conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Exemplos:**
```
feat: adiciona modal de cadastro de equipamento
fix: corrige validação de email no login
docs: atualiza guia de instalação
```

## 🧪 Testes

### Executando Testes
```bash
# Frontend
npm run test

# Backend
cd backend && npm run test
```

### Escrevendo Testes
- **Unit Tests**: Para funções puras e componentes
- **Integration Tests**: Para interações entre componentes
- **E2E Tests**: Para fluxos completos (usar Playwright)

### Cobertura
Mantenha cobertura acima de 80% para código crítico.

## 📚 Documentação

### Atualizando Docs
- Mantenha README.md atualizado
- Documente novas APIs em `docs/TECHNICAL.md`
- Adicione exemplos de uso
- Atualize CHANGELOG.md

### Comentários no Código
```typescript
/**
 * Calcula o total de equipamentos operacionais
 * @param equipment - Lista de equipamentos
 * @returns Número de equipamentos operacionais
 */
function getOperationalCount(equipment: Equipment[]): number {
  return equipment.filter(eq => eq.status === 'operacional').length;
}
```

## 🔧 Desenvolvimento

### Scripts Úteis
```bash
# Linting
npm run lint

# Formatação
npm run format

# Type checking
npm run type-check

# Build
npm run build
```

### Estrutura de Arquivos
```
src/
├── components/     # Componentes React
├── pages/         # Páginas/Rotas
├── hooks/         # Hooks customizados
├── lib/           # Utilitários
├── data/          # Dados mock/tipos
└── integrations/  # APIs externas
```

### Nomenclatura
- **Componentes**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase (`useAuth.tsx`)
- **Utilitários**: camelCase (`formatDate.ts`)
- **Pastas**: kebab-case (`user-profile/`)

## 🐛 Reportando Bugs

### Template de Bug Report
```markdown
## Descrição
Descrição clara do bug

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role para '...'
4. Veja o erro

## Comportamento Esperado
O que deveria acontecer

## Screenshots
Se aplicável, adicione screenshots

## Ambiente
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]
```

## 💡 Sugestões de Features

### Template de Feature Request
```markdown
## Resumo
Breve descrição da feature

## Problema
Qual problema isso resolve?

## Solução Proposta
Como implementar

## Alternativas Consideradas
Outras soluções avaliadas

## Impacto
Como isso afeta usuários existentes?
```

## 📞 Comunicação

- **Issues**: Para bugs e features
- **Discussions**: Para ideias e discussões gerais
- **Pull Requests**: Para contribuições de código

## 🎯 Áreas de Contribuição

### Iniciantes
- Correção de bugs simples
- Melhorias na documentação
- Adição de testes
- Traduções

### Intermediários
- Novos componentes UI
- Melhorias de performance
- Refatoração de código
- Integração com APIs

### Avançados
- Arquitetura de sistema
- Segurança
- Otimizações de banco
- Features complexas

## 🙏 Reconhecimento

Contribuições são reconhecidas através:
- Créditos no CHANGELOG.md
- Menção em releases
- Badges de contributor

---

Obrigado por contribuir com o LaboraCare! 🚀