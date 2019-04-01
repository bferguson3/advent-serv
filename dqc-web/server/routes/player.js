var express = require('express');
var router = express.Router();
var fs = require('fs');

const path = `./user-data/`;

// Create a new player
router.post('/new', (req, res) => {
    try {
        const username = req.body.username;

        const name = req.body.name;
        const gender = req.body.gender;
        const currentClass = req.body.currentClass;

        const clvl = {
            jester: 0,
            warrior: 0, 
            priest: 0,
            thief: 0,
            mage: 0,
            budoka: 0
        };

        if (!name || !gender || !currentClass) {
            res.status(500).send("One or more required fields are missing");
            return;
        }

        // get user
        if (!fs.existsSync(`${path}/${username}.json`)) {
            res.status(500).send("User does not exist");
            return;
        }

        const data = fs.readFileSync(`${path}/${username}.json`, "utf8");
        const parsedData = JSON.parse(data);

        if (!parsedData.playerData) {
            parsedData.playerData = [];
        }

        parsedData.playerData.push({
            name: name,
            gender: gender,
            currentClass: currentClass,
            level: 1,
            classLevel: 1,
            equipment: {},
            clvl: clvl
        });

        const fileData = JSON.stringify(parsedData);

        fs.writeFileSync(`${path}/${username}.json`, fileData, 'utf8');

        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post('/delete', (req, res) => {
    try {
        const username = req.body.username;
        const playerName = req.body.playerName;
        const playerIndex = req.body.playerIndex;

        if (!username || !playerName || playerIndex === null || playerIndex === undefined) {
            res.status(500).send("Missing fields needed to find character to delete");
            return;
        }

        // get user
        if (!fs.existsSync(`${path}/${username}.json`)) {
            res.status(500).send("User does not exist");
            return;
        }

        const data = fs.readFileSync(`${path}/${username}.json`, "utf8");
        const parsedData = JSON.parse(data);

        if (!parsedData.playerData) {
            res.status(500).send("No character data to delete");
            return;
        }

        if (parsedData.playerData.length <= playerIndex) {
            res.status(500).send("Invalid index");
            return;
        } 

        const indexedPlayer = parsedData.playerData[playerIndex];

        if (indexedPlayer.name === playerName) {
            parsedData.playerData.splice(playerIndex, 1);
        } else {
            res.status(500).send("Invalid character name");
            return;
        }

        const fileData = JSON.stringify(parsedData);

        fs.writeFileSync(`${path}/${username}.json`, fileData, 'utf8');

        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;
