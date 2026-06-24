import { test, expect } from '@playwright/test';
import { loginAs, clearSession } from '../helpers/auth';
import { testUsers } from '../helpers/data';

test.describe('Proteção de rotas — usuário não autenticado', () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
  });

  test('acesso a /recepcionista redireciona para /login', async ({ page }) => {
    await page.goto('/recepcionista/pacientes');
    await expect(page).toHaveURL(/\/login/, { timeout: 8_000 });
  });

  test('acesso a /admin redireciona para /login', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 8_000 });
  });

  test('acesso a /paciente redireciona para /login', async ({ page }) => {
    await page.goto('/paciente/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 8_000 });
  });
});

test.describe('Proteção de rotas — PACIENTE não acessa áreas restritas', () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
    await loginAs(page, 'paciente');
  });

  test('PACIENTE não acessa /admin', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).not.toHaveURL(/\/admin\/dashboard/, { timeout: 8_000 });
  });

  test('PACIENTE não acessa /recepcionista', async ({ page }) => {
    await page.goto('/recepcionista/pacientes');
    await expect(page).not.toHaveURL(/\/recepcionista\/pacientes/, { timeout: 8_000 });
  });
});

test.describe('Proteção de rotas — RECEPCIONISTA não acessa /admin', () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
    await loginAs(page, 'recepcionista');
  });

  test('RECEPCIONISTA não acessa /admin', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).not.toHaveURL(/\/admin\/dashboard/, { timeout: 8_000 });
  });
});

test.describe('Proteção de rotas — ADMIN acessa áreas permitidas', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!testUsers.admin.password, 'E2E_ADMIN_PASSWORD não configurado');
    await clearSession(page);
    await loginAs(page, 'admin');
  });

  test('ADMIN acessa /admin/dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\//);
  });

  test('ADMIN acessa /admin/usuarios', async ({ page }) => {
    await page.goto('/admin/usuarios');
    await expect(page).toHaveURL(/\/admin\/usuarios/);
    await expect(page.locator('text=Usuários').first()).toBeVisible();
  });
});
