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

module.exports = async (bot, oldState, newState) => {
    if (oldState?.guild?.id == null) return;

    let selfMember = await oldState.guild.members.fetch(bot.user.id);
    if (!selfMember.permissions.has('MANAGE_CHANNELS')) return;

    var guildObject = await bot.db.queryAsync('guilds', { id: oldState.guild.id });
    if (!guildObject || guildObject.length < 1) return;
    guildObject = guildObject[0];

    var lobby = guildObject.temp_voice.lobby;
    var category = guildObject.temp_voice.category;

    if (newState.channel && newState.channel.parent) {
        if (newState.channel.id != lobby) return;
        if (newState.channel.parent.id != category) return;
        let channel = await newState.member.guild.channels.create(newState.member.displayName, {
            type: 'GUILD_VOICE',
        });
        channel.setParent(category);
        channel.setUserLimit(6);
        newState.member.voice.setChannel(channel);
        await bot.db.insertAsync('temp_voice', { channel: channel.id, owner: newState.member.id, updates: 0 });
        return;
    }

    if (oldState.channel.parent?.id != category) return;

    bot.channels.cache.get(category).children.forEach((channel) => {
        if (channel.type == 'GUILD_VOICE') {
            if (channel.id != lobby) {
                if (channel.members.size < 1) {
                    channel.delete('making room for new tempvoice channels');
                    bot.db.deleteAsync('temp_voice', { channel: channel.id });
                }
            }
        }
    });
};
