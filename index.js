const express= require('express');
const app=express();
var port = process.env.PORT || 8080; // important for deployment later
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(port); //changed from app.listen(port)
app.use(express.static('static'));
app.use(express.urlencoded({extended: false}));
console.log("WebChat server is running on port " + port);
app.get("/", (req,res)=>{
    res.sendFile(__dirname + '/static/chatclient.html')
})
io.on('connection', (socketclient) => { 
    console.log('A new client is connected!');
    var onlineClients = Object.keys(io.sockets.sockets).length;
    var welcomemessage = `${socketclient.id} is connected~ Number of connected clients: ${onlineClients}`
    console.log(welcomemessage);
    io.emit("online", welcomemessage);
    
    /* code to handle*/
    socketclient.on('message', (data) => {
        console.log("DEBUG: data received from a client: " + data);
        io.emit("message", `${socketclient.id} says: ${data}`);
    });

    socketclient.on("typing", () =>{
        // For debugging
        console.log('Someone is typing...');
        //Send to all connected clients
        io.emit("typing", `${socketclient.id} is typing...`)
    });

    socketclient.on('disconnect', () => {
        var onlineClients = Object.keys(io.sockets.sockets).length;
        var byemessage = `${socketclient.id} is disconnected! Number of connected clients: ${onlineClients}`
        console.log(byemessage);
        io.emit("online", byemessage);
    });
});