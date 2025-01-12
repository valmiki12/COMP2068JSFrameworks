const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'valmiki.2k4@gmail.com', // Your Gmail address
    pass: 'zksh rmyv hwtu qfxo',   // Your App Password
  },
});

// GET route to render the contact page
router.get('/', (req, res) => {
  res.render('contact', { title: 'Contact Me' });
});

// POST route to handle form submission
router.post('/', (req, res) => {
  console.log('Form Data:', req.body); // Debugging to ensure data is received

  const { name, email, message } = req.body;

  // Validate that all fields are filled
  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  // Email options
  const mailOptions = {
    from: email, // User's email entered in the form
    to: 'valmiki.2k4@gmail.com', // Your email address to receive messages
    subject: `New Contact Form Submission from ${name}`,
    text: `You received a new message from your website:
    Name: ${name}
    Email: ${email}
    Message: ${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('An error occurred. Please try again later.');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Thank you for contacting me! I will get back to you soon.');
  });
});

module.exports = router;
