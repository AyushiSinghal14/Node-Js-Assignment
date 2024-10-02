// services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendTaskCompletionEmail = (email, task) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Task Completed",
    text: `Your task "${task.title}" has been marked as completed.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
