const db = require('../config/db');

exports.findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

exports.findUserByEmailAndRoleCondition = async (email, isForAdmin = false) => {
  const query = isForAdmin 
    ? "SELECT * FROM users WHERE email = $1 AND LOWER(role) IN ('admin', 'superadmin')"
    : "SELECT * FROM users WHERE email = $1 AND role = 'user'";
  
  const result = await db.query(query, [email]);
  return result.rows[0];
};

exports.findUserById = async (id) => {
  const result = await db.query("SELECT id, name, email, role FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

exports.createUser = async (name, email, hashedPassword) => {
  const result = await db.query(
    "INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, 'user', NOW()) RETURNING id, name, email, role",
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

exports.getAllUsers = async () => {
  const result = await db.query("SELECT id, name, email, role FROM users ORDER BY id ASC");
  return result.rows;
};