/**
 * Created by leveyleonhardt on 10/8/16.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../database/db');


var options = {
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    json: true,
    headers: {
        'Authorization': 'key=AIzaSyBwdfwS1CuJJO0Tph9Yvz3-xLj1LqZpZSY',
        'Content-Type': 'application/json'
    }
};

router.post('/send', function (req, res, next) {
    var from = req.body.from;
    var to = req.body.to;
    var type = req.body.type;
    var message = req.body.message;
    db.getDeviceId(from, to, function (doc) {
        console.log(doc);
        var fromId = "";
        var toId = "";
        if (doc.length != 2) {
            res.sendStatus(500);
        } else {
            for (var i = 0; i < 2; ++i) {
                if (doc[i].username == from) {
                    fromId = doc[i].device_id;
                } else {
                    toId = doc[i].device_id;
                }

            }

            var message = {
                to: toId,
                data: {
                    type: type,
                    message: message
                },
                notification: {
                    title: from + 'sends you a message.',
                    body: 'Click to open',
                    sound: 'default'
                }
            }

            options.body = message;
            request(options, function (err, incoming, resbonses) {
                if (err) {
                    console.log('error');
                    res.sendStatus(500);
                } else {
                    res.send(resbonses);
                }
            })
        }
    }, function () {
        res.sendStatus(500);
    });
});

module.exports = router;