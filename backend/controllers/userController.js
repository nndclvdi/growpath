const UserModel = require('../models/userModel');

exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({ message: 'Internal Server Error saat mengambil data user' });
  }
};