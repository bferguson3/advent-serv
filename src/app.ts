import { Address, createServer, Host, Peer}  from "enet";
import { ServerData } from "./entities";

export class App {

    private addr = new Address("0.0.0.0", 9521);
    private peerCount: number = 32;
    private channelCount: number = 2;
    private downLimit: number = 0;
    private upLimit: number = 0;

    public serverData: ServerData = new ServerData();

    public gameServer: Host;

    public run(): void {
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

            host.on("connect", function(peer: Peer, data: any) {

                console.log(`Peer ${peer._pointer} connected`);
        
                const newClient = {
                    clientId: peer._pointer,
                    lastActivity: util.getUtcTimestamp(),
                    authenticationHash: null,
                }
            }
        })
    }
}
