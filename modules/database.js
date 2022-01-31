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

const MongoDatabaseHandler = require('./mongo-client');

module.exports.setupDatabaseHandler = (bot) => {
    bot.db = {};

    var databaseHandler = new MongoDatabaseHandler(process.env.MONGO_CONNECTION);

    bot.db.queryAsync = async (collection, searchQuery) => databaseHandler.queryAsync(process.env.DATABASE_NAME, collection, searchQuery);

    bot.db.insertAsync = async (collection, object) => databaseHandler.insertObject(process.env.DATABASE_NAME, collection, object);

    bot.db.updateAsync = async (collection, searchQuery, object) => databaseHandler.updateObject(process.env.DATABASE_NAME, collection, searchQuery, object);

    bot.db.deleteAsync = async (collection, searchQuery) => databaseHandler.deleteObject(process.env.DATABASE_NAME, collection, searchQuery);
};
