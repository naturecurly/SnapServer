/**
 * Created by leveyleonhardt on 8/28/16.
 */

module.exports.cryptoMethod = {
    md5: function (str) {
        return require('crypto').createHash('md5').update(str).digest('hex');
    }
}