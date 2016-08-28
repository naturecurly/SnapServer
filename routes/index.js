var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    res.set('Content_Type', 'application/json');
    res.send(JSON.stringify({name: 'Leon', age: '25'}));
});

module.exports = router;
