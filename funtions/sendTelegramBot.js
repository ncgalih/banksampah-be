const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token
const token = process.env.TOKEN;

// Replace with your chat ID and the message you want to send
const chatId = process.env.CHAT_ID;

exports.sendTelegramBot = function(message){
    const bot = new TelegramBot(token, { polling: true });
    bot.sendMessage(chatId, message)
    .then(() => console.log('Message sent successfully'))
    .catch(error => console.error('Error sending message:', error));
}