//@ts-check
const { MongoClient } = require('mongodb')
const dbConfig = require('../config/db.config')
module.exports = {
  useDb(/**@type {string}*/name) {
    return {
      getData: async (/** @type {import("mongodb").Filter<import("bson").Document>} */ filter) => {
        const client = await MongoClient.connect(dbConfig.host)
        const db = client.db(dbConfig.database);
        let results = await db.collection(name).find(filter).toArray();
        client.close();
        return results
      },
      addData: async (/** @type {import("mongodb").OptionalId<import("bson").Document>[]} */ value) => {
        const client = await MongoClient.connect(dbConfig.host)
        const db = client.db(dbConfig.database);
        await db.collection(name).insertMany(value)
        client.close();
      },
      updateData: async (/** @type {import("mongodb").Filter<import("bson").Document>} */filter, /** @type {import("mongodb").UpdateFilter<import("bson").Document>} */ update) => {
        const client = await MongoClient.connect(dbConfig.host)
        const db = client.db(dbConfig.database);
        await db.collection(name).updateMany(filter, update)
        client.close();
      },
      deleteData: async (/** @type {import("mongodb").Filter<import("bson").Document>} */ filter) => {
        const client = await MongoClient.connect(dbConfig.host)
        const db = client.db(dbConfig.database);
        await db.collection(name).deleteMany(filter)
        client.close();
      },
      updateAllData: async (/** @type {import("mongodb").UpdateFilter<import("bson").Document>} */ value,/** @type {import("mongodb").Filter<import("bson").Document>?} */ filter) => {
        const client = await MongoClient.connect(dbConfig.host)
        const db = client.db(dbConfig.database);
        await db.collection(name).findOneAndUpdate({ ...filter }, { $set: value })
        client.close();
      },
      getDataWithOptions: async (/** @type {import("mongodb").Filter<import("bson").Document>} */ filter, /** @type {import("mongodb").FindOptions<import("bson").Document> | undefined} */ options) => {
        const client = await MongoClient.connect(dbConfig.host)
        const db = client.db(dbConfig.database);
        let results = await db.collection(name).find(filter, options).toArray();
        client.close();
        return results
      },
      count: async (/** @type {import("mongodb").Filter<import("bson").Document>} */ filter) => {
        const client = await MongoClient.connect(dbConfig.host)
        const db = client.db(dbConfig.database);
        let results = await db.collection(name).countDocuments(filter)
        client.close();
        return results
      },
      aggregate: async (/** @type {import("bson").Document[] | undefined} */ filter, /** @type {import("mongodb").AggregateOptions | undefined} */ options) => {
        const client = await MongoClient.connect(dbConfig.host)
        const db = client.db(dbConfig.database);
        let results = await db.collection(name).aggregate(filter, options).toArray()
        client.close();
        return results
      }
    }
  }
}
