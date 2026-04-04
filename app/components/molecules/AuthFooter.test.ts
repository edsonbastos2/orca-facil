import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import AuthFooter from "./AuthFooter.vue";

describe("AuthFooter", () => {
  it("deve renderizar link para criar conta", () => {
    render(AuthFooter);

    const link = screen.getByText(/criar conta/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/register");
  });

  it("deve renderizar link para esquecer senha", () => {
    render(AuthFooter);

    const link = screen.getByText(/esqueci minha senha/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/forgot-password");
  });
});
