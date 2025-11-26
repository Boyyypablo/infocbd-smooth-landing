import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

type OrderStatus = 'pendente' | 'pago' | 'cancelado' | 'falhou' | 'loading' | 'error';

interface UseOrderStatusOptions {
  orderId: string | null;
  pollInterval?: number; // Intervalo em milissegundos (padrão: 5000ms = 5 segundos)
  maxPollAttempts?: number; // Máximo de tentativas (padrão: 120 = 10 minutos)
  onStatusChange?: (status: OrderStatus) => void;
  autoStopOnApproved?: boolean; // Parar polling quando status for 'pago' (padrão: true)
}

interface UseOrderStatusReturn {
  status: OrderStatus;
  isLoading: boolean;
  error: string | null;
  startPolling: () => void;
  stopPolling: () => void;
  isPolling: boolean;
}

/**
 * Hook para verificar status do pedido no Supabase com polling automático
 * 
 * Este hook consulta o Supabase periodicamente para verificar mudanças no status
 * do pedido. O status é atualizado pelo webhook de pagamento.
 * 
 * @example
 * ```tsx
 * const { status, isLoading, startPolling } = useOrderStatus({
 *   orderId: '123e4567-e89b-12d3-a456-426614174000',
 *   pollInterval: 5000, // Verificar a cada 5 segundos
 *   onStatusChange: (newStatus) => {
 *     if (newStatus === 'pago') {
 *       navigate('/sucesso');
 *     }
 *   }
 * });
 * ```
 */
export const useOrderStatus = ({
  orderId,
  pollInterval = 5000,
  maxPollAttempts = 120, // 10 minutos (120 * 5s)
  onStatusChange,
  autoStopOnApproved = true,
}: UseOrderStatusOptions): UseOrderStatusReturn => {
  const [status, setStatus] = useState<OrderStatus>('loading');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const pollAttemptsRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Função para buscar status do pedido
  const fetchOrderStatus = async (): Promise<OrderStatus | null> => {
    if (!orderId) {
      return null;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('pedidos')
        .select('status')
        .eq('id', orderId)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar status do pedido:', fetchError);
        return 'error';
      }

      if (!data) {
        return 'error';
      }

      return data.status as OrderStatus;
    } catch (err) {
      console.error('Erro ao buscar status:', err);
      return 'error';
    }
  };

  // Função de polling
  const poll = async () => {
    if (!isMountedRef.current || !orderId) {
      return;
    }

    pollAttemptsRef.current += 1;

    // Verificar se excedeu o máximo de tentativas
    if (pollAttemptsRef.current > maxPollAttempts) {
      console.warn('Polling interrompido: máximo de tentativas atingido');
      stopPolling();
      setError('Tempo limite de verificação excedido');
      return;
    }

    const currentStatus = await fetchOrderStatus();

    if (!currentStatus || currentStatus === 'error') {
      setError('Erro ao verificar status do pedido');
      setIsLoading(false);
      return;
    }

    // Atualizar status se mudou
    if (currentStatus !== status) {
      setStatus(currentStatus);
      setIsLoading(false);
      setError(null);

      // Callback quando status muda
      if (onStatusChange) {
        onStatusChange(currentStatus);
      }

      // Parar polling se pagamento foi aprovado
      if (autoStopOnApproved && currentStatus === 'pago') {
        stopPolling();
        return;
      }
    }

    setIsLoading(false);
  };

  // Iniciar polling
  const startPolling = () => {
    if (!orderId) {
      setError('ID do pedido não fornecido');
      return;
    }

    if (intervalRef.current) {
      return; // Já está fazendo polling
    }

    setIsPolling(true);
    pollAttemptsRef.current = 0;
    setError(null);

    // Primeira verificação imediata
    poll();

    // Configurar intervalo
    intervalRef.current = setInterval(poll, pollInterval);
  };

  // Parar polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  };

  // Buscar status inicial quando orderId mudar
  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      setIsLoading(false);
      setError('ID do pedido não fornecido');
      return;
    }

    // Buscar status inicial
    fetchOrderStatus().then((initialStatus) => {
      if (!isMountedRef.current) return;

      if (initialStatus) {
        setStatus(initialStatus);
        setIsLoading(false);

        // Se já estiver pago, não precisa fazer polling
        if (initialStatus === 'pago') {
          if (onStatusChange) {
            onStatusChange(initialStatus);
          }
        }
      } else {
        setStatus('error');
        setIsLoading(false);
        setError('Erro ao buscar status inicial');
      }
    });

    // Cleanup
    return () => {
      stopPolling();
    };
  }, [orderId]);

  // Cleanup ao desmontar
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, []);

  return {
    status,
    isLoading,
    error,
    startPolling,
    stopPolling,
    isPolling,
  };
};

