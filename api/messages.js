const express = require('express');
const router = express.Router();
const { client } = require('../index'); // Importar el cliente MongoDB

router.get('/', (req, res) => {
  const db = client.db('correiodenatal');
  const messages = db.collection('suporte');

  messages.find().toArray()
    .then(rows => res.json(rows))
    .catch(err => res.status(500).json({ error: 'Error al obtener los mensajes', details: err.message }));
});

module.exports = router;
