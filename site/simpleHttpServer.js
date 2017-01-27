var http = require('http');
http.createServer( function (req, rep) {
	rep.writeHead(200, {'Content-Type': 'text/plain'});
	rep.end("hellow word/n");
}).listen(8787);
console.log("Server running on port 8787 local")
