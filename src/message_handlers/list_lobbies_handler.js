export function list_lobbies_handler(gameObject, client, serverData) {

    const lobbiesPerPage = 10;
    let page = 0;

    if (gameObject && gameObject.data && gameObject.data.page) {
        page = gameObject.data.page;
    }

    const lobbies = [];
    const startNum = page * lobbiesPerPage;
    const endNum = startNum + lobbiesPerPage;

    for (let i = startNum; i < endNum; i++) {
        if (serverData.lobbies.length >= i+1) {
            lobbies.push(serverData.lobbies[i]);
        }
    }

    const lobbyResponseObject = {
        type: "lobby_list",
        pageNum: page,
        pageCount: serverData.lobbies.length === 0
            ? 1
            : Math.ceil(serverData.lobbies.length / lobbiesPerPage),
        totalCount: serverData.lobbies.length,
        lobbies: serverData.lobbies
    };

    return lobbyResponseObject;
}
