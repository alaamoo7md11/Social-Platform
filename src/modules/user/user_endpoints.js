import { roles } from "../../DB/models/user_model.js";
export const endpoints = {
  profile: [roles.user, roles.admin],
  update: [roles.user, roles.admin],
  updatePassword: [roles.user, roles.admin],
  deleteUser: [roles.user, roles.admin],
  updateEmail: [roles.user],
  shareProfile: [roles.user, roles.admin],
};
