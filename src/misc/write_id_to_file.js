const Discord = require('discord.js');
const fs = require('fs');
var ids = [];
var idfile = null;


module.exports.updateIds = function(guild) {
    var members = guild.members;
    idfile = fs.createWriteStream(`${guild.name.replace(/ /g, '_').toLowerCase()}_ids.txt`);
    members.forEach(addid);
    /*ids.forEach(id => {
        file.write(`${id}\n`);
    });*/
    idfile.end();
}

function addid(value, key, map) {
    if (!value.user.bot) {
        idfile.write(`${value.displayName}: ${value.user.id}\n`);
        //ids.push(value.user.id);
    }
}