import { describe, it, expect, vi, beforeEach } from "vitest";

describe("useAuthState", () => {
  // Mocks reutilizáveis
  const createMockRef = <T>(initial: T) => ({ value: initial });

  beforeEach(() => {
    vi.resetModules();
  });

  async function setupAuthState(
    options: {
      loginResult?: { user: object | null };
      loginError?: { message: string; status: number } | null;
    } = {},
  ) {
    const loadingRef = createMockRef(false);
    const errorRef = createMockRef<string | null>(null);

    const useStateFn = (key: string, init: () => unknown) => {
      if (key === "auth:loading") return loadingRef;
      if (key === "auth:error") return errorRef;
      return createMockRef(init());
    };

    const signInResult = options.loginError
      ? { data: { user: null }, error: options.loginError }
      : {
          data: options.loginResult ?? { user: null },
          error: options.loginError ?? null,
        };

    const mockClient = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue(signInResult),
      },
    };

    // Injeta mocks no globalThis antes do import do módulo
    (globalThis as Record<string, unknown>).useState = useStateFn;
    (globalThis as Record<string, unknown>).useSupabaseClient = vi.fn(
      () => mockClient,
    );

    const { useAuthState } = await import("./useAuth");
    const authState = useAuthState();

    return {
      ...authState,
      loadingRef,
      errorRef,
      mockClient,
    };
  }

  it("deve retornar estado inicial correto", async () => {
    const { isLoading, error, loadingRef, errorRef } = await setupAuthState();
    expect(isLoading).toBe(loadingRef);
    expect(error).toBe(errorRef);
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("deve retornar login, logout e clearError como funções", async () => {
    const { login, logout, clearError } = await setupAuthState();
    expect(typeof login).toBe("function");
    expect(typeof logout).toBe("function");
    expect(typeof clearError).toBe("function");
  });

  it("login() com credenciais válidas retorna true", async () => {
    const { login, isLoading, error, mockClient } = await setupAuthState({
      loginResult: { user: { id: "1", email: "test@test.com" } },
    });

    const result = await login("test@test.com", "password123");

    expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "password123",
    });
    expect(result).toBe(true);
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("login() com credenciais inválidas retorna false e seta erro amigável", async () => {
    const { login, isLoading, error } = await setupAuthState({
      loginError: { message: "Invalid login credentials", status: 400 },
    });

    const result = await login("wrong@test.com", "wrongpass");

    expect(result).toBe(false);
    expect(isLoading.value).toBe(false);
    expect(error.value).toBe("E-mail ou senha inválidos");
  });

  it("login() com erro de rede retorna mensagem amigável", async () => {
    const { login, error } = await setupAuthState({
      loginError: { message: "Network Error", status: 0 },
    });

    const result = await login("test@test.com", "password123");

    expect(result).toBe(false);
    expect(error.value).toBe("Erro de conexão. Tente novamente.");
  });

  it("logout() reseta estado de loading e error", async () => {
    const { logout, isLoading, error, loadingRef, errorRef } =
      await setupAuthState();

    errorRef.value = "erro anterior";
    loadingRef.value = false;

    await logout();

    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("clearError() limpa o estado de erro", async () => {
    const { clearError, error, errorRef } = await setupAuthState();

    errorRef.value = "algum erro";
    clearError();

    expect(error.value).toBeNull();
  });
});
