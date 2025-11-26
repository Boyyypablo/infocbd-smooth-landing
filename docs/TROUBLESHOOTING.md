# 🔧 Troubleshooting - Asaas e Webhook

Este guia ajuda a resolver problemas comuns na integração do Asaas e webhook.

## ❌ Erro: ngrok endpoint já está online (ERR_NGROK_334)

### Sintomas

```
ERROR: failed to start tunnel: The endpoint 'https://xxxxx.ngrok-free.dev' is already online.
ERROR: ERR_NGROK_334
```

### Causa

O ngrok já está rodando em outro terminal ou processo.

### Soluções

#### Opção 1: Parar o ngrok existente (Recomendado)

**Windows:**
```bash
# Parar todos os processos ngrok
taskkill /F /IM ngrok.exe

# OU usar o script
npm run ngrok:kill
```

**Linux/Mac:**
```bash
# Encontrar e parar processos ngrok
pkill ngrok

# OU
killall ngrok
```

#### Opção 2: Usar o ngrok existente

Se o ngrok já está rodando, você pode:
1. Acessar a interface web: http://127.0.0.1:4040
2. Copiar a URL HTTPS que já está ativa
3. Usar essa URL no Asaas

#### Opção 3: Usar script melhorado

O script `scripts/start-ngrok.bat` agora detecta se o ngrok está rodando e oferece opções:
- Parar o ngrok existente e iniciar um novo
- Cancelar e usar o ngrok existente

---

## ❌ Erro 401 (Unauthorized)

### Sintomas
- Erro no console: `401 (Unauthorized)` ao criar cliente ou pagamento
- Mensagem: "Erro de autenticação: API Key do Asaas não configurada ou inválida"

### Causas Possíveis

1. **API Key não configurada**
   - O arquivo `.env` não existe ou não contém `ASAAS_API_KEY`
   - A variável está vazia ou comentada

2. **API Key incorreta**
   - A API Key foi copiada incorretamente
   - A API Key está expirada ou foi revogada
   - Está usando a API Key de produção no sandbox (ou vice-versa)

3. **Servidor backend não está rodando**
   - O backend precisa estar rodando na porta 3000
   - Verifique se executou `npm run backend`

### Soluções

#### 1. Verificar se o arquivo .env existe

```bash
# Na raiz do projeto, verifique se existe o arquivo .env
ls .env
# ou no Windows:
dir .env
```

Se não existir, copie o arquivo de exemplo:
```bash
cp backend.env.example .env
# ou no Windows:
copy backend.env.example .env
```

#### 2. Verificar se a API Key está configurada

Abra o arquivo `.env` e verifique se contém:

```env
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true
```

⚠️ **IMPORTANTE**: 
- A API Key deve começar com `$aact_`
- Não adicione aspas ao redor da API Key
- Não deixe espaços antes ou depois do `=`

#### 3. Obter uma nova API Key

**Sandbox:**
1. Acesse https://sandbox.asaas.com
2. Faça login
3. Vá em **Configurações** → **Integrações** → **API**
4. Copie a API Key (começa com `$aact_`)
5. Cole no arquivo `.env`

**Produção:**
1. Acesse https://www.asaas.com
2. Faça login
3. Vá em **Configurações** → **Integrações** → **API**
4. Copie a API Key
5. Cole no arquivo `.env`

#### 4. Verificar se o backend está rodando

```bash
# Verificar se o servidor está respondendo
curl http://localhost:3000/health

# Deve retornar:
# {
#   "status": "ok",
#   "hasAsaasApiKey": true,
#   "asaasIsSandbox": true
# }
```

Se `hasAsaasApiKey` for `false`, a API Key não está sendo lida corretamente.

#### 5. Reiniciar o servidor backend

Após alterar o arquivo `.env`, **sempre reinicie o servidor**:

```bash
# Pare o servidor (Ctrl+C)
# Depois inicie novamente:
npm run backend
```

#### 6. Verificar logs do servidor

Ao iniciar o servidor, você deve ver:

```
✅ ASAAS_API_KEY configurada
✅ Ambiente: SANDBOX
✅ Base URL: https://sandbox.asaas.com/api/v3
```

Se não aparecer, a API Key não está sendo lida.

---

## ❌ Erro ao criar cliente

### Sintomas
- Erro ao criar cliente no Asaas
- Mensagem de erro genérica

### Soluções

1. **Verificar dados obrigatórios**
   - Nome, email e CPF/CNPJ são obrigatórios
   - CPF deve ter 11 dígitos (apenas números)
   - Email deve ser válido

2. **Verificar formato do CPF**
   - Remova pontos, traços e espaços
   - Use apenas números: `12345678900`

3. **Verificar se o cliente já existe**
   - O sistema tenta buscar cliente existente primeiro
   - Se já existir, usa o cliente existente

---

## ❌ Erro ao criar pagamento

### Sintomas
- Erro ao gerar PIX, Boleto ou processar cartão

### Soluções

1. **Verificar se o cliente foi criado**
   - O cliente deve ser criado antes do pagamento
   - Verifique os logs do servidor

2. **Verificar valor**
   - O valor deve ser maior que zero
   - Use formato decimal: `150.00`

3. **Verificar data de vencimento**
   - Data deve estar no formato `YYYY-MM-DD`
   - Data não pode ser no passado

---

## ❌ Erro PGRST116 ao Salvar asaas_payment_id

### Sintomas

