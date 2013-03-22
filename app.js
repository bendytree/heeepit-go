var express = require('express');
var app = express();

app.get('/smash', require('./actions/smash'));
app.get('/test', require('./actions/test'));

app.listen(3000);
console.log('Listening on port 3000');
