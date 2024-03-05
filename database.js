
const { Pool } = require('pg');

const pool = new Pool({
  user: 'dyjfpsho',
  host: 'flora.db.elephantsql.com',
  database: 'dyjfpsho',
  password: 'a0N5GKX2kyBNAZ68w8Gpaw8AsGShUH6j',
  port: 5432,
});

async function insertUser(username, hashedPassword, role) {

  if (typeof username !== 'string') {
    throw new Error('Username must be a string');
  }

  const client = await pool.connect();
  try {
      const result = await client.query(
          'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
          [username, hashedPassword, role]
      );

      const insertedUser = result.rows[0];
      return insertedUser;
  } catch (error) {
    console.log('help'); // Debug statement
    console.error('Error inserting user:', error);
    throw new Error('Error inserting user');
  } finally {
      client.release();
  }
}


async function getUserByUsername(username) {

  if (typeof username !== 'string') {
    throw new Error('Username must be a string');
  }
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
}

async function deleteUserByUsername(username) {
  try {
    const result = await pool.query('DELETE FROM users WHERE username = $1 RETURNING *', [username]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error deleting user by username:', error);
    throw error;
  }
}

async function deleteUserById(userId) {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error deleting user by user_id:', error);
    throw error;
  }
}

async function updateUserPassword(username, newPassword) {

  try {
    const query = 'UPDATE users SET password_hash = $1 WHERE username = $2';
    const result = await pool.query(query, [newPassword, username]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
}

module.exports = { pool, insertUser, getUserByUsername, updateUserPassword, deleteUserByUsername, deleteUserById };
