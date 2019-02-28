export enum ResponseMessageType {
    // login shit
    Login = "login_response",

    // lobby details
    Lobby = "lobby",

    // player joined lobby
    JoinedLobby = "joined_lobby",

    // player left lobby
    PlayerLeft = "player_left",

    // list of maps
    MapList = "map_list",

    // single player data with stats calc'ed for current class
    PlayerData = "player_data",

    // get list of active lobbies
    LobbyList = "lobby_list"
}
