const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');
const MongoClient = require('../database/mongo_connection.js');



/**
 * Send welcome message to new members
 */
module.exports.welcome = function(member) {
    if (member.bot) {
        return;
    }

    try {
        MongoClient.get().then(client => {
            const db = client.db('data');
    
            db.collection('messages').findOne(
                { type: "Welcome" }
            ).then(result => {
                var compiled = compile(result.message);

                var greeting = `Welcome to Alpha-Omega!!` 
                var message = resolveToString(compiled, member);
                console.log(message);

                let data = {
                    'embed': {
                        'title': greeting,
                        'description': message
                    }
                }
            
                member.user.send(data);
            }).catch(err => {
                console.log(err);
            });
        });
    } catch (err) {
        console.log(err);
    }

    

}

/* Send the current welcome message in plaintext */
module.exports.viewMessage = function(sendChannel) {

    try {
        MongoClient.get().then(client => {
            const db = client.db('data');
    
            db.collection('messages').findOne(
                { type: "Welcome" }
            ).then(result => {
                var sendMessage = `Welcome message is currently\n----------------------------\n${result.message}`
                sendChannel.send(sendMessage);   
            }).catch(err => {
                console.log(err);
            });
        });
    } catch (err) {
        console.log(err);
    }
    
}

/* Set the welcome message and write to a file so it can be read on server reboot */
module.exports.setMessage = function(newMessage, sendChannel) {

    try {
        MongoClient.get().then(client => {
            const db = client.db('data');
    
            db.collection('messages').updateOne(
                { type: "Welcome" },
                { $set: { message: newMessage } }
            ).then(result => {
                if (result.modifiedCount == 1) {
                    var sendMessage = `Welcome message has been set to\n----------------------------\n${newMessage}`;
                    sendChannel.send(sendMessage);  
                    return;
                } else {
                    sendChannel.send("Error updating welcome message");
                }
                
            }).catch(err => {
                console.log(err);
            });
        });
    } catch (err) {
        console.log(err);
    }
}