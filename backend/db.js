/* eslint-env node */
/* global process */

import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // ej: "10.10.10.5" o "SRVSQL01"
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // importante en redes internas
    trustServerCertificate: true
  }
};

let pool;

export const getConnection = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✅ Conectado a SQL Server');
    }
    return pool;
  } catch (error) {
    console.error('❌ Error conectando a SQL Server:', error.message);
    throw error;
  }
};