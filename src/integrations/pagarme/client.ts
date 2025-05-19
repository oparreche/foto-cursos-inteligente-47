
// Cliente para integração com a API do Pagarme
import { supabase } from "@/integrations/supabase/client";

// Configurações do Pagarme
const API_KEY = "sua_api_key_pagarme"; // Em produção, usar variáveis de ambiente

export type PagarmeTransaction = {
  id: string;
  status: 'processing' | 'authorized' | 'paid' | 'refunded' | 'waiting_payment' | 'refused' | 'chargedback' | 'analyzing' | 'pending_review';
  amount: number;
  paymentMethod: 'credit_card' | 'boleto' | 'pix';
  cardBrand?: string;
  installments?: number;
  customer: {
    id: string;
    name: string;
    email: string;
    documentNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

// Salvar transação no Supabase após processar com Pagarme
export const saveTransactionToSupabase = async (
  userId: string,
  transaction: PagarmeTransaction
) => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        pagarme_transaction_id: transaction.id,
        status: transaction.status,
        amount: transaction.amount / 100, // Pagarme usa centavos
        method: transaction.paymentMethod,
        customer_name: transaction.customer.name,
        customer_email: transaction.customer.email,
        created_at: transaction.createdAt,
        card_brand: transaction.cardBrand,
        installments: transaction.installments
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar transação:', error);
    throw error;
  }
};

// Processar pagamento com cartão de crédito
export const processCardPayment = async (
  cardData: any,
  customer: any,
  amount: number,
  items: any[]
): Promise<PagarmeTransaction> => {
  // Simulação da integração com o Pagarme
  console.log('Processando pagamento com Pagarme...', { cardData, customer, amount, items });
  
  // Em uma implementação real, isso seria substituído pela chamada à API do Pagarme
  const mockTransaction: PagarmeTransaction = {
    id: `trx_${Math.floor(Math.random() * 1000000)}`,
    status: 'paid',
    amount: amount * 100, // Pagarme trabalha com centavos
    paymentMethod: 'credit_card',
    cardBrand: cardData.brand,
    installments: cardData.installments || 1,
    customer: {
      id: `cus_${Math.floor(Math.random() * 1000000)}`,
      name: customer.name,
      email: customer.email,
      documentNumber: customer.document
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return mockTransaction;
};

// Gerar link de pagamento Pix ou boleto
export const generatePaymentLink = async (
  customer: any,
  amount: number,
  paymentMethod: 'boleto' | 'pix',
  items: any[]
): Promise<{transactionId: string, paymentUrl: string}> => {
  // Simulação da integração com o Pagarme para links de pagamento
  console.log('Gerando link de pagamento com Pagarme...', { customer, amount, paymentMethod, items });
  
  // Em uma implementação real, seria feita uma chamada à API do Pagarme
  return {
    transactionId: `trx_${Math.floor(Math.random() * 1000000)}`,
    paymentUrl: `https://exemplo-pagarme.com/pagamento/${paymentMethod}/${Math.floor(Math.random() * 1000000)}`
  };
};

// Verificar status de uma transação
export const checkTransactionStatus = async (transactionId: string): Promise<PagarmeTransaction["status"]> => {
  // Em uma implementação real, seria feita uma chamada à API do Pagarme
  console.log('Verificando status da transação:', transactionId);
  
  // Retornando um status simulado
  const statuses: PagarmeTransaction["status"][] = [
    'processing', 'authorized', 'paid', 'waiting_payment', 'refused'
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};
