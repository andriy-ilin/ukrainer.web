// const firebase = require("firebase");
// const database = firebase.database();
const models = require("./models");
const catalog = require("./CatalogShopItems");
const database = require("./init").database;

const link = "/shopItems";

const get = () => database.ref(link).once("value");

const getById = key => database.ref(`${link}/${key}`).once("value");

const create = data => {
  const key = database.ref(link).push().key;
  const model = models.ShopItems(data, key);
  catalog.create(data, key);
  return database.ref(`${link}/${key}`).set(model);
};

const update = (data, key) => {
  const model = models.ShopItems(data, key);
  catalog.update(data, key);
  return database.ref(`${link}/${key}`).update(model);
};

const remove = (lang, key) => {
  catalog.remove(lang, key);
  database.ref(`${link}/${key}`).remove();
};

module.exports.get = get;
module.exports.getById = getById;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
