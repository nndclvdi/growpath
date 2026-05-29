const db = require('../config/db');

exports.getAllRoadmaps = async () => {
  const result = await db.query('SELECT * FROM roadmaps ORDER BY id ASC');
  return result.rows;
};

exports.toggleRoadmapProgress = async (userId, phaseId, taskId) => {
  await db.query('BEGIN'); // Start Transaction
  try {
    const checkExist = await db.query(
      `SELECT id FROM user_roadmap_progress WHERE user_id = $1 AND phase_id = $2 AND task_id = $3`,
      [userId, phaseId, taskId]
    );

    if (checkExist.rows.length > 0) {
      await db.query(
        `DELETE FROM user_roadmap_progress WHERE user_id = $1 AND phase_id = $2 AND task_id = $3`,
        [userId, phaseId, taskId]
      );
      await db.query(
        `DELETE FROM user_activities WHERE id IN (SELECT id FROM user_activities WHERE user_id = $1 AND activity_date = CURRENT_DATE AND hours_spent = 0.17 LIMIT 1)`,
        [userId]
      );
      await db.query('COMMIT');
      return { status: 'removed' };
    } else {
      await db.query(
        `INSERT INTO user_roadmap_progress (user_id, phase_id, task_id, created_at) VALUES ($1, $2, $3, NOW())`,
        [userId, phaseId, taskId]
      );
      await db.query(
        `INSERT INTO user_activities (user_id, activity_date, hours_spent) VALUES ($1, CURRENT_DATE, 0.17)`,
        [userId]
      );
      await db.query('COMMIT');
      return { status: 'added' };
    }
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
};