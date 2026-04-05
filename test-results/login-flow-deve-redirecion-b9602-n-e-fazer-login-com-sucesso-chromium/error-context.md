# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login-flow.spec.ts >> deve redirecionar para /login e fazer login com sucesso
- Location: e2e\login-flow.spec.ts:6:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*\/dashboard/
Received string:  "http://localhost:3000/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:3000/login"

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
        - alert [ref=e17]:
          - generic [ref=e20]: E-mail ou senha inválidos
        - generic [ref=e21]:
          - generic [ref=e22]: E-mail
          - textbox "E-mail" [ref=e23]:
            - /placeholder: seu@email.com
            - text: test@example.com
        - generic [ref=e24]:
          - generic [ref=e25]: Senha
          - generic [ref=e26]:
            - textbox "Sua senha" [ref=e27]: Test@123456
            - img [ref=e28]
            - generic: Enter a password
        - button "Entrar" [ref=e30] [cursor=pointer]:
          - generic [ref=e31]: Entrar
        - generic [ref=e32]:
          - link "Criar conta" [ref=e33] [cursor=pointer]:
            - /url: /register
          - link "Esqueci minha senha" [ref=e34] [cursor=pointer]:
            - /url: /forgot-password
  - generic:
    - img
  - generic [ref=e35]:
    - button "Toggle Nuxt DevTools" [ref=e36] [cursor=pointer]:
      - img [ref=e37]
    - generic "Page load time" [ref=e40]:
      - generic [ref=e41]: "2.6"
      - generic [ref=e42]: s
    - button "Toggle Component Inspector" [ref=e44] [cursor=pointer]:
      - img [ref=e45]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const TEST_EMAIL = process.env.TEST_USER_EMAIL || "test@example.com";
  4  | const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "Test@123456";
  5  | 
  6  | test("deve redirecionar para /login e fazer login com sucesso", async ({
  7  |   page,
  8  | }) => {
  9  |   // Acessa a página inicial
  10 |   await page.goto("/");
  11 | 
  12 |   // Verifica que foi redirecionado para /login
  13 |   await expect(page).toHaveURL(/.*\/login/);
  14 |   await expect(page).toHaveTitle(/Login.*Orça Fácil/);
  15 | 
  16 |   // Preenche o formulário de login
  17 |   await page.getByRole("textbox", { name: /e-mail/i }).fill(TEST_EMAIL);
  18 |   await page.getByRole("textbox", { name: /senha/i }).fill(TEST_PASSWORD);
  19 | 
  20 |   // Clica no botão de entrar
  21 |   await page.getByRole("button", { name: /entrar/i }).click();
  22 | 
  23 |   // Verifica que foi redirecionado para /dashboard
> 24 |   await expect(page).toHaveURL(/.*\/dashboard/);
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  25 |   await expect(page).toHaveTitle(/Dashboard.*Orça Fácil/);
  26 | 
  27 |   // Verifica que o e-mail do usuário está exibido
  28 |   await expect(page.getByText(/olá,/i)).toBeVisible();
  29 |   await expect(page.getByText(TEST_EMAIL)).toBeVisible();
  30 | });
  31 | 
```