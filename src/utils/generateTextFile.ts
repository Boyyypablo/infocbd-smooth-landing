// Utilitário para gerar arquivo de texto com os dados do pedido

export interface OrderInfo {
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
    preco: number;
  };
  data?: string;
}

export const generateOrderTextFile = (orderInfo: OrderInfo): Blob => {
  const text = `
========================================
PEDIDO NUUMA - CANNABIS MEDICINAL
========================================

DATA: ${orderInfo.data || new Date().toLocaleString('pt-BR')}

DADOS DO CLIENTE:
-----------------
Nome: ${orderInfo.nome}
CPF: ${orderInfo.cpf}
Email: ${orderInfo.email}
Telefone: ${orderInfo.telefone}

ENDEREÇO DE ENTREGA:
--------------------
CEP: ${orderInfo.endereco.cep}
Rua: ${orderInfo.endereco.rua}, ${orderInfo.endereco.numero}
${orderInfo.endereco.complemento ? `Complemento: ${orderInfo.endereco.complemento}` : ''}
Bairro: ${orderInfo.endereco.bairro}
Cidade: ${orderInfo.endereco.cidade}
Estado: ${orderInfo.endereco.estado}

PRODUTO:
--------
Medicamento: ${orderInfo.medicamento.nome}
Preço: R$ ${orderInfo.medicamento.preco.toFixed(2)}

========================================
`;

  return new Blob([text], { type: 'text/plain;charset=utf-8' });
};

export const downloadTextFile = (blob: Blob, filename: string = 'pedido-nuuma.txt') => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};




