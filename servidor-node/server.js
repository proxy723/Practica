const http = require('http');

const server = http.createServer((req, res) => {
   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

   
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

   
    if (req.url === '/mensaje') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            let data = {};
            try {
                data = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end('Error al procesar los datos JSON');
            }

       
            switch (req.method) {
                case 'POST':
                    console.log('? POST recibido:', data);
                    res.writeHead(201, { 'Content-Type': 'text/plain' });
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
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
});

server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
