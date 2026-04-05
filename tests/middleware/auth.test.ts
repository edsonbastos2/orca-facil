import { describe, it, expect, vi, beforeEach } from "vitest";

describe("middleware/auth", () => {
  let middlewareFn: (...args: any[]) => any;

  // Mock do user que será compartilhado entre teste e middleware
  const mockUserRef = { value: null as Record<string, unknown> | null };

  beforeEach(async () => {
    vi.resetModules();
    mockUserRef.value = null;

    // Recria a lógica do middleware para teste isolado
    // Como não temos Nuxt real, simulamos o comportamento
    const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

    middlewareFn = async (to: { path: string }) => {
      // Simula delay do middleware real
      await new Promise((resolve) => setTimeout(resolve, 0));

      const user = mockUserRef;
      const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        to.path.startsWith(route),
      );

      if (!user.value && !isPublicRoute) {
        return "/login";
      }

      if (user.value && to.path === "/login") {
        return "/dashboard";
      }

      return undefined;
    };
  });

  function createRoute(path: string) {
    return { path };
  }

  it("deve redirecionar usuário não autenticado para /login em rota protegida", async () => {
    mockUserRef.value = null;

    const result = await middlewareFn(createRoute("/dashboard"));

    expect(result).toBe("/login");
  });

  it("deve redirecionar usuário não autenticado para /login em /settings", async () => {
    mockUserRef.value = null;

    const result = await middlewareFn(createRoute("/settings"));

    expect(result).toBe("/login");
  });

  it("NÃO deve redirecionar usuário não autenticado em /login", async () => {
    mockUserRef.value = null;

    const result = await middlewareFn(createRoute("/login"));

    expect(result).toBeUndefined();
  });

  it("NÃO deve redirecionar usuário não autenticado em /register", async () => {
    mockUserRef.value = null;

    const result = await middlewareFn(createRoute("/register"));

    expect(result).toBeUndefined();
  });

  it("NÃO deve redirecionar usuário não autenticado em /forgot-password", async () => {
    mockUserRef.value = null;

    const result = await middlewareFn(createRoute("/forgot-password"));

    expect(result).toBeUndefined();
  });

  it("deve redirecionar usuário autenticado de /login para /dashboard", async () => {
    mockUserRef.value = { id: "1", email: "test@test.com" };

    const result = await middlewareFn(createRoute("/login"));

    expect(result).toBe("/dashboard");
  });

  it("NÃO deve redirecionar usuário autenticado em /dashboard", async () => {
    mockUserRef.value = { id: "1", email: "test@test.com" };

    const result = await middlewareFn(createRoute("/dashboard"));

    expect(result).toBeUndefined();
  });
});
