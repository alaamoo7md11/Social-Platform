import { model, Types } from "mongoose";
import { Schema } from "mongoose";
import cloudinary from "../../Utils/config/cloud.config.js";
const commentSchema = new Schema(
  {
    post: {
      type: Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: function () {
        this.image ? false : true;
      },
    },
    image: {
      public_id: String,
      secure_url: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    commentReply: {
      type: Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
commentSchema.virtual("replis", {
  ref: "Comment",
  foreignField: "commentReply",
  localField: "_id",
});
commentSchema.post(
  "deleteOne",
  { query: false, document: true },
  async function (doc, next) {
    if (doc.image.secure_url) {
      await cloudinary.uploader.destroy(doc.image.public_id);
    }
    const commentReply = doc._id;
    const replies = await this.constructor.find({ commentReply });
    if (replies.length) {
      for (const reply of replies) {
        await reply.deleteOne();
      }
    }
    return next();
  },
);
const Comment = model("Comment", commentSchema);
export default Comment;