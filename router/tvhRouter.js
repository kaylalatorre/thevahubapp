const express = require('express');
const router = express();
// const middleware = require('../middleware/tvhMiddleware');
const controller = require('../controller/tvhController');

// get
router.get('/login', controller.getLogin);
router.get('/', controller.getHome);

// post


module.exports = router;