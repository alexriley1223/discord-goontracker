const { Client, ActivityType } = require("discord.js");
const path = require('path');
const axios = require('axios');

require('dotenv').config({
    path: path.join(__dirname, '.env'),
})

// Initiate Client
const client = new Client({ intents: []});
const token = process.env.BOT_TOKEN;
const api = process.env.API_URL;

// Login Bot
client.login(token);

// Watch Loop
client.on('ready', (bot) => {
    setInterval(function() {
        setPresence(bot, 'Loading...');
        scrapeGoonTracker().then(data => {
            setPresence(bot, data);
        })
        .catch(err => console.log('Unable to fetch API'));
      }, 1800000); // 30 Minutes
    
    // Set status initially
    scrapeGoonTracker().then(data => { setPresence(bot, data); }).catch(err => console.log('Unable to fetch API'));
});

// Scrape Goon Tracker API and return current map
async function scrapeGoonTracker() {
    return axios.get(api).then(res => res.data.location)
}

// Set Discord Bot Presence. Template: `Watching {Map Name}`
function setPresence(bot, location) {
    bot.user.setPresence({
        activities: [{ name: `${location}`, type: ActivityType.Watching }],
        status: 'dnd',
      });
}