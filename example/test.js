var test = require("../index");

(async () => {
    const rootDir = await test(__dirname);
    console.log("1:" + rootDir);
})();

// setTimeout(function () {
    test().then(function (root) {
        console.log("2:" + root);
    });
// },0)

