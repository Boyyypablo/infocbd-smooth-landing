/**
 * Configuração das coordenadas para preencher nome e CPF no PDF
 * 
 * COMO AJUSTAR:
 * 1. Abra o PDF template em um editor (Adobe Acrobat, etc.)
 * 2. Meça a distância do campo em relação ao canto inferior esquerdo
 * 3. Converta para pontos (1 polegada = 72 pontos)
 * 4. Ajuste os valores abaixo
 * 
 * Exemplo:
 * - Se o campo está a 2 polegadas da esquerda: x = 2 * 72 = 144
 * - Se o campo está a 8 polegadas do topo: y = altura - (8 * 72)
 */

export interface PDFCoordinates {
  nome: {
    x: number; // Distância da esquerda em pontos
    y: number; // Distância do topo em pontos (altura - distância do topo)
    size?: number; // Tamanho da fonte (padrão: 12)
  };
  cpf: {
    x: number; // Distância da esquerda em pontos
    y: number; // Distância do topo em pontos
    size?: number; // Tamanho da fonte (padrão: 12)
  };
}

// Coordenadas padrão - AJUSTE ESTES VALORES CONFORME SEU PDF
// 
// IMPORTANTE: Para ajustar corretamente:
// 1. Abra o PDF template em um editor (Adobe Acrobat, etc.)
// 2. Meça a distância do campo até a borda esquerda (valor X)
// 3. Meça a distância do campo até a borda superior (valor Y)
// 4. Converta para pontos: 1 polegada = 72 pontos, 1 cm = 28.35 pontos
// 5. Para Y: use (altura da página - distância do topo)
// 
// Exemplo: Se o campo está a 2 polegadas da esquerda e 3 polegadas do topo:
// x = 2 * 72 = 144
// y = altura - (3 * 72) = altura - 216
//
// Se você colocar y: 0, o sistema calculará automaticamente
export const pdfCoordinates: PDFCoordinates = {
  nome: {
    x: 78, // Distância da esquerda em pontos - AJUSTE AQUI
    y: 142, // Distância do topo em pontos - AJUSTE AQUI (ou 0 para cálculo automático)
    size: 12, // Tamanho da fonte
  },
  cpf: {
    x: 98, // Distância da esquerda em pontos - AJUSTE AQUI
    y: 157, // Distância do topo em pontos - AJUSTE AQUI (ou 0 para cálculo automático)
    size: 12, // Tamanho da fonte
  },
};

