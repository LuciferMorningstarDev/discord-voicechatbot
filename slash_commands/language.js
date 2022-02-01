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

        var languagesAvailable = Object.keys(bot.languages);

        var langName = interaction.options.getString('language');

        if (lang.toLowerCase() == langName.toLowerCase()) return interaction.reply({ content: 'is set', ephemeral: true });
        if (!languagesAvailable.includes(langName)) return interaction.reply({ content: 'not a lnng', ephemeral: true });

        bot.db.updateAsync('guilds', { id: guild.id }, { language: langName.toLowerCase() });
        bot.tools.updateSlashCommands(bot, guild);
        return interaction.reply({ content: 'set to ' + langName.toLowerCase(), ephemeral: true });
    } catch (errpr) {
        bot.error('Error in Slash Command Language', error);
    }
};

module.exports.data = (lang = 'en_us') => {
    var slashCommandData = new SlashCommandBuilder()
        .setName('language')
        .setDescription('With this command you can change the server language.')
        .addStringOption((option) => option.setName('language').setDescription('the new language to set').setRequired(true));
    return slashCommandData.toJSON();
};

module.exports.active = true;
