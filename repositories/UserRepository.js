/**
 * UserRepository.js
 *
 * Database logic for User objects
 * NOTE: Stick with pg parameterized queries built-in sanitization
 */

const { Pool } = require('pg');
const pool = new Pool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 5,
  // connectionString: process.env.DB_CONNECT_STRING,
});

const userSchema = {
  table: process.env.DB_TABLE || 'users',
  id: process.env.COL_ID || 'id',
  firstName: process.env.COL_FIRST_NAME || 'first_name',
  lastName: process.env.COL_LAST_NAME || 'last_name',
  username: process.env.COL_USERNAME || 'username',
  passwordHash: process.env.COL_PASSWORD_HASH || 'password_hash',
  passwordSalt: process.env.COL_PASSWORD_SALT || 'password_salt',
};

const UserRepository = {
  getByUsername: async (username) => {
    const results = await pool.query(
      `
      SELECT * FROM "${userSchema.table}"
      WHERE "${userSchema.username}" = $1
      `,
      [username],
    );

    return results.rows.length > 0 ? results.rows[0] : null;
  },

  save: async (userDto) => {
    const { firstname, lastname, username, passwordHash, passwordSalt } = userDto;
    const results = await pool.query(
      `
      INSERT INTO "${userSchema.table}"
        ("${userSchema.firstName}", 
        "${userSchema.lastName}", 
        "${userSchema.username}", 
        "${userSchema.passwordHash}", 
        "${userSchema.passwordSalt}")
      VALUES
        ($1, $2, $3, $4, $5)
      `,
      [firstname, lastname, username, passwordHash, passwordSalt],
    );

    console.log(results);
  },
};

module.exports = UserRepository;
