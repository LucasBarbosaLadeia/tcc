# Projeto TCC - Sistema de Agendamento de Consultas Médicas

## Descrição do Projeto

Este projeto é um sistema de agendamento de consultas médicas desenvolvido como Trabalho de Conclusão de Curso (TCC). Permite que usuários agendem consultas em unidades de saúde específicas, escolhendo especialidades médicas e datas disponíveis.

### Funcionalidade Principal

A funcionalidade principal é o agendamento de consultas. Usuários podem:
- Visualizar unidades de saúde disponíveis
- Selecionar especialidades médicas
- Ver datas e horários disponíveis
- Agendar uma consulta

*Regra de Negócio Principal:*
- Um usuário pode agendar apenas uma consulta por especialidade em uma unidade específica.
- Datas e horários devem estar disponíveis (não conflitantes).
- O sistema valida a disponibilidade antes de confirmar o agendamento.
- Datas e horários não podem 

## Stack de Desenvolvimento

- *Backend:* Node.js com TypeScript
- *Framework Web:* Express.js
- *Banco de Dados:* MySQL
- *ORM:* Sequelize
- *Containerização:* Docker e Docker Compose
- *Servidor Web:* Nginx (para proxy reverso)
- *Outros:* CORS para requisições cross-origin, dotenv para variáveis de ambiente

### Ferramentas Utilizadas

- *Node.js:* Plataforma de execução JavaScript no servidor.
- *TypeScript:* Superset de JavaScript que adiciona tipagem estática, melhorando a manutenção e prevenindo erros.
- *Express.js:* Framework minimalista para construção de APIs RESTful.
- *Sequelize:* ORM para interação com o banco de dados MySQL, facilitando operações CRUD.
- *MySQL:* Sistema de gerenciamento de banco de dados relacional.
- *Docker:* Para containerização da aplicação, garantindo consistência entre ambientes.
- *Nginx:* Servidor web usado como proxy reverso para rotear requisições.
- *ts-node-dev:* Ferramenta para desenvolvimento com hot-reload em TypeScript.

## Arquitetura Utilizada

A arquitetura adotada é Monolitica

### Motivo da Escolha da Arquitetura

como é planejado implementar o projeto em apenas um municipio inicial foi decidido o formato mnolitico para o melhor desempenho

## Fluxo da Funcionalidade Principal



1. O usuário inicia acessando a aplicação.
2. clica em nova consulta
3. vê as especialidades disponiveis.
4. escolhe uma especialidade.
5. Navega pelas unidades de saúde disponíveis.
6. Seleciona uma unidade e visualiza os horários disponíveis.
7. Escolhe uma data e hora.
8. Confirma o agendamento.
9. O sistema valida se o horário ainda está disponível.
10. Se disponível, salva no banco de dados e confirma; caso contrário, exibe erro.

## Como Executar o Projeto

1. Certifique-se de ter Docker e Docker Compose instalados.
2. Clone o repositório.
3. Configure as variáveis de ambiente no arquivo .env.
4. Execute docker-compose up na raiz do projeto.

## Estrutura do Projeto


/
├── Backend/
│   ├── src/
│   │   ├── Config/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── Nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── Docker-compose.yml
└── README.md


## Próximos Passos

- Implementar autenticação de usuários
- Adicionar mais rotas para todas as entidades
- Desenvolver frontend
- Adicionar testes automatizados