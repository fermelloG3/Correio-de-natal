const { MongoClient } = require('mongodb');
require('dotenv').config();

async function handler(req, res) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('correiodenatal');
    const messages = db.collection('suporte');

    if (req.method === 'GET') {
      const messagesList = await messages.find().toArray();
      return res.status(200).json(messagesList);
    } else {
      return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (err) {
    console.error('Error al conectar a MongoDB', err);
    return res.status(500).json({ error: 'Error interno del servidor', details: err.message });
  } finally {
    await client.close();
  }
}

module.exports = handler;
