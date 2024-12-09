const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Route to display all expenses
router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/auth/login');
  const expenses = await Expense.find({ user: req.user.id });
  res.render('expenses', { title: 'Your Expenses', expenses });
});

// Route to add a new expense
router.post('/add', async (req, res) => {
  const { category, amount } = req.body;
  await new Expense({ user: req.user.id, category, amount }).save();
  res.redirect('/expenses');
});

// Route to delete an expense
router.post('/delete/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect('/expenses');
});

module.exports = router;
