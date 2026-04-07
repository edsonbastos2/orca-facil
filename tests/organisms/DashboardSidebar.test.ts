import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { ref } from "vue";
import DashboardSidebar from "~/components/organisms/DashboardSidebar.vue";

// Mock do useAuthState
const mockLogout = vi.fn().mockResolvedValue(undefined);
vi.stubGlobal("useAuthState", () => ({
  logout: mockLogout,
}));

// Mock do useSupabaseUser
const mockUser = ref({ id: "test-user-id", email: "test@example.com" });
vi.stubGlobal("useSupabaseUser", () => mockUser);

// Mock do navigateTo
vi.stubGlobal("navigateTo", vi.fn().mockResolvedValue(undefined));

describe("DashboardSidebar", () => {
  it("renderiza links de Orçamentos e Clientes", () => {
    render(DashboardSidebar, {
      props: {
        activeRoute: "/orcamentos",
      },
    });

    expect(screen.getByText("Orçamentos")).toBeInTheDocument();
    expect(screen.getByText("Clientes")).toBeInTheDocument();
  });

  it("renderiza o logo Orça Fácil", () => {
    render(DashboardSidebar, {
      props: {
        activeRoute: "/orcamentos",
      },
    });

    expect(screen.getByText("Orça Fácil")).toBeInTheDocument();
    expect(screen.getByText("Gestão de Orçamentos")).toBeInTheDocument();
  });

  it("destaca a rota ativa corretamente", () => {
    render(DashboardSidebar, {
      props: {
        activeRoute: "/clientes",
      },
    });

    const clientesLink = screen.getByText("Clientes").closest("button");
    expect(clientesLink).toHaveClass("bg-blue-50");
    expect(clientesLink).toHaveClass("text-blue-700");
  });

  it("botão Sair chama logout e navega para /login", async () => {
    render(DashboardSidebar, {
      props: {
        activeRoute: "/orcamentos",
      },
    });

    const logoutButton = screen.getByText("Sair").closest("button");
    expect(logoutButton).toBeInTheDocument();

    await fireEvent.click(logoutButton!);

    expect(mockLogout).toHaveBeenCalled();
  });

  it("exibe o email do usuário", () => {
    render(DashboardSidebar, {
      props: {
        activeRoute: "/orcamentos",
      },
    });

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
