import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import ClienteList from "~/components/organisms/ClienteList.vue";

const mockClientes = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 99999-9999",
    empresa: "Empresa A",
  },
  {
    id: "2",
    nome: "Maria Souza",
    email: "maria@email.com",
    telefone: null,
    empresa: null,
  },
];

describe("ClienteList", () => {
  it("renderiza tabela com clientes", () => {
    render(ClienteList, {
      props: {
        clientes: mockClientes,
        loading: false,
      },
    });

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
    expect(screen.getByText("joao@email.com")).toBeInTheDocument();
  });

  it("emite evento editar quando botão de editar é clicado", async () => {
    const { emitted } = render(ClienteList, {
      props: {
        clientes: mockClientes,
        loading: false,
      },
    });

    const editButtons = screen.getAllByTitle("Editar");
    await fireEvent.click(editButtons[0]);

    expect(emitted("editar")).toBeTruthy();
    expect(emitted("editar")![0]).toEqual(["1"]);
  });

  it("exibe diálogo de confirmação ao clicar em excluir", async () => {
    render(ClienteList, {
      props: {
        clientes: mockClientes,
        loading: false,
      },
    });

    const deleteButtons = screen.getAllByTitle("Excluir");
    await fireEvent.click(deleteButtons[0]);

    expect(
      screen.getByText(/Tem certeza que deseja excluir o cliente/),
    ).toBeInTheDocument();
  });

  it("exibe — para telefone e empresa nulos", () => {
    render(ClienteList, {
      props: {
        clientes: mockClientes,
        loading: false,
      },
    });

    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
  });
});
