var connect = require('connect');
var http2 = require('http2');
var fs = require('fs');
var connectRouter = require('connect-route');
var connectJade = require('connect-jade');
var logger = require('morgan');

var app = connect();

app.use(connectJade({
    root: __dirname + '/views',
    debug: true
}));

app.use(logger('dev'));

app.use(connectRouter(function(router){
    router.get('/', function(req, res, next){
        res.render('index');
    });
}));

// paths to the key and certificate for ssl
var sslOptions = {
    key: fs.readFileSync('./test-cert/localhost.key'),
    cert: fs.readFileSync('./test-cert/localhost.crt')
};

// start the server
http2.createServer(sslOptions, app).listen(3000);