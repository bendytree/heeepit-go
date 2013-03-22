var express = require('express');
var app = express();

app.get('/wad', require('./actions/wad'));

app.listen(3000);
console.log('Listening on port 3000');
