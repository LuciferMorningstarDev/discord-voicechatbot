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
    try {
        var embed = await bot.tools.generateEmbed({
            title: 'discord-voicechatbot',
            url: 'https://bit.ly/discord-tempvoice',
            color: 0x096069,
            thumbnail: bot.user.displayAvatarURL(),
            description: `
[Invite](https://bit.ly/discord-tempvoice) | [Support](https://bit.ly/discord-voicechatbot-support) | [SourceCode](https://bit.ly/discord-voicechatbot-repo)

[Issues / Request Features](https://github.com/LuciferMorningstarDev/discord-voicechatbot/issues/new) please make sure to use the correct labels 

**Developed by:** [LuciferMorningstarDev](https://github.com/LuciferMorningstarDev)
            `,
            timestamp: false,
        });
        interaction.reply({ embeds: [embed] });
    } catch (error) {
        bot.error('Error in Slash Command Credits', error);
    }
};

module.exports.data = (bot, lang = 'en_us') => {
    var slashCommandData = new SlashCommandBuilder().setName('credits').setDescription('Credits of the bot: Invite / SourceCode / Support Invite');
    return slashCommandData.toJSON();
};

module.exports.active = true;
