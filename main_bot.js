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

const testing = false;
var auth;
if (testing) {
    auth = require('./auth.json');
} else {
    auth = process.env.BOT_TOKEN;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    Welcome.welcome(member);
});

client.on('message', (msg) => {
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

fs.readFile('αlpha_ωmega_ids.txt', (err, data) => {
    if (err) throw err;
    allids = data.toString().split('\n');
})
Rolls.initWeaponsApi();