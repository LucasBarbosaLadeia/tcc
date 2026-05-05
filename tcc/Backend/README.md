# Backend - Rotas da API

Base path: `/api`

Endpoints por recurso (métodos HTTP, caminho, corpo de requisição):

- **Endereços**
  - GET `/api/enderecos` — listar todos
  - GET `/api/enderecos/:id` — obter por id
  - POST `/api/enderecos` — criar
    - body exemplo: `{ "logradouro": "Rua A", "numero": "123", "bairro": "Centro", "cidade": "Cidade", "uf": "SP" }`
  - PUT `/api/enderecos/:id` — atualizar
  - DELETE `/api/enderecos/:id` — deletar

- **Usuários**
  - GET `/api/usuarios` — listar todos
  - GET `/api/usuarios/:id` — obter por id
  - POST `/api/usuarios` — criar
    - body exemplo: `{ "nome": "Fulano", "cpf": "00000000000", "senha": "senha123", "id_endereco": 1 }`
  - PUT `/api/usuarios/:id` — atualizar
  - DELETE `/api/usuarios/:id` — deletar

- **Agendamentos**
  - GET `/api/agendamentos` — listar todos
  - GET `/api/agendamentos/:id` — obter por id
  - POST `/api/agendamentos` — criar
    - body exemplo: `{ "id_unidade": 1, "id_especialidade": 2, "id_data": 3, "id_usuario": 4 }`
  - PUT `/api/agendamentos/:id` — atualizar
  - DELETE `/api/agendamentos/:id` — deletar

- **Datas (horários)**
  - GET `/api/datas` — listar todos
  - GET `/api/datas/:id` — obter por id
  - POST `/api/datas` — criar
    - body exemplo: `{ "horario": "2026-05-03T14:30:00.000Z" }`
  - PUT `/api/datas/:id` — atualizar
  - DELETE `/api/datas/:id` — deletar

- **Especialidades**
  - GET `/api/especialidades` — listar todos
  - GET `/api/especialidades/:id` — obter por id
  - POST `/api/especialidades` — criar
    - body exemplo: `{ "nome": "Cardiologia" }`
  - PUT `/api/especialidades/:id` — atualizar
  - DELETE `/api/especialidades/:id` — deletar

- **Unidades**
  - GET `/api/unidades` — listar todos
  - GET `/api/unidades/:id` — obter por id
  - POST `/api/unidades` — criar
    - body exemplo: `{ "id_endereco": 1, "nome": "Unidade Central" }`
  - PUT `/api/unidades/:id` — atualizar
  - DELETE `/api/unidades/:id` — deletar

Observações
- Os exemplos de body estão em JSON; ajuste campos conforme validações dos controllers.
- As rotas usam prefixos conforme registrado em `src/index.ts`.
- Autenticação/Autorização não foi adicionada — se necessário, podemos incluir middleware.

Como testar localmente

1. Subir containers / rodar o backend (ex.: `docker compose up -d --build` ou `npm run dev` no diretório Backend)
2. Usar Postman / curl para testar os endpoints acima usando `http://localhost:3001` (ou a porta configurada)
