import joi from "joi";
import { Types } from "mongoose";
const validate = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files?.length) {
      data.file = req.file || req.files;
    }
    const result = schema.validate(data, { abortEarly: false });
    console.log(result);

    if (result.error) {
      const messageList = result.error.details.map((obj) => obj.message);
      return next(new Error(messageList, { cause: 400 }));
    }
    return next();
  };
};
export const isValidObjectId = (value, helper) => {
  if (Types.ObjectId.isValid(value)) return true;
  return helper.message("invalid objectId!");
};

export const fileObj = {
  fieldname: joi.string().valid("images").required(),
  originalname: joi.string().required(),
  encoding: joi.string().required(),
  mimetype: joi.string().required(),
  size: joi.number().required(),
  destination: joi.string().required(),
  filename: joi.string().required(),
  path: joi.string().required(),
};
export default validate;
