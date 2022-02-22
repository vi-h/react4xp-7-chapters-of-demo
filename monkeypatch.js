
const fs = require('fs');
const { sync } = require('glob');

console.log("MONKEYPATCHING @EMOTION");

/**
 * React4xp is using webpack with target web (or similar) which causes emotion to use browser version of files.
 * We cannot change webpack target (breaks r4xp) so we need to patch out the browser files.
 */

sync('./node_modules/@emotion/*/package.json').forEach(src => {
    const package = JSON.parse(fs.readFileSync(src, 'utf-8'));
    const browser = package.browser;
    delete package.browser;
    if (browser) {
        package._browser = browser;
    }
    fs.writeFileSync(src, JSON.stringify(package, null, 2))

});


/**
 * The default isBrowser check is not working on our platform (document is {}) so we need to make it more specific
 */

const esmPath = "./node_modules/@emotion/cache/dist/emotion-cache.esm.js";
const esmFile = fs.readFileSync(esmPath, 'utf-8');
const fixedFile = esmFile.replace("var isBrowser = typeof document !== 'undefined';", "var isBrowser = typeof document !== 'undefined' && document && document.querySelectorAll;");
fs.writeFileSync(esmPath, fixedFile)
