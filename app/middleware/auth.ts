const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  const isPublicRoute = PUBLIC_ROUTES.some((route) => to.path.startsWith(route));

  // Usuário não autenticado tentando acessar rota protegida
  if (!user.value && !isPublicRoute) {
    return navigateTo("/login");
  }

  // Usuário autenticado tentando acessar página de login
  if (user.value && to.path === "/login") {
    return navigateTo("/dashboard");
  }
});
