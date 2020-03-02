const fs = require('fs');
const template = require('es6-template-strings');
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');

const user = {
    name: "testname"
}

var data = fs.readFileSync("./testString.txt", "utf8");
var compiled = compile(data);

console.log(content);


