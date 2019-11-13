const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const VERSION_NUMBER = 1.0;
const AGENT_URL = '';
const Welcome = require('./bot_functions/welcome.js');
const ActiveMembers = require('./bot_functions/active_members.js');
const channelid = '634782803124420630';
const sendChannelId = '635288515101589525'
const options = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${auth.token}`,
        'User-Agent': `DiscordBot (${AGENT_URL}, ${VERSION_NUMBER})`
    }
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //console.log(client.channels.get('446072280548769805'));
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
                //ActiveMembers.activeMembers(client.channels.get(channelid, sendChannel));
                ActiveMembers.activeMembers(msg.guild, sendChannel);
                break;
        }
    }
})

client.login(auth.token);