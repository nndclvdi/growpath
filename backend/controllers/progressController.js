const db = require('../config/db'); 

exports.getUserProgress = async (req, res) => {
  const { userId } = req.params;

  try {
    // ==========================================
    // 1. AMBIL AKTIVITAS MINGGUAN (GRAFIK BAR)
    // [FIXED]: Menggunakan CTE (WITH), SUM, dan GROUP BY agar hari tidak dobel
    // ==========================================
    const activitiesQuery = `
      WITH dates AS (
        SELECT generate_series(CURRENT_DATE - 6, CURRENT_DATE, '1 day'::interval)::date AS d
      )
      SELECT 
        TO_CHAR(dates.d, 'Dy') as name, 
        COALESCE(SUM(ua.hours_spent), 0) as hours 
      FROM dates
      LEFT JOIN user_activities ua ON dates.d = ua.activity_date AND ua.user_id = $1
      GROUP BY dates.d
      ORDER BY dates.d ASC;
    `;
    const activities = await db.query(activitiesQuery, [userId]);

    // Format jam menjadi float agar Recharts tidak error membaca string
    const formattedActivities = activities.rows.map(row => ({
      name: row.name,
      hours: parseFloat(row.hours)
    }));

    // ==========================================
    // 2. AMBIL DATA SKILL (RADAR CHART)
    // ==========================================
    const skillsQuery = `
      SELECT skill_name as subject, proficiency as A 
      FROM user_skills 
      WHERE user_id = $1;
    `;
    const skills = await db.query(skillsQuery, [userId]);

    // ==========================================
    // 3. AMBIL DATA BADGE DARI DATABASE
    // ==========================================
    const badgesQuery = `
      SELECT badge_title as title, icon_name 
      FROM user_achievements 
      WHERE user_id = $1;
    `;
    const badgesResult = await db.query(badgesQuery, [userId]);
    let userBadges = badgesResult.rows; 

    // ==========================================
    // 4. AMBIL STATISTIK RINGKASAN
    // [FIXED]: Parse ke Number untuk mencegah bug tampilan
    // ==========================================
    const statsQuery = `
      SELECT 
        (SELECT COALESCE(SUM(hours_spent), 0) FROM user_activities WHERE user_id = $1) as total_hours,
        (SELECT COUNT(*) FROM user_course_progress WHERE user_id = $1 AND is_completed = TRUE) as completed_courses;
    `;
    const statsResult = await db.query(statsQuery, [userId]);
    const totalHours = parseFloat(statsResult.rows[0].total_hours) || 0;
    const completedCourses = parseInt(statsResult.rows[0].completed_courses, 10) || 0;

    // ==========================================
    // 5. LOGIKA CURRENT STREAK
    // ==========================================
    const datesQuery = `
      SELECT DISTINCT activity_date::DATE as act_date 
      FROM user_activities 
      WHERE user_id = $1 AND hours_spent > 0 
      ORDER BY act_date DESC;
    `;
    const datesResult = await db.query(datesQuery, [userId]);
    
    // Konversi ke format timestamp (tanpa jam/menit)
    const activityDates = datesResult.rows.map(row => {
      const d = new Date(row.act_date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateToCheck = null;

    if (activityDates.includes(today.getTime())) {
      dateToCheck = today;
    } else if (activityDates.includes(yesterday.getTime())) {
      dateToCheck = yesterday;
    }

    if (dateToCheck) {
      while (activityDates.includes(dateToCheck.getTime())) {
        currentStreak++;
        dateToCheck.setDate(dateToCheck.getDate() - 1); // Mundur 1 hari
      }
    }

    // ==========================================
    // 6. LOGIKA BADGE KHUSUS (DYNAMIC)
    // ==========================================
    if (currentStreak >= 7) {
      userBadges.push({ title: '7-Day Streak', icon_name: 'Zap' });
    }
    if (totalHours >= 50) {
      userBadges.push({ title: 'Dedicated Coder', icon_name: 'Star' });
    }
    if (completedCourses >= 5) {
      userBadges.push({ title: 'Web Dev Master', icon_name: 'Award' });
    }
    // ParseFloat agar perbandingan angka lebih aman
    if (skills.rows.some(s => parseFloat(s.A) >= 90)) {
      userBadges.push({ title: 'High Proficiency', icon_name: 'Target' });
    }

    // ==========================================
    // 7. KIRIM RESPONSE AKHIR KE FRONTEND
    // ==========================================
    res.json({
      stats: {
        totalHours: totalHours,
        streak: currentStreak,
        completed: completedCourses,
        achievements: userBadges.length
      },
      activityData: formattedActivities,
      skillData: skills.rows.map(s => ({ ...s, A: parseFloat(s.A), fullMark: 100 })),
      badges: userBadges
    });

  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil data progress." });
  }
};