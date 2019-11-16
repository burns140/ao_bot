const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('../auth.json');
const axios = require('axios');
const VERSION_NUMBER = 1.0;
const AGENT_URL = '';
const options = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${auth.token}`,
        'User-Agent': `DiscordBot (${AGENT_URL}, ${VERSION_NUMBER})`
    }
};

module.exports.welcome = function(member) {
    //console.log(member.guild.channels);
    console.log('in welcome');
    member.guild.channels.forEach((value, key, map) => {
        //console.log(key);
        if (map.get(key).name == 'social') { 
            var greeting = `Welcome to Alpha-Omega!!` 
            var message = `Welcome, <@${member.user.id}>! We have members from a wide variety of timezones with a wide variety of interests, ` + 
                `so no matter what your favorite activity is, you will always have someone to group with. ` + 
                `If you take a look at our text channels, you can see that we have some designated chat groups ` + 
                `for each activity as well as designated lfg chats. The lfg channels use a bot to create and ` + 
                `schedule activities and can be used when you have a specific activity in mind, while the chat ` + 
                `channels have a bit more flexibility when finding a team. We are constantly changing, so if you ` + 
                `have any questions, suggestions, or anything else, feel free to contact one of the admins <@360437260333744128>, ` + 
                `<@209836090280902656>, <@232691801771868160>, <@147417761725808641>, or <@153392262171066369>.` + 
                `Please type '!register' in chat to get set up with Charlemagne. Good luck out there Guardian. ` +
                `(If you want to contribute to this bot, message <@153392262171066369>)`;
            let data = {
                //'content': 'fuck this server',
                'embed': {
                    'title': greeting,
                    'description': message
                }
            }
            axios.post(`https://discordapp.com/api/channels/${map.get(key).id}/messages`, data, options)
            .then(response => {
                console.log('');
            }).catch(err => {
                console.log(err);
            });
        }
    })
    if (member.bot) {
        return;
    }
}