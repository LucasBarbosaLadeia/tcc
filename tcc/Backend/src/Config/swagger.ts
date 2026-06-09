import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Agendamento de Consultas Medicas",
      version: "1.0.0",
      description: "Documentacao da API do projeto TCC.",
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || "/",
        description: "Servidor base da API",
      },
    ],
    components: {
      schemas: {
        Usuario: {
          type: "object",
          properties: {
            id_usuario: { type: "integer" },
            nome: { type: "string" },
            email: { type: "string" },
            cpf: { type: "string" },
            perfil: { type: "string" },
            ativo: { type: "boolean" },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
