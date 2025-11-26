import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente - você precisará configurar no .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Criar cliente Supabase com tratamento de erro
let supabaseClient;

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== '') {
    // Validar formato básico da URL
    if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
      throw new Error('VITE_SUPABASE_URL deve ser uma URL válida (começar com http:// ou https://)');
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('[OK] Cliente Supabase inicializado com sucesso');
  } else {
    // Cliente mock para evitar erros quando não configurado
    console.warn('[AVISO] Supabase nao configurado.');
    console.warn('[AVISO] Configure as seguintes variaveis no arquivo .env na raiz do projeto:');
    console.warn('[AVISO]   VITE_SUPABASE_URL=https://seu-projeto.supabase.co');
    console.warn('[AVISO]   VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui');
    console.warn('[AVISO] IMPORTANTE: Reinicie o servidor de desenvolvimento (npm run dev) apos configurar.');
    console.warn('[AVISO] Usando cliente mock. Funcionalidades do Supabase nao funcionarao.');
    // Criar cliente com valores válidos mas que não funcionarão
    supabaseClient = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder');
  }
} catch (error) {
  console.error('[ERRO] Erro ao criar cliente Supabase:', error);
  console.error('[ERRO] Verifique se as variaveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estao corretas no arquivo .env');
  // Fallback para cliente mock
  supabaseClient = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder');
}

export const supabase = supabaseClient;

// Tipos para os dados
export interface OrderData {
  id?: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  medicamento: {
    nome: string;
    imagem?: string;
    preco: number;
  };
  status: 'pendente' | 'pago' | 'cancelado' | 'falhou';
  created_at?: string;
  payment_id?: string;
  payment_id?: string;
  external_reference?: string;
  payment_method?: string;
}




