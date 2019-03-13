import { Address, createServer, Host, Packet, Peer} from "enet";
import { GameLobbyModel } from "./client-models";
import { GameClient, IResponseObject, ServerData } from "./entities";
import { RequestMessageType, ResponseMessageType, VisibilityLevelType } from "./enums";
import { CreateLobbyHandler, JoinLobbyHandler, LeaveLobbyHandler, ListLobbiesHandler, LoginHandler, RequestCharacterDataHandler, RollDiceHandler, StartGameHandler, UpdateLobbyCharacterHandler } from "./message-handlers";
import { MesssageHandlerBase } from "./message-handlers/message-handler-base.handler";
import { MapService } from "./services/map.service";
import { GameUtilities } from "./utilities";

export class App {

    public serverData: ServerData = new ServerData();
    public gameServer: Host;

    private addr = new Address("0.0.0.0", 9521);
    private peerCount: number = 32;
    private channelCount: number = 2;
    private downLimit: number = 0;
    private upLimit: number = 0;
    private loopIntervalMs: number = 50;
    private maintenanceIntervalHandleId: number;
    private maintenanceIntervalPeriod: number = 1000;
    private clientInactivityThresholdMs: number = 60000;
    private clientPingThresholdMs: number = 10000;

    public async start(): Promise<void> {
        console.log("Loading Tiles...");
        this.serverData.tiles = await MapService.loadTileData();
        console.log(`${this.serverData.tiles.length} Tiles Loaded`);

        console.log("Loading Maps...");
        this.serverData.maps = await MapService.loadAllMaps(this.serverData.tiles);
        console.log(`${this.serverData.maps.length} Maps Loaded`);

        console.log("Starting Server...");

        this.gameServer = createServer({
            address: this.addr,
            peers: this.peerCount,
            channels: this.channelCount,
            down: this.downLimit,
            up: this.upLimit
        }, (err: any, host: Host) => {
            if (err) {
                return;
            }

            host.on("connect", (peer: Peer, data: any) => {

                console.log(`Peer ${peer._pointer} connected`);

                const newClient: GameClient = new GameClient();
                newClient.clientId = peer._pointer;
                newClient.peerRef = peer;
                newClient.lastActivity = GameUtilities.getUtcTimestamp();
                newClient.authenticationHash = null;

                this.serverData.clients.push(newClient);

                peer.on("message", (packet: Packet, channel: number) => {
                    const clientId = peer._pointer;
                    const client = this.serverData.getUser(clientId);

                    // TODO: send back some nasty message saying they need to reconnect because they've been dropped for inactivity
                    if (!client) {
                        return;
                    }

                    client.lastActivity = GameUtilities.getUtcTimestamp();
                    const gameObject = JSON.parse(packet.data().toString());

                    console.log(`Got packet from ${client.clientId} with message_type of ${gameObject.message_type}`);

                    const messageType = gameObject.message_type;

                    let messageHandler: MesssageHandlerBase = null;

                    // anonymous handlers (login)
                    if (messageType === RequestMessageType.Login) {
                        messageHandler = new LoginHandler(gameObject, client, this.serverData);
                    } else {
                        // non anonymous handlers - check auth hash
                        // TODO: make sure hash matches
                        if (client.authenticationHash) {
                            switch (messageType) {
                                case RequestMessageType.Pong:
                                    // basically just do nothing other than update the activity time
                                    return;
                                case RequestMessageType.RequestCharacterData:
                                    messageHandler = new RequestCharacterDataHandler(gameObject, client, this.serverData);
                                    break;
                                case RequestMessageType.ListLobbies:
                                    messageHandler = new ListLobbiesHandler(gameObject, client, this.serverData);
                                    break;
                                case RequestMessageType.CreateLobby:
                                    messageHandler = new CreateLobbyHandler(gameObject, client, this.serverData);
                                    break;
                                case RequestMessageType.JoinLobby:
                                    messageHandler = new JoinLobbyHandler(gameObject, client, this.serverData);
                                    break;
                                case RequestMessageType.LeaveLobby:
                                    messageHandler = new LeaveLobbyHandler(gameObject, client, this.serverData);
                                    break;
                                case RequestMessageType.SelectLobbyCharacter:
                                    messageHandler = new UpdateLobbyCharacterHandler(gameObject, client, this.serverData);
                                    break;
                                case RequestMessageType.StartGameRequest:
                                    messageHandler = new StartGameHandler(gameObject, client, this.serverData);
                                    break;
                                case RequestMessageType.RollDice:
                                    messageHandler = new RollDiceHandler(gameObject, client, this.serverData);
                                    break;
                                default:
                                    // TODO: bad message handler
                                    break;
                            }
                        }
                    }

                    if (messageHandler !== null) {
                        const responseObjectsPromise: Promise<IResponseObject[]> = messageHandler.handleMessage();

                        responseObjectsPromise.then((responseObjects: IResponseObject[]) => {
                            if (responseObjects) {
                                for (const responseObject of responseObjects) {
                                    if (!responseObject) {
                                        continue;
                                    }

                                    if (responseObject.visibility === VisibilityLevelType.Room) {
                                        for (const lobby of this.serverData.lobbies) {

                                            if (lobby.id === client.lobbyId) {
                                                for (const player of lobby.players) {
                                                    const user = this.serverData.getUser(player.clientId);
                                                    this.sendResponse(user.peerRef, responseObject, user);
                                                }
                                                break;
                                            }
                                        }
                                    } else if (responseObject.visibility === VisibilityLevelType.Private) {
                                        this.sendResponse(peer, responseObject, client);
                                    }
                                }
                            }
                        }, (rejectionReason) => {
                            // do something with an error here
                        });
                    }
                });
            });

            host.start(this.loopIntervalMs);
            console.info("Server ready on %s:%s", host.address().address, host.address().port);
        });

        this.maintenanceIntervalHandleId = setInterval(() => {
            this.runMaintenence();
        }, this.maintenanceIntervalPeriod) as any;
    }

