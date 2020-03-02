const Discord = require('discord.js');
const client = new Discord.Client();
const VERSION_NUMBER = 1.0;
const AGENT_URL = '';
const Welcome = require('./bot_functions/welcome.js');
const ActiveMembers = require('./bot_functions/active_members.js');
const Lore = require('./bot_functions/lore.js');
const Rolls = require('./bot_functions/keep_or_shard/shardit.js');
const sendChannelId = '635288515101589525';

/* Heroku needs to auth from environment variable.
   Testing is the binary variable acting as the switch */
const testing = false;
var auth;
if (testing) {
    auth = require('./auth.json');
} else {
    auth = process.env.BOT_TOKEN;
}

/* Notify when the bot is up and running */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

/* Call function whenever someone joins the server */
client.on('guildMemberAdd', (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    Welcome.welcome(member);
});

/* Runs whenever a message is sent on the server */
client.on('message', (msg) => {
    if (msg.content.substring(0, 1) == '?' && msg.content.length > 1) {         // Only parse if the first character is a question mark
        var command = msg.content.substring(1).split(' ');
        switch (command[0]) {
            case 'active':
                var sendChannel = client.channels.get(sendChannelId)
                ActiveMembers.activeMembers(msg.guild, sendChannel);
                break;
            case 'lore':
                var sendChannel = msg.channel;
                Lore.getLore(msg.content.substring(6), sendChannel);
                break;
            case 'rolls':
                var sendChannel = msg.channel;
                Rolls.getRolls(msg, sendChannel);
        }
    }
})

if (testing) {
    client.login(auth.token);
} else {
    client.login(auth);
}

/* Initialize the weapon arrays needed for the rolls */
Rolls.initWeaponsApi();