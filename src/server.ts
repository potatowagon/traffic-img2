// This script exports nothing
export {};

// load modules
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const publicIp = require('public-ip');
const iplocation = require('iplocation');
const Homepage = require('./homepage')
const HOST = '0.0.0.0';
const PORT = 3000;

var sockets = {};
var clients = 0;

//Static Routes
const root = path.dirname(__dirname)
app.use(express.static(root));

//Main App Route, serve mainpage
var homepage = new Homepage();
homepage.insertGoogleMapsKey();
app.get('/', (req, res, next) => res.sendFile(homepage.homepage_path));

// handle socket client connection
io.on('connection', (socket) => {
  var extIp = null;
  var extIpLoc = null;
  var intIp = socket.request.connection.remoteAddress;
  var intIpLoc = null;

  console.log("================================================================");
  console.log('Client ' + intIp + ' connected');
  console.log(socket.handshake);
  clients ++;
  console.log("clients: " + clients);
  console.log("================================================================");

  iplocation(intIp, function (error, res) {
    console.log("Location of " + intIp + ": " + res.country + " " + res.zip + ", isp: " + res.isp);
  });

  publicIp.v4()
  .then(ip => {
    extIp = ip;
    iplocation(extIp, function (error, res) {
      if(error) {
        console.log(error);
      }
      console.log("External IP of " + intIp + ": " + extIp);
      console.log("Location of " + extIp + ": " + res.country + " " + res.zip + ", isp: " + res.isp);
    });
  })
  .catch(err => {});

  publicIp.v6()
  .then(ip => {
    extIp = ip;
    iplocation(extIp, function (error, res) {
      if(error) {
        console.log(error);
      }
      console.log("External IP of " + intIp + ": " + extIp);
      console.log("Location of " + extIp + ": " + res.country + " " + res.zip + ", isp: " + res.isp);
    });
  })
  .catch(err => {});

  //handle events from client user interaction
  socket.on('disconnect', () => {
    console.log('Client ' + socket.request.connection.remoteAddress + ' disconnected');
    clients --;
    console.log("clients: " + clients);
  });
});

// start HTTP server
http.listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
}
