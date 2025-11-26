# 🌿 NUUMA - Telesaúde Especializada em Cannabis Medicinal

Sistema completo de checkout e pagamento para tratamento com cannabis medicinal, integrado com Asaas e Supabase.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Node.js + Express
- **Banco de Dados**: Supabase (PostgreSQL)
- **Pagamentos**: Asaas (PIX, Boleto, Cartão de Crédito)
- **PDF**: jsPDF + pdf-lib

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase
- Conta no Asaas (Sandbox ou Produção)
- ngrok (para desenvolvimento local com webhook)

## 🛠️ Instalação

```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd infocbd-smooth-landing

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp backend.env.example .env
# Edite o .env com suas credenciais

# 4. Execute o schema do banco de dados
# Acesse o Supabase Dashboard e execute database/schema.sql
```

## 🚀 Como Executar

### Desenvolvimento

```bash
# Terminal 1: Backend
npm run backend

# Terminal 2: Frontend
npm run dev

# Terminal 3: ngrok (para webhook local)
npm run ngrok
# OU
scripts\start-ngrok.bat
```

### Executar Tudo de Uma Vez

```bash
npm run dev:full
```

**Nota**: Requer `nodemon` e `concurrently` instalados.

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/      # Componentes React
│   ├── pages/          # Páginas da aplicação
│   ├── hooks/          # Hooks customizados
│   ├── lib/            # Bibliotecas e utilitários
│   ├── utils/          # Funções utilitárias
│   └── config/         # Configurações
├── database/           # Schema SQL do Supabase
├── docs/              # Documentação
├── scripts/           # Scripts auxiliares
├── server.cjs         # Servidor backend Express
└── backend.env.example # Exemplo de variáveis de ambiente
```

## 🔐 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Asaas
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook (Opcional)
WEBHOOK_SECRET_TOKEN=seu_token_secreto_aqui

# Geral
FRONTEND_URL=http://localhost:8080
PORT=3000
```

### Frontend (.env ou .env.local)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

## 📚 Documentação

Toda a documentação está na pasta `docs/`:

- **[docs/WEBHOOK_SETUP.md](docs/WEBHOOK_SETUP.md)** - Guia completo de configuração do webhook
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Solução de problemas
- **[docs/TESTAR_WEBHOOK_MANUAL.md](docs/TESTAR_WEBHOOK_MANUAL.md)** - Como testar webhook manualmente
- **[docs/IMPLEMENTACAO_WEBHOOK.md](docs/IMPLEMENTACAO_WEBHOOK.md)** - Detalhes técnicos da implementação

## 🔄 Fluxo de Pagamento

1. **Identificação** → Cliente preenche dados pessoais
2. **Endereço** → Cliente informa endereço de entrega
3. **Pagamento** → Cliente escolhe método (PIX/Boleto/Cartão)
4. **Processamento** → Sistema cria pedido e cobrança
5. **Confirmação** → Webhook atualiza status automaticamente
6. **Sucesso** → Cliente recebe receita médica

## 🧪 Testes

### Testar Webhook Manualmente

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_xxxxx",
    "externalReference": "order-uuid-123"
  }'
```

### Health Check

```bash
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

Consulte **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** para soluções de problemas comuns.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento (frontend)
- `npm run build` - Build para produção
- `npm run backend` - Inicia servidor backend
- `npm run backend:dev` - Backend com auto-reload (nodemon)
- `npm run ngrok` - Inicia ngrok para webhook local
- `npm run dev:full` - Executa tudo (backend + frontend + ngrok)

## 🔒 Segurança

- ⚠️ **NUNCA** exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend
- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- ✅ Use HTTPS em produção
- ✅ Configure `WEBHOOK_SECRET_TOKEN` em produção

## 📄 Licença

Este projeto é privado e proprietário da NUUMA.

## 🤝 Suporte

