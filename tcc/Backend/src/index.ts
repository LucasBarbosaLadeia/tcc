import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import sequelize from "./Config/database";
import path from "path";

// Importar models e suas relações
import "./models/profissionalModel";
import "./models/usuarioModel";
import "./models/agendamentoModel";
import "./models/horarioModel";
import "./models/especialidadeModel";
import "./models/unidadeModel";

// Importar rotas
import usuarioRoutes from "./routes/usuarioRoutes";
import agendamentoRoutes from "./routes/agendamentoRoutes";
import dataRoutes from "./routes/horarioRoutes";
import especialidadeRoutes from "./routes/especialidadeRoutes";
import unidadeRoutes from "./routes/unidadeRoutes";
import pacienteRoutes from "./routes/pacienteRoutes";
import agendaRoutes from "./routes/agendaRoutes";
import profissionalRoutes from "./routes/profissionalRoutes";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Sistema de Agendamento de Consultas Médicas",
    version: "1.0.0",
    description: "Documentação da API do projeto TCC.",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Servidor local do backend",
    },
  ],
  paths: {
    "/api/usuarios": {
      get: {
        summary: "Lista todos os usuários",
        tags: ["Usuários"],
        responses: {
          200: { description: "Lista retornada com sucesso" },
        },
      },
      post: {
        summary: "Cria um usuário",
        tags: ["Usuários"],
        responses: {
          201: { description: "Usuário criado" },
        },
      },
    },
    "/api/agendamentos": {
      get: {
        summary: "Lista todos os agendamentos",
        tags: ["Agendamentos"],
        responses: {
          200: { description: "Lista retornada com sucesso" },
        },
      },
      post: {
        summary: "Cria um agendamento",
        tags: ["Agendamentos"],
        responses: {
          201: { description: "Agendamento criado" },
        },
      },
    },
    "/api/especialidades": {
      get: {
        summary: "Lista especialidades",
        tags: ["Especialidades"],
        responses: {
          200: { description: "Lista retornada com sucesso" },
        },
      },
    },
    "/api/unidades": {
      get: {
        summary: "Lista unidades",
        tags: ["Unidades"],
        responses: {
          200: { description: "Lista retornada com sucesso" },
        },
      },
    },
  },
};

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001; // pegar da env quando disponível

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

// Usar rotas da API (cada recurso em seu prefixo)
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/agendamentos", agendamentoRoutes);
app.use("/api/datas", dataRoutes);
app.use("/api/especialidades", especialidadeRoutes);
app.use("/api/unidades", unidadeRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/agendas", agendaRoutes);
app.use("/api/profissionais", profissionalRoutes);

// Testar conexão com banco de dados com retry/backoff
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const testDatabase = async (retries = 10, delayMs = 3000): Promise<void> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      attempt++;
      await sequelize.authenticate();
      console.log("Banco de dados conectado com sucesso!");

      // Limpar constraints com nomes duplicados que podem causar ER_FK_DUP_NAME
      try {
        const dbName =
          (sequelize.getDatabaseName && sequelize.getDatabaseName()) ||
          (sequelize.config && (sequelize.config as any).database) ||
          process.env.DB_NAME ||
          "saude_na_mao";
        const [fks]: any = await sequelize.query(
          `SELECT CONSTRAINT_NAME, TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA = :db AND CONSTRAINT_NAME!='PRIMARY' AND REFERENCED_TABLE_NAME IS NOT NULL`,
          { replacements: { db: dbName } },
        );

        if (fks && fks.length) {
          for (const r of fks) {
            const constraintName = r.CONSTRAINT_NAME || r.constraint_name;
            const table = r.TABLE_NAME || r.table_name || r.table;
            if (!constraintName || !table) continue;
            console.log(
              `Removendo foreign key ${constraintName} de tabela ${table}`,
            );
            try {
              await sequelize.query(
                `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${constraintName}\``,
              );
            } catch (dropErr) {
              console.warn(
                `Falha ao remover FK ${constraintName} de ${table}:`,
                (dropErr as Error).message || dropErr,
              );
            }
          }
        }
      } catch (cleanupErr) {
        console.warn(
          "Erro ao limpar foreign keys existentes:",
          (cleanupErr as Error).message || cleanupErr,
        );
      }

      // Sincronizar modelos
      await sequelize.sync(); // cuidado com alter: true em produção, pode causar perda de dados
      console.log("Banco de dados sincronizado!");
      return;
    } catch (error) {
      console.warn(
        `Tentativa ${attempt} de ${retries} falhou:`,
        (error as Error).message || error,
      );
      if (attempt >= retries) {
        console.error(
          "Não foi possível conectar ao banco após várias tentativas:",
          error,
        );
        process.exit(1);
      }
      console.log(`Aguardando ${delayMs}ms antes da próxima tentativa...`);
      // exponential backoff-ish
      await wait(delayMs * attempt);
    }
  }
};

// Iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    // Testar banco primeiro
    await testDatabase();

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
      console.log(`saude na mão- Backend`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

// Rota de teste (mantida para compatibilidade)
app.get("/", (req, res) => {
  res.json({
    message: "api funcional",
    api: "Acesse /api para ver os endpoints disponíveis",
  });
});

// Rota raiz da API que lista endpoints disponíveis
app.get("/api", (req, res) => {
  res.json({
    endpoints: [
      "/api/enderecos",
      "/api/usuarios",
      "/api/agendamentos",
      "/api/datas",
      "/api/especialidades",
      "/api/unidades",
      "/api/pacientes",
      "/api/agendas",
      "/api/profissionais",
    ],
  });
});

// Rota de health check (mantida para compatibilidade)
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: "Connected",
    timestamp: new Date().toISOString(),
  });
});

startServer();
