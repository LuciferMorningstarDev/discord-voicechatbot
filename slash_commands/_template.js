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
    var langData = bot.languages[lang].commandOutput.template || bot.languages['en_us'].commandOutput.template;
    var settingsError = bot.languages[lang].commandOutput.settings_error || bot.languages['en_us'].commandOutput.settings_error;

    if (!settings) return interaction.reply({ content: settingsError, ephemeral: true });

    try {
    } catch (error) {
        bot.error('Error in Slash Command CommandName', error);
    }
};

module.exports.data = (bot, lang = 'en_us') => {
    var langData = bot.languages[lang].slashCommandBuilder.template || bot.languages['en_us'].slashCommandBuilder.template;
    var slashCommandData = new SlashCommandBuilder().setName('template').setDescription(langData.description);
    return slashCommandData.toJSON();
};

module.exports.active = true;
