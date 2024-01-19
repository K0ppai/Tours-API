import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const nodemailerOptions: SMTPTransport.Options = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
};

export const sendEmail = async (options: { [key: string]: string }) => {
  const transporter = nodemailer.createTransport(nodemailerOptions);

  const mailOptions = {
    from: 'Test <test@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  await transporter.sendMail(mailOptions);
};
