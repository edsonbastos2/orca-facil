import { describe, it, expect } from "vitest";
import { formatarBRL } from "~/composables/useCurrency";

describe("useCurrency", () => {
  describe("formatarBRL valores positivos", () => {
    it("formata 1234.56 corretamente", () => {
      const resultado = formatarBRL(1234.56);
      expect(resultado).toContain("1.234,56");
      expect(resultado).toContain("R$");
    });

    it("formata 0 corretamente", () => {
      const resultado = formatarBRL(0);
      expect(resultado).toContain("0,00");
      expect(resultado).toContain("R$");
    });

    it("formata 100 corretamente", () => {
      const resultado = formatarBRL(100);
      expect(resultado).toContain("100,00");
      expect(resultado).toContain("R$");
    });

    it("formata valores grandes corretamente", () => {
      const resultado = formatarBRL(1000000);
      expect(resultado).toContain("1.000.000,00");
      expect(resultado).toContain("R$");
    });

    it("formata com casas decimais corretas", () => {
      expect(formatarBRL(0.01)).toContain("0,01");
      expect(formatarBRL(0.1)).toContain("0,10");
    });
  });

  describe("formatarBRL valores negativos", () => {
    it("formata -50 com sinal negativo", () => {
      const resultado = formatarBRL(-50);
      expect(resultado).toContain("50,00");
      expect(resultado).toContain("-");
    });

    it("formata -1234.56 corretamente", () => {
      const resultado = formatarBRL(-1234.56);
      expect(resultado).toContain("1.234,56");
      expect(resultado).toContain("-");
    });
  });

  describe("formatarBRL valores nulos/NaN", () => {
    it('retorna "R$ 0,00" para NaN', () => {
      expect(formatarBRL(NaN)).toBe("R$ 0,00");
    });

    it('retorna "R$ 0,00" para null (coerção)', () => {
      // @ts-expect-error — testando coerção intencionalmente
      expect(formatarBRL(null)).toBe("R$ 0,00");
    });

    it('retorna "R$ 0,00" para undefined (coerção)', () => {
      // @ts-expect-error — testando coerção intencionalmente
      expect(formatarBRL(undefined)).toBe("R$ 0,00");
    });
  });
});
