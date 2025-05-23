// Script para executar migrações no Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração do Supabase
const SUPABASE_URL = "https://vzhowavbrzwwkpjmguxm.supabase.co";
// Atenção: Para executar migrações, é necessário usar a chave service_role
// Esta chave tem permissões administrativas, então mantenha-a segura
const SUPABASE_SERVICE_KEY = "SUA_CHAVE_SERVICE_ROLE_AQUI";

// Cria o cliente Supabase com permissões administrativas
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Obtém o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ordem das migrações
const migrations = [
  '../src/migrations/create_financial_categories_table.sql',
  '../src/migrations/create_receivables_table.sql',
  '../src/migrations/create_payables_table.sql',
  '../src/migrations/create_transactions_table.sql',
  '../src/migrations/create_finance_functions.sql'
];

// Função para executar as migrações
async function runMigrations() {
  console.log('Iniciando execução das migrações...');
  
  for (const migrationFile of migrations) {
    try {
      const filePath = path.resolve(__dirname, migrationFile);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`Executando migração: ${migrationFile}`);
      const { error } = await supabase.rpc('pgexec', { sql });
      
      if (error) {
        console.error(`Erro ao executar migração ${migrationFile}:`, error);
      } else {
        console.log(`Migração ${migrationFile} executada com sucesso!`);
      }
    } catch (error) {
      console.error(`Erro ao ler ou executar migração ${migrationFile}:`, error);
    }
  }
  
  console.log('Processo de migração concluído!');
}

// Executa as migrações
runMigrations();
