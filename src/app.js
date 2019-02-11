import * as enet from "enet";
import * as message_handlers from "./message_handlers";
import * as util from "./util";

const addr = new enet.Address("0.0.0.0", 9521);

const serverData = {
    clients: [],
    lobbies: [],

    getUser: function(clientId) {
        //let clients = serverData.clients;
        for (const client of this.clients) {
                if (client.clientId === clientId) {
                    return client;
            }
        }
        return null;
    }
};

enet.createServer({
    address: addr,
    peers: 32,
    channels: 2,
    down: 0,
    up: 0
}, function(err, host) {
    if (err) {
        return;
    }

    host.on("connect", function(peer, data) {

        console.log(`Peer ${peer._pointer} connected`);

        const newClient = {
            clientId: peer._pointer,
            lastActivity: util.getUtcTimestamp(),
            authenticationHash: null,
        }

        serverData.clients.push(newClient);
        //console.log(serverData.clients);

        peer.on("message", function(packet, channel) {

            const clientId = peer._pointer;
            console.log(serverData.clients);
            const client = serverData.getUser(clientId);

            // TODO: send back some nasty message saying they need to reconnect because they've been dropped for inactivity
            if (!client) {
                return;
            }

            client.lastActivity = util.getUtcTimestamp();
            
            const gameObject = JSON.parse(packet.data().toString());
            console.log(gameObject);

            console.log(`Got packet from ${client.clientId} with message_type of ${gameObject.message_type}`);

            const messageType = gameObject.message_type;

            let messageHandler = null;

            // all handlers will expect the following arguments:
            // handler(gameObject, client, clients)
            // they will also return either:  NULL (don't send back anything to the client)
            //                                [Not Null] (send this object back to the client)

            // anonymous handlers (login)
            if (messageType === "login") {
                messageHandler = message_handlers.login_handler;
            } else {
                //non anonymous - check auth hash   
                if (client.authenticationHash) {
                    switch (messageType) {
                        case "request_map_list":
                            messageHandler = message_handlers.map_list_handler;
                            break;
                        case "request_character_data":
                            messageHandler = message_handlers.request_character_data_handler;
                            break;   
                        case "list_lobbies":
                            messageHandler = message_handlers.list_lobbies_handler;
                            break;
                        case "create_lobby":
                            messageHandler = message_handlers.create_lobby_handler;
                            break;
                        case "leave_lobby":
                            messageHandler = message_handlers.leave_lobby_handler;
                            break;
                        default:
                            // TODO: ?maybe add a bad request handler...?
                            break;
                    }
                }
            }

            if (messageHandler) {
                const responseObject = messageHandler(gameObject, client, serverData);
                console.log(responseObject);
                if (responseObject) {
                    sendResponse(peer, responseObject, client);
                }
            }
        });

        const clientResponse = {
            type: "connect",
            clientId: newClient.clientId,
            peers: []
        };

        sendResponse(peer, clientResponse, newClient);
    });

    host.start(50);
    console.info("Server ready on %s:%s", host.address().address, host.address().port);
});

// check every second and remove any clients that haven't been active in the last 60 seconds
setInterval(() => {
    let i = serverData.clients.length;

    const currentTime = util.getUtcTimestamp();
    
    while (i--) {
        if (!serverData.clients[i] || currentTime - serverData.clients[i].lastActivity >= 60000) {
            serverData.clients.splice(i, 1);

            // TODO: check to see if user is in any lobbies
        }
    }
}, (1000));

function sendResponse(peer, data, client) {
    const jsonResponse = JSON.stringify(data);
    let clientId = "";

    if (client && client.clientId) {
        clientId = client.clientId;
    }

    peer.send(0, jsonResponse, function(err) {
        if (err) {
            console.log("Error sending packet");
        } else {
            console.log(`Message sent successfully to ${clientId}`);
        }
    });
}
