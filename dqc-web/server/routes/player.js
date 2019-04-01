var express = require('express');
var pbkdf2 = require('pbkdf2');
var router = express.Router();
var fs = require('fs');

const path = `./user-data/`;

// Create a new player
router.post('/new', (req, res) => {
    try {
        const username = req.body.username;

        const name = req.body.name;
        const gender = req.body.gender;
        const currentClass = req.body.class;

        const clvl = {
            jester: 0,
            warrior: 0, 
            priest: 0,
            thief: 0,
            mage: 0,
            budoka: 0
        };

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

module.exports = router;
