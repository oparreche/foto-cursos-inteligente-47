
import { toast } from "sonner";

export interface NFSeData {
  numeroLote: string;
  cnpj: string;
  inscricaoMunicipal: string;
  valor: number;
  tomador: {
    nome: string;
    cpf?: string;
    cnpj?: string;
    endereco?: {
      logradouro: string;
      numero: string;
      bairro: string;
      cidade: string;
      uf: string;
      cep: string;
    }
  };
  servico: {
    descricao: string;
    codigoTributacaoMunicipio: string;
    aliquota: number;
  };
}

export const generateInvoiceNumber = (): string => {
  const prefix = "NFS-";
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${year}-${randomDigits}`;
};

export const validateNFSeData = (data: Partial<NFSeData>): boolean => {
  // Verificações básicas dos campos obrigatórios
  if (!data.cnpj || !data.inscricaoMunicipal || !data.valor || !data.tomador?.nome) {
    toast.error("Dados insuficientes para geração da NFS-e");
    return false;
  }
  
  // Validação do documento do tomador (CPF ou CNPJ)
  if (!data.tomador.cpf && !data.tomador.cnpj) {
    toast.error("O tomador deve possuir CPF ou CNPJ");
    return false;
  }

  // Validação do serviço
  if (!data.servico?.descricao || !data.servico?.codigoTributacaoMunicipio) {
    toast.error("Informações do serviço incompletas");
    return false;
  }
  
  return true;
};

export const prepareNFSeRequest = (data: NFSeData): Record<string, any> => {
  // Esta função simula a preparação dos dados para envio ao microserviço
  // Em um ambiente real, isso seria enviado para a API do microserviço Node.js
  
  return {
    numeroLote: data.numeroLote || generateInvoiceNumber().replace('NFS-', ''),
    cnpj: data.cnpj,
    im: data.inscricaoMunicipal,
    valor: data.valor,
    tomador: {
      nome: data.tomador.nome,
      cpf: data.tomador.cpf,
      cnpj: data.tomador.cnpj,
      endereco: data.tomador.endereco,
    },
    servico: {
      descricao: data.servico.descricao,
      codigo: data.servico.codigoTributacaoMunicipio,
      aliquota: data.servico.aliquota,
    }
  };
};

export const mockSendToNFSeService = async (data: Record<string, any>): Promise<{success: boolean, message: string}> => {
  // Esta função simula o envio para o microserviço de NFS-e
  // Em produção, você substituiria isso por uma chamada real à API
  
  console.log("Enviando dados para o serviço de NFS-e:", data);
  
  // Simula um delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simula uma resposta de sucesso (em produção, isso viria do microserviço)
  return {
    success: true,
    message: `NFS-e gerada com sucesso. Protocolo: ${Math.floor(1000000 + Math.random() * 9000000)}`
  };
};

export const generateNFSe = async (data: NFSeData): Promise<{success: boolean, message: string}> => {
  if (!validateNFSeData(data)) {
    return { success: false, message: "Validação de dados falhou" };
  }
  
  try {
    const requestData = prepareNFSeRequest(data);
    const result = await mockSendToNFSeService(requestData);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    toast.error(`Erro ao gerar NFS-e: ${errorMessage}`);
    return { success: false, message: `Erro ao gerar NFS-e: ${errorMessage}` };
  }
};
