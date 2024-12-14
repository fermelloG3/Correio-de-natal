const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const client = new MongoClient('mongodb://localhost:27017'); // Asegúrate de usar tu URL de conexión de MongoDB

const PORT = 3000;

// Middleware para permitir CORS
// Permitir solicitudes solo desde 'https://www.natalhoteispires.com.br'
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite solicitudes desde cualquier origen
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE"); // Métodos permitidos
  res.header("Access-Control-Allow-Headers", "Content-Type"); // Encabezados permitidos
  app.use(cors());
  next(); // Asegura que la solicitud continúe al siguiente middleware o ruta
});


// Middleware para parsear JSON
app.use(bodyParser.json());

// Importar rutas desde la carpeta api
const messagesRoute = require('./api/messages');
const saveMessageRoute = require('./api/save-message');

// Usar las rutas
app.use('/api/messages', messagesRoute);
app.use('/api/save-message', saveMessageRoute);

// Iniciar el servidor
async function startServer() {
  try {
    await client.connect();
    console.log('Conectado a MongoDB');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1);
  }
}

startServer();

