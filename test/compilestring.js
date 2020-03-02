const fs = require('fs');
const template = require('es6-template-strings');
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');

const user = {
    name: "testname"
}

var compiled = compile(fs.readFileSync("./testString.txt", "utf8"));

console.log(content);


