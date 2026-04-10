/* eslint-env node */
/* global process */

import sql from 'mssql/msnodesqlv8.js';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  driver: 'msnodesqlv8',
  options: {
    trustServerCertificate: true
  }
};

let pool = null;

try {
  pool = await sql.connect(config);
  console.log('✅ Conectado a SQL Server');
} catch (err) {
  console.error('❌ Error de conexión SQL:');
  console.error(err);
}

export default {
  request() {
    if (!pool) {
      throw new Error('No existe conexión a SQL Server');
    }
    return pool.request();
  }
};