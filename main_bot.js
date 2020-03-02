const Discord = require('discord.js');
const client = new Discord.Client();
const Welcome = require('./src/bot_functions/welcome.js');
const ActiveMembers = require('./src/bot_functions/active_members.js');
const Lore = require('./src/bot_functions/lore.js');
const Rolls = require('./src/bot_functions/keep_or_shard/shardit.js');
const DM = require('./src/bot_functions/dm.js');
const Update = require('./src/misc/write_id_to_file.js');
const sendChannelId = '635288515101589525';
const fs = require('fs');

var allids = [];

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

/**
 * Determine which functionality is being requested
 */
client.on('message', (msg) => {
    /* Only enter switch if first character matches the indicator */
    if (msg.content.substring(0, 1) == '?' && msg.content.length > 1) {
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
                break;
            case 'best':
                var sendChannel = msg.channel;
                Rolls.bestInCategory(msg, sendChannel);
                break;
            case 'dm':
                if (!msg.author.id == '153392262171066369') {
                    break;
                }
                var members = msg.guild.members;
                DM.sendDm(members);
                break;
            case 'updateid':
                var guild = msg.guild;
                Update.updateIds(guild);
                break;
        }
    }
})

if (testing) {
    client.login(auth.token);
} else {
    client.login(auth);
}

/* Initialize the weapon arrays needed for the rolls */
fs.readFile('./src/misc/αlpha_ωmega_ids.txt', (err, data) => {
    if (err) throw err;
    allids = data.toString().split('\n');
})
Rolls.initWeaponsApi();