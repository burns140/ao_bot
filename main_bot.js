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
const compile = require('es6-template-strings/compile');


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
            case 'message':
                var sendChannel = msg.channel;

        }
    }
})

if (testing) {
    client.login(auth.token);
} else {
    client.login(auth);
}

/* Read in clan member ids from file */
/* fs.readFile('./src/misc/αlpha_ωmega_ids.txt', (err, data) => {
    if (err) throw err;
    allids = data.toString().split('\n');
}); */ 

var data = fs.readFileSync("./src/resources/welcomeMessage.txt", "utf8");
var compiled = compile(data);


var messageDefault = `Welcome, <@${member.user.id}>! We have members from a wide variety of timezones with a wide variety of interests, ` + 
        `so no matter what your favorite activity is, you will always have someone to group with. ` + 
        `If you take a look at our text channels, you can see that we have some designated chat groups ` + 
        `for each activity as well as designated lfg chats. The lfg channels use a bot to create and ` + 
        `schedule activities and can be used when you have a specific activity in mind, while the chat ` + 
        `channels have a bit more flexibility when finding a team. ` +
        `The weapons channel uses information gathered by clan member Jiangshi to help you determine whether the ` + 
        `weapon rolls you've gotten are worth keeping. In the guides section, you can see information that is useful for various activities. ` +
        `If you would like to be notified when people are searching for certain activities, message the admins to be added as lfg-raider, lfg-pve'er, and/or lfg-pvper. ` +
        `Please type '?register' in chat to get set up with Charlemagne. ` +
        `Visit the 'know your role' channel to select which classes you main. Refrain from using the 'everyone' tag in chat. This is reserved for important announcements, as it can bypass channel mutes. ` +
        `We are constantly changing, so if you have any questions, suggestions, or anything else, feel free to contact one of the admins: ` + 
        `'Swiftmood', 'MachineGunShelly', 'StumptownRetro', 'The Internet', 'aPhantomDolphin', 'Juncy', or 'Mr_Saltshaker'. ` + 
        `Good luck out there Guardian.`;


/* Initialize the weapon arrays needed for the rolls */
Rolls.initWeaponsApi();