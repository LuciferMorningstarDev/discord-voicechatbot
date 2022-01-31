/*
 * discord-voicechatbot | Copyright (c) 2022 | LuciferMorningstarDev
 * Licensed under the MIT License
 *
 * Repository: https://github.com/LuciferMorningstarDev/discord-voicechatbot
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * You should have received a copy of the MIT License
 *
 * Contact:
 *  github: https://github.com/LuciferMorningstarDev
 *  email: contact@lucifer-morningstar.xyz
 *
 * @author LuciferMorningstarDev - https://github.com/LuciferMorningstarDev
 * @since 01.02.2022
 *
 */
'use strict'; // https://www.w3schools.com/js/js_strict.asp

// append process.env variables by .env file
require('dotenv').config();

// require modules
const { Client, Intents } = require('discord.js');
const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const Enmap = require('enmap');

const cachePath = process.cwd() + '/cache.json';
if (!fs.existsSync(cachePath)) {
    fs.writeFileSync(cachePath, JSON.stringify({}));
}

// create the Discord Client
const bot = new Client({
    intents: new Intents(30385),
    restRequestTimeout: 10000,
});

// module caching
bot.modules = {};
global.moduleRequire = (mod) => {
    if (bot.modules[mod]) return bot.modules[mod];
    bot.modules[mod] = require(mod);
    return bot.modules[mod];
};

bot.error = async (errorMessage, error) => {
    if (errorMessage instanceof Error) {
        error = errorMessage;
        console.error(errorMessage);
        errorMessage = error.message;
    } else {
        error = new Error(errorMessage);
        console.error(errorMessage);
        if (error) console.error(error);
    }
};

bot.catch = async (error) => {
    bot.error('Catched Error:\n' + error);
};

bot.configs = {};
bot.languages = {};
bot.db = {};

bot.interactions = new Enmap();
bot.slash_commands = new Enmap();

var cacheJSON = require(cachePath);

// load config files
fs.readdir('./configs/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.json')) return;
            const config = require(`./configs/${file}`);
            let configName = file.split('.')[0];
            bot.configs[configName] = config;
            console.log(`[CONFIG LOADED] » configs.${configName}...`);
        } catch (error) {
            bot.error(error);
        }
    });
});

// load config files
fs.readdir('./languages/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.json')) return;
            const language = require(`./languages/${file}`);
            let langName = file.split('.')[0];
            bot.languages[langName] = language;
            console.log(`[LANGUAGE LOADED] » languages.${langName}...`);
        } catch (error) {
            bot.error(error);
        }
    });
});

// load bot events
fs.readdir('./events/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            const event = require(`./events/${file}`);
            let eventName = file.split('.')[0];
            console.log(`[BOTEVENT LOADED] » ${eventName}...`);
            bot.on(eventName, event.bind(null, bot));
        } catch (error) {
            bot.error(error);
        }
    });
});

// init mongodb handle
require('./modules/database').setupDatabaseHandler(bot);
// require tools
bot.tools = moduleRequire('./tools');

// load interaction commands
fs.readdir('./interactions/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            if (file.startsWith('_')) return;
            let props = require(`./interactions/${file}`);
            if (props.active == true) {
                let commandName = file.split('.')[0];
                bot.interaction_commands.set(commandName, props);
                console.log(`[INTERACTION COMMAND LOADED] >> ${commandName}`);
            }
        } catch (error) {
            bot.error(error);
        }
    });
});

// load interaction commands
fs.readdir('./slash_commands/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            if (file.startsWith('_')) return;
            let props = require(`./slash_commands/${file}`);
            if (props.active == true) {
                let commandName = file.split('.')[0];
                bot.slash_commands.set(commandName, props);
                console.log(`[SLASH COMMAND LOADED] >> ${commandName}`);
            }
        } catch (error) {
            bot.error(error);
        }
    });
});

var writeCacheJSON = () => fs.writeFileSync(cachePath, JSON.stringify({}));

process.on('SIGINT', () => {
    writeCacheJSON();
});
process.on('SIGTERM', () => {
    writeCacheJSON();
});
process.on('exit', () => {
    writeCacheJSON();
});

bot.restClient = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
bot.login(process.env.BOT_TOKEN);
