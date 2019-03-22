var express = require('express');
var router = express.Router();
var fs = require('fs');

const path = `./user-data/`;

function createLinkHash(fileName) {
    return encodeURIComponent(Buffer.from(fileName).toString('base64'));
}

function unHashLinkHash(hash) {
    return Buffer.from(decodeURIComponent(hash), 'base64').toString()
}

// Get user list
router.get('/', function(req, res, next) {
    try {
        const files = fs.readdirSync(path);
        const playerObjects = [];
    
        for (let i = 0; i < files.length; i++) {
            playerObjects.push({
                name: files[i].split('.')[0],
                link: createLinkHash(files[i])
            });
        }

        res.status(200).json(playerObjects);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get single user
router.get('/:fileHash', function(req, res, next) {
    try {
        const fileHash = req.params["fileHash"];
        const fileName = unHashLinkHash(fileHash);
        const data = fs.readFileSync(`${path}/${fileName}`, "utf8");
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
