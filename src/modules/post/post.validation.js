import joi from "joi";
import {
  fileObj,
  isValidObjectId,
} from "../../middelware/validate_middelware.js";
export const createPost = joi
  .object({
    text: joi.string().min(3),
    file: joi.array().items(joi.object(fileObj)),
  })
  .or("text", "file");
export const updatePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    text: joi.string().min(3),
    file: joi.array().items(joi.object(fileObj)),
  })
  .or("text", "file");
export const freezePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();
export const unfreezePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();
  export const getPost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();
    export const likePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();