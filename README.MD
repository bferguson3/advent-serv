# Dragoon Dice Chronicle - Server

### Usage
```
npm install
npm run serve
```

### Commands

Below is a list of commands and the data expected along with each one.

* `login`
  
    - `player_username`
    - `password`
    

* `request_map_list`

    - `[none needed]`

* `request_character_data`

    - ` `

* `list_lobbies`

    - `page (optional - will default to 0)`

* `create_lobby`

    - `mapname`
    - `locked (optional - will default to false)`

* `join_lobby`

    - `lobbyId`

* `leave_lobby`

    - `lobbyId`

* `roll_dice`

    - `count (optional - will default to 1)`
    - `sides (optional - will default to 6)`