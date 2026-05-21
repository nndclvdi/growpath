const db = require('../config/db');

exports.getCourses = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM courses ORDER BY id DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const result = await db.query(
      'INSERT INTO courses(title, description, image) VALUES($1,$2,$3) RETURNING *',
      [title, description, image]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'DELETE FROM courses WHERE id = $1',
      [id]
    );

    res.json({
      message: 'Course deleted',
    });
  } catch (error) {
    console.log(error);
  }
};