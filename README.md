# 🎉 Festeja Kids - Sistema de Gestão

Sistema completo de gestão para o salão de festas Festeja Kids, desenvolvido com React, Node.js e MySQL/SQLite.

## 🚀 Início Rápido (Windows)

### 🎯 Método Super Simples (Recomendado)

**Sem digitar comandos! Apenas duplo clique:**

1. Duplo clique em `instalar.cmd` → Aguarde a instalação
2. Duplo clique em `iniciar.cmd` → Servidor iniciado!
3. Acesse http://localhost:5000

📖 **Guia completo:** [GUIA_RAPIDO.md](./GUIA_RAPIDO.md)

---

### Opção 2: PowerShell/CMD

```powershell
# 1. Execute o script de configuração
.\setup.bat

# 2. Edite o arquivo .env (se necessário)
notepad .env

# 3. Inicialize o banco de dados
pnpm db:push

# 4. Inicie o servidor
pnpm dev
```

### Opção 3: Configuração Manual

Consulte o arquivo [SETUP_LOCAL.md](./SETUP_LOCAL.md) para instruções detalhadas.

## 📋 Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** (`npm install -g pnpm`)
- **MySQL** (opcional, pode usar SQLite)

## 🛠️ Tecnologias

- **Frontend:** React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend:** Node.js, Express 4, tRPC 11
- **Banco de Dados:** MySQL/SQLite com Drizzle ORM
- **Autenticação:** Manus OAuth
- **Testes:** Vitest

## 📁 Estrutura do Projeto

```
Festeja-kids/
├── client/          # Frontend React
├── server/          # Backend Node.js
├── drizzle/         # Schema e migrações
├── scripts/         # Scripts de utilidades
├── shared/          # Código compartilhado
└── .env            # Configurações (criar)
```

## 🎯 Funcionalidades

- ✅ Gestão de Clientes
- ✅ Gestão de Festas
- ✅ Calendário de Eventos
- ✅ Controle Financeiro
- ✅ Gestão de Pagamentos
- ✅ Controle de Custos (Fixos e Variáveis)
- ✅ Dashboard Analítico
- ✅ Integração com Google Calendar

## 📊 Scripts Disponíveis

| Comando                      | Descrição                   |
| ---------------------------- | --------------------------- |
| `pnpm dev`                   | Servidor de desenvolvimento |
| `pnpm build`                 | Build para produção         |
| `pnpm start`                 | Servidor em produção        |
| `pnpm test`                  | Executar testes             |
| `pnpm db:push`               | Aplicar migrações           |
| `node scripts/check-env.mjs` | Verificar ambiente          |
| `node scripts/init-db.mjs`   | Inicializar banco           |

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados (escolha uma opção)
DATABASE_URL=mysql://root:senha@localhost:3306/festeja_kids
# ou
DATABASE_URL=file:./festeja_kids.db

# Autenticação
JWT_SECRET=sua_chave_secreta_aqui

# Ambiente
NODE_ENV=development
```

### Banco de Dados

#### MySQL

```sql
CREATE DATABASE festeja_kids CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### SQLite

Será criado automaticamente ao executar `pnpm db:push`.

## 📖 Documentação

- [SETUP_LOCAL.md](./SETUP_LOCAL.md) - Guia completo de configuração local
- [TIMELINE.md](./TIMELINE.md) - Histórico de desenvolvimento
- [todo.md](./todo.md) - Tarefas pendentes

## 🐛 Troubleshooting

### Erro: "DATABASE_URL is required"

- Certifique-se de que o arquivo `.env` existe e contém `DATABASE_URL`

### Erro: "Cannot connect to MySQL"

- Verifique se o MySQL está rodando
- Confirme usuário e senha no `.env`

### Scripts não funcionam

- Use Git Bash ou PowerShell
- Ou adapte os scripts para Windows (veja SETUP_LOCAL.md)

## 📞 Suporte

Para problemas ou dúvidas:

1. Consulte [SETUP_LOCAL.md](./SETUP_LOCAL.md)
2. Verifique [TIMELINE.md](./TIMELINE.md)
3. Revise os logs do console

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para Festeja Kids**
