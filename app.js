var express = require('express');
var mongodb = require('mongodb').MongoClient;

var app = express();

var port = 9000;

app.get('/', function(req, res){
    res.send('Hello World');
});
app.listen(port, function(error){
    console.log('running server on port ' + port);
});