const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Configurar base de datos SQLite
const db = new sqlite3.Database('./messages.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
        
        // Crear tabla si no existe
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                senderHotel TEXT,
                senderName TEXT,
                recipientHotel TEXT,
                recipientName TEXT,
                customMessage TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Ejecutar la consulta para crear la tabla
        db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Error al crear la tabla:', err.message);
            } else {
                console.log('Tabla `messages` creada o ya existente');
            }
        });
    }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para guardar mensajes
app.post('/save-message', (req, res) => {
    const { senderHotel, senderName, recipientHotel, recipientName, customMessage } = req.body;

    if (!senderHotel || !senderName || !recipientHotel || !recipientName || !customMessage) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = `
        INSERT INTO messages (senderHotel, senderName, recipientHotel, recipientName, customMessage)
        VALUES (?, ?, ?, ?, ?);
    `;

    db.run(query, [senderHotel, senderName, recipientHotel, recipientName, customMessage], function (err) {
        if (err) {
            console.error('Error al guardar el mensaje:', err.message);
            return res.status(500).json({ error: 'Error al guardar el mensaje' });
        }

        res.json({ message: 'Mensaje guardado exitosamente', id: this.lastID });
    });
});

// Endpoint para obtener mensajes
app.get('/messages', (req, res) => {
    const query = 'SELECT * FROM messages ORDER BY created_at DESC';

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los mensajes:', err.message);
            return res.status(500).json({ error: 'Error al obtener los mensajes' });
        }

        res.json(rows);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
