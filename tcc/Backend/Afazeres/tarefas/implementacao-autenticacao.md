# Implementacao de autenticacao

Este documento descreve o mapeamento das rotas e o plano de implementacao da autenticacao e autorizacao por perfil para a regra de negocio atualizada. Nenhum codigo de aplicacao deve ser alterado antes da aprovacao.

## Regra de negocio consolidada

- `POST /api/auth/login` permanece publico.
- Nao existe auto cadastro de paciente.
- `POST /api/pacientes` exige autenticao e perfil `RECEPCIONISTA` ou `ADMIN`.
- `POST /api/usuarios` exige autenticao e perfil `ADMIN`.
- `PACIENTE` nunca pode criar usuarios ou pacientes.
- `PACIENTE` so pode visualizar e alterar seus proprios dados.
- `PACIENTE` so pode visualizar, criar e cancelar seus proprios agendamentos.
- `RECEPCIONISTA` pode cadastrar pacientes e gerenciar agendamentos.
- `ADMIN` possui acesso total.

## Rotas publicas

| Rota | Metodo | Arquivo | Autenticacao atual | Autorizacao atual | Perfil que deve acessar |
| --- | --- | --- | --- | --- | --- |
| `/` | GET | `Backend/src/app.ts` | Nao | Nao | Publica, apenas informativa |
| `/api` | GET | `Backend/src/app.ts` | Nao | Nao | Publica, apenas informativa |
| `/health` | GET | `Backend/src/app.ts` | Nao | Nao | Publica, apenas monitoramento |
| `/api-docs` | GET | `Backend/src/app.ts` | Nao | Nao | Publica, documentacao |
| `/api/auth/login` | POST | `Backend/src/routes/authRoutes.ts` | Nao | Nao | Publica para login |

## Rotas de paciente

| Rota | Metodo | Arquivo | Autenticacao atual | Autorizacao atual | Perfil que deve acessar |
| --- | --- | --- | --- | --- | --- |
| `/api/pacientes` | POST | `Backend/src/routes/pacienteRoutes.ts` | Nao | Nao | `RECEPCIONISTA` e `ADMIN` |
| `/api/pacientes` | GET | `Backend/src/routes/pacienteRoutes.ts` | Sim | Sim | `RECEPCIONISTA`, `ADMIN` e `PACIENTE` apenas para visualizar o proprio cadastro |
| `/api/pacientes/:id` | GET | `Backend/src/routes/pacienteRoutes.ts` | Sim | Sim | `RECEPCIONISTA`, `ADMIN` e `PACIENTE` apenas para visualizar o proprio cadastro |
| `/api/pacientes/:id` | PUT | `Backend/src/routes/pacienteRoutes.ts` | Sim | Sim | `RECEPCIONISTA`, `ADMIN` e `PACIENTE` apenas para alterar os proprios dados |
| `/api/pacientes/:id` | DELETE | `Backend/src/routes/pacienteRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/agendamentos` | POST | `Backend/src/routes/agendamentoRoutes.ts` | Sim | Sim | `PACIENTE`, `RECEPCIONISTA` e `ADMIN` |
| `/api/agendamentos` | GET | `Backend/src/routes/agendamentoRoutes.ts` | Sim | Sim | `PACIENTE` apenas os proprios agendamentos; `RECEPCIONISTA` e `ADMIN` com visao total |
| `/api/agendamentos/:id` | GET | `Backend/src/routes/agendamentoRoutes.ts` | Sim | Sim | `PACIENTE` apenas o proprio agendamento; `RECEPCIONISTA` e `ADMIN` |
| `/api/agendamentos/:id` | PUT | `Backend/src/routes/agendamentoRoutes.ts` | Sim | Sim | `RECEPCIONISTA` e `ADMIN`; `PACIENTE` apenas para cancelar o proprio agendamento, se a regra operacional permitir |
| `/api/agendamentos/:id` | DELETE | `Backend/src/routes/agendamentoRoutes.ts` | Sim | Sim | `ADMIN` e, se previsto no fluxo, cancelamento equivalente para `PACIENTE` no proprio agendamento |

## Rotas de recepcionista

| Rota | Metodo | Arquivo | Autenticacao atual | Autorizacao atual | Perfil que deve acessar |
| --- | --- | --- | --- | --- | --- |
| `/api/pacientes` | POST | `Backend/src/routes/pacienteRoutes.ts` | Nao | Nao | `RECEPCIONISTA` e `ADMIN` |
| `/api/agendamentos` | POST | `Backend/src/routes/agendamentoRoutes.ts` | Sim | Sim | `RECEPCIONISTA` e `ADMIN` para agendar no balcao |
| `/api/agendamentos` | GET | `Backend/src/routes/agendamentoRoutes.ts` | Sim | Sim | `RECEPCIONISTA` e `ADMIN` |
| `/api/agendamentos/:id` | GET | `Backend/src/routes/agendamentoRoutes.ts` | Sim | Sim | `RECEPCIONISTA` e `ADMIN` |
| `/api/agendamentos/:id` | PUT | `Backend/src/routes/agendamentoRoutes.ts` | Sim | Sim | `RECEPCIONISTA` e `ADMIN` |
| `/api/agendamentos/:id` | DELETE | `Backend/src/routes/agendamentoRoutes.ts` | Sim | Sim | `ADMIN` ou operacao equivalente de cancelamento para `RECEPCIONISTA`, se validado pela regra final |

