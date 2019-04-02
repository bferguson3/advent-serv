var express = require('express');
var fs = require('fs');
var multer = require('multer')

var router = express.Router();
var upload = multer({});

const path = `./map-data/`;
const tileDataFileName = "tiledata.json";

function createLinkHash(fileName) {
    return encodeURIComponent(Buffer.from(fileName).toString('base64'));
}

function unHashLinkHash(hash) {
    return Buffer.from(decodeURIComponent(hash), 'base64').toString()
}

// Get map name list
router.get('/', function(req, res, next) {
    try {
        const files = fs.readdirSync(path);
        const mapObjects = [];
    
        for (let i = 0; i < files.length; i++) {
            if (files[i] === tileDataFileName) {
                continue;
            }

            mapObjects.push({
                name: files[i].split('.')[0],
                link: createLinkHash(files[i])
            });
        }

        res.status(200).json(mapObjects);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get single map
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

// Upload new maps / overwrite existing maps
router.post('/', upload.any(), function(req, res, next) {
    try {
        if (!req.files) {
            res.status(500).send();    
        }

        for (const file of req.files) {
            if (file.mimetype !== 'application/json') {
                continue;
            }

            if (file.originalname === 'tiledata.json') {
                // do not allow that to be overwritten here
                res.status(500).send();  
            }

            let encoding = 'utf8';

            // weird workaround for frontend lib
            if (file.encoding && file.encoding !== '7bit') {
                encoding = file.encoding;
            }

            const fileString = file.buffer.toString(encoding, 0, file.size);
            const parsedData = JSON.parse(fileString);
            let fileName = '';

            if (parsedData.name) {
                fileName = `${parsedData.name}.json`;
            } else {
                fileName = file.originalname;
            }

            // reconvert to string
            const fileData = JSON.stringify(parsedData);
            fs.writeFileSync(`${path}/${fileName}`, fileData, 'utf8');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.delete('/:fileHash', (req, res) => {
    try {
        const fileHash = req.params["fileHash"];
        const fileName = unHashLinkHash(fileHash);
        fs.unlinkSync(`${path}/${fileName}`);
        res.status(200).json();
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
