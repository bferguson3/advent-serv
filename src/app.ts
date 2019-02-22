import { Address, createServer, Host, Packet, Peer}  from "enet";
import { ServerData, GameClient } from "./entities";
import { GameUtilities } from "./utilities";

export class App {

    private addr = new Address("0.0.0.0", 9521);
    private peerCount: number = 32;
    private channelCount: number = 2;
    private downLimit: number = 0;
    private upLimit: number = 0;
    private loopIntervalMs: number = 50;
    private maintenanceIntervalHandleId: number;
    private maintenanceIntervalPeriod: number = 1000;
    private clientInactivityThresholdMs: number = 60000;

    public serverData: ServerData = new ServerData();

    public gameServer: Host;

    public start(): void {
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

                    let messageHandler = null;
                });
            });
        });

        this.gameServer.start(this.loopIntervalMs);
        this.maintenanceIntervalHandleId = setInterval(() => {
            this.runMaintenence();
        }, this.maintenanceIntervalPeriod);
    }

    public stop(): void {
        if (this.maintenanceIntervalHandleId) {
            clearInterval(this.maintenanceIntervalHandleId);
        }

        this.gameServer.stop();
    }

    private runMaintenence(): void {
        let i = this.serverData.clients.length;
        const currentTime = GameUtilities.getUtcTimestamp();

        while (i--) {
            if (!this.serverData.clients[i] || currentTime - this.serverData.clients[i].lastActivity >= this.clientInactivityThresholdMs) {
                this.serverData.clients.splice(i, 1);
            }
        }
    }

    private sendResponse(peer: Peer, data: any, client: GameClient): void {
        const jsonResponse = JSON.stringify(data);
        let clientId = "";

        if (client && client.clientId) {
            clientId = client.clientId;
        }

        peer.send(0, jsonResponse, (err: any) => {
            if (err) {
                console.log("Error sending packet");
            } else {
                console.log(`Message sent successfully to ${clientId}`);
            }
        });
    }
}
