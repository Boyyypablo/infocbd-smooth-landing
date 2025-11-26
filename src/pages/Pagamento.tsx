// Página de Pagamento - Redireciona para Checkout
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Pagamento = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a página de checkout
    navigate('/checkout', { replace: true });
  }, [navigate]);

  return null;
};

export default Pagamento;
