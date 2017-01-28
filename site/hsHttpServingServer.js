/*This is a http server to serve requested html pages
 *Ex. user selects: localhost:8787/page.html   and the server serves it
*/



/*Required Modules*/
var http = require('http'); //creating an http server
var url = require('url'); //parsing url s
var path = require('path'); //string manipulations needed for working with file paths 
var fs = require('fs');  //file system

/*And array of available mimeTypes (this is basically a name value struct)*/
var mimeTypes = {
	"html" : "text/html",
	"jpgeg" : "image/jpgeg",
	"jpg" : "image/jpg",
	"png" : "image/png",
	"js" : "text/javascript",
	"css" : "text/css"
};

/*The create server function*/
http.createServer( function(req,res) {
	var uri = url.parse(req.url).pathname;

	/*we wanna get the full file name, so we join what the user specifies (file name) with the current path
	 *the thread is running in. Because the file must be in the same directory anyway
	 *process: is the current thread or process
	 *cwd: get the current working directory of the current thread
	 *make sure the uri is not escapted
	*/
	var fileName = path.join(process.cwd(),unescape(uri))
	console.log('Loading ' + uri);


	//Look to see if the requested file exists. lstatSync captures the latest meta data about the given file in a variable
	var stats;
	try {
		stats = fs.lstatSync(fileName); //Look for the file name if its not there, do cath. 
	} catch(e) {
		//send a 404 error
		res.writeHead(404, {'Content-type': 'text/plain'});
		res.write('404 not found');

		//end the connection to client
		res.end();

		//end server
		return;
	}


	//Check and see of the path is a file or a directory
	if( stats.isFile() ) {
		//This is gonna get the mimeType for us.
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		
		//send a 200 to show that the status is susscessful
		res.writeHead(200, {'Content-type' : mimeType});

		//create a file stream
		var fileStream = fs.createReadStream(fileName);

		//What ever is in fileStream gets stremed to res
		fileStream.pipe(res);
	} else if( stats.isDirectory() ) {
		//redirect client to the index page. By sendinga 302 which is a redirect code
		res.writeHead(302, {'location' : 'index.html'});
		res.end();
	} else {
		//if its unknown send an internal error 500
		res.writeHead(500, {'Content-type' : 'text/plain'});
		res.write('500 Internal Error');
		res.end();
	}

}).listen(8787);

console.log('hsHtmlServing server is istening on port 8787');
