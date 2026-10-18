import Post from "../../DB/models/post.model.js";
import cloudinary from "../../Utils/config/cloud.config.js";
import Comment from "../../DB/models/comment.model.js";
import { roles } from "../../DB/models/user_model.js";
export const createComment = async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) return next(new Error("post not found ", { cause: 404 }));
  let image;
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `socialAPP/${post.user}/posts/${post.cloudFolder}` },
    );
    image = { public_id, secure_url };
  }
  const comment = await Comment.create({
    text,
    image,
    user: req.user._id,
    post: postId,
  });
  return res.status(201).json({ success: true, result: { comment } });
};
export const updateComment = async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;
  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) return next(new Error("Comment not found", { cause: 404 }));
  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post) return next(new Error("post not found", { cause: 404 }));
  if (comment.user.toString() != req.user._id.toString())
    return next(new Error("Not authoraization", { cause: 404 }));
  let image;
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `socialAPP/${post.user}/posts/${post.cloudFolder}` },
    );
    image = { public_id, secure_url };
    if (comment?.image?.public_id) {
      await cloudinary.uploader.destroy(comment.image?.public_id);
    }
    comment.image = image;
  }
  comment.text = text ? text : comment.text;
  await comment.save();
  return res.status(201).json({ success: true, result: { comment } });
};
export const deleteComment = async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) return next(new Error("Comment not found", { cause: 404 }));
  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post) return next(new Error("post not found", { cause: 404 }));
  const postOwner = post.user.toString() == req.user._id.toString();
  const commentOwner = comment.user.toString() == req.user._id.toString();
  const admin = req.user.role == roles.admin;
  if (!postOwner && !commentOwner && !admin)
    return next(new Error("not authorization", { cause: 403 }));
  comment.isDeleted = true;
  comment.deletedBy = req.user._id;
  return res.status(201).json({ success: true, result: { comment } });
};
export const getComments = async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) return next(new Error("post not found", { cause: 404 }));
  const comment = await Comment.find({
    post: postId,
    isDeleted: false,
    commentReply: { $exists: false },
  }).populate("replis");
  if (!comment) return next(new Error("Comment not found", { cause: 404 }));
  return res.status(200).json({ success: true, result: { comment } });
};
export const likeComment = async (req, res, next) => {
  const { id } = req.params;
  const user_id = req.user._id;
  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) return next(new Error("comment not found", { cause: 404 }));
  const like = comment.likes.find(
    (user) => user.toString() == user_id.toString(),
  );
  if (!like) {
    comment.likes.push(user_id);
  } else {
    comment.likes = comment.likes.filter(
      (user) => user.toString() != user_id.toString(),
    );
  }
  await comment.save();
  return res.status(200).json({ success: true, result: { comment } });
};
export const addReply = async (req, res, next) => {
  const { postId, id } = req.params;
  const comment = await Comment.findOne({
    _id: id,
    post: postId,
    isDeleted: false,
  });
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) return next(new Error("post not found ", { cause: 404 }));
  let image;
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `socialAPP/${post.user}/posts/${post.cloudFolder}/${comment._id}`,
      },
    );
    image = { public_id, secure_url };
  }
  const reply = await Comment.create({
    ...req.body,
    image,
    user: req.user._id,
    post: postId,
    commentReply: comment._id,
  });
  return res.status(201).json({ success: true, result: { reply } });
};
export const hardDelete = async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) return next(new Error("Comment not found", { cause: 404 }));
  const post = await Post.findById(comment.post);
  if (!post) return next(new Error("post not found", { cause: 404 }));
  const postOwner = post.user.toString() == req.user._id.toString();
  const commentOwner = comment.user.toString() == req.user._id.toString();
  const admin = req.user.role == roles.admin;
  if (!postOwner && !commentOwner && !admin)
    return next(new Error("not authorization", { cause: 403 }));
  await comment.deleteOne();
  return res
    .status(201)
    .json({ success: true, message: "comment deleted successfully!" });
};
