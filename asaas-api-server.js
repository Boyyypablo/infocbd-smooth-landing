// ============================================
// Servidor API Node.js/Express
// Integração Asaas Checkout + Supabase
// ============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE
// ============================================

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';
const SUCCESS_URL = process.env.SUCCESS_URL || `${FRONTEND_URL}/checkout-retorno?status=success`;
const CANCEL_URL = process.env.CANCEL_URL || `${FRONTEND_URL}/checkout-retorno?status=cancel`;

// Variáveis do Asaas
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_IS_SANDBOX = process.env.ASAAS_IS_SANDBOX !== 'false'; // Por padrão usa sandbox
const ASAAS_BASE_URL = ASAAS_IS_SANDBOX 
  ? 'https://sandbox.asaas.com/api/v3'
  : 'https://www.asaas.com/api/v3';

// Variáveis do Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WEBHOOK_SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN || process.env.ASAAS_API_KEY;

// ============================================
// INICIALIZAR CLIENTE SUPABASE
// ============================================

let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  const { createClient } = require('@supabase/supabase-js');
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  console.log('[OK] Cliente Supabase configurado');
} else {
  console.warn('[AVISO] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY nao configurados');
}

// ============================================
// REQUISITO B: ROTA DE CRIAÇÃO DE CHECKOUT
// POST /api/create-checkout
// ============================================

