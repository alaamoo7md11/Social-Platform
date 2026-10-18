import { Router } from "express";
import auth from "../../middelware/auth_middelware.js";
import { isAuthorization } from "../../middelware/authorization_middelware.js";
import { endpoints } from "./comment.endpoints.js";
import { uploadCloud } from "../../Utils/config/multer.cloudinary.js";
import validate from "../../middelware/validate_middelware.js";
import * as commentSchema from "../comment/comment.validation.js";
import { asyncHandler } from "../../Utils/async_handler/asyncHandker.js";
import * as commentService from "./comment.service.js";
const router = Router({ mergeParams: true });
router.post(
  "/",
  auth,
  isAuthorization(...endpoints.createComment),
  uploadCloud().single("images"),
  validate(commentSchema.createComment),
  asyncHandler(commentService.createComment),
);
router.patch(
  "/:id",
  auth,
  isAuthorization(...endpoints.updateComment),
  uploadCloud().single("images"),
  validate(commentSchema.updateComment),
  asyncHandler(commentService.updateComment),
);
router.patch(
  "/:id/delete",
  auth,
  isAuthorization(...endpoints.deleteComment),
  validate(commentSchema.deleteComment),
  asyncHandler(commentService.deleteComment),
);
router.get(
  "/:postId",
  auth,
  isAuthorization(...endpoints.getComments),
  validate(commentSchema.getComments),
  asyncHandler(commentService.getComments),
);
router.patch(
  "/:id/like-comment",
  auth,
  isAuthorization(...endpoints.likeComment),
  validate(commentSchema.likeComment),
  asyncHandler(commentService.likeComment),
);

router.post(
  "/:id",
  auth,
  isAuthorization(...endpoints.addReply),
  uploadCloud().single("images"),
  validate(commentSchema.addReply),
  asyncHandler(commentService.addReply),
);
router.delete(
  "/:id",
  auth,
  isAuthorization(...endpoints.hardDelete),
  validate(commentSchema.hardDelete),
  asyncHandler(commentService.hardDelete),
);
export default router;
