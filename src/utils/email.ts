import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';
import { IUser } from 'types';
import { htmlToText } from 'html-to-text';
import { html } from '../data/emailTemplate';
dotenv.config({ path: '.env' });

export class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Paing <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENGRID_USERNAME,
          pass: process.env.SENGRID_PASSWORD,
        },
      });
    } else {
      const nodemailerOptions: SMTPTransport.Options = {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      };

      return nodemailer.createTransport(nodemailerOptions);
    }
  }

  async send(subject: string, html?: string) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject + this.firstName,
      text: htmlToText(html),
      html,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome To Natours, ', html);
  }

  async sendResetPassword() {
    await this.send('Reset password token invailid after 10mins, ');
  }
}

export const sendEmail = async (options: { [key: string]: string }) => {
  // const transporter = nodemailer.createTransport(nodemailerOptions);
  // await transporter.sendMail(mailOptions);
};
