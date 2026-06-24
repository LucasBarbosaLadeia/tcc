const Sequelize = require('sequelize');

const host = process.env.TEST_DB_HOST || '127.0.0.1';
const port = process.env.TEST_DB_PORT ? parseInt(process.env.TEST_DB_PORT, 10) : 3307;
const user = process.env.TEST_DB_USER || 'test';
const pass = process.env.TEST_DB_PASSWORD || 'test';
const db = process.env.TEST_DB_NAME || 'saude_na_mao_test';

const maxRetries = 30;
const intervalMs = 2000;

let attempt = 0;

async function tryConnect() {
  attempt++;
  const sequelize = new Sequelize(db, user, pass, {
    host,
    port,
    dialect: 'mysql',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log(`MySQL is up (host=${host} port=${port})`);
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.log(`Waiting for MySQL (${attempt}/${maxRetries})...`);
    if (attempt >= maxRetries) {
      console.error('MySQL did not become ready in time');
      process.exit(1);
    }
    setTimeout(tryConnect, intervalMs);
  }
}

tryConnect();
