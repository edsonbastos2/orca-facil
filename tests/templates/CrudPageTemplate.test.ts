import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import CrudPageTemplate from "~/components/templates/CrudPageTemplate.vue";

describe("CrudPageTemplate", () => {
  it("exibe título e breadcrumb", () => {
    render(CrudPageTemplate, {
      props: {
        title: "Clientes",
      },
    });

    expect(screen.getByText("Clientes")).toBeInTheDocument();
  });

  it("exibe descrição quando fornecida", () => {
    render(CrudPageTemplate, {
      props: {
        title: "Clientes",
        description: "Gerencie seus clientes",
      },
    });

    expect(screen.getByText("Gerencie seus clientes")).toBeInTheDocument();
  });

  it("exibe breadcrumb padrão com Home", () => {
    render(CrudPageTemplate, {
      props: {
        title: "Orçamentos",
      },
    });

    // O Breadcrumb do PrimeVue renderiza Home duas vezes (home prop + items)
    const homeElements = screen.getAllByText("Home");
    expect(homeElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Orçamentos")).toBeInTheDocument();
  });

  it("exibe breadcrumb personalizado", () => {
    render(CrudPageTemplate, {
      props: {
        title: "Novo Orçamento",
        breadcrumbs: [
          { label: "Home", route: "/dashboard" },
          { label: "Orçamentos", route: "/orcamentos" },
          { label: "Novo" },
        ],
      },
    });

    // Home aparece duas vezes no breadcrumb do PrimeVue
    const homeElements = screen.getAllByText("Home");
    expect(homeElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Orçamentos")).toBeInTheDocument();
    expect(screen.getByText("Novo")).toBeInTheDocument();
  });

  it("renderiza conteúdo slotado", () => {
    render(CrudPageTemplate, {
      props: {
        title: "Clientes",
      },
      slots: {
        default: "<p>Conteúdo personalizado</p>",
      },
    });

    expect(screen.getByText("Conteúdo personalizado")).toBeInTheDocument();
  });
});
