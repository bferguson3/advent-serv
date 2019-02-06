const enet = require("enet");

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
            lastActivity: getUtcTimestamp(),
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

            client.lastActivity = getUtcTimestamp();
            
            const gameObject = JSON.parse(packet.data().toString());
            console.log(gameObject);

            console.log(`Got packet from ${client.clientId} with message_type of ${gameObject.message_type}`);

            const messageType = gameObject.message_type;

            if (messageType === "login") {
                
                if (gameObject.data.player_username === "guest" && gameObject.data.password === "password"){
                    const loginSucceededObject = {
                        type: "login_response",
                        clientId: clientId,
                        value: "true"
                    };
                    // TOOD: put a hash here
                    client.authenticationHash = "PUTAHASHHERE"
                    sendResponse(peer, loginSucceededObject, client);
                    console.log(loginSucceededObject);
                }
            } else if (messageType === "request_map_list") {
                if(client.authenticationHash){
                    const mapListObject = {
                        type: "map_list",
                        clientId: clientId,
                        value: "MAP01"
                    };
                    sendResponse(peer, mapListObject, client);
                    console.log(mapListObject);
                }
            } 
            else if (messageType === "request_character_data") {
                if (client.authenticationHash) {
                    // this will be pulled from a local database
                    const tempPlayerDataObj = {
                        type: "player_data",
                        clientId: clientId,
                        value: {
                            name: 'Filius',
                            sheet: 'assets/filius_sheet.png',
                            level: 1,
                            mhp: 30,
                            mmp: 0,
                            xp: 0,
                            str: 10,
                            agi: 5,
                            int: 2,
                            equipment: {}
                        }
                    };
                    sendResponse(peer, tempPlayerDataObj, client);
                    console.log(tempPlayerDataObj);
                    lastActivity = getUtcTimestamp();
                }
            }
            else {
                const utcTimestamp = getUtcTimestamp();

                let responseObject = {};

                responseObject = {
                    response_time: utcTimestamp,
                    response_text: messageText
                };

                sendResponse(peer, responseObject, clientId);
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

setInterval(() => {
    let i = clients.length;

    const currentTime = getUtcTimestamp();

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

function getUtcTimestamp() {
    const now = new Date;

    const utcTimestamp = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() , 
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(), 
        now.getUTCMilliseconds()
    );

    return utcTimestamp;
}
