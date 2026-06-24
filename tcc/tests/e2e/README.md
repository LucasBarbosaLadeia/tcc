# Testes E2E — Saúde na Mão

Testes end-to-end com **Playwright** cobrindo os principais fluxos do sistema.

---

## Pré-requisitos

1. **Docker rodando** com todos os serviços ativos:

```bash
docker compose ps
# frontend, backend e mysql devem estar "running"
```

2. **Playwright instalado** (primeira vez apenas):

```bash
npm install
npx playwright install chromium
```

3. **Arquivo `.env.e2e`** configurado na raiz do projeto:

```bash
cp .env.e2e.example .env.e2e
# Edite com as credenciais corretas se necessário
```

---

## Como rodar os testes

### Modo padrão (headless, saída no terminal)
```bash
npm run test:e2e
```

### Modo visual (abre UI interativa do Playwright)
```bash
npm run test:e2e:ui
```

### Modo headed (abre navegador visível)
```bash
npm run test:e2e:headed
```

### Ver relatório HTML após execução
```bash
npm run test:e2e:report
```

### Rodar apenas uma suite específica
```bash
npx playwright test tests/e2e/auth/login.spec.ts
npx playwright test tests/e2e/recepcionista/
```

---

## Serviços necessários

| Serviço | URL | Descrição |
|---|---|---|
| Frontend (Vite dev server) | http://localhost:5173 | Onde os testes rodam |
| Backend API | http://localhost:8080 | Chamado pelo frontend |
| MySQL | localhost:3306 | Banco de dados |

---

## Variáveis de ambiente

Copie `.env.e2e.example` para `.env.e2e` e preencha:

| Variável | Descrição |
|---|---|
| `E2E_BASE_URL` | URL do frontend (padrão: `http://localhost:8081`) |
| `E2E_ADMIN_EMAIL` | Email do usuário ADMIN |
| `E2E_ADMIN_PASSWORD` | Senha do usuário ADMIN |
| `E2E_RECEP_EMAIL` | Email da RECEPCIONISTA |
| `E2E_RECEP_PASSWORD` | Senha da RECEPCIONISTA |
| `E2E_PACIENTE_EMAIL` | Email do PACIENTE |
| `E2E_PACIENTE_PASSWORD` | Senha do PACIENTE |

> **Atenção:** Nunca commite o `.env.e2e` com senhas reais. Adicione-o ao `.gitignore`.

---

## Fluxos testados

| Suite | Arquivo | O que testa |
|---|---|---|
| Login | `auth/login.spec.ts` | Credenciais válidas/inválidas, redirect por perfil, normalização de email |
| Proteção de rotas | `auth/route-protection.spec.ts` | Sem login redireciona; PACIENTE/RECEP não acessam admin |
| Admin | `admin/dashboard.spec.ts` | Painel, listar usuários, criar usuário, bloquear email inválido |
| Recepcionista | `recepcionista/pacientes.spec.ts` | Listar pacientes, ficha do paciente, criar paciente, email inválido, modal de agendamento |
| Paciente | `paciente/agendamentos.spec.ts` | Dashboard, agendamentos, modal de detalhes, filtro, proteção de rota |

---

## O que fazer se um teste falhar

1. **Screenshot automático** salvo em `test-results/` — abra para ver o estado da tela
2. **Vídeo** salvo quando há falha — útil para reproduzir o problema
3. **Ver relatório HTML**:
   ```bash
   npm run test:e2e:report
   ```
4. **Modo headed** para depurar interativamente:
   ```bash
   npx playwright test --headed --debug tests/e2e/auth/login.spec.ts
   ```
5. Verifique se o Docker está rodando e os serviços respondem:
   ```bash
   curl http://localhost:5173
   curl http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d "{}"
   ```

---

## Dados de teste

- **Pacientes criados** pelos testes usam email `e2e_TIMESTAMP@teste.com` e CPF gerado automaticamente
- Os dados criados **permanecem no banco** após os testes (sem limpeza automática)
- Para limpar: acesse http://localhost:8081 como ADMIN e remova os usuários com prefixo `E2E`
