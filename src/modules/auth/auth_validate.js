import joi from "joi";
import { genders } from "../../DB/models/user_model.js";
export const sendOtp = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();
export const registerSchema = joi
  .object({
    email: joi.string().email().required(),
    userName: joi.string().max(15).min(5).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    phone: joi.string().required(),
    gender: joi.string().valid(...Object.values(genders)),
    otp: joi.string().length(6).required(),
  })
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();
export const forgetPassword = joi.object({
  email: joi.string().email().required(),
});
export const resetPassword = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
export const newAccess = joi
  .object({
    refresh_token: joi.string().required(),
  })
  .required();
export const loginWithGmail = joi
  .object({
    idToken: joi.string().required(),
  })
  .required();
