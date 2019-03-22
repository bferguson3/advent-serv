const express = require('express');
const router = express.Router();
const user = require('./user');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.use('/user', user);

module.exports = router;