const ProgressModel = require('../models/progressModel');

exports.getUserProgress = async (req, res) => {
  const { userId } = req.params;

  try {
    // ==========================================
    // 1. AMBIL SEMUA DATA SECARA PARALEL (LEBIH CEPAT)
    // ==========================================
    const [
      activitiesRows, 
      skillsRows, 
      badgesRows, 
      statsRow, 
      datesRows, 
      courseRows,
      roadmapRows // <-- PERBAIKAN 1: Tambahkan variabel ini untuk menangkap data roadmap
    ] = await Promise.all([
      ProgressModel.getWeeklyActivities(userId),
      ProgressModel.getUserSkills(userId),
      ProgressModel.getUserBadges(userId),
      ProgressModel.getUserStats(userId),
      ProgressModel.getActivityDates(userId),
      ProgressModel.getUserCourseProgress(userId),
      ProgressModel.getUserRoadmapProgress(userId) // Promise ke-7
    ]);

    // ==========================================
    // 2. FORMAT AKTIVITAS MINGGUAN (GRAFIK BAR)
    // ==========================================
    const formattedActivities = activitiesRows.map(row => ({
      name: row.name,
      hours: parseFloat(row.hours)
    }));

    // ==========================================
    // 3. STATISTIK RINGKASAN
    // ==========================================
    const totalHours = parseFloat(statsRow.total_hours) || 0;
    const completedCourses = parseInt(statsRow.completed_courses, 10) || 0;
    
    // Copy array agar bisa ditambah badge dinamis
    let userBadges = [...badgesRows]; 

    // ==========================================
    // 4. LOGIKA CURRENT STREAK
    // ==========================================
    const activityDates = datesRows.map(row => {
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
    // 5. LOGIKA BADGE KHUSUS (DYNAMIC)
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
    if (skillsRows.some(s => parseFloat(s.A) >= 90)) {
      userBadges.push({ title: 'High Proficiency', icon_name: 'Target' });
    }

    // ==========================================
    // 6. FORMAT DATA KURSUS
    // ==========================================
    const activeCourses = courseRows.map(row => ({
      courseId: row.course_id,
      percentage: row.progress_percentage,
      isCompleted: row.is_completed
    }));

    // ==========================================
    // 7. FORMAT DATA ROADMAP CHECKLIST (BARU)
    // PERBAIKAN 2: Mengubah baris DB menjadi object format
    // ==========================================
    const roadmapChecklist = {};
    if (roadmapRows && roadmapRows.length > 0) {
      roadmapRows.forEach(row => {
        if (!roadmapChecklist[row.phase_id]) {
          roadmapChecklist[row.phase_id] = [];
        }
        roadmapChecklist[row.phase_id].push(row.task_id);
      });
    }

    // ==========================================
    // 8. KIRIM RESPONSE AKHIR KE FRONTEND
    // ==========================================
    res.json({
      stats: {
        totalHours: totalHours,
        streak: currentStreak,
        completed: completedCourses,
        achievements: userBadges.length
      },
      activityData: formattedActivities,
      skillData: skillsRows.map(s => ({ ...s, A: parseFloat(s.A), fullMark: 100 })),
      badges: userBadges,
      activeCourses: activeCourses,
      roadmapChecklist: roadmapChecklist // <-- PERBAIKAN 3: Kirim data roadmap
    });

  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil data progress." });
  }
};