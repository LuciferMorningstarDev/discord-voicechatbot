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

const { MongoClient } = require('mongodb');

const DRIVER_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

class MongoDatabaseHandler {
    /**
     * Get the instance of the driver by giving a connection String
     * @param {String} connectionstring
     */
    constructor(connectionstring) {
        this.connectionstring = connectionstring;
    }

    /**
     * Get the instance of the driver by giving simply the following parameter ( wthout connection String )
     * @param {String} username
     * @param {String} password
     * @param {String} host
     * @param {Integer} port
     * @param {String} authenticationDatabase
     */
    static simple(username, password, host, port, authenticationDatabase) {
        if (!username || !password || !host) {
            throw new Error('Username Password and Host MUST be given.');
        }
        return new NodejsMongoDriver(`mongodb://${username}:${password}@${host}:${port != null ? port : '27017'}/${authenticationDatabase != null ? authenticationDatabase : 'admin'}`);
    }

    /**
     * Create a database at your MongoDB instance
     * @param {String} databaseName
     * @param {CallableFunction} callbackFunction
     */
    createDatabase = (databaseName, callbackFunction) => {
        MongoClient.connect(this.connectionstring + databaseName, DRIVER_OPTIONS, function (error, db) {
            if (error) return callbackFunction(false, error);
            db.close();
            if (callbackFunction) callbackFunction(true);
        });
    };

    /**
     * Async creation of a database at your MongoDB instance
     * @param {String} databaseName
     * @returns {Promise<Object>}
     */
    createDatabaseAsync = async (databaseName) => {
        return new Promise((resolve, reject) => {
            this.createDatabase(this.connectionstring, databaseName, (result, err) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * Create a collection in your given database
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {CallableFunction} callbackFunction
     */
    createCollection = (databaseName, collectionName, callbackFunction) => {
        MongoClient.connect(this.connectionstring, DRIVER_OPTIONS, (error, db) => {
            if (error) return callbackFunction(false, error);
            var dbf = db.db(databaseName);
            dbf.createCollection(collectionName, function (err, result) {
                if (err) return callbackFunction(false, err);
                db.close();
                if (callbackFunction) callbackFunction(true);
            });
        });
    };

    /**
     * Async creation of a collection in your given database
     * @param {String} databaseName
     * @param {String} collectionName
     * @returns {Promise<Object>}
     */
    createCollectionAsync = async (databaseName, collectionName) => {
        return new Promise((resolve, reject) => {
            this.createCollection(this.connectionstring, databaseName, collectionName, (result, err) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * Search for an Object by give em an object to match
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @param {CallableFunction} callbackFunction
     */
    query = (databaseName, collectionName, queryObject, callbackFunction) => {
        MongoClient.connect(this.connectionstring, DRIVER_OPTIONS, (error, db) => {
            if (error) return callbackFunction(false, error);
            var dbf = db.db(databaseName);
            dbf.collection(collectionName)
                .find(queryObject)
                .toArray(function (err, result) {
                    if (err) return callbackFunction(false, err);
                    db.close();
                    if (callbackFunction) callbackFunction(result);
                });
        });
    };

    /**
     * async search for an Object by give em an object to match
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @returns {Promise<Object>}
     */
    queryAsync = async (databaseName, collectionName, queryObject) => {
        return new Promise((resolve, reject) => {
            this.query(databaseName, collectionName, queryObject, (result, err) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * Insert a new Object to the given Collection
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} onject
     * @param {CallableFunction} callbackFunction
     */
    insertObject = (databaseName, collectionName, object, callbackFunction) => {
        MongoClient.connect(this.connectionstring, DRIVER_OPTIONS, (error, db) => {
            if (error) return callbackFunction(false, error);
            var dbf = db.db(databaseName);
            dbf.collection(collectionName).insertOne(object, (err, result) => {
                if (err) return callbackFunction(false, err);
                db.close();
                if (callbackFunction) callbackFunction(true);
            });
        });
    };

    /**
     * Async insert a new Object to the given Collection
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} object
     * @returns {Promise<Object>}
     */
    insertObjectAsync = async (databaseName, collectionName, object) => {
        return new Promise((resolve, reject) => {
            this.insertObject(databaseName, collectionName, object, (result, err) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * Delete a queried object
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @param {CallableFunction} callbackFunction
     */
    deleteObject = (databaseName, collectionName, queryObject, callbackFunction) => {
        MongoClient.connect(this.connectionstring, DRIVER_OPTIONS, (error, db) => {
            if (error) return callbackFunction(false, error);
            var dbf = db.db(databaseName);
            dbf.collection(collectionName).deleteOne(queryObject, function (err, result) {
                if (err) return callbackFunction(false, err);
                db.close();
                if (callbackFunction) callbackFunction(true);
            });
        });
    };

    /**
     * Async delete a queried object
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @returns {Promise<Object>}
     */
    deleteObjectAsync = async (databaseName, collectionName, queryObject) => {
        return new Promise((resolve, reject) => {
            this.deleteObject(databaseName, collectionName, queryObject, (result, err) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * Update a queried object.. it inserts the given object key value pairs
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @param {Object} newValues
     * @param {CallableFunction} callbackFunction
     */
    updateObject = (databaseName, collectionName, queryObject, newValues, callbackFunction) => {
        MongoClient.connect(this.connectionstring, DRIVER_OPTIONS, (error, db) => {
            if (error) return callbackFunction(false, error);
            var dbf = db.db(databaseName);
            let obj = {
                $set: newValues,
            };
            dbf.collection(collectionName).updateOne(queryObject, obj, function (err, result) {
                if (err) return callbackFunction(false, err);
                db.close();
                if (callbackFunction) callbackFunction(true);
            });
        });
    };

    /**
     * Async Update a queried object.. it inserts the given object key value pairs
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @param {Object} newValues
     * @returns {Promise<Object>}
     */
    updateObjectAsync = async (databaseName, collectionName, queryObject, newValues) => {
        return new Promise((resolve, reject) => {
            this.updateObject(databaseName, collectionName, queryObject, newValues, (result, err) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };
}

module.exports = MongoDatabaseHandler;
