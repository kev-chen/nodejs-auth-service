/**
 * UserRepository.js
 * 
 * Database logic for User objects
 * NOTE: Stick with pg parameterized queries built-in sanitization
 */

const { Pool } = require('pg');
const userValidator = require('../dto/UserValidator');
const pool = new Pool({
  connectionString: process.env.DB_HOST,
});

const UserRepository = {
  getByUsername: async (username) => {
    const results = await pool.query('SELECT * FROM "Users" WHERE "Username" = $1', [username]);
    return (results.rows.length > 0) ? results.rows[0] : null;
  },
  save: async (userDto) => {
    const { error } = userValidator.validate(userDto);
    if (error) throw new Error(error.details[0].message);

    const { firstname, lastname, username, passwordHash, passwordSalt } = userDto;

    await pool.query(
      'INSERT INTO "Users"("FirstName", "LastName", "Username", "PasswordHash", "PasswordSalt") VALUES($1, $2, $3, $4, $5)',
      [firstname, lastname, username, passwordHash, passwordSalt],
    );
  },
};

module.exports = UserRepository;
