import nodemailer from "nodemailer";
const sendEmails = async ({ to, subject, html }) => {
  // sender
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `Social Application <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
  return info.rejected.length == 0 ? true : false;
};
export const subjects = {
  register: "application run",
  forgetPassword: "creaete new password",
  updateEmail: "Update Email",
};
export default sendEmails;
