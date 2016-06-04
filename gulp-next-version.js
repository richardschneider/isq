'use strict';

var git = require('gulp-git'),
    semver = require('semver');

function version(cb) {
    git.exec({args :'describe --all --tags --abbrev=0 --match=v*'}, function(err, stdout) {
        if (err) return cb(err);
        var tag = stdout.trim();
        var ver = semver.clean(tag);
        if (!semver.valid(ver))
            ver = '0.0.0';
        var info = {
            current: {
                tag: tag,
                version: ver
            },
            next: {}
        };
        ['major', 'minor', 'patch'].forEach(function(r) {
            var next = semver.inc(ver, r);
            info.next[r] = {
                tag: 'v' + next,
                version: next
            };
        });
        cb(null, info);
    });
}

module.exports = version;
