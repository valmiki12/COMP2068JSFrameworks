var express = require('express');
var router = express.Router();

// Route for Home page
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Home' });
});

// Route for About Me page
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Me' });
});

// Route for Projects page
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projects' });
});

// Route for Contact Me page
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Me' });
});

module.exports = router;