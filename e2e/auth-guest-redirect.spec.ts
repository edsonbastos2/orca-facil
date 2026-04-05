import { test, expect } from "@playwright/test";

test("deve redirecionar para /login ao acessar /dashboard sem autenticação", async ({
  page,
}) => {
  // Acessa diretamente o dashboard
  await page.goto("/dashboard");

  // Verifica que foi redirecionado para /login
  await expect(page).toHaveURL(/.*\/login/);
  await expect(page).toHaveTitle(/Login.*Orça Fácil/);
});
