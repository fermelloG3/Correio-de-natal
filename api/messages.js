const { MongoClient } = require('mongodb');

// Definir la función allowCors
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://www.natalhoteispires.com.br'); // Cambia '*' por tu dominio en producción
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Definir el handler para manejar las solicitudes
const handler = async (req, res) => {
  const uri = process.env.MONGODB_URI; // Asegúrate de tener la URI de MongoDB configurada en tus variables de entorno
  const client = new MongoClient(uri);

  if (req.method === 'GET') {
    try {
      await client.connect();
      const db = client.db('correiodenatal'); // Reemplaza con el nombre de tu base de datos
      const collection = db.collection('suporte');
      const rows = await collection.find().toArray(); // Obtener los mensajes
      res.status(200).json(rows); // Enviar los resultados
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los mensajes', details: err.message });
    } finally {
      await client.close(); // Cierra la conexión con la base de datos
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};

// Exportar el handler con CORS habilitado
module.exports = allowCors(handler);
