const rp = require('request-promise');
const $ = require('cheerio');
const BASEURL = 'https://www.ishtar-collective.net/entries/';
const SECONDURL = 'https://www.ishtar-collective.net/categories/';
var urls = [BASEURL, SECONDURL];
var specialChars = ['?', '!', '.', '"'];
var loreString = "";
var splitString = "";
var quote = false;
var sent = false;

module.exports.getLore = async function(item, sendChannel) {
    var itemString = item;
    item = item.replace(/ /g, '-');
    var itemArr = itemString.split(' ');
    var formatString = "";
    for (var i = 0; i < itemArr.length; i++) {
        itemArr[i] = itemArr[i][0].toUpperCase() + itemArr[i].slice(1);
        formatString += itemArr[i];
        if (i != itemArr.length - 1) {
            formatString += ' '; 
        }
    }

    for (url of urls) {
        thisurl = url + item.toLowerCase();
        await checkUrl(thisurl, sendChannel, formatString);
    }

    if (!sent) {
        sendChannel.send({
            embed: {
                title: "No entry found",
                description: "No lore entry with that name was found\n"
            }
        });
    }
    sent = false;
}

async function checkUrl(url, sendChannel, formatString) {
    await rp(url).then(html => {
        var description = $('.description', html);
        var arr = description.children();
        workingurl = url;
        buildLoreString(arr);

        if (loreString != "") {
            sent = true;
            sendChannel.send(`\n\n-------------\nLore entry for ${formatString}\n-------------`);
            for (var i = 0; i < loreString.length; i += 1985) {
                if (i + 1985 > loreString.length) {
                    sendChannel.send(loreString.substr(i));
                } else {
                    splitString = loreString.substr(i, i + 1985);
                    while (splitString.charAt(splitString.length - 1) != ' ') {
                        splitString += loreString.charAt(i + 1995 + 1);
                        i++;
                    }
                    sendChannel.send(splitString);
                }
            }
            loreString = "";
        }    
    }).catch(err => {
        console.log('checkurl err');
        console.log(url);
    });
}

function buildLoreString(arr) {
    for (var i = 0; i < arr.length; i++) {
        var2 = arr[i].children;
        if (var2 != undefined) {
            buildLoreString(var2);
        }
        var str = arr[i].data;
        if (str != undefined && isNaN(str)) {
            if (specialChars.includes(loreString.charAt(loreString.length - 1)) && str.charAt(0) != ' ') {
                if (loreString.charAt(loreString.length - 1) == '"') {
                    quote = true;
                }
                loreString += ' ';
            }
            if (specialChars.includes(loreString.charAt(loreString.length - 2)) && loreString.charAt(loreString.length - 1) == ' ' && quote == false) {
                loreString += '\n\n';
                loreString += str;
            } else {
                quote = false;
                loreString += str; 
            }
            console.log(`-${str}-`);
        }  
    }
}
