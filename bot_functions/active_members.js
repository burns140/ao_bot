const Discord = require('discord.js');

/*module.exports.activeMembers = function(channel, sendChannel) {
    //console.log('getting active members');
    channel.fetchMessages( {limit: 300 } ).then(messages => {
        var memberArr = [];
        var members = "";
        messages.forEach((value, key, map) => {
            if (!memberArr.includes(value.author)) {
                memberArr.push(value.author);
                members += value.author.username;
                members += '\n';
            }
        });
        console.log(members);
        sendChannel.send({
            embed: {
                'description': members
            }
        });
    }).catch(err => {
        console.log(err);
    });

}*/

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