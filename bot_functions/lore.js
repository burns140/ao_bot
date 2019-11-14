const rp = require('request-promise');
const $ = require('cheerio');
const BASEURL = 'https://www.ishtar-collective.net/entries/';
const SECONDURL = 'https://www.ishtar-collective.net/categories/';
var urls = [BASEURL, SECONDURL];

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

}

function checkUrl(url, sendChannel, formatString) {
    rp(url).then(html => {
        var description = $('.description', html);
        console.log(description.children());
        var arr = description.children();
        var lore = "";

        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].children;
            for (var j = 0; j < arr2.length; j++) {
                var str = arr[i].children[j].data;
                if (str != undefined) {
                    lore += str;
                    lore += '\n';
                } 
            }
        }

        if (description != '') {
            sendChannel.send({
                embed: {
                    'title': formatString,
                    'description': lore
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }).catch(err => {
        //console.log(err);
    });
}
