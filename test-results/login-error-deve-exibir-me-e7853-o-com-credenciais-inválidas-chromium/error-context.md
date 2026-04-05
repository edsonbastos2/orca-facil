# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login-error.spec.ts >> deve exibir mensagem de erro com credenciais inválidas
- Location: e2e\login-error.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/e-mail ou senha inválidos/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/e-mail ou senha inválidos/i)
    2 × waiting for" http://localhost:3000/login?" navigation to finish...
      - navigated to "http://localhost:3000/login"
    - waiting for" http://localhost:3000/login?" navigation to finish...
    - navigated to "http://localhost:3000/login?"

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
      - generic [ref=e37]: "117"
      - generic [ref=e38]: ms
    - button "Toggle Component Inspector" [ref=e40] [cursor=pointer]:
      - img [ref=e41]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("deve exibir mensagem de erro com credenciais inválidas", async ({
  4  |   page,
  5  | }) => {
  6  |   // Acessa a página de login
  7  |   await page.goto("/login");
  8  | 
  9  |   // Preenche o formulário com credenciais inválidas
  10 |   await page
  11 |     .getByRole("textbox", { name: /e-mail/i })
  12 |     .fill("invalido@example.com");
  13 |   await page.getByRole("textbox", { name: /senha/i }).fill("senha-errada");
  14 | 
  15 |   // Clica no botão de entrar
  16 |   await page.getByRole("button", { name: /entrar/i }).click();
  17 | 
  18 |   // Verifica que a mensagem de erro é exibida
> 19 |   await expect(page.getByText(/e-mail ou senha inválidos/i)).toBeVisible();
     |                                                              ^ Error: expect(locator).toBeVisible() failed
  20 | 
  21 |   // Verifica que continua na página de login
  22 |   await expect(page).toHaveURL(/.*\/login/);
  23 | });
  24 | 
```