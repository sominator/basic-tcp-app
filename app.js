const net = require('net');
let clients = {};

const server = net.createServer(function (client) {
    client.id = Math.floor(Math.random() * 1000);
    clients[client.id] = client;
    client.write('Welcome to the server!\r\n');
    logClients();

    serverMessage("connected", client.id);

    client.pipe(client);
        
    client.on('end', function () {
        let clientID;
        for (const [key, value] of Object.entries(clients)) {
            if (value == client) {
                clientID = key;
                delete clients[key];
            }
        }
        logClients();
        serverMessage("disconnected", clientID);
    })
})

let logClients = () => {
    for (client in clients) {
        console.log("Client: " + clients[client].id);
    }
}

let serverMessage = (type, clientID) => {
    for (const [key, value] of Object.entries(clients)) {
        if (key != clientID) {
            if (type === "connected") {
                value.write("Client connected: " + clientID);
            } else if (type === "disconnected") {
                value.write("Client disconnected: "+ clientID);
            }
        }
    }
}

server.listen(8080, '127.0.0.1');