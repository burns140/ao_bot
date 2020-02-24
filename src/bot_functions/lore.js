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

/**
 * Get the lore for something from ishtar-collective page
 */
module.exports.getLore = async function(item, sendChannel) {
    var itemString = item;
    item = item.replace(/ /g, '-');
    var itemArr = itemString.split(' ');
    var formatString = "";
    /* Format name of item */
    for (var i = 0; i < itemArr.length; i++) {
        itemArr[i] = itemArr[i][0].toUpperCase() + itemArr[i].slice(1);
        formatString += itemArr[i];
        if (i != itemArr.length - 1) {
            formatString += ' '; 
        }
    }

    /* Check each url for information */
    for (url of urls) {
        thisurl = url + item.toLowerCase();
        await checkUrl(thisurl, sendChannel, formatString);
    }

    /* Entry not found */
    if (!sent) {
        sendChannel.send({
            embed: {
                title: "No entry found",
                description: ""
            }
        })
    }

    sent = false;
}

/**
 * Check the url to see if there is a valid lore entry. If valid, scrape the "description" section of the source code.
 * Then format the message and send it back to channel
 * @param {string} url - The url to check for the information
 * @param {string} sendChannel - The channel to send the message in
 * @param {string} formatString - The formatted string name
 */
async function checkUrl(url, sendChannel, formatString) {
    await rp(url).then(html => {
        workingurl = url;                   // This is a valid url
        var entType;

        /* Set the entry type to include in message header */
        if (workingurl.includes('categories')) {
            entType = 'Category description'
        } else if (workingurl.includes('entries')) {
            entType = 'Lore entry'
        }

        var description = $('.description', html);
        var arr = description.children();
        buildLoreString(arr);                   // Build the full string to be sent

        /* Entry is real */
        if (loreString != "") {
            sent = true;
            sendChannel.send(`\n\n---------------------------------\n${entType} for ${formatString}\n---------------------------------`);       // Create the header

            /* Discord max message length is 2000 characters. If the lore entry is longer than that, must split into substrings
               and send multiple messages. Due to discord's message formatting, messages sent this rapidly appear
               as a single message in the server */
            for (var i = 0; i < loreString.length; i += 1985) {
                if (i + 1985 > loreString.length) {
                    sendChannel.send(loreString.substr(i));
                } else {
                    splitString = loreString.substr(i, i + 1985);                           // 15 chars of leeway
                    while (splitString.charAt(splitString.length - 1) != ' ') {             // Want end of message to be a space
                        splitString += loreString.charAt(i + 1985 + 1);
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

/**
 * Recursively iterate through the lore entry. Recursion is necessary because
 * there are sub-elements such as headers, bolded or italicized text, etc. that will be skipped otherwise.
 * @param {string array} arr - array of text of the children in the tree of a specific parent node
 */
function buildLoreString(arr) {
    for (var i = 0; i < arr.length; i++) {

        /* Get the children of the current node. If we are in a leaf node,
           var2 will be undefined and we can add text to lore string */
        var2 = arr[i].children;
        if (var2 != undefined) {
            buildLoreString(var2);
        }

        var str = arr[i].data;                      // The current substring

        /* Determine whether current substring should be added to full entry */
        if (str != undefined && isNaN(str)) {                               // If it is undefined don't add it. If it is a number, it is a reference link, so don't add that.

            /* If the last character of the full string so far is a special character and the first character of this substring was not a space, a space must be added ahead of this substring.
               This is necessary due to some weird formatting from the web scraping meaning that sub-elements after ends of sentences
               didn't have a space. Take note if the last character of this substring is a quotation */
            if (specialChars.includes(loreString.charAt(loreString.length - 1)) && str.charAt(0) != ' ') {
                if (loreString.charAt(loreString.length - 1) == '"') {
                    quote = true;
                }
                loreString += ' ';
            }

            /* If the second to last character of the full string is a special character, the last character of the full string is a space, and
               the last element of this substring isn't a quotation, create a new paragraph and append the substring. Must check for quotes because 
               the format of the scraping meant that this parsing would create a new paragraph after any quotes. */
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