**Erro no Console:**
```
❌ Erro ao salvar asaas_payment_id: {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  message: 'Cannot coerce the result to a single JSON object'
}
```

### Causa

- O código tenta atualizar um pedido que não existe no Supabase
- O `.single()` espera exatamente 1 linha, mas retorna 0 linhas
- Isso pode acontecer se:
  1. O pedido não foi criado ainda
  2. O `orderId` está incorreto
  3. Há um problema de timing (tentando atualizar antes do pedido ser criado)

### Solução

O código já foi corrigido para:
- Verificar se o pedido existe antes de atualizar
- Usar `maybeSingle()` em vez de `single()`
- Não quebrar se o pedido não existir

**Se o erro persistir:**

1. Verifique se o pedido foi criado corretamente
2. Verifique os logs do console ao carregar a página de pagamento
3. Verifique se o `orderId` está correto

**Nota Importante:**

Mesmo que o `asaas_payment_id` não seja salvo no frontend, o **webhook ainda funciona** porque:
1. O webhook recebe `externalReference` do Asaas
2. O webhook busca o pedido por `externalReference` (id do pedido)
3. O webhook atualiza o pedido e salva o `asaas_payment_id`

---

## ❌ Webhook não encontra o pedido

### Sintomas

- Webhook recebe `externalReference: "85fdc689-1647-4049-8574-bc8279c00837"` mas o pedido tem `id: "ecd514d0-0125-410e-9c61-6b7b5955718f"`
- Logs mostram: "⚠️ Pedido não encontrado"

### Causa

- IDs diferentes ou múltiplos pedidos criados
- `asaas_payment_id` não foi salvo no pedido

### Solução

O webhook agora tenta **3 estratégias de busca**:

1. **Estratégia 1**: Busca por `asaas_payment_id` (mais preciso)
2. **Estratégia 2**: Busca por `external_reference` (id do pedido)
3. **Estratégia 3**: Busca pedido pendente e atualiza mesmo sem `asaas_payment_id`

**Verificar:**

1. Logs do backend mostram qual estratégia foi usada
2. Se o `externalReference` do webhook corresponde ao `id` do pedido
3. Se há múltiplos pedidos criados

**Solução:**

- Verifique os logs para ver qual estratégia funcionou
- Se nenhuma funcionar, verifique se o `externalReference` está correto
- Use o endpoint de teste: `POST /api/asaas/test-webhook`

---

## ❌ Status não muda para "pago"

### Sintomas

- Pagamento aprovado no Asaas mas status continua "pendente" no Supabase
- Frontend não redireciona para página de sucesso

### Verificar

1. Se o webhook está sendo chamado (logs do backend)
2. Se o Supabase está sendo atualizado (logs do backend)
3. Se há erros no Supabase
4. Se o polling do frontend está ativo

### Solução

1. Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurado
2. Verifique se o webhook está retornando 200 OK
3. Verifique os logs do backend para erros
4. Teste manualmente usando: `POST /api/asaas/test-webhook`
5. Verifique se o frontend está fazendo polling (console do navegador)

---

## ❌ ngrok não inicia

### Sintomas

- Terminal fecha muito rápido ao executar ngrok
- Erro: "ngrok não é reconhecido como comando"

### Soluções

1. **Instalar ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Usar script:**
   ```bash
   scripts\start-ngrok.bat
   ```

3. **Verificar PATH:**
   - Adicione ngrok ao PATH do Windows
   - Ou coloque `ngrok.exe` na pasta do projeto

Consulte `docs/WEBHOOK_SETUP.md` para instruções detalhadas de instalação.

---

## ❌ Webhook não está sendo chamado

### Sintomas

- Pagamento aprovado no Asaas mas webhook não é recebido
- Logs do backend não mostram "📥 Webhook Asaas recebido"

### Verificar

1. Se a URL está correta no painel do Asaas
2. Se o ngrok está rodando (desenvolvimento local)
3. Se o servidor backend está rodando
4. Interface do ngrok: http://127.0.0.1:4040
5. Logs do Asaas (se disponível)

### Solução

1. Verifique se a URL termina com `/api/asaas/webhook`
2. Verifique se o webhook está ativo no Asaas
3. Verifique se os eventos corretos estão selecionados
4. Teste manualmente usando o endpoint de teste

---

## 🔍 Verificar Status do Backend

Execute no terminal:

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "hasAsaasApiKey": true,
  "asaasIsSandbox": true,
  "hasSupabaseConfig": true,
  "webhookConfigured": true
}
```

---

## 📞 Suporte

Se o problema persistir:

1. Verifique os logs do servidor backend
2. Verifique os logs do console do navegador
3. Consulte a documentação oficial do Asaas: https://asaasv3.docs.apiary.io/
4. Entre em contato com o suporte do Asaas: suporte@asaas.com

---

## ✅ Checklist de Configuração

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] `ASAAS_API_KEY` está configurada no `.env`
- [ ] API Key começa com `$aact_`
- [ ] `ASAAS_IS_SANDBOX` está configurado corretamente
- [ ] `SUPABASE_URL` está configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está configurado
- [ ] Servidor backend está rodando (`npm run backend`)
- [ ] Health check retorna `hasAsaasApiKey: true`
- [ ] Health check retorna `webhookConfigured: true`
- [ ] Logs do servidor mostram "✅ ASAAS_API_KEY configurada"
- [ ] Logs do servidor mostram "✅ Cliente Supabase configurado para webhook"
- [ ] ngrok está rodando (desenvolvimento local)
- [ ] Webhook configurado no Asaas com URL correta

Este guia ajuda a resolver problemas comuns na integração do Asaas e webhook.

## ❌ Erro: ngrok endpoint já está online (ERR_NGROK_334)

### Sintomas

```
ERROR: failed to start tunnel: The endpoint 'https://xxxxx.ngrok-free.dev' is already online.
ERROR: ERR_NGROK_334
```

### Causa

O ngrok já está rodando em outro terminal ou processo.

### Soluções

#### Opção 1: Parar o ngrok existente (Recomendado)

**Windows:**
```bash
# Parar todos os processos ngrok
taskkill /F /IM ngrok.exe

