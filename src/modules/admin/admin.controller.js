import { Router } from "express";
import auth from "../../middelware/auth_middelware.js";
import { isAuthorization } from "../../middelware/authorization_middelware.js";
import { endPoint } from "./admin.endpoints.js";
import { asyncHandler } from "../../Utils/async_handler/asyncHandker.js";
import * as adminService from "./admin.service.js";
import validate from "../../middelware/validate_middelware.js";
import * as adminSchema from "./admin.validation.js";
import { canChangeRole } from "./admin.middleware.js";
const router = Router();
// get all users and posts
router.get(
  "/",
  auth,
  isAuthorization(...endPoint.getAll),
  asyncHandler(adminService.getAll),
);
router.patch(
  "/role",
  auth,
  isAuthorization(...endPoint.changeRole),
  validate(adminSchema.changeRole),
  canChangeRole,
  asyncHandler(adminService.changeRole),
);
export default router;
