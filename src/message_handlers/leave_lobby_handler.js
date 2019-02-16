export function leave_lobby_handler(gameObject, client, serverData) {

    let lobbyId = null;
    const clientId = client.clientId;
    let playerSlot = 0;
    // TODO: extract this same logic out for kicking another player
    
    if (gameObject && gameObject.data) {
        if (gameObject.data.lobbyId) {
            lobbyId = gameObject.data.lobbyId;
        }
    }

    if (!lobbyId) {
        // TODO: return error
        console.log(`${clientId} tried to leave a lobby, but didn't give a lobbyId`);
        return null;
    }

    for (let i = 0; i < serverData.lobbies.length; i++) {

        const lobby = serverData.lobbies[i];

        if (lobby.id === lobbyId) {
            for (let j = 0; j < lobby.players.length; j++) {
                if (lobby.players[j].clientId === clientId) {
                    playerSlot = j+1;
                    lobby.players.splice(j, 1);

                    lobby.playerCount = lobby.players.length;

                    if (lobby.playerCount === 0) {
                        serverData.lobbies.splice(i, 1);
                        console.log("Lobby empty; closed.");
                    }

                    break;
                }
            }
        }

        break;
    }

    const lobbyLeftObject = {
        type: "player_left",
        public: "room", // "private", or "server" for different levels of publicity.
        player: playerSlot
    };

    return lobbyLeftObject;
}
