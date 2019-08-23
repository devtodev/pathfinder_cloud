/**
 * autor: Carlos Miguens
 */
var SOCKET_PORT = 3000;
var WEB_PORT    = 8080;

var net 	= require('net');
var express = require('express');
var app 	= express();

var devices = [];
var movimiento = "offline";
var conectado = 0;
var processedData;

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
    console.log(data.toString());
    processedData = data.toString();
  });

});

app.get('/getInfo', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(processedData);
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
    try {
      if (devices.length < 1)
      {
        res.send("Disconnected robot");
        return;
      }
    } catch (e) {
      res.send("Disconnected robot");
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

    res.send("confirmed");
});

server.listen(SOCKET_PORT, function() { //'listening' listener
  console.log('M2M socket listening at port %s...', SOCKET_PORT);
});


var serverWeb = app.listen(WEB_PORT, function () {

  var host = serverWeb.address().address;
  var port = serverWeb.address().port;

  console.log("Web service listing at %s...", port);

});