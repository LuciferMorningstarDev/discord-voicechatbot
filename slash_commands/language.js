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
    var langData = bot.languages[lang].commandOutput.language || bot.languages['en_us'].commandOutput.language;
    var settingsError = bot.languages[lang].commandOutput.settings_error || bot.languages['en_us'].commandOutput.settings_error;

    if (!settings) return interaction.reply({ content: settingsError, ephemeral: true });
    try {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: langData.perm, ephemeral: true });
        var guild = interaction.guild;

        var languagesAvailable = Object.keys(bot.languages);

        var langName = interaction.options.getString('language');

        if (lang.toLowerCase() == langName.toLowerCase()) return interaction.reply({ content: langData.is_set, ephemeral: true });
        if (!languagesAvailable.includes(langName)) return interaction.reply({ content: langData.no_lang, ephemeral: true });

        bot.db.updateAsync('guilds', { id: guild.id }, { language: langName.toLowerCase() }).then(() => {
            bot.tools.updateSlashCommands(bot, guild);
            return interaction.reply({ content: langData.set_lang, ephemeral: true });
        });
    } catch (error) {
        bot.error('Error in Slash Command Language', error);
    }
};

module.exports.data = (bot, lang = 'en_us') => {
    var langData = bot.languages[lang].slashCommandBuilder.language || bot.languages['en_us'].slashCommandBuilder.language;
    var slashCommandData = new SlashCommandBuilder()
        .setName('language')
        .setDescription(langData.description)
        .addStringOption((option) => option.setName('language').setDescription(langData.language).setRequired(true))
        .addStringOption((option) => option.setName('list').setDescription(langData.list));
    return slashCommandData.toJSON();
};

module.exports.active = true;
