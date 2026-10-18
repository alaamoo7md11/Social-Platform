import express from "express";
import bootstrap from "./src/app_controller.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
await bootstrap(app, express);
if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
export default app;