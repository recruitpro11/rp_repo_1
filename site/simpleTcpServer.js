var net = require('net');

var server = net.createServer( function (socket) {
	socket.write("Echo server\r\n");
	socket.pipe(socket);
} );

server.listen(8787);

console.log('TCp server running on port 8787/n connect using: netcat host port');
