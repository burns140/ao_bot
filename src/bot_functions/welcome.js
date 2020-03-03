const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');

/**
 * Send welcome message to new members
 */
module.exports.welcome = function(compiled, member) {
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

/* Send the current welcome message in plaintext */
module.exports.viewMessage = function(data, sendChannel) {
    var sendMessage = `Welcome message is currently\n----------------------------\n${data}`;
    sendChannel.send(sendMessage);
}

/* Set the welcome message and write to a file so it can be read on server reboot */
module.exports.setMessage = function(newMessage, sendChannel) {
    try {
        fs.writeFileSync("./src/resources/welcomeMessage.txt", newMessage);
        var sendMessage = `Welcome message has been set to\n----------------------------\n${newMessage}`;
        sendChannel.send(sendMessage);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}