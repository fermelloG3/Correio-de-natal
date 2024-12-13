const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// URL de conexión con MongoDB (reemplaza <db_password> con tu contraseña real)
const uri = 'mongodb+srv://ferdemello28:ShOqjJaa3dJ9YJxO@cluster0.vbg7j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Conectar con MongoDB
let db;
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('myDatabase');  // Asegúrate de poner el nombre correcto de tu base de datos
        console.log('Conectado a la base de datos MongoDB');
    })
    .catch(err => console.error('Error al conectar con la base de datos:', err));

// Middleware
app.use(bodyParser.json());

// Endpoint para guardar mensajes
app.post('/save-message', (req, res) => {
    const { senderHotel, senderName, recipientHotel, recipientName, customMessage } = req.body;

    if (!senderHotel || !senderName || !recipientHotel || !recipientName || !customMessage) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const message = {
        senderHotel,
        senderName,
        recipientHotel,
        recipientName,
        customMessage,
        created_at: new Date(),
    };

    const messagesCollection = db.collection('messages');
    messagesCollection.insertOne(message, (err, result) => {
        if (err) {
            console.error('Error al guardar el mensaje:', err);
            return res.status(500).json({ error: 'Error al guardar el mensaje' });
        }
        res.json({ message: 'Mensaje guardado exitosamente', id: result.insertedId });
    });
});

// Endpoint para obtener mensajes
app.get('/messages', (req, res) => {
    const messagesCollection = db.collection('messages');
    messagesCollection.find({}).sort({ created_at: -1 }).toArray((err, messages) => {
        if (err) {
            console.error('Error al obtener los mensajes:', err);
            return res.status(500).json({ error: 'Error al obtener los mensajes' });
        }
        res.json(messages);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
