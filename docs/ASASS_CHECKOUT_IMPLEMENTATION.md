# 🚀 Implementação Asaas Checkout - Guia Completo

Este documento descreve a implementação completa do fluxo de pagamento usando **Asaas Checkout** integrado com Supabase e Webhooks.

## 📁 Arquivos Criados

### 1. `database/supabase_schema.sql`
Schema SQL para criar a tabela `orders` no Supabase com:
- Coluna `id` (UUID, Primary Key)
- Coluna `user_id` (UUID, Foreign Key)
- Coluna `asaas_payment_id` (VARCHAR, UNIQUE, CRÍTICO para webhook)
- Coluna `status` (VARCHAR) - valores: 'PENDING' ou 'APPROVED'
- Índices para performance
- Triggers para `updated_at`
- RLS (Row Level Security) configurado

### 2. `asaas-api-server.js`
Servidor Node.js/Express com duas rotas principais:
- **POST `/api/create-checkout`**: Cria pedido no Supabase e checkout no Asaas
- **POST `/asaas-webhook`**: Recebe webhook do Asaas e atualiza status para 'APPROVED'

### 3. `src/pages/CheckoutPage.tsx`
Componente React que:
- Inicia o fluxo de checkout
- Redireciona para o Asaas Checkout
- Faz polling do status no Supabase após retorno
- Libera segunda página apenas se status for 'APPROVED'

## 🔄 Fluxo Completo

```
1. Frontend (React)
   └─> Usuário clica em "Comprar"
       └─> Chama POST /api/create-checkout

2. Backend (API)
   └─> Cria pedido no Supabase (status: 'PENDING')
   └─> Cria checkout no Asaas
   └─> Retorna checkout_url e order_id

3. Frontend (React)
   └─> Redireciona para checkout_url (Asaas Checkout)

4. Asaas Checkout
   └─> Usuário insere dados de pagamento
   └─> Processa pagamento

5. Asaas (Assíncrono)
   └─> Confirma pagamento
   └─> Dispara webhook POST /asaas-webhook

6. Backend (Webhook Handler)
   └─> Valida segurança (token)
   └─> Filtra eventos (PAYMENT_RECEIVED/CONFIRMED)
   └─> Atualiza status no Supabase para 'APPROVED'

7. Frontend (React)
   └─> Retorna do Asaas (checkout-retorno)
   └─> Faz polling no Supabase
   └─> Se status = 'APPROVED', libera segunda página
```

## 🛠️ Configuração

### Passo 1: Executar Schema SQL

1. Acesse o Supabase Dashboard: https://app.supabase.com
2. Vá em **SQL Editor**
3. Execute o conteúdo do arquivo `database/supabase_schema.sql`

### Passo 2: Configurar Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
# Asaas
ASAAS_API_KEY=sua_api_key_aqui
ASAAS_IS_SANDBOX=true

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Webhook
WEBHOOK_SECRET_TOKEN=seu_token_secreto_aqui

# URLs
FRONTEND_URL=http://localhost:8080
SUCCESS_URL=http://localhost:8080/checkout-retorno?status=success
CANCEL_URL=http://localhost:8080/checkout-retorno?status=cancel
```

### Passo 3: Adicionar Rotas no Backend

O arquivo `asaas-api-server.js` contém as rotas necessárias. Você pode:
- **Opção A**: Usar o arquivo `asaas-api-server.js` como servidor separado
- **Opção B**: Copiar as rotas para o `server.cjs` existente

**Para adicionar no server.cjs existente:**

1. Adicione a rota `/api/create-checkout` antes do webhook
2. Adicione a rota `/asaas-webhook` (nova rota que usa tabela 'orders')
3. Mantenha `/api/asaas/webhook` para compatibilidade (usa tabela 'pedidos')

### Passo 4: Configurar Webhook no Asaas

1. Acesse o Dashboard do Asaas
2. Vá em **Configurações > Webhooks**
3. Adicione novo webhook:
   - **URL**: `https://seu-dominio.com/asaas-webhook`
   - **Eventos**: Marque `PAYMENT_RECEIVED` e `PAYMENT_CONFIRMED`
   - **Token**: Configure o `WEBHOOK_SECRET_TOKEN`

### Passo 5: Atualizar Rotas no Frontend

As rotas já foram adicionadas no `App.tsx`:
- `/checkout` - Página inicial do checkout
- `/checkout-retorno` - Página de retorno do Asaas (mesmo componente)

## 📝 Uso

### No Frontend

Para usar o novo checkout, redirecione o usuário para `/checkout`:

```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/checkout');
```

### Substituir Página de Pagamento Antiga

Se quiser substituir completamente a página `/pagamento`:

```tsx
// Em App.tsx, substitua:
<Route path="/pagamento" element={<CheckoutPage />} />
```

## 🔍 Verificação

### Testar Criação de Checkout

**Windows (PowerShell):**
```powershell
.\scripts\test-create-checkout.ps1
```

**Linux/Mac (curl):**
```bash
curl -X POST http://localhost:3000/api/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-123",
    "amount": 150.00
  }'
```

### Testar Webhook (Manual)

**Windows (PowerShell):**
```powershell
.\scripts\test-webhook.ps1
```

**Linux/Mac (curl):**
```bash
curl -X POST http://localhost:3000/asaas-webhook \
  -H "Content-Type: application/json" \
  -H "asaas-access-token: seu_token_aqui" \
  -d '{
    "event": "PAYMENT_RECEIVED",
    "payment": {
      "id": "pay_123456",
      "externalReference": "order-uuid-aqui",
      "status": "RECEIVED"
    }
  }'
```

**⚠️ IMPORTANTE:** 
- Substitua `order-uuid-aqui` por um ID de pedido real do Supabase
- Substitua `seu_token_aqui` pelo `WEBHOOK_SECRET_TOKEN` do arquivo `.env`

## ⚠️ Importante

1. **Tabela 'orders' vs 'pedidos'**: 
   - O novo fluxo usa a tabela `orders` com status 'PENDING'/'APPROVED'
   - O fluxo antigo usa `pedidos` com status 'pendente'/'pago'
   - Ambos podem coexistir

2. **Webhook Duplo**:
   - `/asaas-webhook` - Nova rota (usa tabela 'orders')
   - `/api/asaas/webhook` - Rota antiga (usa tabela 'pedidos')
   - Configure ambas no Asaas ou apenas a nova

3. **Polling**:
   - O frontend faz polling a cada 3 segundos
   - Máximo de 60 tentativas (3 minutos)
   - Ajuste conforme necessário

## ✅ Checklist

- [ ] Schema SQL executado no Supabase
- [ ] Variáveis de ambiente configuradas
- [ ] Rotas adicionadas no backend
- [ ] Webhook configurado no Asaas
- [ ] Rotas adicionadas no frontend
- [ ] Testado criação de checkout
- [ ] Testado webhook
- [ ] Testado fluxo completo

## 🎯 Próximos Passos

1. Testar o fluxo completo em ambiente de desenvolvimento
2. Configurar webhook no Asaas Sandbox
3. Testar com pagamento real
4. Ajustar polling e timeouts conforme necessário
5. Adicionar tratamento de erros mais robusto
6. Implementar logs e monitoramento

