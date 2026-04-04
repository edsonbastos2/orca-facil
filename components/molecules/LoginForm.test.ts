import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { createPrimeVue } from "../../../tests/primevue-helper";
import LoginForm from "./LoginForm.vue";
import AppInput from "../atoms/AppInput.vue";
import AppButton from "../atoms/AppButton.vue";
import AuthFooter from "./AuthFooter.vue";
import Message from "primevue/message";

// Mock global components para o LoginForm
const globalComponents = {
  AppInput,
  AppButton,
  AuthFooter,
  Message,
};

describe("LoginForm", () => {
  it("deve renderizar campos de e-mail e senha", () => {
    render(LoginForm, {
      global: {
        plugins: [createPrimeVue()],
        components: globalComponents,
      },
    });

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    // Password component do PrimeVue renderiza um div wrapper, usamos placeholder
    expect(screen.getByPlaceholderText(/sua senha/i)).toBeInTheDocument();
  });

  it("deve renderizar botão de entrar", () => {
    render(LoginForm, {
      global: {
        plugins: [createPrimeVue()],
        components: globalComponents,
      },
    });

    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("deve renderizar AuthFooter com links de criar conta e esquecer senha", () => {
    render(LoginForm, {
      global: {
        plugins: [createPrimeVue()],
        components: globalComponents,
      },
    });

    expect(screen.getByText(/criar conta/i)).toBeInTheDocument();
    expect(screen.getByText(/esqueci minha senha/i)).toBeInTheDocument();
  });

  it("NÃO deve emitir submit quando e-mail está vazio", async () => {
    const { emitted } = render(LoginForm, {
      global: {
        plugins: [createPrimeVue()],
        components: globalComponents,
      },
    });

    const button = screen.getByRole("button", { name: /entrar/i });
    await button.click();

    expect(emitted().submit).toBeUndefined();
  });

  it("deve emitir submit com email e senha válidos", async () => {
    const { emitted } = render(LoginForm, {
      global: {
        plugins: [createPrimeVue()],
        components: globalComponents,
      },
    });

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/sua senha/i);

    await fireEvent.update(emailInput, "test@test.com");
    await fireEvent.update(passwordInput, "password123");

    const button = screen.getByRole("button", { name: /entrar/i });
    await button.click();

    expect(emitted().submit).toHaveLength(1);
    expect(emitted().submit[0]).toEqual([
      { email: "test@test.com", password: "password123" },
    ]);
  });

  it("deve desabilitar botão quando loading é true", () => {
    render(LoginForm, {
      props: { loading: true },
      global: {
        plugins: [createPrimeVue()],
        components: globalComponents,
      },
    });

    const button = screen.getByRole("button", { name: /entrar/i });
    expect(button).toBeDisabled();
  });

  it("deve exibir mensagem de erro quando error prop é fornecido", () => {
    render(LoginForm, {
      props: { error: "E-mail ou senha inválidos" },
      global: {
        plugins: [createPrimeVue()],
        components: globalComponents,
      },
    });

    expect(screen.getByText(/e-mail ou senha inválidos/i)).toBeInTheDocument();
  });
});
