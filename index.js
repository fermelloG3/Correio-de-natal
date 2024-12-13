
console.log('hola')

const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv').config();  // Para manejar variables de entorno

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Conectar con MongoDB Atlas
const uri = process.env.MONGO_URI;  // Usa una variable de entorno para la URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB', err);
  });

// Ruta para guardar mensajes
app.post('/save-message', (req, res) => {
  const { senderHotel, senderName, recipientHotel, recipientName, customMessage } = req.body;

  // Validación de los datos recibidos
  if (!senderHotel || !senderName || !recipientHotel || !recipientName || !customMessage) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Creación del nuevo mensaje
  const newMessage = { senderHotel, senderName, recipientHotel, recipientName, customMessage, created_at: new Date() };

  // Conexión a la base de datos y colección correctas
  const db = client.db('correiodenatal');  // Usa la base de datos correcta
  const messages = db.collection('suporte');  // Usa la colección correcta

  // Inserción del mensaje
  messages.insertOne(newMessage)
    .then(result => {
      res.json({ message: 'Mensaje guardado exitosamente', id: result.insertedId });
    })
    .catch(err => {
      res.status(500).json({ error: 'Error al guardar el mensaje', details: err.message });
    });
});

// Ruta para obtener mensajes
app.get('/messages', (req, res) => {
  const db = client.db('correiodenatal');  // Usa la base de datos correcta
  const messages = db.collection('suporte');  // Usa la colección correcta

  // Obtener los mensajes de la base de datos
  messages.find().toArray()
    .then(rows => {
      console.log("Mensajes obtenidos:", rows);  // Verifica si los datos llegan
      res.json(rows);
    })
    .catch(err => {
      console.error('Error al obtener los mensajes:', err);  // Verifica el error
      res.status(500).json({ error: 'Error al obtener los mensajes', details: err.message });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
