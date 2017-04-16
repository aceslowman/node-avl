const express = require('express'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    mongoose = require('mongoose'),
    routes = require('./routes'),
    config = require('./config');

var app = express();
var port = process.env.PORT || 8080;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.disable('etag');

mongoose.connect('mongodb://localhost/avl');

app.get('/', routes.index);

app.use('/', express.static(__dirname + "/public/"));

var server = http.createServer(app).listen(port, function() {
  console.log('Listening on port: ' + port);
});
