const Task = require('../models/Task');
const User = require('../models/User');

const getTodayXP = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId: req.user._id,
      completed: true,
      updatedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const todayXP = tasks.reduce((sum, t) => sum + t.xp, 0);
    res.json({ todayXP, tasksCompleted: tasks.length });
  } catch (error) {
    next(error);
  }
};

const getAllTimeXP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('totalXP level streak');
    res.json({
      totalXP: user.totalXP,
      level: user.level,
      streak: user.streak
    });
  } catch (error) {
    next(error);
  }
};

const getProgress = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const byArea = {};
    for (const task of tasks) {
      if (!byArea[task.area]) {
        byArea[task.area] = { total: 0, completed: 0, xp: 0 };
      }
      byArea[task.area].total += 1;
      if (task.completed) {
        byArea[task.area].completed += 1;
        byArea[task.area].xp += task.xp;
      }
    }

    const user = await User.findById(req.user._id).select('totalXP level streak');
    const xpToNextLevel = 100 - (user.totalXP % 100);

    res.json({
      total,
      completed,
      pending,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
      byArea,
      totalXP: user.totalXP,
      level: user.level,
      xpToNextLevel,
      streak: user.streak
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodayXP, getAllTimeXP, getProgress };