    public stop(): void {
        if (this.maintenanceIntervalHandleId) {
            clearInterval(this.maintenanceIntervalHandleId);
        }

        this.gameServer.stop();
    }

    // TODO: make this async so it doesn't block anything else
    private runMaintenence(): void {
        let i = this.serverData.clients.length;

        const prunedClientIds: string[] = [];

        while (i--) {
            if (!this.serverData.clients[i]) {
                this.serverData.clients.splice(i, 1);
            } else {
                const currentTime = GameUtilities.getUtcTimestamp();
                const lastActivityDelta = currentTime - this.serverData.clients[i].lastActivity;

                if (lastActivityDelta >= this.clientInactivityThresholdMs) {
                    prunedClientIds.push(this.serverData.clients[i].clientId);
                    this.serverData.clients.splice(i, 1);
                } else if (lastActivityDelta >= this.clientPingThresholdMs) {
                    this.sendPing(this.serverData.clients[i]);
                }
            }
        }

        let j = this.serverData.lobbies.length;

        while (j--) {
            let k = this.serverData.lobbies[j].players.length;
            let shouldReorderSlots: boolean = false;

            while (k--) {
                if (prunedClientIds.indexOf(this.serverData.lobbies[j].players[k].clientId) > -1) {
                    this.serverData.lobbies[j].players.splice(k, 1);
                    shouldReorderSlots = true;
                }
            }

            // no players left in this lobby, remove the lobby
            if (this.serverData.lobbies[j].players.length === 0) {
                this.serverData.lobbies.splice(j, 1);
            } else if (shouldReorderSlots) {
                // at least one player removed from the lobby, reorder slots
                // send notification to other players in lobby
                for (let l = 0; l < this.serverData.lobbies[j].players.length; l++) {
                    this.serverData.lobbies[j].players[l].slot = (l + 1);

                    // find the player ref
                    for (const client of this.serverData.clients) {
                        if (client.clientId === this.serverData.lobbies[j].players[l].clientId) {

                            const responseObject = {
                                visibility: VisibilityLevelType.Private,
                                type: ResponseMessageType.PlayerIdleDrop,
                                lobby: new GameLobbyModel(this.serverData.lobbies[j])
                            };

                            this.sendResponse(
                                client.peerRef,
                                responseObject,
                                client
                            );
                        }
                    }
                }
            }
        }
    }

    private sendPing(client: GameClient): void {
        if (!client || !client.peerRef) {
            return;
        }

        const message = {
            type: ResponseMessageType.Ping,
            visibility: VisibilityLevelType.Private
        };

        this.sendResponse(client.peerRef, message, client);
    }

    private sendResponse(peer: Peer, data: IResponseObject, client: GameClient): void {
        const jsonResponse = JSON.stringify(data);
        let clientId = "";

        if (client && client.clientId) {
            clientId = client.clientId;
        }

        peer.send(0, jsonResponse, (err: any) => {
            // don't log if ping
            if (data.type === ResponseMessageType.Ping) {
                return;
            }

            if (err) {
                console.log("Error sending packet");
            } else {
                console.log(`Message sent successfully to ${clientId}`);
            }
        });
    }
}
