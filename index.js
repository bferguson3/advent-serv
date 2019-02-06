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

        const newClientId = generateClientId();

        console.log(`Peer ${newClientId} connected`);

        const connectedClients = [];

        const newClient = {
            clientId: newClientId,
            peerId: peer._pointer,
            peer: peer, 
            x: 0,
            y: 0,
            lastActivity: getUtcTimestamp(),
            legitAccount: false
        };

        for (const client of clients) {
            const connectedClient = {
                client: client.clientId
            };

            connectedClient.x = client.x 
                ? client.x
                : 0;

            connectedClient.y = client.y
                ? client.y
                : 0;

            connectedClients.push(connectedClient);

            const addNewClientObject = {
                type: "addpeer",
                clientId: newClient.clientId,
                x: newClient.x,
                y: newClient.y
            };

            sendResponse(client.peer, addNewClientObject, client.clientId);
        }

        clients.push(newClient);

        peer.on("message", function(packet, channel) {
            console.log("Message received from " + peer._pointer);

            const gameObject = JSON.parse(packet.data().toString());
            console.log(gameObject);
            const messageText = "Got packet from " + gameObject.client_id + " with message_type of " + gameObject.message_type;

            const clientId = gameObject.client_id;
            const messageType = gameObject.message_type;

            if (messageType === "move") {
                const xPos = gameObject.x;
                const yPos = gameObject.y;

                for (const client of clients) {
                    if (client.clientId === clientId) {
                        client.x = xPos;
                        client.y = yPos;
                        lastActivity = getUtcTimestamp();
                    } else {
                        const positionUpdateObject = {
                            type: "peermove",
                            clientId: clientId,
                            x: xPos,
                            y: yPos
                        };
    
                        sendResponse(client.peer, positionUpdateObject, client.clientId);
                    }
                }
            } else if (messageType === "ping") {
                for (const client of clients) {
                    if (client.clientId === clientId) {
                        client.lastActivity = getUtcTimestamp();
                        break;
                    }
                }

                sendResponse(peer, { type: "pong" }, clientId)
            } else if (messageType === "login") {
                //console.log('test');
                if (gameObject.data.player_username === "guest" && gameObject.data.password === "password"){
                    const loginSucceededObject = {
                        type: "login_response",
                        clientId: clientId,
                        value: "true"
                    };
                    peer.legitAccount = true;
                    sendResponse(peer, loginSucceededObject, "");
                    console.log(loginSucceededObject);
                    lastActivity = getUtcTimestamp();
                }
            } else if (messageType === "request_map_list") {
                if(peer.legitAccount){
                    const mapListObject = {
                        type: "map_list",
                        clientId: clientId,
                        value: "MAP01"
                    };
                    sendResponse(peer, mapListObject, "");
                    console.log(mapListObject);
                    lastActivity = getUtcTimestamp();
                }
            } 
            else if (messageType === "request_character_data") {
                if (peer.legitAccount) {
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
                    sendResponse(peer, tempPlayerDataObj, "");
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
            clientId: newClientId,
            peers: connectedClients
        };

        sendResponse(peer, clientResponse, newClientId);
    });

    host.start(50);
    console.log("Server ready on %s:%s", host.address().address, host.address().port);
});

setInterval(() => {
    let i = clients.length;

    const currentTime = getUtcTimestamp();

    while (i--) {
        if (currentTime - clients[i].lastActivity >= 60000) {
            clients.splice(i, 1);
        }
    }
}, (1000));

function sendResponse(peer, data, clientId) {
    const jsonResponse = JSON.stringify(data);

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

function generateClientId () {

    let start = "";
    let end = "";

    const utcTimestamp = getUtcTimestamp();    

    // randomized start/end
    for (let i = 0; i < 5; i++) {
        start = `${start}${Math.floor((Math.random() * 9) + 1)}`;
        end = `${end}${Math.floor((Math.random() * 9) + 1)}`;
    }

    return `${start}${utcTimestamp.toString()}${end}`;
}
