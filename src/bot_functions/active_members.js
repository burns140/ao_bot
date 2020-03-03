const Discord = require('discord.js');

/**
 * Iterates through each member in the guild and sees if they have sent a recent message in our server
 * If yes, add them to array.
 * Send string with all member names when complete
 */
module.exports.activeMembers = function(guild, sendChannel) {
    var memberArr = [];
    var memberstr = "";
    guild.members.forEach((value, key, map) => {
        if (value.lastMessage) {
            if (!memberArr.includes(value.user.id) && !value.user.bot) {
                memberArr.push(value.user.id);
                memberstr += value.user.username;
                memberstr += '\n';
            }
        }
    });
    console.log(memberstr);
    sendChannel.send({
        embed: {
            'title': "Recently active members",
            'description': memberstr
        }
    }).catch(err => {
        console.log(err);
    });
}