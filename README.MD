# InAdvent - Server

### Dependencies
```
$ sudo apt install nodejs
$ sudo apt-get install npm
```
### Usage
```
$ npm install
$ npm start
```

### Commands

All messages sent to the server are expected to have a `message_type` property that defines the command.

Message responses will all include a `type` property that indicates how the client should parse the message and a `visibility` property that indicates the audience for the message.

Below is a list of commands.

* `get_ping` (deprecated)
    - Exists mainly as a debug tool. Does not expect any data to be sent with the command.
    - Response data:
    ```
    {
        type: string = "ping_response",
        visibility: string = "private",
        playerId: integer = [player's peer identification],
        ts: integer = [player's last message receipt UTC timestamp]
    }
    ```

* `pong`
    - Exists mainly as a debug tool. Lets the server know that the client is still connected for printable messages via code. No response is sent to the client.

* `login`
    - If user does not exist when login is initiated, new player will be created with the password that was entered
    - If user does exist, user will be authenticated
    - Expected packet:
    ```
    {
        message_type = "login",
        data = {
            username: [username],
            password: [password]
        }
    }
    ```
    - Response data:
    ```
    {
        type: string = "login_response",
        visibility: string = "private",
        ts: integer = [player's last message receipt UTC timestamp]
        player: player state object
    }
    ```


* `update` (requires authentication)
    - Updates player state. Send entire player object to be updated in data.


If a packet requires authentication and the player has not yet logged in, the server will respond with the following packet:
```
    {
        type: string = "unauthenticated",
        visibility: string = "private",
        ts: integer = [player's last message receipt UTC timestamp]
    }
```

### Global messages

The server will send out world update packets to players on a regular interval. These messages are as follows:

```
{
    type: string = "state",
    ts: integer = UTC timestamp,
    data: {
        players: [{
            id: integer,
            lastActivity: number? = UTC timestamp,
            pos: Vector3,
            rot: Vector4,
            lHandPos: Vector3,
            lHandRot: Vector4,
            lHandObj: string,
            rHandPos: Vector3,
            rHandRot: Vector4,
            rHandObj: string,
            faceTx: string,
            bodyTx: string
        }],
        enemies: [{
            enemyType: string,
            hp: integer,
            target: string,
            pos: Vector3,
            rot: Vector4
        }]
    }
}
```


### Channel usage

Enet provides the ability to use multiple channels. Best practice is to separate communication into channels logically for performance.

For this server channels are used as follows:

* 0 : Base bi-directional game communication
* 1 : Server to client broadcasts 

