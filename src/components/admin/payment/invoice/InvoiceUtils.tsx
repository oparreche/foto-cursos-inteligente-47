
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
  status?: 'pending' | 'completed' | 'failed' | 'processing' | 'canceled';
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

// Função para gerar o XML no formato ABRASF 2.0 para Recife
export const generateAbrasfXml = (data: NFSeData): string => {
  // Esta é uma simulação da geração de XML
  // Em um ambiente de produção, isso seria feito por uma biblioteca de geração de XML
  
  // Formata valor para o padrão brasileiro (vírgula como separador decimal)
  const valorFormatado = data.valor.toFixed(2).replace('.', ',');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<EnviarLoteRpsEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">
  <LoteRps>
    <NumeroLote>${data.numeroLote}</NumeroLote>
    <CpfCnpj><Cnpj>${data.cnpj}</Cnpj></CpfCnpj>
    <InscricaoMunicipal>${data.inscricaoMunicipal}</InscricaoMunicipal>
    <QuantidadeRps>1</QuantidadeRps>
    <ListaRps>
      <Rps>
        <InfDeclaracaoPrestacaoServico Id="RPS${data.numeroLote}">
          <Servico>
            <Valores>
              <ValorServicos>${valorFormatado}</ValorServicos>
              <Aliquota>${data.servico.aliquota.toFixed(4).replace('.', ',')}</Aliquota>
            </Valores>
            <ItemListaServico>${data.servico.codigoTributacaoMunicipio}</ItemListaServico>
            <Discriminacao>${data.servico.descricao}</Discriminacao>
          </Servico>
          <Prestador>
            <CpfCnpj><Cnpj>${data.cnpj}</Cnpj></CpfCnpj>
            <InscricaoMunicipal>${data.inscricaoMunicipal}</InscricaoMunicipal>
          </Prestador>
          <Tomador>
            <RazaoSocial>${data.tomador.nome}</RazaoSocial>
            <CpfCnpj>
              ${data.tomador.cpf ? `<Cpf>${data.tomador.cpf}</Cpf>` : ''}
              ${data.tomador.cnpj ? `<Cnpj>${data.tomador.cnpj}</Cnpj>` : ''}
            </CpfCnpj>
            ${data.tomador.endereco ? `
            <Endereco>
              <Logradouro>${data.tomador.endereco.logradouro}</Logradouro>
              <Numero>${data.tomador.endereco.numero}</Numero>
              <Bairro>${data.tomador.endereco.bairro}</Bairro>
              <CodigoMunicipio>2611606</CodigoMunicipio>
              <Uf>${data.tomador.endereco.uf}</Uf>
              <Cep>${data.tomador.endereco.cep}</Cep>
            </Endereco>` : ''}
          </Tomador>
        </InfDeclaracaoPrestacaoServico>
      </Rps>
    </ListaRps>
  </LoteRps>
</EnviarLoteRpsEnvio>`;
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

export const mockSendToNFSeService = async (data: Record<string, any>): Promise<{success: boolean, message: string, status: string, protocol?: string}> => {
  // Esta função simula o envio para o microserviço de NFS-e
  // Em produção, você substituiria isso por uma chamada real à API
  
  console.log("Simulando envio para o serviço de NFS-e da prefeitura:", data);
  
  // Simula um delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simula o XML que seria gerado
  const xmlData = generateAbrasfXml(data as NFSeData);
  console.log("XML gerado:", xmlData);
  
  // Simula a assinatura (em produção, usaria o certificado digital)
  console.log("Simulando assinatura digital do XML...");
  
  // Simula o envio SOAP
  console.log("Simulando envio SOAP para a prefeitura...");
  
  // 90% chance de sucesso para simular cenários reais
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    const protocol = Math.floor(1000000 + Math.random() * 9000000).toString();
    return {
      success: true,
      message: `NFS-e processada com sucesso. Protocolo: ${protocol}`,
      status: 'completed',
      protocol
    };
  } else {
    const errorMessages = [
      "Erro de validação no XML",
      "Certificado digital inválido ou expirado",
      "Serviço da prefeitura indisponível",
      "Erro na assinatura digital",
      "CNPJ não autorizado a emitir NFS-e"
    ];
    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    return {
      success: false,
      message: `Falha ao processar NFS-e: ${randomError}`,
      status: 'failed'
    };
  }
};

export const generateNFSe = async (data: NFSeData): Promise<{success: boolean, message: string, status: string, protocol?: string}> => {
  if (!validateNFSeData(data)) {
    return { success: false, message: "Validação de dados falhou", status: 'failed' };
  }
  
  try {
    const requestData = prepareNFSeRequest(data);
    
    // Atualiza o status para processando
    toast.loading("Processando NFS-e...", { id: "nfse-processing" });
    
    // Simula o processamento da NFS-e
    const result = await mockSendToNFSeService(requestData);
    
    toast.dismiss("nfse-processing");
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    
    return result;
  } catch (error) {
    toast.dismiss("nfse-processing");
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    toast.error(`Erro ao gerar NFS-e: ${errorMessage}`);
    return { success: false, message: `Erro ao gerar NFS-e: ${errorMessage}`, status: 'failed' };
  }
};

// Função para criar um componente de visualização do XML
export const createXmlViewer = (xml: string): string => {
  // Format XML for display (adding indentation, etc.)
  let formattedXml = xml
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>")
    .replace(/\s\s/g, "&nbsp;&nbsp;");
  
  return `
    <div style="font-family: monospace; background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; max-height: 400px;">
      ${formattedXml}
    </div>
  `;
};
