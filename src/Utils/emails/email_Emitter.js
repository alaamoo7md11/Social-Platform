import { EventEmitter } from "events";
import sendEmails from "./send_Emails.js";
export const emailEmitter = new EventEmitter();
emailEmitter.on("sendEmails", async ({ email, subject, template, data }) => {
  await sendEmails({
    to: email,
    subject,
    html: template(data),
  });
});