# OU usar o script
npm run ngrok:kill
```

**Linux/Mac:**
```bash
# Encontrar e parar processos ngrok
pkill ngrok

# OU
killall ngrok
```

#### Opção 2: Usar o ngrok existente

Se o ngrok já está rodando, você pode:
1. Acessar a interface web: http://127.0.0.1:4040
2. Copiar a URL HTTPS que já está ativa
3. Usar essa URL no Asaas

#### Opção 3: Usar script melhorado

O script `scripts/start-ngrok.bat` agora detecta se o ngrok está rodando e oferece opções:
- Parar o ngrok existente e iniciar um novo
- Cancelar e usar o ngrok existente

---

## ❌ Erro 401 (Unauthorized)

### Sintomas
- Erro no console: `401 (Unauthorized)` ao criar cliente ou pagamento
- Mensagem: "Erro de autenticação: API Key do Asaas não configurada ou inválida"

### Causas Possíveis

1. **API Key não configurada**
   - O arquivo `.env` não existe ou não contém `ASAAS_API_KEY`
   - A variável está vazia ou comentada

2. **API Key incorreta**
   - A API Key foi copiada incorretamente
   - A API Key está expirada ou foi revogada
   - Está usando a API Key de produção no sandbox (ou vice-versa)

3. **Servidor backend não está rodando**
   - O backend precisa estar rodando na porta 3000
   - Verifique se executou `npm run backend`

### Soluções

#### 1. Verificar se o arquivo .env existe

```bash
# Na raiz do projeto, verifique se existe o arquivo .env
ls .env
# ou no Windows:
dir .env
```

Se não existir, copie o arquivo de exemplo:
```bash
cp backend.env.example .env
# ou no Windows:
copy backend.env.example .env
```

#### 2. Verificar se a API Key está configurada

Abra o arquivo `.env` e verifique se contém:

```env
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true
```

⚠️ **IMPORTANTE**: 
- A API Key deve começar com `$aact_`
- Não adicione aspas ao redor da API Key
- Não deixe espaços antes ou depois do `=`

#### 3. Obter uma nova API Key

**Sandbox:**
1. Acesse https://sandbox.asaas.com
2. Faça login
3. Vá em **Configurações** → **Integrações** → **API**
4. Copie a API Key (começa com `$aact_`)
5. Cole no arquivo `.env`

**Produção:**
1. Acesse https://www.asaas.com
2. Faça login
3. Vá em **Configurações** → **Integrações** → **API**
4. Copie a API Key
5. Cole no arquivo `.env`

#### 4. Verificar se o backend está rodando

```bash
# Verificar se o servidor está respondendo
curl http://localhost:3000/health

