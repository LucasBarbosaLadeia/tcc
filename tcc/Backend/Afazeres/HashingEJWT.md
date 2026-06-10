# Implementacao de Autenticacao JWT + Controle de Permissao por Perfil

## Contexto do Projeto

O sistema e uma API REST para agendamento medico desenvolvida com:

- Node.js
- Express
- Sequelize
- MySQL
- TypeScript

O sistema possui tres perfis de acesso:

- `PACIENTE`
- `RECEPCIONISTA`
- `ADMIN`

Cada perfil deve possuir permissoes diferentes no sistema.

Objetivo:
Implementar autenticacao segura utilizando:

- Hashing de senha com bcryptjs
- JWT para autenticacao
- Middleware de autorizacao por perfil (RBAC)
- Protecao de rotas
- Remocao de senha das respostas

---

# Regras de Permissao

## PACIENTE

Pode:

- Fazer login
- Visualizar o proprio perfil
- Atualizar os proprios dados
- Criar consultas/agendamentos
- Visualizar apenas seus proprios agendamentos

Nao pode:

- Listar usuarios
- Gerenciar usuarios
- Acessar dados de outros pacientes
- Excluir registros administrativos
- Criar funcionarios

---

## RECEPCIONISTA

Pode:

- Fazer login
- Gerenciar agendamentos
- Visualizar pacientes
- Criar pacientes
- Atualizar dados de pacientes
- Visualizar medicos e especialidades

Nao pode:

- Excluir administradores
- Alterar configuracoes criticas
- Gerenciar permissoes
- Acessar funcionalidades exclusivas do admin

---

## ADMIN

Possui acesso total:

- CRUD completo de usuarios
- Gerenciamento de perfis
- Exclusao de registros
- Acesso administrativo completo
- Gerenciamento geral do sistema

---

# Objetivos Tecnicos

Implementar:

- Hashing de senha
- Login JWT
- Middleware JWT
- Middleware de autorizacao por perfil
- Rotas protegidas
- Remocao de senha das respostas
- Estrutura profissional e escalavel

---

# Estrutura Esperada

```txt
src/
 ├── controllers/
 │    ├── authController.ts
 │    ├── usuarioController.ts
 │    └── agendamentoController.ts
 │
 ├── middlewares/
 │    ├── auth.ts
 │    └── authorize.ts
 │
 ├── routes/
 │    ├── authRoutes.ts
 │    ├── usuarioRoutes.ts
 │    └── agendamentoRoutes.ts
 │
 ├── services/
 │    ├── authService.ts
 │    └── usuarioService.ts
 │
 ├── utils/
 │    └── password.ts
 │
 ├── types/
 │    └── express/
 │         └── index.d.ts
 │
 ├── models/
 │    └── Usuario.ts
 │
 └── app.ts
```

---

# Passo a Passo

## 1) Instalar Dependencias

Instalar:

```bash
npm install bcryptjs jsonwebtoken
```

Instalar tipos:

```bash
npm install -D @types/bcryptjs @types/jsonwebtoken
```

---

## 2) Configurar Variaveis de Ambiente

Atualizar `.env`:

```env
JWT_SECRET=uma_chave_super_forte
JWT_EXPIRES_IN=1d
```

Garantir que:

- Docker
- docker-compose
- ambiente local

estejam lendo corretamente as variaveis.

---

## 3) Criar Utilitario de Senha

Criar:

```txt
src/utils/password.ts
```

Implementar:

- `hashPassword()`
- `comparePassword()`

Regras:

- usar bcryptjs
- salt rounds = 10

---

## 4) Ajustar Model de Usuario

Garantir campos:

```ts
perfil: ENUM("PACIENTE", "RECEPCIONISTA", "ADMIN");
```

Garantir:

- senha obrigatoria
- senha nunca retornada em responses

---

## 5) Ajustar Criacao de Usuario

Arquivo:

```txt
src/controllers/usuarioController.ts
```

