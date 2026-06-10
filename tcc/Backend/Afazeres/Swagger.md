OBJETIVO

Refatorar completamente a implementação atual do Swagger para um padrão profissional, modular e de fácil manutenção.

CONTEXTO

O projeto utiliza:

- Node.js
- Express
- TypeScript
- Sequelize
- JWT Authentication

Atualmente existe uma implementação de Swagger incorreta, onde toda a documentação está sendo declarada manualmente dentro de um grande objeto `swaggerSpec` no arquivo principal da aplicação (`app.ts`).

Essa abordagem NÃO deve ser utilizada.

TAREFA

1. Remover toda a implementação atual do Swagger:
   - Remover o objeto gigante `swaggerSpec`.
   - Remover todos os endpoints declarados manualmente dentro de `paths`.
   - Remover qualquer código Swagger que esteja misturado ao `app.ts`.

2. Criar uma estrutura organizada:

src/
├── config/
│ └── swagger.ts
├── routes/
│ ├── usuarioRoutes.ts
│ ├── pacienteRoutes.ts
│ ├── profissionalRoutes.ts
│ ├── agendamentoRoutes.ts
│ └── ...
└── app.ts

3. Instalar e configurar:
   - swagger-jsdoc
   - swagger-ui-express
   - @types/swagger-ui-express

4. Criar um arquivo `src/config/swagger.ts` responsável apenas pela configuração do Swagger.

5. Utilizar Swagger OpenAPI 3.0.

6. Configurar o Swagger para ler automaticamente documentação presente nos arquivos de rota usando:

apis: ["./src/routes/*.ts"]

7. No `app.ts` manter apenas a configuração:

```ts
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

8. Adicionar documentação JSDoc Swagger diretamente nas rotas.

EXEMPLO OBRIGATÓRIO

```ts
/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
 *       - Usuários
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", UsuarioController.listar);
```

9. Criar a seção `components.schemas` para reutilização futura dos modelos.

Exemplo:

```ts
components: {
  schemas: {
    Usuario: {
      type: "object",
      properties: {
        id_usuario: {
          type: "integer"
        },
        nome: {
          type: "string"
        },
        email: {
          type: "string"
        }
      }
    }
  }
}
```

10. Configurar autenticação JWT no Swagger:

```ts
components: {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT"
    }
  }
}
```

11. Aplicar o esquema bearerAuth nas rotas protegidas.

RESULTADO ESPERADO

- Nenhum endpoint documentado manualmente dentro de um objeto gigante.
- Swagger modular.
- Swagger gerado automaticamente pelos comentários das rotas.
- Código limpo e organizado.
- Estrutura adequada para crescimento do projeto TCC.
- Manter compatibilidade com Express + TypeScript + Sequelize.
- Corrigir quaisquer erros de sintaxe existentes durante a refatoração.
- Mostrar todos os arquivos criados ou alterados e explicar cada mudança realizada.
