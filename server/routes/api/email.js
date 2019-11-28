const nodemailer = require('nodemailer');

const config = require('../../../config/config');

const { generateHTML, generateHTMLForSignUp } = require('../../services/email-html-generator');

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  // big bug: this port has to be set to 2525 for some reason
  port: 2525,
  auth: {
    user: config.email,
    pass: config.passwordForEmail
  }
});

const fromEmail = process.env.FROM_EMAIL || 'info@ticekralt.com';

module.exports = app => {
  app.get('/api/email/test', (req, res) => {
    transporter.verify((err, success) => {
      if (err) return res.send({
        success: false,
        message: 'Email error: ' + err
      });
      return res.send({
        success: true,
        message: 'Email working'
      });
    });
  });

  app.post('/api/email/send', (req, res) => {
    const { body } = req;
    const { items, customer } = body;

    const mailOptions = {
      from: fromEmail,
      to: customer.email,
      subject: 'Mingda Picture Frames Quote',
      html: generateHTML(customer,items)
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return res.send({
        success: false,
        message: 'There was an error ' + err
      });
      return res.send({
        success: true,
        message: 'Email sent: ' + info.response
      });
    });
  });

  app.post('/api/email/sendSignUpEmail', (req, res) => {
    const { body } = req;
    const { user } = body;

    console.log(user);
    
    const mailOptions = {
      from: fromEmail,
      to: user.email,
      subject: 'You signed up with Mingda PDQE',
      html: generateHTMLForSignUp(user)
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return res.send({
        success: false,
        message: 'Error sending email ' + err
      });
      return res.send({
        success: true,
        message: 'Email sent: ' + info.response
      });
    });
  });
}