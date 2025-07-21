const http = require('http'); // Se importa el módulo HTTP para crear el servidor
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

   
    if (req.url === '/mensaje') {
        let body = '';// Se inicializa la variable para almacenar el cuerpo de la solicitud

        // Se escucha el evento 'data' para ir acumulando los datos que llegan

        req.on('data', chunk => {
            body += chunk;
        });
// Cuando termina de llegar la información, se ejecuta este bloque
        req.on('end', () => {
            let data = {}; // Se define un objeto para almacenar los datos parseados
            try {
                data = JSON.parse(body);// Se intenta parsear el cuerpo como JSON
            } catch (e) {
                   // Si falla el parseo, se responde con error 400 (Bad Request)
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end('Error al procesar los datos JSON');
            }

       // Se maneja el método de la solicitud según sea POST, PUT, PATCH o DELETE
            switch (req.method) {
                case 'POST':
                    console.log('? POST recibido:', data);  // Se imprime en consola el contenido recibido
                    res.writeHead(201, { 'Content-Type': 'text/plain' }); // 201 Created
                    res.end('POST recibido correctamente');
                    break;

                case 'PUT':
                    console.log('?? PUT recibido:', data);
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('PUT procesado correctamente');
                    break;

                case 'PATCH':
                    console.log('?? PATCH recibido:', data);
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('PATCH procesado correctamente');
                    break;

                case 'DELETE':
                    console.log('?? DELETE recibido:', data);
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('DELETE procesado correctamente');
                    break;

                default:
                    res.writeHead(405, { 'Content-Type': 'text/plain' });
                    res.end('Método no permitido');
                    break;
            }
        });
    } else {
        // Si la ruta no es '/mensaje', se responde con 404 (Not Found)
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
});
// El servidor escucha en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
