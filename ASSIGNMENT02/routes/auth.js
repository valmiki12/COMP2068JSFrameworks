const express = require('express');
const passport = require('passport');
const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Local login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/finances',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

// GitHub login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: '/finances',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

// Handle logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/auth/login');
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
  });
});

// Render register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Handle registration
router.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.render('register', {
      error: 'All fields are required',
      title: 'Register',
    });
  }

  if (password !== confirmPassword) {
    return res.render('register', {
      error: 'Passwords do not match',
      title: 'Register',
    });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', {
        error: 'Username already exists',
        title: 'Register',
      });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    req.flash('success_msg', 'You are registered and can now log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.render('register', {
      error: 'Something went wrong. Please try again.',
      title: 'Register',
    });
  }
});

module.exports = router;