Regras:

- gerar hash antes de salvar
- nunca salvar senha pura
- remover senha da resposta

Exemplo:

```ts
const { senha, ...usuarioSemSenha } = usuario.toJSON();
```

---

## 6) Ajustar Update de Usuario

Regras:

- so gerar hash se senha vier no body
- evitar rehash desnecessario
- impedir paciente alterar perfil

---

## 7) Criar Service de Autenticacao

Criar:

```txt
src/services/authService.ts
```

Responsabilidades:

- validar login
- comparar senha
- gerar JWT
- retornar usuario sem senha

Arquitetura esperada:

```txt
Controller -> Service -> Model
```

---

## 8) Criar Controller de Auth

Criar:

```txt
src/controllers/authController.ts
```

Endpoint:

```http
POST /api/auth/login
```

Login deve aceitar:

- cpf
  ou
- email

Fluxo:

1. Buscar usuario
2. Validar senha
3. Gerar JWT
4. Retornar token + usuario

Payload JWT:

```ts
{
  (id_usuario, perfil);
}
```

Nao incluir:

- senha
- cpf completo
- dados sensiveis

---

## 9) Criar Rotas de Auth

Criar:

```txt
src/routes/authRoutes.ts
```

Registrar no `app.ts`.

---

## 10) Criar Middleware JWT

Criar:

```txt
src/middlewares/auth.ts
```

Responsabilidades:

- ler Authorization Bearer Token
- validar JWT
- anexar payload em req.user
- retornar 401 se token invalido

---

## 11) Criar Middleware de Autorizacao

Criar:

```txt
src/middlewares/authorize.ts
```

Objetivo:
Controlar acesso por perfil.

Exemplo esperado:

```ts
authorize("ADMIN");
authorize("ADMIN", "RECEPCIONISTA");
```

Fluxo:

- verificar req.user.perfil
- permitir apenas perfis autorizados
- retornar 403 quando nao autorizado

---

# Regras de Protecao

## Exemplo de Rotas

### Apenas ADMIN

```ts
router.delete(
  "/usuarios/:id",
  authMiddleware,
  authorize("ADMIN"),
  deleteUsuario,
);
```

---

### ADMIN e RECEPCIONISTA

```ts
router.get(
  "/pacientes",
  authMiddleware,
  authorize("ADMIN", "RECEPCIONISTA"),
  listarPacientes,
);
```

---

### PACIENTE autenticado

```ts
router.get("/me", authMiddleware, getMeuPerfil);
```

---

# Regra Importante

PACIENTE:

- nunca pode acessar dados de outros usuarios
- nunca pode listar usuarios
- nunca pode alterar permissao/perfil

Mesmo autenticado, deve acessar apenas seus proprios dados.

---

# Tipagem do Request

Criar:

```txt
src/types/express/index.d.ts
```

Adicionar:

```ts
declare namespace Express {
  export interface Request {
    user?: {
      id_usuario: number;
      perfil: string;
    };
  }
}
```

---

# Boas Praticas Obrigatorias

- Nunca retornar senha
- Nunca salvar senha sem hash
- JWT com expiracao
- Mensagens de erro genericas no login
- Validar token em rotas privadas
- Middleware separado
- Services separados dos controllers
- Nao duplicar logica
- Seguir padrao REST

---

# Melhorias Futuras

Implementar futuramente:

- Refresh Token
- Rate Limit no login
- Blacklist de token
- Logs de auditoria
- Permissoes mais detalhadas
- Recuperacao de senha

---

# Checklist Final

- [ ] bcrypt implementado
- [ ] JWT funcionando
- [ ] Login funcionando
- [x] Middleware JWT funcionando
- [x] Middleware de autorizacao funcionando
- [x] Perfis implementados
- [ ] Rotas protegidas
- [x] Senha removida das responses
- [x] Services implementados
- [x] Tipagem do req.user criada
- [ ] Documentacao atualizada
- [ ] Testes atualizados
