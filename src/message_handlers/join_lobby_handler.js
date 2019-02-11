export function join_lobby_handler(gameObject, client, serverData) {

    let lobbyId = "";
    let joinedLobby = null;

    if (gameObject && gameObject.data && gameObject.data.lobbyId) {
        lobbyId = gameObject.data.lobbyId;
    }

    if (!lobbyId) {
        // TODO: return error
        return null;
    }

    for (const lobby of serverData.lobbies) {
        if (lobby.id === lobbyId) {
            lobby.players.push({
                clientId: client.clientId,
                user: client.username
            });

            lobby.playerCount = lobby.players.length;

            joinedLobby = lobby;
        }

        break;
    }

    if (!joinedLobby) {
        return null;
    }

    const lobbyResponseObject = {
        type: "lobby",
        lobby: joinedLobby
    };

    return lobbyResponseObject;
}
