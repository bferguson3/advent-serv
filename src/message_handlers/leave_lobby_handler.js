import { createLobbyId } from "../util";

export function create_lobby_handler(gameObject, client, serverData) {

    let lobbyId = "";
    const clientId = client.clientId;

    // TODO: extract this same logic out for kicking another player

    if (gameObject && gameObject.data) {
        if (gameObject.data.lobbyId) {
            lobbyId = gameObject.data.lobbyId;
        }
    }

    if (!lobbyId) {
        // TODO: return error
        return null;
    }

    for (let i = 0; i < serverData.lobbies.length; i++) {

        const lobby = serverData.lobbies[i];

        if (lobby.id === lobbyId) {
            for (let j = 0; j < lobby.players.length; j++) {
                if (lobby.players[j].clientId === clientId) {
                    lobby.players.splice(j, 1);

                    lobby.playerCount = lobby.players.length;

                    if (lobby.playerCount === 0) {
                        serverData.lobbies.splice(i, 1);
                    }

                    break;
                }
            }
        }

        break;
    }

    return null;
}
