// initialize WebSocket
var socket = io();
// bind to socket events
socket.on('connect', function () {
    console.log("Connected");
});
socket.on('disconnect', function () {
    console.log("Disconnect");
});