# Deve retornar:
# {
#   "status": "ok",
#   "hasAsaasApiKey": true,
#   "asaasIsSandbox": true
# }
```

Se `hasAsaasApiKey` for `false`, a API Key não está sendo lida corretamente.

#### 5. Reiniciar o servidor backend

Após alterar o arquivo `.env`, **sempre reinicie o servidor**:

```bash
# Pare o servidor (Ctrl+C)
# Depois inicie novamente:
npm run backend
```

#### 6. Verificar logs do servidor

Ao iniciar o servidor, você deve ver:

```
✅ ASAAS_API_KEY configurada
✅ Ambiente: SANDBOX
✅ Base URL: https://sandbox.asaas.com/api/v3
```

Se não aparecer, a API Key não está sendo lida.

---

## ❌ Erro ao criar cliente

### Sintomas
- Erro ao criar cliente no Asaas
- Mensagem de erro genérica

### Soluções

1. **Verificar dados obrigatórios**
   - Nome, email e CPF/CNPJ são obrigatórios
   - CPF deve ter 11 dígitos (apenas números)
   - Email deve ser válido

2. **Verificar formato do CPF**
   - Remova pontos, traços e espaços
   - Use apenas números: `12345678900`

3. **Verificar se o cliente já existe**
   - O sistema tenta buscar cliente existente primeiro
   - Se já existir, usa o cliente existente

---

## ❌ Erro ao criar pagamento

### Sintomas
- Erro ao gerar PIX, Boleto ou processar cartão

### Soluções

1. **Verificar se o cliente foi criado**
   - O cliente deve ser criado antes do pagamento
   - Verifique os logs do servidor

2. **Verificar valor**
   - O valor deve ser maior que zero
   - Use formato decimal: `150.00`

3. **Verificar data de vencimento**
   - Data deve estar no formato `YYYY-MM-DD`
   - Data não pode ser no passado

---

## ❌ Erro PGRST116 ao Salvar asaas_payment_id

### Sintomas

**Erro no Console:**
```
❌ Erro ao salvar asaas_payment_id: {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  message: 'Cannot coerce the result to a single JSON object'
}
```

### Causa

- O código tenta atualizar um pedido que não existe no Supabase
- O `.single()` espera exatamente 1 linha, mas retorna 0 linhas
- Isso pode acontecer se:
  1. O pedido não foi criado ainda
  2. O `orderId` está incorreto
  3. Há um problema de timing (tentando atualizar antes do pedido ser criado)

### Solução

O código já foi corrigido para:
- Verificar se o pedido existe antes de atualizar
- Usar `maybeSingle()` em vez de `single()`
- Não quebrar se o pedido não existir

**Se o erro persistir:**

1. Verifique se o pedido foi criado corretamente
2. Verifique os logs do console ao carregar a página de pagamento
3. Verifique se o `orderId` está correto

**Nota Importante:**

Mesmo que o `asaas_payment_id` não seja salvo no frontend, o **webhook ainda funciona** porque:
1. O webhook recebe `externalReference` do Asaas
2. O webhook busca o pedido por `externalReference` (id do pedido)
3. O webhook atualiza o pedido e salva o `asaas_payment_id`

---

## ❌ Webhook não encontra o pedido

### Sintomas

- Webhook recebe `externalReference: "85fdc689-1647-4049-8574-bc8279c00837"` mas o pedido tem `id: "ecd514d0-0125-410e-9c61-6b7b5955718f"`
- Logs mostram: "⚠️ Pedido não encontrado"

### Causa

- IDs diferentes ou múltiplos pedidos criados
- `asaas_payment_id` não foi salvo no pedido

### Solução

O webhook agora tenta **3 estratégias de busca**:

1. **Estratégia 1**: Busca por `asaas_payment_id` (mais preciso)
2. **Estratégia 2**: Busca por `external_reference` (id do pedido)
3. **Estratégia 3**: Busca pedido pendente e atualiza mesmo sem `asaas_payment_id`

**Verificar:**

1. Logs do backend mostram qual estratégia foi usada
2. Se o `externalReference` do webhook corresponde ao `id` do pedido
3. Se há múltiplos pedidos criados

**Solução:**

- Verifique os logs para ver qual estratégia funcionou
- Se nenhuma funcionar, verifique se o `externalReference` está correto
- Use o endpoint de teste: `POST /api/asaas/test-webhook`

---

## ❌ Status não muda para "pago"

### Sintomas

- Pagamento aprovado no Asaas mas status continua "pendente" no Supabase
- Frontend não redireciona para página de sucesso

### Verificar

1. Se o webhook está sendo chamado (logs do backend)
2. Se o Supabase está sendo atualizado (logs do backend)
3. Se há erros no Supabase
4. Se o polling do frontend está ativo

### Solução

1. Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurado
2. Verifique se o webhook está retornando 200 OK
3. Verifique os logs do backend para erros
4. Teste manualmente usando: `POST /api/asaas/test-webhook`
5. Verifique se o frontend está fazendo polling (console do navegador)

---

## ❌ ngrok não inicia

### Sintomas

- Terminal fecha muito rápido ao executar ngrok
- Erro: "ngrok não é reconhecido como comando"

### Soluções

1. **Instalar ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Usar script:**
   ```bash
   scripts\start-ngrok.bat
   ```

3. **Verificar PATH:**
   - Adicione ngrok ao PATH do Windows
   - Ou coloque `ngrok.exe` na pasta do projeto

Consulte `docs/WEBHOOK_SETUP.md` para instruções detalhadas de instalação.

---

## ❌ Webhook não está sendo chamado

### Sintomas

- Pagamento aprovado no Asaas mas webhook não é recebido
- Logs do backend não mostram "📥 Webhook Asaas recebido"

### Verificar

1. Se a URL está correta no painel do Asaas
2. Se o ngrok está rodando (desenvolvimento local)
3. Se o servidor backend está rodando
4. Interface do ngrok: http://127.0.0.1:4040
5. Logs do Asaas (se disponível)

### Solução

1. Verifique se a URL termina com `/api/asaas/webhook`
2. Verifique se o webhook está ativo no Asaas
3. Verifique se os eventos corretos estão selecionados
4. Teste manualmente usando o endpoint de teste

---

## 🔍 Verificar Status do Backend

Execute no terminal:

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "hasAsaasApiKey": true,
  "asaasIsSandbox": true,
  "hasSupabaseConfig": true,
  "webhookConfigured": true
}
```

---

## 📞 Suporte

Se o problema persistir:

1. Verifique os logs do servidor backend
2. Verifique os logs do console do navegador
3. Consulte a documentação oficial do Asaas: https://asaasv3.docs.apiary.io/
4. Entre em contato com o suporte do Asaas: suporte@asaas.com

---

## ✅ Checklist de Configuração

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] `ASAAS_API_KEY` está configurada no `.env`
- [ ] API Key começa com `$aact_`
- [ ] `ASAAS_IS_SANDBOX` está configurado corretamente
- [ ] `SUPABASE_URL` está configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está configurado
- [ ] Servidor backend está rodando (`npm run backend`)
- [ ] Health check retorna `hasAsaasApiKey: true`
- [ ] Health check retorna `webhookConfigured: true`
- [ ] Logs do servidor mostram "✅ ASAAS_API_KEY configurada"
- [ ] Logs do servidor mostram "✅ Cliente Supabase configurado para webhook"
- [ ] ngrok está rodando (desenvolvimento local)
- [ ] Webhook configurado no Asaas com URL correta

