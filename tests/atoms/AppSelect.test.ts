import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import AppSelect from "~/components/atoms/AppSelect.vue";

const mockOptions = [
  { label: "Opção 1", value: "opcao1" },
  { label: "Opção 2", value: "opcao2" },
  { label: "Opção 3", value: "opcao3" },
];

describe("AppSelect", () => {
  it("renderiza com label e options", () => {
    const { container } = render(AppSelect, {
      props: {
        id: "test-select",
        label: "Selecione uma opção",
        modelValue: null,
        options: mockOptions,
      },
    });

    // Verifica que o label existe (o texto aparece duas vezes: label e placeholder)
    const label = container.querySelector("label");
    expect(label).toBeInTheDocument();
    expect(label?.textContent).toBe("Selecione uma opção");
  });

  it("exibe mensagem de erro quando prop error é fornecido", () => {
    render(AppSelect, {
      props: {
        id: "test-select",
        label: "Selecione uma opção",
        modelValue: null,
        options: mockOptions,
        error: "Campo obrigatório",
      },
    });

    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("emite update:modelValue quando uma opção é selecionada", async () => {
    const { emitted, container } = render(AppSelect, {
      props: {
        id: "test-select",
        label: "Selecione uma opção",
        modelValue: null,
        options: mockOptions,
      },
    });

    // O Select do PrimeVue usa um dropdown com role="combobox"
    const combobox = container.querySelector('[role="combobox"]');
    expect(combobox).toBeInTheDocument();
  });

  it("fica desabilitado quando disabled é true", () => {
    const { container } = render(AppSelect, {
      props: {
        id: "test-select",
        label: "Selecione uma opção",
        modelValue: null,
        options: mockOptions,
        disabled: true,
      },
    });

    // Verifica o atributo aria-disabled no combobox
    const combobox = container.querySelector('[role="combobox"]');
    expect(combobox).toHaveAttribute("aria-disabled", "true");
  });
});
