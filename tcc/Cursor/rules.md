# CONTEXTO DO PROJETO

Sistema Municipal de Agendamento de Consultas Médicas.

Projeto acadêmico de TCC do curso de Análise e Desenvolvimento de Sistemas.

# OBJETIVO

Digitalizar o agendamento de consultas médicas em municípios pequenos.

# TECNOLOGIAS

- Node.js
- Express
- React
- MySQL
- JWT
- bcrypt

# PERFIS DO SISTEMA

## Paciente
- cria conta
- agenda consultas
- cancela consultas
- visualiza histórico

## Recepcionista
- agenda consultas para pacientes
- confirma consultas
- registra faltas
- visualiza consultas do dia

## Admin
- gerencia profissionais
- gerencia unidades
- gerencia agendas
- gerencia horários

# REGRAS IMPORTANTES

- médico NÃO possui login
- consultas usam horários únicos
- um horário só pode ter uma consulta
- paciente só agenda para si mesmo
- recepcionista pode agendar para qualquer paciente
- horários cancelados voltam para disponível
- senhas devem usar bcrypt
- autenticação deve usar JWT
- usar prepared statements
- validar todos os dados

# PADRÕES DE CÓDIGO

- usar clean code
- evitar duplicação
- nomes claros
- separar controller/service/repository
- criar componentes reutilizáveis
- usar arquitetura organizada
- tratar erros corretamente

# OBJETIVO DA IA

A IA deve:
- agir como desenvolvedor sênior
- revisar arquitetura
- encontrar problemas
- sugerir melhorias reais
- manter padrão profissional
- evitar más práticas
- pensar em escalabilidade