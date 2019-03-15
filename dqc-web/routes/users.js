var express = require('express');
var router = express.Router();
var fs = require('fs');

const path = `./user-data/`;

function unHashLinkHash(hash) {
  return Buffer.from(decodeURIComponent(hash), 'base64').toString()
}

/* GET users listing. */
router.get('/:fileHash', function(req, res, next) {
  const fileHash = req.params["fileHash"];
  const fileName = unHashLinkHash(fileHash);

  const data = fs.readFileSync(`${path}/${fileName}`, "utf8");
  const parsedData = JSON.parse(data);

  res.render('user', { title: `Dragoon Dice Chronicle Admin - ${parsedData.username}`, userData: parsedData });
});

module.exports = router;
