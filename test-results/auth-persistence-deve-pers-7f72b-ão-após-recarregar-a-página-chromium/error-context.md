# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-persistence.spec.ts >> deve persistir a sessão após recarregar a página
- Location: e2e\auth-persistence.spec.ts:6:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*\/dashboard/
Received string:  "http://localhost:3000/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    2 × waiting for" http://localhost:3000/login?" navigation to finish...
      - navigated to "http://localhost:3000/login"
    - waiting for" http://localhost:3000/login?" navigation to finish...
    - navigated to "http://localhost:3000/login?"
    2 × unexpected value "http://localhost:3000/login?"
    5 × unexpected value "http://localhost:3000/login"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e6]:
      - heading "Orça Fácil" [level=1] [ref=e7]
      - paragraph [ref=e8]: Crie e gerencie seus orçamentos de forma rápida e profissional.
    - generic [ref=e12]:
      - generic [ref=e13]:
        - heading "Bem-vindo de volta" [level=2] [ref=e14]
        - paragraph [ref=e15]: Entre com suas credenciais para acessar sua conta.
      - generic [ref=e16]:
        - generic [ref=e17]:
          - generic [ref=e18]: E-mail
          - textbox "E-mail" [ref=e19]:
            - /placeholder: seu@email.com
        - generic [ref=e20]:
          - generic [ref=e21]: Senha
          - generic [ref=e22]:
            - textbox "Sua senha" [ref=e23]
            - img [ref=e24]
            - generic: Enter a password
        - button "Entrar" [ref=e26] [cursor=pointer]:
          - generic [ref=e27]: Entrar
        - generic [ref=e28]:
          - link "Criar conta" [ref=e29] [cursor=pointer]:
            - /url: /register
          - link "Esqueci minha senha" [ref=e30] [cursor=pointer]:
            - /url: /forgot-password
  - generic:
    - img
  - generic [ref=e31]:
    - button "Toggle Nuxt DevTools" [ref=e32] [cursor=pointer]:
      - img [ref=e33]
    - generic "Page load time" [ref=e36]:
      - generic [ref=e37]: "105"
      - generic [ref=e38]: ms
    - button "Toggle Component Inspector" [ref=e40] [cursor=pointer]:
      - img [ref=e41]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const TEST_EMAIL = process.env.TEST_USER_EMAIL || "test@example.com";
  4  | const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "Test@123456";
  5  | 
  6  | test("deve persistir a sessão após recarregar a página", async ({ page }) => {
  7  |   // Acessa a página de login
  8  |   await page.goto("/login");
  9  | 
  10 |   // Preenche o formulário de login com credenciais válidas
  11 |   await page.getByRole("textbox", { name: /e-mail/i }).fill(TEST_EMAIL);
  12 |   await page.getByRole("textbox", { name: /senha/i }).fill(TEST_PASSWORD);
  13 | 
  14 |   // Clica no botão de entrar
  15 |   await page.getByRole("button", { name: /entrar/i }).click();
  16 | 
  17 |   // Aguarda o redirecionamento para /dashboard
> 18 |   await expect(page).toHaveURL(/.*\/dashboard/);
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  19 | 
  20 |   // Recarrega a página
  21 |   await page.reload();
  22 | 
  23 |   // Verifica que continua no dashboard (sessão persistiu)
  24 |   await expect(page).toHaveURL(/.*\/dashboard/);
  25 |   await expect(page.getByText(/olá,/i)).toBeVisible();
  26 |   await expect(page.getByText(TEST_EMAIL)).toBeVisible();
  27 | });
  28 | 
```