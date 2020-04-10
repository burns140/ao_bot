const Discord = require('discord.js');
const client = new Discord.Client();
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');
const MongoClient = require('../database/mongo_connection.js');

/**
 * Send the currently let dm to all clan members
 * @param {GuildMemberManager} members 
 */
const sendDm = (members) => {
    var adminId = '634788993250099211';

    try {
        MongoClient.get().then(client => {
            const db = client.db('data');

            db.collection('messages').findOne(
                { type: "dm" }
            ).then(result => {
                var compiled = compile(result.message);
                let toSend = resolveToString(compiled, member)
                member.roles.forEach(role => {
                    if (role.id == adminId) {
                        member.user.send(toSend);
                        return;
                    }
                });
            }).catch(err => {
                console.log(err);
            });
        })
    } catch (err) {
        console.log(err);
    }
}

/**
 * Set the dm in mongodb and send message saying it was updated
 * @param {string} text 
 * @param {TextChannel} sendChannel 
 */
const setDm = (text, sendChannel) => {
    try {
        MongoClient.get().then(client => {
            const db = client.db('data');
    
            db.collection('messages').updateOne(
                { type: "dm" },
                { $set: { message: text } }
            ).then(result => {
                if (result.modifiedCount == 1) {
                    var sendMessage = `DM has been set to\n----------------------------\n${newMessage}`;
                    sendChannel.send(sendMessage);  
                    return;
                } else {
                    sendChannel.send("Error updating dm message");  
                }
                
            }).catch(err => {
                console.log(err);
                sendChannel.send("Error updating dm message");
            });
        });
    } catch (err) {
        console.log(err);
    }
}

/**
 * Preview the currently set dm message
 * @param {TextChannel} sendChannel 
 */
const viewDM = (sendChannel) => {
    try {
        MongoClient.get().then(client => {
            const db = client.db('data');

            db.collection('messages').findOne(
                { type: "dm" }
            ).then(result => {
                var sendMessage = `DM is currently\n----------------------------\n${result.message}`
                sendChannel.send(sendMessage);
            }).catch(err => {
                console.log(err);
            });
        })
    } catch (err) {
        console.log(err);
    }
}

exports.setDm = setDm;
exports.sendDm = sendDm;
exports.viewDM = viewDM;
