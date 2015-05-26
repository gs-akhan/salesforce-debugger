var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var redis = require("redis"),
    
     client = redis.createClient(process.env.redisport, process.env.redishost, {});
    
     client.auth(process.env.redispass, function(err, data) {
      console.log(data);
     });
     client.on("error", function (err) {
        console.log("Error " + err);
    });
var socketMaps = {};
var socketIDToOrg = {};

//io.sockets.connected[socketid].emit('message', 'for your eyes only');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = (process.env.PORT || '3000');
server.listen(port);


io.on("connection", function(socket) {
    
    socket.on("SUBSCRIBE", function(data){
      socketMaps[data.userName] = socketMaps[data.userName] || [];
      socketMaps[data.userName].push(socket.id);
      socketIDToOrg[socket.id] = data.userName;
    });

    socket.on('disconnect', function() {
      
      //Defer this operation, because it can happen when event loop is resting.
      setImmediate(function() {
        
        var listOfSockets = socketMaps[socketIDToOrg[socket.id]]
        
        if(listOfSockets) {
          listOfSockets.forEach(function(item, iter) {
            if(item === socket.id) {
              socketIDToOrg[socket.id] = undefined;
              listOfSockets.splice(iter, 1);
            }
          });
        }

      });
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

app.get("/cache.appcache", function(req, res){
  res.set("Content-Type", "text/cache-manifest");
  res.set("Cache-Control", "no-store, no-cache");
  res.set("Expires", "-1");
  res.sendFile("/cache.appcache", {root: __dirname});
});

app.get('/debug', function(req, res) {
    client.get("debug-log-count", function(err, reply) {
      res.json({
        "msg" :  JSON.stringify(socketMaps),
        "newSocketMap" : JSON.stringify(socketIDToOrg),
        "logcounter" : reply
      });
    });
});

app.post('/debug', function(req, res) {
  var socketIds = socketMaps[req.get('userName')];
  if(socketIds) {
    socketIds.forEach(function(socketId, iter) {
      client.incr("debug-log-count");
      io.to(socketId).emit("NEWS", req.body);
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
