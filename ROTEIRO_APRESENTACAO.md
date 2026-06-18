# Roteiro de Apresentação — Saúde na Mão
**TCC — Análise e Desenvolvimento de Sistemas**
**Tempo total estimado: 20 minutos**

---

## ANTES DE COMEÇAR — CHECKLIST

- [ ] Docker Desktop rodando (todos os containers `Up`)
- [ ] `http://localhost:5173` abrindo no browser (ou porta 5173)
- [ ] `http://localhost:3000` abrindo (Grafana)
- [ ] Aba com `Usuarios_Senhas.md` aberta no lado
- [ ] Fechar notificações do Windows
- [ ] Tela em modo apresentação / zoom do browser em 110-125%

---

## PARTE 1 — INTRODUÇÃO (2 minutos)

> **Falar:**

"Bom dia/Boa tarde. Meu projeto de TCC se chama **Saúde na Mão**, um sistema web de agendamento de consultas médicas voltado para municípios de pequeno porte."

"O problema que motivou o desenvolvimento é simples mas real: muitos municípios ainda gerenciam a fila de saúde pública de forma manual — cadernos de papel, ligações telefônicas, planilhas. Isso gera filas, esquecimento de consultas, perda de horários e dificulta a gestão da unidade de saúde."

"A proposta é digitalizar esse processo com uma aplicação web acessível, com três perfis de acesso diferentes: o paciente, o recepcionista e o administrador do sistema."

---

## PARTE 2 — VISÃO GERAL TÉCNICA (2 minutos)

> **Falar:**

"Antes de mostrar o sistema funcionando, deixa eu apresentar brevemente a arquitetura que foi construída."

> **Mostrar (slide mental ou whiteboard, ou falar de cabeça):**

```
FRONTEND          BACKEND           BANCO
React 19        →  Express.js    →  MySQL 8
TypeScript         TypeScript       Sequelize ORM
Tailwind CSS       JWT Auth
Vite               Docker

MONITORAMENTO
Grafana + Loki + Promtail
(logs do backend em tempo real)

TESTES
K6 — Smoke, Load, Stress e Spike Tests
```

"A aplicação roda completamente em Docker. O backend expõe uma API REST com autenticação JWT, e o frontend é uma SPA em React com gerenciamento de estado via React Query e Zustand."

---

## PARTE 3 — DEMO AO VIVO (14 minutos)

> **Ordem:** Admin → Recepcionista → Paciente

---

### 3.1 — PERFIL ADMINISTRADOR (4 min)

> **Abrir:** `http://localhost:5173` → login com `admin@saude.com` / `Admin@123456`

**Falar enquanto navega:**

**Dashboard Admin:**
"Aqui o administrador tem uma visão geral de tudo: total de usuários, profissionais, especialidades e agendamentos. Esses dados são carregados em tempo real da API."

**Especialidades → CRUD:**
"O admin gerencia as especialidades médicas atendidas. Vou criar uma nova especialidade aqui..."
> *(criar uma especialidade — ex: "Neurologia")*
"...perceba que a ação é confirmada com um feedback visual imediato — sem reload de página, tudo em tempo real com React Query."

**Profissionais → CRUD:**
"Cadastro de profissionais. O sistema também permite excluir — reparem que o botão de deletar pede confirmação antes de executar."

**Agendas — PONTO DIFERENCIAL:**
"Este é um dos pontos mais interessantes do sistema. Quando o administrador cria uma agenda para um profissional — por exemplo, Segunda-feira, das 08h às 12h, com consultas de 30 minutos — o sistema **calcula e cria automaticamente os horários disponíveis**."
> *(criar uma agenda — ex: profissional 1, Segunda, 08:00–10:00, 30 min)*
"Veja: já apareceu a prévia — **4 horários serão criados automaticamente**. Ao salvar, o sistema gera esses 4 slots no banco de dados com status 'Disponível', prontos para agendamento. Sem precisar criar um por um."

**Unidades:**
"Gerenciamento das unidades de saúde — o sistema é multi-unidade."

---

### 3.2 — PERFIL RECEPCIONISTA (4 min)

> **Fazer logout → login com** `recep@teste.com` / `Recep@123456`

**Dashboard Recepcionista:**
"A recepcionista tem um dashboard próprio com os dados relevantes para ela: total de agendamentos do dia, pacientes cadastrados e indicadores de status."

**Pacientes:**
"A recepcionista pode cadastrar novos pacientes. Vou cadastrar um agora..."
> *(criar um paciente com CPF de teste — pode usar CPF gerado, ex: Nome: João Teste, CPF qualquer)*
"O cadastro cria o usuário no sistema e vincula automaticamente ao perfil de paciente."

**Agendamentos — Agendar para um paciente:**
"Aqui a recepcionista vê todos os agendamentos e pode agendar em nome de qualquer paciente — diferente do paciente, que só agenda para si mesmo."
> *(mostrar a lista de agendamentos com filtro de status)*
"Ela também pode cancelar agendamentos com registro do motivo. Quando um agendamento é cancelado, o horário volta automaticamente para 'Disponível' — garantindo que outro paciente possa ocupar aquele slot."

---

### 3.3 — PERFIL PACIENTE (4 min)

> **Fazer logout → login com** `joao@teste.com` / `Paciente@123`

**Dashboard Paciente:**
"O paciente tem a visão mais simples e direta: os cards mostram quantas consultas ele tem agendadas, realizadas, canceladas e faltas. Logo abaixo aparece a próxima consulta e o histórico recente."

