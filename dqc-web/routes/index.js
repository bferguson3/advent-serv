var express = require('express');
var router = express.Router();
var fs = require('fs');

const path = `./user-data/`;

/* GET home page. */
router.get('/', function(req, res, next) {
  const files = fs.readdirSync(path);
  console.log(files);
  res.render('index', { title: 'Dragoon Dice Chronicle Admin', files: files });
});

module.exports = router;

/*
        const path = `${DataLoadService.USER_DATA_PATH}/${username}.json`;

        const promise = new Promise<UserData>((resolve, reject) => {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const userData: UserData = JSON.parse(data);
                    resolve(userData);
                }
            });
        });

        return promise;
*/