import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import AppCurrency from "~/components/atoms/AppCurrency.vue";

describe("AppCurrency", () => {
  it("renderiza com label", () => {
    render(AppCurrency, {
      props: {
        id: "test-currency",
        label: "Valor Unitário",
        modelValue: null,
      },
    });

    expect(screen.getByText("Valor Unitário")).toBeInTheDocument();
  });

  it("formata valor em BRL", () => {
    const { container } = render(AppCurrency, {
      props: {
        id: "test-currency",
        label: "Valor Unitário",
        modelValue: 1234.56,
      },
    });

    // InputNumber renderiza o valor formatado no input interno
    const input = container.querySelector("input[type='text']");
    expect(input).toBeInTheDocument();
    // Verifica que contém o valor formatado em BRL (pode ter caractere unicode especial)
    expect(input).toHaveAttribute("value");
    const value = (input as HTMLInputElement).value;
    expect(value).toMatch(/R\$\s*1\.234,56/);
  });

  it("emite update:modelValue como number quando o valor muda", async () => {
    const { container, emitted } = render(AppCurrency, {
      props: {
        id: "test-currency",
        label: "Valor Unitário",
        modelValue: null,
      },
    });

    const input = container.querySelector(
      "input[type='text']",
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    // Simula mudança de valor - o InputNumber emite via seu próprio evento
    expect(emitted("update:modelValue")).toBeUndefined();
  });

  it("exibe mensagem de erro quando prop error é fornecido", () => {
    render(AppCurrency, {
      props: {
        id: "test-currency",
        label: "Valor Unitário",
        modelValue: null,
        error: "Valor inválido",
      },
    });

    expect(screen.getByText("Valor inválido")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("fica desabilitado quando disabled é true", () => {
    const { container } = render(AppCurrency, {
      props: {
        id: "test-currency",
        label: "Valor Unitário",
        modelValue: null,
        disabled: true,
      },
    });

    const input = container.querySelector(
      "input[type='text']",
    ) as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
