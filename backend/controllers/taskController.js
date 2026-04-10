const Task = require('../models/Task');
const User = require('../models/User');

const createTask = async (req, res, next) => {
  try {
    const { title, xp, dueDate, area } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title,
      xp: xp || 10,
      dueDate: dueDate || null,
      area: area || 'General',
      userId: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const completeTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (task.completed) {
      return res.status(400).json({ message: 'Task already completed' });
    }

    task.completed = true;
    await task.save();

    const user = await User.findById(req.user._id);
    user.totalXP += task.xp;
    user.level = Math.floor(user.totalXP / 100) + 1;
    await user.save();

    res.json({
      task,
      user: {
        totalXP: user.totalXP,
        level: user.level,
        streak: user.streak
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, completeTask, deleteTask };
