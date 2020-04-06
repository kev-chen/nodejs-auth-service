/**
 * UserRepository.js
 *
 * Database logic for User objects
 * NOTE: Stick with pg parameterized queries built-in sanitization
 */

const { Pool } = require('pg');
const pool = new Pool({
  database: 'Todos',
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 5,
  // connectionString: process.env.DB_CONNECT_STRING,
});

const UserRepository = {
  getByUsername: async (username) => {
    const results = await pool.query(
      `
      SELECT * FROM "Users" 
      WHERE "Username" = $1
      `,
      [username],
    );

    return results.rows.length > 0 ? results.rows[0] : null;
  },

  save: async (userDto) => {
    const { firstname, lastname, username, passwordHash, passwordSalt } = userDto;
    const results = await pool.query(
      `
      INSERT INTO "Users"
        ("FirstName", "LastName", "Username", "PasswordHash", "PasswordSalt")
      VALUES
        ($1, $2, $3, $4, $5)
      `,
      [firstname, lastname, username, passwordHash, passwordSalt],
    );

    console.log(results);
  },
};

module.exports = UserRepository;
