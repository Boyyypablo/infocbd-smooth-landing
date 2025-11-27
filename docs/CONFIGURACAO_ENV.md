# 🔧 Configuração de Variáveis de Ambiente

## Problema: "supabaseUrl is required"

Este erro ocorre quando as variáveis de ambiente do Supabase não estão configuradas.

## Solução

### 1. Criar arquivo `.env` na raiz do projeto

Crie um arquivo chamado `.env` na raiz do projeto (mesmo nível do `package.json`) com o seguinte conteúdo:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui

# Backend URL (opcional)
VITE_BACKEND_URL=http://localhost:3000
```

### 2. Obter as credenciais do Supabase

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 3. Reiniciar o servidor de desenvolvimento

Após criar/editar o arquivo `.env`, você **DEVE** reiniciar o servidor:

```bash
# Parar o servidor (Ctrl+C)
# Depois iniciar novamente
npm run dev
```

⚠️ **IMPORTANTE**: O Vite só carrega variáveis de ambiente na inicialização. Mudanças no `.env` requerem reiniciar o servidor.

### 4. Verificar se está funcionando

Abra o console do navegador (F12) e verifique se não há mais o erro "supabaseUrl is required".

## Estrutura do arquivo `.env`

```
infocbd-smooth-landing/
├── .env                    ← Crie este arquivo aqui
├── .env.example            ← Exemplo (opcional)
├── package.json
├── src/
└── ...
```

## Variáveis Disponíveis

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | ✅ Sim |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anônima do Supabase | ✅ Sim |
| `VITE_BACKEND_URL` | URL do backend (padrão: http://localhost:3000) | ❌ Não |

## Notas de Segurança

- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- O arquivo `.env` já deve estar no `.gitignore`
- Use `.env.example` para documentar as variáveis necessárias
- A `VITE_SUPABASE_ANON_KEY` é segura para uso no frontend (é pública)





