import { test, expect } from '@playwright/test';
import { loginAs, clearSession } from '../helpers/auth';
import { generateValidCPF, generateTestEmail } from '../helpers/data';

test.describe('Fluxo RECEPCIONISTA — Pacientes', () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
    await loginAs(page, 'recepcionista');
    await page.goto('/recepcionista/pacientes');
  });

  test('página de pacientes carrega a tabela', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('text=Nome').first()).toBeVisible();
  });

  test('busca filtra lista de pacientes', async ({ page }) => {
    await page.fill('input[placeholder*="nome ou CPF"]', 'Joao');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 8_000 });
  });

  test('click no nome abre ficha do paciente', async ({ page }) => {
    const firstPatient = page.locator('button.text-teal-600').first();
    await firstPatient.waitFor({ timeout: 10_000 });
    const nome = await firstPatient.textContent();
    await firstPatient.click();
    await expect(page.locator('text=Faltas registradas')).toBeVisible({ timeout: 5_000 });
    await page.click('button:has-text("Fechar")');
  });

  test('bloqueia cadastro com email inválido', async ({ page }) => {
    await page.click('button:has-text("Novo Paciente")');

    await page.fill('input[placeholder="Nome completo *"]', 'Teste E2E Email');
    await page.fill('input[placeholder="E-mail *"]', 'emailinvalido');
    await page.fill('input[placeholder="CPF *"]', generateValidCPF());
    await page.fill('input[placeholder="Senha *"]', 'Teste@123');

    const dateInput = page.locator('input[type=date]');
    await dateInput.fill('2000-01-15');
    await page.click('button:has-text("Cadastrar")');

    await expect(
      page.getByText('Informe um e-mail válido.').or(page.locator('[role=status]').filter({ hasText: /e-mail válido/i })).first()
    ).toBeVisible({ timeout: 8_000 });
  });

  test('cadastra paciente de teste com dados válidos', async ({ page }) => {
    await page.click('button:has-text("Novo Paciente")');

    const email = generateTestEmail();
    const cpf = generateValidCPF();
    const nome = `E2E Paciente ${Date.now()}`;

    await page.fill('input[placeholder="Nome completo *"]', nome);
    await page.fill('input[placeholder="E-mail *"]', email);
    await page.fill('input[placeholder="CPF *"]', cpf);
    await page.fill('input[placeholder="Senha *"]', 'E2ePaciente@123');

    const dateInput = page.locator('input[type=date]');
    await dateInput.fill('2000-06-15');

    await page.click('button:has-text("Cadastrar")');

    await expect(
      page.locator('[role=alert]').filter({ hasText: /sucesso/i })
        .or(page.locator(`text=${nome}`))
    ).toBeVisible({ timeout: 10_000 });
  });

  test('painel de agendamentos carrega', async ({ page }) => {
    await page.goto('/recepcionista/agendamentos');
    await expect(page.locator('text=Agendamentos').first()).toBeVisible();
    await expect(page.locator('text=Código').or(page.locator('th:has-text("CÓDIGO")'))).toBeVisible({ timeout: 10_000 });
  });

  test('código de agendamento abre modal de detalhes', async ({ page }) => {
    await page.goto('/recepcionista/agendamentos');
    const codeBtn = page.locator('button.font-mono.text-teal-600').first();
    await codeBtn.waitFor({ timeout: 10_000 });
    await codeBtn.click();
    await expect(page.locator('text=Detalhes do Agendamento')).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('text=Médico(a)')).toBeVisible();
    await page.click('button:has-text("Fechar")');
  });
});
