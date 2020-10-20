# InAdvent - Server

### Dependencies
```
$ sudo apt install nodejs
$ sudo apt-get install npm
```
### Usage
```
$ npm install
$ npm run serve
```

### Commands

All messages sent to the server are expected to have a `message_type` property that defines the command.

Message responses will all include a `type` property that indicates how the client should parse the message and a `visibility` property that indicates the audience for the message.

Below is a list of commands.

* `get_ping`
    - Exists mainly as a debug tool. Does not expect any data to be sent with the command.
    - Response data:
    ```
    {
        type: string = "ping_response",
        visibility: string = "private",
        playerId: integer = [player's peer identification],
        lastActivity: Date? = [player's last message receipt UTC Date/Time]
    }
    ```

* `pong`
    - Exists mainly as a debug tool. Lets the server know that the client is still connected for printable messages via code. No response is sent to the client.

