const Discord = require('discord.js');
const client = new Discord.Client();
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');


/* I manually input the values because some people didn't match correctly
   when submitting the survey */
var haveAnswered = [
    'StonedStone',
    'MachineGunShelly',
    'duski',
    'PewPewman',
    'WHITELIGHTNING',
    'Switchgear',
    'Headshot Hero',
    'Mav81',
    'Jiangshi',
    'Twizted Mizfit',
    'tezr',
    'Disturbedshark98',
    'WARLOCKS CANT JUMP',
    'FateProtocolTTV',
    'RedJay',
    'Delbaeth',
    'The Internet',
    'Hunky chunky :3',
    'IsabellaHeart',
    'Hooternut',
    'VaccinesCauseAutism',
    'unknowndragon1099',
    'Grinder299',
    'SNOMAN',
    'VictoryBurrito',
    'ヨアヒムマシュー◦',
    'Mr.Miser',
    'sheatime',
    'wtfkirk',
    'ÄŦŁÄŞ',
    'Millard',
    'erfattack',
    'Scorpz03',
    'apieceofenergy',
    'Pinseeker',
    'aPhantomDolphin'
]


var answeredids = [];
const reminder = `You are receiving this message because a survey was posted a few days ago and ` +
                `you have not yet responded. The link to the survey is https://forms.gle/ufPfBMR5cGvCEK4r7. It ` +
                `will take no longer than 5 minutes and it helps the admins figure out how we can improve the clan experience ` +
                `for everyone. Thanks.\n--If you believe you've received this message in error, you can ignore it.--`;

module.exports.sendDm = function(members, text) {
    var compiled = compile(text);
    var adminId = '634788993250099211';
    
    members.forEach(member => {
        let toSend = resolveToString(compiled, member)
        member.roles.forEach(role => {
            if (role.id == adminId) {
                member.user.send(toSend);
                return;
            }
        });
    });
}