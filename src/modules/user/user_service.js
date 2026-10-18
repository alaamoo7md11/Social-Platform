import cloudinary from "../../Utils/config/cloud.config.js";
import User from "../../DB/models/user_model.js";
import { emailEmitter } from "../../Utils/emails/email_Emitter.js";
import { subjects } from "../../Utils/emails/send_Emails.js";
import { updateEmailTemplate } from "../../Utils/emails/templateHTML.js";
import { decrypt, encrypt } from "../../Utils/encrption/encraption.js";
import { compare, hash } from "../../Utils/hashing/hash.js";
import { createToken, readToken } from "../../Utils/token/token.js";
import {
  defaultSecure_url,
  defaultPublic_id,
} from "../../DB/models/user_model.js";
export const profile = async (req, res, next) => {
  const { user } = req;
  // dec phone
  const phone = decrypt({ cipherText: user.phone });
  return res.status(200).json({ sucsses: true, result: { ...user, phone } });
};
export const updateProfile = async (req, res, next) => {
  const { user } = req;
  if (req.body.phone) {
    req.body.phone = encrypt({ planetext: req.body.phone });
  }
  const updateUser = await User.findByIdAndUpdate(
    user._id,
    { ...req.body },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  return res.status(200).json({ success: true, results: { updateUser } });
};
export const updatePassword = async (req, res, next) => {
  const { oldPassword, password } = req.body;
  const comparePassword = compare({
    plantxt: oldPassword,
    hash: req.user.password,
  });
  if (!comparePassword)
    return next(new Error("Error Password"), { cause: 400 });

  const hashPassword = hash({ plantxt: password });
  await User.findByIdAndUpdate(
    req.user._id,
    { password: hashPassword, ChangeAt: Date.now() },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  return res.status(200).json({
    success: true,
    message: "change Password successfully!!!",
  });
};
export const deleteUser = async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      isDelete: true,
      ChangeAt: Date.now(),
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  return res.status(200).json({
    success: true,
    message: "delete account",
  });
};
export const updateEmail = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findById(req.user._id);
  if (!compare({ plantxt: password, hash: user.password }))
    return next(new Error("invalid password", { cause: 400 }));
  user.tempEmail = email;
  await user.save();
  const token = createToken({ payload: { email, id: user._id } });
  const link = `http://localhost:5000/user/verify-email/${token}`;
  emailEmitter.emit("sendEmails", {
    email,
    subject: subjects.updateEmail,
    template: updateEmailTemplate,
    data: { link },
  });
  return res.status(200).json({
    success: true,
    message: "send email successfully",
  });
};
export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;
  const { email, id } = readToken({ token });
  const user = await User.findById(id);
  if (!user) return next(new Error("user not found"));
  user.email = user.tempEmail;
  user.tempEmail = null;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "email change successfully",
  });
};
// export const profilePicture = async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       profilePicture: req.file.path,
//     },
//     {
//       returnDocument: "after",
//     },
//   );
//   return res.status(200).json({ success: true, result: { user } });
// };
export const profilePicture = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `users/${user._id}/profilePicture` },
  );
  user.profilePicture = { secure_url, public_id };
  await user.save();
  return res.status(200).json({ success: true, result: { user } });
};
export const coverPicture = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const uploads = await Promise.all(
    req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: `users/${user._id}/coverPicture`,
      }),
    ),
  );
  user.coverPicture = uploads.map((file) => file.secure_url);
  await user.save();
  return res.status(200).json({ success: true, result: user });
};

// export const deleteProfilePicture = async (req, res, next) => {
//   const user = await User.findById(req.user._id);
//   const imagePath = path.resolve(".", user.profilePicture);
//   fs.unlinkSync(imagePath);
//   // user.profilePicture = defaultProfilePicture;
//   await user.save();
//   return res.status(200).json({ success: true, result: { user } });
// };
export const deleteProfilePicture = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const results = await cloudinary.uploader.destroy(
    user.profilePicture.public_id,
  );
  if (results.result == "ok") {
    user.profilePicture = {
      public_id: defaultPublic_id,
      secure_url: defaultSecure_url,
    };
    await user.save();
  }
  return res.status(200).json({ success: true, result, user });
};