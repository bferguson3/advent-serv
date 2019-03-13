export enum ResponseMessageType {
    // login shit
    Login = "login_response",

    // lobby details
    Lobby = "lobby",

    // player joined lobby
    JoinedLobby = "joined_lobby",

    // player left lobby
    PlayerLeft = "player_left",

    // single player data with stats calc'ed for current class
    PlayerData = "player_data",

    // get list of active lobbies
    LobbyList = "lobby_list",

    // expects 'pong' in response
    Ping = "ping",

    // contains minimal char info to broadcast to whole lobby
    UpdateLobbyCharacter = "update_lobby_character",

    // trying to join a full lobby
    LobbyFull = "lobby_full",

    // sends an approval to start a lobby
    StartGame = "start_game",

    // a player in the same lobby dropped for being idle
    PlayerIdleDrop = "player_idle_drop",

    // a player requested a die roll
    DiceRollResult = "dice_roll_result",

    // get the current game state
    GameState = "game_state"
}
