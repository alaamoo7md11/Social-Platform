import mongoose from "mongoose";
const connectDB = async () => {
  await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => {
      console.log("database connection !!!");
    })
    .catch((error) => {
      console.log({ error: error.message });
    });
};
export default connectDB;
