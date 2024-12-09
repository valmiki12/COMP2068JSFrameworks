const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const hbs = require('hbs');

// Load environment variables
dotenv.config();

// Database and Passport Configuration
require('./config/database')();
require('./config/passport')(passport);

// Import Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const financeRouter = require('./routes/finances');
const budgetRouter = require('./routes/budget');

const app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Register Handlebars Helpers
hbs.registerHelper('eq', (a, b) => a === b);
hbs.registerHelper('divide', (a, b) => (b !== 0 ? (a / b).toFixed(2) : 0));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.year = new Date().getFullYear(); // Current Year for Footer
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/finances', financeRouter);
app.use('/budget', budgetRouter);

// Error Handling
app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Page Not Found' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', { message: 'Internal Server Error' });
});

module.exports = app;
