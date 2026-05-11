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

A arquitetura adotada é Monolitica adaptada para APIs RESTful

### Estrutura das Camadas

- *Models:* Representam as entidades do banco de dados (Agendamento, Usuario, Unidade, etc.). Usam Sequelize para mapeamento objeto-relacional.
- *Controllers:* Contêm a lógica de negócio. Processam requisições, validam dados e interagem com os models.
- *Routes:* Definem os endpoints da API e roteiam as requisições para os controllers apropriados.

### Motivo da Escolha da Arquitetura

A arquitetura MVC foi escolhida porque:
- *Separação de Preocupações:* Cada camada tem responsabilidades bem definidas, facilitando manutenção e testes.
- *Escalabilidade:* Permite adicionar novas funcionalidades sem afetar outras partes do código.
- *Reutilização:* Controllers e models podem ser reutilizados em diferentes rotas.
- *Manutenibilidade:* Mudanças em uma camada não impactam diretamente as outras.
- *Adequada para APIs:* Embora originalmente para aplicações web, se adapta bem a APIs REST, onde "View" é substituída pela resposta JSON.

## Fluxo da Funcionalidade Principal

O diagrama abaixo ilustra o fluxo de agendamento de uma consulta:

mermaid
flowchart TD
    A[Usuário acessa aplicação] --> B[Visualizar unidades disponíveis]
    B --> C[Selecionar unidade]
    C --> D[Visualizar especialidades da unidade]
    D --> E[Selecionar especialidade]
    E --> F[Visualizar datas/horários disponíveis]
    F --> G[Selecionar data/hora]
    G --> H[Confirmar agendamento]
    H --> I{Validar disponibilidade}
    I -->|Disponível| J[Salvar agendamento no DB]
    I -->|Indisponível| K[Exibir erro]
    J --> L[Retornar confirmação]
    K --> M[Voltar para seleção]


### Explicação do Fluxo

1. O usuário inicia acessando a aplicação.
2. Navega pelas unidades de saúde disponíveis.
3. Escolhe uma unidade e vê as especialidades oferecidas.
4. Seleciona uma especialidade e visualiza os horários disponíveis.
5. Escolhe uma data e hora.
6. Confirma o agendamento.
7. O sistema valida se o horário ainda está disponível.
8. Se disponível, salva no banco de dados e confirma; caso contrário, exibe erro.

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