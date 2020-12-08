const Discord = require('discord.js');
const client = new Discord.Client();
const Welcome = require('./src/bot_functions/welcome.js');
const ActiveMembers = require('./src/bot_functions/active_members.js');
const Lore = require('./src/bot_functions/lore.js');
const Rolls = require('./src/bot_functions/keep_or_shard/shardit.js');
const DM = require('./src/bot_functions/dm.js');
const Update = require('./src/misc/write_id_to_file.js');
const MongoClient = require('./src/database/mongo_connection.js');
const fs = require('fs');
const compile = require('es6-template-strings/compile');
var info = require('./src/resources/info.json');
var data;
var messageDefault = info.messageDefault;


/* Read in welcome message. If there is an error, reset it to default */
try {
    data = fs.readFileSync("./src/resources/welcomeMessage.txt", "utf8");
} catch (err) {
    console.log(err);
    data = messageDefault;
}

var compiled = compile(data);

var allids = [];

/* Heroku needs to auth from environment variable.*/
var auth = process.env.BOT_TOKEN || require('./auth.json');

console.log(auth);

/* Notify when the bot is up and running and set activity message */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Destiny 2', { type: 'PLAYING' }).then(presence => { 
        //console.log(`Activity set to ${presence.activities[0].name}`);
    }).catch(err => {
        console.log(err);
    });
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
    if (msg.author.bot && msg.author.username == "Charlemagne") {
        console.log(msg.author.id);
        //console.log(msg.embeds);
    }

    if (msg.embeds && msg.author.username == "Charlemagne") {
        try {
            var map = new Map();
            for (el of msg.embeds) {
                if (el.author.name == "Top Guardians by Current Season Total Personal Clan XP") {
                    var stats = el.description.split('\n');
                    for (entry of stats) {
                        var entrySplit = entry.split(/\*+|XP: |\)/)
                        if (entrySplit.length >= 5) {
                            map.set(entrySplit[2].trim(), entrySplit[5].trim());
                        }
                    }
                    console.log(map);
                    let sendChannel = msg.channel;
                    let tempStr = ``;
                    for (const [key, value] of map.entries()) {
                        tempStr += `${value}\n`                        
                    }
                    sendChannel.send(tempStr);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    

    /* Only enter switch if first character matches the indicator */
    if (msg.content.substring(0, 1) == '?' && msg.content.length > 1) {
        var command = msg.content.substring(1).split(' ');
        console.log(`Command received: ${command}`);
        var sendChannel = msg.channel;
        switch (command[0].toLowerCase()) {
            case 'active':
                ActiveMembers.activeMembers(msg.guild, sendChannel);
                break;
            case 'lore':
                Lore.getLore(msg.content.substring(6), sendChannel);
                break;
            case 'rolls':
                Rolls.getRolls(msg, sendChannel);
                break;
            case 'best':
                Rolls.bestInCategory(msg, sendChannel);
                break;
            case 'dm':
                if (!info.adminIds.includes(msg.author.id)) {
                    break;
                }
                var cmd = msg.content.substring(4);
                var cmdArr = cmd.split(' ');
                
                switch (cmdArr[0]) {
                    case "--set":
                        stringToSet = cmd.substring(6);
                        DM.setDm(stringToSet, sendChannel);
                        break;
                    case "--view":
                        DM.viewDM(sendChannel);
                        break;
                    case "--send":
                        if (cmdArr.length > 1) {
                            break;
                        }
                        var members = msg.guild.members;
                        DM.sendDm(members);
                        break;
                }
                break;
            case 'updateid':
                var guild = msg.guild;
                if (Update.updateIds(guild)) {
                    sendChannel.send("ID's updated");
                } else {
                    sendChannel.send("Failed to update ID's");
                }
                break;
            case 'welcome':
                if (!info.adminIds.includes(msg.author.id)) {
                    break;
                }
                var cmd = msg.content.substring(9);
                var cmdArr = cmd.split(' ');
                switch (cmdArr[0]) {
                    case "--view":
                        Welcome.viewMessage(sendChannel);
                        break;
                    case "--set":
                        var stringToSet = "";
                        if (cmdArr[1] == "--default") {
                            stringToSet = messageDefault;
                        } else {
                            stringToSet = cmd.substring(6);
                        }
                        if (Welcome.setMessage(stringToSet, sendChannel)) {
                            data = stringToSet;
                            compiled = compile(data);
                        }
                        break;
                }
                break;
            case 'updateweapons':
                if (!info.adminIds.includes(msg.author.id) && msg.author.id != '131237935105179649') {
                    break;
                }
                Rolls.updateWeaponDb(sendChannel);
                sendChannel.send("Updating weapons");
                break;
            case 'rollq':
                Rolls.getRollFromNewDatabase(msg, sendChannel);
                break;
        }
    }
})

if (typeof auth == 'string') {
    client.login(auth);
} else {
    client.login(auth.token);
}

MongoClient.get().then((client) => {
    console.log("mongo client established");
}).catch(e => {
    console.log(e);
});


/* Initialize the weapon arrays needed for the rolls */
Rolls.populateWeaponArrayFromDatabase();
Rolls.updateFromNewApi();