var path = require("path");
var fs = require("fs");
var Q = require("./lib/q");
var access = Q.denodeify(fs.access);

let getRootDir = async function (dir) {
    if (!dir) {
        dir = process.cwd();
    }
    try {
        await access(dir + path.sep + "package.json");
    } catch (e) {
        let obj = path.parse(dir);
        if (obj.root === dir) {//代表到了根目录
            return null;
        }
        let parentDir = path.dirname(dir);//返回目录名
        if (!parentDir) {
            return null;
        }
        return getRootDir(parentDir);
    }
    return dir;
};

module.exports = getRootDir;

