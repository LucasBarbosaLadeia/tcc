import { test, expect } from '@playwright/test';
import { loginAs, clearSession } from '../helpers/auth';
import { testUsers } from '../helpers/data';

test.beforeEach(async ({ page }) => {
  await clearSession(page);
});

test.describe('Login — credenciais inválidas', () => {
  test('exibe erro com email e senha errados', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#identificador', 'naoexiste@email.com');
    await page.fill('#senha', 'SenhaErrada123');
    await page.click('button[type=submit]');
    await expect(page.locator('[role=status]').filter({ hasText: /credenciais/i }).or(page.locator('text=Credenciais').first())).toBeVisible({ timeout: 8_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('bloqueia submit com campos vazios', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type=submit]');
    // Permanecer na tela de login (schema Zod exige campos)
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Login — redirecionamento por perfil', () => {
  test('ADMIN é redirecionado para /admin', async ({ page }) => {
    test.skip(!testUsers.admin.password, 'E2E_ADMIN_PASSWORD não configurado');
    await loginAs(page, 'admin');
    await expect(page).toHaveURL(/\/admin\//);
  });

  test('RECEPCIONISTA é redirecionada para /recepcionista', async ({ page }) => {
    await loginAs(page, 'recepcionista');
    await expect(page).toHaveURL(/\/recepcionista\//);
  });

  test('PACIENTE é redirecionado para /paciente', async ({ page }) => {
    await loginAs(page, 'paciente');
    await expect(page).toHaveURL(/\/paciente\//);
  });
});

test.describe('Login — normalização de email', () => {
  test('campo aceita apenas lowercase (sem espaços)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#identificador', '  RECEP@TESTE.COM  ');
    const value = await page.inputValue('#identificador');
    expect(value).toBe('recep@teste.com');
  });
});
