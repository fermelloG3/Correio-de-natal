const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
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

    const db = req.app.locals.db; // Obtener la base de datos desde app.locals
    const messages = db.collection('suporte');

    const result = await messages.insertOne(newMessage); // Insertar el mensaje en la base de datos

    res.json({ message: 'Mensaje guardado exitosamente', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar el mensaje', details: err.message });
  }
});

module.exports = router;
