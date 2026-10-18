import { model, Schema } from "mongoose";
import { hash } from "../../Utils/hashing/hash.js";
// export const defaultProfilePicture =
//   "uploads/defaultProfilePicture/defaultProfilePicture.png";
export const defaultPublic_id = "defaultProfilePicture";
export const defaultSecure_url =
  "https://res.cloudinary.com/hqn08tyg/image/upload/v1791088100/defaultProfilePicture.png";
export const genders = {
  male: "male",
  female: "female",
};
export const roles = {
  superAdmin: "superadmin",
  admin: "admin",
  user: "user",
};
export const providers = {
  system: "system",
  google: "google",
};
// schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "email exists"],
      lowercase: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providers.system ? true : false;
      },
    },
    userName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 15,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(genders),
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.user,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    ChangeAt: Date,
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.system,
    },
    tempEmail: {
      type: String,
      default: null,
    },
    // profilePicture: {
    //   type: String,
    //   default: defaultProfilePicture,
    // },
    coverPicture: [String],
    profilePicture: {
      public_id: { type: String, default: defaultPublic_id },
      secure_url: {
        type: String,
        default: defaultSecure_url,
      },
    },
  },
  { timestamps: true },
);
// hook
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = hash({ plantxt: this.password });
  }
});
// model
const User = model("User", userSchema);
export default User;
