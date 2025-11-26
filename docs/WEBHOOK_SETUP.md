# 🔐 Configuração Completa do Webhook Asaas + Supabase

Este guia completo detalha a implementação e configuração do sistema de webhook do Asaas integrado com Supabase para confirmação automática de pagamentos.

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
3. [Configuração do Backend](#configuração-do-backend)
4. [Configuração do Webhook no Asaas](#configuração-do-webhook-no-asaas)
5. [Desenvolvimento Local (ngrok)](#desenvolvimento-local-ngrok)
6. [Fluxo de Funcionamento](#fluxo-de-funcionamento)
7. [Testar o Fluxo Completo](#testar-o-fluxo-completo)
8. [Segurança](#segurança)
9. [Monitoramento](#monitoramento)
10. [Troubleshooting](#troubleshooting)

---

## 📋 Visão Geral da Arquitetura

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Cliente   │────────▶│   Frontend   │────────▶│   Supabase  │
│  (Navegador)│         │   (React)    │         │  (Database) │
└─────────────┘         └──────────────┘         └─────────────┘
                                │                          ▲
                                │                          │
                                ▼                          │
                        ┌──────────────┐                  │
                        │   Backend    │                  │
                        │  (Express)   │                  │
                        └──────────────┘                  │
                                │                          │
                                │ Webhook                  │
                                ▼                          │
                        ┌──────────────┐                  │
                        │    Asaas     │──────────────────┘
                        │   (Gateway)  │
                        └──────────────┘
```

**Fluxo:**
1. Cliente cria pedido → Salvo no Supabase com `status: 'pendente'`
2. Cliente escolhe método de pagamento → Cria cobrança no Asaas
3. Cliente paga → Asaas processa pagamento
4. Asaas envia webhook → Backend atualiza Supabase → `status: 'pago'`
5. Frontend verifica Supabase → Libera acesso à página protegida

---

## 🗄️ Configuração do Banco de Dados

### Passo 1: Executar o Schema SQL

1. Acesse o Supabase Dashboard: https://app.supabase.com
2. Vá em **SQL Editor**
3. Execute o conteúdo do arquivo `database/schema.sql`

Ou use o Supabase CLI:

```bash
supabase db push
```

### Passo 2: Verificar Tabela Criada

A tabela `pedidos` deve ter as seguintes colunas críticas:

- `id` (UUID) - Chave primária
- `asaas_payment_id` (VARCHAR) - **CRÍTICO** - ID da cobrança do Asaas
- `status` (VARCHAR) - Status do pagamento
- `external_reference` (TEXT) - Referência externa (order_id)

---

## 🔧 Configuração do Backend

### Passo 1: Instalar Dependências

O `@supabase/supabase-js` já está instalado. Se não estiver:

```bash
npm install @supabase/supabase-js
```

### Passo 2: Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
# Asaas
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true

# Supabase (OBRIGATÓRIO para webhook)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook Security (Opcional)
WEBHOOK_SECRET_TOKEN=seu_token_secreto_aqui

# Geral
FRONTEND_URL=http://localhost:8080
PORT=3000
```

**Como obter as credenciais:**

1. **SUPABASE_URL**: 
   - Dashboard → Settings → API → Project URL

2. **SUPABASE_SERVICE_ROLE_KEY**:
   - Dashboard → Settings → API → service_role key
   - ⚠️ **NUNCA** exponha esta chave no frontend!

3. **WEBHOOK_SECRET_TOKEN**:
   - Pode ser qualquer string aleatória
   - Ou deixe vazio para usar `ASAAS_API_KEY` como fallback

### Passo 3: Reiniciar o Servidor

```bash
npm run backend
```

Você deve ver:
```
✅ Cliente Supabase configurado para webhook
✅ ASAAS_API_KEY configurada
✅ Ambiente: SANDBOX
```

---

## 🌐 Configuração do Webhook no Asaas

### ⚡ Opção A: Desenvolvimento Local (Sem Domínio Próprio)

Se você **não tem domínio próprio ainda**, use **ngrok** para expor seu servidor local.

#### 1. Instalar ngrok

**Opção 1 - Via npm (Recomendado):**
```bash
npm install -g ngrok
```

**Opção 2 - Download Manual:**
1. Acesse: https://ngrok.com/download
2. Baixe para Windows
3. Extraia o `ngrok.exe`
4. Coloque na pasta do projeto OU adicione ao PATH

**Opção 3 - Via Script:**
```bash
scripts\install-ngrok.bat
```

#### 2. Iniciar ngrok

**Terminal 1 - Backend (já deve estar rodando):**
```bash
npm run backend
```

**Terminal 2 - ngrok:**
```bash
# Via script (recomendado - não fecha automaticamente)
scripts\start-ngrok.bat

# OU manualmente
ngrok http 3000
```

Você verá:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

**Copie a URL HTTPS** (exemplo: `https://abc123.ngrok.io`)

⚠️ **IMPORTANTE**: 
- A URL do ngrok muda a cada reinício (plano gratuito)
- Se reiniciar o ngrok, atualize a URL no Asaas
- Mantenha o ngrok rodando enquanto testa

#### 3. Configurar no Asaas

Use a URL do ngrok + `/api/asaas/webhook`:
```
https://abc123.ngrok.io/api/asaas/webhook
```

### 🌍 Opção B: Produção (Com Domínio Próprio)

Se você **já tem domínio próprio**:

**URL do Webhook:**
```
https://seu-dominio.com/api/asaas/webhook
```

### Passo 1: Acessar Painel do Asaas

- **Sandbox**: https://sandbox.asaas.com
- **Produção**: https://www.asaas.com

### Passo 2: Configurar Webhook

1. Vá em **Configurações** → **Webhooks**
2. Clique em **Adicionar Webhook**
3. Configure:

   **✅ Este Webhook ficará ativo?** → **SIM**
   
   **📝 Nome:** `Webhook NUUMA - Local Dev` (ou `Webhook NUUMA - Produção`)
   
   **🔗 URL do Webhook:** 
   - **Local (ngrok):** `https://xxxxx.ngrok.io/api/asaas/webhook`
   - **Produção:** `https://seu-dominio.com/api/asaas/webhook`
   
   **📧 E-mail:** Seu e-mail para notificações de erro
   
   **🔢 Versão da API:** v3 (ou a mais recente)
   
   **🔐 Token de autenticação (Opcional):**
   - Você pode deixar vazio OU
   - Usar sua `ASAAS_API_KEY` como token
   - Se configurar, o backend validará este token
   
   **✅ Fila de sincronização ativada?** → **SIM** (recomendado)
   
   **📤 Tipo de envio:** Normal ou Padrão

4. **Selecionar Eventos:**
   - Clique em **"Cobranças"** para expandir
   - Marque: ✅ `PAYMENT_CONFIRMED` - Pagamento confirmado
   - Marque: ✅ `PAYMENT_RECEIVED` - Pagamento recebido
   - ⚠️ Opcional: `PAYMENT_OVERDUE` - Pagamento vencido
   - ⚠️ Opcional: `PAYMENT_REFUNDED` - Pagamento estornado

5. **Salvar**

### Passo 3: Testar Webhook (Opcional)

O Asaas permite testar o webhook diretamente no painel. Use essa funcionalidade para verificar se está funcionando.

---

## 🔄 Fluxo de Funcionamento

### 4.1. Criação do Pedido

Quando o usuário chega na página de pagamento:

```typescript
// 1. Pedido criado no Supabase
const order = await supabase
  .from('pedidos')
  .insert({
    nome: 'João Silva',
    status: 'pendente', // Status inicial
    // ... outros dados
  });

// 2. Cliente criado no Asaas
const customer = await createAsaasCustomer(...);

// 3. Pagamento criado no Asaas
const payment = await createAsaasPixPayment({
  customerId: customer.id,
  externalReference: order.id, // ← CRÍTICO: Link pedido ↔ pagamento
  // ...
});

// 4. Salvar asaas_payment_id no pedido
await supabase
  .from('pedidos')
  .update({ 
    asaas_payment_id: payment.id,
    external_reference: order.id 
  })
  .eq('id', order.id);
```

### 4.2. Processamento do Pagamento

1. Usuário paga via PIX/Boleto/Cartão
2. Asaas processa o pagamento
3. Asaas envia webhook para o backend

### 4.3. Webhook Atualiza Supabase

```javascript
// Backend recebe webhook
POST /api/asaas/webhook
{
  "event": "PAYMENT_CONFIRMED",
  "payment": {
    "id": "pay_123456789", // asaas_payment_id
    "externalReference": "order-uuid-123",
    "status": "CONFIRMED"
  }
}

// Backend atualiza Supabase (3 estratégias de busca)
// 1. Busca por asaas_payment_id
// 2. Busca por external_reference (id do pedido)
// 3. Busca pedido pendente e atualiza
await supabase
  .from('pedidos')
  .update({ status: 'pago' })
  .eq('id', externalReference);
```

### 4.4. Frontend Verifica Status

O frontend faz polling do Supabase:

```typescript
// Verificar status a cada 5 segundos
const { data } = await supabase
  .from('pedidos')
  .select('status')
  .eq('id', orderId)
  .single();

if (data.status === 'pago') {
  // Liberar acesso à página protegida
  navigate('/sucesso');
}
```

---

## 🧪 Testar o Fluxo Completo

### Teste 1: Verificar Webhook

1. Crie um pedido no sistema
2. Gere um pagamento PIX
3. No painel do Asaas Sandbox, simule a confirmação do pagamento
4. Verifique os logs do backend:

```bash
📥 Webhook Asaas recebido: PAYMENT_CONFIRMED
🔍 Estratégia 2: Tentando atualizar por external_reference: order-uuid
✅ Pedido encontrado por external_reference: order-uuid
✅ Pedido atualizado com sucesso: order-uuid -> Status: pago
```

### Teste 2: Verificar Supabase

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor** → `pedidos`
3. Verifique se o status foi atualizado para `pago`
4. Verifique se `asaas_payment_id` está preenchido

### Teste 3: Verificar Frontend

1. Na página de pagamento, após gerar o PIX
2. Abra o console do navegador
3. Deve ver verificações periódicas do status
4. Quando o webhook atualizar, o status muda automaticamente

### Teste 4: Testar Manualmente

Use o endpoint de teste para simular o webhook:

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_xxxxx",
    "externalReference": "order-uuid-123"
  }'
```

Consulte `docs/TESTAR_WEBHOOK_MANUAL.md` para mais detalhes.

---

## 🔒 Segurança

### Validação do Webhook

O webhook valida:

1. **Token de Segurança** (opcional):
   ```javascript
   const token = req.headers['asaas-access-token'];
   if (token !== WEBHOOK_SECRET_TOKEN) {
     return res.status(401).json({ error: 'Unauthorized' });
   }
   ```

2. **Filtragem de Eventos**:
   - Apenas processa `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`
   - Ignora outros eventos (retorna 200 OK)

3. **Idempotência**:
   - Se o status já for `pago`, não reprocessa
   - Evita atualizações duplicadas

### Boas Práticas

- ✅ Use `SUPABASE_SERVICE_ROLE_KEY` apenas no backend
- ✅ Nunca exponha a service role key no frontend
- ✅ Configure `WEBHOOK_SECRET_TOKEN` em produção
- ✅ Use HTTPS em produção
- ✅ Monitore logs do webhook
- ✅ Implemente rate limiting (opcional)

---

## 📊 Monitoramento

### Logs do Backend

O webhook registra:

- ✅ Webhooks recebidos
- ✅ Pedidos atualizados
- ❌ Erros de processamento
- ⚠️ Avisos (pedidos não encontrados)

### Verificar Status Manualmente

```sql
-- Ver pedidos pendentes
SELECT id, nome, status, asaas_payment_id, created_at
FROM pedidos
WHERE status = 'pendente'
ORDER BY created_at DESC;

-- Ver pedidos pagos nas últimas 24h
SELECT id, nome, status, asaas_payment_id, updated_at
FROM pedidos
WHERE status = 'pago'
  AND updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;
```

---

## 🐛 Troubleshooting

### Webhook não está sendo chamado

1. Verifique se a URL está correta no painel do Asaas
2. Use ngrok para desenvolvimento local
3. Verifique se o servidor backend está rodando
4. Verifique logs do Asaas (se disponível)
5. Verifique interface do ngrok: http://127.0.0.1:4040

### Pedido não está sendo atualizado

1. Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurado
2. Verifique se `asaas_payment_id` foi salvo no pedido
3. Verifique logs do backend para erros
4. Verifique se o `external_reference` está correto
5. Use o endpoint de teste: `POST /api/asaas/test-webhook`

### Status não muda no frontend

1. Verifique se o polling está ativo
2. Verifique console do navegador para erros
3. Verifique se o `orderId` está correto
4. Verifique conexão com Supabase

### Erro PGRST116 ao salvar asaas_payment_id

**Sintoma:**
```
❌ Erro ao salvar asaas_payment_id: {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  message: 'Cannot coerce the result to a single JSON object'
}
```

**Causa:** O pedido não existe no Supabase quando tenta atualizar.

**Solução:**
- O código já verifica se o pedido existe antes de atualizar
- Se o erro persistir, verifique se o pedido foi criado corretamente
- O webhook ainda funciona mesmo se o `asaas_payment_id` não for salvo

### Erro 401 (Unauthorized)

Consulte `docs/TROUBLESHOOTING.md` para soluções detalhadas.

---

## 📚 Documentação Adicional

- **API do Asaas**: https://asaasv3.docs.apiary.io/
- **Supabase Docs**: https://supabase.com/docs
- **Webhook Events**: https://asaasv3.docs.apiary.io/#reference/0/webhooks
- **ngrok Docs**: https://ngrok.com/docs

---

## ✅ Checklist de Implementação

- [ ] Schema SQL executado no Supabase
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado
- [ ] Webhook configurado no painel do Asaas
- [ ] Servidor backend reiniciado
- [ ] Teste de webhook realizado
- [ ] Verificação de status no frontend funcionando
- [ ] Logs sendo monitorados

---

**🎉 Pronto!** Seu sistema de webhook está configurado e funcionando. O status dos pagamentos será atualizado automaticamente via webhook do Asaas.


Este guia completo detalha a implementação e configuração do sistema de webhook do Asaas integrado com Supabase para confirmação automática de pagamentos.

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
3. [Configuração do Backend](#configuração-do-backend)
4. [Configuração do Webhook no Asaas](#configuração-do-webhook-no-asaas)
5. [Desenvolvimento Local (ngrok)](#desenvolvimento-local-ngrok)
6. [Fluxo de Funcionamento](#fluxo-de-funcionamento)
7. [Testar o Fluxo Completo](#testar-o-fluxo-completo)
8. [Segurança](#segurança)
9. [Monitoramento](#monitoramento)
10. [Troubleshooting](#troubleshooting)

---

## 📋 Visão Geral da Arquitetura

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Cliente   │────────▶│   Frontend   │────────▶│   Supabase  │
│  (Navegador)│         │   (React)    │         │  (Database) │
└─────────────┘         └──────────────┘         └─────────────┘
                                │                          ▲
                                │                          │
                                ▼                          │
                        ┌──────────────┐                  │
                        │   Backend    │                  │
                        │  (Express)   │                  │
                        └──────────────┘                  │
                                │                          │
                                │ Webhook                  │
                                ▼                          │
                        ┌──────────────┐                  │
                        │    Asaas     │──────────────────┘
                        │   (Gateway)  │
                        └──────────────┘
```

**Fluxo:**
1. Cliente cria pedido → Salvo no Supabase com `status: 'pendente'`
2. Cliente escolhe método de pagamento → Cria cobrança no Asaas
3. Cliente paga → Asaas processa pagamento
4. Asaas envia webhook → Backend atualiza Supabase → `status: 'pago'`
5. Frontend verifica Supabase → Libera acesso à página protegida

---

## 🗄️ Configuração do Banco de Dados

### Passo 1: Executar o Schema SQL

1. Acesse o Supabase Dashboard: https://app.supabase.com
2. Vá em **SQL Editor**
3. Execute o conteúdo do arquivo `database/schema.sql`

Ou use o Supabase CLI:

```bash
supabase db push
```

### Passo 2: Verificar Tabela Criada

A tabela `pedidos` deve ter as seguintes colunas críticas:

- `id` (UUID) - Chave primária
- `asaas_payment_id` (VARCHAR) - **CRÍTICO** - ID da cobrança do Asaas
- `status` (VARCHAR) - Status do pagamento
- `external_reference` (TEXT) - Referência externa (order_id)

---

## 🔧 Configuração do Backend

### Passo 1: Instalar Dependências

O `@supabase/supabase-js` já está instalado. Se não estiver:

```bash
npm install @supabase/supabase-js
```

### Passo 2: Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
# Asaas
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true

# Supabase (OBRIGATÓRIO para webhook)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook Security (Opcional)
WEBHOOK_SECRET_TOKEN=seu_token_secreto_aqui

# Geral
FRONTEND_URL=http://localhost:8080
PORT=3000
```

**Como obter as credenciais:**

1. **SUPABASE_URL**: 
   - Dashboard → Settings → API → Project URL

2. **SUPABASE_SERVICE_ROLE_KEY**:
   - Dashboard → Settings → API → service_role key
   - ⚠️ **NUNCA** exponha esta chave no frontend!

3. **WEBHOOK_SECRET_TOKEN**:
   - Pode ser qualquer string aleatória
   - Ou deixe vazio para usar `ASAAS_API_KEY` como fallback

### Passo 3: Reiniciar o Servidor

```bash
npm run backend
```

Você deve ver:
```
✅ Cliente Supabase configurado para webhook
✅ ASAAS_API_KEY configurada
✅ Ambiente: SANDBOX
```

---

## 🌐 Configuração do Webhook no Asaas

### ⚡ Opção A: Desenvolvimento Local (Sem Domínio Próprio)

Se você **não tem domínio próprio ainda**, use **ngrok** para expor seu servidor local.

#### 1. Instalar ngrok

**Opção 1 - Via npm (Recomendado):**
```bash
npm install -g ngrok
```

**Opção 2 - Download Manual:**
1. Acesse: https://ngrok.com/download
2. Baixe para Windows
3. Extraia o `ngrok.exe`
4. Coloque na pasta do projeto OU adicione ao PATH

**Opção 3 - Via Script:**
```bash
scripts\install-ngrok.bat
```

#### 2. Iniciar ngrok

**Terminal 1 - Backend (já deve estar rodando):**
```bash
npm run backend
```

**Terminal 2 - ngrok:**
```bash
# Via script (recomendado - não fecha automaticamente)
scripts\start-ngrok.bat

# OU manualmente
ngrok http 3000
```

Você verá:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

**Copie a URL HTTPS** (exemplo: `https://abc123.ngrok.io`)

⚠️ **IMPORTANTE**: 
- A URL do ngrok muda a cada reinício (plano gratuito)
- Se reiniciar o ngrok, atualize a URL no Asaas
- Mantenha o ngrok rodando enquanto testa

#### 3. Configurar no Asaas

Use a URL do ngrok + `/api/asaas/webhook`:
```
https://abc123.ngrok.io/api/asaas/webhook
```

### 🌍 Opção B: Produção (Com Domínio Próprio)

Se você **já tem domínio próprio**:

**URL do Webhook:**
```
https://seu-dominio.com/api/asaas/webhook
```

### Passo 1: Acessar Painel do Asaas

- **Sandbox**: https://sandbox.asaas.com
- **Produção**: https://www.asaas.com

### Passo 2: Configurar Webhook

1. Vá em **Configurações** → **Webhooks**
2. Clique em **Adicionar Webhook**
3. Configure:

   **✅ Este Webhook ficará ativo?** → **SIM**
   
   **📝 Nome:** `Webhook NUUMA - Local Dev` (ou `Webhook NUUMA - Produção`)
   
   **🔗 URL do Webhook:** 
   - **Local (ngrok):** `https://xxxxx.ngrok.io/api/asaas/webhook`
   - **Produção:** `https://seu-dominio.com/api/asaas/webhook`
   
   **📧 E-mail:** Seu e-mail para notificações de erro
   
   **🔢 Versão da API:** v3 (ou a mais recente)
   
   **🔐 Token de autenticação (Opcional):**
   - Você pode deixar vazio OU
   - Usar sua `ASAAS_API_KEY` como token
   - Se configurar, o backend validará este token
   
   **✅ Fila de sincronização ativada?** → **SIM** (recomendado)
   
   **📤 Tipo de envio:** Normal ou Padrão

4. **Selecionar Eventos:**
   - Clique em **"Cobranças"** para expandir
   - Marque: ✅ `PAYMENT_CONFIRMED` - Pagamento confirmado
   - Marque: ✅ `PAYMENT_RECEIVED` - Pagamento recebido
   - ⚠️ Opcional: `PAYMENT_OVERDUE` - Pagamento vencido
   - ⚠️ Opcional: `PAYMENT_REFUNDED` - Pagamento estornado

5. **Salvar**

### Passo 3: Testar Webhook (Opcional)

O Asaas permite testar o webhook diretamente no painel. Use essa funcionalidade para verificar se está funcionando.

---

## 🔄 Fluxo de Funcionamento

### 4.1. Criação do Pedido

Quando o usuário chega na página de pagamento:

```typescript
// 1. Pedido criado no Supabase
const order = await supabase
  .from('pedidos')
  .insert({
    nome: 'João Silva',
    status: 'pendente', // Status inicial
    // ... outros dados
  });

// 2. Cliente criado no Asaas
const customer = await createAsaasCustomer(...);

// 3. Pagamento criado no Asaas
const payment = await createAsaasPixPayment({
  customerId: customer.id,
  externalReference: order.id, // ← CRÍTICO: Link pedido ↔ pagamento
  // ...
});

// 4. Salvar asaas_payment_id no pedido
await supabase
  .from('pedidos')
  .update({ 
    asaas_payment_id: payment.id,
    external_reference: order.id 
  })
  .eq('id', order.id);
```

### 4.2. Processamento do Pagamento

1. Usuário paga via PIX/Boleto/Cartão
2. Asaas processa o pagamento
3. Asaas envia webhook para o backend

### 4.3. Webhook Atualiza Supabase

```javascript
// Backend recebe webhook
POST /api/asaas/webhook
{
  "event": "PAYMENT_CONFIRMED",
  "payment": {
    "id": "pay_123456789", // asaas_payment_id
    "externalReference": "order-uuid-123",
    "status": "CONFIRMED"
  }
}

// Backend atualiza Supabase (3 estratégias de busca)
// 1. Busca por asaas_payment_id
// 2. Busca por external_reference (id do pedido)
// 3. Busca pedido pendente e atualiza
await supabase
  .from('pedidos')
  .update({ status: 'pago' })
  .eq('id', externalReference);
```

### 4.4. Frontend Verifica Status

O frontend faz polling do Supabase:

```typescript
// Verificar status a cada 5 segundos
const { data } = await supabase
  .from('pedidos')
  .select('status')
  .eq('id', orderId)
  .single();

if (data.status === 'pago') {
  // Liberar acesso à página protegida
  navigate('/sucesso');
}
```

---

## 🧪 Testar o Fluxo Completo

### Teste 1: Verificar Webhook

1. Crie um pedido no sistema
2. Gere um pagamento PIX
3. No painel do Asaas Sandbox, simule a confirmação do pagamento
4. Verifique os logs do backend:

```bash
📥 Webhook Asaas recebido: PAYMENT_CONFIRMED
🔍 Estratégia 2: Tentando atualizar por external_reference: order-uuid
✅ Pedido encontrado por external_reference: order-uuid
✅ Pedido atualizado com sucesso: order-uuid -> Status: pago
```

### Teste 2: Verificar Supabase

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor** → `pedidos`
3. Verifique se o status foi atualizado para `pago`
4. Verifique se `asaas_payment_id` está preenchido

### Teste 3: Verificar Frontend

1. Na página de pagamento, após gerar o PIX
2. Abra o console do navegador
3. Deve ver verificações periódicas do status
4. Quando o webhook atualizar, o status muda automaticamente

### Teste 4: Testar Manualmente

Use o endpoint de teste para simular o webhook:

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_xxxxx",
    "externalReference": "order-uuid-123"
  }'
```

Consulte `docs/TESTAR_WEBHOOK_MANUAL.md` para mais detalhes.

---

## 🔒 Segurança

### Validação do Webhook

O webhook valida:

1. **Token de Segurança** (opcional):
   ```javascript
   const token = req.headers['asaas-access-token'];
   if (token !== WEBHOOK_SECRET_TOKEN) {
     return res.status(401).json({ error: 'Unauthorized' });
   }
   ```

2. **Filtragem de Eventos**:
   - Apenas processa `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`
   - Ignora outros eventos (retorna 200 OK)

3. **Idempotência**:
   - Se o status já for `pago`, não reprocessa
   - Evita atualizações duplicadas

### Boas Práticas

- ✅ Use `SUPABASE_SERVICE_ROLE_KEY` apenas no backend
- ✅ Nunca exponha a service role key no frontend
- ✅ Configure `WEBHOOK_SECRET_TOKEN` em produção
- ✅ Use HTTPS em produção
- ✅ Monitore logs do webhook
- ✅ Implemente rate limiting (opcional)

---

## 📊 Monitoramento

### Logs do Backend

O webhook registra:

- ✅ Webhooks recebidos
- ✅ Pedidos atualizados
- ❌ Erros de processamento
- ⚠️ Avisos (pedidos não encontrados)

### Verificar Status Manualmente

```sql
-- Ver pedidos pendentes
SELECT id, nome, status, asaas_payment_id, created_at
FROM pedidos
WHERE status = 'pendente'
ORDER BY created_at DESC;

-- Ver pedidos pagos nas últimas 24h
SELECT id, nome, status, asaas_payment_id, updated_at
FROM pedidos
WHERE status = 'pago'
  AND updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;
```

---

## 🐛 Troubleshooting

### Webhook não está sendo chamado

1. Verifique se a URL está correta no painel do Asaas
2. Use ngrok para desenvolvimento local
3. Verifique se o servidor backend está rodando
4. Verifique logs do Asaas (se disponível)
5. Verifique interface do ngrok: http://127.0.0.1:4040

### Pedido não está sendo atualizado

1. Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurado
2. Verifique se `asaas_payment_id` foi salvo no pedido
3. Verifique logs do backend para erros
4. Verifique se o `external_reference` está correto
5. Use o endpoint de teste: `POST /api/asaas/test-webhook`

### Status não muda no frontend

1. Verifique se o polling está ativo
2. Verifique console do navegador para erros
3. Verifique se o `orderId` está correto
4. Verifique conexão com Supabase

### Erro PGRST116 ao salvar asaas_payment_id

**Sintoma:**
```
❌ Erro ao salvar asaas_payment_id: {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  message: 'Cannot coerce the result to a single JSON object'
}
```

**Causa:** O pedido não existe no Supabase quando tenta atualizar.

**Solução:**
- O código já verifica se o pedido existe antes de atualizar
- Se o erro persistir, verifique se o pedido foi criado corretamente
- O webhook ainda funciona mesmo se o `asaas_payment_id` não for salvo

### Erro 401 (Unauthorized)

Consulte `docs/TROUBLESHOOTING.md` para soluções detalhadas.

---

## 📚 Documentação Adicional

- **API do Asaas**: https://asaasv3.docs.apiary.io/
- **Supabase Docs**: https://supabase.com/docs
- **Webhook Events**: https://asaasv3.docs.apiary.io/#reference/0/webhooks
- **ngrok Docs**: https://ngrok.com/docs

---

## ✅ Checklist de Implementação

- [ ] Schema SQL executado no Supabase
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado
- [ ] Webhook configurado no painel do Asaas
- [ ] Servidor backend reiniciado
- [ ] Teste de webhook realizado
- [ ] Verificação de status no frontend funcionando
- [ ] Logs sendo monitorados

---

**🎉 Pronto!** Seu sistema de webhook está configurado e funcionando. O status dos pagamentos será atualizado automaticamente via webhook do Asaas.


Este guia completo detalha a implementação e configuração do sistema de webhook do Asaas integrado com Supabase para confirmação automática de pagamentos.

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
3. [Configuração do Backend](#configuração-do-backend)
4. [Configuração do Webhook no Asaas](#configuração-do-webhook-no-asaas)
5. [Desenvolvimento Local (ngrok)](#desenvolvimento-local-ngrok)
6. [Fluxo de Funcionamento](#fluxo-de-funcionamento)
7. [Testar o Fluxo Completo](#testar-o-fluxo-completo)
8. [Segurança](#segurança)
9. [Monitoramento](#monitoramento)
10. [Troubleshooting](#troubleshooting)

---

## 📋 Visão Geral da Arquitetura

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Cliente   │────────▶│   Frontend   │────────▶│   Supabase  │
│  (Navegador)│         │   (React)    │         │  (Database) │
└─────────────┘         └──────────────┘         └─────────────┘
                                │                          ▲
                                │                          │
                                ▼                          │
                        ┌──────────────┐                  │
                        │   Backend    │                  │
                        │  (Express)   │                  │
                        └──────────────┘                  │
                                │                          │
                                │ Webhook                  │
                                ▼                          │
                        ┌──────────────┐                  │
                        │    Asaas     │──────────────────┘
                        │   (Gateway)  │
                        └──────────────┘
```

**Fluxo:**
1. Cliente cria pedido → Salvo no Supabase com `status: 'pendente'`
2. Cliente escolhe método de pagamento → Cria cobrança no Asaas
3. Cliente paga → Asaas processa pagamento
4. Asaas envia webhook → Backend atualiza Supabase → `status: 'pago'`
5. Frontend verifica Supabase → Libera acesso à página protegida

---

## 🗄️ Configuração do Banco de Dados

### Passo 1: Executar o Schema SQL

1. Acesse o Supabase Dashboard: https://app.supabase.com
2. Vá em **SQL Editor**
3. Execute o conteúdo do arquivo `database/schema.sql`

Ou use o Supabase CLI:

```bash
supabase db push
```

### Passo 2: Verificar Tabela Criada

A tabela `pedidos` deve ter as seguintes colunas críticas:

- `id` (UUID) - Chave primária
- `asaas_payment_id` (VARCHAR) - **CRÍTICO** - ID da cobrança do Asaas
- `status` (VARCHAR) - Status do pagamento
- `external_reference` (TEXT) - Referência externa (order_id)

---

## 🔧 Configuração do Backend

### Passo 1: Instalar Dependências

O `@supabase/supabase-js` já está instalado. Se não estiver:

```bash
npm install @supabase/supabase-js
```

### Passo 2: Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
# Asaas
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true

# Supabase (OBRIGATÓRIO para webhook)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook Security (Opcional)
WEBHOOK_SECRET_TOKEN=seu_token_secreto_aqui

# Geral
FRONTEND_URL=http://localhost:8080
PORT=3000
```

**Como obter as credenciais:**

1. **SUPABASE_URL**: 
   - Dashboard → Settings → API → Project URL

2. **SUPABASE_SERVICE_ROLE_KEY**:
   - Dashboard → Settings → API → service_role key
   - ⚠️ **NUNCA** exponha esta chave no frontend!

3. **WEBHOOK_SECRET_TOKEN**:
   - Pode ser qualquer string aleatória
   - Ou deixe vazio para usar `ASAAS_API_KEY` como fallback

### Passo 3: Reiniciar o Servidor

```bash
npm run backend
```

Você deve ver:
```
✅ Cliente Supabase configurado para webhook
✅ ASAAS_API_KEY configurada
✅ Ambiente: SANDBOX
```

---

## 🌐 Configuração do Webhook no Asaas

### ⚡ Opção A: Desenvolvimento Local (Sem Domínio Próprio)

Se você **não tem domínio próprio ainda**, use **ngrok** para expor seu servidor local.

#### 1. Instalar ngrok

**Opção 1 - Via npm (Recomendado):**
```bash
npm install -g ngrok
```

**Opção 2 - Download Manual:**
1. Acesse: https://ngrok.com/download
2. Baixe para Windows
3. Extraia o `ngrok.exe`
4. Coloque na pasta do projeto OU adicione ao PATH

**Opção 3 - Via Script:**
```bash
scripts\install-ngrok.bat
```

#### 2. Iniciar ngrok

**Terminal 1 - Backend (já deve estar rodando):**
```bash
npm run backend
```

**Terminal 2 - ngrok:**
```bash
# Via script (recomendado - não fecha automaticamente)
scripts\start-ngrok.bat

# OU manualmente
ngrok http 3000
```

Você verá:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

**Copie a URL HTTPS** (exemplo: `https://abc123.ngrok.io`)

⚠️ **IMPORTANTE**: 
- A URL do ngrok muda a cada reinício (plano gratuito)
- Se reiniciar o ngrok, atualize a URL no Asaas
- Mantenha o ngrok rodando enquanto testa

#### 3. Configurar no Asaas

Use a URL do ngrok + `/api/asaas/webhook`:
```
https://abc123.ngrok.io/api/asaas/webhook
```

### 🌍 Opção B: Produção (Com Domínio Próprio)

Se você **já tem domínio próprio**:

**URL do Webhook:**
```
https://seu-dominio.com/api/asaas/webhook
```

### Passo 1: Acessar Painel do Asaas

- **Sandbox**: https://sandbox.asaas.com
- **Produção**: https://www.asaas.com

### Passo 2: Configurar Webhook

1. Vá em **Configurações** → **Webhooks**
2. Clique em **Adicionar Webhook**
3. Configure:

   **✅ Este Webhook ficará ativo?** → **SIM**
   
   **📝 Nome:** `Webhook NUUMA - Local Dev` (ou `Webhook NUUMA - Produção`)
   
   **🔗 URL do Webhook:** 
   - **Local (ngrok):** `https://xxxxx.ngrok.io/api/asaas/webhook`
   - **Produção:** `https://seu-dominio.com/api/asaas/webhook`
   
   **📧 E-mail:** Seu e-mail para notificações de erro
   
   **🔢 Versão da API:** v3 (ou a mais recente)
   
   **🔐 Token de autenticação (Opcional):**
   - Você pode deixar vazio OU
   - Usar sua `ASAAS_API_KEY` como token
   - Se configurar, o backend validará este token
   
   **✅ Fila de sincronização ativada?** → **SIM** (recomendado)
   
   **📤 Tipo de envio:** Normal ou Padrão

4. **Selecionar Eventos:**
   - Clique em **"Cobranças"** para expandir
   - Marque: ✅ `PAYMENT_CONFIRMED` - Pagamento confirmado
   - Marque: ✅ `PAYMENT_RECEIVED` - Pagamento recebido
   - ⚠️ Opcional: `PAYMENT_OVERDUE` - Pagamento vencido
   - ⚠️ Opcional: `PAYMENT_REFUNDED` - Pagamento estornado

5. **Salvar**

### Passo 3: Testar Webhook (Opcional)

O Asaas permite testar o webhook diretamente no painel. Use essa funcionalidade para verificar se está funcionando.

---

## 🔄 Fluxo de Funcionamento

### 4.1. Criação do Pedido

Quando o usuário chega na página de pagamento:

```typescript
// 1. Pedido criado no Supabase
const order = await supabase
  .from('pedidos')
  .insert({
    nome: 'João Silva',
    status: 'pendente', // Status inicial
    // ... outros dados
  });

// 2. Cliente criado no Asaas
const customer = await createAsaasCustomer(...);

// 3. Pagamento criado no Asaas
const payment = await createAsaasPixPayment({
  customerId: customer.id,
  externalReference: order.id, // ← CRÍTICO: Link pedido ↔ pagamento
  // ...
});

// 4. Salvar asaas_payment_id no pedido
await supabase
  .from('pedidos')
  .update({ 
    asaas_payment_id: payment.id,
    external_reference: order.id 
  })
  .eq('id', order.id);
```

### 4.2. Processamento do Pagamento

1. Usuário paga via PIX/Boleto/Cartão
2. Asaas processa o pagamento
3. Asaas envia webhook para o backend

### 4.3. Webhook Atualiza Supabase

```javascript
// Backend recebe webhook
POST /api/asaas/webhook
{
  "event": "PAYMENT_CONFIRMED",
  "payment": {
    "id": "pay_123456789", // asaas_payment_id
    "externalReference": "order-uuid-123",
    "status": "CONFIRMED"
  }
}

// Backend atualiza Supabase (3 estratégias de busca)
// 1. Busca por asaas_payment_id
// 2. Busca por external_reference (id do pedido)
// 3. Busca pedido pendente e atualiza
await supabase
  .from('pedidos')
  .update({ status: 'pago' })
  .eq('id', externalReference);
```

### 4.4. Frontend Verifica Status

O frontend faz polling do Supabase:

```typescript
// Verificar status a cada 5 segundos
const { data } = await supabase
  .from('pedidos')
  .select('status')
  .eq('id', orderId)
  .single();

if (data.status === 'pago') {
  // Liberar acesso à página protegida
  navigate('/sucesso');
}
```

---

## 🧪 Testar o Fluxo Completo

### Teste 1: Verificar Webhook

1. Crie um pedido no sistema
2. Gere um pagamento PIX
3. No painel do Asaas Sandbox, simule a confirmação do pagamento
4. Verifique os logs do backend:

```bash
📥 Webhook Asaas recebido: PAYMENT_CONFIRMED
🔍 Estratégia 2: Tentando atualizar por external_reference: order-uuid
✅ Pedido encontrado por external_reference: order-uuid
✅ Pedido atualizado com sucesso: order-uuid -> Status: pago
```

### Teste 2: Verificar Supabase

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor** → `pedidos`
3. Verifique se o status foi atualizado para `pago`
4. Verifique se `asaas_payment_id` está preenchido

### Teste 3: Verificar Frontend

1. Na página de pagamento, após gerar o PIX
2. Abra o console do navegador
3. Deve ver verificações periódicas do status
4. Quando o webhook atualizar, o status muda automaticamente

### Teste 4: Testar Manualmente

Use o endpoint de teste para simular o webhook:

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_xxxxx",
    "externalReference": "order-uuid-123"
  }'
```

Consulte `docs/TESTAR_WEBHOOK_MANUAL.md` para mais detalhes.

---

## 🔒 Segurança

### Validação do Webhook

O webhook valida:

1. **Token de Segurança** (opcional):
   ```javascript
   const token = req.headers['asaas-access-token'];
   if (token !== WEBHOOK_SECRET_TOKEN) {
     return res.status(401).json({ error: 'Unauthorized' });
   }
   ```

2. **Filtragem de Eventos**:
   - Apenas processa `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`
   - Ignora outros eventos (retorna 200 OK)

3. **Idempotência**:
   - Se o status já for `pago`, não reprocessa
   - Evita atualizações duplicadas

### Boas Práticas

- ✅ Use `SUPABASE_SERVICE_ROLE_KEY` apenas no backend
- ✅ Nunca exponha a service role key no frontend
- ✅ Configure `WEBHOOK_SECRET_TOKEN` em produção
- ✅ Use HTTPS em produção
- ✅ Monitore logs do webhook
- ✅ Implemente rate limiting (opcional)

---

## 📊 Monitoramento

### Logs do Backend

O webhook registra:

- ✅ Webhooks recebidos
- ✅ Pedidos atualizados
- ❌ Erros de processamento
- ⚠️ Avisos (pedidos não encontrados)

### Verificar Status Manualmente

```sql
-- Ver pedidos pendentes
SELECT id, nome, status, asaas_payment_id, created_at
FROM pedidos
WHERE status = 'pendente'
ORDER BY created_at DESC;

-- Ver pedidos pagos nas últimas 24h
SELECT id, nome, status, asaas_payment_id, updated_at
FROM pedidos
WHERE status = 'pago'
  AND updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;
```

---

## 🐛 Troubleshooting

### Webhook não está sendo chamado

1. Verifique se a URL está correta no painel do Asaas
2. Use ngrok para desenvolvimento local
3. Verifique se o servidor backend está rodando
4. Verifique logs do Asaas (se disponível)
5. Verifique interface do ngrok: http://127.0.0.1:4040

### Pedido não está sendo atualizado

1. Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurado
2. Verifique se `asaas_payment_id` foi salvo no pedido
3. Verifique logs do backend para erros
4. Verifique se o `external_reference` está correto
5. Use o endpoint de teste: `POST /api/asaas/test-webhook`

### Status não muda no frontend

1. Verifique se o polling está ativo
2. Verifique console do navegador para erros
3. Verifique se o `orderId` está correto
4. Verifique conexão com Supabase

### Erro PGRST116 ao salvar asaas_payment_id

**Sintoma:**
```
❌ Erro ao salvar asaas_payment_id: {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  message: 'Cannot coerce the result to a single JSON object'
}
```

**Causa:** O pedido não existe no Supabase quando tenta atualizar.

**Solução:**
- O código já verifica se o pedido existe antes de atualizar
- Se o erro persistir, verifique se o pedido foi criado corretamente
- O webhook ainda funciona mesmo se o `asaas_payment_id` não for salvo

### Erro 401 (Unauthorized)

Consulte `docs/TROUBLESHOOTING.md` para soluções detalhadas.

---

## 📚 Documentação Adicional

- **API do Asaas**: https://asaasv3.docs.apiary.io/
- **Supabase Docs**: https://supabase.com/docs
- **Webhook Events**: https://asaasv3.docs.apiary.io/#reference/0/webhooks
- **ngrok Docs**: https://ngrok.com/docs

---

## ✅ Checklist de Implementação

- [ ] Schema SQL executado no Supabase
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado
- [ ] Webhook configurado no painel do Asaas
- [ ] Servidor backend reiniciado
- [ ] Teste de webhook realizado
- [ ] Verificação de status no frontend funcionando
- [ ] Logs sendo monitorados

---

**🎉 Pronto!** Seu sistema de webhook está configurado e funcionando. O status dos pagamentos será atualizado automaticamente via webhook do Asaas.


Este guia completo detalha a implementação e configuração do sistema de webhook do Asaas integrado com Supabase para confirmação automática de pagamentos.

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
3. [Configuração do Backend](#configuração-do-backend)
4. [Configuração do Webhook no Asaas](#configuração-do-webhook-no-asaas)
5. [Desenvolvimento Local (ngrok)](#desenvolvimento-local-ngrok)
6. [Fluxo de Funcionamento](#fluxo-de-funcionamento)
7. [Testar o Fluxo Completo](#testar-o-fluxo-completo)
8. [Segurança](#segurança)
9. [Monitoramento](#monitoramento)
10. [Troubleshooting](#troubleshooting)

---

## 📋 Visão Geral da Arquitetura

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Cliente   │────────▶│   Frontend   │────────▶│   Supabase  │
│  (Navegador)│         │   (React)    │         │  (Database) │
└─────────────┘         └──────────────┘         └─────────────┘
                                │                          ▲
                                │                          │
                                ▼                          │
                        ┌──────────────┐                  │
                        │   Backend    │                  │
                        │  (Express)   │                  │
                        └──────────────┘                  │
                                │                          │
                                │ Webhook                  │
                                ▼                          │
                        ┌──────────────┐                  │
                        │    Asaas     │──────────────────┘
                        │   (Gateway)  │
                        └──────────────┘
```

**Fluxo:**
1. Cliente cria pedido → Salvo no Supabase com `status: 'pendente'`
2. Cliente escolhe método de pagamento → Cria cobrança no Asaas
3. Cliente paga → Asaas processa pagamento
4. Asaas envia webhook → Backend atualiza Supabase → `status: 'pago'`
5. Frontend verifica Supabase → Libera acesso à página protegida

---

## 🗄️ Configuração do Banco de Dados

### Passo 1: Executar o Schema SQL

1. Acesse o Supabase Dashboard: https://app.supabase.com
2. Vá em **SQL Editor**
3. Execute o conteúdo do arquivo `database/schema.sql`

Ou use o Supabase CLI:

```bash
supabase db push
```

### Passo 2: Verificar Tabela Criada

A tabela `pedidos` deve ter as seguintes colunas críticas:

- `id` (UUID) - Chave primária
- `asaas_payment_id` (VARCHAR) - **CRÍTICO** - ID da cobrança do Asaas
- `status` (VARCHAR) - Status do pagamento
- `external_reference` (TEXT) - Referência externa (order_id)

---

## 🔧 Configuração do Backend

### Passo 1: Instalar Dependências

O `@supabase/supabase-js` já está instalado. Se não estiver:

```bash
npm install @supabase/supabase-js
```

### Passo 2: Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
# Asaas
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true

# Supabase (OBRIGATÓRIO para webhook)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook Security (Opcional)
WEBHOOK_SECRET_TOKEN=seu_token_secreto_aqui

# Geral
FRONTEND_URL=http://localhost:8080
PORT=3000
```

**Como obter as credenciais:**

1. **SUPABASE_URL**: 
   - Dashboard → Settings → API → Project URL

2. **SUPABASE_SERVICE_ROLE_KEY**:
   - Dashboard → Settings → API → service_role key
   - ⚠️ **NUNCA** exponha esta chave no frontend!

3. **WEBHOOK_SECRET_TOKEN**:
   - Pode ser qualquer string aleatória
   - Ou deixe vazio para usar `ASAAS_API_KEY` como fallback

### Passo 3: Reiniciar o Servidor

```bash
npm run backend
```

Você deve ver:
```
✅ Cliente Supabase configurado para webhook
✅ ASAAS_API_KEY configurada
✅ Ambiente: SANDBOX
```

---

## 🌐 Configuração do Webhook no Asaas

### ⚡ Opção A: Desenvolvimento Local (Sem Domínio Próprio)

Se você **não tem domínio próprio ainda**, use **ngrok** para expor seu servidor local.

#### 1. Instalar ngrok

**Opção 1 - Via npm (Recomendado):**
```bash
npm install -g ngrok
```

**Opção 2 - Download Manual:**
1. Acesse: https://ngrok.com/download
2. Baixe para Windows
3. Extraia o `ngrok.exe`
4. Coloque na pasta do projeto OU adicione ao PATH

**Opção 3 - Via Script:**
```bash
scripts\install-ngrok.bat
```

#### 2. Iniciar ngrok

**Terminal 1 - Backend (já deve estar rodando):**
```bash
npm run backend
```

**Terminal 2 - ngrok:**
```bash
# Via script (recomendado - não fecha automaticamente)
scripts\start-ngrok.bat

# OU manualmente
ngrok http 3000
```

Você verá:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

**Copie a URL HTTPS** (exemplo: `https://abc123.ngrok.io`)

⚠️ **IMPORTANTE**: 
- A URL do ngrok muda a cada reinício (plano gratuito)
- Se reiniciar o ngrok, atualize a URL no Asaas
- Mantenha o ngrok rodando enquanto testa

#### 3. Configurar no Asaas

Use a URL do ngrok + `/api/asaas/webhook`:
```
https://abc123.ngrok.io/api/asaas/webhook
```

### 🌍 Opção B: Produção (Com Domínio Próprio)

Se você **já tem domínio próprio**:

**URL do Webhook:**
```
https://seu-dominio.com/api/asaas/webhook
```

### Passo 1: Acessar Painel do Asaas

- **Sandbox**: https://sandbox.asaas.com
- **Produção**: https://www.asaas.com

### Passo 2: Configurar Webhook

1. Vá em **Configurações** → **Webhooks**
2. Clique em **Adicionar Webhook**
3. Configure:

   **✅ Este Webhook ficará ativo?** → **SIM**
   
   **📝 Nome:** `Webhook NUUMA - Local Dev` (ou `Webhook NUUMA - Produção`)
   
   **🔗 URL do Webhook:** 
   - **Local (ngrok):** `https://xxxxx.ngrok.io/api/asaas/webhook`
   - **Produção:** `https://seu-dominio.com/api/asaas/webhook`
   
   **📧 E-mail:** Seu e-mail para notificações de erro
   
   **🔢 Versão da API:** v3 (ou a mais recente)
   
   **🔐 Token de autenticação (Opcional):**
   - Você pode deixar vazio OU
   - Usar sua `ASAAS_API_KEY` como token
   - Se configurar, o backend validará este token
   
   **✅ Fila de sincronização ativada?** → **SIM** (recomendado)
   
   **📤 Tipo de envio:** Normal ou Padrão

4. **Selecionar Eventos:**
   - Clique em **"Cobranças"** para expandir
   - Marque: ✅ `PAYMENT_CONFIRMED` - Pagamento confirmado
   - Marque: ✅ `PAYMENT_RECEIVED` - Pagamento recebido
   - ⚠️ Opcional: `PAYMENT_OVERDUE` - Pagamento vencido
   - ⚠️ Opcional: `PAYMENT_REFUNDED` - Pagamento estornado

5. **Salvar**

### Passo 3: Testar Webhook (Opcional)

O Asaas permite testar o webhook diretamente no painel. Use essa funcionalidade para verificar se está funcionando.

---

## 🔄 Fluxo de Funcionamento

### 4.1. Criação do Pedido

Quando o usuário chega na página de pagamento:

```typescript
// 1. Pedido criado no Supabase
const order = await supabase
  .from('pedidos')
  .insert({
    nome: 'João Silva',
    status: 'pendente', // Status inicial
    // ... outros dados
  });

// 2. Cliente criado no Asaas
const customer = await createAsaasCustomer(...);

// 3. Pagamento criado no Asaas
const payment = await createAsaasPixPayment({
  customerId: customer.id,
  externalReference: order.id, // ← CRÍTICO: Link pedido ↔ pagamento
  // ...
});

// 4. Salvar asaas_payment_id no pedido
await supabase
  .from('pedidos')
  .update({ 
    asaas_payment_id: payment.id,
    external_reference: order.id 
  })
  .eq('id', order.id);
```

### 4.2. Processamento do Pagamento

1. Usuário paga via PIX/Boleto/Cartão
2. Asaas processa o pagamento
3. Asaas envia webhook para o backend

### 4.3. Webhook Atualiza Supabase

```javascript
// Backend recebe webhook
POST /api/asaas/webhook
{
  "event": "PAYMENT_CONFIRMED",
  "payment": {
    "id": "pay_123456789", // asaas_payment_id
    "externalReference": "order-uuid-123",
    "status": "CONFIRMED"
  }
}

// Backend atualiza Supabase (3 estratégias de busca)
// 1. Busca por asaas_payment_id
// 2. Busca por external_reference (id do pedido)
// 3. Busca pedido pendente e atualiza
await supabase
  .from('pedidos')
  .update({ status: 'pago' })
  .eq('id', externalReference);
```

### 4.4. Frontend Verifica Status

O frontend faz polling do Supabase:

```typescript
// Verificar status a cada 5 segundos
const { data } = await supabase
  .from('pedidos')
  .select('status')
  .eq('id', orderId)
  .single();

if (data.status === 'pago') {
  // Liberar acesso à página protegida
  navigate('/sucesso');
}
```

---

## 🧪 Testar o Fluxo Completo

### Teste 1: Verificar Webhook

1. Crie um pedido no sistema
2. Gere um pagamento PIX
3. No painel do Asaas Sandbox, simule a confirmação do pagamento
4. Verifique os logs do backend:

```bash
📥 Webhook Asaas recebido: PAYMENT_CONFIRMED
🔍 Estratégia 2: Tentando atualizar por external_reference: order-uuid
✅ Pedido encontrado por external_reference: order-uuid
✅ Pedido atualizado com sucesso: order-uuid -> Status: pago
```

### Teste 2: Verificar Supabase

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor** → `pedidos`
3. Verifique se o status foi atualizado para `pago`
4. Verifique se `asaas_payment_id` está preenchido

### Teste 3: Verificar Frontend

1. Na página de pagamento, após gerar o PIX
2. Abra o console do navegador
3. Deve ver verificações periódicas do status
4. Quando o webhook atualizar, o status muda automaticamente

### Teste 4: Testar Manualmente

Use o endpoint de teste para simular o webhook:

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_xxxxx",
    "externalReference": "order-uuid-123"
  }'
```

Consulte `docs/TESTAR_WEBHOOK_MANUAL.md` para mais detalhes.

---

## 🔒 Segurança

### Validação do Webhook

O webhook valida:

1. **Token de Segurança** (opcional):
   ```javascript
   const token = req.headers['asaas-access-token'];
   if (token !== WEBHOOK_SECRET_TOKEN) {
     return res.status(401).json({ error: 'Unauthorized' });
   }
   ```

2. **Filtragem de Eventos**:
   - Apenas processa `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`
   - Ignora outros eventos (retorna 200 OK)

3. **Idempotência**:
   - Se o status já for `pago`, não reprocessa
   - Evita atualizações duplicadas

### Boas Práticas

- ✅ Use `SUPABASE_SERVICE_ROLE_KEY` apenas no backend
- ✅ Nunca exponha a service role key no frontend
- ✅ Configure `WEBHOOK_SECRET_TOKEN` em produção
- ✅ Use HTTPS em produção
- ✅ Monitore logs do webhook
- ✅ Implemente rate limiting (opcional)

---

## 📊 Monitoramento

### Logs do Backend

O webhook registra:

- ✅ Webhooks recebidos
- ✅ Pedidos atualizados
- ❌ Erros de processamento
- ⚠️ Avisos (pedidos não encontrados)

### Verificar Status Manualmente

```sql
-- Ver pedidos pendentes
SELECT id, nome, status, asaas_payment_id, created_at
FROM pedidos
WHERE status = 'pendente'
ORDER BY created_at DESC;

-- Ver pedidos pagos nas últimas 24h
SELECT id, nome, status, asaas_payment_id, updated_at
FROM pedidos
WHERE status = 'pago'
  AND updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;
```

---

## 🐛 Troubleshooting

### Webhook não está sendo chamado

1. Verifique se a URL está correta no painel do Asaas
2. Use ngrok para desenvolvimento local
3. Verifique se o servidor backend está rodando
4. Verifique logs do Asaas (se disponível)
5. Verifique interface do ngrok: http://127.0.0.1:4040

### Pedido não está sendo atualizado

1. Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurado
2. Verifique se `asaas_payment_id` foi salvo no pedido
3. Verifique logs do backend para erros
4. Verifique se o `external_reference` está correto
5. Use o endpoint de teste: `POST /api/asaas/test-webhook`

### Status não muda no frontend

1. Verifique se o polling está ativo
2. Verifique console do navegador para erros
3. Verifique se o `orderId` está correto
4. Verifique conexão com Supabase

### Erro PGRST116 ao salvar asaas_payment_id

**Sintoma:**
```
❌ Erro ao salvar asaas_payment_id: {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  message: 'Cannot coerce the result to a single JSON object'
}
```

**Causa:** O pedido não existe no Supabase quando tenta atualizar.

**Solução:**
- O código já verifica se o pedido existe antes de atualizar
- Se o erro persistir, verifique se o pedido foi criado corretamente
- O webhook ainda funciona mesmo se o `asaas_payment_id` não for salvo

### Erro 401 (Unauthorized)

Consulte `docs/TROUBLESHOOTING.md` para soluções detalhadas.

---

## 📚 Documentação Adicional

- **API do Asaas**: https://asaasv3.docs.apiary.io/
- **Supabase Docs**: https://supabase.com/docs
- **Webhook Events**: https://asaasv3.docs.apiary.io/#reference/0/webhooks
- **ngrok Docs**: https://ngrok.com/docs

---

## ✅ Checklist de Implementação

- [ ] Schema SQL executado no Supabase
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado
- [ ] Webhook configurado no painel do Asaas
- [ ] Servidor backend reiniciado
- [ ] Teste de webhook realizado
- [ ] Verificação de status no frontend funcionando
- [ ] Logs sendo monitorados

---

**🎉 Pronto!** Seu sistema de webhook está configurado e funcionando. O status dos pagamentos será atualizado automaticamente via webhook do Asaas.




