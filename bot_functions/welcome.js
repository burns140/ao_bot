const Discord = require('discord.js');
const client = new Discord.Client();

module.exports.welcome = function(member) {
    if (member.bot) {
        return;
    }
    console.log('in welcome');
    var greeting = `Welcome to Alpha-Omega!!` 
    var message = `Welcome, <@${member.user.id}>! We have members from a wide variety of timezones with a wide variety of interests, ` + 
        `so no matter what your favorite activity is, you will always have someone to group with. ` + 
        `If you take a look at our text channels, you can see that we have some designated chat groups ` + 
        `for each activity as well as designated lfg chats. The lfg channels use a bot to create and ` + 
        `schedule activities and can be used when you have a specific activity in mind, while the chat ` + 
        `channels have a bit more flexibility when finding a team. We are constantly changing, so if you ` + 
        `have any questions, suggestions, or anything else, feel free to contact one of the admins: ` + 
        `'The Internet', 'aPhantomDolphin', 'Juncy', 'Swiftmood', or 'Azzarie'. ` +
       // `<@360437260333744128>, <@209836090280902656>, <@232691801771868160>, <@147417761725808641>, or <@153392262171066369>.` + 
        `Please type '!register' in chat to get set up with Charlemagne. Good luck out there Guardian. ` +
        `(If you want to contribute to this bot, message 'aPhantomDolphin').`;
    let data = {
        //'content': 'fuck this server',
        'embed': {
            'title': greeting,
            'description': message
        }
    }

    member.user.send(data);
    
}