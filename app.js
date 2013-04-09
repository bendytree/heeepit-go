
var express = require('express');
var app = express();

app.get('/', require('./actions/go'));

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Listening on port:'+port);
});
