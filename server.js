var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, './static')));

app.listen(5000, function(){
	console.log('listening on port 5000');
})
