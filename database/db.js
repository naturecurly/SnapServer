/**
 * Created by leveyleonhardt on 8/27/16.
 */

var settings = require('../settings');
var mongoose = require('mongoose');


mongoose.connect(settings.dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('we are connected');
});

var userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    birthday: Date,
    mobile: String,
    email: {type: String, unique: true},
    password: String,
    avatar: String,
    friend: [String],
    device_id: String,
    subscribeIds: [String]
});

var User = mongoose.model('users', userSchema);

exports.createUser = function (data) {
    return new User(data);
};

exports.login = function (email, password, callback, notFound) {
    User.findOne({email: email, password: password}, function (err, doc) {
        if (err) {

        }
        if (doc) {
            if (password == doc.password) {
                callback(doc);
            } else {
                notFound();
            }
        } else {
            console.log("not found");

            notFound();
        }
    });
};

exports.checkUsername = function (username, found, notFound) {
    User.findOne({username: username}, function (err, doc) {
        if (err) {

        }
        if (doc) {
            console.log(doc);
            found();
        } else {
            notFound();
        }
    });
};

exports.checkEmail = function (email, found, notFound) {
    User.findOne({email: email}, function (err, doc) {
        if (err) {

        }
        if (doc) {
            found();
        } else {
            notFound();
        }
    });
};

exports.addFriend = function (account, username, success, fail) {
    if (account == username) {
        fail();
    } else {
        User.findOne({username: account}, function (err, doc) {
            if (doc) {
                User.findOne({username: username}, function (err, doc) {
                    if (doc) {
                        User.update({username: account}, {$addToSet: {friend: username}}, function (err, doc) {
                            if (doc.nModified == 0) {
                                fail();
                            } else {
                                success();
                            }
                        });
                    } else {
                        fail();
                    }
                });
            } else {
                fail();
            }
        });
    }
};

exports.updateDeviceId = function (username, deviceId, success, fail) {
    User.findOneAndUpdate({username: username}, {device_id: deviceId}, function (err, doc) {
        if (err) {
            console.log("update error!");
            fail();
        } else {
            if (doc) {
                console.log(doc);
                success(doc);
            } else {
                fail();
            }
        }
    });
};

exports.getDeviceId = function (from, to, success, fail) {
    User.find({username: {$in: [from, to]}}, function (err, doc) {
        if (err) {
            console.log("failed to find id");
            fail();
        } else {
            if (doc) {
                success(doc);
            } else {
                fail();
            }
        }
    });
};

