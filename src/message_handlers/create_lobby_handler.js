import { createLobbyId } from "../util";

export function create_lobby_handler(gameObject, client, serverData) {

    let isLocked = false;
    let mapname = "";

    if (gameObject && gameObject.data) {
        if (gameObject.data.mapname) {
            mapname = gameObject.data.mapname;
        }

        if (gameObject.data.isLocked) {
            isLocked = gameObject.data.locked;
        }
    }

    if (!mapname) {
        // TODO: return error
    }

    const lobby = {
        id: createLobbyId(),
        mapname: mapname,
        isLocked: isLocked,
        user: client.username,
        userId: client.clientId,
        playerCount: 1,
        players: [
            {
                clientId: client.clientId,
                user: client.username
            }
        ]
    };

    serverData.lobbies.push(lobby);

    const lobbyResponseObject = {
        type: "lobby",
        lobby: lobby
    };

    return lobbyResponseObject;
}
