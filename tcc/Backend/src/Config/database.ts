import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isTest = process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === "test";

let sequelize: Sequelize;

// Support for a MySQL-backed test database when TEST_DB=mysql is set.
// This allows running integration tests against a containerized MySQL instance.
if (isTest && process.env.TEST_DB === "mysql") {
  sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.TEST_DB_HOST || process.env.DB_HOST || "127.0.0.1",
    port: process.env.TEST_DB_PORT ? parseInt(process.env.TEST_DB_PORT, 10) : process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    username: process.env.TEST_DB_USER || process.env.DB_USER || "root",
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.TEST_DB_NAME || process.env.DB_NAME || "saude_na_mao_test",
    logging: false,
  });
} else if (isTest) {
  // Default test behavior: in-memory SQLite (fast, no external deps)
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "saude_na_mao",
  });
}

export default sequelize;