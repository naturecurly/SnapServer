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
    var content = req.body.content;
    var live_time = req.body.live_time;
    var status = req.body.status;
    var remoteId = req.body.remoteId;
    console.log(from + ', ' + to + ', ' + type + ', ' + content);
    db.getDeviceId(from, to, function (doc) {
        console.log(doc);
        var fromId = "";
        var toId = "";
        console.log('find ' + doc.length + ' docs');
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

            var messageToSend = {
                to: toId,
                data: {
                    toUser: to,
                    fromUsername: from,
                    type: type,
                    message: content,
                    live_time: live_time,
                    status: status,
                    remoteId: remoteId
                },
                notification: {
                    title: from + ' sends you a message.',
                    body: 'Click to open',
                    sound: 'default'
                }
            }

            options.body = messageToSend;
            request(options, function (err, incoming, resbonses) {
                if (err) {
                    console.log(err);
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