
const { Pool } = require('pg');

const pool = new Pool({
  user: 'dyjfpsho',
  host: 'flora.db.elephantsql.com',
  database: 'dyjfpsho',
  password: 'a0N5GKX2kyBNAZ68w8Gpaw8AsGShUH6j',
  port: 5432,
});

 async function insertUser(username, hashedPassword, role) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role]
    );

    console.log(result);

    const insertedUser = result.rows[0];
    return insertedUser;
  } finally {
    client.release();
  }
}

async function getUserByUsername(username) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null; // User not found
    }
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error; // Propagate the error
  }
}


module.exports = { pool, insertUser, getUserByUsername };