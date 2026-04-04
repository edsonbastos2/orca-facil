const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

export default defineNuxtRouteMiddleware(async (to) => {
  // Aguarda a sessão ser restaurada do localStorage (necessário em SPA mode)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const user = useSupabaseUser();
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    to.path.startsWith(route),
  );

  // Usuário não autenticado tentando acessar rota protegida
  if (!user.value && !isPublicRoute) {
    return navigateTo("/login");
  }

  // Usuário autenticado tentando acessar página de login
  if (user.value && to.path === "/login") {
    return navigateTo("/dashboard");
  }
});
