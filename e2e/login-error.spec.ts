import { test, expect } from "@playwright/test";

test("deve exibir mensagem de erro com credenciais inválidas", async ({
  page,
}) => {
  // Acessa a página de login
  await page.goto("/login");

  // Preenche o formulário com credenciais inválidas
  await page
    .getByRole("textbox", { name: /e-mail/i })
    .fill("invalido@example.com");
  await page.getByRole("textbox", { name: /senha/i }).fill("senha-errada");

  // Clica no botão de entrar
  await page.getByRole("button", { name: /entrar/i }).click();

  // Verifica que a mensagem de erro é exibida
  await expect(page.getByText(/e-mail ou senha inválidos/i)).toBeVisible();

  // Verifica que continua na página de login
  await expect(page).toHaveURL(/.*\/login/);
});
