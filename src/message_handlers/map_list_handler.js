export function map_list_handler(gameObject, client, clients) {

    const mapListObject = {
        type: "map_list",
        clientId: client.clientId,
        value: "MAP01"
    };

    return mapListObject;
}
