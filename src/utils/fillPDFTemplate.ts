import { PDFDocument, rgb } from 'pdf-lib';
import { pdfCoordinates } from '@/config/pdfCoordinates';

/**
 * Preenche o template PDF com nome e CPF do usuário
 * @param nome - Nome completo do usuário
 * @param cpf - CPF do usuário (formato: XXX.XXX.XXX-XX ou apenas números)
 * @returns Blob do PDF preenchido
 */
export async function fillPDFTemplate(nome: string, cpf: string): Promise<Blob> {
  try {
    // Carregar o template PDF
    const templatePath = '/receita sem assinatura.pdf';
    const response = await fetch(templatePath);
    
    if (!response.ok) {
      throw new Error('Template PDF não encontrado');
    }
    const templateBytes = await response.arrayBuffer();
    
    // Carregar o PDF
    const pdfDoc = await PDFDocument.load(templateBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    
    // Formatar CPF (adicionar pontos e traço se necessário)
    const formattedCPF = formatCPF(cpf);
    
    // Carregar fonte
    const helveticaFont = await pdfDoc.embedFont('Helvetica');
    
    // Tentar encontrar e preencher campos de formulário primeiro
    const form = pdfDoc.getForm();
    const formFields = form.getFields();
    
    let filledFields = false;
    
    // Tentar preencher campos de formulário se existirem
    for (const field of formFields) {
      const fieldName = field.getName().toLowerCase();
      
      if (fieldName.includes('nome') || fieldName.includes('name') || fieldName.includes('paciente')) {
        if (field.constructor.name === 'PDFTextField') {
          (field as any).setText(nome);
          filledFields = true;
        }
      }
      
      if (fieldName.includes('cpf') || fieldName.includes('documento') || fieldName.includes('identidade')) {
        if (field.constructor.name === 'PDFTextField') {
          (field as any).setText(formattedCPF);
          filledFields = true;
        }
      }
    }
    
    // Se não encontrou campos de formulário, adicionar texto diretamente
    // NOTA: Você precisará ajustar essas coordenadas baseado no layout do seu PDF
    // As coordenadas são em pontos (72 pontos = 1 polegada), começando do canto inferior esquerdo
    
    if (!filledFields) {
      // Usar coordenadas do arquivo de configuração
      // O sistema pdf-lib usa coordenadas do canto inferior esquerdo
      // Se y for 0, calcular baseado na altura da página (comportamento padrão)
      const nomeY = pdfCoordinates.nome.y === 0 
        ? height - 200 
        : height - pdfCoordinates.nome.y;
      
      const cpfY = pdfCoordinates.cpf.y === 0 
        ? height - 230 
        : height - pdfCoordinates.cpf.y;
      
      // Adicionar texto ao PDF usando as coordenadas configuradas
      firstPage.drawText(nome, {
        x: pdfCoordinates.nome.x,
        y: nomeY,
        size: pdfCoordinates.nome.size || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      firstPage.drawText(formattedCPF, {
        x: pdfCoordinates.cpf.x,
        y: cpfY,
        size: pdfCoordinates.cpf.size || 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }
    
    // Salvar o PDF modificado
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Erro ao preencher PDF:', error);
    throw new Error('Não foi possível gerar o documento. Por favor, tente novamente.');
  }
}

/**
 * Formata CPF adicionando pontos e traço
 * @param cpf - CPF sem formatação ou já formatado
 * @returns CPF formatado mascarado com asteriscos (***.***.***-**)
 */
function formatCPF(cpf: string): string {
  // Remove tudo que não é número
  const numbers = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) {
    return '***.***.***-**'; // Retorna máscara padrão se não tiver 11 dígitos
  }
  
  // Retorna CPF mascarado: ***.***.***-**
  return '***.***.***-**';
}

