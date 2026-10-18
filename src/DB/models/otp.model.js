import { model, Schema } from "mongoose";
// Schema
const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 });
// model
const OTP = model("OTP", otpSchema);
export default OTP;
