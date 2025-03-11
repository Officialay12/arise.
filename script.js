const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (if you have a frontend)
app.use(express.static('public'));

// Route to handle form submission
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  // Validate form data
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Log the form data (for debugging)
  console.log('Form Data:', { name, email, message });

  // Option 1: Save to a database (e.g., MongoDB, PostgreSQL)
  // Example: Save to a JSON file for simplicity
  const fs = require('fs');
  const formData = { name, email, message, timestamp: new Date() };
  fs.appendFile('form-submissions.json', JSON.stringify(formData) + '\n', (err) => {
    if (err) {
      console.error('Error saving form data:', err);
      return res.status(500).json({ success: false, message: 'Failed to save form data.' });
    }
  });

  // Option 2: Send an email (using Nodemailer)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: 'your-email@gmail.com', // Replace with your email
      pass: 'your-email-password', // Replace with your email password
    },
  });

  const mailOptions = {
    from: 'sungtech675@gmail.com',
    to: 'recipient-email@gmail.com', // Replace with recipient email
    subject: 'New Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
    console.log('Email sent:', info.response);
  });

  // Send a success response
  res.status(200).json({ success: true, message: 'Form submitted successfully!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});