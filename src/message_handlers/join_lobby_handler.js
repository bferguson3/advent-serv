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

            client.lobbyId = lobbyId; // keep current id on the client
            //console.log(`client.lobbyid ${client.lobbyId}`);
            lobby.playerCount = lobby.players.length;

            joinedLobby = lobby;
        }

        break;
    }

    if (!joinedLobby) {
        return null;
    }

    const lobbyResponseObject = {
        type: "joined_lobby",
        public: "room", // "private", or "server" for different levels of publicity.
        lobby: joinedLobby
    };
    
    return lobbyResponseObject;
}
