import { Address, createServer, Host, Packet, Peer } from "enet";
import { RequestMessageType, ResponseMessageType, VisibilityLevelType } from "./enums";
import { IResponseObject } from "./interfaces";
import { MessageHandlerBase, PingMessageHandler } from "./message-handlers";
import { Player, ServerData } from "./models";
import { ServerService } from "./services";

export class App {

    private readonly addr = new Address("0.0.0.0", 33111);
    private readonly peerCount: number = 64;
    private readonly channelCount: number = 2;
    private readonly downLimit: number = 0;
    private readonly upLimit: number = 0;
    private readonly loopIntervalMs: number = 10;
    private readonly serverData: ServerData = new ServerData(this.peerCount);

    private gameServer: Host;

    public async start(): Promise<void> {
        console.log("Starting server...");

        this.gameServer = createServer({
            address: this.addr,
            peers: this.peerCount,
            channels: this.channelCount,
            down: this.downLimit,
            up: this.upLimit
        }, (err: any, host: Host) => {
            if (err) {
                console.log("Error starting server", err);
                return;
            }

            host.on("connect", (peer: Peer, data: any) => {
                console.log(`Peer ${peer._pointer} connected`);

                const newPlayer = new Player();
                newPlayer.id = peer._pointer;
                newPlayer.lastActivity = ServerService.GetCurrentUtcDate();

                this.serverData.players[peer._pointer] = newPlayer;

                peer.on("disconnect", () => {
                    this.serverData.players[peer._pointer] = null;
                });

                peer.on("message", (packet: Packet, channel: number) => {
                    const player = this.serverData.players[peer._pointer];

                    if (!player) {
                        peer.disconnectNow();
                    }

                    player.lastActivity = ServerService.GetCurrentUtcDate();

                    try {
                        const gameObject = JSON.parse(packet.data().toString());

                        if (gameObject.message_type !== RequestMessageType.Ping) {
                            console.log(`Got packet from ${player.id} with message_type of ${gameObject.message_type}`);
                        }

                        let messageHandler: MessageHandlerBase = null;

                        switch (gameObject.message_type) {
                            case RequestMessageType.Ping:
                                messageHandler = new PingMessageHandler(gameObject, player, this.serverData);
                                break;
                            case RequestMessageType.Pong:
                                // basically just do nothing other than update the activity time
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

                    } catch(err) {
                        console.log(`Received malformed packet data from Peer ${peer._pointer}`);
                        console.log(err);
                        peer.disconnectNow();
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
            console.log(`Error processing response to ${player.id}`)
            console.log(err);
            peer.disconnectNow();
        }
    }

    private sendResponse(peer: Peer, data: IResponseObject, player: Player): void {
        const jsonResponse = JSON.stringify(data);
        let playerId: number = null;

        if (player && player.id) {
            playerId = player.id;
        }

        peer.send(0, jsonResponse, (err: any) => {
            if (err) {
                console.log("Error sending packet!");
                peer.disconnectNow();
            } else {
                // don't log if ping
                if (data.type === ResponseMessageType.PingResponse) {
                    return;
                }

                let message: string = `Message sent successfully to ${playerId ?? "--"}`;

                if (data.type) {
                    message += ` with message type of ${data.type}`;
                }

                console.log(message);
            }
        });
    }
}
