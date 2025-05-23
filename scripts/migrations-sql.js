// Script para gerar um arquivo SQL combinado para executar no SQL Editor do Supabase
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtém o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ordem das migrações
const migrations = [
  // Primeiro, vamos criar apenas a função has_role para evitar erros
  '../src/migrations/create_has_role_function.sql',
  
  // Tabelas de usuários e permissões
  '../src/migrations/create_user_roles_table.sql',
  '../src/migrations/create_role_permissions_table.sql',
  '../src/migrations/create_profiles_table.sql',
  
  // Tabelas de cursos e matrículas
  '../src/migrations/create_courses_table.sql',
  '../src/migrations/create_classes_table.sql',
  '../src/migrations/create_discount_coupons_table.sql',
  '../src/migrations/create_manual_enrollments_table.sql',
  
  // Tabelas financeiras
  '../src/migrations/create_financial_categories_table.sql',
  '../src/migrations/create_receivables_table.sql',
  '../src/migrations/create_payables_table.sql',
  '../src/migrations/create_transactions_table.sql',
  '../src/migrations/create_finance_functions.sql',
  
  // Tabelas de blog
  '../src/migrations/create_blog_posts_table.sql',
  '../src/migrations/create_newsletter_subscribers_table.sql',
  
  // Tabelas de quiz
  '../src/migrations/create_photography_questions_table.sql',
  '../src/migrations/create_photography_answers_table.sql',
  '../src/migrations/create_quiz_scores_table.sql',
  
  // Outras tabelas e funções
  '../src/migrations/create_ai_settings_table.sql',
  '../src/migrations/create_ai_settings_functions.sql',
  '../src/migrations/create_profiles_functions.sql'
];

// Função para combinar os arquivos SQL
function combineSqlFiles() {
  console.log('Combinando arquivos de migração...');
  
  let combinedSql = '';
  
  for (const migrationFile of migrations) {
    try {
      const filePath = path.resolve(__dirname, migrationFile);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      combinedSql += `-- Início da migração: ${migrationFile}\n`;
      combinedSql += sql;
      combinedSql += `\n\n-- Fim da migração: ${migrationFile}\n\n`;
      
      console.log(`Arquivo ${migrationFile} adicionado com sucesso!`);
    } catch (error) {
      console.error(`Erro ao ler migração ${migrationFile}:`, error);
    }
  }
  
  // Salva o SQL combinado em um arquivo
  const outputPath = path.resolve(__dirname, 'combined-migrations.sql');
  fs.writeFileSync(outputPath, combinedSql, 'utf8');
  
  console.log(`Arquivo SQL combinado criado em: ${outputPath}`);
  console.log('Copie o conteúdo deste arquivo e cole no SQL Editor do Supabase para executar todas as migrações de uma vez.');
}

// Executa a combinação
combineSqlFiles();
