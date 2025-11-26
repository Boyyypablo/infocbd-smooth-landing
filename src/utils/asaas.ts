/**
 * Utilitário para integração com API do Asaas
 * Documentação: https://asaasv3.docs.apiary.io/
 */

const API_BASE_URL_SANDBOX = 'https://sandbox.asaas.com/api/v3';
const API_BASE_URL_PRODUCTION = 'https://www.asaas.com/api/v3';

export interface AsaasCustomer {
  name: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
}

export interface AsaasPaymentRequest {
  customer: string; // ID do cliente no Asaas
  billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'DEBIT_CARD';
  value: number;
  dueDate: string; // Formato: YYYY-MM-DD
  description?: string;
  externalReference?: string;
  installmentCount?: number; // Para cartão de crédito
  installmentValue?: number; // Para cartão de crédito
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    phone: string;
    mobilePhone?: string;
  };
}

export interface AsaasPaymentResponse {
  id: string;
  customer: string;
  value: number;
  netValue?: number;
  originalValue?: number;
  interestValue?: number;
  description?: string;
  billingType: string;
  status: string;
  dueDate: string;
  originalDueDate: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  transactionReceiptUrl?: string;
  invoiceNumber?: string;
  externalReference?: string;
  deleted?: boolean;
  anticipated?: boolean;
  anticipable?: boolean;
  refunds?: any;
  pixTransaction?: {
    id: string;
    qrCode: string;
    qrCodeBase64: string;
    endToEndIdentifier?: string;
  };
  creditCard?: {
    creditCardNumber: string;
    creditCardBrand: string;
  };
}

export interface AsaasCustomerResponse {
  id: string;
  dateCreated: string;
  name: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
}

/**
 * Criar ou buscar cliente no Asaas
 */
export async function createOrGetAsaasCustomer(
  customerData: AsaasCustomer,
  apiKey: string,
  isSandbox: boolean = true
): Promise<AsaasCustomerResponse> {
  const baseUrl = isSandbox ? API_BASE_URL_SANDBOX : API_BASE_URL_PRODUCTION;

  // Primeiro, tentar buscar cliente existente por CPF/CNPJ
  try {
    const searchResponse = await fetch(
      `${baseUrl}/customers?cpfCnpj=${customerData.cpfCnpj.replace(/\D/g, '')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token': apiKey,
        },
      }
    );

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.data && searchData.data.length > 0) {
        // Cliente já existe, retornar
        return searchData.data[0];
      }
    }
  } catch (error) {
    console.warn('Erro ao buscar cliente existente:', error);
  }

  // Cliente não existe, criar novo
  const response = await fetch(`${baseUrl}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': apiKey,
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || 'Erro ao criar cliente no Asaas');
  }

  return await response.json();
}

/**
 * Criar pagamento PIX no Asaas
 */
export async function createAsaasPixPayment(
  customerId: string,
  value: number,
  dueDate: string,
  description: string,
  externalReference: string,
  apiKey: string,
  isSandbox: boolean = true
): Promise<AsaasPaymentResponse> {
  const baseUrl = isSandbox ? API_BASE_URL_SANDBOX : API_BASE_URL_PRODUCTION;

  const response = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': apiKey,
    },
    body: JSON.stringify({
      customer: customerId,
      billingType: 'PIX',
      value: value,
      dueDate: dueDate,
      description: description,
      externalReference: externalReference,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || 'Erro ao criar pagamento PIX');
  }

  return await response.json();
}

/**
 * Criar pagamento Boleto no Asaas
 */
export async function createAsaasBoletoPayment(
  customerId: string,
  value: number,
  dueDate: string,
  description: string,
  externalReference: string,
  apiKey: string,
  isSandbox: boolean = true
): Promise<AsaasPaymentResponse> {
  const baseUrl = isSandbox ? API_BASE_URL_SANDBOX : API_BASE_URL_PRODUCTION;

  const response = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': apiKey,
    },
    body: JSON.stringify({
      customer: customerId,
      billingType: 'BOLETO',
      value: value,
      dueDate: dueDate,
      description: description,
      externalReference: externalReference,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || 'Erro ao criar boleto');
  }

  return await response.json();
}

/**
 * Criar pagamento com Cartão de Crédito no Asaas
 */
export async function createAsaasCreditCardPayment(
  paymentData: AsaasPaymentRequest,
  apiKey: string,
  isSandbox: boolean = true
): Promise<AsaasPaymentResponse> {
  const baseUrl = isSandbox ? API_BASE_URL_SANDBOX : API_BASE_URL_PRODUCTION;

  const response = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': apiKey,
    },
    body: JSON.stringify({
      ...paymentData,
      billingType: 'CREDIT_CARD',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || 'Erro ao processar pagamento com cartão');
  }

  return await response.json();
}

/**
 * Buscar status de um pagamento no Asaas
 */
export async function getAsaasPaymentStatus(
  paymentId: string,
  apiKey: string,
  isSandbox: boolean = true
): Promise<AsaasPaymentResponse> {
  const baseUrl = isSandbox ? API_BASE_URL_SANDBOX : API_BASE_URL_PRODUCTION;

  const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'access_token': apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || 'Erro ao buscar status do pagamento');
  }

  return await response.json();
}

