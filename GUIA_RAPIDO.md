# 🎉 Guia Rápido - Instalação Super Simplificada

![Guia de Instalação](C:/Users/Festeja/.gemini/antigravity/brain/57cc558c-0713-4c1c-813b-731d4d818919/guia_instalacao_visual_1763625729480.png)

## ✨ Instalação em 3 Passos (Sem digitar comandos!)

### 📋 Pré-requisito

- **Node.js 18+** → [Baixar aqui](https://nodejs.org/)
  - Durante a instalação, marque TODAS as opções
  - Reinicie o computador após instalar

---

### Passo 1️⃣: Instalar o Projeto

**Duplo clique no arquivo:** `instalar.cmd`

O que acontecerá:

- ✅ Verifica se Node.js está instalado
- ✅ Instala o pnpm automaticamente
- ✅ Instala todas as dependências (pode levar alguns minutos)
- ✅ Cria o arquivo de configuração `.env`
- ✅ Inicializa o banco de dados SQLite

💡 **Aguarde** a janela mostrar "INSTALAÇÃO CONCLUÍDA COM SUCESSO!"

---

### Passo 2️⃣: Iniciar o Servidor

**Duplo clique no arquivo:** `iniciar.cmd`

O servidor vai iniciar automaticamente!

---

### Passo 3️⃣: Acessar o Sistema

Abra seu navegador e acesse:

```
http://localhost:5000
```

🎊 **Pronto!** O sistema está rodando!

---

## 🛑 Como Parar o Servidor

Na janela do terminal que abriu, pressione:

```
Ctrl + C
```

Ou simplesmente feche a janela.

---

## ⚠️ Problemas Comuns

### ❌ "Node.js não encontrado"

**Solução:**

1. Instale o Node.js: https://nodejs.org/
2. Reinicie o computador
3. Execute `instalar.cmd` novamente

### ❌ "Falha ao instalar dependências"

**Solução 1 - Limpar e reinstalar:**

1. Delete a pasta `node_modules` (se existir)
2. Execute `instalar.cmd` novamente

**Solução 2 - Usar CMD ao invés do PowerShell:**

1. Abra o **Prompt de Comando** (CMD)
2. Navegue até a pasta do projeto:
   ```cmd
   cd "C:\Users\Festeja\Desktop\Festeja System\Festeja-kids"
   ```
3. Execute:
   ```cmd
   instalar.cmd
   ```

### ❌ "Erro de permissão" ou "Scripts desabilitados"

**Solução:**
Use o **Prompt de Comando (CMD)** ao invés do PowerShell:

1. Pressione `Win + R`
2. Digite: `cmd`
3. Navegue até a pasta do projeto
4. Execute: `instalar.cmd`

### ❌ Servidor não inicia

**Solução:**

1. Verifique se a instalação foi concluída com sucesso
2. Verifique se o arquivo `.env` foi criado
3. Se necessário, execute `instalar.cmd` novamente

---

## 🎯 Arquivos Importantes

| Arquivo          | Descrição                                |
| ---------------- | ---------------------------------------- |
| `instalar.cmd`   | **Instala o projeto** (execute primeiro) |
| `iniciar.cmd`    | **Inicia o servidor** (execute depois)   |
| `.env`           | Configurações do sistema                 |
| `GUIA_RAPIDO.md` | Este guia                                |

---

## 💡 Dicas

✅ **Sempre execute `instalar.cmd` primeiro** antes de executar `iniciar.cmd`

✅ **Só precisa instalar uma vez**. Depois, use apenas `iniciar.cmd` para iniciar o servidor

✅ **Use o Prompt de Comando (CMD)** se tiver problemas com o PowerShell

✅ **Mantenha a janela do terminal aberta** enquanto estiver usando o sistema

---

## 📞 Ainda com Dúvidas?

### Método Alternativo (Manual)

Se os arquivos `.cmd` não funcionarem, use este método:

1. **Abra o Prompt de Comando (CMD)**
2. **Navegue até a pasta:**

   ```cmd
   cd "C:\Users\Festeja\Desktop\Festeja System\Festeja-kids"
   ```

3. **Instale as dependências:**

   ```cmd
   npm install -g pnpm
   pnpm install
   ```

4. **Configure o .env:**
   - Copie o arquivo `.env.example` e renomeie para `.env`
   - Ou crie manualmente com:

   ```
   DATABASE_URL=file:./festeja_kids.db
   JWT_SECRET=festeja_kids_secret_2024
   NODE_ENV=development
   ```

5. **Inicialize o banco:**

   ```cmd
   pnpm db:push
   ```

6. **Inicie o servidor:**
   ```cmd
   set NODE_ENV=development
   pnpm dev
   ```

---

**Desenvolvido com ❤️ para Festeja Kids**
