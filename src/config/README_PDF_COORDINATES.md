# Como Ajustar as Coordenadas do PDF

## Problema
O nome e CPF estão sendo colocados no lugar errado do PDF.

## Solução
Edite o arquivo `src/config/pdfCoordinates.ts` e ajuste os valores de `x` e `y` para cada campo.

## Como Encontrar as Coordenadas Corretas

### Método 1: Usando Adobe Acrobat (Recomendado)
1. Abra o PDF template (`public/receita para assinar.pdf`) no Adobe Acrobat
2. Vá em **Ferramentas** → **Preparar Formulário**
3. Clique no campo onde deve ir o Nome
4. Veja as propriedades do campo (geralmente aparece um painel lateral)
5. Anote os valores de **X** e **Y** (já estão em pontos)
6. Para o CPF, faça o mesmo processo

### Método 2: Usando Medição Manual
1. Abra o PDF em um visualizador
2. Meça a distância do campo até:
   - **Borda esquerda** (valor X)
   - **Borda superior** (valor Y)
3. Converta para pontos:
   - 1 polegada = 72 pontos
   - 1 cm = 28.35 pontos
   - Exemplo: 2 polegadas = 144 pontos

### Método 3: Teste e Ajuste
1. Gere um PDF de teste
2. Veja onde o texto apareceu
3. Ajuste os valores em `pdfCoordinates.ts`:
   - Se o texto está muito à esquerda → aumente `x`
   - Se o texto está muito à direita → diminua `x`
   - Se o texto está muito acima → aumente `y`
   - Se o texto está muito abaixo → diminua `y`

## Exemplo de Configuração

```typescript
export const pdfCoordinates: PDFCoordinates = {
  nome: {
    x: 150,        // 150 pontos da esquerda
    y: height - 180, // 180 pontos do topo (será calculado automaticamente)
    size: 12,      // Tamanho da fonte
  },
  cpf: {
    x: 150,        // Mesma posição horizontal
    y: height - 210, // 30 pontos abaixo do nome
    size: 12,
  },
};
```

## Importante
- As coordenadas Y são medidas do **canto inferior esquerdo** do PDF
- Se você colocar `y: 0`, o sistema calculará automaticamente baseado na altura da página
- Valores maiores de Y = mais próximo do topo
- Valores menores de Y = mais próximo da base

