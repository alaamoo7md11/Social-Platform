import joi from "joi";
import { isValidObjectId } from "../../middelware/validate_middelware.js";
import { roles } from "../../DB/models/user_model.js";

export const changeRole = joi
  .object({
    userId: joi.custom(isValidObjectId).required(),
    role: joi
      .string()
      .valid(...Object.values(roles))
      .required(),
  })
  .required();
