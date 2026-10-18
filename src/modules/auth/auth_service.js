import User, { providers } from "../../DB/models/user_model.js";
import { compare, hash } from "../../Utils/hashing/hash.js";
import { createToken, readToken } from "../../Utils/token/token.js";
import { encrypt } from "../../Utils/encrption/encraption.js";
import { emailEmitter } from "../../Utils/emails/email_Emitter.js";
import Randomstring from "randomstring";
import OTP from "../../DB/models/otp.model.js";
import { subjects } from "../../Utils/emails/send_Emails.js";
import { OAuth2Client } from "google-auth-library";
import { activateTemplate, forgotPasswordOtpTemplate } from "../../Utils/emails/templateHTML.js";
export const register = async (req, res, next) => {
  // data
  const { email, userName, password, phone, otp } = req.body;
  const verifyOtp = await OTP.findOne({ email, otp });
  if (!verifyOtp) return next(new Error("invalid otp", { cause: 400 }));
  // create
  const user = await User.create({
    email,
    userName,
    password, //hashing
    phone: encrypt({ planetext: phone }), //encryption
    isActive: true,
  });
  // check email
  return res.status(201).json({
    success: true,
    resulte: { user },
  });
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  // user not found
  const user = await User.findOne({ email });
  if (!user) return next(new Error("user not found", { cause: 400 }));
  if (!user.isActive)
    return next(new Error("you must acctivate account", { cause: 400 }));

  if (!compare({ plantxt: password, hash: user.password }))
    return next(new Error("invalid password", { cause: 400 }));

  if (user.isDelete == true) {
    user.isDelete = false;
    await user.save();
  }
  return res.status(200).json({
    success: true,
    message: "login user",
    access_token: createToken(
      { payload: { id: user._id, email: user.email } },
      { options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE } },
    ),
    refresh_token: createToken(
      { payload: { id: user._id, email: user.email } },
      { options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE } },
    ),
  });
};
export const sendOtp = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) return next(new Error("user is exists", { cause: 400 }));
  const otp = Randomstring.generate({
    length: 6,
    charset: "alphanumeric",
  });
  await OTP.create({ email, otp });
  emailEmitter.emit("sendEmails", {
    email,
    subject: subjects.register,
    template: activateTemplate,
    data: { otp },
  });
  return res
    .status(200)
    .json({ success: true, message: "opt send successfully" });
};
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email, isActive: true, isDelete: false });
  if (!user) return next(new Error("User not found", { cause: 400 }));
  const otp = Randomstring.generate({ length: 6, charset: "alphanumeric" });
  await OTP.create({ otp, email });
  emailEmitter.emit("sendEmails", {
    email,
    subject: subjects.forgetPassword,
    template: forgotPasswordOtpTemplate,
    data: { otp },
  });
  return res
    .status(201)
    .json({ success: true, message: "otp created successfully" });
};
export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email, isActive: true, isDelete: false });
  if (!user) return next(new Error("User Not Found", { cause: 400 }));
  const findOtp = await OTP.findOne({ otp });
  if (!findOtp) return next(new Error("invalid otp", { cause: 400 }));
  user.password = password;
  await user.save();
  return res
    .status(201)
    .json({ success: true, message: "password updated successfully" });
};
export const newAccess = async (req, res, next) => {
  const { refresh_token } = req.body;
  const payload = readToken({ token: refresh_token });
  const user = await User.findById(payload.id);
  if (!user) return next(new Error("User not found", { cause: 400 }));
  const newAccess_token = createToken(
    { payload: { id: user._id, email: user.email } },
    { options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE } },
  );
  return res.status(200).json({ success: true, access_token: newAccess_token });
};
export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const userData = await verify();
  console.log(userData);
  const { email_verified, email, name, picture } = userData;
  if (!email_verified) return next(new Error("email invalid", { cause: 400 }));
  const user = User.create({
    email,
    userName: name,
    isActive: true,
    provider: providers.google,
  });
  return res.status(200).json({
    success: true,
    message: "login user successfully!",
    access_token: createToken(
      { payload: { id: user._id, email: user.email } },
      { options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE } },
    ),
    refresh_token: createToken(
      { payload: { id: user._id, email: user.email } },
      { options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE } },
    ),
  });
};
