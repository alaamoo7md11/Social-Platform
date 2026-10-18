import { roles } from "../../DB/models/user_model.js";

export const endpoints = {
  createComment: [roles.user],
  updateComment: [roles.user],
  deleteComment: [roles.admin, roles.user],
  getComments: [roles.admin, roles.user],
  likeComment: [roles.user],
  addReply: [roles.user],
  hardDelete: [roles.admin, roles.user],
};
