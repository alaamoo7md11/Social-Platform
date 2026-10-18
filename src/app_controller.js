import connectDB from "./DB/connection.js";
import errorHandler from "./Utils/error/global_error.js";
import authRouter from "./modules//auth/auth_controller.js";
import userRouter from "./modules//user/user_controller.js";
import postRouter from "./modules/post/post.controller.js";
import commentRouter from "./modules/comment/comment.controller.js";
import adminRouter from "./modules/admin/admin.controller.js";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
const bootstrap = async (app, express) => {
  app.use(cors());
  // const whitelist = ["http://127.0.0.1/3000", "http://127.0.0.1/3500"]; //for ex
  // app.use((req, res, next) => {
  //   const origin = req.header("origin");
  //   if (!whitelist.includes(origin)) {
  //     return next(new Error("blocked by cors"));
  //   }
  //   res.setHeader("Access-Control-Allow-Origin", origin);
  //   res.setHeader("Access-Control-Allow-Headers", "*");
  //   res.setHeader("Access-Control-Allow-Methods", "*");
  //   res.setHeader("Access-Control-Allow-Private-Network", "true");
  //   return next();
  // });
  app.use("/uploads", express.static("uploads"));

  await connectDB();

  app.use(
    morgan((tokens, req, res) => {
      const status = Number(tokens.status(req, res));

      const statusColor =
        status >= 500
          ? chalk.red
          : status >= 400
            ? chalk.yellow
            : status >= 300
              ? chalk.cyan
              : chalk.green;

      return [
        chalk.gray(tokens.method(req, res)),
        chalk.white(tokens.url(req, res)),
        statusColor(status),
        chalk.blue(`${tokens["response-time"](req, res)} ms`),
      ].join(" | ");
    }),
  );
  app.use(express.json());
  
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/admin", adminRouter);
app.get("/", (req, res) => res.json({ success: true, message: "Social Platform API is running" }));
  app.use(errorHandler);
};
export default bootstrap;
