# 🧪 Como Testar o Webhook Manualmente

Se o pagamento está aprovado no Asaas mas o webhook não atualizou o Supabase, você pode testar manualmente usando o endpoint de teste.

## 📋 Informações Necessárias

Do console do navegador ou do painel do Asaas, você precisa de:

1. **`orderId`** (ID do pedido no Supabase)
   - Exemplo: `e364e429-d0fb-4713-b03a-dd449238951e`
   - Está no console: "Verificando status do pedido: { orderId: '...' }"

2. **`paymentId`** (ID do pagamento no Asaas)
   - Exemplo: `pay_4ga7xtmik95gkm83`
   - Está na descrição da cobrança no Asaas ou no console

## 🚀 Testar via Endpoint

### Opção 1: Via cURL

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_4ga7xtmik95gkm83",
    "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
  }'
```

### Opção 2: Via Postman/Insomnia

**URL:** `POST http://localhost:3000/api/asaas/test-webhook`

**Body (JSON):**
```json
{
  "paymentId": "pay_4ga7xtmik95gkm83",
  "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
}
```

### Opção 3: Via PowerShell (Windows)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/asaas/test-webhook" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "paymentId": "pay_4ga7xtmik95gkm83",
    "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
  }'
```

## ✅ Resposta Esperada

**Sucesso:**
```json
{
  "success": true,
  "message": "Webhook simulado com sucesso",
  "order": {
    "id": "e364e429-d0fb-4713-b03a-dd449238951e",
    "status_anterior": "pendente",
    "status_novo": "pago",
    "asaas_payment_id": "pay_4ga7xtmik95gkm83"
  }
}
```

**Erro - Pedido não encontrado:**
```json
{
  "error": "Pedido não encontrado",
  "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
}
```

## 🔍 Verificar Logs do Backend

Quando executar o teste, você deve ver no console do backend:

```
🧪 Teste de webhook manual: { paymentId: 'pay_xxx', externalReference: 'order-xxx' }
✅ Pedido encontrado: { id: '...', status: 'pendente', ... }
✅ Pedido atualizado: { id: '...', status_anterior: 'pendente', status_novo: 'pago' }
```

## 📊 Verificar no Supabase

Após o teste, verifique no Supabase:

```sql
SELECT id, status, asaas_payment_id, updated_at
FROM pedidos
WHERE id = 'e364e429-d0fb-4713-b03a-dd449238951e';
```

O status deve estar como `'pago'` e `asaas_payment_id` deve estar preenchido.

## 🐛 Troubleshooting

### Erro: "Pedido não encontrado"

**Causa:** O `externalReference` não corresponde ao `id` do pedido no Supabase.

**Solução:**
1. Verifique o `orderId` correto no console do navegador
2. Verifique no Supabase qual é o ID real do pedido
3. Use o ID correto no teste

### Erro: "Supabase não configurado"

**Causa:** As variáveis `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` não estão configuradas.

**Solução:**
1. Verifique o arquivo `.env` na raiz do projeto
2. Certifique-se de que `SUPABASE_SERVICE_ROLE_KEY` está configurado
3. Reinicie o backend

### O teste funciona, mas o webhook real não

**Causa:** O webhook do Asaas não está sendo chamado ou está falhando.

**Solução:**
1. Verifique se o ngrok está rodando
2. Verifique se a URL do webhook está correta no Asaas
3. Verifique os logs do backend para ver se o webhook está sendo recebido
4. Verifique se o `externalReference` no webhook corresponde ao `id` do pedido

---

**✅ Use este teste para verificar se o problema é no webhook ou na lógica de atualização!**


Se o pagamento está aprovado no Asaas mas o webhook não atualizou o Supabase, você pode testar manualmente usando o endpoint de teste.

## 📋 Informações Necessárias

Do console do navegador ou do painel do Asaas, você precisa de:

1. **`orderId`** (ID do pedido no Supabase)
   - Exemplo: `e364e429-d0fb-4713-b03a-dd449238951e`
   - Está no console: "Verificando status do pedido: { orderId: '...' }"

2. **`paymentId`** (ID do pagamento no Asaas)
   - Exemplo: `pay_4ga7xtmik95gkm83`
   - Está na descrição da cobrança no Asaas ou no console

## 🚀 Testar via Endpoint

### Opção 1: Via cURL

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_4ga7xtmik95gkm83",
    "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
  }'
```

### Opção 2: Via Postman/Insomnia

**URL:** `POST http://localhost:3000/api/asaas/test-webhook`

**Body (JSON):**
```json
{
  "paymentId": "pay_4ga7xtmik95gkm83",
  "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
}
```

### Opção 3: Via PowerShell (Windows)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/asaas/test-webhook" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "paymentId": "pay_4ga7xtmik95gkm83",
    "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
  }'
