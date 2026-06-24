import { Page, expect } from '@playwright/test';
import { testUsers } from './data';

type Role = keyof typeof testUsers;

const roleBase: Record<Role, string> = {
  admin: '/admin',
  recepcionista: '/recepcionista',
  paciente: '/paciente',
};

export async function loginAs(page: Page, role: Role): Promise<void> {
  const { email, password } = testUsers[role];
  await page.goto('/login');
  await page.fill('#identificador', email);
  await page.fill('#senha', password);
  await page.click('button[type=submit]');
  await page.waitForURL(`**${roleBase[role]}/**`, { timeout: 15_000 });
}

export async function clearSession(page: Page): Promise<void> {
  // localStorage só é acessível quando a página está em uma origem HTTP real
  if (!page.url().startsWith('http')) {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
  }
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
