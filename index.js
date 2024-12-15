require('dotenv').config(); // Carga variables de entorno desde el archivo .env
console.log(process.env); // Verifica que las variables de entorno estén cargadas

const express = require('express');
const path = require('path');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto definido en .env o 3000 como predeterminado
header('Access-Control-Allow-Origin: https://www.natalhoteispires.com.br');
// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de CORS
const corsOptions = {
  origin: '*',  // Permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
  allowedHeaders: ['Content-Type'],  // Encabezados permitidos
};

// Aplica CORS a todas las rutas
router.use(cors(corsOptions));  // Esto habilita CORS para todas las rutas en este archivo

// Ruta principal para servir el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Asegúrate de que la variable MONGO_URL esté cargada correctamente
if (!process.env.MONGO_URL) {
  console.error("MONGO_URL no está definida en el archivo .env");
  process.exit(1); // Finaliza el proceso si no se encuentra la URL de MongoDB
}

const client = new MongoClient(process.env.MONGO_URL); // URL de MongoDB desde .env


// Middleware para parsear JSON
app.use(express.json()); // Usamos el middleware de Express directamente

// Importar rutas desde la carpeta api
const messagesRoute = require('./api/messages');
const saveMessageRoute = require('./api/save-message');

// Usar las rutas
app.use('/api/messages', messagesRoute);
app.use('/api/save-message', saveMessageRoute);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Iniciar el servidor y conectar a MongoDB
async function startServer() {
  try {
    await client.connect(); // Conexión a MongoDB
    console.log('Conectado a MongoDB');
    
    // Compartir la base de datos con las rutas
    const db = client.db('nombre_de_tu_base'); // Reemplaza con el nombre de tu base de datos
    app.locals.db = db; // Agrega la base de datos a las variables locales de la app

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1); // Finaliza el proceso si falla la conexión
  }
}

startServer();
