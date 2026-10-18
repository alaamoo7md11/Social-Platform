import { Router } from "express";
import auth from "../../middelware/auth_middelware.js";
import { isAuthorization } from "../../middelware/authorization_middelware.js";
import { endpoints } from "./post.endpoints.js";
import { uploadCloud } from "../../Utils/config/multer.cloudinary.js";
import validate from "../../middelware/validate_middelware.js";
import * as postSchema from "./post.validation.js";
import { asyncHandler } from "../../Utils/async_handler/asyncHandker.js";
import * as postService from "./post.service.js";
import commentRouter from "../comment/comment.controller.js";
const router = Router({ caseSensitive: false, strict: false });
router.use("/:postId/comment", commentRouter);
router.post(
  "/",
  auth,
  isAuthorization(...endpoints.createPost),
  uploadCloud().array("images"),
  validate(postSchema.createPost),
  asyncHandler(postService.createPost),
);
router.patch(
  "/:id",
  auth,
  isAuthorization(...endpoints.updatePost),
  uploadCloud().array("images"),
  validate(postSchema.updatePost),
  asyncHandler(postService.updatePost),
);
router.patch(
  "/:id/delete",
  auth,
  isAuthorization(...endpoints.freezePost),
  validate(postSchema.freezePost),
  asyncHandler(postService.freezePost),
);
router.patch(
  "/:id/unfreeze",
  auth,
  isAuthorization(...endpoints.unfreezePost),
  validate(postSchema.unfreezePost),
  asyncHandler(postService.unfreezePost),
);
router.get(
  "/:id",
  auth,
  isAuthorization(...endpoints.getPost),
  validate(postSchema.getPost),
  asyncHandler(postService.getPost),
);
router.get(
  "/all/active",
  auth,
  isAuthorization(...endpoints.getAllPost),
  asyncHandler(postService.getAllPost),
);
router.get(
  "/all/freezed",
  auth,
  isAuthorization(...endpoints.getAllFreezedPost),
  asyncHandler(postService.getAllFreezedPost),
);

router.patch(
  "/:id/like-unlike",
  auth,
  isAuthorization(...endpoints.likePost),
  validate(postSchema.likePost),
  asyncHandler(postService.likePost),
);
export default router;
