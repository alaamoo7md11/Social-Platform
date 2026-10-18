import Post from "../../DB/models/post.model.js";
import User from "../../DB/models/user_model.js";

export const getAll = async (req, res, next) => {
  const result = await Promise.all([Post.find(), User.find()]);
  return res.status(201).json({ success: true, results: { result } });
};
export const changeRole = async (req, res, next) => {
  const { userId, role } = req.body;
   await User.findByIdAndUpdate({ _id: userId }, { role });
  return res
    .status(200)
    .json({ success: true, Message: "update role successfully!" });
};
