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
        var langData = bot.languages[lang].commandOutput.voicechat || bot.languages['en_us'].commandOutput.voicechat;

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

        var subCommand = interaction.options.getSubcommand(true);

        switch (subCommand.toLowerCase()) {
            case 'name': {
                var updates = 0;
                if (channelObject?.updates != null) updates = 0 + channelObject.updates;
                if (updates >= 1) {
                    return interaction.reply({ content: 'Only 1 change.', ephemeral: true });
                }
                var name = interaction.options.getString('name');
                if (!name || name == '') {
                    return interaction.reply({ content: 'namevalidation.', ephemeral: true });
                }
                await bot.db.updateAsync('temp_voice', { channel: currentChannel.id }, { updates: updates + 1 });
                await currentChannel.edit({
                    name: name.slice(0, 20),
                });
                return interaction.reply({ content: 'name set to `' + name.slice(0, 20) + '`.', ephemeral: true });
            }

            case 'limit': {
                var limit = interaction.options.getNumber('limit');
                if (!limit || limit < 2 || limit > 99) {
                    limit = 6;
                }
                await currentChannel.edit({
                    userLimit: limit,
                });
                return interaction.reply({ content: 'size set to `' + limit + '`.', ephemeral: true });
            }

            case 'ban': {
                var toBan = interaction.options.getMember('target');
                if (!toBan || toBan.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'remove err', ephemeral: true });
                if (toBan.voice?.channel != null) {
                    toBan.voice?.disconnect('Was banned from temp voice channel!');
                }
                await currentChannel.permissionOverwrites.edit(toBan.id, {
                    CONNECT: false,
                });
                return interaction.reply({ content: 'banned', ephemeral: true });
            }

            case 'lock': {
                await currentChannel.permissionOverwrites.edit(currentChannel.guild.id, {
                    CONNECT: false,
                });
                return interaction.reply({ content: 'locked.', ephemeral: true });
            }

            case 'unlock': {
                await currentChannel.permissionOverwrites.edit(currentChannel.guild.id, {
                    CONNECT: true,
                });
                return interaction.reply({ content: 'unlocked', ephemeral: true });
            }

            default:
                interaction.reply({ content: 'subCommand invalid', ephemeral: true });
                return;
        }
    } catch (error) {
        bot.error('Error in Slash Command VC', error);
    }
};

module.exports.data = (bot, lang = 'en_us') => {
    var langData = bot.languages[lang].slashCommandBuilder.voicechat || bot.languages['en_us'].slashCommandBuilder.voicechat;
    var langDataSub = langData.subCommands;
    var slashCommandData = new SlashCommandBuilder()
        .setName('vc')
        .setDescription(langData.description)
        .addSubcommand((subcommand) =>
            subcommand
                .setName('ban')
                .setDescription(langDataSub.ban.description)
                .addUserOption((option) => option.setName('target').setDescription(langDataSub.ban.options.target).setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('name')
                .setDescription(langDataSub.name.description)
                .addStringOption((option) => option.setName('name').setDescription(langDataSub.name.options.name).setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('limit')
                .setDescription(langDataSub.limit.description)
                .addNumberOption((option) => option.setName('limit').setDescription(langDataSub.limit.options.limit).setRequired(true))
        )
        .addSubcommand((subcommand) => subcommand.setName('lock').setDescription(langDataSub.lock.description))
        .addSubcommand((subcommand) => subcommand.setName('unlock').setDescription(langDataSub.unlock.description));
    return slashCommandData.toJSON();
};

module.exports.active = true;
