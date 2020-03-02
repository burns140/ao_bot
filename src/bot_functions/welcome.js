const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')
const resolveToString = require('es6-template-strings/resolve-to-string');

/**
 * Send welcome message to new members
 */
module.exports.welcome = function(member) {
    if (member.bot) {
        return;
    }
    var greeting = `Welcome to Alpha-Omega!!` 
    var message = resolveToString(compiled, member);
    console.log(message);

    let data = {
        'embed': {
            'title': greeting,
            'description': message
        }
    }

    member.user.send(data);
}

module.exports.getMessage = function(sendChannel) {
    if (member.bot) {
        return;
    }
    sendChannel.send(data);
}