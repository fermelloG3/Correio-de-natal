const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db; // Obtener la base de datos desde app.locals
    const messages = db.collection('suporte');

    const rows = await messages.find().toArray(); // Consultar los documentos
    res.json(rows); // Enviar los resultados como JSON
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los mensajes', details: err.message });
  }
});

module.exports = router;
