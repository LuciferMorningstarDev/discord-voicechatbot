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

module.exports = async (bot, interaction) => {
    var guild = interaction.member.guild;
    var defaultObject = {
        id: guild.id,
        language: 'en_us',
        temp_voice: {
            lobby: '',
            category: '',
        },
    };
    bot.db.queryAsync('guilds', { id: guild.id }).then(async (guildObject) => {
        if (!guildObject) {
            await bot.db.insertAsync('guilds', defaultObject);
            guildObject = defaultObject;
        }
        if (interaction.isCommand()) {
            var commandName = interaction.commandName;
            var command = bot.slash_commands.get(commandName);
            if (!command) return;
            try {
                command.run(bot, interaction, guildObject, guildObject.language);
            } catch (err) {
                bot.error('Unhandled Error in SlashCommand', err);
            }
            return;
        } else {
            if (!interaction.customId) return;
            var command = bot.interactions.get(interaction.customId);
            if (!command) return;
            try {
                command.run(bot, interaction, guildObject, guildObject.language);
            } catch (err) {
                bot.error('Unhandled Error in Interaction with CustomID', err);
            }
        }
    });
};