```

## ✅ Resposta Esperada

**Sucesso:**
```json
{
  "success": true,
  "message": "Webhook simulado com sucesso",
  "order": {
    "id": "e364e429-d0fb-4713-b03a-dd449238951e",
    "status_anterior": "pendente",
    "status_novo": "pago",
    "asaas_payment_id": "pay_4ga7xtmik95gkm83"
  }
}
```

**Erro - Pedido não encontrado:**
```json
{
  "error": "Pedido não encontrado",
  "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
}
```

## 🔍 Verificar Logs do Backend

Quando executar o teste, você deve ver no console do backend:

```
🧪 Teste de webhook manual: { paymentId: 'pay_xxx', externalReference: 'order-xxx' }
✅ Pedido encontrado: { id: '...', status: 'pendente', ... }
✅ Pedido atualizado: { id: '...', status_anterior: 'pendente', status_novo: 'pago' }
```

## 📊 Verificar no Supabase

Após o teste, verifique no Supabase:

```sql
SELECT id, status, asaas_payment_id, updated_at
FROM pedidos
WHERE id = 'e364e429-d0fb-4713-b03a-dd449238951e';
```

O status deve estar como `'pago'` e `asaas_payment_id` deve estar preenchido.

## 🐛 Troubleshooting

### Erro: "Pedido não encontrado"

**Causa:** O `externalReference` não corresponde ao `id` do pedido no Supabase.

**Solução:**
1. Verifique o `orderId` correto no console do navegador
2. Verifique no Supabase qual é o ID real do pedido
3. Use o ID correto no teste

### Erro: "Supabase não configurado"

**Causa:** As variáveis `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` não estão configuradas.

**Solução:**
1. Verifique o arquivo `.env` na raiz do projeto
2. Certifique-se de que `SUPABASE_SERVICE_ROLE_KEY` está configurado
3. Reinicie o backend

### O teste funciona, mas o webhook real não

**Causa:** O webhook do Asaas não está sendo chamado ou está falhando.

**Solução:**
1. Verifique se o ngrok está rodando
2. Verifique se a URL do webhook está correta no Asaas
3. Verifique os logs do backend para ver se o webhook está sendo recebido
4. Verifique se o `externalReference` no webhook corresponde ao `id` do pedido

---

**✅ Use este teste para verificar se o problema é no webhook ou na lógica de atualização!**


Se o pagamento está aprovado no Asaas mas o webhook não atualizou o Supabase, você pode testar manualmente usando o endpoint de teste.

## 📋 Informações Necessárias

Do console do navegador ou do painel do Asaas, você precisa de:

1. **`orderId`** (ID do pedido no Supabase)
   - Exemplo: `e364e429-d0fb-4713-b03a-dd449238951e`
   - Está no console: "Verificando status do pedido: { orderId: '...' }"

2. **`paymentId`** (ID do pagamento no Asaas)
   - Exemplo: `pay_4ga7xtmik95gkm83`
   - Está na descrição da cobrança no Asaas ou no console

## 🚀 Testar via Endpoint

### Opção 1: Via cURL

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_4ga7xtmik95gkm83",
    "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
  }'
```

### Opção 2: Via Postman/Insomnia

**URL:** `POST http://localhost:3000/api/asaas/test-webhook`

**Body (JSON):**
```json
{
  "paymentId": "pay_4ga7xtmik95gkm83",
  "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
}
```

### Opção 3: Via PowerShell (Windows)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/asaas/test-webhook" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "paymentId": "pay_4ga7xtmik95gkm83",
    "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
  }'
