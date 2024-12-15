const express = require('express');
const cors = require('cors');  // Importa CORS
const router = express.Router();

// Configura CORS para permitir solo el dominio de tu frontend
const corsOptions = {
  origin: 'https://www.natalhoteispires.com.br', // Permite solicitudes solo desde este dominio
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Usa CORS con la configuración
router.use(cors(corsOptions));

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

