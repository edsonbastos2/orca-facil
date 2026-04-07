import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import ClienteForm from "~/components/molecules/ClienteForm.vue";

describe("ClienteForm", () => {
  it("renderiza campos de nome e email obrigatórios", () => {
    render(ClienteForm, {
      props: {
        initialData: null,
        loading: false,
      },
    });

    expect(screen.getByText("Nome *")).toBeInTheDocument();
    expect(screen.getByText("E-mail *")).toBeInTheDocument();
  });

  it("renderiza campos opcionais de telefone e empresa", () => {
    render(ClienteForm, {
      props: {
        initialData: null,
        loading: false,
      },
    });

    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("Empresa")).toBeInTheDocument();
  });

  it("renderiza botões Cancelar e Salvar", () => {
    const { container } = render(ClienteForm, {
      props: {
        initialData: null,
        loading: false,
      },
    });

    expect(container.innerHTML).toContain("Cancelar");
    expect(container.innerHTML).toContain("Salvar");
  });

  it("emite cancel quando botão Cancelar é clicado", async () => {
    const { emitted, container } = render(ClienteForm, {
      props: {
        initialData: null,
        loading: false,
      },
    });

    const buttons = container.querySelectorAll("button");
    const cancelButton = Array.from(buttons).find((btn) =>
      btn.textContent?.includes("Cancelar"),
    );
    await fireEvent.click(cancelButton!);

    expect(emitted("cancel")).toBeTruthy();
  });

  it("preenche campos com initialData", () => {
    const { container } = render(ClienteForm, {
      props: {
        initialData: {
          nome: "Maria Souza",
          email: "maria@email.com",
          telefone: "(11) 88888-8888",
          empresa: "Empresa B",
        },
        loading: false,
      },
    });

    // Verifica que o HTML contém os valores
    expect(container.innerHTML).toContain("Maria Souza");
    expect(container.innerHTML).toContain("maria@email.com");
  });
});
