import { Router } from "express";
import * as user from "./user_service.js";
import auth from "../../middelware/auth_middelware.js";
import { isAuthorization } from "../../middelware/authorization_middelware.js";
import { endpoints } from "./user_endpoints.js";
import validate from "../../middelware/validate_middelware.js";
import * as validateUser from "./user_validation.js";
import { asyncHandler } from "../../Utils/async_handler/asyncHandker.js";
import { fileValidation, upload } from "../../Utils/fileUpload/files.js";
import { uploadCloud } from "../../Utils/config/multer.cloudinary.js";
const router = Router({ caseSensitive: false, strict: false });
router.get(
  "/profile",
  auth,
  isAuthorization(...endpoints.profile),
  asyncHandler(user.profile),
);
router.put(
  "/update-profile",
  auth,
  isAuthorization(...endpoints.update),
  validate(validateUser.updateschema),
  asyncHandler(user.updateProfile),
);
router.put(
  "/changepassword",
  auth,
  isAuthorization(...endpoints.updatePassword),
  validate(validateUser.updatePassword),
  asyncHandler(user.updatePassword),
);
router.delete(
  "/",
  auth,
  isAuthorization(...endpoints.deleteUser),
  asyncHandler(user.deleteUser),
);
router.put(
  "/update-email",
  auth,
  isAuthorization(...endpoints.updateEmail),
  validate(validateUser.updateEmail),
  asyncHandler(user.updateEmail),
);
router.get("/verify-email/:token", asyncHandler(user.verifyEmail));
// router.post(
//   "/profile-picture",
//   auth,
//   upload(fileValidation.images, "uploads/user/profile-picture").single("image"), //single>>>req.file
//   asyncHandler(user.profilePicture),
// );
router.post(
  "/profile-picture",
  auth,
  uploadCloud().single("image"), //single>>>req.file
  asyncHandler(user.profilePicture),
);
router.post(
  "/cover-picture",
  auth,
  upload(fileValidation.images, "uploads/user/cover-picture").array("images"), //array>>>req.files
  asyncHandler(user.coverPicture),
);

// router.delete(
//   "/profile-picture",
//   auth,
//   asyncHandler(user.deleteProfilePicture),
// );
router.delete(
  "/profile-picture",
  auth,
  asyncHandler(user.deleteProfilePicture),
);
router.get(
  "/share-profile",
  auth,
  isAuthorization(...endpoints.shareProfile),
  asyncHandler(user.deleteProfilePicture),
);
export default router;
