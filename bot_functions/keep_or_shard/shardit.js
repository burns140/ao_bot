const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const VERSION_NUMBER = 1;
const AGENT_URL = '';
var weapons = [];
const options = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${auth.token}`,
        'User-Agent': `DiscordBot (${AGENT_URL}, ${VERSION_NUMBER})`
    }
};



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    /* If the author is a bot, do nothing */
    if (msg.author.bot) {
        return;
    }

    /* Only perform an action if the first character is ? */
    if (msg.content.substring(0, 6) == '?shard' && msg.content.length > 1) {
        var item = msg.content.substring(6).toLowerCase();
        
    }
});

client.login(auth.token);