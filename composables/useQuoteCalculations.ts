/**
 * Composable para cálculos de totais de orçamentos.
 *
 * Funções puras, sem I/O, sem efeitos colaterais.
 * Responsáveis por calcular subtotais de serviços e materiais,
 * aplicar descontos (percentual ou fixo) e retornar o total final.
 */

export interface QuoteItem {
  id?: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export type DescontoTipo = 'percentual' | 'fixo' | null;

export interface CalculatedTotals {
  subtotalServicos: number;
  subtotalMateriais: number;
  desconto: number;
  total: number;
}

/**
 * Calcula os totais de um orçamento com base nos itens de serviço,
 * itens de materiais e desconto aplicado.
 *
 * @param servicos - Lista de itens de serviço (mão de obra)
 * @param materiais - Lista de itens de materiais (produtos)
 * @param descontoTipo - Tipo de desconto: 'percentual', 'fixo' ou null
 * @param descontoValor - Valor do desconto (percentual 0-100 ou valor fixo em R$)
 * @returns Objeto com subtotalServicos, subtotalMateriais, desconto e total
 *
 * @example
 * const totais = calcularTotais(
 *   [{ descricao: 'Instalação', quantidade: 1, valorUnitario: 100 }],
 *   [{ descricao: 'Fio', quantidade: 10, valorUnitario: 5 }],
 *   'percentual',
 *   10
 * );
 * // { subtotalServicos: 100, subtotalMateriais: 50, desconto: 15, total: 135 }
 */
export function calcularTotais(
  servicos: QuoteItem[],
  materiais: QuoteItem[],
  descontoTipo: DescontoTipo,
  descontoValor: number,
): CalculatedTotals {
  const subtotalServicos = calcularSubtotal(servicos);
  const subtotalMateriais = calcularSubtotal(materiais);
  const subtotal = subtotalServicos + subtotalMateriais;

  const desconto = calcularDesconto(subtotal, descontoTipo, descontoValor);
  const total = Math.max(0, subtotal - desconto);

  return {
    subtotalServicos,
    subtotalMateriais,
    desconto,
    total,
  };
}

/**
 * Calcula o subtotal de uma lista de itens (quantidade × valor unitário).
 */
function calcularSubtotal(itens: QuoteItem[]): number {
  if (!itens || itens.length === 0) return 0;

  return itens.reduce((acc, item) => {
    const quantidade = item.quantidade || 0;
    const valorUnitario = item.valorUnitario || 0;
    return acc + quantidade * valorUnitario;
  }, 0);
}

/**
 * Calcula o valor do desconto com base no tipo e valor aplicados.
 */
function calcularDesconto(
  subtotal: number,
  descontoTipo: DescontoTipo,
  descontoValor: number,
): number {
  if (!descontoTipo || !descontoValor || descontoValor <= 0) {
    return 0;
  }

  if (descontoTipo === 'percentual') {
    return subtotal * (descontoValor / 100);
  }

  if (descontoTipo === 'fixo') {
    return Math.min(descontoValor, subtotal);
  }

  return 0;
}

/**
 * Composable padrão Nuxt (para consistência com auto-imports).
 */
export function useQuoteCalculations() {
  return {
    calcularTotais,
  };
}
