import express from "express";
import orderLineModel from "../models/orderLine.js";
import userModel from "../models/user.js";
import currentUser from "../midleware/currentUser.js";
import requiredAuth from "../midleware/requiredAuth.js";
import validateRequest from "../midleware/validateRequest.js";
import { body } from "express-validator";
const router = express.Router();

router.put(
  "/orderLine",
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
      const { qtd, id } = req.body;

      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res.status(400).send("Utilizador não encontrado");
      }
      if (user.permission !== "admin") {
        return res.status(400).send("Não tem permissão para fazer isto");
      }
      const orderLine = await orderLineModel.findById(id);
      if (!orderLine) {
        return res.status(400).send("Produto não encontrado");
      }
      orderLine.set({
        qtd: qtd || orderLine.qtd,

        updated_at: Date.now(),
      });
      await orderLine.save();

      res.status(200).send(orderLine);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Algo errado aconteceu: ${error}`);
    }
  }
);

router.post(
  "/orderLine",
  [
    body("qtd").notEmpty().withMessage("Introduza uma quantidade"),
    body("itemId").notEmpty().withMessage("Introduza um item"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { qtd, itemId } = req.body;

      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res.status(400).send("Utilizador não encontrado");
      }
      if (user.permission === "view") {
        return res.status(400).send("Não tem permissão para fazer isto");
      }

      const orderLine = new orderLineModel({
        qtd: qtd,
        item: itemId,
        created_at: Date.now(),
      });
      await orderLine.save();

      res.status(200).send(orderLine);
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

export { router as orderLineRouter };

