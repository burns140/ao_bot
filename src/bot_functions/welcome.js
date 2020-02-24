const Discord = require('discord.js');
const client = new Discord.Client();

/**
 * Send welcome message to new members
 */
module.exports.welcome = function(member) {
    if (member.bot) {
        return;
    }
    var greeting = `Welcome to Alpha-Omega!!` 
    var message = `Welcome, <@${member.user.id}>! We have members from a wide variety of timezones with a wide variety of interests, ` + 
        `so no matter what your favorite activity is, you will always have someone to group with. ` + 
        `If you take a look at our text channels, you can see that we have some designated chat groups ` + 
        `for each activity as well as designated lfg chats. The lfg channels use a bot to create and ` + 
        `schedule activities and can be used when you have a specific activity in mind, while the chat ` + 
        `channels have a bit more flexibility when finding a team. ` +
        `The weapons channel uses information gathered by clan member Jiangshi to help you determine whether the ` + 
        `weapon rolls you've gotten are worth keeping. In the guides section, you can see information that is useful for various activities. ` +
        `If you would like to be notified when people are searching for certain activities, message the admins to be added as lfg-raider, lfg-pve'er, and/or lfg-pvper. ` +
        `Please type '!register' in chat to get set up with Charlemagne. ` +
        `Visit the 'know your role' channel to select which classes you main. Refrain from using the 'everyone' tag in chat. This is reserved for important announcements, as it can bypass channel mutes. ` +
        `We are constantly changing, so if you have any questions, suggestions, or anything else, feel free to contact one of the admins: ` + 
        `'Swiftmood', 'MachineGunShelly', 'StumptownRetro', 'The Internet', 'aPhantomDolphin', 'Juncy', or 'Mr_Saltshaker'. ` + 
        `Good luck out there Guardian. `;
    let data = {
        'embed': {
            'title': greeting,
            'description': message
        }
    }

    member.user.send(data);
    
}