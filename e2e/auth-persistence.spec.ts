import { test, expect } from "@playwright/test";

const TEST_EMAIL = process.env.TEST_USER_EMAIL || "test@example.com";
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "Test@123456";

test("deve persistir a sessão após recarregar a página", async ({ page }) => {
  // Acessa a página de login
  await page.goto("/login");

  // Preenche o formulário de login com credenciais válidas
  await page.getByRole("textbox", { name: /e-mail/i }).fill(TEST_EMAIL);
  await page.getByRole("textbox", { name: /senha/i }).fill(TEST_PASSWORD);

  // Clica no botão de entrar
  await page.getByRole("button", { name: /entrar/i }).click();

  // Aguarda o redirecionamento para /dashboard
  await expect(page).toHaveURL(/.*\/dashboard/);

  // Recarrega a página
  await page.reload();

  // Verifica que continua no dashboard (sessão persistiu)
  await expect(page).toHaveURL(/.*\/dashboard/);
  await expect(page.getByText(/olá,/i)).toBeVisible();
  await expect(page.getByText(TEST_EMAIL)).toBeVisible();
});
