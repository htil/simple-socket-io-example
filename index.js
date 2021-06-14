var Server = function (port) {
  // Variables
  this.express = require("express");
  this.app = this.express();
  this.server = require("http").Server(this.app);
  this.io = require("socket.io")(this.server);
  this.PORT = port;
  this.app.use(this.express.static(__dirname));
  connections = {};

  // Methods

  // Send message to client
  sendMsg = function (clientID, packageID, msg) {
    connections[clientID].emit(packageID, msg);
  };

  // Use this approach to handle multiple client connections
  addConnection = function (socket) {
    let { id } = socket;
    connections[id] = socket;
    sendMsg(id, "exampleServerEvent", "hello world");
    console.log(id, " connected");
  };

  // Start server
  this.start = function () {
    this.server.listen(this.PORT);
    console.log("Listening on port: ", this.PORT);
  };

  // Events
  this.io.on("connection", function (socket) {
    addConnection(socket);

    // Add listeners
    socket.on("clientMsg", function (data) {
      console.log("Message from client: ", data);
    });
  });

  return this;
};

var server = new Server(8081);
server.start();
