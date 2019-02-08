import * as enet from "enet";
import * as message_handlers from "./message_handlers";
import * as util from "./util";

const addr = new enet.Address("0.0.0.0", 9521);

const clients = [];

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
            authenticationHash: "",
        };

        clients.push(newClient);

        peer.on("message", function(packet, channel) {

            const clientId = peer._pointer;
            let client = null;

            for (const registeredClient of clients) {
                if (registeredClient.clientId === clientId) {
                    client = registeredClient;
                    break;
                }
            }

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
                            messageHandler = message_handlers.request_character_data;
                            break;   
                        default:
                            // TODO: ?maybe add a bad request handler...?
                            break;
                    }
                }
            }

            if (messageHandler) {
                const responseObject = messageHandler(gameObject, client, clients);
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
    console.log("Server ready on %s:%s", host.address().address, host.address().port);
});

// check every second and remove any clients that haven't been active in the last 60 seconds
setInterval(() => {
    let i = clients.length;

    const currentTime = util.getUtcTimestamp();
    
    while (i--) {
        if (!clients[i] || currentTime - clients[i].lastActivity >= 60000) {
            clients.splice(i, 1);
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
