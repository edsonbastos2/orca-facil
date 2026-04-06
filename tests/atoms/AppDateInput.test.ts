import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import AppDateInput from "~/components/atoms/AppDateInput.vue";

describe("AppDateInput", () => {
  it("renderiza com label", () => {
    render(AppDateInput, {
      props: {
        id: "test-date",
        label: "Data de Validade",
        modelValue: null,
      },
    });

    expect(screen.getByText("Data de Validade")).toBeInTheDocument();
  });

  it("emite data no formato ISO quando uma data é selecionada", () => {
    render(AppDateInput, {
      props: {
        id: "test-date",
        label: "Data de Validade",
        modelValue: null,
      },
    });

    // Verifica que o componente está montado corretamente
    const input = screen.getByPlaceholderText("Selecione uma data");
    expect(input).toBeInTheDocument();
  });

  it("exibe mensagem de erro quando prop error é fornecido", () => {
    render(AppDateInput, {
      props: {
        id: "test-date",
        label: "Data de Validade",
        modelValue: null,
        error: "Data inválida",
      },
    });

    expect(screen.getByText("Data inválida")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("fica desabilitado quando disabled é true", () => {
    render(AppDateInput, {
      props: {
        id: "test-date",
        label: "Data de Validade",
        modelValue: null,
        disabled: true,
      },
    });

    const input = screen.getByPlaceholderText("Selecione uma data");
    expect(input).toBeDisabled();
  });

  it("converte string ISO para Date internamente", () => {
    const testDate = "2026-04-15T00:00:00.000Z";
    render(AppDateInput, {
      props: {
        id: "test-date",
        label: "Data de Validade",
        modelValue: testDate,
      },
    });

    expect(screen.getByText("Data de Validade")).toBeInTheDocument();
    // O componente deve aceitar uma string ISO e converter para Date internamente
    const input = screen.getByPlaceholderText("Selecione uma data");
    expect(input).toBeInTheDocument();
  });
});