Este guia ajuda a resolver problemas comuns na integração do Asaas e webhook.

## ❌ Erro: ngrok endpoint já está online (ERR_NGROK_334)

### Sintomas

```
ERROR: failed to start tunnel: The endpoint 'https://xxxxx.ngrok-free.dev' is already online.
ERROR: ERR_NGROK_334
```

### Causa

O ngrok já está rodando em outro terminal ou processo.

### Soluções

#### Opção 1: Parar o ngrok existente (Recomendado)

**Windows:**
```bash
# Parar todos os processos ngrok
taskkill /F /IM ngrok.exe

# OU usar o script
npm run ngrok:kill
```

**Linux/Mac:**
```bash
# Encontrar e parar processos ngrok
pkill ngrok

# OU
killall ngrok
```

#### Opção 2: Usar o ngrok existente

Se o ngrok já está rodando, você pode:
1. Acessar a interface web: http://127.0.0.1:4040
2. Copiar a URL HTTPS que já está ativa
3. Usar essa URL no Asaas

#### Opção 3: Usar script melhorado

O script `scripts/start-ngrok.bat` agora detecta se o ngrok está rodando e oferece opções:
- Parar o ngrok existente e iniciar um novo
- Cancelar e usar o ngrok existente

---

## ❌ Erro 401 (Unauthorized)

### Sintomas
- Erro no console: `401 (Unauthorized)` ao criar cliente ou pagamento
- Mensagem: "Erro de autenticação: API Key do Asaas não configurada ou inválida"

### Causas Possíveis

1. **API Key não configurada**
   - O arquivo `.env` não existe ou não contém `ASAAS_API_KEY`
   - A variável está vazia ou comentada

2. **API Key incorreta**
   - A API Key foi copiada incorretamente
   - A API Key está expirada ou foi revogada
   - Está usando a API Key de produção no sandbox (ou vice-versa)

3. **Servidor backend não está rodando**
   - O backend precisa estar rodando na porta 3000
   - Verifique se executou `npm run backend`

### Soluções

#### 1. Verificar se o arquivo .env existe

```bash
# Na raiz do projeto, verifique se existe o arquivo .env
ls .env
# ou no Windows:
dir .env
```

Se não existir, copie o arquivo de exemplo:
```bash
cp backend.env.example .env
# ou no Windows:
copy backend.env.example .env
```

#### 2. Verificar se a API Key está configurada

Abra o arquivo `.env` e verifique se contém:

```env
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true
```

⚠️ **IMPORTANTE**: 
- A API Key deve começar com `$aact_`
- Não adicione aspas ao redor da API Key
- Não deixe espaços antes ou depois do `=`

#### 3. Obter uma nova API Key

**Sandbox:**
1. Acesse https://sandbox.asaas.com
2. Faça login
3. Vá em **Configurações** → **Integrações** → **API**
4. Copie a API Key (começa com `$aact_`)
5. Cole no arquivo `.env`

**Produção:**
1. Acesse https://www.asaas.com
2. Faça login
3. Vá em **Configurações** → **Integrações** → **API**
4. Copie a API Key
5. Cole no arquivo `.env`

#### 4. Verificar se o backend está rodando

```bash
# Verificar se o servidor está respondendo
curl http://localhost:3000/health

# Deve retornar:
# {
#   "status": "ok",
#   "hasAsaasApiKey": true,
#   "asaasIsSandbox": true
# }
```

Se `hasAsaasApiKey` for `false`, a API Key não está sendo lida corretamente.

#### 5. Reiniciar o servidor backend

Após alterar o arquivo `.env`, **sempre reinicie o servidor**:

```bash
# Pare o servidor (Ctrl+C)
# Depois inicie novamente:
npm run backend
```

#### 6. Verificar logs do servidor

Ao iniciar o servidor, você deve ver:

```
✅ ASAAS_API_KEY configurada
✅ Ambiente: SANDBOX
✅ Base URL: https://sandbox.asaas.com/api/v3
```

Se não aparecer, a API Key não está sendo lida.

---

## ❌ Erro ao criar cliente

### Sintomas
- Erro ao criar cliente no Asaas
- Mensagem de erro genérica

### Soluções

1. **Verificar dados obrigatórios**
   - Nome, email e CPF/CNPJ são obrigatórios
   - CPF deve ter 11 dígitos (apenas números)
   - Email deve ser válido

2. **Verificar formato do CPF**
   - Remova pontos, traços e espaços
   - Use apenas números: `12345678900`

3. **Verificar se o cliente já existe**
   - O sistema tenta buscar cliente existente primeiro
   - Se já existir, usa o cliente existente

---

## ❌ Erro ao criar pagamento

### Sintomas
- Erro ao gerar PIX, Boleto ou processar cartão

### Soluções

1. **Verificar se o cliente foi criado**
   - O cliente deve ser criado antes do pagamento
   - Verifique os logs do servidor

2. **Verificar valor**
   - O valor deve ser maior que zero
   - Use formato decimal: `150.00`

3. **Verificar data de vencimento**
   - Data deve estar no formato `YYYY-MM-DD`
   - Data não pode ser no passado

---

## ❌ Erro PGRST116 ao Salvar asaas_payment_id

### Sintomas

**Erro no Console:**
```
❌ Erro ao salvar asaas_payment_id: {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  message: 'Cannot coerce the result to a single JSON object'
}
```

### Causa

