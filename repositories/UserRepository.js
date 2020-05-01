/**
 * UserRepository.js
 *
 * Database logic for User objects
 * NOTE: Stick with pg parameterized queries built-in sanitization
 */

const database = require('../config/database');
const TableName = process.env.TABLE_NAME;

const UserRepository = {
  getByUsername: async (username) => {
    const params = { TableName, Key: { username } };
    const response = await database.get(params).promise();
    return response.Item;
  },

  save: async (userDto) => {
    const { firstname, lastname, username, passwordHash, passwordSalt } = userDto;
    const Item = { firstname, lastname, username, passwordHash, passwordSalt };
    const params = { TableName, Item };
    const response = await database.put(params).promise();
    if (!response) throw Error(`There was an error creating the user ${username}`);
    return Item;
  },
};

module.exports = UserRepository;
