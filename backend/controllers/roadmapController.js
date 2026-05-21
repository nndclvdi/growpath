const db = require('../config/db');

exports.getRoadmaps = async (
  req,
  res
) => {

  try {

    const result =
      await db.query(
        'select * from roadmaps order by id asc'
      );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        'Failed get roadmaps'
    });

  }
};