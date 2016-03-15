var express = require("express");
var path = require("path");

var React     = require('react');
var ReactIntl = require('react-intl');

var app = express();
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/app/index.html'));
});



app.use('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/' + req.originalUrl));
});



app.listen(8000, function() {
    console.log("Started listening on port", 8000);
})
