const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config({ path: '../config.env' })

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  // Define email options
  const mailOptions = {
    from: 'Natours <natours@natours.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || ''
  }

  // Send email
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err)
      throw new Error('Email could not be sent')
    }
    console.log('Email sent successfully:', info.response)
  })
}

module.exports = sendEmail