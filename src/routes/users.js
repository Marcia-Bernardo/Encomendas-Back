import express from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import userModel from "../models/user.js";
import { Password } from "../lib/password.js";
import validateRequest from "../midleware/validateRequest.js";
import currentUser from "../midleware/currentUser.js";
import requiredAuth from "../midleware/requiredAuth.js";
const router = express.Router();

router.post(
  "/user",
  [
    body("username")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Introduza um username"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Introduza uma password"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const existUser = await userModel.findOne({ username });

      if (existUser) {
        return res.status(400).send("Utilizador já existe");
      }
      const newUser = new userModel({
        username,
        password,
        created_at: Date.now(),
      });
      await newUser.save();

      res.status(200).send("Utilizador criado com sucesso");
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo de errado aconteceu: ${error}`);
    }
  }
);

router.put(
  "/user",
  [
    body("username")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Introduza um username"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Introduza uma password"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { username, permission } = req.body;
      const user = await userModel.findOne({ username });

      if (!user) {
        return res.status(400).send("Utilizador não encontrado");
      }
      if (user.permission !== "admin") {
        return res.status(400).send("Não tem permissão para fazer isto");
      }
      user.set({ permission, updated_at: Date.now() });
      await user.save();

      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo errado aconteceu: ${error}`);
    }
  }
);

router.delete("/user", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(400).send("Utiliazdor não encontrado");
    }
    if (user.permission !== "admin") {
      return res.status(400).send("Não tem permissão para fazer isto");
    }
    await user.delete();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.post(
  "/login",
  [
    body("username")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Introduza um username"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Introfuza uma password"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await userModel.findOne({ username });
      if (!existingUser) {
        return res.status(401).send("Utilizador não encontrado");
      }
      const passwordsMatch = await Password.compare(
        existingUser.password,
        password
      );
      if (!passwordsMatch) {
        return res.status(401).send("Password errada");
      }

      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          username: existingUser.username,
        },
        process.env.SECRET
      );

      req.session = { jwt: userJwt };
      res.status(200).send(existingUser);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo errado aconteceu: ${error}`);
    }
  }
);

router.get(
  "/currentUser",
  currentUser,
  requiredAuth,
  validateRequest,
  async (req, res) => {
    try {
      const { currentUser } = req;
      const existingUser = await userModel.findOne({ _id: currentUser.id });
      if (!existingUser) {
        return res.status(401).send("Utiliador não encontrado");
      }

      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          username: existingUser.username,
        },
        process.env.SECRET
      );

      req.session = { jwt: userJwt };
      res.status(200).send(existingUser);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo errado aconteceu: ${error}`);
    }
  }
);

export { router as userRouter };

