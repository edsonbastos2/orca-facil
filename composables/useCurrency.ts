/**
 * Composable para formatação monetária em Real Brasileiro (BRL).
 *
 * Utiliza Intl.NumberFormat para garantir formatação correta
 * de acordo com o locale pt-BR.
 */

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formata um número como moeda brasileira (R$).
 *
 * @example
 * formatarBRL(1234.56) // "R$ 1.234,56"
 * formatarBRL(0)       // "R$ 0,00"
 * formatarBRL(-50)     // "-R$ 50,00"
 */
export function formatarBRL(valor: number): string {
  if (Number.isNaN(valor) || valor === null || valor === undefined) {
    return 'R$ 0,00';
  }
  return currencyFormatter.format(valor);
}

/**
 * Composable para compatibilidade com Vue (caso precise de reatividade futura).
 * Atualmente exporta apenas a função pura, mas segue o padrão Nuxt composables.
 */
export function useCurrency() {
  return {
    formatarBRL,
  };
}
