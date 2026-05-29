const db = require('../config/db');

exports.getAllAssessments = async () => {
  const result = await db.query(`SELECT * FROM assessments ORDER BY id ASC`);
  return result.rows;
};

exports.createAssessment = async (title, category, duration, description) => {
  const result = await db.query(
    `INSERT INTO assessments (title, category, duration, description) VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, category, duration, description]
  );
  return result.rows[0];
};

exports.updateAssessment = async (id, title, category, duration, description) => {
  const result = await db.query(
    `UPDATE assessments 
     SET title = $1, category = $2, duration = $3, description = $4 
     WHERE id = $5 RETURNING *`,
    [title, category, duration, description, id]
  );
  return result.rows;
};

exports.deleteAssessment = async (id) => {
  await db.query(`DELETE FROM assessments WHERE id = $1`, [id]);
};

// --- LOGIKA SUBMIT (DENGAN TRANSAKSI) ---
exports.submitAssessmentResult = async (userId, assessmentId, score, hours, skillCategory) => {
  await db.query('BEGIN'); // Start Transaction
  try {
    const result = await db.query(
      `INSERT INTO assessment_results (user_id, assessment_id, score, created_at) 
       VALUES($1, $2, $3, NOW()) RETURNING *`,
      [userId, assessmentId, score]
    );

    await db.query(
      `INSERT INTO user_activities (user_id, activity_date, hours_spent) 
       VALUES ($1, CURRENT_DATE, $2)`,
      [userId, hours]
    );

    const checkSkill = await db.query(
      `SELECT id, proficiency FROM user_skills WHERE user_id = $1 AND skill_name = $2`,
      [userId, skillCategory]
    );

    if (checkSkill.rows.length > 0) {
      await db.query(
        `UPDATE user_skills SET proficiency = GREATEST(proficiency, $3), updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND skill_name = $2`,
        [userId, skillCategory, score]
      );
    } else {
      await db.query(
        `INSERT INTO user_skills (user_id, skill_name, proficiency) VALUES ($1, $2, $3)`,
        [userId, skillCategory, score]
      );
    }

    await db.query('COMMIT'); // Save changes
    return result.rows[0];
  } catch (error) {
    await db.query('ROLLBACK'); // Cancel if error
    throw error;
  }
};

exports.getAssessmentCategory = async (assessmentId) => {
  const info = await db.query(`SELECT category FROM assessments WHERE id = $1`, [assessmentId]);
  return info.rows.length > 0 ? info.rows[0].category : 'General';
};

exports.getUserResultsHistory = async (userId) => {
  const result = await db.query(
    `SELECT ar.id, a.title, a.category, ar.score, ar.created_at
     FROM assessment_results ar
     JOIN assessments a ON a.id = ar.assessment_id
     WHERE ar.user_id = $1 ORDER BY ar.created_at DESC`,
    [userId]
  );
  return result.rows;
};

exports.getResultDetail = async (id, userId, adminId) => {
  let query, params;
  if (adminId) {
    query = `SELECT ar.id, a.title, a.category, ar.score, ar.created_at FROM assessment_results ar JOIN assessments a ON a.id = ar.assessment_id WHERE ar.id = $1`;
    params = [id];
  } else {
    query = `SELECT ar.id, a.title, a.category, ar.score, ar.created_at FROM assessment_results ar JOIN assessments a ON a.id = ar.assessment_id WHERE ar.id = $1 AND ar.user_id = $2`;
    params = [id, userId];
  }
  const result = await db.query(query, params);
  return result.rows;
};

exports.deleteResult = async (id) => {
  const result = await db.query(`DELETE FROM assessment_results WHERE id = $1 RETURNING *`, [id]);
  return result.rowCount;
};