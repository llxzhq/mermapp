/* eslint-env node */

import express from 'express';
import db from '../db.js';

const router = express.Router();

console.log('products.routes cargado');
router.get('/', async (req, res) => {
  try {
    console.log('Entró a /api/products');

    const result = await db.request().query(
      'SELECT TOP 10 * FROM dbo.MermasPruebasLH'
    );

    res.json(result.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error al obtener productos',
      error: error.message
    });
  }
});

export default router;