import { roles } from "../../DB/models/user_model.js";

export const endpoints = {
  createPost: [roles.user],
  updatePost: [roles.user],
  freezePost: [roles.user, roles.admin],
  unfreezePost: [roles.user, roles.admin],
  getPost: [roles.admin, roles.user],
  getAllPost: [roles.admin, roles.user],
  getAllFreezedPost: [roles.admin, roles.user],
  likePost: [roles.user],
};
