// Utilitário para capturar e armazenar dados do Typeform

export interface TypeformData {
  medicamento?: {
    nome: string;
    imagem?: string;
  };
  [key: string]: any;
}

const STORAGE_KEY = 'typeform_data';

export const saveTypeformData = (data: TypeformData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados do typeform:', error);
  }
};

export const getTypeformData = (): TypeformData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao recuperar dados do typeform:', error);
    return null;
  }
};

export const clearTypeformData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar dados do typeform:', error);
  }
};

// Capturar dados do typeform quando o formulário for completado
export const captureTypeformResponse = () => {
  // Esta função será chamada quando o typeform for completado
  // Por enquanto, vamos usar dados mockados ou capturar via URL params
  const urlParams = new URLSearchParams(window.location.search);
  const medicamento = urlParams.get('medicamento');
  
  if (medicamento) {
    saveTypeformData({
      medicamento: {
        nome: medicamento,
        imagem: '/medicamentos/medicamento.jpg'
      }
    });
  }
};

