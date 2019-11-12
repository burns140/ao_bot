const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const VERSION_NUMBER = 1.0;
const AGENT_URL = '';
const Welcome = require('./bot_functions/welcome.js');
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

client.on('guildMemberAdd', (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    Welcome.welcome(member);
});

client.login(auth.token);