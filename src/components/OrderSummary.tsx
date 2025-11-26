import { useEffect, useState } from "react";
import { getTypeformData } from "@/utils/typeformData";
import { X } from "lucide-react";

export const OrderSummary = () => {
  const [medicamento, setMedicamento] = useState<{ nome: string; imagem?: string } | null>(null);
  const precoMedicamento = 150.00; // Valor do remédio
  const precoAvaliacao = 37.00; // Valor da avaliação médica

  useEffect(() => {
    const typeformData = getTypeformData();
    if (typeformData?.medicamento) {
      setMedicamento(typeformData.medicamento);
    } else {
      // Fallback se não houver dados
      setMedicamento({
        nome: "Canabidiol 23,75mg 10 ml Solução Gotas",
        imagem: "/medicamentos/medicamento.jpg"
      });
    }
  }, []);

  return (
    <div className="bg-gray-50 rounded-2xl shadow-lg p-5 md:p-6 h-fit">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Resumo da compra</h2>
      
      <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
        {/* Medicamento */}
        {medicamento && (
          <div className="flex items-start gap-4 pb-4 border-b">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {medicamento.imagem ? (
                <img 
                  src={medicamento.imagem} 
                  alt={medicamento.nome}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/medicamentos/medicamento.jpg";
                  }}
                />
              ) : (
                <div className="text-2xl">💊</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm md:text-base break-words">{medicamento.nome}</p>
              <p className="text-xs md:text-sm text-gray-600">Solução Gotas - 10ml</p>
              <p className="text-base md:text-lg font-bold text-[#6B2C91] mt-1">
                R$ {precoMedicamento.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        )}

        {/* Avaliação Médica */}
        <div className="flex items-center justify-between pb-3 md:pb-4 border-b">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl md:text-2xl flex-shrink-0">🏥</span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm md:text-base">Avaliação Médica</p>
              <p className="text-xs md:text-sm text-gray-600">(assíncrona)</p>
            </div>
          </div>
          <p className="text-base md:text-lg font-bold text-[#6B2C91] flex-shrink-0 ml-2">
            R$ {precoAvaliacao.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Entrega */}
        <div className="flex items-center justify-between pb-3 md:pb-4 border-b">
          <p className="font-semibold text-gray-800 text-sm md:text-base">Entrega</p>
          <p className="text-base md:text-lg font-bold text-green-600">Grátis</p>
        </div>
      </div>

      {/* Total */}
      <div className="pt-3 md:pt-4 border-t-2 border-gray-300">
        <div className="flex items-center justify-between mb-2">
          <p className="text-base md:text-lg font-bold text-gray-800">Total</p>
          <p className="text-xl md:text-2xl font-bold text-[#6B2C91]">
            R$ {(precoMedicamento + precoAvaliacao).toFixed(2).replace('.', ',')}
          </p>
        </div>
        <p className="text-xs md:text-sm text-gray-600">Valor total (consulta + medicamento)</p>
      </div>
    </div>
  );
};