- O código tenta atualizar um pedido que não existe no Supabase
- O `.single()` espera exatamente 1 linha, mas retorna 0 linhas
- Isso pode acontecer se:
  1. O pedido não foi criado ainda
  2. O `orderId` está incorreto
  3. Há um problema de timing (tentando atualizar antes do pedido ser criado)

### Solução

O código já foi corrigido para:
- Verificar se o pedido existe antes de atualizar
- Usar `maybeSingle()` em vez de `single()`
- Não quebrar se o pedido não existir

**Se o erro persistir:**

1. Verifique se o pedido foi criado corretamente
2. Verifique os logs do console ao carregar a página de pagamento
3. Verifique se o `orderId` está correto

**Nota Importante:**

Mesmo que o `asaas_payment_id` não seja salvo no frontend, o **webhook ainda funciona** porque:
1. O webhook recebe `externalReference` do Asaas
2. O webhook busca o pedido por `externalReference` (id do pedido)
3. O webhook atualiza o pedido e salva o `asaas_payment_id`

---

## ❌ Webhook não encontra o pedido

### Sintomas

- Webhook recebe `externalReference: "85fdc689-1647-4049-8574-bc8279c00837"` mas o pedido tem `id: "ecd514d0-0125-410e-9c61-6b7b5955718f"`
- Logs mostram: "⚠️ Pedido não encontrado"

### Causa

- IDs diferentes ou múltiplos pedidos criados
- `asaas_payment_id` não foi salvo no pedido

### Solução

O webhook agora tenta **3 estratégias de busca**:

1. **Estratégia 1**: Busca por `asaas_payment_id` (mais preciso)
2. **Estratégia 2**: Busca por `external_reference` (id do pedido)
3. **Estratégia 3**: Busca pedido pendente e atualiza mesmo sem `asaas_payment_id`

**Verificar:**

1. Logs do backend mostram qual estratégia foi usada
2. Se o `externalReference` do webhook corresponde ao `id` do pedido
3. Se há múltiplos pedidos criados

**Solução:**

- Verifique os logs para ver qual estratégia funcionou
- Se nenhuma funcionar, verifique se o `externalReference` está correto
- Use o endpoint de teste: `POST /api/asaas/test-webhook`

---

## ❌ Status não muda para "pago"

### Sintomas

- Pagamento aprovado no Asaas mas status continua "pendente" no Supabase
- Frontend não redireciona para página de sucesso

### Verificar

1. Se o webhook está sendo chamado (logs do backend)
2. Se o Supabase está sendo atualizado (logs do backend)
3. Se há erros no Supabase
4. Se o polling do frontend está ativo

### Solução

1. Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurado
2. Verifique se o webhook está retornando 200 OK
3. Verifique os logs do backend para erros
4. Teste manualmente usando: `POST /api/asaas/test-webhook`
5. Verifique se o frontend está fazendo polling (console do navegador)

---

## ❌ ngrok não inicia

### Sintomas

- Terminal fecha muito rápido ao executar ngrok
- Erro: "ngrok não é reconhecido como comando"

### Soluções

1. **Instalar ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Usar script:**
   ```bash
   scripts\start-ngrok.bat
   ```

3. **Verificar PATH:**
   - Adicione ngrok ao PATH do Windows
   - Ou coloque `ngrok.exe` na pasta do projeto

Consulte `docs/WEBHOOK_SETUP.md` para instruções detalhadas de instalação.

---

## ❌ Webhook não está sendo chamado

### Sintomas

- Pagamento aprovado no Asaas mas webhook não é recebido
- Logs do backend não mostram "📥 Webhook Asaas recebido"

### Verificar

1. Se a URL está correta no painel do Asaas
2. Se o ngrok está rodando (desenvolvimento local)
3. Se o servidor backend está rodando
4. Interface do ngrok: http://127.0.0.1:4040
5. Logs do Asaas (se disponível)

### Solução

1. Verifique se a URL termina com `/api/asaas/webhook`
2. Verifique se o webhook está ativo no Asaas
3. Verifique se os eventos corretos estão selecionados
4. Teste manualmente usando o endpoint de teste

---

## 🔍 Verificar Status do Backend

Execute no terminal:

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "hasAsaasApiKey": true,
  "asaasIsSandbox": true,
  "hasSupabaseConfig": true,
  "webhookConfigured": true
}
```

---

## 📞 Suporte

Se o problema persistir:

1. Verifique os logs do servidor backend
2. Verifique os logs do console do navegador
3. Consulte a documentação oficial do Asaas: https://asaasv3.docs.apiary.io/
4. Entre em contato com o suporte do Asaas: suporte@asaas.com

---

## ✅ Checklist de Configuração

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] `ASAAS_API_KEY` está configurada no `.env`
- [ ] API Key começa com `$aact_`
- [ ] `ASAAS_IS_SANDBOX` está configurado corretamente
- [ ] `SUPABASE_URL` está configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está configurado
- [ ] Servidor backend está rodando (`npm run backend`)
- [ ] Health check retorna `hasAsaasApiKey: true`
- [ ] Health check retorna `webhookConfigured: true`
- [ ] Logs do servidor mostram "✅ ASAAS_API_KEY configurada"
- [ ] Logs do servidor mostram "✅ Cliente Supabase configurado para webhook"
- [ ] ngrok está rodando (desenvolvimento local)
- [ ] Webhook configurado no Asaas com URL correta

Este guia ajuda a resolver problemas comuns na integração do Asaas e webhook.

## ❌ Erro: ngrok endpoint já está online (ERR_NGROK_334)

### Sintomas

```
ERROR: failed to start tunnel: The endpoint 'https://xxxxx.ngrok-free.dev' is already online.
ERROR: ERR_NGROK_334
```

### Causa

O ngrok já está rodando em outro terminal ou processo.

### Soluções

#### Opção 1: Parar o ngrok existente (Recomendado)

**Windows:**
```bash
# Parar todos os processos ngrok
taskkill /F /IM ngrok.exe

