const { MongoClient } = require('mongodb');
require('dotenv').config();

async function handler(req, res) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  if (req.method === 'POST') {
    const { senderHotel, senderName, recipientHotel, recipientName, customMessage } = req.body;

    if (!senderHotel || !senderName || !recipientHotel || !recipientName || !customMessage) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
      await client.connect();
      const db = client.db('correiodenatal');
      const messages = db.collection('suporte');

      const newMessage = {
        senderHotel,
        senderName,
        recipientHotel,
        recipientName,
        customMessage,
        created_at: new Date(),
      };

      const result = await messages.insertOne(newMessage);
      return res.status(200).json({ message: 'Mensaje guardado exitosamente', id: result.insertedId });
    } catch (err) {
      return res.status(500).json({ error: 'Error al guardar el mensaje', details: err.message });
    } finally {
      await client.close();
    }
  } else {
    return res.status(405).json({ error: 'Método no permitido' });
  }
}

module.exports = handler;
