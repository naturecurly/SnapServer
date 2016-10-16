/**
 * Created by leveyleonhardt on 10/1/16.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var mime = require('mime');

var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    }
);
var upload = multer({storage: storage});

router.post('/upload', upload.single('image'), function (req, res, next) {
    var file = req.file;
    var des_file = file.originalname;
    var extentionName = mime.extension(file.mimetype);
    console.log(mime.extension(file.mimetype));
    console.log(des_file);
    fs.readFile(file.path, function (err, data) {
        if (err) {
            console.log('read file error');
            res.send({success: false, message: 'Upload failed'});
        } else {
            res.send({success: true, message: file.path})
        }
    });
});

module.exports = router;
