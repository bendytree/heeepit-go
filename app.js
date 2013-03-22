var express = require('express');
var app = express();

app.get('/:type(js|css)/:flags?*', require('./actions/smasher'));
app.get('/test', require('./actions/test'));

app.listen(3000);
console.log('Listening on port 3000');
