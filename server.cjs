// Backend Server - Simulação de Pagamento (CommonJS)

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Variaveis do Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Inicializar cliente Supabase (apenas se as variaveis estiverem configuradas)
let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  const { createClient } = require('@supabase/supabase-js');
  // Service Role Key bypassa RLS automaticamente
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('[OK] Cliente Supabase configurado (Service Role - bypassa RLS)');
} else {
  console.warn('[AVISO] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY nao configurados');
  console.warn('[AVISO] A simulacao de pagamento funcionara, mas nao atualizara o Supabase automaticamente');
}

// ==================== SIMULAÇÃO DE PAGAMENTO ====================

// ROTA: Criar checkout (simulação)
app.post('/api/create-checkout', async (req, res) => {
  try {
    if (!supabaseClient) {
      return res.status(500).json({ error: 'Supabase nao configurado no servidor' });
    }

    const { user_id, amount } = req.body;

    // Validar apenas amount (user_id é opcional, pode ser null)
    if (!amount) {
      return res.status(400).json({ error: 'amount e obrigatorio' });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'amount deve ser um numero positivo' });
    }
    
    // Criar pedido no Supabase com status 'PENDING'
    const orderData = {
      amount: parseFloat(amount),
      status: 'PENDING',
      description: `Pedido de R$ ${parseFloat(amount).toFixed(2)}`
    };
    
    // Validar se user_id é um UUID válido, caso contrário deixar NULL
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (user_id && uuidRegex.test(user_id)) {
      orderData.user_id = user_id;
    } else {
      orderData.user_id = null;
    }
    
    const { data: order, error: supabaseError } = await supabaseClient
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (supabaseError) {
      console.error('[ERRO] Erro ao criar pedido no Supabase:', supabaseError);
      
      if (supabaseError.message && (
        supabaseError.message.includes('relation') && supabaseError.message.includes('does not exist') ||
        supabaseError.message.includes('relation') && supabaseError.message.includes('não existe') ||
        supabaseError.code === 'PGRST116'
      )) {
        return res.status(500).json({ 
          error: 'Tabela "orders" nao existe no Supabase',
          details: 'Execute o arquivo database/supabase_schema.sql no Supabase Dashboard'
        });
      }
      
      return res.status(500).json({ 
        error: 'Erro ao criar pedido no banco de dados',
        details: supabaseError.message
      });
    }

    if (!order || !order.id) {
      console.error('[ERRO] Pedido criado mas sem ID');
      return res.status(500).json({ error: 'Erro ao criar pedido: ID nao retornado' });
    }

    console.log('[OK] Pedido criado no Supabase:', { order_id: order.id });

    // Simular criação de checkout - retornar URL de simulação
    const checkoutUrl = `${FRONTEND_URL}/checkout-retorno?status=success&orderId=${order.id}`;
    const paymentId = `sim_${order.id.substring(0, 8)}_${Date.now()}`;

    // Atualizar pedido com payment_id simulado
    try {
      await supabaseClient
        .from('orders')
        .update({ asaas_payment_id: paymentId })
        .eq('id', order.id);
    } catch (error) {
      // Ignorar erro se falhar
      console.warn('[AVISO] Erro ao salvar payment_id:', error);
    }

    // Simular aprovação automática após 5 segundos
    setTimeout(async () => {
      try {
        await supabaseClient
          .from('orders')
          .update({ 
            status: 'APPROVED',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);
        console.log('[OK] Pagamento simulado aprovado automaticamente:', order.id);
      } catch (error) {
        console.warn('[AVISO] Erro ao aprovar pagamento simulado:', error);
      }
    }, 5000); // 5 segundos

    console.log('[OK] Checkout simulado criado:', {
      checkout_id: paymentId,
      checkout_url: checkoutUrl,
      order_id: order.id
    });

    return res.status(200).json({ 
      success: true,
      order_id: order.id,
      checkout_url: checkoutUrl,
      checkout_id: paymentId
    });

  } catch (error) {
    console.error('[ERRO] Erro ao criar checkout:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// ROTA: Webhook simulado (para atualizar status do pagamento)
app.post('/payment-webhook', async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ error: 'orderId e status sao obrigatorios' });
    }

    if (!supabaseClient) {
      return res.status(500).json({ error: 'Supabase nao configurado' });
    }

    // Validar status
    const validStatuses = ['APPROVED', 'PENDING', 'FAILED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status invalido. Use: APPROVED, PENDING ou FAILED' });
    }

    // Atualizar status do pedido
    const { data: updatedOrder, error: updateError } = await supabaseClient
      .from('orders')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('[ERRO] Erro ao atualizar pedido:', updateError);
      return res.status(500).json({ 
        error: 'Erro ao atualizar pedido',
        details: updateError.message 
      });
    }

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Pedido nao encontrado' });
    }

    console.log('[OK] Webhook simulado processado:', {
      order_id: updatedOrder.id,
      status: updatedOrder.status
    });

    return res.status(200).json({ 
      success: true,
      order_id: updatedOrder.id,
      status: updatedOrder.status
    });

  } catch (error) {
    console.error('[ERRO] Erro no webhook:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    hasSupabaseConfig: !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY),
    mode: 'simulation'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[SERVIDOR] Servidor backend rodando na porta ${PORT}`);
  console.log(`[MODO] Simulacao de pagamento`);
  console.log(`\n[ENDPOINTS] Endpoints disponiveis:`);
  console.log(`   POST http://localhost:${PORT}/api/create-checkout`);
  console.log(`   POST http://localhost:${PORT}/payment-webhook`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`\n[OK] Backend configurado e pronto para receber requisicoes!`);
  if (supabaseClient) {
    console.log(`[OK] Supabase configurado - Status sera atualizado automaticamente`);
  } else {
    console.warn(`[AVISO] Supabase NAO configurado - Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env`);
  }
});
