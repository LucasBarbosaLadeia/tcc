"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./config/database"));
const app_1 = __importDefault(require("./app"));
// Importar models e suas relações
require("./models/profissionalModel");
require("./models/usuarioModel");
require("./models/agendamentoModel");
require("./models/horarioModel");
require("./models/especialidadeModel");
require("./models/unidadeModel");
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001; // pegar da env quando disponível
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
        app_1.default.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
            console.log(`saude na mão- Backend`);
        });
    }
    catch (error) {
        console.error("Erro ao iniciar servidor:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map