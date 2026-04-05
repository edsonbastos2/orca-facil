import { test, expect } from "@playwright/test";

const TEST_EMAIL = process.env.TEST_USER_EMAIL || "test@example.com";
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "Test@123456";

test("deve redirecionar para /login e fazer login com sucesso", async ({
  page,
}) => {
  // Acessa a página inicial
  await page.goto("/");

  // Verifica que foi redirecionado para /login
  await expect(page).toHaveURL(/.*\/login/);
  await expect(page).toHaveTitle(/Login.*Orça Fácil/);

  // Preenche o formulário de login
  await page.getByRole("textbox", { name: /e-mail/i }).fill(TEST_EMAIL);
  await page.getByRole("textbox", { name: /senha/i }).fill(TEST_PASSWORD);

  // Clica no botão de entrar
  await page.getByRole("button", { name: /entrar/i }).click();

  // Verifica que foi redirecionado para /dashboard
  await expect(page).toHaveURL(/.*\/dashboard/);
  await expect(page).toHaveTitle(/Dashboard.*Orça Fácil/);

  // Verifica que o e-mail do usuário está exibido
  await expect(page.getByText(/olá,/i)).toBeVisible();
  await expect(page.getByText(TEST_EMAIL)).toBeVisible();
});
