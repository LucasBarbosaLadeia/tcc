# VISAO GERAL DO SISTEMA

API REST para agendamento de consultas medicas, com CRUD por recursos e controllers dedicados em Backend/src/app.ts e Backend/src/controllers.
Persistencia relacional em MySQL via Sequelize em Backend/src/Config/database.ts.
Execucao em containers com backend, MySQL e Nginx em Docker-compose.yml.

# OBJETIVO DO PROJETO

Gerenciar o fluxo de agendamento em unidades de saude, com selecao de especialidade, horario e confirmacao de consulta, conforme descrito em Backend/README.md.

# TECNOLOGIAS IDENTIFICADAS

Node.js, TypeScript, Express, Sequelize, MySQL, Swagger UI, Jest, Supertest, Docker, Nginx.

# ESTRUTURA DO PROJETO

Camadas por recurso: routes, controllers e models em Backend/src.
Inicializacao e Swagger em Backend/src/index.ts.

# ARQUITETURA IDENTIFICADA

Monolito em camadas MVC-like.

[MEDIA CONFIANCA] Inferencia baseada em:
- separacao explicita em routes, controllers e models
- controllers por recurso e modelos ORM por entidade

# MODULOS PRINCIPAIS

Usuarios: Backend/src/controllers/usuarioController.ts e Backend/src/models/usuarioModel.ts.
Pacientes: Backend/src/controllers/pacienteController.ts e Backend/src/models/pacienteModel.ts.
Profissionais: Backend/src/controllers/profissionalController.ts e Backend/src/models/profissionalModel.ts.
Unidades e especialidades: Backend/src/controllers/unidadeController.ts e Backend/src/controllers/especialidadeController.ts.
Agendas e horarios: Backend/src/controllers/agendaController.ts e Backend/src/controllers/horarioController.ts.
Agendamentos: Backend/src/controllers/agendamentoController.ts.

# REGRAS DE NEGOCIO EXPLICITAS

CPF unico para usuario, paciente e profissional.
[ALTA CONFIANCA] Evidencias:
- validacao de CPF duplicado nos controllers
- restricao unique nos models

Agendamento exige horario disponivel e futuro.
[ALTA CONFIANCA] Evidencias:
- checagem de status Disponivel e data futura no agendamentoController

Cancelamento exige motivo e libera o horario.
[ALTA CONFIANCA] Evidencias:
- validacao de motivo e update de horario no agendamentoController

Horarios listados sao apenas futuros e disponiveis.
[ALTA CONFIANCA] Evidencias:
- filtro por status e data no horarioController

# REGRAS DE NEGOCIO INFERIDAS

Um usuario possui no maximo um paciente vinculado.
[ALTA CONFIANCA] Inferencia baseada em:
- constraint unique em id_usuario no model de paciente

Codigo de agendamento deve ser unico e legivel.
[ALTA CONFIANCA] Inferencia baseada em:
- geracao automatica de codigo e tentativa de colisao
- unique no model de agendamento

Agendamento usa horario como unidade de disponibilidade.
[MEDIA CONFIANCA] Inferencia baseada em:
- FK de horario no agendamento
- update do status do horario apos criar agendamento

# FLUXOS PRINCIPAIS

Criar agendamento: valida paciente e horario, cria agendamento e marca horario indisponivel.
Cancelar agendamento: valida motivo, atualiza status e libera horario.
Consultar disponibilidade: filtra apenas horarios futuros e disponiveis.

# BOAS PRATICAS IDENTIFICADAS

Separacao clara de camadas por recurso.
Validacoes de entrada e respostas HTTP consistentes.
Swagger UI embutido.
Testes com Jest e Supertest.

# PROBLEMAS E RISCOS TECNICOS

[CRITICO]
Senhas sem hashing.

[ALTO]
Race condition entre criar agendamento e atualizar horario.

[ALTO]
Uso de sequelize.sync e rotina de drop de FK em runtime.

[MEDIO]
Duplicacao de bootstrap do app e variavel port.

[MEDIO]
Credenciais de banco fixas no compose.

# INCONSISTENCIAS ENCONTRADAS

Regra do README sobre "uma consulta por especialidade em unidade especifica" nao tem validacao implementada.
origem calculada mas nao persistida no agendamento.
Enum de dia da semana em portugues vs teste com valor em ingles.

# DIVIDAS TECNICAS

Sincronizacao automatica de modelos com o banco em runtime.
Bootstrap duplicado da aplicacao e variaveis repetidas.
Ausencia de transacoes em operacoes criticas de agendamento.

# SUGESTOES DE MELHORIA

Implementar hashing de senha, autenticar por perfil e expor fluxo de reset.
Migrar para migrations e remover rotina de drop de FK.
Unificar o bootstrap do servidor usando apenas app.ts.
Adicionar transacoes no fluxo de agendamento.
Implementar e testar a regra de uma consulta por especialidade e unidade.

# PROPOSTA DE DIAGRAMAS C4

Contexto:
Paciente -> Sistema de Agendamento
Recepcionista -> Sistema de Agendamento
Administrador -> Sistema de Agendamento
Sistema de Agendamento -> MySQL

Containers:
Nginx -> Backend (Node/Express)
Backend (Node/Express) -> MySQL

Componentes:
Routes -> Controllers -> Models
AgendamentoController -> Agendamento Model
AgendamentoController -> Horario Model
HorarioController -> Horario Model
UsuarioController -> Usuario Model

Codigo:
Agendamento (FK id_horario) -> Horario
Paciente (FK id_usuario unico) -> Usuario
Profissional -> Especialidade
Profissional -> Unidade

# METRICAS

Controllers encontrados: 8
Models encontrados: 7
Rotas analisadas: 34
Modulos principais: 7
Testes automatizados: presentes (Jest/Supertest)
Entidades principais: 7

# CONCLUSAO TECNICA

Backend monolitico com separacao por camadas e regras de disponibilidade implementadas, mas com riscos relevantes de seguranca, consistencia e aderencia a regras declaradas.
Recomendado evoluir com autenticacao, migrations, transacoes e alinhamento entre README, modelos e testes.
