const express = require('express');
const Finance = require('../models/Finance');
const router = express.Router();

// Middleware to ensure the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to access this resource.');
  res.redirect('/auth/login');
};

// Display all finances or search results
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const query = req.query.q; // Capture the search query
    const searchCondition = query
      ? {
          user: req.user.id,
          $or: [
            { category: { $regex: query, $options: 'i' } }, // Case-insensitive search for category
            { amount: parseFloat(query) || 0 }, // Exact match for numeric amount
          ],
        }
      : { user: req.user.id }; // Fetch all finances if no query

    const finances = await Finance.find(searchCondition); // Execute the query
    res.render('finances', { finances, query, title: 'My Finances' }); // Pass data to the template
  } catch (err) {
    console.error('Error fetching finances:', err);
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
    const newFinance = new Finance({ user: req.user.id, category, amount });
    await newFinance.save();
    req.flash('success_msg', 'Finance added successfully.');
    res.redirect('/finances');
  } catch (err) {
    console.error('Error adding finance:', err);
    req.flash('error_msg', 'Error adding finance.');
    res.redirect('/finances');
  }
});

// Edit an existing finance entry
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  const { category, amount } = req.body;

  try {
    await Finance.findByIdAndUpdate(req.params.id, { category, amount });
    req.flash('success_msg', 'Finance record updated successfully.');
    res.redirect('/finances');
  } catch (err) {
    console.error('Error updating finance:', err);
    req.flash('error_msg', 'Error updating finance.');
    res.redirect('/finances');
  }
});

// Delete a finance entry
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Finance.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Finance record deleted successfully.');
    res.redirect('/finances');
  } catch (err) {
    console.error('Error deleting finance:', err);
    req.flash('error_msg', 'Error deleting finance.');
    res.redirect('/finances');
  }
});

module.exports = router;
