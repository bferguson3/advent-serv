const express = require('express');
const router = express.Router();
const user = require('./user');
const player = require('./player');
const map = require('./map');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.use('/user', user);
router.use('/player', player);
router.use('/map', map);

module.exports = router;