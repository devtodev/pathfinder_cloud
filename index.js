/**
 * autor: Carlos Miguens
 */
var SOCKET_PORT = 3000;
var WEB_PORT    = 8080;

var net 	= require('net');
var express = require('express');
var app 	= express();

var devices = [];
var telemetry;

var server = net.createServer(function(socket) { //'connection' listener
  var dispositivo_id;
  var IP = socket.remoteAddress;


  socket.setTimeout(40000, function() {
	devices = [];
    console.log('client disconnected');
  });
  
  devices.push(socket);
  console.log('client connected '+ socket.IP);

  server.getConnections(function(err, count) {
       console.log("Connections: " + count);
       console.log("IP: "+ socket.IP);
  });

  socket.on('data', function(data) {
    // {"temperature" : "35.9", accel : { "x" : " 0.1", "y" : " 0.5", "z" : " 9.8",  }, gyro : { "x" : "0", "y" : "0", "z" : "0",  }, "battery" : " 8.3", "jack" : "12.7", } 
    console.log(data.toString());
    telemetry = data.toString();  // JSON.parse();
  });

});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/getInfo', function (req, res) {
  reply = {
    error: false,
    code: 200,
    message: telemetry,
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  res.setHeader('Content-Type', 'application/json');
  res.send(reply);
});

app.get('/isOnline', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    try {
        if (devices.length < 1)
        {
          res.send("offline");
          return;
        }
        devices[devices.length-1].write(" ");
    } catch (e) {
        res.send("offline");
    }
    res.send("online");
});
    
function getDeviceClient()
{
    // TODO: login system
    return devices[devices.length-1];
}

app.get('/command', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    reply = {
      error: false,
      code: 200,
      message: 'Disconnected robot'
     };

    try {
      if (devices.length < 1)
      {
        res.send(reply);
        return;
      }
    } catch (e) {
      res.send(reply);
      return;
    }
    var device = getDeviceClient();
    if (req.query["semueve"] == "padelante")
      device.write("¡{i}!");
    if (req.query["semueve"] == "palaizquierda")
     device.write("¡{j}!");
    if (req.query["semueve"] == "paladerecha")
     device.write("¡{l}!");
    if (req.query["semueve"] == "aguantaaaaa")
     device.write("¡{k}!");
    if (req.query["semueve"] == "metelepata")
     device.write("¡{d}!");
    if (req.query["semueve"] == "tranquipanky")
     device.write("¡{s}!");

    reply.message = "confirmed";
    res.send(reply);
});

server.listen(SOCKET_PORT, function() { //'listening' listener
  console.log('M2M socket listening at port %s...', SOCKET_PORT);
});


var serverWeb = app.listen(WEB_PORT, function () {

  var host = serverWeb.address().address;
  var port = serverWeb.address().port;

  console.log("Web service listing at %s...", port);

});