## Rotas de admin

| Rota | Metodo | Arquivo | Autenticacao atual | Autorizacao atual | Perfil que deve acessar |
| --- | --- | --- | --- | --- | --- |
| `/api/usuarios` | POST | `Backend/src/routes/usuarioRoutes.ts` | Nao | Nao | `ADMIN` |
| `/api/usuarios` | GET | `Backend/src/routes/usuarioRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/usuarios/:id` | GET | `Backend/src/routes/usuarioRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/usuarios/:id` | PUT | `Backend/src/routes/usuarioRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/usuarios/:id` | DELETE | `Backend/src/routes/usuarioRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/agendas` | POST | `Backend/src/routes/agendaRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/agendas` | GET | `Backend/src/routes/agendaRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/agendas/:id` | GET | `Backend/src/routes/agendaRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/agendas/:id` | PUT | `Backend/src/routes/agendaRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/agendas/:id` | DELETE | `Backend/src/routes/agendaRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/datas` | POST | `Backend/src/routes/horarioRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/datas` | GET | `Backend/src/routes/horarioRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/datas/:id` | GET | `Backend/src/routes/horarioRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/datas/:id` | PUT | `Backend/src/routes/horarioRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/datas/:id` | DELETE | `Backend/src/routes/horarioRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/especialidades` | POST | `Backend/src/routes/especialidadeRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/especialidades` | GET | `Backend/src/routes/especialidadeRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/especialidades/:id` | GET | `Backend/src/routes/especialidadeRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/especialidades/:id` | PUT | `Backend/src/routes/especialidadeRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/especialidades/:id` | DELETE | `Backend/src/routes/especialidadeRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/profissionais` | POST | `Backend/src/routes/profissionalRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/profissionais` | GET | `Backend/src/routes/profissionalRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/profissionais/:id` | GET | `Backend/src/routes/profissionalRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/profissionais/:id` | PUT | `Backend/src/routes/profissionalRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/profissionais/:id` | DELETE | `Backend/src/routes/profissionalRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/unidades` | POST | `Backend/src/routes/unidadeRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/unidades` | GET | `Backend/src/routes/unidadeRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/unidades/:id` | GET | `Backend/src/routes/unidadeRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/unidades/:id` | PUT | `Backend/src/routes/unidadeRoutes.ts` | Sim | Sim | `ADMIN` |
| `/api/unidades/:id` | DELETE | `Backend/src/routes/unidadeRoutes.ts` | Sim | Sim | `ADMIN` |

## Middleware necessários

- `authMiddleware` para validar `Authorization: Bearer <token>`.
- `authorize(...)` para restringir por perfil.
- Ajuste de contrato do `req.user` para carregar `id_usuario`, `perfil` e, quando aplicavel, `id_paciente`.
- Regra de ownership nos controllers de paciente e agendamento para garantir acesso apenas ao proprio registro quando o usuario for `PACIENTE`.

## Arquivos que serao criados

- `Backend/docs/tarefas/implementacao-autenticacao.md`

## Arquivos que serao modificados

- `Backend/src/middlewares/auth.ts`
- `Backend/src/middlewares/authorize.ts`
- `Backend/src/routes/authRoutes.ts`
- `Backend/src/routes/usuarioRoutes.ts`
- `Backend/src/routes/pacienteRoutes.ts`
- `Backend/src/routes/agendamentoRoutes.ts`
- `Backend/src/routes/agendaRoutes.ts`
- `Backend/src/routes/horarioRoutes.ts`
- `Backend/src/routes/especialidadeRoutes.ts`
- `Backend/src/routes/profissionalRoutes.ts`
- `Backend/src/routes/unidadeRoutes.ts`
- `Backend/src/controllers/usuarioController.ts`
- `Backend/src/controllers/pacienteController.ts`
- `Backend/src/controllers/agendamentoController.ts`
- `Backend/src/types/express/index.d.ts`

## Riscos da implementacao

- Rotas hoje expostas podem passar a bloquear consumidores atuais se a regra de acesso for aplicada sem transicao.
- O fluxo de paciente depende de alinhar `id_usuario`, `id_paciente` e o payload do JWT.
- Paciente precisa de validacao de ownership em leitura e alteracao de dados, ou pode enxergar registros de terceiros.
- Agendamento precisa separar criacao, consulta e cancelamento do proprio paciente das operacoes de recepcionista e admin.
- Ha risco de divergencia entre Swagger e comportamento real se as anotacoes nao forem atualizadas junto com a protecao das rotas.