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

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.run = async (bot, interaction, settings, lang = 'en_us') => {
    const Discord = moduleRequire('discord.js');
    if (!settings) return interaction.reply({ content: 'Cannot get current settings from database', ephemeral: true });
    try {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'No perm... ( you need ADMINISTRATOR perm )', ephemeral: true });
        var guild = interaction.member.guild;

        var guildObject = await bot.db.queryAsync('guilds', { id: guild.id, ephemeral: true });

        if (!guildObject || guildObject.length < 1) return interaction.reply({ content: 'Cannot get current settings from database', ephemeral: true });

        guildObject = guildObject[0];

        var lobbyID = interaction.options.getString('lobby');
        var categoryID = interaction.options.getString('category');

        if (!lobbyID) {
            lobbyID = interaction.member.voice?.channel?.id;
            categoryID = interaction.member.voice?.channel?.parent?.id;
        }

        if (!lobbyID) return interaction.reply({ content: 'cannot setup unable to resolve channel', ephemeral: true });

        var lobby = await bot.channels.fetch(lobbyID).catch(() => {});
        var category = await bot.channels.fetch(categoryID).catch(() => {});

        if (!lobby || !category) return interaction.reply({ content: 'cannot setup unable to resolve channel', ephemeral: true });

        bot.db.updateAsync(
            'guilds',
            { id: guild.id },
            {
                temp_voice: {
                    lobby: lobby.id,
                    category: category.id,
                },
            }
        );

        return interaction.reply({ content: 'setup complete' });
    } catch (errpr) {
        bot.error('Error in Slash Command Language', error);
    }
};

module.exports.data = (lang = 'en_us') => {
    var slashCommandData = new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup command for the tempvoice bot. Uses Joined channel and parent category if no ID specified.')
        .addStringOption((option) => option.setName('lobby').setDescription('the channel id of a voice channel to join when creation of channel is needed'))
        .addStringOption((option) => option.setName('category').setDescription('the channel id of a category where created channels are moved ( lobby should be in there )'));
    return slashCommandData.toJSON();
};

module.exports.active = true;