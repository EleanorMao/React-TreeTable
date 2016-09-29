/**
 * Created by BG236557 on 2016/9/29.
 */
var fs = require('fs');

var installed = false;

function install(extension) {

    if (installed) {
        return;
    }

    require.extensions[extension || '.css'] = function() {
        return false;
    };

    installed = true;
}

module.exports = {
    install: install
};