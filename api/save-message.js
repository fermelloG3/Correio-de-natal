const express = require('express');
const router = express.Router();
const { client } = require('../index'); // Importar el cliente MongoDB

router.post('/', (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { senderHotel, senderName, recipientHotel, recipientName, customMessage } = req.body;

  if (!senderHotel || !senderName || !recipientHotel || !recipientName || !customMessage) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const newMessage = {
    senderHotel,
    senderName,
    recipientHotel,
    recipientName,
    customMessage,
    created_at: new Date(),
  };

  const db = client.db('correiodenatal');
  const messages = db.collection('suporte');

  messages.insertOne(newMessage)
    .then(result => res.json({ message: 'Mensaje guardado exitosamente', id: result.insertedId }))
    .catch(err => res.status(500).json({ error: 'Error al guardar el mensaje', details: err.message }));
});

module.exports = router;
