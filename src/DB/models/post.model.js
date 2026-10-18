import { model } from "mongoose";
import { Types } from "mongoose";
import { Schema } from "mongoose";

// Schema
const postSchema = new Schema(
  {
    text: {
      type: String,
      minlength: 3,
      required: function () {
        return this.images.length ? false : true;
      },
    },
    images: [
      {
        public_id: String,
        secure_url: String,
      },
    ],
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    cloudFolder: {
      type: String,
      unique: true,
      required: function () {
        return this.images.length ? true : false;
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});
const Post = model("Post", postSchema);
export default Post;
