const allowCors = (fn) => async (req, res) => {
  const allowedOrigins = ['https://correio-de-natal.vercel.app', 'http://localhost:3000']; // Dominios permitidos
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Responder directamente a las solicitudes preflight
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
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
};

module.exports = allowCors(handler);
