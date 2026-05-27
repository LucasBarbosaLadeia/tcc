"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = __importDefault(require("./Config/database"));
// Importar models e suas relações
require("./models/profissionalModel");
require("./models/usuarioModel");
require("./models/agendamentoModel");
require("./models/horarioModel");
require("./models/especialidadeModel");
require("./models/unidadeModel");
// Importar rotas
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const agendamentoRoutes_1 = __importDefault(require("./routes/agendamentoRoutes"));
const horarioRoutes_1 = __importDefault(require("./routes/horarioRoutes"));
const especialidadeRoutes_1 = __importDefault(require("./routes/especialidadeRoutes"));
const unidadeRoutes_1 = __importDefault(require("./routes/unidadeRoutes"));
const pacienteRoutes_1 = __importDefault(require("./routes/pacienteRoutes"));
const agendaRoutes_1 = __importDefault(require("./routes/agendaRoutes"));
const profissionalRoutes_1 = __importDefault(require("./routes/profissionalRoutes"));
const swaggerServerUrl = process.env.SWAGGER_SERVER_URL || "/";
const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Sistema de Agendamento de Consultas Médicas",
        version: "1.0.0",
        description: "Documentação da API do projeto TCC.",
    },
    servers: [
        {
            url: swaggerServerUrl,
            description: "Servidor base da API",
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
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001; // pegar da env quando disponível
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
    res.json(swaggerSpec);
});
// Usar rotas da API (cada recurso em seu prefixo)
app.use("/api/usuarios", usuarioRoutes_1.default);
app.use("/api/agendamentos", agendamentoRoutes_1.default);
app.use("/api/datas", horarioRoutes_1.default);
app.use("/api/especialidades", especialidadeRoutes_1.default);
app.use("/api/unidades", unidadeRoutes_1.default);
app.use("/api/pacientes", pacienteRoutes_1.default);
app.use("/api/agendas", agendaRoutes_1.default);
app.use("/api/profissionais", profissionalRoutes_1.default);
// Testar conexão com banco de dados com retry/backoff
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const testDatabase = async (retries = 10, delayMs = 3000) => {
    let attempt = 0;
    while (attempt < retries) {
        try {
            attempt++;
            await database_1.default.authenticate();
            console.log("Banco de dados conectado com sucesso!");
            // Limpar constraints com nomes duplicados que podem causar ER_FK_DUP_NAME
            try {
                const dbName = (database_1.default.getDatabaseName && database_1.default.getDatabaseName()) ||
                    (database_1.default.config && database_1.default.config.database) ||
                    process.env.DB_NAME ||
                    "saude_na_mao";
                const [fks] = await database_1.default.query(`SELECT CONSTRAINT_NAME, TABLE_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA = :db AND CONSTRAINT_NAME!='PRIMARY' AND REFERENCED_TABLE_NAME IS NOT NULL`, { replacements: { db: dbName } });
                if (fks && fks.length) {
                    for (const r of fks) {
                        const constraintName = r.CONSTRAINT_NAME || r.constraint_name;
                        const table = r.TABLE_NAME || r.table_name || r.table;
                        if (!constraintName || !table)
                            continue;
                        console.log(`Removendo foreign key ${constraintName} de tabela ${table}`);
                        try {
                            await database_1.default.query(`ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${constraintName}\``);
                        }
                        catch (dropErr) {
                            console.warn(`Falha ao remover FK ${constraintName} de ${table}:`, dropErr.message || dropErr);
                        }
                    }
                }
            }
            catch (cleanupErr) {
                console.warn("Erro ao limpar foreign keys existentes:", cleanupErr.message || cleanupErr);
            }
            // Sincronizar modelos
            await database_1.default.sync(); // cuidado com alter: true em produção, pode causar perda de dados
            console.log("Banco de dados sincronizado!");
            return;
        }
        catch (error) {
            console.warn(`Tentativa ${attempt} de ${retries} falhou:`, error.message || error);
            if (attempt >= retries) {
                console.error("Não foi possível conectar ao banco após várias tentativas:", error);
                process.exit(1);
            }
            console.log(`Aguardando ${delayMs}ms antes da próxima tentativa...`);
            // exponential backoff-ish
            await wait(delayMs * attempt);
        }
    }
};
// Iniciar servidor
const startServer = async () => {
    try {
        // Testar banco primeiro
        await testDatabase();
        // Iniciar servidor
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
            console.log(`saude na mão- Backend`);
        });
    }
    catch (error) {
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
//# sourceMappingURL=index.js.map