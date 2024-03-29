import cookieSession from "cookie-session";

import bodyParser from "body-parser";

import express from "express";

import cors from "cors";

import "dotenv/config.js";

import { itemRouter } from "./routes/items.js";
import { orderRouter } from "./routes/orders.js";
import { userRouter } from "./routes/users.js";

const app = express();
const router = express.Router();
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(cors());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

router.use(userRouter);
router.use(orderRouter);

router.use(itemRouter);

app.use("/api/", router);

app.all("*", async (req, res) => {
  res.send("Index, /BAD_URL, route don't exist in Auth");
});

export { app };
