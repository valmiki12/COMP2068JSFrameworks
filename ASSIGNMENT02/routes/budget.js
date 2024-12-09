const express = require('express');
const Budget = require('../models/Budget');
const Finance = require('../models/Finance');
const router = express.Router();

// Ensure the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to access this resource');
  return res.redirect('/auth/login');
};

// Display budgets and calculate expenses dynamically
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });

    const finances = await Finance.find({ user: req.user.id });
    const totalExpenses = finances.reduce((sum, finance) => sum + finance.amount, 0);

    res.render('budget', {
      title: 'Budget Insights',
      budgets,
      totalExpenses,
    });
  } catch (err) {
    console.error('Error fetching budgets or finances:', err);
    res.status(500).render('budget', { error: 'Something went wrong.' });
  }
});

// Add or update a budget
router.post('/add', ensureAuthenticated, async (req, res) => {
  const { type, salary, savings } = req.body;

  if (!type || !salary || savings === undefined) {
    req.flash('error_msg', 'All fields are required');
    return res.redirect('/budget');
  }

  try {
    const limit = salary - savings; // Calculate suggested spending limit

    const existingBudget = await Budget.findOne({ user: req.user.id, type });

    if (existingBudget) {
      existingBudget.salary = salary;
      existingBudget.savings = savings;
      existingBudget.limit = limit;
      await existingBudget.save();
      req.flash('success_msg', 'Budget updated successfully');
    } else {
      const newBudget = new Budget({
        user: req.user.id,
        type,
        salary,
        savings,
        limit,
      });
      await newBudget.save();
      req.flash('success_msg', 'Budget added successfully');
    }

    res.redirect('/budget');
  } catch (err) {
    console.error('Error saving budget:', err);
    req.flash('error_msg', 'Something went wrong.');
    res.redirect('/budget');
  }
});

// Route: Fetch data for the chart
router.get('/charts', ensureAuthenticated, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });

    const chartData = budgets.map((budget) => ({
      type: budget.type,
      salary: budget.salary,
      savings: budget.savings,
      limit: budget.limit,
    }));

    res.json(chartData);
  } catch (err) {
    console.error('Error fetching chart data:', err);
    res.status(500).json({ error: 'Failed to fetch chart data.' });
  }
});

// Delete a budget by type
router.post('/delete', ensureAuthenticated, async (req, res) => {
  const { type } = req.body;

  if (!type) {
    req.flash('error_msg', 'Budget type is required.');
    return res.redirect('/budget');
  }

  try {
    const result = await Budget.findOneAndDelete({ user: req.user.id, type });
    if (result) {
      req.flash('success_msg', `${type} budget deleted successfully.`);
    } else {
      req.flash('error_msg', `${type} budget not found.`);
    }
    res.redirect('/budget');
  } catch (err) {
    console.error('Error deleting budget:', err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/budget');
  }
});

module.exports = router;
