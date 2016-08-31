var express = require('express');
var router = express.Router();
var db = require('../database/db');
var cryptoUtil = require('../utils/cryptoUtil');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/reg', function (req, res, next) {
    var user = req.body;
    if ('password' in user && user.password.length != 0) {
        var password_md5 = cryptoUtil.cryptoMethod.md5(user.password);
        user.password = password_md5;
    }
    console.log(user);
    db.createUser(user).save(function (err, doc) {
        if (err) {
            console.log('insert into database error');
            res.send('register fail')
        } else {
            console.log(doc);
            res.send(doc);
        }
    });

});

router.post('/login', function (req, res, next) {
    var user = req.body;
    var email = user.email;
    var password = user.password;
    db.login(email, password, function (doc) {
        res.send(doc);
    }, function () {
        res.sendStatus(500);
    })

});

router.get('/checkusername', function (req, res, next) {
    var username = req.query.username;
    db.checkUsername(username, function () {
        res.send({success: true, message: 'Exists the username'});
    }, function () {
        res.send({success: false, message: 'Don\'t exist the username'});
    });
});

router.get('/checkemail', function (req, res, next) {
    var email = req.query.email;
    db.checkEmail(email, function () {
        res.send({success: true, message: 'Exists the email'});
    }, function () {
        res.send({success: false, message: 'Don\'t exist the email'});
    });
});

module.exports = router;
