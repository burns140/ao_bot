const rp = require('request-promise');
const $ = require('cheerio');
const BASEURL = 'https://www.ishtar-collective.net/entries/';
const SECONDURL = 'https://www.ishtar-collective.net/categories/';
var urls = [BASEURL, SECONDURL];
var specialChars = ['?', '!', '.'];
var loreString = "";
var workingurl = "";
var splitString = "";

module.exports.getLore = function(item, sendChannel) {
    var itemString = item;
    item = item.replace(' ', '-');
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
        checkUrl(thisurl, sendChannel, formatString);
    }

    //loreString = "";

}

function checkUrl(url, sendChannel, formatString) {
    rp(url).then(html => {
        var description = $('.description', html);
        var arr = description.children();
        workingurl = url;
        buildLoreString(arr);

        if (description != '') {
            sendChannel.send(`\n\n-------------Lore entry for ${formatString}\n-------------`);
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
            /*sendChannel.send(
                /*embed: {
                    'title': formatString,
                    'description': loreString
                }
            ).then(res => {
                loreString = "";
            }).catch(err => {
                console.log('descrerr');
                console.log(err);
                if (err.code == 50035) {
                    
                }
            });*/
        }

        //console.log(loreString);
        
    }).catch(err => {
        //console.log(err);
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
                console.log('fuck');
                loreString += ' ';
            }
            if (specialChars.includes(loreString.charAt(loreString.length - 2)) && loreString.charAt(loreString.length - 1) == ' ') {
                loreString += '\n\n';
                loreString += str;
            } else {
                loreString += str; 
            }
            console.log(`-${str}-`);
        }  
    }
}
