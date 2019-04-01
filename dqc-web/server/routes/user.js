var express = require('express');
var pbkdf2 = require('pbkdf2');
var router = express.Router();
var fs = require('fs');

const path = `./user-data/`;

function createLinkHash(fileName) {
    return encodeURIComponent(Buffer.from(fileName).toString('base64'));
}

function unHashLinkHash(hash) {
    return Buffer.from(decodeURIComponent(hash), 'base64').toString()
}

function createAuthHash(password, salt) {
    const result = pbkdf2.pbkdf2Sync(password, salt, 100, 64, 'sha512');
    return result.toString('base64');
}

function createSalt() {
    const length = 24;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');

    let id = '';

    for (let i = 0; i < length; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;
}

function getUtcDate() {
    const now = new Date();

    const utcNow = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() ,
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
    ));

    return utcNow;
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

// Create a new user
router.post('/new', (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        // user already exists
        if (fs.existsSync(`${path}/${username}.json`)) {
            res.status(500).send("User already exists");
            return;
        }

        const salt = createSalt();
        const hash = createAuthHash(password, salt);

        const passwordData = {
            passwordSalt: salt,
            passwordHash: hash,
            creationDate: getUtcDate()
        };

        var newUser = {
            username: username,
            currentPasswordData: passwordData,
            playerData: [],
            passwordHistory: [passwordData],
            lastLoginDate: null
        };

        const fileData = JSON.stringify(newUser);

        fs.writeFileSync(`${path}/${username}.json`, fileData, 'utf8');

        res.status(200).send(newUser);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
    
    console.log(req.body);
});

module.exports = router;
