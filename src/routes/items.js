import express from "express";
import itemModel from "../models/item.js";
import userModel from "../models/user.js";
import currentUser from "../midleware/currentUser.js";
import requiredAuth from "../midleware/requiredAuth.js";
import validateRequest from "../midleware/validateRequest.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/item", async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Algo errado aconteceu: ${error}`);
  }
});

router.put(
  "/item",
  [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Introduza um id"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { name, id, confetionTime } = req.body;
      const { currentUser } = req;
      const user = await userModel.findById(currentUser.id);
      if (!user) {
        return res.status(400).send("Utilizador não encontrado");
      }
      if (user.permission !== "admin") {
        return res.status(400).send("Não tem permissão para fazer isto");
      }
      const item = await itemModel.findById(id);
      if (!item) {
        return res.status(400).send("Tipo de produto não encontrado");
      }
      item.set({
        name: name || item.name,
        confetionTime: confetionTime || item.confectionTime,
        updated_at: Date.now(),
      });
      await item.save();

      res.status(200).send(item);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo de errado aconteceu: ${error}`);
    }
  }
);

router.post(
  "/item",
  [
    body("name")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Introduza um nome"),

    body("confetionTime")
      .notEmpty()
      .withMessage("Introduza um tempo de confeção"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { type, name, confetionTime } = req.body;
      const { currentUser } = req;
      const user = await userModel.findById(currentUser.id);
      if (!user) {
        return res.status(400).send("Utilizador não encontrado");
      }
      if (user.permission !== "admin") {
        return res.status(400).send("Não tem permissão para fazer isto");
      }

      const itemType = new itemModel({
        type: type,
        name: name,
        confetionTime: confetionTime,
        created_at: Date.now(),
      });
      await itemType.save();

      res.status(200).send(itemType);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo errado aconteceu: ${error}`);
    }
  }
);

// router.delete(
//   "/products",
//   [
//     body("id")
//       .trim()
//       .isLength({ min: 1 })
//       .notEmpty()
//       .withMessage("Provide a id"),
//   ],
//   validateRequest,
//   requiredAuth,
//   async (req, res) => {
//     try {
//       const { id } = req.body;

//       const user = await userModel.findById(req.currentUser.id);
//       if (!user) {
//         return res.status(400).send("User not found");
//       }
//       if (user.permission === "view") {
//         return res.status(400).send("You are not authorized to do this");
//       }
//       const product = await itemModel.findById(id);
//       if (!product) {
//         return res.status(400).send("Product not found");
//       }
//       const outlet = await outletModel.find({ products: id });

//       if (outlet) {
//         return res.status(400).send("Product is associated with an outlet");
//       }

//       await product.remove();
//       res.status(200).send(product);
//     } catch (error) {
//       console.log(error);
//       res.status(500).send(`Something wrong happened: ${error}`);
//     }
//   }
// );

export { router as itemRouter };

