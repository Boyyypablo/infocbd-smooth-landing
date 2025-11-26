import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load routes for code splitting
const Formulario = lazy(() => import("./pages/Formulario"));
const AnaliseMedica = lazy(() => import("./pages/AnaliseMedica"));
const Identificacao = lazy(() => import("./pages/Identificacao"));
const Endereco = lazy(() => import("./pages/Endereco"));
const Pagamento = lazy(() => import("./pages/Pagamento"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const Sucesso = lazy(() => import("./pages/Sucesso"));
const Processamento = lazy(() => import("./pages/Processamento"));

const queryClient = new QueryClient();

// Component to handle scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B2C91]"></div>
              <p className="mt-4 text-muted-foreground">Carregando...</p>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/formulario" element={<Formulario />} />
            <Route path="/analise-medica" element={<AnaliseMedica />} />
            <Route path="/identificacao" element={<Identificacao />} />
            <Route path="/endereco" element={<Endereco />} />
            <Route path="/pagamento" element={<CheckoutPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout-retorno" element={<CheckoutPage />} />
            <Route path="/sucesso" element={<Sucesso />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
