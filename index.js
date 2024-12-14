const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, 'public'); // Cambia 'public' por la carpeta de tu frontend
app.use(express.static(frontendPath));

async function startServer() {
  try {
    await client.connect();
    console.log('Conectado a MongoDB');

    app.post('/save-message', (req, res) => {
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

    app.get('/messages', (req, res) => {
      const db = client.db('correiodenatal');
      const messages = db.collection('suporte');

      messages.find().toArray()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({ error: 'Error al obtener los mensajes', details: err.message }));
    });

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1);
  }
}

startServer();
