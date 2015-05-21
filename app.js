var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var socketMaps = {};

//io.sockets.connected[socketid].emit('message', 'for your eyes only');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = (process.env.PORT || '3000');
server.listen(port);


io.on("connection", function(socket) {
    socket.on("SUBSCRIBE", function(data){
      socketMaps[data.orgId] = socket.id;
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
  
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/debug', function(req, res) {
  
    io.sockets.emit('NEWS', {
      data : JSON.stringify(req.body)
    });
  
  
    res.json({
      "msg" : "Thank you"
    });
});

app.post('/debug', function(req, res) {

  var orgId = socketMaps[req.body.orgId];
  if(orgId) {
    io.sockets.socket(socketMaps[orgId]).emit("NEWS", {
      data : JSON.stringify(req.body)
    });    
  }

  res.json({
    "msg" : "Thank you"
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
