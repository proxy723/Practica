const http = require('http'); // Se importa el módulo HTTP para crear el servidor
const mysql = require('mysql2'); // Se importa el módulo mysql2 para interactuar con la base de datos

// Configuración de la base de datos MySQL (conexión)
const dbConfig = {
    host: 'localhost', // Dirección del servidor MySQL (en este caso, localhost)
    user: 'root',      // Usuario de la base de datos
    password: '',      // Contraseña de la base de datos
    database: 'datos'  // Nombre de la base de datos a la que se conectará
};

// Se crea un "pool" de conexiones a la base de datos. Este pool maneja múltiples conexiones para optimizar el rendimiento
const pool = mysql.createPool(dbConfig);

// Se crea el servidor HTTP
const server = http.createServer((req, res) => {

    // Se configuran los encabezados CORS para permitir solicitudes desde cualquier origen
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Si la solicitud es de tipo OPTIONS (preflight), se responde sin procesar más
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // 204 No Content
        res.end();
        return;
    }

    // Si la ruta solicitada es '/mensaje' y el método es POST
    if (req.url === '/mensaje' && req.method === 'POST') { 
        let body = ''; // Se inicializa la variable para almacenar el cuerpo de la solicitud

        // Se escucha el evento 'data' para ir acumulando los datos que llegan
        req.on('data', chunk => {
            body += chunk;
        });

        // Cuando termina de llegar la información, se ejecuta este bloque
        req.on('end', () => {
            let data = {}; // Se define un objeto para almacenar los datos parseados
            try {
                data = JSON.parse(body); // Se intenta parsear el cuerpo como JSON
            } catch (e) {
                // Si falla el parseo, se responde con error 400 (Bad Request)
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end('Error al procesar los datos JSON');
            }

            // Se extraen los campos necesarios del JSON
            const { nombre, email, mensaje } = data;

            // Se valida que todos los campos sean proporcionados
            if (!nombre || !email || !mensaje) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end('Todos los campos (nombre, email, mensaje) son requeridos.');
            }

            // Se obtiene una conexión de la base de datos desde el pool
            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error al obtener conexión de la base de datos:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('Error interno del servidor al conectar con la base de datos.');
                }

                // Consulta SQL para insertar los datos recibidos en la tabla 'info'
                const query = 'INSERT INTO info (nombre, correo, comen) VALUES (?, ?, ?)';
                connection.execute(query, [nombre, email, mensaje], (error, results) => {
                    // Libera la conexión de vuelta al pool
                    connection.release();

                    // Si hay un error al insertar los datos en la base de datos
                    if (error) {
                        console.error('Error al insertar datos:', error);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        return res.end('Error al guardar el mensaje en la base de datos.');
                    }

                    // Si todo salió bien, se responde con el código 201 (Creado)
                    console.log('Mensaje guardado con éxito:', results);
                    res.writeHead(201, { 'Content-Type': 'text/plain' }); // 201 Created
                    res.end('Mensaje enviado y guardado correctamente.');
                });
            });
        });
    } else {
        // Si la ruta no coincide o el método no es permitido, se responde con 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada o método no permitido para esta ruta');
    }
});

// El servidor escucha en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor Node.js escuchando en http://localhost:3000');
});
