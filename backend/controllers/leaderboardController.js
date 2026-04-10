const User = require('../models/User');

const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('name totalXP level streak')
      .sort({ totalXP: -1 })
      .limit(20);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      totalXP: user.totalXP,
      level: user.level,
      streak: user.streak
    }));

    res.json({ leaderboard });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeaderboard };
