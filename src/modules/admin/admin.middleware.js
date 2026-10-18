import User, { roles } from "../../DB/models/user_model.js";

export const canChangeRole = async (req, res, next) => {
  const allRoles = Object.values(roles);
  const userReq = req.user;
  const targetUser = await User.findById(req.body.userId);
  const userReqRole = userReq.role;
  const targetUserRole = targetUser.role;
  const userReqIndex = allRoles.indexOf(userReqRole);
  const targetUserIndex = allRoles.indexOf(targetUserRole);
  const canChange = userReqIndex < targetUserIndex;
  if (!canChange) return next(new Error("cannot change its role"));
  return next();
};
