import { describe, it, expect } from 'vitest';
import { calcularTotais, type QuoteItem, type DescontoTipo } from '~/composables/useQuoteCalculations';

describe('useQuoteCalculations', () => {
  // Helpers para criar itens de forma consistente
  const servico = (descricao: string, quantidade: number, valorUnitario: number): QuoteItem => ({
    descricao,
    quantidade,
    valorUnitario,
  });

  const material = (descricao: string, quantidade: number, valorUnitario: number): QuoteItem => ({
    descricao,
    quantidade,
    valorUnitario,
  });

  describe('calcularTotais com arrays vazios', () => {
    it('retorna todos zeros quando não há itens', () => {
      const totais = calcularTotais([], [], null, 0);

      expect(totais.subtotalServicos).toBe(0);
      expect(totais.subtotalMateriais).toBe(0);
      expect(totais.desconto).toBe(0);
      expect(totais.total).toBe(0);
    });

    it('retorna zeros com arrays undefined/null tratados', () => {
      // Mesmo com itens vazios explicitamente
      const totais = calcularTotais([], [], 'percentual', 0);

      expect(totais.total).toBe(0);
    });
  });

  describe('calcularTotais com apenas serviços', () => {
    it('calcula subtotalServicos corretamente com 1 serviço', () => {
      const servicos = [servico('Instalação elétrica', 1, 150)];
      const totais = calcularTotais(servicos, [], null, 0);

      expect(totais.subtotalServicos).toBe(150);
      expect(totais.subtotalMateriais).toBe(0);
      expect(totais.desconto).toBe(0);
      expect(totais.total).toBe(150);
    });

    it('calcula subtotalServicos corretamente com múltiplos serviços', () => {
      const servicos = [
        servico('Instalação ponto de luz', 2, 150),
        servico('Troca de fiação', 1, 200),
      ];
      const totais = calcularTotais(servicos, [], null, 0);

      expect(totais.subtotalServicos).toBe(500); // 2*150 + 1*200
      expect(totais.total).toBe(500);
    });
  });

  describe('calcularTotais com apenas materiais', () => {
    it('calcula subtotalMateriais corretamente', () => {
      const materiais = [
        material('Fio elétrico 2.5mm (metro)', 50, 3.5),
        material('Disjuntor 20A', 4, 25),
      ];
      const totais = calcularTotais([], materiais, null, 0);

      expect(totais.subtotalMateriais).toBe(275); // 50*3.5 + 4*25
      expect(totais.total).toBe(275);
    });
  });

  describe('calcularTotais com serviços + materiais', () => {
    it('calcula ambos subtotais corretamente', () => {
      const servicos = [
        servico('Instalação', 1, 100),
        servico('Manutenção', 2, 50),
      ];
      const materiais = [
        material('Cabo 10m', 1, 50),
      ];
      const totais = calcularTotais(servicos, materiais, null, 0);

      expect(totais.subtotalServicos).toBe(200); // 1*100 + 2*50
      expect(totais.subtotalMateriais).toBe(50);
      expect(totais.total).toBe(250);
    });

    it('cenário completo: 2 serviços + 1 material', () => {
      const servicos = [
        servico('Serviço A', 1, 100),
        servico('Serviço B', 1, 200),
      ];
      const materiais = [
        material('Material C', 1, 50),
      ];
      const totais = calcularTotais(servicos, materiais, null, 0);

      expect(totais.subtotalServicos).toBe(300);
      expect(totais.subtotalMateriais).toBe(50);
      expect(totais.total).toBe(350);
    });
  });

  describe('calcularTotais com desconto percentual', () => {
    it('aplica 10% de desconto sobre subtotal de 350', () => {
      const servicos = [servico('Serviço A', 1, 100), servico('Serviço B', 1, 200)];
      const materiais = [material('Material C', 1, 50)];
      const totais = calcularTotais(servicos, materiais, 'percentual', 10);

      expect(totais.subtotalServicos).toBe(300);
      expect(totais.subtotalMateriais).toBe(50);
      expect(totais.desconto).toBe(35); // 10% de 350
      expect(totais.total).toBe(315);
    });

    it('aplica 50% de desconto', () => {
      const servicos = [servico('Serviço', 1, 1000)];
      const totais = calcularTotais(servicos, [], 'percentual', 50);

      expect(totais.desconto).toBe(500);
      expect(totais.total).toBe(500);
    });

    it('aplica 100% de desconto (gratuito)', () => {
      const servicos = [servico('Serviço', 1, 100)];
      const totais = calcularTotais(servicos, [], 'percentual', 100);

      expect(totais.desconto).toBe(100);
      expect(totais.total).toBe(0);
    });

    it('aplica 0% de desconto (sem efeito)', () => {
      const servicos = [servico('Serviço', 1, 100)];
      const totais = calcularTotais(servicos, [], 'percentual', 0);

      expect(totais.desconto).toBe(0);
      expect(totais.total).toBe(100);
    });
  });

  describe('calcularTotais com desconto fixo', () => {
    it('aplica desconto fixo de R$50 sobre subtotal de 350', () => {
      const servicos = [servico('Serviço A', 1, 100), servico('Serviço B', 1, 200)];
      const materiais = [material('Material C', 1, 50)];
      const totais = calcularTotais(servicos, materiais, 'fixo', 50);

      expect(totais.subtotalServicos).toBe(300);
      expect(totais.subtotalMateriais).toBe(50);
      expect(totais.desconto).toBe(50);
      expect(totais.total).toBe(300);
    });

    it('desconto fixo maior que o subtotal limita ao subtotal', () => {
      const servicos = [servico('Serviço', 1, 100)];
      const totais = calcularTotais(servicos, [], 'fixo', 200);

      expect(totais.desconto).toBe(100); // limitado ao subtotal
      expect(totais.total).toBe(0);
    });

    it('desconto fixo de R$0 não afeta total', () => {
      const servicos = [servico('Serviço', 1, 100)];
      const totais = calcularTotais(servicos, [], 'fixo', 0);

      expect(totais.desconto).toBe(0);
      expect(totais.total).toBe(100);
    });
  });

  describe('calcularTotais sem desconto (null)', () => {
    it('não aplica desconto quando descontoTipo é null', () => {
      const servicos = [servico('Serviço', 1, 250)];
      const materiais = [material('Material', 1, 100)];
      const totais = calcularTotais(servicos, materiais, null, 50);

      expect(totais.desconto).toBe(0);
      expect(totais.total).toBe(350);
    });
  });

  describe('casos de borda', () => {
    it('quantidade zero no item não afeta subtotal', () => {
      const servicos = [servico('Serviço não usado', 0, 100)];
      const totais = calcularTotais(servicos, [], null, 0);

      expect(totais.subtotalServicos).toBe(0);
    });

    it('valor unitário zero não afeta subtotal', () => {
      const servicos = [servico('Serviço gratuito', 5, 0)];
      const totais = calcularTotais(servicos, [], null, 0);

      expect(totais.subtotalServicos).toBe(0);
    });

    it('múltiplos itens com quantidades variadas', () => {
      const servicos = [
        servico('Item A', 3, 10),
        servico('Item B', 2, 25),
      ];
      const materiais = [
        material('Material X', 10, 5),
        material('Material Y', 1, 100),
      ];
      const totais = calcularTotais(servicos, materiais, 'percentual', 5);

      expect(totais.subtotalServicos).toBe(80);  // 3*10 + 2*25
      expect(totais.subtotalMateriais).toBe(150); // 10*5 + 1*100
      expect(totais.desconto).toBe(11.5);         // 5% de 230
      expect(totais.total).toBe(218.5);
    });
  });
});
