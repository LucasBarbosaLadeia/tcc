import sequelize from "./config/database";
import app from "./app";

// Importar models e suas relações
import "./models/profissionalModel";
import "./models/usuarioModel";
import "./models/agendamentoModel";
import "./models/horarioModel";
import "./models/especialidadeModel";
import "./models/unidadeModel";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001; // pegar da env quando disponível

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

startServer();