# OU usar o script
npm run ngrok:kill
```

**Linux/Mac:**
```bash
# Encontrar e parar processos ngrok
pkill ngrok

# OU
killall ngrok
```

#### Opção 2: Usar o ngrok existente

Se o ngrok já está rodando, você pode:
1. Acessar a interface web: http://127.0.0.1:4040
2. Copiar a URL HTTPS que já está ativa
3. Usar essa URL no Asaas

#### Opção 3: Usar script melhorado

O script `scripts/start-ngrok.bat` agora detecta se o ngrok está rodando e oferece opções:
- Parar o ngrok existente e iniciar um novo
- Cancelar e usar o ngrok existente

---

## ❌ Erro 401 (Unauthorized)

### Sintomas
- Erro no console: `401 (Unauthorized)` ao criar cliente ou pagamento
- Mensagem: "Erro de autenticação: API Key do Asaas não configurada ou inválida"

### Causas Possíveis

1. **API Key não configurada**
   - O arquivo `.env` não existe ou não contém `ASAAS_API_KEY`
   - A variável está vazia ou comentada

2. **API Key incorreta**
   - A API Key foi copiada incorretamente
   - A API Key está expirada ou foi revogada
   - Está usando a API Key de produção no sandbox (ou vice-versa)

3. **Servidor backend não está rodando**
   - O backend precisa estar rodando na porta 3000
   - Verifique se executou `npm run backend`

### Soluções

#### 1. Verificar se o arquivo .env existe

```bash
# Na raiz do projeto, verifique se existe o arquivo .env
ls .env
# ou no Windows:
dir .env
```

Se não existir, copie o arquivo de exemplo:
```bash
cp backend.env.example .env
# ou no Windows:
copy backend.env.example .env
```

#### 2. Verificar se a API Key está configurada

Abra o arquivo `.env` e verifique se contém:

```env
ASAAS_API_KEY=$aact_YOUR_API_KEY_HERE
ASAAS_IS_SANDBOX=true
```

⚠️ **IMPORTANTE**: 
- A API Key deve começar com `$aact_`
- Não adicione aspas ao redor da API Key
- Não deixe espaços antes ou depois do `=`

#### 3. Obter uma nova API Key

**Sandbox:**
1. Acesse https://sandbox.asaas.com
2. Faça login
3. Vá em **Configurações** → **Integrações** → **API**
4. Copie a API Key (começa com `$aact_`)
5. Cole no arquivo `.env`

**Produção:**
1. Acesse https://www.asaas.com
2. Faça login
3. Vá em **Configurações** → **Integrações** → **API**
4. Copie a API Key
5. Cole no arquivo `.env`

#### 4. Verificar se o backend está rodando

```bash
# Verificar se o servidor está respondendo
curl http://localhost:3000/health

