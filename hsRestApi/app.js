/******************************************************************
************************USING PATH VARIABLES : ********************
*******************************************************************/

var app = require('express')();
 

var server = app.listen(3000, function () {
  var host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});


app.get('/', function (req, res) {
//  res.send('Hello World!');
    res.render('euler');
});




/******************************************************************
**********Retreving a specific resource from server****************
*******************************************************************/
//array of jsons
var resources = [
    {
        id: 1,
        name: 'Foo'
    }
];
 
app.get('/res', function(req, res) {
    res.send(resources);
});
 
app.get('/res/:id', function(req, res) {
    var id = parseInt(req.params.id, 10);
    var result = resources.filter(r => r.id === id)[0];
 
    if (!result) {
        res.sendStatus(404);

    } else {
        res.send(result);
    }
});




/******************************************************************
**********Adding a specific resource to the server*****************
*******************************************************************/

//For putting the post request in req.body we need body parser:
//and we have to tell body parser how to parse our data by specifying 
//is type
var bodyParser = require('body-parser')
app.use(bodyParser.json());


app.post('/res', function(req, res) {

    var item = req.body;
 
    if (!item.id) {
        return res.sendStatus(500);
    }
 
    resources.push(item);
 
    res.send('/res/' + item.id);
});




/******************************************************************
**********Updatind a resource on the server*****************
*******************************************************************/
//This can add a resource too like above
app.put('/res/:id', function(req, res) {
    var id = parseInt(req.params.id, 10);
    var existingItem = resources.filter(r => r.id === id)[0];
 
    if (!existingItem) {
        var item = req.body;
        //bullshit: replace the id in json data req.body with the one in url
        item.id = id;
        resources.push(item);
        res.setHeader('Location', '/res/' + id);
        res.sendStatus(201);
    } else {
        //here you have to make a deep copy of the object
        existingItem.name = req.body.name;
        res.sendStatus(204);
    }
});



/******************************************************************
**********Deleting a resource on the server*****************
*******************************************************************/
app['delete']('/res/:id', function(req, res) {
    var id = parseInt(req.params.id, 10);
    var existingItem = resources.filter(r => r.id === id)[0];
 
    if (!existingItem) {
        return res.sendStatus(404);
    }
 
    resources = resources.filter(r => r.id !== id);
    res.sendStatus(204);
});
