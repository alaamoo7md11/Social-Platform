import { nanoid } from "nanoid";
import Post from "../../DB/models/post.model.js";
import cloudinary from "../../Utils/config/cloud.config.js";
import { roles } from "../../DB/models/user_model.js";
export const createPost = async (req, res, next) => {
  const { text } = req.body;
  let images = [];
  let cloudFolder;
  if (req.files.length) {
    cloudFolder = nanoid();
    for (const file of req.files) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        { folder: `socialAPP/${req.user._id}/posts/${cloudFolder}` },
      );
      images.push({ public_id, secure_url });
    }
  }
  const post = await Post.create({
    text,
    images,
    cloudFolder,
    user: req.user._id,
  });
  return res.status(201).json({ success: false, result: { post } });
};
export const updatePost = async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;
  const post = await Post.findOne({ _id: id, user: req.user._id });
  if (!post) return next(new Error("post not found!!!", { cause: 404 }));
  let images = [];
  if (req.files.length) {
    for (const file of req.files) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `socialAPP/${req.user._id}/posts/${post.cloudFolder}`,
        },
      );
      images.push({ public_id, secure_url });
    }
    if (post.images.length) {
      for (const image of post.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
      post.images = images;
    }
  }
  post.text = text ? text : post.text;
  await post.save();
  return res.status(200).json({ success: false, result: { post } });
};
export const freezePost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return next(new Error("post not found!!!", { cause: 404 }));
  if (
    post.user.toString() == req.user._id.toString() ||
    req.user.role == roles.admin
  ) {
    post.isDeleted = true;
    post.deletedBy = req.user._id;
  }
  await post.save();
  return res.status(200).json({ success: false, result: { post } });
};
export const unfreezePost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(
    {
      _id: id,
      isDeleted: true,
      user: req.user._id,
    },
    {
      isDeleted: false,
      $unset: { deletedBy: 0 },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  if (!post) return next(new Error("Post not found", { cause: 404 }));
  return res.status(200).json({ success: true, result: { post } });
};
export const getPost = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id, isDeleted: false }).populate([
    {
      path: "user",
      select: "userName profilePicture.secure_url",
    },
    {
      path: "comments",
      match: { commentReply: { $exists: false }, isDeleted: false },

      populate: [
        { path: "user", select: "userName profilePicture.secure_url" },
        { path: "replis" },
      ],
    },
  ]);
  if (!post) return next(new Error("post not found!!!", { cause: 404 }));
  return res.status(200).json({ success: true, result: { post } });
};
export const getAllPost = async (req, res, next) => {
  let post;
  if (req.user.role == roles.admin) {
    post = await Post.find({
      isDeleted: false,
    }).populate([
      {
        path: "user",
        select: "userName profilePicture.secure_url",
      },
      { path: "comments" },
    ]);
  } else if (req.user.role == roles.user) {
    post = await Post.find({
      user: req.user._id,
      isDeleted: false,
    }).populate([
      {
        path: "user",
        select: "userName profilePicture.secure_url",
      },
      { path: "comments" },
    ]);
  }
  const count = await Post.countDocuments({
    user: req.user._id,
    isDeleted: false,
  });
  return res.status(200).json({ success: true, result: { count, post } });
};
export const getAllFreezedPost = async (req, res, next) => {
  let post;
  if (req.user.role == roles.admin) {
    post = await Post.find({
      isDeleted: true,
    }).populate({
      path: "user",
      select: "userName profilePicture.secure_url",
    });
  } else if (req.user.role == roles.user) {
    post = await Post.find({
      user: req.user._id,
      isDeleted: true,
    }).populate({
      path: "user",
      select: "userName profilePicture.secure_url",
    });
  }
  const count = await Post.countDocuments({
    user: req.user._id,
    isDeleted: true,
  });
  return res.status(200).json({ success: true, result: { count, post } });
};
export const likePost = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const post = await Post.findOne({ _id: id, isDeleted: false });
  if (!post) return next(new Error("Post not found", { cause: 404 }));
  const like = post.likes.find((user) => user.toString() == userId.toString());
  if (!like) {
    post.likes.push(userId);
  } else {
    post.likes = post.likes.filter(
      (user) => user.toString() != userId.toString(),
    );
  }
  await post.save();
  const populatePost = await Post.findOne({
    _id: id,
    isDeleted: false,
  }).populate({ path: "likes", select: "userName profilePicture.secure_url" });
  return res.status(200).json({ success: true, result: { populatePost } });
};