# Deve retornar:
# {
#   "status": "ok",
#   "hasAsaasApiKey": true,
#   "asaasIsSandbox": true
# }
```

Se `hasAsaasApiKey` for `false`, a API Key não está sendo lida corretamente.

#### 5. Reiniciar o servidor backend

Após alterar o arquivo `.env`, **sempre reinicie o servidor**:

```bash
# Pare o servidor (Ctrl+C)
# Depois inicie novamente:
npm run backend
```

#### 6. Verificar logs do servidor

Ao iniciar o servidor, você deve ver:

```
✅ ASAAS_API_KEY configurada
✅ Ambiente: SANDBOX
✅ Base URL: https://sandbox.asaas.com/api/v3
```

Se não aparecer, a API Key não está sendo lida.

---

## ❌ Erro ao criar cliente

### Sintomas
- Erro ao criar cliente no Asaas
- Mensagem de erro genérica

### Soluções

1. **Verificar dados obrigatórios**
   - Nome, email e CPF/CNPJ são obrigatórios
   - CPF deve ter 11 dígitos (apenas números)
   - Email deve ser válido

2. **Verificar formato do CPF**
   - Remova pontos, traços e espaços
   - Use apenas números: `12345678900`

3. **Verificar se o cliente já existe**
   - O sistema tenta buscar cliente existente primeiro
   - Se já existir, usa o cliente existente

---

## ❌ Erro ao criar pagamento

### Sintomas
- Erro ao gerar PIX, Boleto ou processar cartão

### Soluções

1. **Verificar se o cliente foi criado**
   - O cliente deve ser criado antes do pagamento
   - Verifique os logs do servidor

2. **Verificar valor**
   - O valor deve ser maior que zero
   - Use formato decimal: `150.00`

3. **Verificar data de vencimento**
   - Data deve estar no formato `YYYY-MM-DD`
   - Data não pode ser no passado

---

## ❌ Erro PGRST116 ao Salvar asaas_payment_id

### Sintomas

**Erro no Console:**
```
❌ Erro ao salvar asaas_payment_id: {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  message: 'Cannot coerce the result to a single JSON object'
}
```

### Causa

- O código tenta atualizar um pedido que não existe no Supabase
- O `.single()` espera exatamente 1 linha, mas retorna 0 linhas
- Isso pode acontecer se:
  1. O pedido não foi criado ainda
  2. O `orderId` está incorreto
  3. Há um problema de timing (tentando atualizar antes do pedido ser criado)

### Solução

O código já foi corrigido para:
- Verificar se o pedido existe antes de atualizar
- Usar `maybeSingle()` em vez de `single()`
- Não quebrar se o pedido não existir

**Se o erro persistir:**

1. Verifique se o pedido foi criado corretamente
2. Verifique os logs do console ao carregar a página de pagamento
3. Verifique se o `orderId` está correto

**Nota Importante:**

Mesmo que o `asaas_payment_id` não seja salvo no frontend, o **webhook ainda funciona** porque:
1. O webhook recebe `externalReference` do Asaas
2. O webhook busca o pedido por `externalReference` (id do pedido)
3. O webhook atualiza o pedido e salva o `asaas_payment_id`

---

## ❌ Webhook não encontra o pedido

### Sintomas

- Webhook recebe `externalReference: "85fdc689-1647-4049-8574-bc8279c00837"` mas o pedido tem `id: "ecd514d0-0125-410e-9c61-6b7b5955718f"`
- Logs mostram: "⚠️ Pedido não encontrado"

### Causa

- IDs diferentes ou múltiplos pedidos criados
- `asaas_payment_id` não foi salvo no pedido

### Solução

O webhook agora tenta **3 estratégias de busca**:

1. **Estratégia 1**: Busca por `asaas_payment_id` (mais preciso)
2. **Estratégia 2**: Busca por `external_reference` (id do pedido)
3. **Estratégia 3**: Busca pedido pendente e atualiza mesmo sem `asaas_payment_id`

**Verificar:**

1. Logs do backend mostram qual estratégia foi usada
2. Se o `externalReference` do webhook corresponde ao `id` do pedido
3. Se há múltiplos pedidos criados

**Solução:**

- Verifique os logs para ver qual estratégia funcionou
- Se nenhuma funcionar, verifique se o `externalReference` está correto
- Use o endpoint de teste: `POST /api/asaas/test-webhook`

---

## ❌ Status não muda para "pago"

### Sintomas

- Pagamento aprovado no Asaas mas status continua "pendente" no Supabase
- Frontend não redireciona para página de sucesso

### Verificar

1. Se o webhook está sendo chamado (logs do backend)
2. Se o Supabase está sendo atualizado (logs do backend)
3. Se há erros no Supabase
4. Se o polling do frontend está ativo

### Solução

1. Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurado
2. Verifique se o webhook está retornando 200 OK
3. Verifique os logs do backend para erros
4. Teste manualmente usando: `POST /api/asaas/test-webhook`
5. Verifique se o frontend está fazendo polling (console do navegador)

---

## ❌ ngrok não inicia

### Sintomas

- Terminal fecha muito rápido ao executar ngrok
- Erro: "ngrok não é reconhecido como comando"

### Soluções

1. **Instalar ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Usar script:**
   ```bash
   scripts\start-ngrok.bat
   ```

3. **Verificar PATH:**
   - Adicione ngrok ao PATH do Windows
   - Ou coloque `ngrok.exe` na pasta do projeto

Consulte `docs/WEBHOOK_SETUP.md` para instruções detalhadas de instalação.

---

## ❌ Webhook não está sendo chamado

### Sintomas

- Pagamento aprovado no Asaas mas webhook não é recebido
- Logs do backend não mostram "📥 Webhook Asaas recebido"

### Verificar

1. Se a URL está correta no painel do Asaas
2. Se o ngrok está rodando (desenvolvimento local)
3. Se o servidor backend está rodando
4. Interface do ngrok: http://127.0.0.1:4040
5. Logs do Asaas (se disponível)

### Solução

1. Verifique se a URL termina com `/api/asaas/webhook`
2. Verifique se o webhook está ativo no Asaas
3. Verifique se os eventos corretos estão selecionados
4. Teste manualmente usando o endpoint de teste

---

## 🔍 Verificar Status do Backend

Execute no terminal:

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "hasAsaasApiKey": true,
  "asaasIsSandbox": true,
  "hasSupabaseConfig": true,
  "webhookConfigured": true
}
```

---

## 📞 Suporte

Se o problema persistir:

1. Verifique os logs do servidor backend
2. Verifique os logs do console do navegador
3. Consulte a documentação oficial do Asaas: https://asaasv3.docs.apiary.io/
4. Entre em contato com o suporte do Asaas: suporte@asaas.com

---

## ✅ Checklist de Configuração

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] `ASAAS_API_KEY` está configurada no `.env`
- [ ] API Key começa com `$aact_`
- [ ] `ASAAS_IS_SANDBOX` está configurado corretamente
- [ ] `SUPABASE_URL` está configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está configurado
- [ ] Servidor backend está rodando (`npm run backend`)
- [ ] Health check retorna `hasAsaasApiKey: true`
- [ ] Health check retorna `webhookConfigured: true`
- [ ] Logs do servidor mostram "✅ ASAAS_API_KEY configurada"
- [ ] Logs do servidor mostram "✅ Cliente Supabase configurado para webhook"
- [ ] ngrok está rodando (desenvolvimento local)
- [ ] Webhook configurado no Asaas com URL correta
