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

const Discord = moduleRequire('discord.js');

module.exports = () => null;

// set a new bot status ( let the bot pick a random string of an array )
module.exports.setStatus = async (botInstance, activities_list) => {
    var index = Math.floor(Math.random() * activities_list.length);
    if (index < 0) index = 0;
    if (index >= activities_list.length) index = activities_list.length - 1;
    var txt = activities_list[index][0];
    var amount = 0;
    if (activities_list[index][1] != 'STREAMING') {
        botInstance.user.setActivity(txt, {
            type: activities_list[index][1] || 'PLAYING',
        });
    } else {
        botInstance.user.setActivity(txt, {
            type: 'STREAMING',
            url: activities_list[index][2] || 'https://google.com',
        });
    }
};

// set a new bot Status
module.exports.setBotStatus = async (botInstance, status, type) => {
    botInstance.user.setActivity(status || 'Leerer Status gesetzt', {
        type: type || 'PLAYING',
    });
};

// updateStatus is actually called each 2 min. in ready.js
module.exports.updateStatus = async (botInstance) => {
    botInstance.tools.setStatus(botInstance, botInstance.configs.general.stati);
};

module.exports.generateEmbed = async (data, cb) => {
    return new Promise(async (resolve, reject) => {
        try {
            let embed = new Discord.MessageEmbed();
            if (data.timestamp) embed.setTimestamp(data.timestamp);
            else if (data.timestamp != false) embed.setTimestamp();
            if (data.title) embed.setTitle(data.title);
            if (data.description) embed.setDescription(data.description);
            if (data.color) embed.setColor(data.color);
            else embed.setColor(15007859);
            if (data.author) {
                if (typeof data.author == 'object') {
                    embed.setAuthor({
                        name: data.author.text || data.author.name,
                        iconURL: data.author.image || data.author.image_url || data.author.icon_url,
                        url: data.author.url,
                    });
                } else {
                    embed.setAuthor({
                        name: data.author,
                    });
                }
            }
            if (data.thumbnail) {
                if (typeof data.thumbnail == 'object') {
                    embed.setThumbnail(data.thumbnail.url || data.thumbnail.image_url || data.thumbnail.image);
                } else {
                    embed.setThumbnail(data.thumbnail);
                }
            }
            if (data.image) {
                if (typeof data.image == 'object') {
                    embed.setImage(data.image.image || data.image.image_url || data.image.url);
                } else {
                    embed.setImage(data.image);
                }
            }
            if (data.footer) {
                if (typeof data.footer == 'object') {
                    embed.setFooter(data.footer.text, data.footer.image || data.footer.image_url || data.footer.url);
                } else {
                    embed.setFooter(data.footer);
                }
            } // else embed.setFooter(process.env.BOT_NAME);
            if (data.fields) {
                for (let field of data.fields) {
                    if (field.name != '' && field.value != '') {
                        embed.addField(field.name, field.value, field.inline);
                    }
                }
            }
            if (data.url) embed.setURL(data.url);
            if (cb) await cb(embed);
            return resolve(embed);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.isMemberPremium = (member) => {
    return member.premiumSince != null;
};

module.exports.hasUserNitro = (user) => {
    if (!user) throw new Error('User cannot be null please fetch before.');
    var isPartner = false;
    try {
        isPartner = user.flags.has('PARTNERED_SERVER_OWNER');
    } catch (error) {}
    return user.displayAvatarURL({ dynamic: true }).endsWith('.gif') || isPartner;
};

module.exports.hasMemberNitro = (member) => {
    if (!member) throw new Error('Member cannot be null please fetch before.');
    var presence_emoji = false;
    try {
        if (member.presence.activities != null) {
            member.presence.activities.forEach((activity) => {
                if (activity.emoji != null && activity.id == 'custom') {
                    if (activity.emoji.animated != null) presence_emoji = true;
                }
            });
        }
    } catch (error) {}
    var isPartner = false;
    try {
        isPartner = member.user.flags.has('PARTNERED_SERVER_OWNER');
    } catch (error) {}
    return presence_emoji || member.premiumSinceTimeStamp || member.premiumSubscriptionCount || 0 > 0 || member.user.displayAvatarURL({ dynamic: true }).endsWith('.gif') || isPartner;
};

const { Routes } = moduleRequire('discord-api-types/v9');

module.exports.updateSlashCommands = async (bot, guildRefresh) => {
    if (!guildRefresh) {
        try {
            console.log('Started refreshing application (/) commands.');
            var slashCommands = [];
            for (let slash_command of bot.slash_commands.array()) slashCommands.push(slash_command.data.toJSON());
            var guildObjects = await bot.db.queryAsync('guilds', {});
            guildObjects.forEach(async (guildObjects) => {
                bot.restClient.put(Routes.applicationGuildCommands(bot.user.id, guildObjects.id), { body: slashCommands }).catch(bot.catch);
            });
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('Started refreshing application (/) commands. GUILD: ' + guildRefresh.id);
        var slashCommands = [];
        for (let slash_command of bot.slash_commands.array()) slashCommands.push(slash_command.data.toJSON());
        bot.db.queryAsync('guilds', { id: guildRefresh.id }).then((guildObjects) => {
            if (!guildObjects || guildObjects.length < 1) {
                bot.db
                    .insertAsync('guilds', {
                        id: guildRefresh.id,
                        language: 'en_us',
                        temp_voice: {
                            lobby: '',
                            category: '',
                        },
                    })
                    .then(async () => {
                        await bot.restClient.put(Routes.applicationGuildCommands(bot.user.id, guildObjects.id), { body: slashCommands }).catch(bot.catch);
                        console.log('Successfully reloaded application (/) commands. GUILD: ' + guildRefresh.id);
                    });
            }
        });
    }
};
