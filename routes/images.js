/**
 * Created by leveyleonhardt on 10/1/16.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/'});
var fs = require('fs');

router.post('/upload', upload.single('image'), function (req, res, next) {
    var file = req.file;
    console.log(file);
    fs.readFile(file.path, function (err, data) {
        if (err) {
            console.log('read file error');
            res.send({success: false, message: 'Upload failed'});
        } else {
            res.send({success: true, message: file.path});
        }
    })
});

module.exports = router;
