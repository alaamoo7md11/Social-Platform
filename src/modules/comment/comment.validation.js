import joi from "joi";
import {
  fileObj,
  isValidObjectId,
} from "../../middelware/validate_middelware.js";

export const createComment = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: joi.object(fileObj),
  })
  .or("text", "file");
export const updateComment = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: joi.object(fileObj),
  })
  .or("text", "file");
export const deleteComment = joi.object({
  id: joi.custom(isValidObjectId).required(),
});
export const getComments = joi.object({
  postId: joi.custom(isValidObjectId).required(),
});
export const likeComment = joi.object({
  id: joi.custom(isValidObjectId).required(),
});
export const addReply = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    postId: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: joi.object(fileObj),
  })
  .or("file", "text");
export const hardDelete = joi.object({
  id: joi.custom(isValidObjectId).required(),
});
