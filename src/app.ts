import { Address, createServer, Host, Packet, PACKET_FLAG, Peer } from "enet";
import { RequestMessageType, ResponseMessageType, VisibilityLevelType } from "./enums";
import { IResponseObject } from "./interfaces";
import { LoginMessageHandler, MessageHandlerBase, UpdateMessageHandler, WorldStateMessageHandler } from "./message-handlers";
import { Player, ServerData } from "./models";
import { DataService, ServerService } from "./services";

export class App {

    private readonly addr = new Address("0.0.0.0", 33111);
    private readonly peerCount: number = 64;
    private readonly channelCount: number = 2;
    private readonly downLimit: number = 0;
    private readonly upLimit: number = 0;
    private readonly loopIntervalMs: number = 10;
    private readonly missedPacketThreshold: number = 25;
    private readonly serverData: ServerData = new ServerData(this.peerCount);

    private gameServer: Host;

    public async start(): Promise<void> {
        console.info("Starting server...");

        await DataService.setupDataService();

        this.gameServer = createServer({
            address: this.addr,
            peers: this.peerCount,
            channels: this.channelCount,
            down: this.downLimit,
            up: this.upLimit
        }, (err: any, host: Host) => {
            if (err) {
                console.error("Error starting server", err);
                return;
            }

            host.on("connect", (peer: Peer, data: any) => {
                console.info(`Peer ${peer._pointer} connected`);

                const newPlayer = new Player();
                newPlayer.id = peer._pointer;
                newPlayer.lastActivity = ServerService.GetCurrentUtcDate();

                this.serverData.players[peer._pointer] = newPlayer;
                peer.playerId = newPlayer.id;

                peer.on("disconnect", () => {
                    this.handleDisconnect(peer.playerId);
                });

                peer.on("message", (packet: Packet, channel: number) => {
                    const player = this.serverData.players[peer._pointer];

                    if (!player) {
                        const message = `Invalid player ${peer._pointer}`;
                        this.handleFailure(new Error(message), message, peer);
                    }

                    player.lastActivity = ServerService.GetCurrentUtcDate();

                    try {
                        const gameObject = JSON.parse(packet.data().toString());

                        let messageHandler: MessageHandlerBase = null;

                        switch (gameObject.message_type) {
                            case RequestMessageType.Update:
                                messageHandler = new UpdateMessageHandler(gameObject, player, this.serverData);
                                break;
                            case RequestMessageType.Login:
                                messageHandler = new LoginMessageHandler(gameObject, player, this.serverData);
                                break;
                            case RequestMessageType.State:
                                messageHandler = new WorldStateMessageHandler(gameObject, player, this.serverData);
                                break;
                            default:
                                // unsupported messaage
                                throw new Error("Unsupported message");
                                break;
                        }

                        this.executeMessageHandler(
                            peer,
                            messageHandler,
                            player);

                    } catch (err) {
                        this.handleFailure(
                            err,
                            `Received malformed packet data from Peer ${peer._pointer}`,
                            peer);
                    }
                });
            });

            host.start(this.loopIntervalMs);

            console.info("Server ready on %s:%s", host.address().address, host.address().port);
        });
    }

    private executeMessageHandler(
        peer: any,
        messageHandler: MessageHandlerBase,
        player: Player): void {

        try {
            if (messageHandler !== null) {
                const responseObjectsPromise: Promise<IResponseObject[]> = messageHandler.handleMessage();

                responseObjectsPromise.then((responseObjects: IResponseObject[]) => {
                    if (responseObjects) {
                        for (const responseObject of responseObjects) {
                            if (!responseObject) {
                                continue;
                            }

                            if (responseObject.visibility === VisibilityLevelType.World) {
                                // send response to all players
                            } else if (responseObject.visibility === VisibilityLevelType.Map) {
                                // send response to players nearby
                            } else if (responseObject.visibility === VisibilityLevelType.Private) {
                                this.sendResponse(peer, responseObject, player);
                            }
                        }
                    }
                }, (rejectionReason) => {
                    throw new Error(rejectionReason);
                });
            }
        } catch (err) {
            this.handleFailure(err, `Error processing response to ${player.id}`, peer);
        }
    }

    private handleFailure(err: any, logMessage: string, peer: Peer): void {
        console.error(err);
        console.info(logMessage);

        if (peer) {
            const numMissed = peer.numMissed ? peer.numMissed : 1;
            peer.numMissed = numMissed + 1;

            if (numMissed > this.missedPacketThreshold) {
                this.handleDisconnect(peer._pointer);
                peer.disconnectNow();
            }
        }
    }

    private handleDisconnect(peerId: number) {
        console.info(`Peer ${peerId} disconnected`);

        if (peerId) {
            delete this.serverData.players[peerId];
        }
    }

    private sendResponse(peer: Peer, responseObject: IResponseObject, player: Player): void {

        const responseData = responseObject.data;
        const jsonResponse = JSON.stringify(responseData);
        let playerId: number = null;

        if (player && player.id) {
            playerId = player.id;
        }

        peer.send(responseObject.channel, jsonResponse, (err: any) => {
            if (err) {
                this.handleFailure(err, `Error sending packet to ${peer._pointer}`, peer);
            } else {
                peer.numMissed = 0;

                // don't log if ping
                //if (responseData.type === ResponseMessageType.PingResponse) {
                //    return;
                //}

                let message: string = `Message sent successfully to ${playerId ? playerId : "--"}`;

                if (responseData.type) {
                    message += ` with message type of ${responseData.type}`;
                }

                console.info(message);
            }
        });
    }
}
