import { Router } from "express";
import * as service from "./auth_service.js";
import * as authValidate from "./auth_validate.js";
import validate from "../../middelware/validate_middelware.js";
import { asyncHandler } from "../../Utils/async_handler/asyncHandker.js";
const router = Router({ caseSensitive: false, strict: false });
router.post(
  "/verify",
  validate(authValidate.sendOtp),
  asyncHandler(service.sendOtp),
);
router.post(
  "/register",
  validate(authValidate.registerSchema),
  asyncHandler(service.register),
);
router.post("/login", asyncHandler(service.login));
router.post(
  "/forget-password",
  validate(authValidate.forgetPassword),
  asyncHandler(service.forgetPassword),
);
router.post(
  "/reset-password",
  validate(authValidate.resetPassword),
  asyncHandler(service.resetPassword),
);
router.post(
  "/new-access",
  validate(authValidate.newAccess),
  asyncHandler(service.newAccess),
);
router.post(
  "/loginWithGmail",
  validate(authValidate.loginWithGmail),
  asyncHandler(service.loginWithGmail),
);
export default router;