```

## ✅ Resposta Esperada

**Sucesso:**
```json
{
  "success": true,
  "message": "Webhook simulado com sucesso",
  "order": {
    "id": "e364e429-d0fb-4713-b03a-dd449238951e",
    "status_anterior": "pendente",
    "status_novo": "pago",
    "asaas_payment_id": "pay_4ga7xtmik95gkm83"
  }
}
```

**Erro - Pedido não encontrado:**
```json
{
  "error": "Pedido não encontrado",
  "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
}
```

## 🔍 Verificar Logs do Backend

Quando executar o teste, você deve ver no console do backend:

```
🧪 Teste de webhook manual: { paymentId: 'pay_xxx', externalReference: 'order-xxx' }
✅ Pedido encontrado: { id: '...', status: 'pendente', ... }
✅ Pedido atualizado: { id: '...', status_anterior: 'pendente', status_novo: 'pago' }
```

## 📊 Verificar no Supabase

Após o teste, verifique no Supabase:

```sql
SELECT id, status, asaas_payment_id, updated_at
FROM pedidos
WHERE id = 'e364e429-d0fb-4713-b03a-dd449238951e';
```

O status deve estar como `'pago'` e `asaas_payment_id` deve estar preenchido.

## 🐛 Troubleshooting

### Erro: "Pedido não encontrado"

**Causa:** O `externalReference` não corresponde ao `id` do pedido no Supabase.

**Solução:**
1. Verifique o `orderId` correto no console do navegador
2. Verifique no Supabase qual é o ID real do pedido
3. Use o ID correto no teste

### Erro: "Supabase não configurado"

**Causa:** As variáveis `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` não estão configuradas.

**Solução:**
1. Verifique o arquivo `.env` na raiz do projeto
2. Certifique-se de que `SUPABASE_SERVICE_ROLE_KEY` está configurado
3. Reinicie o backend

### O teste funciona, mas o webhook real não

**Causa:** O webhook do Asaas não está sendo chamado ou está falhando.

**Solução:**
1. Verifique se o ngrok está rodando
2. Verifique se a URL do webhook está correta no Asaas
3. Verifique os logs do backend para ver se o webhook está sendo recebido
4. Verifique se o `externalReference` no webhook corresponde ao `id` do pedido

---

**✅ Use este teste para verificar se o problema é no webhook ou na lógica de atualização!**


Se o pagamento está aprovado no Asaas mas o webhook não atualizou o Supabase, você pode testar manualmente usando o endpoint de teste.

## 📋 Informações Necessárias

Do console do navegador ou do painel do Asaas, você precisa de:

1. **`orderId`** (ID do pedido no Supabase)
   - Exemplo: `e364e429-d0fb-4713-b03a-dd449238951e`
   - Está no console: "Verificando status do pedido: { orderId: '...' }"

2. **`paymentId`** (ID do pagamento no Asaas)
   - Exemplo: `pay_4ga7xtmik95gkm83`
   - Está na descrição da cobrança no Asaas ou no console

## 🚀 Testar via Endpoint

### Opção 1: Via cURL

```bash
curl -X POST http://localhost:3000/api/asaas/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_4ga7xtmik95gkm83",
    "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
  }'
```

### Opção 2: Via Postman/Insomnia

**URL:** `POST http://localhost:3000/api/asaas/test-webhook`

**Body (JSON):**
```json
{
  "paymentId": "pay_4ga7xtmik95gkm83",
  "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
}
```

### Opção 3: Via PowerShell (Windows)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/asaas/test-webhook" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "paymentId": "pay_4ga7xtmik95gkm83",
    "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
  }'
```

## ✅ Resposta Esperada

**Sucesso:**
```json
{
  "success": true,
  "message": "Webhook simulado com sucesso",
  "order": {
    "id": "e364e429-d0fb-4713-b03a-dd449238951e",
    "status_anterior": "pendente",
    "status_novo": "pago",
    "asaas_payment_id": "pay_4ga7xtmik95gkm83"
  }
}
```

**Erro - Pedido não encontrado:**
```json
{
  "error": "Pedido não encontrado",
  "externalReference": "e364e429-d0fb-4713-b03a-dd449238951e"
}
```

## 🔍 Verificar Logs do Backend

Quando executar o teste, você deve ver no console do backend:

```
🧪 Teste de webhook manual: { paymentId: 'pay_xxx', externalReference: 'order-xxx' }
✅ Pedido encontrado: { id: '...', status: 'pendente', ... }
✅ Pedido atualizado: { id: '...', status_anterior: 'pendente', status_novo: 'pago' }
```

## 📊 Verificar no Supabase

Após o teste, verifique no Supabase:

```sql
SELECT id, status, asaas_payment_id, updated_at
FROM pedidos
WHERE id = 'e364e429-d0fb-4713-b03a-dd449238951e';
```

O status deve estar como `'pago'` e `asaas_payment_id` deve estar preenchido.

## 🐛 Troubleshooting

### Erro: "Pedido não encontrado"

**Causa:** O `externalReference` não corresponde ao `id` do pedido no Supabase.

**Solução:**
1. Verifique o `orderId` correto no console do navegador
2. Verifique no Supabase qual é o ID real do pedido
3. Use o ID correto no teste

### Erro: "Supabase não configurado"

**Causa:** As variáveis `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` não estão configuradas.

**Solução:**
1. Verifique o arquivo `.env` na raiz do projeto
2. Certifique-se de que `SUPABASE_SERVICE_ROLE_KEY` está configurado
3. Reinicie o backend

### O teste funciona, mas o webhook real não

**Causa:** O webhook do Asaas não está sendo chamado ou está falhando.

**Solução:**
1. Verifique se o ngrok está rodando
2. Verifique se a URL do webhook está correta no Asaas
3. Verifique os logs do backend para ver se o webhook está sendo recebido
4. Verifique se o `externalReference` no webhook corresponde ao `id` do pedido

---

**✅ Use este teste para verificar se o problema é no webhook ou na lógica de atualização!**




