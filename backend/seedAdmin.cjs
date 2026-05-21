const db = require('./config/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    const check = await db.query(
      "SELECT * FROM users WHERE email = $1",
      ["superadmin@growpath.com"]
    );

    if (check.rows.length > 0) {
      console.log("⚠️ Admin sudah ada, skip insert");
      return process.exit();
    }

    const hashed = await bcrypt.hash('admin123', 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)",
      [
        "Super Admin",
        "superadmin@growpath.com",
        hashed,
        "superadmin"
      ]
    );

    console.log("✅ Superadmin created successfully");
    process.exit();

  } catch (err) {
    console.log("❌ Error:", err.message);
    process.exit(1);
  }
}

createAdmin();