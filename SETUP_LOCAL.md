# 🚀 Guia de Configuração Local - Festeja Kids

Este guia irá ajudá-lo a configurar e executar o projeto Festeja Kids completamente em seu ambiente local no Windows.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Verifique: `node --version`

2. **pnpm** (gerenciador de pacotes)
   - Instalação: `npm install -g pnpm`
   - Verifique: `pnpm --version`

3. **Banco de Dados** (escolha uma opção):
   - **Opção A - MySQL** (recomendado para produção)
     - Download: https://dev.mysql.com/downloads/installer/
   - **Opção B - SQLite** (mais simples para desenvolvimento)
     - Já incluído no projeto

## 🔧 Passo a Passo

### 1️⃣ Clonar o Repositório (se ainda não fez)

```powershell
git clone https://github.com/MSC-Consultoria/Festeja-kids.git
cd Festeja-kids
```

### 2️⃣ Instalar Dependências

```powershell
pnpm install
```

### 3️⃣ Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```powershell
copy .env.example .env
```

Abra o arquivo `.env` e configure:

#### **Opção A: Usando MySQL Local**

```env
DATABASE_URL=mysql://root:sua_senha@localhost:3306/festeja_kids
JWT_SECRET=gere_uma_chave_aleatoria_segura_aqui
NODE_ENV=development
```

#### **Opção B: Usando SQLite (Mais Simples)**

```env
DATABASE_URL=file:./festeja_kids.db
JWT_SECRET=gere_uma_chave_aleatoria_segura_aqui
NODE_ENV=development
```

> **💡 Dica:** Para gerar uma chave JWT segura, você pode usar:
>
> ```powershell
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4️⃣ Configurar o Banco de Dados

#### Se estiver usando MySQL:

1. Crie o banco de dados:

```sql
CREATE DATABASE festeja_kids CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Execute as migrações:

```powershell
pnpm db:push
```

#### Se estiver usando SQLite:

Execute apenas as migrações (o arquivo será criado automaticamente):

```powershell
pnpm db:push
```

### 5️⃣ Importar Dados Iniciais (Opcional)

Se você tem dados das planilhas Excel para importar:

```powershell
node scripts/import-complete.mjs
```

### 6️⃣ Iniciar o Servidor de Desenvolvimento

```powershell
pnpm dev
```

O servidor iniciará em modo de desenvolvimento. Você verá algo como:

```
Server running on http://localhost:5000
Vite dev server running on http://localhost:5173
```

### 7️⃣ Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:5173
```

## 🎯 Scripts Disponíveis

| Comando        | Descrição                            |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Inicia o servidor de desenvolvimento |
| `pnpm build`   | Compila o projeto para produção      |
| `pnpm start`   | Inicia o servidor em modo produção   |
| `pnpm check`   | Verifica erros de TypeScript         |
| `pnpm format`  | Formata o código com Prettier        |
| `pnpm test`    | Executa os testes                    |
| `pnpm db:push` | Aplica migrações no banco de dados   |

## 🔐 Autenticação Local

### Opção 1: Desabilitar Autenticação (Desenvolvimento)

Para desenvolvimento local sem OAuth, você pode modificar temporariamente o código para pular a autenticação:

1. Abra `server/_core/index.ts`
2. Comente ou modifique as verificações de autenticação

### Opção 2: Configurar OAuth Local

Se precisar de autenticação completa:

1. Configure as variáveis no `.env`:

```env
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=url_do_servidor_oauth
OWNER_OPEN_ID=seu_open_id
```

## 🗄️ Estrutura do Banco de Dados

O projeto usa as seguintes tabelas:

- **users** - Usuários do sistema
- **clientes** - Clientes/contratantes
- **festas** - Festas agendadas
- **pagamentos** - Parcelas de pagamento
- **custos_variaveis** - Custos variáveis por festa
- **custos_fixos** - Custos fixos mensais

## 🐛 Troubleshooting

### Erro: "DATABASE_URL is required"

**Solução:** Certifique-se de que o arquivo `.env` existe e contém a variável `DATABASE_URL`.

### Erro: "Cannot connect to MySQL"

**Soluções:**

1. Verifique se o MySQL está rodando
2. Confirme usuário e senha no `.env`
3. Certifique-se de que o banco `festeja_kids` foi criado

### Erro: "Port 5000 already in use"

**Solução:** Outra aplicação está usando a porta. Você pode:

1. Fechar a aplicação que está usando a porta
2. Ou modificar a porta no arquivo de configuração do servidor

### Scripts não funcionam no PowerShell

**Solução:** Os scripts usam sintaxe Unix. Para Windows, você pode:

1. Usar Git Bash (vem com Git for Windows)
2. Ou modificar os scripts no `package.json`:

```json
{
  "scripts": {
    "dev": "set NODE_ENV=development && tsx watch server/_core/index.ts"
  }
}
```

## 📦 Estrutura do Projeto

```
Festeja-kids/
├── client/           # Frontend React
│   ├── src/         # Código fonte do cliente
│   └── public/      # Arquivos estáticos
├── server/          # Backend Node.js
│   ├── _core/       # Configurações principais
│   └── routers/     # Rotas tRPC
├── drizzle/         # Schema e migrações do banco
├── scripts/         # Scripts de importação e utilidades
├── shared/          # Código compartilhado
└── .env            # Variáveis de ambiente (criar)
```

## 🚀 Próximos Passos

Após configurar o ambiente local:

1. ✅ Explore a interface em `http://localhost:5173`
2. ✅ Cadastre algumas festas de teste
3. ✅ Experimente as funcionalidades de calendário e financeiro
4. ✅ Personalize conforme suas necessidades

## 📞 Suporte

Se encontrar problemas:

1. Verifique a seção de Troubleshooting acima
2. Consulte o arquivo `TIMELINE.md` para histórico do projeto
3. Revise os logs do console para mensagens de erro

---

**Desenvolvido com ❤️ para Festeja Kids**
