export function login_handler(gameObject, client, serverData) {

    const loginResponseObject = {
        type: "login_response",
        clientId: client.clientId
    };

    if (gameObject.data.player_username === "guest" && gameObject.data.password === "password"){
        loginResponseObject.value = "true";
        
        client.username = gameObject.data.player_username;
        client.authenticationHash = "PUTAHASHHERE" // TOOD: put a hash here
    } else {
        loginResponseObject.value = "false";
    }

    return loginResponseObject;
}
