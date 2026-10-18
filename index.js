import express from "express";
import bootstrap from "./src/app_controller.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 5000;
await bootstrap(app, express);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
