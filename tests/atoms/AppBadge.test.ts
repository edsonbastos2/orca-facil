import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import AppBadge from "~/components/atoms/AppBadge.vue";

describe("AppBadge", () => {
  it("renderiza com label", () => {
    render(AppBadge, {
      props: {
        label: "Rascunho",
      },
    });

    expect(screen.getByText("Rascunho")).toBeInTheDocument();
  });

  it("renderiza com severity info", () => {
    render(AppBadge, {
      props: {
        label: "Informativo",
        severity: "info",
      },
    });

    const badge = screen.getByText("Informativo");
    expect(badge).toBeInTheDocument();
    // O Tag do PrimeVue aplica classes internas; verificamos que o componente renderiza
    expect(badge.closest(".p-tag")).toBeInTheDocument();
  });

  it("renderiza com severity success", () => {
    render(AppBadge, {
      props: {
        label: "Aprovado",
        severity: "success",
      },
    });

    const badge = screen.getByText("Aprovado");
    expect(badge).toBeInTheDocument();
    expect(badge.closest(".p-tag")).toBeInTheDocument();
  });

  it("renderiza com severity warning", () => {
    render(AppBadge, {
      props: {
        label: "Pendente",
        severity: "warning",
      },
    });

    const badge = screen.getByText("Pendente");
    expect(badge).toBeInTheDocument();
    expect(badge.closest(".p-tag")).toBeInTheDocument();
  });

  it("renderiza com severity danger", () => {
    render(AppBadge, {
      props: {
        label: "Recusado",
        severity: "danger",
      },
    });

    const badge = screen.getByText("Recusado");
    expect(badge).toBeInTheDocument();
    expect(badge.closest(".p-tag")).toBeInTheDocument();
  });
});
