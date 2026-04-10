const { generateTasks, generateMotivation, analyzeProductivity } = require('../services/geminiService');
const Task = require('../models/Task');

const aiGenerateTasks = async (req, res, next) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ message: 'Goal is required' });
    }

    const tasks = await generateTasks(goal);
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

const aiMotivation = async (req, res, next) => {
  try {
    const quote = await generateMotivation();
    res.json({ motivation: quote });
  } catch (error) {
    next(error);
  }
};

const aiAnalyze = async (req, res, next) => {
  try {
    const completedTasks = await Task.find({ userId: req.user._id, completed: true }).select('title area xp');

    if (completedTasks.length === 0) {
      return res.json({ insights: 'No completed tasks yet. Start completing tasks to get productivity insights!' });
    }

    const tasksString = completedTasks
      .map(t => `- ${t.title} (Area: ${t.area}, XP: ${t.xp})`)
      .join('\n');

    const insights = await analyzeProductivity(tasksString);
    res.json({ insights });
  } catch (error) {
    next(error);
  }
};

module.exports = { aiGenerateTasks, aiMotivation, aiAnalyze };
