// Script para verificar e criar tabela orders no Supabase
// Uso: node scripts/setup-supabase.cjs

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[ERRO] Variáveis de ambiente não configuradas!');
  console.error('Configure no arquivo .env:');
  console.error('  SUPABASE_URL=https://seu-projeto.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupDatabase() {
  console.log('[INFO] Conectando ao Supabase...');
  
  try {
    // Verificar se a tabela existe
    const { data: tables, error: checkError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === 'PGRST116') {
      // Tabela não existe
      console.log('[INFO] Tabela "orders" não existe. Criando...');
      
      // Ler o schema SQL
      const schemaPath = path.join(__dirname, '..', 'database', 'supabase_schema.sql');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
      
      console.log('[INFO] Execute o seguinte SQL no Supabase Dashboard:');
      console.log('[INFO] Acesse: https://app.supabase.com → Seu Projeto → SQL Editor');
      console.log('\n' + '='.repeat(60));
      console.log(schemaSQL);
      console.log('='.repeat(60));
      console.log('\n[INFO] Ou execute manualmente o arquivo: database/supabase_schema.sql');
      
    } else if (checkError) {
      console.error('[ERRO] Erro ao verificar tabela:', checkError);
      process.exit(1);
    } else {
      console.log('[OK] Tabela "orders" já existe!');
      
      // Verificar estrutura
      const { data: testOrder, error: testError } = await supabase
        .from('orders')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.warn('[AVISO] Erro ao verificar estrutura:', testError.message);
      } else {
        console.log('[OK] Estrutura da tabela verificada com sucesso!');
      }
    }
    
  } catch (error) {
    console.error('[ERRO] Erro ao configurar banco de dados:', error);
    process.exit(1);
  }
}

setupDatabase();