app.post('/api/create-checkout', async (req, res) => {
  try {
    // Validar variáveis de ambiente
    if (!ASAAS_API_KEY) {
      return res.status(500).json({ 
        error: 'ASAAS_API_KEY nao configurado no servidor' 
      });
    }

    if (!supabaseClient) {
      return res.status(500).json({ 
        error: 'Supabase nao configurado no servidor' 
      });
    }

    // Extrair dados do body
    const { user_id, amount } = req.body;

    // Validar dados obrigatórios
    if (!user_id || !amount) {
      return res.status(400).json({ 
        error: 'user_id e amount sao obrigatorios' 
      });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        error: 'amount deve ser um numero positivo' 
      });
    }

    console.log('[INFO] Criando checkout:', { user_id, amount });

    // ============================================
    // PASSO 1: Criar pedido no Supabase com status 'PENDING'
    // ============================================

    const { data: order, error: supabaseError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user_id,
        amount: amount,
        status: 'PENDING', // Status inicial
        description: `Pedido de R$ ${amount.toFixed(2)}`
      })
      .select()
      .single();

    if (supabaseError) {
      console.error('[ERRO] Erro ao criar pedido no Supabase:', supabaseError);
      return res.status(500).json({ 
        error: 'Erro ao criar pedido no banco de dados',
        details: supabaseError.message 
      });
    }

    if (!order || !order.id) {
      console.error('[ERRO] Pedido criado mas sem ID');
      return res.status(500).json({ 
        error: 'Erro ao criar pedido: ID nao retornado' 
      });
    }

    console.log('[OK] Pedido criado no Supabase:', { order_id: order.id });

    // ============================================
    // PASSO 2: Criar cobrança/sessão no Asaas
    // ============================================

    // Calcular data de vencimento (padrão: 3 dias)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    // Montar payload para criar checkout no Asaas
    const checkoutData = {
      customer: user_id, // Usando user_id como customer (ajuste conforme necessário)
      billingType: 'UNDEFINED', // UNDEFINED permite escolher no checkout
      value: parseFloat(amount),
      dueDate: dueDateStr,
      description: `Pedido #${order.id}`,
      externalReference: order.id, // CRÍTICO: ID do pedido para o webhook
      // URLs de redirecionamento após pagamento
      callback: {
        successUrl: `${SUCCESS_URL}&orderId=${order.id}`,
        autoRedirect: true
      }
    };

    // Chamar API do Asaas para criar checkout
    const asaasResponse = await fetch(`${ASAAS_BASE_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(checkoutData),
    });

    if (!asaasResponse.ok) {
      const asaasError = await asaasResponse.json().catch(() => ({ 
        message: 'Erro desconhecido do Asaas' 
      }));

      console.error('[ERRO] Erro do Asaas ao criar checkout:', {
        status: asaasResponse.status,
        error: asaasError
      });

      // Se falhar, atualizar status do pedido para 'FAILED'
      await supabaseClient
        .from('orders')
        .update({ status: 'FAILED' })
        .eq('id', order.id);

      return res.status(asaasResponse.status).json({ 
        error: 'Erro ao criar checkout no Asaas',
        details: asaasError.errors?.[0]?.description || asaasError.message 
      });
    }

    const checkout = await asaasResponse.json();

    if (!checkout || !checkout.url) {
      console.error('[ERRO] Checkout criado mas sem URL');
      return res.status(500).json({ 
        error: 'Erro ao criar checkout: URL nao retornada' 
      });
    }

    console.log('[OK] Checkout criado no Asaas:', {
      checkout_id: checkout.id,
      checkout_url: checkout.url,
      order_id: order.id
    });

    // ============================================
    // PASSO 3: Atualizar pedido com asaas_payment_id
    // ============================================

    if (checkout.id) {
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ asaas_payment_id: checkout.id })
        .eq('id', order.id);

      if (updateError) {
        console.warn('[AVISO] Erro ao salvar asaas_payment_id:', updateError);
        // Não falhar a requisição, o webhook ainda pode funcionar
      } else {
        console.log('[OK] asaas_payment_id salvo no pedido');
      }
    }

    // ============================================
    // PASSO 4: Retornar dados para o frontend
    // ============================================

    return res.status(200).json({
      success: true,
      order_id: order.id,
      checkout_url: checkout.url, // URL para redirecionar o cliente
      checkout_id: checkout.id
    });

  } catch (error) {
    console.error('[ERRO] Erro ao criar checkout:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// ============================================
// REQUISITO C: ROTA DE WEBHOOK
// POST /asaas-webhook
// ============================================

app.post('/asaas-webhook', async (req, res) => {
  try {
    // ============================================
    // PASSO 1: VALIDAÇÃO DE SEGURANÇA
    // ============================================

    const asaasAccessToken = req.headers['asaas-access-token'];

    // Validar token de segurança
    if (WEBHOOK_SECRET_TOKEN && asaasAccessToken) {
      if (asaasAccessToken !== WEBHOOK_SECRET_TOKEN) {
        console.error('[ERRO] Webhook rejeitado: Token invalido');
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } else if (WEBHOOK_SECRET_TOKEN) {
      // Se WEBHOOK_SECRET_TOKEN está configurado mas não recebemos token, rejeitar
      console.error('[ERRO] Webhook rejeitado: Token nao fornecido');
      return res.status(401).json({ error: 'Token required' });
    }

    console.log('[OK] Webhook autenticado com sucesso');

    // ============================================
    // PASSO 2: EXTRAIR DADOS DO PAYLOAD
    // ============================================

    const { event, payment } = req.body;

    if (!event || !payment) {
      console.warn('[AVISO] Webhook recebido sem event ou payment');
      return res.status(400).json({ error: 'Invalid payload' });
    }

    console.log('[INFO] Webhook recebido:', {
      event: event,
      payment_id: payment.id,
      external_reference: payment.externalReference,
      status: payment.status
    });

    // ============================================
    // PASSO 3: FILTRAR EVENTOS RELEVANTES
    // ============================================

    // Processar apenas eventos de pagamento confirmado/recebido
    const validEvents = ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'];

    if (!validEvents.includes(event)) {
      // Retornar 200 OK para outros eventos para evitar reenvios
      console.log('[INFO] Evento ignorado (nao e de confirmacao):', event);
      return res.status(200).json({ message: 'Event ignored' });
    }

    // ============================================
    // PASSO 4: EXTRAIR IDENTIFICADORES
    // ============================================

    const asaasPaymentId = payment.id; // ID da cobrança no Asaas
    const externalReference = payment.externalReference; // ID do pedido (order.id)

    if (!asaasPaymentId) {
      console.error('[ERRO] Webhook sem asaas_payment_id');
      return res.status(400).json({ error: 'Missing payment id' });
    }

    console.log('[INFO] Identificadores extraidos:', {
      asaas_payment_id: asaasPaymentId,
      external_reference: externalReference
    });

    // ============================================
    // PASSO 5: VALIDAR SUPABASE
    // ============================================

    if (!supabaseClient) {
      console.error('[ERRO] Cliente Supabase nao configurado');
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // ============================================
    // PASSO 6: ATUALIZAR STATUS DO PEDIDO
    // ============================================

    // Buscar pedido por asaas_payment_id (mais preciso)
    let updateResult = null;
    let updateError = null;

    if (asaasPaymentId) {
      // Estratégia 1: Buscar por asaas_payment_id
      updateResult = await supabaseClient
        .from('orders')
        .update({ 
          status: 'APPROVED', // Atualizar para APPROVED
          updated_at: new Date().toISOString()
        })
        .eq('asaas_payment_id', asaasPaymentId)
        .select()
        .single();

      updateError = updateResult.error;

      if (!updateError && updateResult.data) {
        console.log('[OK] Pedido atualizado por asaas_payment_id:', {
          order_id: updateResult.data.id,
          status_anterior: 'PENDING',
          status_novo: 'APPROVED'
        });
      }
    }

    // Estratégia 2: Se não encontrou, tentar por external_reference (order.id)
    if (updateError && externalReference) {
      console.log('[INFO] Tentando atualizar por external_reference:', externalReference);

      updateResult = await supabaseClient
        .from('orders')
        .update({ 
          status: 'APPROVED',
          asaas_payment_id: asaasPaymentId, // Salvar também o asaas_payment_id
          updated_at: new Date().toISOString()
        })
        .eq('id', externalReference)
        .select()
        .single();

      updateError = updateResult.error;

      if (!updateError && updateResult.data) {
        console.log('[OK] Pedido atualizado por external_reference:', {
          order_id: updateResult.data.id,
          status_anterior: 'PENDING',
          status_novo: 'APPROVED'
        });
      }
    }

    // ============================================
    // PASSO 7: TRATAMENTO DE ERROS
    // ============================================

    if (updateError) {
      console.error('[ERRO] Erro ao atualizar pedido no Supabase:', updateError);
      return res.status(500).json({ 
        error: 'Database update failed',
        details: updateError.message 
      });
    }

    if (!updateResult || !updateResult.data) {
      console.warn('[AVISO] Pedido nao encontrado para atualizar:', {
        asaas_payment_id: asaasPaymentId,
        external_reference: externalReference
      });
      // Retornar 200 para evitar reenvios, mas logar o problema
      return res.status(200).json({ 
        message: 'Order not found, but webhook processed',
        warning: 'Payment ID not linked to any order'
      });
    }

    // ============================================
    // PASSO 8: RESPOSTA DE SUCESSO
    // ============================================

    console.log('[OK] Webhook processado com sucesso:', {
      order_id: updateResult.data.id,
      status: updateResult.data.status
    });

    return res.status(200).json({ 
      success: true,
      message: 'Webhook processed successfully',
      order_id: updateResult.data.id,
      status: updateResult.data.status
    });

  } catch (error) {
    console.error('[ERRO] Erro critico no webhook:', error);
    // Retornar 500 para que o Asaas tente reenviar
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// ============================================
// ENDPOINT DE HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    hasAsaasApiKey: !!ASAAS_API_KEY,
    asaasIsSandbox: ASAAS_IS_SANDBOX,
    hasSupabaseConfig: !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY),
    webhookConfigured: !!supabaseClient,
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[SERVIDOR] Servidor API rodando na porta ${PORT}`);
  console.log(`[ENDPOINTS] Endpoints disponiveis:`);
  console.log(`   POST http://localhost:${PORT}/api/create-checkout`);
  console.log(`   POST http://localhost:${PORT}/asaas-webhook`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`\n[OK] Servidor configurado e pronto!`);
});

module.exports = app;

