const express = require('express');
const Finance = require('../models/Finance'); // Ensure this model exists
const router = express.Router();

// Middleware to ensure the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  console.log('Authenticating user...');
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('User not authenticated');
  req.flash('error_msg', 'Please log in to access this resource.');
  res.redirect('/auth/login');
};

// Display all finances
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    console.log('Fetching finances for user:', req.user.id);
    const finances = await Finance.find({ user: req.user.id });
    console.log('Finances fetched:', finances);
    res.render('finances', { finances, title: 'My Finances' });
  } catch (err) {
    console.error('Error fetching finances:', err.message);
    req.flash('error_msg', 'Error fetching finances.');
    res.redirect('/');
  }
});

// Add a new finance entry
router.post('/add', ensureAuthenticated, async (req, res) => {
  const { category, amount } = req.body;

  if (!category || !amount) {
    req.flash('error_msg', 'All fields are required.');
    return res.redirect('/finances');
  }

  try {
    console.log('Adding new finance:', { category, amount, user: req.user.id });
    const newFinance = new Finance({ user: req.user.id, category, amount });
    await newFinance.save();
    req.flash('success_msg', 'Finance added successfully.');
    res.redirect('/finances');
  } catch (err) {
    console.error('Error adding finance:', err.message);
    req.flash('error_msg', 'Error adding finance.');
    res.redirect('/finances');
  }
});

// Edit an existing finance entry
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  const { category, amount } = req.body;

  if (!category || !amount) {
    req.flash('error_msg', 'All fields are required.');
    return res.redirect('/finances');
  }

  try {
    console.log('Updating finance:', { id: req.params.id, category, amount });
    await Finance.findByIdAndUpdate(req.params.id, { category, amount });
    req.flash('success_msg', 'Finance record updated successfully.');
    res.redirect('/finances');
  } catch (err) {
    console.error('Error updating finance:', err.message);
    req.flash('error_msg', 'Error updating finance.');
    res.redirect('/finances');
  }
});

// Delete a finance entry
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    console.log('Deleting finance:', req.params.id);
    await Finance.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Finance record deleted successfully.');
    res.redirect('/finances');
  } catch (err) {
    console.error('Error deleting finance:', err.message);
    req.flash('error_msg', 'Error deleting finance.');
    res.redirect('/finances');
  }
});

module.exports = router;
