const Discord = require('discord.js');

module.exports.activeMembers = function(guild, sendChannel) {
    var memberArr = [];
    var memberstr = "";
    guild.members.forEach((value, key, map) => {
        //console.log(value);
        if (value.lastMessage) {
            if (!memberArr.includes(value.user.id)) {
                memberArr.push(value.user.id);
                memberstr += value.user.username;
                memberstr += '\n';
            }
        }
    });
    console.log(memberstr);
    sendChannel.send({
        embed: {
            'description': memberstr
        }
    }).catch(err => {
        console.log(err);
    });
}