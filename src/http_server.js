const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const listener = (req, res) => {
    console.log(req.url)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write('From Node.js\n');
    
    // route
    if(req.url === '/') {
        res.end('root')
    }
    else {
        res.end('sub path page')
    }
}

const server = http.createServer(listener);


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});