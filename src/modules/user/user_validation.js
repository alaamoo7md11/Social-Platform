import Joi from "joi";
import { genders } from "../../DB/models/user_model.js";
export const updateschema = Joi.object({
  userName: Joi.string().min(5).max(20),
  gender: Joi.string().valid(...Object.values(genders)),
  phone: Joi.string(),
}).required();
export const updatePassword = Joi.object({
  oldPassword: Joi.string().required(),
  password: Joi.string()
    .not(Joi.ref("oldPassword"))
    .messages({
      "any.invalid": "New password must be different from old password",
    })
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
}).required();
export const updateEmail = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).required();
