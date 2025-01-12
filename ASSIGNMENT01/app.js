var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactRouter = require('./routes/contact'); // Import the contact route

var app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views')); // View directory path
app.set('view engine', 'hbs'); // Handlebars as view engine

// Middleware
app.use(logger('dev')); // Logging middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contact', contactRouter); // Use the contact route

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start the server
const PORT = process.env.PORT || 3000; // Fallback to port 3000 if PORT is undefined
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
