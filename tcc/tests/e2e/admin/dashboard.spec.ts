import { test, expect } from '@playwright/test';
import { loginAs, clearSession } from '../helpers/auth';
import { testUsers, generateValidCPF, generateTestEmail } from '../helpers/data';

test.describe('Fluxo ADMIN', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!testUsers.admin.password, 'E2E_ADMIN_PASSWORD não configurado');
    await clearSession(page);
    await loginAs(page, 'admin');
  });

  test('painel admin carrega com sidebar completa', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\//);
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });

  test('página de usuários lista registros', async ({ page }) => {
    await page.goto('/admin/usuarios');
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 });
  });

  test('página de profissionais carrega', async ({ page }) => {
    await page.goto('/admin/profissionais');
    await expect(page).toHaveURL(/\/admin\/profissionais/);
  });

  test('página de especialidades carrega', async ({ page }) => {
    await page.goto('/admin/especialidades');
    await expect(page).toHaveURL(/\/admin\/especialidades/);
  });

  test('cria usuário de teste e verifica na lista', async ({ page }) => {
    await page.goto('/admin/usuarios');

    // Abre modal de criação
    await page.click('button:has-text("Novo Usuário")');
    await expect(page.locator('text=Novo Usuário').nth(1).or(page.locator('[role=dialog]'))).toBeVisible();

    const email = generateTestEmail();
    const cpf = generateValidCPF();

    await page.fill('input[placeholder="Nome completo *"]', `E2E Teste ${Date.now()}`);
    await page.fill('input[placeholder="E-mail *"]', email);
    await page.fill('input[placeholder="CPF *"]', cpf);
    await page.fill('input[placeholder="Senha *"]', 'Teste@E2E123');

    await page.click('button:has-text("Criar")');

    // Sucesso: toast ou usuário aparece na tabela
    await expect(
      page.locator('text=criado com sucesso').or(page.locator(`text=${email}`)).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('bloqueia criação de usuário com email inválido', async ({ page }) => {
    await page.goto('/admin/usuarios');
    await page.click('button:has-text("Novo Usuário")');

    await page.fill('input[placeholder="Nome completo *"]', 'Teste E2E');
    await page.fill('input[placeholder="E-mail *"]', 'email-invalido');
    await page.fill('input[placeholder="CPF *"]', generateValidCPF());
    await page.fill('input[placeholder="Senha *"]', 'Teste@123');
    await page.click('button:has-text("Criar")');

    await expect(
      page.getByText('Informe um e-mail válido.').or(page.locator('[role=status]').filter({ hasText: /e-mail válido/i })).first()
    ).toBeVisible({ timeout: 8_000 });
  });
});
