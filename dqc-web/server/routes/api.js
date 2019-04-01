const express = require('express');
const router = express.Router();
const user = require('./user');
const player = require('./player');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.use('/user', user);
router.use('/player', player);

module.exports = router;