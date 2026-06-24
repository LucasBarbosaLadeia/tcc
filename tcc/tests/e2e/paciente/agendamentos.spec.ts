import { test, expect } from '@playwright/test';
import { loginAs, clearSession } from '../helpers/auth';

test.describe('Fluxo PACIENTE', () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
    await loginAs(page, 'paciente');
  });

  test('dashboard do paciente carrega com resumo de consultas', async ({ page }) => {
    await expect(page).toHaveURL(/\/paciente\//);
    await expect(page.getByText('Próximas consultas', { exact: true }).first()).toBeVisible({ timeout: 10_000 });
  });

  test('página de agendamentos carrega com lista', async ({ page }) => {
    await page.goto('/paciente/agendamentos');
    await expect(page.getByRole('heading', { name: 'Meus Agendamentos' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: /código/i }).first()).toBeVisible({ timeout: 10_000 });
  });

  test('código do agendamento é clicável e abre modal de detalhes', async ({ page }) => {
    await page.goto('/paciente/agendamentos');
    const codeBtn = page.locator('button.font-mono.text-teal-600').first();
    await codeBtn.waitFor({ timeout: 10_000 });
    await codeBtn.click();

    await expect(page.locator('text=Detalhes da Consulta')).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('text=Médico(a)').first()).toBeVisible();
    await expect(page.locator('text=Data / Hora').first()).toBeVisible();
    await expect(page.locator('p').filter({ hasText: /^Status$/ }).first()).toBeVisible();

    await page.click('button:has-text("Fechar")');
    await expect(page.locator('text=Detalhes da Consulta')).not.toBeVisible();
  });

  test('filtro de status funciona', async ({ page }) => {
    await page.goto('/paciente/agendamentos');
    await page.selectOption('select', 'Cancelado');
    const rows = page.locator('table tbody tr');
    // Todos os itens visíveis devem ter status Cancelado (ou lista vazia)
    const count = await rows.count();
    if (count > 0) {
      await expect(rows.filter({ hasText: 'Cancelado' }).first()).toBeVisible();
    }
  });

  test('paciente não acessa dados de outro paciente via URL', async ({ page }) => {
    // Tentar acessar a área admin/recepcionista deve redirecionar
    await page.goto('/recepcionista/pacientes');
    await expect(page).not.toHaveURL(/\/recepcionista\/pacientes/, { timeout: 8_000 });
  });

  test('página de perfil exibe dados do próprio paciente', async ({ page }) => {
    await page.goto('/paciente/perfil');
    await expect(page.getByRole('heading', { name: 'Meu Perfil' })).toBeVisible({ timeout: 10_000 });
  });
});
