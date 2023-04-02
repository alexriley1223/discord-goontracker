const { Client, ActivityType } = require("discord.js");
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

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
        scrapeGoonTracker().then(data => { setPresence(bot, data); }).catch(err => console.log('Unable to fetch API'));
      }, 900000); // 15 Minutes

    scrapeGoonTracker().then(data => { setPresence(bot, data); }).catch(err => console.log('Unable to fetch API'));
});

// Scrape Goon Tracker API and return current map
async function scrapeGoonTracker() {
    const res = await axios.get(api);

    if(res.status == 200) {
        const $ = cheerio.load(res.data);
        const locationTracked = $("div.currentLocationBox > div:nth-child(2)");

        return locationTracked.text();
    }
}

// Set Discord Bot Presence. Template: `Watching {Map Name}`
function setPresence(bot, location) {
    bot.user.setPresence({
        activities: [{ name: `${location}`, type: ActivityType.Watching }],
        status: 'dnd',
      });
}