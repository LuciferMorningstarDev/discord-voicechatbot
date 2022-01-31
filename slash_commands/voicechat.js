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

module.exports.run = async (bot, interaction) => {
    const Discord = moduleRequire('discord.js');

    try {
        var member = interaction.member;
        if (member.partial) member = await member.fetch({ cache: true });
        var currentChannel = member.voice?.channel;

        if (!currentChannel) {
            return interaction.reply({ content: "You're not in a temp voice channel.", ephemeral: true });
        }

        var channelObject = await bot.db.queryAsync('temp_voice', { channel: currentChannel.id }).catch((err) => {});

        if (!channelObject && channelObject.length < 1) return interaction.reply({ content: 'The channel you have entered is not a temp voice channel.', ephemeral: true });

        channelObject = channelObject[0];

        if (!member.permissions.has('MANAGE_CHANNELS') && member.id != '427212136134213644' && member.id != channelObject.owner) {
            return interaction.reply({ content: 'No perm', ephemeral: true });
        }

        return interaction.reply({ content: 'DO STH', ephemeral: true });
    } catch (error) {
        bot.error('Error in Slash Command VC', error);
    }
};

module.exports.data = new SlashCommandBuilder()
    .setName('voicechat')
    .setDescription('You can edit your channel with this command')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('ban')
            .setDescription('Exclude users from your channel!')
            .addUserOption((option) => option.setName('target').setDescription('@User - The user you want to exclude.').setRequired(true))
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('name')
            .setDescription('Change the name of your channel. ( Up to 20 chars )')
            .addStringOption((option) => option.setName('name').setDescription('A new name for the channel').setRequired(true))
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('limit')
            .setDescription('Change the user limit restrictions of your channel')
            .addNumberOption((option) => option.setName('limit').setDescription('New Limit ( 2-99 )').setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand.setName('lock').setDescription('This command makes the channel not joinable for new members'))
    .addSubcommand((subcommand) => subcommand.setName('unlock').setDescription('This command makes the channel joinable again for new members'));

module.exports.active = true;
