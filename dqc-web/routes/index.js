var express = require('express');
var router = express.Router();
var fs = require('fs');

const path = `./user-data/`;

function createLinkHash(fileName) {
    return encodeURIComponent(Buffer.from(fileName).toString('base64'));
}

/* GET home page. */
router.get('/', function(req, res, next) {
    const files = fs.readdirSync(path);
    const playerObjects = [];

    for (let i = 0; i < files.length; i++) {
        playerObjects.push({
            name: files[i].split('.')[0],
            link: createLinkHash(files[i])
        });
    }

    res.render('index', { title: 'Dragoon Dice Chronicle Admin', files: playerObjects });
});

module.exports = router;
