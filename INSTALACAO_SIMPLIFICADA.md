# 🚀 Guia de Instalação Simplificado - Festeja Kids

![Fluxo de Instalação](C:/Users/Festeja/.gemini/antigravity/brain/57cc558c-0713-4c1c-813b-731d4d818919/instalacao_simplificada_1763625524932.png)

## ✅ Método Super Simplificado (Recomendado)

### Passo 1: Instalar Node.js

1. Baixe o Node.js 18 ou superior: https://nodejs.org/
2. Execute o instalador e siga as instruções (marque TODAS as opções)
3. Reinicie o computador após a instalação

### Passo 2: Executar o Script Automático

Abra o **PowerShell** ou **CMD** na pasta do projeto e execute:

```powershell
.\setup.bat
```

> **💡 Dica:** No PowerShell, use `.\` antes do nome do arquivo para executar scripts

**O que este script faz:**

- ✅ Verifica se Node.js está instalado
- ✅ Instala o pnpm automaticamente
- ✅ Instala todas as dependências do projeto
- ✅ Cria o arquivo `.env` com configurações padrão

### Passo 3: Configurar Banco de Dados (Opcional)

Por padrão, o projeto usa SQLite (não precisa instalar nada).

**Edite o arquivo `.env`** se quiser usar MySQL:

```env
# Para SQLite (padrão - não precisa mudar)
DATABASE_URL=file:./festeja_kids.db

# OU para MySQL (se preferir)
DATABASE_URL=mysql://root:senha@localhost:3306/festeja_kids
```

### Passo 4: Inicializar o Banco de Dados

```powershell
pnpm db:push
```

### Passo 5: Iniciar o Servidor

```powershell
pnpm dev
```

🎉 **Pronto!** Acesse http://localhost:5000

---

## 🛠️ Instalação Manual (Se o script automático falhar)

### 1. Instalar pnpm

```powershell
npm install -g pnpm
```

### 2. Instalar Dependências

```powershell
pnpm install
```

### 3. Configurar .env

Copie o arquivo `.env.example` para `.env`:

```powershell
copy .env.example .env
```

Edite o `.env` com suas configurações:

```env
DATABASE_URL=file:./festeja_kids.db
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
```

### 4. Criar Banco de Dados

```powershell
pnpm db:push
```

### 5. Iniciar Servidor

```powershell
pnpm dev
```

---

## 🐛 Problemas Comuns

### ❌ "pnpm não é reconhecido"

**Solução:**

```powershell
npm install -g pnpm
# Reinicie o terminal depois
```

### ❌ "NODE_ENV não é reconhecido" (Windows)

**Solução 1 - Usar cross-env:**
Edite o `package.json` para adicionar configuração Windows:

```json
"dev": "set NODE_ENV=development && tsx watch server/_core/index.ts"
```

**Solução 2 - Usar o script alternativo:**

```powershell
node scripts/dev-server.mjs
```

### ❌ Erro ao instalar dependências

**Solução:**

```powershell
# Limpar cache
pnpm store prune
# Deletar node_modules e pnpm-lock.yaml
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml
# Reinstalar
pnpm install
```

### ❌ "Cannot connect to database"

**Solução para SQLite:**

- O arquivo será criado automaticamente ao executar `pnpm db:push`
- Certifique-se de que o `.env` tem: `DATABASE_URL=file:./festeja_kids.db`

**Solução para MySQL:**

1. Instale o MySQL: https://dev.mysql.com/downloads/installer/
2. Crie o banco de dados:

```sql
CREATE DATABASE festeja_kids CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Configure o `.env` com usuário e senha corretos

---

## 📊 Verificar Status da Instalação

Execute este comando para verificar se tudo está OK:

```powershell
node scripts/check-env.mjs
```

---

## 🎯 Comandos Úteis

| Comando        | Descrição                            |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Inicia o servidor de desenvolvimento |
| `pnpm build`   | Cria build de produção               |
| `pnpm db:push` | Aplica migrações no banco            |
| `pnpm test`    | Executa os testes                    |
| `pnpm format`  | Formata o código                     |

---

## 💡 Dicas

1. **Use SQLite para desenvolvimento** - Mais simples, não precisa instalar nada
2. **Reinicie sempre o terminal** após instalar ferramentas globais (Node.js, pnpm)
3. **Execute sempre na pasta do projeto** - `cd "C:\Users\Festeja\Desktop\Festeja System\Festeja-kids"`
4. **Use PowerShell ou CMD** - Git Bash pode ter problemas com alguns scripts

---

## 📞 Ainda com problemas?

1. Verifique se você está na pasta correta do projeto
2. Confira se o Node.js foi instalado (execute `node --version`)
3. Tente reiniciar o computador
4. Consulte o arquivo [SETUP_LOCAL.md](./SETUP_LOCAL.md) para mais detalhes

---

**Desenvolvido com ❤️ para Festeja Kids**
