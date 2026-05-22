# Controllers - Resumo de rotas e regras de negócio

Este documento descreve os controllers implementados no backend, suas rotas, campos obrigatórios e regras importantes.

- **Usuários** (`/api/usuarios`)
  - POST `/` : criar usuário
    - campos obrigatórios: `nome`, `email`, `cpf`, `senha`, `perfil` (`paciente|recepcionista|admin`)
    - validações: `cpf` único
  - GET `/` : listar todos
  - GET `/:id` : buscar por ID
  - PUT `/:id` : atualizar usuário
    - pode alterar `nome`, `email`, `cpf`, `senha`, `perfil`, `ativo`
    - validação: `cpf` não pode duplicar outro usuário
  - DELETE `/:id` : remover usuário

- **Pacientes** (`/api/pacientes`)
  - POST `/` : criar paciente
    - campos obrigatórios: `id_usuario`, `cpf`, `nome_completo`, `data_nascimento`, `sexo` (`M|F|Outro`)
    - outros campos: `telefone`, `cep`, `logradouro`, `numero`, `bairro`, `cidade`, `estado`
    - validação: `cpf` único
  - GET `/` : listar
  - GET `/:id` : buscar
  - PUT `/:id` : atualizar (mesmas validações do create)
  - DELETE `/:id` : remover

- **Profissionais** (`/api/profissionais`)
  - POST `/` : criar profissional
    - campos obrigatórios: `cpf`, `registro_profissional`, `tipo_registro` (`CRM|COREN|CRP`), `nome_completo`, `id_especialidade`, `id_unidade`, `telefone`
    - validação: `cpf` único
  - GET `/` : listar
  - GET `/:id` : buscar
  - PUT `/:id` : atualizar
  - DELETE `/:id` : remover

- **Unidades** (`/api/unidades`)
  - POST `/` : criar unidade
    - campos obrigatórios: `nome`, `tipo` (`UBS|UPA|Posto|CAPS`), `telefone`, `logradouro`, `numero`, `bairro`
  - GET `/` : listar
  - GET `/:id` : buscar
  - PUT `/:id` : atualizar (`ativo` pode ser alterado)
  - DELETE `/:id` : remover

- **Especialidades** (`/api/especialidades`)
  - POST `/` : criar especialidade
    - campo obrigatório: `nome_especialidade` (único)
  - GET `/` : listar
  - GET `/:id` : buscar
  - PUT `/:id` : atualizar (valida duplicidade)
  - DELETE `/:id` : remover

- **Agendas** (`/api/agendas`)
  - POST `/` : criar agenda
    - campos obrigatórios: `id_profissional`, `id_unidade`, `dia_semana`, `horario_inicio`, `horario_fim`, `duracao_consulta`, `vagas_disponiveis`
    - campo `ativo` padrão `true`
  - GET `/` : listar
  - GET `/:id` : buscar
  - PUT `/:id` : atualizar
  - DELETE `/:id` : remover

- **Horários** (`/api/datas`)
  - POST `/` : criar horário
    - campos obrigatórios: `id_agenda`, `data_hora_inicio`, `data_hora_fim`
    - `status` padrão: `Disponível`
  - GET `/` : listar
  - GET `/:id` : buscar
  - PUT `/:id` : atualizar (alterar datas/status)
  - DELETE `/:id` : remover

- **Agendamentos** (`/api/agendamentos`)
  - POST `/` : criar agendamento
    - campos obrigatórios: `id_paciente`, `id_horario`
    - `codigo_agendamento` é gerado automaticamente se não for informado
    - `status` padrão: `Agendado`
  - GET `/` : listar
  - GET `/:id` : buscar
  - PUT `/:id` : atualizar
    - regra: se `status` for `Cancelado`, `motivo_cancelamento` torna-se obrigatório
  - DELETE `/:id` : remover

Recomendações rápidas:
- As rotas retornam JSON com erro em `error` e detalhes em `details` quando aplicável.
- Validações adicionais (autenticação/autorização, verificação de disponibilidade de horário, checagem de conflito de agendamento) devem ser implementadas nas camadas de serviço ou middlewares quando necessário.
