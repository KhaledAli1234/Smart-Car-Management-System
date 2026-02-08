import { EventEmitter } from 'node:events';
import { sendEmail } from '../email/send.email';
import Mail from 'nodemailer/lib/mailer';
import { verifyEmail } from './verify.email.templates';
import { OtpEnum } from 'src/common/enums';

export const emailEvent = new EventEmitter();

interface IEmail extends Mail.Options {
  otp: string;
}

emailEvent.on(OtpEnum.ConfirmEmail, async (data: IEmail) => {
  try {
    data.subject = OtpEnum.ConfirmEmail;
    data.html = verifyEmail({
      otp: data.otp,
      title: data.subject,
    });

    await sendEmail(data);
  } catch (error) {
    console.error(`fail to send email`);
  }
});

emailEvent.on(OtpEnum.ResetPassword, async (data: IEmail) => {
  try {
    data.subject = OtpEnum.ResetPassword;
    data.html = verifyEmail({
      otp: data.otp,
      title: data.subject,
    });

    await sendEmail(data);
  } catch (error) {
    console.error(`fail to send email`);
  }
});

emailEvent.on('twoFactorOtp', async (data: IEmail) => {
  try {
    data.subject = 'Enable Request';
    data.html = verifyEmail({
      otp: data.otp,
      title: 'Two-Factor Authentication',
    });

    await sendEmail(data);
  } catch (error) {
    console.error(`fail to send email`);
  }
});

emailEvent.on('tags', async (data: IEmail) => {
  try {
    data.subject = data.subject || 'Tagged in a post';
    await sendEmail(data);
  } catch (error) {
    console.error(`fail to send tag email`);
  }
});
