import { describe, it, expect, vi, beforeEach } from "vitest";

describe("middleware/auth", () => {
  const mockUser = { value: null as Record<string, unknown> | null };
  const mockNavigateTo = vi.fn();
  let middlewareFn: ReturnType<typeof import("./auth").default>;

  beforeEach(async () => {
    vi.resetModules();
    mockUser.value = null;
    mockNavigateTo.mockReset();

    // Mock das auto-imports do Nuxt
    (globalThis as Record<string, unknown>).useSupabaseUser = vi.fn(() => mockUser);
    (globalThis as Record<string, unknown>).navigateTo = mockNavigateTo;
    (globalThis as Record<string, unknown>).defineNuxtRouteMiddleware = vi.fn(
      (fn: (...args: unknown[]) => unknown) => fn
    );

    const mod = await import("./auth");
    middlewareFn = mod.default;
  });

  function createRoute(path: string) {
    return { path } as { path: string };
  }

  it("deve redirecionar usuário não autenticado para /login em rota protegida", async () => {
    mockUser.value = null;

    middlewareFn(createRoute("/dashboard"));

    expect(mockNavigateTo).toHaveBeenCalledWith("/login");
  });

  it("deve redirecionar usuário não autenticado para /login em /settings", async () => {
    mockUser.value = null;

    middlewareFn(createRoute("/settings"));

    expect(mockNavigateTo).toHaveBeenCalledWith("/login");
  });

  it("NÃO deve redirecionar usuário não autenticado em /login", async () => {
    mockUser.value = null;

    middlewareFn(createRoute("/login"));

    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  it("NÃO deve redirecionar usuário não autenticado em /register", async () => {
    mockUser.value = null;

    middlewareFn(createRoute("/register"));

    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  it("NÃO deve redirecionar usuário não autenticado em /forgot-password", async () => {
    mockUser.value = null;

    middlewareFn(createRoute("/forgot-password"));

    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  it("deve redirecionar usuário autenticado de /login para /dashboard", async () => {
    mockUser.value = { id: "1", email: "test@test.com" };

    middlewareFn(createRoute("/login"));

    expect(mockNavigateTo).toHaveBeenCalledWith("/dashboard");
  });

  it("NÃO deve redirecionar usuário autenticado em /dashboard", async () => {
    mockUser.value = { id: "1", email: "test@test.com" };

    middlewareFn(createRoute("/dashboard"));

    expect(mockNavigateTo).not.toHaveBeenCalled();
  });
});
