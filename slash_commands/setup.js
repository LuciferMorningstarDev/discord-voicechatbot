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
    var langData = bot.languages[lang].commandOutput.setup || bot.languages['en_us'].commandOutput.setup;
    var settingsError = bot.languages[lang].commandOutput.settings_error || bot.languages['en_us'].commandOutput.settings_error;

    if (!settings) return interaction.reply({ content: settingsError, ephemeral: true });
    try {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: langData.perm, ephemeral: true });
        var guild = interaction.guild;

        var lobbyID = interaction.options.getString('lobby');
        var categoryID = interaction.options.getString('category');

        if (!lobbyID) {
            lobbyID = interaction.member.voice?.channel?.id;
            categoryID = interaction.member.voice?.channel?.parent?.id;
        }

        if (!lobbyID || !categoryID) return interaction.reply({ content: langData.cannot_resolve, ephemeral: true });

        var lobby = await bot.channels.fetch(lobbyID).catch(() => {});
        var category = await bot.channels.fetch(categoryID).catch(() => {});

        if (!lobby || !category) return interaction.reply({ content: langData.cannot_resolve, ephemeral: true });

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

        bot.tools.updateSlashCommands(bot, guild);

        return interaction.reply({ content: langData.complete });
    } catch (error) {
        bot.error('Error in Slash Command Language', error);
    }
};

module.exports.data = (bot, lang = 'en_us') => {
    var langData = bot.languages[lang].slashCommandBuilder.setup || bot.languages['en_us'].slashCommandBuilder.setup;
    var slashCommandData = new SlashCommandBuilder()
        .setName('setup')
        .setDescription(langData.description)
        .addStringOption((option) => option.setName('lobby').setDescription(langData.options.lobby))
        .addStringOption((option) => option.setName('category').setDescription(langData.options.category));
    return slashCommandData.toJSON();
};

module.exports.active = true;