Para problemas ou dúvidas:
1. Consulte a documentação em `docs/`
2. Verifique os logs do backend e frontend
3. Consulte a documentação oficial:
   - [Asaas API](https://asaasv3.docs.apiary.io/)
   - [Supabase Docs](https://supabase.com/docs)

---

**Desenvolvido com ❤️ para NUUMA**

├── docs/              # Documentação
├── scripts/           # Scripts auxiliares
├── server.cjs         # Servidor backend Express
└── backend.env.example # Exemplo de variáveis de ambiente
```

## 🔐 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Asaas
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook (Opcional)
WEBHOOK_SECRET_TOKEN=seu_token_secreto_aqui

# Geral
FRONTEND_URL=http://localhost:8080
PORT=3000
```

### Frontend (.env ou .env.local)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

## 📚 Documentação

Toda a documentação está na pasta `docs/`:

- **[docs/WEBHOOK_SETUP.md](docs/WEBHOOK_SETUP.md)** - Guia completo de configuração do webhook
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Solução de problemas
- **[docs/TESTAR_WEBHOOK_MANUAL.md](docs/TESTAR_WEBHOOK_MANUAL.md)** - Como testar webhook manualmente
- **[docs/IMPLEMENTACAO_WEBHOOK.md](docs/IMPLEMENTACAO_WEBHOOK.md)** - Detalhes técnicos da implementação

## 🔄 Fluxo de Pagamento

1. **Identificação** → Cliente preenche dados pessoais
2. **Endereço** → Cliente informa endereço de entrega
3. **Pagamento** → Cliente escolhe método (PIX/Boleto/Cartão)
4. **Processamento** → Sistema cria pedido e cobrança
5. **Confirmação** → Webhook atualiza status automaticamente
6. **Sucesso** → Cliente recebe receita médica

## 🧪 Testes

### Testar Webhook Manualmente

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_xxxxx",
    "externalReference": "order-uuid-123"
  }'
```

### Health Check

```bash
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

Consulte **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** para soluções de problemas comuns.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento (frontend)
- `npm run build` - Build para produção
- `npm run backend` - Inicia servidor backend
- `npm run backend:dev` - Backend com auto-reload (nodemon)
- `npm run ngrok` - Inicia ngrok para webhook local
- `npm run dev:full` - Executa tudo (backend + frontend + ngrok)

## 🔒 Segurança

- ⚠️ **NUNCA** exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend
- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- ✅ Use HTTPS em produção
- ✅ Configure `WEBHOOK_SECRET_TOKEN` em produção

## 📄 Licença

Este projeto é privado e proprietário da NUUMA.

## 🤝 Suporte

Para problemas ou dúvidas:
1. Consulte a documentação em `docs/`
2. Verifique os logs do backend e frontend
3. Consulte a documentação oficial:
   - [Asaas API](https://asaasv3.docs.apiary.io/)
   - [Supabase Docs](https://supabase.com/docs)

---

**Desenvolvido com ❤️ para NUUMA**

├── docs/              # Documentação
├── scripts/           # Scripts auxiliares
├── server.cjs         # Servidor backend Express
└── backend.env.example # Exemplo de variáveis de ambiente
```

## 🔐 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Asaas
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook (Opcional)
WEBHOOK_SECRET_TOKEN=seu_token_secreto_aqui

# Geral
FRONTEND_URL=http://localhost:8080
PORT=3000
```

### Frontend (.env ou .env.local)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

## 📚 Documentação

Toda a documentação está na pasta `docs/`:

- **[docs/WEBHOOK_SETUP.md](docs/WEBHOOK_SETUP.md)** - Guia completo de configuração do webhook
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Solução de problemas
- **[docs/TESTAR_WEBHOOK_MANUAL.md](docs/TESTAR_WEBHOOK_MANUAL.md)** - Como testar webhook manualmente
- **[docs/IMPLEMENTACAO_WEBHOOK.md](docs/IMPLEMENTACAO_WEBHOOK.md)** - Detalhes técnicos da implementação

## 🔄 Fluxo de Pagamento

1. **Identificação** → Cliente preenche dados pessoais
2. **Endereço** → Cliente informa endereço de entrega
3. **Pagamento** → Cliente escolhe método (PIX/Boleto/Cartão)
4. **Processamento** → Sistema cria pedido e cobrança
5. **Confirmação** → Webhook atualiza status automaticamente
6. **Sucesso** → Cliente recebe receita médica

## 🧪 Testes

### Testar Webhook Manualmente

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_xxxxx",
    "externalReference": "order-uuid-123"
  }'
```

### Health Check

```bash
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

Consulte **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** para soluções de problemas comuns.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento (frontend)
- `npm run build` - Build para produção
- `npm run backend` - Inicia servidor backend
- `npm run backend:dev` - Backend com auto-reload (nodemon)
- `npm run ngrok` - Inicia ngrok para webhook local
- `npm run dev:full` - Executa tudo (backend + frontend + ngrok)

## 🔒 Segurança

- ⚠️ **NUNCA** exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend
- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- ✅ Use HTTPS em produção
- ✅ Configure `WEBHOOK_SECRET_TOKEN` em produção

## 📄 Licença

Este projeto é privado e proprietário da NUUMA.

## 🤝 Suporte

Para problemas ou dúvidas:
1. Consulte a documentação em `docs/`
2. Verifique os logs do backend e frontend
3. Consulte a documentação oficial:
   - [Asaas API](https://asaasv3.docs.apiary.io/)
   - [Supabase Docs](https://supabase.com/docs)

---

**Desenvolvido com ❤️ para NUUMA**

├── docs/              # Documentação
├── scripts/           # Scripts auxiliares
├── server.cjs         # Servidor backend Express
└── backend.env.example # Exemplo de variáveis de ambiente
```

## 🔐 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Asaas
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook (Opcional)
WEBHOOK_SECRET_TOKEN=seu_token_secreto_aqui

# Geral
FRONTEND_URL=http://localhost:8080
PORT=3000
```

### Frontend (.env ou .env.local)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

## 📚 Documentação

Toda a documentação está na pasta `docs/`:

- **[docs/WEBHOOK_SETUP.md](docs/WEBHOOK_SETUP.md)** - Guia completo de configuração do webhook
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Solução de problemas
- **[docs/TESTAR_WEBHOOK_MANUAL.md](docs/TESTAR_WEBHOOK_MANUAL.md)** - Como testar webhook manualmente
- **[docs/IMPLEMENTACAO_WEBHOOK.md](docs/IMPLEMENTACAO_WEBHOOK.md)** - Detalhes técnicos da implementação

## 🔄 Fluxo de Pagamento

1. **Identificação** → Cliente preenche dados pessoais
2. **Endereço** → Cliente informa endereço de entrega
3. **Pagamento** → Cliente escolhe método (PIX/Boleto/Cartão)
4. **Processamento** → Sistema cria pedido e cobrança
5. **Confirmação** → Webhook atualiza status automaticamente
6. **Sucesso** → Cliente recebe receita médica

## 🧪 Testes

### Testar Webhook Manualmente

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_xxxxx",
    "externalReference": "order-uuid-123"
  }'
```

### Health Check

```bash
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

Consulte **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** para soluções de problemas comuns.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento (frontend)
- `npm run build` - Build para produção
- `npm run backend` - Inicia servidor backend
- `npm run backend:dev` - Backend com auto-reload (nodemon)
- `npm run ngrok` - Inicia ngrok para webhook local
- `npm run dev:full` - Executa tudo (backend + frontend + ngrok)

## 🔒 Segurança

- ⚠️ **NUNCA** exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend
- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- ✅ Use HTTPS em produção
- ✅ Configure `WEBHOOK_SECRET_TOKEN` em produção

## 📄 Licença

Este projeto é privado e proprietário da NUUMA.

## 🤝 Suporte

Para problemas ou dúvidas:
1. Consulte a documentação em `docs/`
2. Verifique os logs do backend e frontend
3. Consulte a documentação oficial:
   - [Asaas API](https://asaasv3.docs.apiary.io/)
   - [Supabase Docs](https://supabase.com/docs)

---

**Desenvolvido com ❤️ para NUUMA**