**Novo Agendamento — FLUXO PRINCIPAL:**
"Este é o fluxo principal para o paciente: agendar uma consulta. O sistema usa um wizard de 4 etapas para guiar o usuário."

> *(clicar em "Nova Consulta" ou "Novo Agendamento")*

"**Passo 1 — Especialidade:** O paciente escolhe o tipo de consulta que precisa. Note que só aparecem especialidades que têm profissionais cadastrados com horários disponíveis — se não tem agenda, não aparece."

> *(selecionar Clínica Geral, por exemplo)*

"**Passo 2 — Profissional:** Só aparecem os médicos daquela especialidade que têm horários disponíveis. Se o médico não tem agenda, ele não aparece na lista."

> *(selecionar Dr. Carlos Silva)*

"**Passo 3 — Data e Horário:** O sistema mostra apenas os horários com status 'Disponível'. Horários já agendados não aparecem."

> *(selecionar um horário disponível)*

"**Passo 4 — Confirmação:** Resumo completo antes de confirmar. O paciente confirma e o agendamento é criado — o horário muda para 'Agendado' instantaneamente."

**Meus Agendamentos:**
"Aqui o paciente vê todos os seus agendamentos com filtro por status. Pode cancelar um agendamento ativo."

---

## PARTE 4 — ASPECTOS TÉCNICOS (3 minutos)

### 4.1 — Monitoramento com Grafana

> **Abrir:** `http://localhost:3000` (login: `admin` / `admin`)

**Falar:**
"Para monitoramento da aplicação em produção, integrei o Grafana com Loki e Promtail. O Promtail coleta automaticamente os logs do container do backend e envia para o Loki. Aqui no Grafana temos um dashboard com:"
- "Contagem de erros — logs com nível ERROR"
- "Contagem de warnings"
- "Volume total de logs"
- "E o painel principal com todos os logs em tempo real — posso filtrar por nível, buscar por texto"

> *(fazer uma requisição na API enquanto o Grafana está aberto para mostrar o log aparecendo)*

"Isso seria fundamental para um ambiente de produção — detectar erros rapidamente sem precisar acessar o servidor."

---

### 4.2 — Testes de Carga com K6

> **Falar (não precisa rodar na apresentação):**

"Para garantir que o sistema aguenta carga real, implementei testes de performance com o K6. Foram criados 6 cenários:"

| Tipo | VUs | Duração |
|------|-----|---------|
| Smoke | 5 | 1 minuto |
| Load | 50 | 5 minutos |
| Stress | 100 | 10 minutos |
| Spike | 0 → 200 | 30 segundos |

"Os resultados dos smoke tests que executei antes da apresentação mostram:"
- "p95 de latência: **~170ms** — abaixo do threshold de 1000ms"
- "Taxa de erro: **0%**"
- "O sistema respondeu corretamente sob carga simulada."

"Os relatórios são gerados em HTML e JSON automaticamente após cada execução."

---

## PARTE 5 — CONCLUSÃO (2 minutos)

> **Falar:**

"O **Saúde na Mão** entrega uma solução completa para digitalização de agendamentos de saúde com:"

- **3 perfis de acesso** com permissões bem definidas
- **Fluxo completo** de agendamento (criação → confirmação → cancelamento → liberação do horário)
- **Geração automática de horários** a partir da grade da agenda
- **Monitoramento em tempo real** com Grafana e Loki
- **Testes de carga** documentados com K6
- **Arquitetura containerizada** com Docker — fácil de implantar em qualquer servidor

"Como melhorias futuras, o sistema poderia incluir: notificações por e-mail ou SMS de lembrete de consulta, relatórios gerenciais por unidade e período, e integração com sistemas municipais de saúde existentes."

"Obrigado. Fico à disposição para perguntas."

---

## PERGUNTAS FREQUENTES — RESPOSTAS PRONTAS

**"Por que React e não outro framework?"**
> "React tem o maior ecossistema para SPAs, é amplamente usado no mercado e se integra bem com TypeScript. O React Query simplificou muito o gerenciamento de dados assíncronos."

**"Como funciona a autenticação?"**
> "JWT (JSON Web Token). O usuário faz login, recebe um token assinado com validade de 1 dia. Esse token é enviado no header Authorization em todas as requisições protegidas. O middleware valida e extrai o perfil do usuário."

**"O banco vai perder dados se o container cair?"**
> "Não. O volume do MySQL está mapeado para o sistema de arquivos do host. Os dados persistem fora do container."

**"Por que MySQL e não PostgreSQL?"**
> "Familiaridade com MySQL no ambiente de ensino, e o Sequelize suporta ambos sem mudança de código — seria uma troca simples se necessário."

**"Como garantiu que não quebraria os agendamentos já existentes ao refatorar as agendas?"**
> "A coluna `vagas_disponiveis` foi mantida no banco — não deletada. O controller passou a calculá-la e preenchê-la automaticamente. Os registros existentes não foram tocados. Zero risco de perda de dados."

**"Quais foram os maiores desafios?"**
> "A sincronização entre os três perfis usando React Query — garantir que quando a recepcionista cancela um agendamento, o horário some imediatamente da lista de disponíveis do paciente. Resolvi com `invalidateQueries` encadeado nos hooks de mutação."

---

## CREDENCIAIS (PARA USAR DURANTE A DEMO)

| Perfil | Email | Senha |
|--------|-------|-------|
| ADMIN | admin@saude.com | Admin@123456 |
| RECEPCIONISTA | recep@teste.com | Recep@123456 |
| PACIENTE | joao@teste.com | Paciente@123 |
