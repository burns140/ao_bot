const Discord = require('discord.js');
const fs = require('fs');
var ids = [];
var idfile = null;

/**
 * Get the id of every member in the server and write it to a file in format "username: id"
 */
module.exports.updateIds = function(guild) {
    var members = guild.members;
    idfile = fs.createWriteStream(`./src/misc/${guild.name.replace(/ /g, '_').toLowerCase()}_ids.txt`);
    members.forEach(addid);
    /*ids.forEach(id => {
        file.write(`${id}\n`);
    });*/
    idfile.end();
    return true;
}

/**
 * Manually add an id to the file
 */
function addid(value, key, map) {
    if (!value.user.bot) {
        idfile.write(`${value.displayName}: ${value.user.id}\n`);
        //ids.push(value.user.id);
    }
}