export function list_lobbies_handler(gameObject, client, serverData) {

    let page = 0;

    if (gameObject && gameObject.data && gameObject.data.page) {
        page = gameObject.data.page;
    }

    const lobbies = [];
    const startNum = page * 10;
    const endNum = startNum + 10;

    for (let i = startNum; i < endNum; i++) {
        if (serverData.lobbies.length >= i+1) {
            lobbies.push(serverData.lobbies[i]);
        }
    }

    const lobbyResponseObject = {
        type: "lobby_list",
        pageNum: page,
        totalCount: serverData.lobbies.length,
        lobbies: lobbies
    };

    return lobbyResponseObject;
}
