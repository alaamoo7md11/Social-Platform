import { roles } from "../../DB/models/user_model.js";
export const endPoint = {
  getAll: [roles.admin, roles.superAdmin],
  changeRole: [roles.admin, roles.superAdmin],
};
