import email from "nodemailer";

const sendEmail = async function (options) {
  const transporter = email.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailConfig = {
    from: "Satyam Pandey <psatyam1618@gmail.com>",
    to: options.to,
    subject: options.subject,
    text: options.message
  }
  console.log(emailConfig);

  transporter.sendMail(emailConfig);
};

export default sendEmail;